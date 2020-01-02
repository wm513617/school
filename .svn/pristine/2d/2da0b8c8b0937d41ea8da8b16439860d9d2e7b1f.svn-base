<!--
 <Slider
  v-model=""            // value Type Number      描述：值
  range="true"          // value Type Boolean     描述：是否水平展示
  reversed="false"      // value Type Boolean     描述：是否反向移动
  color="red"           // value Type String      描述：进度条颜色
  showInput="false"     // value Type Boolean     描述：input 是否显示
  @change=""            // value Type Function    描述：值改变事件
 />
-->
<template>
  <div :class="[sliderClass, disabled ? sliderClass + '-disabled': '']" @mouseover="mouse(true)" @mouseleave="mouse(false)">
    <div :class="wrapClass" @click.stop="sliderClick" :style="wrapStyle">
      <div :class="[sliderClass + '-wrap-button']" :style="buttonStyle" @mousedown.stop="onButtonDown"></div>
      <div :class="[sliderClass + '-wrap-progress']" :style="progressStyle"></div>
    </div>
    <input :class="[sliderClass + '-input']" type="text" style="height: 18px;background:#12243f;color:#fffafa;border:0;" v-show="range && showInput" v-model='sliderValue' :disabled="disabled" @input="input" @change="$emit('change',sliderValue)" />
  </div>
</template>
<script>
import './style/slider.less'
const prefixCls = 'bsr-slider'

const BUTTON_SEAT_FINE_SIZE = 6
export default {
  name: 'Slider',
  props: {
    size: {
      type: Number,
      default: 100
    },
    value: {
      type: Number,
      default: 0
    },
    range: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    showInput: {
      type: Boolean,
      default: false
    },
    // 反向移动
    reversed: {
      type: Boolean,
      default: false
    },
    // 进度颜色
    color: {
      type: String,
      default: 'red'
    },
    // 背景颜色
    backgroundColor: {
      type: String,
      default: 'rgb(85,118,170)'
    },
    // 最小值
    minValue: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      prefixCls: prefixCls,
      dragging: false,
      sliderClass: prefixCls + (this.range ? '-horizontal' : '-vertical'),
      changeProperty: this.range ? 'width' : 'height',
      realLength: this.size - this.minValue,
      sliderValue: (() => {
        if (this.value < this.minValue) { return this.minValue }
        if (this.value > this.size) { return this.size }
        return this.value
      })(),
      // (水平 or 垂直) 进度条尺寸
      sliderWrapSize: 0,
      // (水平 or 垂直) 滑块位置
      buttonSeat: -BUTTON_SEAT_FINE_SIZE,
      moveButtonSeat: 0,
      // 边距：组件距离浏览器边框的距离
      borderDistance: 0,
      // 进度：单位 百分比
      progress: 0,
      sliderWrap: {/* slider 容器 Element */ }
    }
  },
  created() {
    this.bindedOnDragging = (e) => {
      this.onDragging(e)
    }
    this.bindedOnDragEnd = (e) => {
      this.onDragEnd(e)
    }
    this.bindedUpdateData = () => {
      this.updateData()
    }
    this.bindedKeyDown = (e) => {
      this.keydown(e)
    }
    this.bindedKeyUp = (e) => {
      this.keyup(e)
    }
  },
  mounted() {
    this.inintMounted()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.bindedUpdateData)
    window.removeEventListener('mousemove', this.bindedOnDragging)
    window.removeEventListener('mouseup', this.bindedOnDragEnd)
    window.removeEventListener('keydown', this.bindedKeyDown)
    window.removeEventListener('keyup', this.bindedKeyUp)
    this.mouse(false)
    this.bindedOnDragging = null
    this.bindedOnDragEnd = null
    this.bindedUpdateData = null
    this.bindedKeyDown = null
    this.bindedKeyUp = null
  },
  computed: {
    wrapClass() {
      return [
        `${this.sliderClass}-wrap`,
        {
          [`${this.sliderClass}-wrap-input`]: this.range && this.showInput
        }
      ]
    },
    wrapStyle() {
      return {
        [this.range ? 'width' : 'height']: `${this.sliderWrapSize}px`,
        'background-color': this.reversed ? this.color : this.backgroundColor
      }
    },
    buttonStyle() {
      return {
        [this.range ? 'left' : 'top']: `${this.buttonSeat}px`
        // 'border-color': this.color
      }
    },
    progressStyle() {
      return {
        [this.range ? 'width' : 'height']: `${this.progress}px`,
        'background-color': this.reversed ? this.backgroundColor : this.color
      }
    },
    virtualValue() {
      return this.reversed ? this.size - this.sliderValue : this.sliderValue - this.minValue
    }
  },
  watch: {
    value(newValue) {
      if (newValue < this.minValue) {
        this.sliderValue = this.minValue
      } else if (newValue > this.size) {
        this.sliderValue = this.size
      } else {
        this.sliderValue = newValue
      }
    },
    sliderValue(newValue) {
      if (this.sliderValue === '') { this.sliderValue = this.minValue }
      this.sliderValue = parseInt(this.sliderValue)
      if (this.sliderValue < 0) { this.sliderValue = this.minValue }
      if (this.sliderValue > this.size) { this.sliderValue = this.size }
      this.$emit('input', this.sliderValue)
      this.buttonSeat = this.getButtonSeat()
    },
    sliderWrapSize() {
      this.buttonSeat = this.getButtonSeat()
      // - BUTTON_SEAT_FINE_SIZE
    },
    moveButtonSeat(newValue) {
      this.sliderValue = this.getSliderValue()
    },
    buttonSeat(newValue) {
      this.progress = newValue + BUTTON_SEAT_FINE_SIZE
    }
  },
  methods: {
    getSliderValue() {
      const value = Math.round(parseInt(this.moveButtonSeat) * this.realLength / this.sliderWrapSize)
      return this.reversed ? (this.size - value) : value + this.minValue
    },
    input() {
      this.sliderValue = this.sliderValue.replace(/[^0-9]/g, '')
    },
    getButtonSeat() {
      return (this.virtualValue * this.sliderWrapSize / this.realLength) - BUTTON_SEAT_FINE_SIZE
    },
    inintMounted() {
      this.sliderWrap = this.$el.querySelector(`div.${this.sliderClass}-wrap`)
      window.addEventListener('resize', this.bindedUpdateData)
      this.tid = setTimeout(() => { this.updateData() }, 0)
    },
    updateData() {
      if (this.tid) { delete this.tid }
      const sliderSize = this.$el[this.range ? 'clientWidth' : 'clientHeight']
      if (this.range) {
        this.sliderWrapSize = (this.showInput ? (sliderSize - 44) : sliderSize) - 25
      } else {
        this.sliderWrapSize = sliderSize - 20
      }
    },
    getMoveButtonSeat(event) {
      return this.getEventSeat(event) - this.borderDistance
    },
    sliderClick(event) {
      this.borderDistance = this.sliderWrap.getBoundingClientRect()[this.range ? 'left' : 'top']
      if (this.disabled) {
        return
      }
      this.borderDistance = this.sliderWrap.getBoundingClientRect()[this.range ? 'left' : 'top']
      this.moveButtonSeat = this.getMoveButtonSeat(event)
      if (this.dragging === false) {
        this.$emit('change', this.getSliderValue())
      }
    },
    onButtonDown(event) {
      if (this.disabled) { return }
      event.preventDefault()
      this.onDragStart(event)
      this.$emit('on-mousedown')
      window.addEventListener('mousemove', this.bindedOnDragging)
      window.addEventListener('mouseup', this.bindedOnDragEnd)
    },
    getEventSeat(event) {
      return this.range ? event.clientX : event.clientY
    },
    onDragStart(event) {
      this.dragging = true
      this.borderDistance = this.getEventSeat(event) - this.buttonSeat
    },
    onDragging(event) {
      if (this.dragging) {
        this.moveButtonSeat = this.getMoveButtonSeat(event)
      }
    },
    onDragEnd() {
      if (this.dragging) {
        this.$emit('change', this.sliderValue)
        this.$emit('on-mouseup')
        this.dragging = false
        window.removeEventListener('mousemove', this.bindedOnDragging)
        window.removeEventListener('mouseup', this.bindedOnDragEnd)
      }
    },
    mouse(state) {
      this.state = state
      window[state ? 'addEventListener' : 'removeEventListener']('keydown', this.bindedKeyDown)
      window[state ? 'addEventListener' : 'removeEventListener']('keyup', this.bindedKeyUp)
    },
    keydown({ keyCode }) {
      if (this.range) {
        const direction = this.reversed ? -1 : 1
        if (keyCode === 39 /* 右 */) {
          this.sliderValue += direction * 1
        }
        if (keyCode === 37 /* 左 */) {
          this.sliderValue -= direction * 1
        }
      } else {
        const direction = this.reversed ? 1 : -1
        if (keyCode === 38 /* 上 */) {
          this.sliderValue += direction * 1
        }
        if (keyCode === 40 /* 下 */) {
          this.sliderValue -= direction * 1
        }
      }
    },
    keyup({ keyCode }) {
      if (this.range && (keyCode === 37 || keyCode === 39)) {
        this.$emit('change', this.getSliderValue())
      } else if (this.range === false && (keyCode === 38 || keyCode === 40)) {
        this.$emit('change', this.getSliderValue())
      }
    }
  }
}
</script>

<style scoped>
.bsr-slider-horizontal-disabled .bsr-slider-horizontal-wrap-progress {
  background-color: #5576aa !important;
}

.bsr-slider-horizontal-disabled .bsr-slider-horizontal-wrap-button {
  border-color: #5576aa !important;
}
.bsr-slider-horizontal-wrap-button {
  border-radius: 50%;
  border: 0;
  background-image: -webkit-linear-gradient(
    90deg,
    rgb(112, 144, 197) 0%,
    rgb(131, 162, 213) 100%
  );
  background-image: -ms-linear-gradient(
    90deg,
    rgb(112, 144, 197) 0%,
    rgb(131, 162, 213) 100%
  );
  background-image: linear-gradient(
    90deg,
    rgb(112, 144, 197) 0%,
    rgb(131, 162, 213) 100%
  );
  box-shadow: 0px 3px 5px 0px rgba(24, 43, 76, 0.004),
    inset 0px 1px 0px 0px rgba(188, 211, 248, 0.004),
    inset 0px -1px 0px 0px rgba(40, 57, 85, 0.004);
}
</style>
