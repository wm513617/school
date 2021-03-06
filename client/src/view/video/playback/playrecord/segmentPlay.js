/*
* 分段回放业务逻辑
*/
import { mapActions } from 'vuex'
import { gbQuery, getDownID, AV_NVRRECORD_LIST } from '../../../../http/video.api'
export default {
  data() {
    return {
      isSegment: false,
      segment: [],
      segNum: 4, // 分段画面
      segTime: ['00:00', '23:59'], // 分段时间段
      segStime: 0,
      segEtime: 0,
      recordList: {}
    }
  },
  computed: {
  },
  methods: {
    ...mapActions(['queryRecordlist']),
    chengeSegTime(time) {
      let activeTime = ''
      if (this.activeData && this.activeData.queryParam) {
        let time = this.activeData.queryParam.time || this.$moment(this.$refs.timeLine.now).unix() // 前端回放没存time 去时间轴拿当前的时间
        activeTime = new Date(time * 1000)
      }
      const date = activeTime || this.calendarTime || new Date()
      const t = time.split(':')
      date.setHours(t[0] || 0)
      date.setMinutes(t[1] || 0)
      date.setSeconds(t[2] || 0)
      return date.getTime()
    },
    // 生成分段时间
    getSegmentTime() {
      this.segment = []
      this.segStime = this.chengeSegTime(this.segTime[0])
      this.segEtime = this.chengeSegTime(this.segTime[1])
      const interval = (this.segEtime - this.segStime) / this.segNum
      for (let index = 0; index < this.segNum; index++) {
        this.segment.push({
          startTime: parseInt((this.segStime + interval * index) / 1000),
          endTime: parseInt((this.segStime + interval * (index + 1)) / 1000)
        })
      }
    },
    async segmentPlay() {
      let node = {}
      if (this.activeData) {
        if (this.activeData.queryParam) {
          let act = this.activeData.queryParam
          node = {
            _id: this.activeData.res,
            name: this.activeData.name,
            eid: {
              ip: act.devIp,
              cport: act.devPort
            },
            chan: act.channel,
            time: act.time || this.$moment(this.$refs.timeLine.now).unix() // 前端回放没存time 去时间轴拿当前的时间
          }
        } else {
          node = this.curNode
        }
      } else {
        node = this.curNode
      }
      // console.log(this.curNode, this.activeData)
      // const node = this.curNode
      // 判断是否为nvr、同步、包含nodeID
      if (this.isSync || node.nodeId) {
        return
      }
      this.CLEAR_RESOURCE()
      this.plugin.stopAll()
      if (!this.curNode.eid) {
        this.$Notice.warning({ desc: '请选择一个摄像头！', title: '警告' })
        return
      }
      const power = await this.getCameraPower(node._id)
      if (!power || !power.includes('playback')) {
        return this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
      }
      // 获取时间
      this.getSegmentTime()
      // 分屏
      this.screen(this.segNum)
      this.plugin.setShowscreen(this.segNum)
      if (this.isNVR) {
        // 前端回放 分段回放
        let queryObj = {
          channel: node.chan,
          devIp: node.eid.ip,
          devPort: node.eid.cport,
          eTime: parseInt(this.segEtime / 1000),
          sTime: parseInt(this.segStime / 1000),
          recordType: 'all',
          streamType: 'all',
          rowId: 1,
          rowCount: 50
        }
        let res = await AV_NVRRECORD_LIST(queryObj)
        if (res.data && res.data.recordInfo && res.data.recordInfo.length) {
          this.recordList = JSON.parse(JSON.stringify(res.data.recordInfo))
        } else {
          this.$Notice.warning({ desc: '查询无录像', title: '警告' })
        }
        let hasPlay = 0
        this.segment.forEach((item, i) => {
          // 过滤录像
          const record = this.frontEndFilte(this.$lodash.cloneDeep(this.recordList), item)
          let result = {
            node: this.curNode,
            res: node._id,
            name: node.name,
            queryParam: {
              ...queryObj,
              startTime: item.startTime,
              endTime: item.endTime,
              time: item.startTime,
              shareServer: this.curNode.shareServer
            },
            queryTime: {},
            ...record,
            total: res.data.total // 总条数 播放方法要
          }
          // 保存录像信息=>vuex
          this.SET_RESOURCE({
            index: i,
            item: result
          })
          if (record.recordInfo.length > 0) {
            this.plugins[i].syncPause()
            // const intime = this.findIntime(result)
            // console.log(intime, 'intimeintime')
            // 播放录像
            this.openPlugin(result, item.startTime, i)
            hasPlay++
          }
        })
        this.avtiveChange(0)
        hasPlay && this.changeTimeline()
        return
      }
      const queryParam = {
        nodeId: this.curNode.nodeId,
        childId: this.curNode.nodeId,
        devIp: node.eid.ip,
        devPort: node.eid.cport,
        channel: node.chan,
        streamType: 'all',
        startTime: parseInt(this.segStime / 1000),
        endTime: parseInt(this.segEtime / 1000),
        eventType: ['all'],
        typeName: '',
        typeContent: '',
        page: 1,
        rows: 50
      }
      // 检索录像
      this.centerPageQuery(queryParam, '', node).then(res => {
        res = JSON.parse(JSON.stringify(res))
        if (res === 'nodate' || res === 'fail' || !res.data.result.eventList[0]) {
          this.$Notice.warning({ desc: '查询无录像', title: '警告' })
        } else {
          // 设置日志
          this.setPlayLog({ ip: node.eid.ip, name: node.name })
          this.recordList = res.data.result
          let hasPlay = 0
          this.segment.forEach((item, i) => {
            // 过滤录像
            const record = this.filterBeyond(this.$lodash.cloneDeep(this.recordList), item)
            let result = {
              res: node._id,
              name: node.name,
              queryParam: {
                ...queryParam,
                startTime: item.startTime,
                endTime: item.endTime,
                time: item.startTime,
                shareServer: this.curNode.shareServer
              },
              queryTime: {},
              ...record
            }
            // 保存录像信息=>vuex
            this.SET_RESOURCE({
              index: i,
              item: result
            })
            if (record.eventList.length > 0) {
              this.plugins[i].syncPause()
              const intime = this.findIntime(result)
              // 播放录像
              this.openPlugin(result, intime, i)
              hasPlay++
            }
          })
          this.avtiveChange(0)
          hasPlay && this.changeTimeline()
        }
      })
    },
    // 过滤超出录像
    filterBeyond(record, {startTime, endTime}) {
      const list = []
      record.eventList.forEach(item => {
        const info = item.evtTblInfo || item // 没有 evtTblInfo 是国标
        if (info.startTime > endTime || info.endTime < startTime || info.startTime === info.endTime) {
          // 此录像不处理
        } else {
          info.startTime = info.startTime < startTime ? startTime : info.startTime
          info.endTime = info.endTime > endTime ? endTime : info.endTime
          list.push(item)
        }
      })
      return {
        ...record,
        eventList: list
      }
    },
    // 前端录像段过滤
    frontEndFilte(record, {startTime, endTime}) {
      const list = []
      record.forEach(item => {
        if (item.sTime > endTime || item.eTime < startTime || item.sTime === item.eTime) {
          // 此录像不处理
        } else {
          item.sTime = item.sTime < startTime ? startTime : item.sTime
          item.eTime = item.eTime > endTime ? endTime : item.eTime
          list.push(item)
        }
      })
      return {
        recordInfo: list
      }
    },
    // 中心回放查询逻辑
    async centerPageQuery(param, res, node) {
      try {
        let suc
        if (this.activeData.queryParam.childId) {
          // 中心国标回放
          let server = await getDownID(this.curNode.shareServer)
          if (server.status !== 200) {
            return 'fail'
          }
          server = server.data
          let queryGb = {
            gbPlaDevIp: this.curNode.gbPlaDevIp, // 设备ip,
            gbPlaDevPort: Number(this.curNode.gbPlaDevPort), // 设备端口,
            parentId: server.serverId, // 国标平台id,
            childId: this.curNode.nodeId, // 国标设备id,
            startTime: param.startTime, // 开始时间,
            endTime: param.endTime, // 结束时间,
            streamType: param.streamType, // 码流类型,
            recordType: param.eventType // 录像类型
          }
          suc = await gbQuery(queryGb).catch(() => 'fail')
          if (suc.data && suc.data.recordList) {
            suc = {
              data: {
                result: {
                  eventList: JSON.parse(JSON.stringify(suc.data.recordList)),
                  total: 0 // 不参与下面递归调用
                }
              }
            }
          } else {
            return 'nodata'
          }
        } else {
          suc = await this.queryRecordlist(param).catch(() => 'fail')
        }
        if (suc) {
          const result = suc
          if (result.data === 'have no data' || result.data === 'no data') {
            return 'nodata'
          } else if (!result.data.result) {
            return 'fail'
          }
          if (result.data.result.eventList) {
            if (res) {
              res.data.result.eventList = [...res.data.result.eventList, ...result.data.result.eventList]
              res.data.result.page = result.data.result.page
              res.data.result.rows = result.data.result.rows
              res.data.result.total = result.data.result.total
            } else {
              res = result
            }
            if (res.data.result.total > 0 && result.data.result.eventList.length >= 100) {
              return this.centerPageQuery({ ...param, page: param.page + 1 }, res)
            } else {
              return res
            }
          }
        } else {
          return 'fail'
        }
      } catch (e) {
        return 'fail'
      }
    },
    // 停止分段播放
    segmentStop() {
      this.plugin.stopAll()
      this.screen(1)
      this.plugin.setShowscreen(1)
    }
  },
  beforeDestroy() { }
}
