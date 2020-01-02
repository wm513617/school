<template>
  <div id="time-line" @mouseleave="mu">
    <div class="calendar" :style="{'text-align': isModel? 'left': 'center'}">
      <span class="calendar-text">{{now}}</span>
    </div>
    <div class="content" @mousedown="md" @mouseup="mu" @mouseleave="canMove = false" @mousemove="mm">
      <!--时间轴-->
      <div style="width: calc(100% - 30px);margin-left:15px;overflow: hidden;" class="timeLine" ref="timeLine">
        <div class="time-list" :style="{width: (width * 25 / 12) + 'px',marginLeft: offsetLeft + 'px'}">
          <div class="item" :key="i" :style="{width: width/12 + 'px'}" v-for="(item, i) in thumbTimeList">{{!isModel||i%2==0 ? item.time: ''}}</div>
        </div>
      </div>
      <!-- <div class="channelName" style="position: absolute;left:15px;">通道名称</div> -->
      <!--刻度条、中界限-->
      <div class="bg-line" :style="{backgroundPositionX: offsetLeft + width/24 + 'px'}">
        <!-- 绘制刻度 -->
        <div class="scaleBox" style="width: 100%;height:10px;overflow: hidden;float: left;">
          <div class="scaleInbox" :style="{width: (width * 25 / 12) + 'px',marginLeft: offsetLeft - width/60 *1.5 + 'px'}">
            <div class="scale" :class="{'center': i%5 === 0}" :key="i" :style="{width: width/60 + 'px'}" v-for="i in 125"></div>
          </div>
        </div>

        <div class="pointer">
          <div class="pointer-line"></div>
        </div>
      </div>

      <!--进度条-->
      <bs-scroll class="color-line-box" height="100px">
        <div>
          <div class="color-lines" v-for="(option, i) in recordOptions" :key="i" @click="lineClick($event,option.resId)" >
            <div class="color-line" :class="{'no-content': !(option.timedOptions.length || option.eventOptions.length)}">
              <div class="timed-line" v-for="item in option.timedOptions" :key="item.id" :style="{width: item.width + 'px', left: item.position + 'px'}"></div>
              <div class="event-line" v-for="item in option.eventOptions" :key="item.id" :style="{width: item.width + 'px', left: item.position + 'px'}"></div>
              <!-- 手动录像 -->
              <div class="manual-line" v-for="item in option.manualOptions" :key="item.id" :style="{width: item.width + 'px', left: item.position + 'px'}"></div>
              <div class="tags" v-for="(item, index) in option.tags" :key="100000+index" :title="item.name" :style="{left: item.timedPosition + 'px'}" @click="$emit('ondrag', item.time)"></div>
              <!-- 接力追踪 节点 -->
              <span v-if="caseData.length" class="case-line" :style="{width: caseData[0].width  + 'px', left: caseData[0].position + 'px'}" :class="{'active' : activedId === option.resId}" @click.stop="clickCaseLine(option.resId)"></span>
            </div>
          </div>
        </div>
      </bs-scroll>

    </div>
    <div class="signs">
      <div class="event-video video">
        <span class="text">事件录像</span>
        <span class="color"></span>
      </div>
      <div class="timed-video video">
        <span class="text">定时录像</span>
        <span class="color"></span>
      </div>
      <!-- <div class="manual-video video">
        <span class="text">手工录像</span>
        <span class="color"></span>
      </div> -->
    </div>
    <div class="zoom">
      <div class="zoom-out iconfont icon icon-large" :class="{'disabled': step === steps.length - 1}" @click="zoomIn"></div>
      <div style="float:left;font-size:12px;width:28px;color: #a0a0a0;">{{spacing[step]}}</div>
      <div class="zoom-in iconfont icon icon-small" :class="{'disabled': step === 0}" @click="zoomOut"></div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Timeline',
  components: {},
  props: {
    recordInfo: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 传入的值
    value: {
      type: Number,
      default: () => {
        const date = new Date()
        date.setHours(12)
        date.setMinutes(0)
        date.setSeconds(0)
        return parseInt(date.getTime() / 1000) * 1000
      }
    },
    canForward: {
      type: Boolean,
      default: true
    },
    disabled: {
      default: false
    },
    isModel: {
      default: false
    },
    // 接力追踪 节点数据
    caseTime: {
      default: () => {
        return {}
      }
    },
    stepTimeLine: {
      type: Number,
      default: 7
    }
  },
  data() {
    return {
      initTime: 0,
      level: 6,
      width: 0,
      canMove: false,
      startPosition: 0,
      rangeTime: 0,
      activeline: 0,
      thumbTimeList: [],
      steps: [5, 60, 150, 300, 900, 1800, 3600, 7200],
      step: 7,
      spacing: ['1m', '12m', '30m', '1h', '3h', '6h', '12h', '24h'],
      offsetLeft: '',
      isMoved: false, // 标识是否移动过
      activedId: '' // 当前选中的【时间段】
    }
  },
  computed: {
    time12() {
      const date = new Date()
      date.setHours(12)
      date.setMinutes(0)
      date.setSeconds(0)
      return parseInt(date.getTime() / 1000) * 1000
    },
    stepLength() {
      return this.steps[this.step]
    },
    scale() {
      return (this.steps[this.step] * 12 * 1000) / this.width
    },
    bgStart() {
      return this.time - (this.steps[this.step] / 2) * 12 * 1000
    },
    // 时间轴为显示整理的数据结构
    recordOptions() {
      return this.recordInfo
        .filter(item => item)
        .map(({ eventVideo, timedVideo, manualVideo, label, resId, tags }) => {
          return {
            resId,
            eventOptions: eventVideo.map(({ start, end }, index) => ({
              ...this.getPosition(start, end),
              id: 'e' + resId + index
            })),
            timedOptions: timedVideo.map(({ start, end }, index) => ({
              ...this.getPosition(start, end),
              id: 't' + resId + index
            }))
            // 以下内容暂时用不到
            // 新添加的手工录像
            // manualOptions: manualVideo.map(({ start, end }, index) => ({
            //   ...this.getPosition(start, end),
            //   id: 'm' + resId + index
            // })),
            // label,
            // resId,
            // tags: (tags || []).map(({ time, name }) => {
            //   time -= time % 1000
            //   return { name, timedPosition: (time - this.bgStart) / this.scale, time }
            // })
          }
        })
    },
    time() {
      const time = parseInt((this.initTime + this.rangeTime) / 1000) * 1000
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
      const secondes = date.getSeconds()
      return `${this.addZero(year)}-${this.addZero(month)}-${this.addZero(day)} ${this.addZero(hours)}:${this.addZero(minutes)}:${this.addZero(secondes)}`
    },
    caseData() {
      return [this.caseTime]
        .filter(e => e.start && e.end)
        .map(({ start, end }) => {
          return { ...this.getPosition(start, end) }
        })
    }
  },
  watch: {
    caseData(val) {
      if (!val.length) {
        this.clickCaseLine()
      }
    },
    value(newValue) {
      if (this.canMove) {
        return
      }
      this.rangeTime = newValue - this.time12
    },
    offsetLeft() {
      if (this.offsetLeft < (-this.width * 12.5) / 12) {
        this.offsetLeft += this.width / 2
        this.thumbTimeList.splice(0, 6)
        const b = this.thumbTimeList[this.thumbTimeList.length - 1].value
        for (let i = 1; i < 7; i++) {
          const a = b + this.steps[this.step] * i
          const obj = { time: this.toTime(a * 1000), value: a }
          this.thumbTimeList.push(obj)
        }
        this.$emit('upTimeList', this.thumbTimeList[0].value, this.thumbTimeList[23].value)
      }
      if (this.offsetLeft > (-this.width * 0.5) / 12) {
        this.offsetLeft -= this.width / 2
        this.thumbTimeList.splice(18, 6)
        const d = this.thumbTimeList[0].value
        for (let j = 1; j < 7; j++) {
          const c = d - this.steps[this.step] * j
          const obj = { time: this.toTime(c * 1000), value: c }
          this.thumbTimeList.unshift(obj)
        }
        this.$emit('upTimeList', this.thumbTimeList[0].value, this.thumbTimeList[23].value)
      }
    },
    stepLength(a) {
      this.$emit('update:stepLength', a)
    }
  },
  methods: {
    getPosition(start, end) {
      start -= start % 1000
      end -= end % 1000
      let position = (start - this.bgStart) / this.scale
      let width = (end - start) / this.scale
      return { position, width }
    },
    addZero(n) {
      return n.toString().length < 2 ? '0' + n : '' + n
    },
    md(e) {
      if (this.recordInfo.length <= 0) {
        return
      }
      if (this.disabled) {
        return
      }
      this.startPosition = e.clientX - (e.clientX % (this.width / this.steps[this.step] / 12))
      this.canMove = true
      this.$emit('mouseDown')
    },
    mm(e) {
      if (this.canMove) {
        const endPosition = e.clientX - (e.clientX % (this.width / this.steps[this.step] / 12))
        const rangePosition = endPosition - this.startPosition
        if (!this.canForward && rangePosition < 0) {
          return
        }
        this.isMoved = true
        this.startPosition = endPosition
        this.rangeTime -= rangePosition * this.scale
        // -----------------------------------
        this.offsetLeft += rangePosition
      }
    },
    mu(e) {
      if (this.recordInfo.length <= 0) {
        return
      }
      this.canMove = false
      if (this.isMoved) {
        if (new Date().getTime() < this.time) {
          this.$emit('forwardTop')
        } else {
          this.$emit('ondrag', this.time)
        }
        setTimeout(() => {
          this.isMoved = false
        }, 0)
      }
      // this.initTimeList(null, true)
    },
    lineClick(e, id) {
      // if (!this.isMoved) {
      //   // const p = -(e.layerX - this.width / 2)
      //   const place = -(e.screenX - 380 - this.width / 2)
      //   this.rangeTime -= place * this.scale
      //   // -----------------------------------
      //   this.offsetLeft += place
      //   this.$emit('ondrag', this.time)
      // }
    },
    zoomOut() {
      if (this.step === 0) {
        return
      }
      this.step--
      this.initTimeList()
    },
    zoomIn() {
      if (this.step === this.steps.length - 1) {
        return
      }
      this.step++
      this.initTimeList()
    },
    toTime(time) {
      const date = new Date(time)
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const secondes = date.getSeconds()
      return `${this.addZero(hours)}:${this.addZero(minutes)}:${this.addZero(secondes)}`
    },
    initTimeList(t) {
      console.log('initTimeList', t)
      this.thumbTimeList = []
      let nowtime
      if (t) {
        nowtime = t / 1000 - ((t / 1000) % this.steps[this.step])
        this.rangeTime = t - this.time12
      } else {
        nowtime = this.time / 1000 - ((this.time / 1000) % this.steps[this.step])
      }
      for (let i = 12; i > 0; i--) {
        const a = nowtime - this.steps[this.step] * i
        this.thumbTimeList.push({ time: this.toTime(a * 1000), value: a })
      }
      for (let i = 0; i < 12; i++) {
        const a = nowtime + this.steps[this.step] * i
        this.thumbTimeList.push({ time: this.toTime(a * 1000), value: a })
      }
      this.upLeft()
      this.$emit('upTimeList', this.thumbTimeList[0].value, this.thumbTimeList[23].value)
      console.log('initTimeList-end')
    },
    upLeft() {
      console.log('upLeft')
      this.offsetLeft = -((this.width * 6.5) / 12 + ((this.time / 1000) % this.steps[this.step]) * (this.width / this.steps[this.step] / 12))
      console.log('upLeft-end')
    },
    chengeTime(t) {
      console.log('chengeTime', t)
      this.$emit('update:unParsedValue', t)
      t -= t % 1000
      if (t / 1000 < this.thumbTimeList[0].value || t / 1000 > this.thumbTimeList[23].value) {
        this.initTimeList(t)
      }
      this.offsetLeft -= (t - this.time) / this.scale
      this.rangeTime = t - this.initTime
      console.log('chengeTime-end')
    },
    resizefun() {
      setTimeout(() => {
        const box = this.$refs.timeLine
        this.width = box.offsetWidth
        this.upLeft()
        this.initTimeList()
      }, 200)
    },
    // 选中 接力追踪 标记时间段
    clickCaseLine(val) {
      // 点击选中，再点击取消
      if (this.activedId) {
        this.$emit('clickCaseLine', false)
        this.activedId = ''
      } else {
        this.$emit('clickCaseLine', true)
        this.activedId = val
      }
    }
  },
  created() {
    this.initTime = this.time12
    this.rangeTime = this.value - this.time12
    this.step = this.stepTimeLine !== undefined ? this.stepTimeLine : 7
  },
  async mounted() {
    await this.$nextTick()
    const box = this.$refs.timeLine
    this.width = box.offsetWidth
    this.resizefun()
    window.addEventListener('resize', this.resizefun)
  },
  beforeDestroy() {
    this.thumbTimeList = []
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  }
}
</script>

<style scoped>
#time-line {
  width: 100%;
  box-sizing: border-box;
  user-select: none;
  background-color: rgb(12, 27, 50);
  position: absolute;
}

.calendar {
  height: 14px;
  width: calc(100% - 30px);
  margin-top: 9px;
  margin-left: 15px;
  text-align: center;
}

.calendar .calendar-text {
  font-size: 14px;
  line-height: 16px;
  width: 165px;
  margin: 0 auto;
}

.content {
  width: 100%;
  margin: 0 auto;
  /*margin: 0 10px 0 100px;*/
  height: 112px;
  margin-top: 9px;
  cursor: pointer;
  overflow: hidden;
  background: #1c3053;
  padding: 0;
}

.content .time-list {
  height: 20px;
  font-size: 12px;
  margin-top: 5px;
  position: relative;
}
.color-lines {
  box-sizing: border-box;
  border: 1px solid transparent;
  height: 24px;
}
/* .color-lines.active {
  border: 1px solid #00a5e3;
} */
.content .time-list .item {
  text-align: center;
  display: inline-block;
}

.content .bg-line {
  width: calc(100% - 30px);
  margin-left: 15px;
  height: 10px;
  margin-top: -5px;
  background-repeat: repeat-x;
  background-size: 100% 100%;
  background: rgba(255, 255, 255, 0.24);
}

.content .bg-line .scale {
  height: 5px;
  float: left;
  border-left: 1px solid #000;
  margin-top: 6px;
}
.content .bg-line .scale.center {
  height: 8px;
  margin-top: 2px;
}

.content .bg-line .pointer {
  width: 9px;
  height: 13px;
  margin: 0 auto;
  background-color: #f78930;
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  position: relative;
  z-index: 99999;
}

.content .bg-line .pointer .pointer-line {
  width: 1px;
  height: 110px;
  background-color: #f78930;
  margin: 9px auto 0 auto;
}

.content .color-line-box {
  width: 100%;
  height: 85px;
  overflow-y: visible;
  overflow-x: hidden;
}
.content .line-title {
  display: inline-block;
  width: 85px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.content .color-line {
  display: inline-block;
  width: calc(100% - 30px);
  margin-left: 15px;
  height: 6px;
  background-color: #3b5074;
  position: relative;
  overflow: hidden;
  /* margin-bottom: 6px; */
}

.content .color-line div {
  height: 6px;
  position: absolute;
  top: 0;
}

.content .color-line .manual-line {
  background-color: #e6c821;
  z-index: 2;
}

.content .color-line .timed-line {
  background-color: #32e184;
  z-index: 1;
}

.content .color-line .event-line {
  background-color: #fc6e30;
  z-index: 3;
}

/* 接力追踪事件录像段标记 */
.content .color-line .case-line {
  background-color: #872febb3;
  z-index: 5;
  position: absolute;
  display: inline-block;
  height: 6px;
}

/* 事件录像 选中项 高亮效果 */
.content .color-line .case-line.active {
  background-color: #9c53f0;
}

.content .color-line .tags {
  border: 3px solid #cc3333;
  border-radius: 3px;
  top: -1px;
  z-index: 4;
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

.signs .event-video span.color {
  background-color: #fc6e30;
}

.signs .timed-video span.color {
  background-color: #32e184;
}

.signs .manual-video span.color {
  background-color: #e6c821;
}

.signs .no-video span.color {
  background-color: #e5e5e5;
}

.zoom {
  width: 60px;
  height: 16px;
  position: absolute;
  top: 8px;
  right: 8px;
}

.zoom div {
  width: 16px;
  font-size: 16px;
  text-align: center;
  line-height: 16px;
  cursor: pointer;
}

.zoom div.iconfont:hover {
  color: #20a1ff;
}

.zoom div:first-child {
  float: left;
}

.zoom div:last-child {
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
