const timedVideo = 800
const tagVideo = 2147483647
const manualVideo = 512
export default {
  data() {
    return {
      lastTimelineValue: 0
    }
  },
  methods: {
    // 判断是否需要重新计算时间轴
    isNeedRecalcTimeline(timelineValue, stepLength) {
      stepLength *= 1000
      // 区间为12 超过重新画
      const timelineStartTime = this.lastTimelineValue - stepLength * 6
      const timelineEndTime = this.lastTimelineValue + stepLength * 6
      if (timelineValue > timelineEndTime || timelineValue < timelineStartTime) {
        return true
      } else {
        return false
      }
    },
    /**
     * 筛选出需要绘制的部分
     * list 录像集合
     * timelineValue 时间轴的中心点
     * stepLength 时间轴每大刻度的长度
     */
    catchCalcTimeline(list, timelineValue, stepLength) {
      const result = {
        timedVideo: [],
        eventVideo: [],
        manualVideo: []
      }
      const stepWidth = 100
      const allowWidthPerPixel = 1.3
      this.lastTimelineValue = timelineValue
      // 时间轴总长是 stepLength * 24, 放宽为36
      stepLength *= 1000
      const timelineStartTime = timelineValue - stepLength * 18
      const timelineEndTime = timelineValue + stepLength * 18
      const stepDv = stepLength * 200
      list.forEach(item => {
        let startTime = this.getRecordStartTime(item) * 1000
        let endTime = this.getRecordEndTime(item) * 1000
        const inTime = timelineValue >= startTime && timelineValue < endTime // 录像是否在中心位置
        if (list.length < 5) {
        } else if (!((startTime > timelineStartTime && startTime < timelineEndTime) ||
          (endTime > timelineStartTime && endTime < timelineEndTime) ||
          (startTime <= timelineStartTime && endTime >= timelineEndTime))) {
          // 在可见区间外
          return
        }
        if ((endTime - startTime) * stepWidth / stepLength < allowWidthPerPixel && !inTime) {
          // 长度小于可见像素且不是当前播放段
          return
        }
        if (startTime < timelineValue - stepDv) {
          startTime = timelineValue - stepDv
        }
        if (endTime > timelineValue + stepDv) {
          endTime = timelineValue + stepDv
        }
        const res = {
          start: startTime,
          end: endTime
        }
        const type = this.getRecordType(item)
        if (type === timedVideo) {
          result.timedVideo.push(res)
        } else if (type === manualVideo) {
          result.manualVideo.push(res)
        } else if (type !== tagVideo) {
          result.eventVideo.push(res)
        }
      })
      return result
    },
    getRecordStartTime(obj) {
      if (!obj.evtTblInfo && !obj.sTime && !obj.startTime) {
        return 0
      }
      if (obj.sTime) {
        return obj.sTime
      } else if (obj.startTime) {
        return obj.startTime
      } else {
        return obj.evtTblInfo.startTime
      }
    },
    getRecordEndTime(obj) {
      if (!obj.evtTblInfo && !obj.eTime && !obj.endTime) {
        return 0
      }
      if (obj.eTime) {
        return obj.eTime
      } else if (obj.endTime) {
        return obj.endTime
      } else {
        return obj.evtTblInfo.endTime
      }
    },
    getRecordType(obj) {
      if (obj.recordType) {
        if (obj.recordType === 'timeVideo' || obj.recordType === 3) {
          return timedVideo
        } else if (obj.recordType === 'eventVideo' || obj.recordType === 4) {
          return 1
        } else if (obj.recordType === '1' || obj.recordType === 2) {
          return manualVideo
        }
        return 800
      } else {
        return obj.evtTblInfo.evtType
      }
    }
  }
}
