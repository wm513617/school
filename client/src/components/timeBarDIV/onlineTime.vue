<template>
  <div class="onlineTime-box" ref='onlineTimeBox' @wheel.stop="scrollFunc" @click.stop="mouseUp" @mousedown.stop="mouseDown" @mousemove.stop="mouseMove" @mouseup.stop="mouseUp" @mouseleave.stop="mouseUp">
    <div class="onlineTime" ref='onlineTime'>
      <div class="title" v-if='headerShow'>
        <div class="title-time" v-for="item in (dialNumber + 1)" :key="item" :style="'height:' + headerHeight + 'px'"></div>
      </div>
      <div class="line" :style="'margin-left:' + dialWidth / 2 + 'px;margin-right:' + dialWidth / 2 + 'px;'" v-for="(item, index) in detailData" :key="index">
        <div class="line-base">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OnlineTime',
  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    lineWidth: {
      type: Number,
      default: 16
    },
    lineSpacing: {
      type: Number,
      default: 10
    },
    headerHeight: {
      type: Number,
      default: 32
    },
    headerShow: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Array
    },
    onlineColor: {
      type: String,
      default: '#4699f9'
    },
    basicColor: {
      type: String,
      default: '#0f2343'
    },
    headerColor: {
      type: String,
      default: '#0f2343'
    },
    offlineColor: {
      type: String,
      default: '#ddd'
    },
    timeAllHeight: {
      type: Number,
      default: 445
    },
    isFullScreen: {
      type: Boolean,
      default: false
    },
    onlineName: {
      type: String,
      default: '在线'
    },
    offlineName: {
      type: String,
      default: '离线'
    },
    baseName: {
      type: String,
      default: '未配置'
    }
  },
  data() {
    return {
      titleDialWidth: 0,
      dialWidth: 0,
      interval: 60,
      multiple: 1,
      isShrink: false,
      onlineTime: null,
      onlineTimeWidth: 0,
      disabledDrag: false,
      screenX: 0,
      offsetX: 0,
      widthMultiple: 0,
      afterFullWidth: 0
    }
  },
  computed: {
    dialNumber() {
      return 60 * 24 / this.interval
    }
  },
  watch: {
    multiple(val) {
      switch (val) {
        case 1:
          this.interval = 60
          break
        case 2:
          this.interval = 30
          break
        case 3:
          this.interval = 15
          break
        case 4:
          this.interval = 5
          break
      }
    },
    interval(newVal, oldVal) {
      if (newVal !== oldVal) { this.redrawAll() }
    },
    timeAllHeight(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$refs.onlineTimeBox.style.height = this.timeAllHeight + 'px'
        this.redrawAll()
      }
    },
    detailData: {
      handler() {
        setTimeout(() => {
          this.redrawAll()
        }, 0)
      },
      deep: true
    },
    dialNumber(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.onlineTime.style.width = this.titleDialWidth * (newVal + 1) + 'px'
        setTimeout(() => {
          this.redrawAll()
        }, 0)
        this.offsetXChange(newVal, oldVal)
      }
    },
    offsetX(newVal, oldVal) {
      if (newVal !== oldVal) { this.onlineTime.style.left = this.offsetX + 'px' }
    }
  },
  created() {
  },
  mounted() {
    this.$refs.onlineTimeBox.style.height = this.timeAllHeight + 'px'
    setTimeout(() => {
      this.onlineTime = this.$refs.onlineTime
      this.onlineTimeWidth = this.onlineTime.offsetWidth
      this.titleDialWidth = this.onlineTimeWidth / 25
      this.dialWidth = (this.onlineTimeWidth - this.titleDialWidth) / 24
      this.afterFullWidth = this.$refs.onlineTimeBox.offsetWidth
      this.redrawWidth()
      this.redrawAll()
    }, 0)
  },
  methods: {
    redrawAll() { // 重绘
      this.redrawTitle()
      this.redrawLine()
    },
    redrawWidth() { // 设置大小
      this.titleDialWidth = this.$refs.onlineTimeBox.offsetWidth / 25
      this.dialWidth = (this.$refs.onlineTimeBox.offsetWidth - this.titleDialWidth) / 24
      this.onlineTime.style.width = this.titleDialWidth * (this.dialNumber + 1) + 'px'
    },
    redrawTitle() { // 绘制标题
      Array.from(document.querySelectorAll('.onlineTime .title-time')).forEach((item, index) => {
        item.style.backgroundColor = this.headerColor
        item.style.width = this.titleDialWidth + 'px'
        let hours = Math.floor(index * this.interval / 60) < 10 ? ('0' + Math.floor(index * this.interval / 60)) : Math.floor(index * this.interval / 60)
        let minutes = (index * this.interval % 60) < 10 ? ('0' + (index * this.interval % 60)) : (index * this.interval % 60)
        let times = hours + ':' + minutes
        item.innerHTML = times
      })
    },
    redrawLine() { // 绘制每条信息
      Array.from(document.querySelectorAll('.onlineTime .line')).forEach(item => {
        item.style.marginLeft = this.titleDialWidth / 2 + 'px'
        item.style.marginRight = this.titleDialWidth / 2 + 'px'
        item.style.marginTop = this.lineSpacing
      })
      Array.from(document.querySelectorAll('.onlineTime .line')).forEach((item, i) => {
        item.innerHTML = ''
        item.style.backgroundColor = this.basicColor
        if (!this.detailData[i]) { return }
        this.detailData[i].forEach((data, j) => {
          let startHours = new Date(Number(data.startTime)).getHours()
          let startMinutes = new Date(Number(data.startTime)).getMinutes()
          let startSeconds = new Date(Number(data.startTime)).getSeconds()
          let endHours = new Date(Number(data.endTime)).getHours()
          let endMinutes = new Date(Number(data.endTime)).getMinutes()
          let endSeconds = new Date(Number(data.endTime)).getSeconds()
          let sTime = startHours * 60 + startMinutes + startSeconds / 60
          let eTime = endHours * 60 + endMinutes + endSeconds / 60
          let dialNumber = sTime / this.interval
          let timeLength = (eTime - sTime) / this.interval
          let oDiv = document.createElement('div')
          oDiv.style.left = dialNumber * this.dialWidth + 'px'
          oDiv.style.width = timeLength * this.dialWidth + 'px'
          oDiv.style.height = this.lineWidth + 'px'
          oDiv.style.position = 'absolute'
          oDiv.style.cursor = 'pointer'
          oDiv.style.borderRadius = 10 + 'px'
          oDiv.style.zIndex = 9
          startHours < 10 && (startHours = '0' + startHours)
          startMinutes < 10 && (startMinutes = '0' + startMinutes)
          startSeconds < 10 && (startSeconds = '0' + startSeconds)
          endHours < 10 && (endHours = '0' + endHours)
          endMinutes < 10 && (endMinutes = '0' + endMinutes)
          endSeconds < 10 && (endSeconds = '0' + endSeconds)
          const str = `${startHours}:${startMinutes}:${startSeconds}~${endHours}:${endMinutes}:${endSeconds}`
          if (data.type === 1) {
            oDiv.title = this.onlineName + '：' + str
            oDiv.style.backgroundColor = this.onlineColor
          } else if (data.type === 2) {
            oDiv.title = this.offlineName + '：' + str
            oDiv.style.backgroundColor = this.offlineColor
          } else {
            oDiv.title = this.baseName + '：' + str
            oDiv.style.backgroundColor = this.basicColor
          }
          item.appendChild(oDiv)
        })
      })
    },
    amplification() { // 放大
      if (this.multiple < 4) {
        this.isShrink = false
        this.multiple++
      }
    },
    shrink() { // 缩小
      if (this.multiple > 1) {
        this.isShrink = true
        this.multiple--
      }
    },
    scrollFunc(e) { // 监听滚轮事件
      e = e || window.event
      e.preventDefault()
      if (e.deltaY) {
        if (e.deltaY > 0) { // 当滑轮向下滚动时
          this.shrink()
        }
        if (e.deltaY < 0) { // 当滑轮向上滚动时
          this.amplification()
        }
      }
    },
    mouseDown(event) { // 鼠标按下
      this.disabledDrag = false
      let e = event || window.event
      this.screenX = e.screenX
    },
    mouseUp() { // 鼠标抬起
      this.disabledDrag = true
    },
    mouseMove(event) { // 鼠标移动
      if (this.disabledDrag || this.multiple === 1) { return }
      let e = event || window.event
      this.offsetX = this.offsetX - (this.screenX - e.screenX)
      this.screenX = e.screenX
      if (this.offsetX >= 0) {
        this.offsetX = 0
      } else if (this.offsetX < (-(this.dialWidth * this.dialNumber + this.titleDialWidth - this.titleDialWidth * 25))) {
        this.offsetX = -((this.dialWidth * this.dialNumber + this.titleDialWidth - this.titleDialWidth * 25))
      }
    },
    offsetXChange(newVal, oldVal) { // 偏移量计算
      newVal = newVal || this.dialNumber
      oldVal = oldVal || this.dialNumber
      switch (this.multiple) {
        case 1:
          this.offsetX = 0
          break
        case 2:
          if (this.isShrink) {
            this.offsetX = (this.offsetX + this.dialWidth * 6 * 2) * (newVal / oldVal)
          } else {
            this.offsetX = (this.offsetX - this.dialWidth * 6) * (newVal / oldVal)
          }
          if (this.offsetX > 0) {
            this.offsetX = 0
          }
          if (this.offsetX < -(this.dialWidth * this.dialNumber + this.titleDialWidth - this.titleDialWidth * 25)) {
            this.offsetX = -(this.dialWidth * this.dialNumber + this.titleDialWidth - this.titleDialWidth * 25)
          }
          break
        case 3:
          if (this.isShrink) {
            this.offsetX = (this.offsetX + this.dialWidth * 6 * 4) * (newVal / oldVal)
          } else {
            this.offsetX = (this.offsetX - this.dialWidth * 6) * (newVal / oldVal)
          }
          if (this.offsetX > 0) {
            this.offsetX = 0
          }
          if (this.offsetX < -(this.dialWidth * this.dialNumber + this.titleDialWidth - this.titleDialWidth * 25)) {
            this.offsetX = -(this.dialWidth * this.dialNumber + this.titleDialWidth - this.titleDialWidth * 25)
          }
          break
        case 4:
          if (this.isShrink) {
          } else {
            this.offsetX = (this.offsetX - this.dialWidth * 8) * (newVal / oldVal)
          }
          if (this.offsetX > 0) {
            this.offsetX = 0
          }
          if (this.offsetX < -(this.dialWidth * this.dialNumber + this.titleDialWidth - this.titleDialWidth * 25)) {
            this.offsetX = -(this.dialWidth * this.dialNumber + this.titleDialWidth - this.titleDialWidth * 25)
          }
          break
      }
    },
    fullscreen() { // 全屏
      setTimeout(() => {
        if (this.$refs.onlineTimeBox) {
          this.widthMultiple = this.$refs.onlineTimeBox.offsetWidth / this.afterFullWidth
          this.offsetX *= this.widthMultiple
          this.afterFullWidth = this.$refs.onlineTimeBox.offsetWidth
        }
        this.redrawWidth()
        this.redrawAll()
      }, 0)
    }
  }
}
</script>

<style scoped>
.onlineTime-box {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
}
.onlineTime {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
}
.title {
  display: flex;
  flex: 1 0;
}
.title-time {
  /* display: inline-block; */
  background-color: black;
  height: 32px;
  flex: 1 0;
  text-align: center;
  line-height: 32px;
}
.line {
  /* width: 100%; */
  display: flex;
  height: 16px;
  margin-top: 10px;
  /* background-color: rgb(189, 32, 32); */
  border-radius: 10px;
  box-sizing: border-box;
  position: relative;
}
</style>
