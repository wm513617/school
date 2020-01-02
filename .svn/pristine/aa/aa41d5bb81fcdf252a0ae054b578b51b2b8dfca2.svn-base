<template>
  <div style="position: relative;height: 40px">
    <div class="slider-container">
      <div class="slider-tips" v-show="showtip" :style="{left: `calc(${x} - 25px)`}">
        <iframe v-if="showtip"></iframe>
        {{curTimeStr}}
      </div>
      <Slider v-model="mvalue" show-tip="never" :disabled="disabled" @mousedown.native="!disabled&&mdown()" @mouseup.native="!disabled&&mup()" @on-change="ochange" @on-input="catchMouse">
      </Slider>
    </div>
    <div class="time-container">
      {{formatTime(value)}}/{{formatTime(allTime)}}
    </div>
  </div>
</template>
<script>
export default {
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
      svalue: 0,
      showtip: false,
      x: '0%'
    }
  },
  computed: {
    curTimeStr() {
      return this.formatTime(this.svalue)
    },
    mvalue: {
      get() {
        return this.svalue * 100 / this.allTime
      },
      set(v) {
        this.svalue = v * this.allTime / 100
      }
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
      this.$emit('on-change', v * this.allTime / 100)
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
      return [value, minutes, seconds]
        .map((item, index) => {
          if (index) {
            return ('00' + item).slice(-2)
          } else {
            return item
          }
        })
        .filter(item => item)
        .join(':')
    },
    catchMouse() {
      this.x = this.p.style.left || '0%'
    }
  },
  mounted() {
    this.p = this.$el.querySelector('.ivu-slider-button-wrap')
  },
  beforeDestroy() {
    this.p = null
  }
}
</script>
<style lang="less" scoped>
iframe {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border: 0 none;
  z-index: 0;
}

.slider-container {
  position: absolute;
  top: 5px;
  left: 10px;
  right: 10px;
}

.time-container {
  float: right;
  margin-right: 10px;
  line-height: 24px;
}

.slider-tips {
  position: absolute;
  width: 50px;
  height: 20px;
  line-height: 20px;
  top: -5px;
  background: #0f2343;
  text-align: center;
  color: #fff;
}

.slider-tips:after {
  position: absolute;
  display: block;
  content: '';
  border: 5px solid transparent;
  border-top-color: #0f2343;
  top: 20px;
  left: 20px;
}
</style>
