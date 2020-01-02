<template>
  <div style="position: relative;height: 40px">
    <div class="slider-container">
      <div class="slider-tips" v-show="showtip" :style="{left: `calc(${x} - 25px)`}">
        <iframe></iframe>
        {{curTimeStr}}
      </div>
      <Slider v-model="svalue" :max="allTime" show-tip="never" :disabled="disabled" @mousedown.native="!disabled&&mdown()" @mouseup.native="!disabled&&mup()" @on-change="ochange" @on-input="catchMouse">
      </Slider>
    </div>
    <div class="time-container">
      {{formatTime(value)}}/{{formatTime(allTime)}}
    </div>
  </div>
</template>
<script>
// import 'iview/dist/styles/iview.css'
import { Slider } from 'iview'
export default {
  name: 'bs-videoprogress',
  components: {
    Slider
  },
  props: {
    value: {
      type: Number
    },
    allTime: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      svalue: this.value,
      showtip: false,
      x: '0%'
    }
  },
  computed: {
    curTimeStr() {
      return this.formatTime(this.svalue)
    }
  },
  watch: {
    value() {
      this.svalue = this.value
    },
    svalue() {
      this.emit()
    }
  },
  methods: {
    emit() {
      this.$emit('input', this.svalue)
    },
    mdown() {
      this.showtip = true
      this.$emit('on-mousedown')
    },
    mup() {
      this.showtip = false
      this.$emit('on-mouseup')
    },
    ochange(v) {
      this.showtip = false
      this.$emit('on-change', v)
    },
    formatTime(value) {
      if (!value) {
        value = 0
      }
      value = parseInt(value / 1000)
      const seconds = value % 60
      value = parseInt(value / 60)
      const minutes = value % 60
      value = parseInt(value / 60)
      return [value, minutes, seconds].map((item, index) => {
        if (index) {
          return ('00' + item).slice(-2)
        } else {
          return item
        }
      }).filter(item => item).join(':')
    },
    catchMouse() {
      this.x = this.p.style.left || '0%'
    }
  },
  mounted() {
    this.p = this.$el.querySelector('.ivu-slider-button-wrap')
    this.catchMouse()
  },
  beforeDestroy() {
    this.p = null
  }
}
</script>
<style lang="stylus" scoped>
iframe
  position absolute
  left 0
  top 0
  width 100%
  height 100%
  border 0 none
  z-index 0
.slider-container
  position absolute
  top 5px
  left 10px
  right 10px
.time-container
  float right
  margin-right 10px
  line-height 24px
.slider-tips
  position absolute
  width 50px
  height 20px
  line-height @height
  top -5px
  background #474747
  text-align center
  color #fff
.slider-tips:after
  position absolute
  display block
  content ""
  border 5px solid transparent
  border-top-color #474747
  top 20px
  left 20px
</style>
<style lang="stylus">
.slider-container .ivu-slider-button-wrap
  top -7px
</style>
