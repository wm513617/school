export default {
  methods: {
    // 同步回放流程
    queryMultiRecord(param, nodes) {
      this.btnLoading = true
      this.plugin.stopAll()
      if (this.showThumb === 1) {
        this.plugin.setShowscreen(4)
        this.showThumb = 4
      }
      const pros = []
      nodes.forEach((node, index) => {
        pros.push(
          new Promise(async resolve => {
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
            // 如果是国标设备
            if (node.nodeId) {
              try {
                result.queryParam.childId = node.nodeId
                result.queryParam.shareServer = node.shareServer
                const gbRecord = await this.gbRecordQuery(result.queryParam, node, index)
                result.recordList = [...gbRecord.recordList]
                result.total = gbRecord.total
              } catch (e) {
                result.recordList = []
                result.total = 0
                this.$Notice.error({ desc: '查询无录像', title: '警告' })
              } finally {
                result.queryTimeArr = [{
                  start: param.startTime,
                  end: param.endTime
                }]
                this.setResource({ index, item: result })
                resolve()
              }
            } else {
              try {
                this.setPlayLog({ ip: node.eid.ip, name: node.name })
                const s = await this.requestQuery(result.queryParam, index)
                Object.assign(result, s.data.result)
              } catch (e) {
                console.log('query record error', e)
                this.$Notice.error({ desc: '查询无录像', title: '警告' })
              } finally {
                this.setResource({
                  index,
                  item: result
                })
                resolve()
              }
            }
          })
        )
      })
      Promise.all(pros).then(() => {
        this.btnLoading = false
        const info = this.findAvailableSyncTime(param.time)
        // this.syncOpenPlugin(info.time)
        if (info.time) {
          this.syncTime(info.time)
          this.avtiveChange(info.index)
        } else {
          this.syncTime(param.time)
          this.avtiveChange(0)
        }
        this.addAllTimelineInfo()
      })
    },
    // 同步开启视频播放
    syncOpenPlugin(time) {
      this.resourceList.forEach((item, index) => {
        this.plugins[index].syncPause()
        if (item && item.total) {
          const info = this.findNextTimeInfo(item, time)
          if (info.end) {
            // 有播放段才打开
            const opened = this.openPlugin(item, time, index)
            if (typeof opened === 'object') {
              opened.then(_ => {
                if (_) {
                  this.buttons.dragHook()
                }
              }).catch(e => {
                this.errorMsg(e)
              })
            } else if (opened) {
              this.buttons.dragHook()
            }
          }
        }
      })
    },
    // 检查切换到的时间是否都查询过了
    checkOnQueryInfo(time) {
      return new Promise(resolve => {
        const pros = []
        this.resourceList.forEach((item, index) => {
          const p = new Promise(resolve => {
            let needQuery = true
            item.queryTimeArr.forEach(query => {
              // 距离十二小时内
              if (Math.abs((query.start + query.end) / 2 - time) < 12 * 3600) {
                needQuery = false
              }
            })
            if (needQuery) {
              const queryParam = JSON.parse(JSON.stringify(item.queryParam))
              queryParam.startTime = time - 12 * 60 * 60
              queryParam.endTime = time + 12 * 60 * 60
              this.extraQuery(queryParam, index)
                .then(result => {
                  this.CONCAT_RESOURCE({
                    index,
                    item: result.data.result,
                    query: queryParam
                  })
                  resolve()
                })
                .catch(err => {
                  console.error('more query error', err)
                  this.errorMsg('同步回放查询失败')
                  resolve()
                })
            } else {
              resolve()
            }
          })
          pros.push(p)
        })
        Promise.all(pros).then(_ => {
          resolve()
        })
      })
    },
    // 用 time参数来做同步回放
    async syncTime(time) {
      this.clearSyncTimer()
      this.$refs.timeLine.chengeTime(time * 1000)
      if (!this.isNVR) {
        await this.checkOnQueryInfo(time)
      }
      this.syncOpenPlugin(time)
      this.syncTimerFun()
      this.syncTimer = setInterval(() => {
        this.syncTimerFun()
      }, 10000)
      this.changeTimeline()
      this.buttons.state.isPlay = true
      this.buttons.state.isStopped = false
    },
    // 清空同步回放时候的定时器
    clearSyncTimer() {
      clearInterval(this.syncTimer)
      this.syncTimerList = this.syncTimerList || []
      this.syncTimerList.forEach(i => {
        clearTimeout(i)
      })
      this.syncTimerList = []
    },
    // 每隔十秒检查有没有下一段的开始
    syncTimerFun() {
      const time = this.timelineValue / 1000
      this.resourceList.forEach((item, index) => {
        if (!item || item.total === 0) {
          return
        }
        const info = this.findNextTimeInfo(item, time)
        if (info.end && info.end - time < 10) {
          // 即将结束
          const nextInfo = this.findNextTimeInfo(item, info.end + 3)
          if (nextInfo.end) {
            // 如果要关闭的3秒内有下一段录像 就不关了
            return
          }
          this.syncTimerList.push(
            setTimeout(() => {
              this.plugins[index].syncPause()
            }, (info.end - time) * 1000)
          )
        } else if (info.start && info.start - time < 10) {
          // 即将开始
          this.syncTimerList.push(
            setTimeout(() => {
              this.openPlugin(item, info.start, index)
            }, (info.start - time) * 1000)
          )
        }
      })
    },
    getEventList(i) {
      // if (this.isNVR) {
      if (this.isNVR && i.recordInfo) { // 前端国标回放修改 2019/4/8 11:32
        return i.recordInfo
      } else {
        return i.eventList || i.recordList
      }
    },
    // 找最靠近查询时间的播放时间
    findAvailableSyncTime(time) {
      let nearTime = 0
      let inTime
      let inIndex
      let nearIndex
      for (let index = 0; index < this.resourceList.length; index++) {
        const result = this.resourceList[index]
        if (!result || !result.total) {
          continue
        }
        const eventList = this.getEventList(result)
        for (let i = 0; i < eventList.length; i++) {
          const item = eventList[i]
          let nitem = {}
          if (i < eventList.length - 1) {
            nitem = eventList[i + 1]
          }
          if (this.getRecordStartTime(item) <= time && this.getRecordEndTime(item) > time) {
            inTime = time
            inIndex = index
            break
          } else if (i === 0 && this.getRecordStartTime(item) > time) {
            if (nearTime === 0 || this.getRecordStartTime(item) - time < nearTime - time) {
              nearTime = this.getRecordStartTime(item)
              nearIndex = index
            }
            break
          } else if (this.getRecordEndTime(item) <= time && this.getRecordStartTime(nitem) > time) {
            if (nearTime === 0 || this.getRecordStartTime(nitem) - time < nearTime - time) {
              nearTime = this.getRecordStartTime(nitem)
              nearIndex = index
            }
            break
          }
        }
        if (inTime) {
          break
        }
      }
      if (inTime) {
        return {
          time: inTime,
          index: inIndex
        }
      } else {
        return {
          time: nearTime,
          index: nearIndex
        }
      }
    },
    // 查找下一段录像的信息
    findNextTimeInfo(result, time) {
      let res = {}
      let list = this.$lodash.cloneDeep(this.getEventList(result) || [], true)
      list = list.sort(sortFunc)
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        let nitem = {}
        if (index < list.length - 1) {
          nitem = list[index + 1]
        }
        if (index === 0 && this.getRecordStartTime(item) >= time) {
          res = {
            start: this.getRecordStartTime(item)
          }
          break
        } else if (this.getRecordStartTime(item) <= time && this.getRecordEndTime(item) > time) {
          res = {
            end: this.getRecordEndTime(item)
          }
          break
        } else if (this.getRecordEndTime(item) <= time && this.getRecordStartTime(nitem) > time) {
          res = {
            start: this.getRecordStartTime(nitem)
          }
          break
        }
      }
      return res
    }
  }
}
// 让 查询出来的录像信息 按开始时间排序
const sortFunc = (pre, next) => {
  if (pre.sTime) { // 前端录像
    return pre.sTime - next.sTime
  } else if (pre.startTime) { // 下联设备录像
    return pre.startTime - next.startTime
  }
  // 中心录像
  return pre.evtTblInfo.startTime - next.evtTblInfo.startTime
}
