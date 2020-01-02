export default {
  methods: {
    // 异步回放流程
    async querySingleRecord(param, node) {
      const power = await this.getCameraPower(node._id)
      if (!power || !power.includes('playbackDownload')) {
        return this.$Notice.warning({ desc: `没有权限！`, title: '警告' })
      }
      this.btnLoading = true
      if (this.showThumb !== 1) {
        const canOpen = this.nextAvailablePlugin()
        if (!canOpen) {
          this.$Notice.warning({
            title: '警告',
            desc: '无空闲窗口, 请先关闭部分窗口',
            duration: 5
          })
          this.btnLoading = false
          return
        }
      } else {
        this.timelineRef.initTimeList()
      }
      // await this.plugin.initPluginType('record')
      const index = this.activedIndex
      const result = {
        res: node._id,
        name: node.name,
        queryParam: {
          ...param,
          devIp: node.eid.ip,
          devPort: node.eid.cport,
          channel: node.chan
        },
        queryTime: {
          str: param.startTime,
          end: param.endTime
        }
      }
      this.plugin.stop(false)
      this.plugin.syncPause()
      // 如果是国标设备
      if (node.nodeId) {
        this.plugins[this.activedIndex].initPluginType('record')
        await this.$nextTick()
        result.queryParam.childId = node.nodeId
        result.queryParam.shareServer = node.shareServer
        const gbRecord = await this.gbRecordQuery(result.queryParam, node, index)
        if (gbRecord && gbRecord.recordList.length) {
          result.recordList = [...gbRecord.recordList]
          result.total = gbRecord.total
          const intime = this.findIntime(result)
          this.timelineRef.chengeTime(param.time * 1000)
          this.setPlayLog({ ip: node.eid.ip, name: node.name })
          this.openPlugin(result, intime, index)
          this.changeTimeline()
        } else {
          result.recordList = []
          this.$Notice.warning({ desc: '查询无录像', title: '警告' })
          this.clearTimer()
          this.timelineRef.chengeTime(param.time * 1000)
        }
        result.queryTimeArr = [{
          start: param.startTime,
          end: param.endTime
        }]
        this.setResource({ index, item: result })
        this.avtiveChange(index)
        this.btnLoading = false
      } else {
        // 中心回放查询，数据处理逻辑
        try {
          const res = await this.requestQuery(result.queryParam, index)
          this.dealWithResult(result, res.data.result) // 删选标记点
          if (result.total) {
            if (result.isQueryTag) { // 标记录像
              const tags = result.tags[result.queryParam.typeName]
              if (tags) {
                this.setPlayLog({ ip: node.eid.ip, name: node.name })
                this.openPlugin(result, tags[0].time, index)
                this.changeTimeline()
              } else {
                this.$Notice.warning({
                  desc: '无此标记录像',
                  title: '警告'
                })
                this.clearTimer()
                this.timelineRef.chengeTime(param.time * 1000)
              }
            } else if (this.isInQueryTime(result)) { // 录像在查询的范围之内
              const intime = this.findIntime(result)
              this.setPlayLog({ ip: node.eid.ip, name: node.name })
              this.openPlugin(result, intime, index)
              this.changeTimeline()
            } else {
              this.$Notice.warning({
                desc: '查询无录像',
                title: '警告'
              })
              this.clearTimer()
              this.timelineRef.chengeTime(param.time * 1000)
            }
          } else {
            this.$Notice.warning({
              desc: '查询无录像',
              title: '警告'
            })
            this.clearTimer()
            this.timelineRef.chengeTime(param.time * 1000)
          }
        } catch (e) {
          console.log('query record error', e)
          this.$Notice.error({
            desc: '查询无录像',
            title: '警告'
          })
          this.clearTimer()
          this.timelineRef.chengeTime(param.time * 1000)
        } finally {
          this.SET_RESOURCE({
            index,
            item: result
          })
          // this.logResult(result.eventList)
          this.avtiveChange(index)
          this.btnLoading = false
        }
      }
    },
    isInQueryTime(result) {
      const list = result.eventList
      const etime = result.queryParam.endTime
      const stime = result.queryParam.time
      let intime = false
      for (let index = 0; index < list.length; index++) {
        const info = list[index].evtTblInfo
        if (info.startTime <= etime && info.endTime > stime) {
          intime = true
          break
        }
      }
      return intime
    },
    // 找下一个空闲的插件窗口
    nextAvailablePlugin() {
      if (!this.resourceList[this.activedIndex]) {
        // 焦点窗口空闲
        return true
      }
      let i = -1
      while (++i < this.showThumb) {
        const item = this.resourceList[i]
        if (!item) {
          // 空闲窗口
          this.activedIndex = i
          return true
        } else {
          const list = item.eventList || item.recordInfo || item.recordList
          if (!list || !list.length) {
            // 失败或列表为空
            this.activedIndex = i
            return true
          }
        }
      }
      // 没有空闲窗口
      return false
    },
    // 查找他当前条件时间有没有内容
    findIntime(result) {
      let time = result.queryParam.time
      const list = result.eventList || result.recordList
      // const etime = result.queryParam.endTime
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        const info = item.evtTblInfo || item
        if (time >= info.startTime && time < info.endTime) {
          // 在中间
          // break
          return time
        }
      }
      const stime = result.queryParam.time
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        const info = item.evtTblInfo || item
        if (info.startTime > stime) {
          // 第一段录像的开始
          time = info.startTime
          return time
        }
      }
    }
  }
}
