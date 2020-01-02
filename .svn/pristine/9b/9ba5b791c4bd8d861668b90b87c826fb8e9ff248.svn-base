<template>
  <div>
    <div class="scrollbar" :class="{disable: !hasContentToSroll}" :style="{margin: `0 ${doption.margin}`, background: doption.background, width: doption.width, height: `${trackSize}px`}" onselectstart="return false">
      <div class="track" :style="{height: `${trackSize}px`}" @mousedown.self="start($event, true)" @mouseup="end">
        <div class="thumb" :style="{background: doption.color, top: `${thumbPositionValue}px`, height: `${thumbSize}px`}" @mousedown="start">
          <div class="end"></div>
        </div>
      </div>
    </div>
    <div class="viewport">
      <div class="overview" :style="{top: `${-contentPosition}px`}" @mousewheel.stop="wheel">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import './tinyscrollbar.css'
export default {
  props: {
    option: {
      type: Object
    },
    wheelSpeed: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      contentPosition: 0, // >0为超出视口，0为没有超出视口
      thumbPosition: 0, // 滑块移动的比例的相反数
      contentSize: 0, // 视口内的可活动的div的高度
      viewportSize: 0, // 左侧列表视口的高度
      trackRatio: 0, // 滑块可以移动和窗口可以的移动长度的比例
      trackSize: 0, // 滚轴的滑动区域的高度
      thumbSize: 0, // 滚轴的滑块的高度
      contentRatio: 0, // 实际高度与视口的高度比
      hasContentToSroll: false, // true:有超出视口;false:没有超出视口
      tempStop: false,
      mousePosition: 0,
      thumbPositionCalc: null, // 点击后所移动的值
      thumbSizeMin: 20, // 滚轴的滑块的最小值高度
      doption: {
        color: '#909090',
        background: '#e3e3e3',
        width: '10px',
        margin: '0'
      }
    }
  },
  computed: {
    thumbPositionValue() { // 滑块距离父级上边距的距离
      return this.thumbPositionCalc === null ? this.thumbPosition : this.thumbPositionCalc
    }
  },
  methods: {
    wheel(e) { // 滚轮事件
      if (this.hasContentToSroll) { // 有超出视口，有滚轴
        const wheelSpeedDelta = -(e.deltaY || e.detail || (1 / 3 * e.wheelDelta)) / 40 // 每次滚动系数为2.5
        this.contentPosition -= wheelSpeedDelta * this.wheelSpeed // 每次滚动40
        this.contentPosition = Math.min((this.contentSize - this.viewportSize), Math.max(0, this.contentPosition))
        this.thumbPosition = this.contentPosition / this.trackRatio
        if (this.isAtBegin() || this.isAtEnd()) {
          e.preventDefault()
        }
      }
    },
    isAtBegin() {
      return this.contentPosition > 0
    },
    isAtEnd() {
      return this.contentPosition <= (this.contentSize - this.viewportSize) - 5
    },
    updateScroll(scrollTo) { // 计算各种高度
      this.viewportSize = this.$viewport.offsetHeight // 左侧列表视口的高度
      this.contentSize = this.$overview.scrollHeight // 视口内的可活动的div的高度
      this.contentRatio = this.viewportSize / this.contentSize // 实际高度与视口的高度比
      this.trackSize = this.viewportSize // 滚轴的滑动区域的高度
      this.thumbSize = Math.min(this.trackSize, Math.max(this.thumbSizeMin, this.trackSize * this.contentRatio))
      this.trackRatio = (this.contentSize - this.viewportSize) / (this.trackSize - this.thumbSize)
      this.hasContentToSroll = this.contentRatio < 1 // true为有超出视口，有滚轴

      switch (scrollTo) {
        case 'bottom':
          this.contentPosition = Math.max(this.contentSize - this.viewportSize, 0) // >0为超出视口，0为没有超出视口
          break

        case 'relative':
          this.contentPosition = Math.min(Math.max(this.contentSize - this.viewportSize, 0), Math.max(0, this.contentPosition))
          break

        default:
          this.contentPosition = parseInt(scrollTo, 10) || 0
      }
      this.thumbPosition = this.contentPosition / this.trackRatio
    },
    start(e, gotoMouse) { // 鼠标按下的事件
      if (this.hasContentToSroll) { // 有超出视口，有滚轴
        this.mousePosition = gotoMouse ? this.$thumb.getBoundingClientRect().top : e.clientY // true为点击没有滑块的区域，false为点击滑块时相对于浏览器的垂直坐标标
        document.body.classList.add('noSelect') // 添加元素类
        document.addEventListener('mousemove', this.drag) // 添加监听，监听鼠标移入事件
        document.addEventListener('mouseup', this._end) // 添加监听，监听鼠标移出事件
        this.drag(e)
      }
    },
    end() { // 鼠标抬起的事件
      this.thumbPosition = parseInt(this.thumbPositionCalc, 10)
      this.thumbPositionCalc = null
      document.removeEventListener('mousemove', this.drag) // 移出监听，监听鼠标移入事件
      document.removeEventListener('mouseup', this._end) // 移出监听，监听鼠标移出事件
      document.body.classList.remove('noSelect') // 移出元素
    },
    _drag(e) { // 鼠标点击事件
      if (this.hasContentToSroll) { // 有超出视口，有滚轴
        const mousePositionNew = e.clientY // 鼠标点击时相对于浏览器的垂直坐标
        const thumbPositionDelta = mousePositionNew - this.mousePosition // 鼠标点击后移动的距离
        const thumbPositionNew = Math.min((this.trackSize - this.thumbSize), Math.max(0, this.thumbPosition + thumbPositionDelta))
        this.contentPosition = thumbPositionNew * this.trackRatio
        this.thumbPositionCalc = thumbPositionNew
        if (isNaN(thumbPositionNew)) {
          this.thumbPositionCalc = 0
        }
      }
    }
  },
  created() {
    Object.assign(this.doption, Vue.ScrollOption)
    Object.assign(this.doption, this.option)
  },
  mounted() {
    this.$viewport = this.$el.querySelector('.viewport') // 左侧列表视口
    this.$overview = this.$el.querySelector('.overview') // 视口内的可活动的div
    this.$thumb = this.$el.querySelector('.thumb') // 滚轴的滑块
    this.drag = this._drag.bind(this)
    this._end = this.end.bind(this)
    this.updateScroll()
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.drag)
    document.removeEventListener('mouseup', this._end)
    delete this.$viewport
    delete this.$overview
    delete this.$thumb
    delete this.drag
    delete this._end
  }
}
</script>
