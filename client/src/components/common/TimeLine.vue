<template>
  <div id="time-line">
    <div class="calendar">
      {{now}}
      <div class="zoom">
        <i class="zoom-out iconfont icon icon-small" :class="{'disabled': level === 0}" @click="zoomOut"></i>
        <i class="zoom-in iconfont icon icon-large" :class="{'disabled': level === levels.length - 1}" @click="zoomIn"></i>
      </div>
      <div class="signs" v-if="showSign">
        <div class="event-video video">
          <span class="text">事件录像</span>
          <span class="color"></span>
        </div>
        <div class="timed-video video">
          <span class="text">定时录像</span>
          <span class="color"></span>
        </div>
      </div>

    </div>
    <div class="content" @mousedown="md" @mouseup="mu" @mouseleave="canMove = false" @mousemove="mm">
      <div class="time-list" :style="{width: timeListWidth * 2 + 'px',left: left + 'px'}">
        <div class="item" :style="{left: marginRight * item.index - 18 + 'px'}" v-for="(item, i) in realTimeList" :key="i">{{item.item}}</div>
      </div>
      <div class="bg-line" :style="{backgroundPositionX: position + 'px'}">
        <div class="pointer">
          <div class="pointer-line"></div>
        </div>
      </div>
      <div class="color-line-box">
        <div>
          <div class="color-line" v-for="(option, i) in recordOptions" :key="i" :class="{'no-content': !(option.timedOptions.length || option.eventOptions.length)}">
            <div class="blue-line" v-for="(item, i1) in option.timedOptions" :key="'time'+i1" :style="{width: item.timedWidth + 'px', left: item.timedPosition + 'px'}"></div>
            <div class="red-line" v-for="(item, i2) in option.eventOptions" :key="'event' +i2" :style="{width: item.eventWidth + 'px', left: item.eventPosition + 'px'}"></div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'time-line',
  props: {
    recordInfo: {
      type: Array,
      default: () => {
        return [
          {
            eventVideo: [{ start: 1493004000000, end: 1493104000000 }],
            timedVideo: [{ start: 1493064000000, end: 1493074000000 }]
          }
        ]
      }
    },
    value: {
      type: Number,
      default: () => {
        const date = new Date()
        date.setHours(12)
        date.setMinutes(0)
        date.setSeconds(0)
        return date.getTime()
      }
    },
    canForward: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      initTime: 0,
      level: 4,
      levels: [24, 12, 6, 3, 1, 0.5],
      width: 0,
      canMove: false,
      startPosition: 0,
      rangeTime: 0,
      showCalendar: false,
      showSign: true
    }
  },
  computed: {
    ...mapGetters(['localeLanguage']),
    time12() {
      const date = new Date()
      date.setHours(12)
      date.setMinutes(0)
      date.setSeconds(0)
      return date.getTime()
    },
    scale() {
      return this.levels[this.level] * 60 * 60 * 1000 / (this.width * 0.95)
    },
    bgStart() {
      return this.time - this.levels[this.level] / 2 * 60 * 60 * 1000
    },
    recordOptions() {
      return this.recordInfo.map(({ eventVideo, timedVideo }) => {
        eventVideo = eventVideo || []
        timedVideo = timedVideo || []
        return {
          eventOptions: eventVideo.map(({ start, end }) => ({
            eventWidth: (end - start) / this.scale,
            eventPosition: (start - this.bgStart) / this.scale
          })),
          timedOptions: timedVideo.map(({ start, end }) => ({
            timedWidth: (end - start) / this.scale,
            timedPosition: (start - this.bgStart) / this.scale
          }))
        }
      })
    },
    position() {
      const defaultPosition = -(12 / this.levels[this.level] - 0.5) * this.width * 0.95
      return -(this.rangeTime / this.scale) + defaultPosition
    },
    left() {
      const l = this.position % this.timeListWidth
      return l <= 0 ? l : l - this.timeListWidth
    },
    timeListWidth() {
      return this.width * 0.95 * 24 / this.levels[this.level]
    },
    marginRight() {
      return (this.width * 0.95 - 36 * 12) / 12 + 36
    },
    timeList() {
      const arr = []
      const range = this.levels[this.level] * 60 / 12
      for (let i = 0; i <= 24 * 60; i += range) {
        const time = i
        const hour = parseInt(time / 60)
        let heel = time % 60
        const minute = parseInt(heel)
        heel = heel % 1
        const second = heel * 60
        arr.push(`${this.addZero(hour)}:${this.addZero(minute)}:${this.addZero(second)}`)
      }
      const brr = JSON.parse(JSON.stringify(arr))
      brr.shift()
      return arr.concat(brr)
    },
    realTimeList() {
      return this.timeList.map((item, index) => ({ item, index })).filter(({ index }) => this.showItem(index))
    },
    time() {
      const time = this.initTime + this.rangeTime
      this.$emit('input', time)
      return time
    },
    now() {
      const date = new Date(this.time)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()
      return `${this.addZero(year)}-${this.addZero(month)}-${this.addZero(day)} ${this.addZero(hours)}:${this.addZero(
        minutes
      )}:${this.addZero(seconds)}`
    }
  },
  watch: {
    value(newValue) {
      if (this.canMove) {
        return
      }
      this.rangeTime = newValue - this.time12
    }
  },
  methods: {
    showItem(index) {
      return (
        this.marginRight * (index + 2) > Math.abs(this.left) &&
        this.marginRight * index < Math.abs(this.left) + this.width
      )
    },
    addZero(n) {
      return n.toString().length < 2 ? '0' + n : '' + n
    },
    md(e) {
      this.startPosition = e.clientX
      this.canMove = true
    },
    mm(e) {
      if (this.canMove) {
        const now = new Date().getTime()
        const endPosition = e.clientX
        const rangePosition = endPosition - this.startPosition
        this.startPosition = endPosition
        const rangeTime = this.rangeTime - rangePosition * this.scale
        if (!this.canForward && now < rangeTime + this.time12) {
          this.$emit('forwardTop')
          return
        }
        this.rangeTime = rangeTime
      }
    },
    mu() {
      this.$emit('ondrag', String(this.time).slice(0, 10))
      this.canMove = false
    },
    selectedCalendar(date) {
      this.showCalendar = false
      const time = date.split('-').map(item => parseInt(item))
      time[1] -= 1
      const selectedTime = new Date(...time, 12, 0, 0).getTime()
      this.rangeTime = selectedTime - this.initTime
    },
    zoomOut() {
      this.level === 0 || this.level--
    },
    zoomIn() {
      this.level === this.levels.length - 1 || this.level++
    }
  },
  created() {
    this.initTime = this.time12
    this.rangeTime = this.value - this.time12

    this.bindedOnResize = () => {
      const box = this.$el
      this.width = box.offsetWidth
    }
  },
  mounted() {
    this.bindedOnResize()
    window.addEventListener('resize', this.bindedOnResize)
    // window.onresize = () => { this.width = box.offsetWidth }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.bindedOnResize)
    this.bindedOnResize = null
  }
}
</script>

<style scoped>
#time-line {
  width: 100%;
  box-sizing: border-box;
  user-select: none;
  position: absolute;
  background: #1c3053;
}

.calendar {
  height: 30px;
  line-height: 30px;
  text-align: center;
  background: #254576;
  position: relative;
}

.calendar .calendar-box {
  width: 260px;
  height: 235px;
  position: absolute;
  bottom: 25px;
  left: 50%;
  z-index: 1;
  margin-left: -130px;
}

.calendar #calendar {
  position: relative;
  z-index: 1;
}

.calendar span {
  display: block;
  float: left;
  height: 14px;
}

.calendar .calendar-icon {
  width: 14px;
  font-size: 14px;
  margin-right: 10px;
  cursor: pointer;
}

.calendar .calendar-text {
  font-size: 14px;
  line-height: 16px;
}

.content {
  width: 95%;
  margin: 0 auto;
  height: 104px;
  margin-top: 9px;
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  /* background: #1c3053; */
}

.content .time-list {
  height: 9px;
  font-size: 9px;
  position: relative;
}

.content .time-list .item {
  position: absolute;
  width: 36px;
  text-align: center;
}

.content .time-list .item:first-child {
  left: -18px !important;
}

.content .time-list .item:last-child {
  right: -20px !important;
}

.content .bg-line {
  height: 10px;
  margin-top: 8px;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABdwAAAANCAIAAAA8DTseAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNEQzY3NzlCQUZCOTExRTc5MUVCRDEzRTdCN0I1QzVFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNEQzY3NzlDQUZCOTExRTc5MUVCRDEzRTdCN0I1QzVFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0RDNjc3OTlBRkI5MTFFNzkxRUJEMTNFN0I3QjVDNUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0RDNjc3OUFBRkI5MTFFNzkxRUJEMTNFN0I3QjVDNUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6UCVHPAAABR0lEQVR42uzcDWrCQBCAUdsDeIVepPc/RClCkSIUG7RpyI8x6d6gEdSdbd87wSjyGQeZh/XT8woAAACA+3r0FgAAAADc302WMu3+JdrrnKexqzbRpppObX/cRptq7A6n749oU6WR0mDRphq+3s9DE22q/vA2jX20qbrP13meZKHQLJz7eqh34bLQ7Me2CpeFepfeLlkoNQvzlKaShXKzkJqQyuAZZlEWjtv00QqXhWqTvp1l4fcsjH0Ke7gsDE16NpYFP23+fBZW1954+KcMAAAAQAaWMgAAAAAZWMoAAAAAZGApAwAAAJBB9KWMm8ELuRm8nMNayzkOKgtX52bwBVlwM7joLLgZXHgWHAe9IAtuBhedBTeDZeHf/LQJezPYP2UAAAAAMrCUAQAAAMjAUgYAAAAgA0sZAAAAgAwsZQAAAAAy+BFgABj7TN7q33Z8AAAAAElFTkSuQmCC);
  background-repeat: repeat-x;
  background-size: 100% 100%;
}

.content .bg-line .pointer {
  width: 9px;
  height: 13px;
  margin: 0 auto;
  background-color: #f78930;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
}

.content .bg-line .pointer .pointer-line {
  width: 1px;
  height: 100px;
  background-color: #f78930;
  margin: 9px auto 0 auto;
}

.content .color-line-box {
  width: 100%;
  height: 60px;
  overflow-y: visible;
  overflow-x: hidden;
}

.content .color-line {
  margin-top: 9px;
  height: 6px;
  position: relative;
}

.content .color-line div {
  height: 6px;
  position: absolute;
  top: 0;
}

.content .color-line .blue-line {
  background-color: #32e184;
  z-index: 1;
}

.content .color-line .red-line {
  background-color: #fc6e30;
}

.signs {
  position: absolute;
  top: 10px;
  right: 60px;
}

.signs .video {
  float: left;
  height: 12px;
  margin-right: 20px;
}

.en_US .video {
  margin-right: 5px;
}

.en_US .video:last-child {
  margin-right: 0;
}

.signs .video span {
  float: left;
  font-size: 12px;
  line-height: 12px;
}

.signs .video span.color {
  width: 20px;
  height: 6px;
  margin: 3px 0 3px 10px;
}

.en_US .video span.color {
  margin: 3px 0 3px 2px;
}

.signs .event-video span.color {
  background-color: #fc6e30;
}

.signs .timed-video span.color {
  background-color: #32e184;
}

.signs .no-video span.color {
  background-color: #e5e5e5;
}

.zoom {
  width: 40px;
  height: 16px;
  position: absolute;
  right: 18px;
  top: 8px;
}

.zoom i {
  width: 16px;
  font-size: 16px;
  text-align: center;
  line-height: 16px;
  cursor: pointer;
}

.zoom i:hover {
  color: #20a1ff;
}

.zoom i:first-child {
  float: left;
}

.zoom i:last-child {
  float: right;
}

.no-content {
  height: 0 !important;
}

.disabled,
.zoom .disabled:hover {
  color: #a0a0a0;
}
</style>
