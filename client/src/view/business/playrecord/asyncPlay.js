export default {
  methods: {
    // 异步回放流程
    async querySingleRecord(param, node) {
      this.btnLoading = true
      if (this.showThumb !== 1) {
        this.nextAvailablePlugin() // 自动查找空闲窗口
      } else {
        this.timelineRef.initTimeList()
      }
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
        },
        timelineMark: node.tagTime, // 添加录像段标记 Array
        tabPane: this.tabPane // 【案件列表】 / 【追踪列表】 // 给录像资源添加标记，判断是否做时间截取
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
          this.setPlayLog({
            ip: node.eid.ip,
            name: node.name
          })
          this.openPlugin(result, intime, index)
          this.changeTimeline()
        } else {
          result.recordList = []
          this.$Notice.warning({
            desc: '查询无录像',
            title: '警告'
          })
          this.clearTimer()
          this.timelineRef.chengeTime(param.time * 1000)
        }
        result.queryTimeArr = [{
          start: param.startTime,
          end: param.endTime
        }]
        this.setResource({
          index,
          item: result
        })
        this.avtiveChange(index)
        this.btnLoading = false
      } else {
        // 中心回放查询，数据处理逻辑
        try {
          // 案件处理修改
          // 获得eventListss
          let res = await this.requestQuery(result.queryParam, index)
          if (res.data === 'no data.') {
            this.$Notice.warning({
              desc: '查询无录像',
              title: '警告'
            })
            this.clearTimer()
            this.timelineRef.chengeTime(param.time * 1000)
            return
          }
          this.dealWithResult(result, res.data.result) // 删选标记点
          if (result.total) {
            if (result.isQueryTag) { // 标记录像
              const tags = result.tags[result.queryParam.typeName]
              if (tags) {
                this.setPlayLog({ip: node.eid.ip, name: node.name})
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
              this.setPlayLog({ip: node.eid.ip, name: node.name})
              // if (this.tabPane === 'tracklist') {
              //   // 强行修改传给插件的播放开始、结束时间
              //   // 使其自动关流
              //   // 会有2-5s的误差
              //   let _result = JSON.parse(JSON.stringify(result))
              //   _result.eventList = [_result.eventList[0]]
              //   _result.eventList[0].evtTblInfo.startTime = param.startTime
              //   _result.eventList[0].evtTblInfo.endTime = param.endTime
              //   this.openPlugin(_result, intime, index, param.startTime)
              // } else {
              //   this.openPlugin(result, intime, index)
              // }
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
          // 保存查询的时间段数据，为时间轴
          // 存到vuex中 client\src\store\modules\playback.js:300
          this.SET_RESOURCE({
            index,
            item: result
          })
          this.avtiveChange(index)
          this.btnLoading = false
        }
      }
    },
    // 录像在查询的范围之内
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
