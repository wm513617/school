<template>
  <div style="position: relative;height: 40px">
    <div class="slider-container">
      <!-- <div class="slider-tips" v-show="showtip" :style="{left: `calc(${x} - 25px)`}">
        <iframe></iframe>
        {{curTimeStr}}
      </div> -->
      <Slider v-model="svalue" :max="allTime" show-tip="never" :disabled="disabled" @mousedown.native="!disabled&&mdown()" @mouseup.native="!disabled&&mup()" @on-change="ochange" @on-input="catchMouse">
      </Slider>
    </div>
    <div class="time-container">
      {{curTimeStr}}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number
    },
    // 总时长
    allTime: {
      type: Number
    },
    // 进度条是否可以拖动
    disabled: {
      type: Boolean,
      default: false
    },
    // 基础时间
    basics: {
      type: Number,
      default: 0
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
      return this.formatTime((+this.basics))
    }
  },
  watch: {
    value() {
      this.svalue = this.value
    },
    svalue(newVal) {
      this.emit()
    }
  },
  methods: {
    emit() {
      this.$emit('input', this.svalue)
    },
    // 鼠标按下进度条
    mdown() {
      console.log(14)
      this.showtip = true
      this.$emit('on-mousedown')
    },
    // 鼠标抬起进度条
    mup() {
      this.showtip = false
      this.$emit('on-mouseup', this.svalue)
    },
    ochange(v) {
      this.showtip = false
      console.log('vvv=>', v)
      this.$emit('on-change', v)
    },
    formatTime(value) {
      if (!value) {
        value = 0
        return '00:00:00'
      }
      const tempTiem = new Date(value)
      return ('00' + tempTiem.getHours()).slice(-2) + ':' + ('00' + tempTiem.getMinutes()).slice(-2) + ':' + ('00' + tempTiem.getSeconds()).slice(-2)
      // value = parseInt(value / 1000)
      // const seconds = value % 60getMilliseconds
      // value = parseInt(value / 60)
      // const minutes = value % 60
      // value = parseInt(value / 60)
      // return [value, minutes, seconds].map((item, index) => {
      //   if (index) {
      //     return ('00' + item).slice(-2)
      //   } else {
      //     return item
      //   }
      // }).filter(item => item).join(':')
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
  left: 10px;
  right: 10px;
}

.time-container {
  float: right;
  margin-right: 10px;
  line-height: 14px;
}

.slider-tips {
  position: absolute;
  width: 50px;
  height: 20px;
  line-height: 20px;
  top: -5px;
  background: #474747;
  text-align: center;
  color: #fff;
}

.slider-tips:after {
  position: absolute;
  display: block;
  content: '';
  border: 5px solid transparent;
  border-top-color: #474747;
  top: 20px;
  left: 20px;
}
</style>
