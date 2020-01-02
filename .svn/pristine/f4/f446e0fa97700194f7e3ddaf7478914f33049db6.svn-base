import { mapActions } from 'vuex'
export default {
  data() {
    return {
      sourceType: 1,
      sourceList: [
        { value: 1, label: '服务器' },
        { value: 2, label: '前端设备' }
      ],
      queryParam: null,
      curNvrNode: null
    }
  },
  methods: {
    ...mapActions(['getDeviceInfo', 'queryNVRRecordList', 'nvrRecordOpen', 'gbQueryNVRRecordList']),
    async searchNVR(node, time) {
      const data = await this.getDeviceInfo(node.eid._id)
      if (data && data.type !== 'nvr') { // 暂时注释 2019/4/3/ 10:52 前端国标回放连 14.67 调试时 判断注释
        this.warningMsg('该设备不支持前端回放')
        this.loading = false
        return
      }
      let param = {
        recordType: 'all',
        rowId: 1,
        rowCount: 50,
        sTime: time.startTime,
        eTime: time.endTime,
        streamType: 'all',
        channel: node.chan,
        devIp: node.eid.ip,
        devPort: node.eid.cport
      }
      this.queryParam = param
      this.curNvrNode = node
      this.NVRPageQuery(param)
        .then(r => {
          this.loading = false
          if (r === 'nodate') {
            this.resultList = []
            this.showSearch = false
          } else if (r === 'fail') {
            this.showErr('查询录像失败')
          } else {
            this.resultList = r.recordInfo
            this.resultList.forEach(val => {
              val.stime = this.formatTime(val.sTime)
              val.duration = this.formatSpendTime(val.sTime, val.eTime)
            })
            this.showSearch = false
          }
        })
        .catch(e => {
          this.loading = false
          this.showErr('查询录像失败')
          console.log(e)
        })
    },
    async NVRPageQuery(param, res) {
      try {
        const suc = await this.queryNVRRecordList(param).catch(() => 'fail')
        if (suc) {
          const result = suc.data
          if (!result.total) {
            return 'nodate'
          } else {
            if (res) {
              if (result.recordInfo) {
                res.recordInfo = [...res.recordInfo, ...result.recordInfo]
                res.rowCount = result.rowCount
                res.rowId = result.rowId
                res.total = result.total
              }
            } else {
              res = result
            }
            if (result.rowCount && result.rowCount >= 50) {
              return this.NVRPageQuery({ ...param, rowId: param.rowId + 1 }, res)
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
    NvrOpen(i, tmpParam) {
      if (!tmpParam) {
        this.tmpParam = {
          queryParam: this.queryParam,
          node: this.curNvrNode,
          playInfo: this.$lodash.cloneDeep(this.resultList[i])
        }
      } else {
        this.tmpParam = tmpParam
      }
      const state = this.plugin.NVRopen(this.tmpParam).then(() => {
        if (!tmpParam) {
          this.playingIndex = i
          this.sTime = this.resultList[i].sTime
          this.eTime = this.resultList[i].eTime
          this.curRecord = this.resultList[i].sTime + '' + this.resultList[i].eTime
          this.startTimer()
        }
      })
      if (state && this.pluginState) {
        this.pluginState.isPlay = true
        this.pluginState.isStopped = false
      }
    },
    async nvrDownLoad(fileName) {
      const info = this.$lodash.cloneDeep(this.resultList[this.playingIndex])
      this.openParam = {
        devIp: info.devIp,
        devPort: info.devPort,
        channel: info.channel,
        sTime: info.sTime,
        eTime: info.eTime,
        streamType: info.streamType,
        streamConnPort: this.tmpParam.node.eid.dport
      }
      const res = await this.nvrRecordOpen(this.openParam).catch(() => this.errorMsg('请求错误！'))
      if (!res) { return }
      const param = {
        ip: res.data.TsIp,
        port: res.data.TsPort + '',
        fileName,
        beginTime: info.sTime + '',
        endTime: info.eTime + '',
        cmdStr: JSON.stringify({
          streamType: info.streamType,
          vendor: this.tmpParam.node.eid.manufacturer,
          session: '',
          ip: info.devIp,
          channel: info.channel,
          port: info.devPort + '',
          streamId: res.data.streamId
        })
      }
      return param
    }
  },
  beforeDestroy() {
  }
}
