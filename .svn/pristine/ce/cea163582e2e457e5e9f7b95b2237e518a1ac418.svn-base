<template>
  <div ref="canvasBox" class="canvas-Box">
    <canvas ref="line" style="border:0" class="canvas-style" @wheel.stop="scrollFunc" @click.stop="mouseUp" @mousedown.stop="mouseDown" @mousemove.stop="mouseMove" @mouseup.stop="mouseUp" @mouseout.stop="mouseUp"></canvas>
  </div>
</template>

<script>
export default {
  name: 'OnlineCanvas',
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
    offlineColor: {
      type: String,
      default: '#ddd'
    },
    canvasHeight: {
      type: Number,
      default: 600
    }
  },
  data() {
    return {
      interval: 60,
      canvas: null,
      ctx: null,
      canvasBox: null,
      resizeFn: null,
      canvasWidth: 1,
      canvasBoxWidth: 1,
      canvasBoxHeight: 1,
      offsetX: 0,
      screenX: 0,
      multiple: 1,
      disabledDrag: true,
      isShrink: 1,
      throttleRepaint: null
    }
  },
  computed: {
    DialNumber() {
      return 60 * 24 / this.interval
    },
    DialWidth() {
      return (this.canvasBoxWidth - 40) / 24
    },
    headline() {
      if (this.headerShow) {
        return this.headerHeight + this.lineSpacing
      } else {
        return 0
      }
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
    DialNumber(newVal, oldVal) {
      switch (this.multiple) {
        case 1:
          this.offsetX = 0
          break
        case 2:
          if (this.isShrink) {
            this.offsetX = (this.offsetX + this.DialWidth * 6 * 2) * (newVal / oldVal)
          } else {
            this.offsetX = (this.offsetX - this.DialWidth * 6) * (newVal / oldVal)
          }
          if (this.offsetX > 16) {
            this.offsetX = 0
          }
          if (this.offsetX < -(this.DialWidth * this.DialNumber - this.canvasWidth)) {
            this.offsetX = -(this.DialWidth * this.DialNumber - this.canvasWidth + 40)
          }
          break
        case 3:
          if (this.isShrink) {
            this.offsetX = (this.offsetX + this.DialWidth * 6 * 4) * (newVal / oldVal)
          } else {
            this.offsetX = (this.offsetX - this.DialWidth * 6) * (newVal / oldVal)
          }
          if (this.offsetX > 16) {
            this.offsetX = 0
          }
          if (this.offsetX < -(this.DialWidth * this.DialNumber - this.canvasWidth)) {
            this.offsetX = -(this.DialWidth * this.DialNumber - this.canvasWidth + 40)
          }
          break
        case 4:
          if (this.isShrink) {
          } else {
            this.offsetX = (this.offsetX - this.DialWidth * 8) * (newVal / oldVal)
          }
          if (this.offsetX > 16) {
            this.offsetX = 0
          }
          if (this.offsetX < -(this.DialWidth * this.DialNumber - this.canvasWidth)) {
            this.offsetX = -(this.DialWidth * this.DialNumber - this.canvasWidth + 40)
          }
          break
      }
    },
    interval(newVal, oldVal) {
      if (newVal !== oldVal) { this.repaint() }
    },
    offsetX(newVal, oldVal) {
      if (newVal !== oldVal) {
        // this.throttleRepaint()
        this.repaint()
      }
    },
    detailData: {
      handler(newVal, oldVal) {
        this.resizeFn()
        this.repaint()
      },
      deep: true
    },
    canvasHeight(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.resizeFn()
        this.repaint()
      }
    }
  },
  created() {
  },
  mounted() {
    this.init()
    this.throttleRepaint = this.$lodash.throttle(this.repaint, 50)
  },
  methods: {
    init() {
      this.canvas = this.$refs.line
      this.canvasBox = this.$refs.canvasBox
      this.canvasOrientation = this.$refs.canvasOrientation
      this.ctx = this.canvas.getContext('2d')
      this.resizeFn = () => {
        this.canvasBoxWidth = this.canvasBox.offsetWidth
        this.canvasBoxHeight = this.canvasBox.offsetHeight
        // this.canvasWidth = this.DialWidth * this.DialNumber + 34
        this.canvasWidth = this.canvasBoxWidth
        this.canvas.width = this.canvasWidth
        this.canvas.height = this.canvasHeight
        // this.draw()
      }
      this.resizeFn()
      this.repaint()
    },
    repaint() {
      // this.resizeFn()
      this.$nextTick(() => {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.drawheader()
        this.detailData.forEach((itme, index) => {
          this.drawLine(index)
          itme.forEach((j) => {
            this.drawTime(j.startTime, j.endTime, index)
          })
        })
      })
    },
    drawheader() {
      if (!this.headerShow) { return }
      this.ctx.fillStyle = this.basicColor
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0)'
      this.ctx.rect(0, 0, this.canvasWidth, this.headerHeight)
      this.ctx.fill()
      this.ctx.stroke()
      for (let i = 0; i < this.DialNumber + 1; i++) {
        this.ctx.font = '14px Arial'
        this.ctx.fillStyle = '#fff'
        let huor = parseInt(i * this.interval / 60)
        if (huor < 10) {
          huor = '0' + huor
        }
        let minute = i * this.interval % 60
        if (minute < 10) {
          minute = '0' + minute
        }
        let time = huor + ':' + minute
        this.ctx.fillText(time, this.DialWidth * i + this.offsetX, 20)
        this.ctx.font = '7px Arial'
        this.ctx.fillText('|', this.DialWidth * i + 16 + this.offsetX, 30)
      }
    },
    drawLine(index) {
      this.ctx.strokeStyle = this.basicColor
      this.ctx.lineWidth = this.lineWidth
      // this.ctx.lineCap = 'round'
      this.ctx.beginPath()
      this.ctx.moveTo(16 + this.offsetX, (this.headline + this.lineSpacing) + (this.lineWidth + this.lineSpacing) * index)
      this.ctx.lineTo(this.DialWidth * this.DialNumber + 34 - 18 + this.offsetX, (this.headline + this.lineSpacing) + (this.lineWidth + this.lineSpacing) * index)
      this.ctx.stroke()
      this.ctx.closePath()
    },
    drawTime(startTime, endTime, index) {
      let startHours = new Date(Number(startTime)).getHours()
      let startMinutes = new Date(Number(startTime)).getMinutes()
      let startSeconds = new Date(Number(startTime)).getSeconds()
      let endHours = new Date(Number(endTime)).getHours()
      let endMinutes = new Date(Number(endTime)).getMinutes()
      let endSeconds = new Date(Number(endTime)).getSeconds()
      let sTime = startHours * 60 + startMinutes + startSeconds / 60
      let eTime = endHours * 60 + endMinutes + endSeconds / 60
      this.ctx.strokeStyle = this.onlineColor
      this.ctx.lineWidth = this.lineWidth
      // this.ctx.lineCap = 'round'
      let DialNumber = sTime / this.interval
      let timeLength = (eTime - sTime) / this.interval
      this.ctx.beginPath()
      this.ctx.moveTo(DialNumber * this.DialWidth + 16 + this.offsetX, (this.headline + this.lineSpacing) + (this.lineWidth + this.lineSpacing) * index)
      this.ctx.lineTo((DialNumber + timeLength) * this.DialWidth + 16 + this.offsetX, (this.headline + this.lineSpacing) + (this.lineWidth + this.lineSpacing) * index)
      this.ctx.stroke()
      this.ctx.closePath()
    },
    amplification() {
      if (this.multiple < 4) {
        this.isShrink = false
        this.multiple++
      }
    },
    shrink() {
      if (this.multiple > 1) {
        this.isShrink = true
        this.multiple--
      }
    },
    mouseDown(event) {
      this.disabledDrag = false
      let e = event || window.event
      this.screenX = e.screenX
    },
    mouseUp() {
      this.disabledDrag = true
    },
    mouseMove(event) {
      if (this.disabledDrag || this.multiple === 1) { return }
      let e = event || window.event
      this.offsetX = this.offsetX - (this.screenX - e.screenX)
      this.screenX = e.screenX
      if (this.offsetX >= 0) {
        this.offsetX = 0
      } else if (this.offsetX < (-(this.DialWidth * this.DialNumber + 34) + this.canvasBoxWidth)) {
        this.offsetX = -(this.DialWidth * this.DialNumber + 34) + this.canvasBoxWidth
      }
    },
    scrollFunc(e) {
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
    }
  }
}
</script>

<style scoped>
.canvas-Box {
  width: 100%;
  height: 100%;
}
.canvas-style {
  cursor: pointer;
}
</style>
