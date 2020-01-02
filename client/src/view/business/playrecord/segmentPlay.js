/*
* 分段回放业务逻辑
*/
import { mapActions } from 'vuex'
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
        activeTime = new Date(this.activeData.queryParam.time * 1000)
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
          console.log(this.curNode, this.activeData)
          node = {
            _id: this.activeData.res,
            name: this.activeData.name,
            eid: {
              ip: act.devIp,
              cport: act.devPort
            },
            chan: act.channel,
            time: act.time
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
      if (this.isNVR || this.isSync || node.nodeId) {
        return
      }
      this.CLEAR_RESOURCE()
      this.plugin.stopAll()
      if (!this.curNode.eid) {
        this.$Notice.warning({ desc: '请选择一个摄像头！', title: '警告' })
        return
      }
      const power = await this.getCameraPower(node._id)
      if (!power || !power.includes('playbackDownload')) {
        return this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
      }
      // 获取时间
      this.getSegmentTime()
      // 分屏
      this.screen(this.segNum)
      this.plugin.setShowscreen(this.segNum)
      const queryParam = {
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
      this.centerPageQuery(queryParam).then(res => {
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
                time: item.startTime
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
        const info = item.evtTblInfo
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
    // 中心回放查询逻辑
    async centerPageQuery(param, res) {
      try {
        const suc = await this.queryRecordlist(param).catch(() => 'fail')
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
