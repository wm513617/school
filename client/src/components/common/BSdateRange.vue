<template>
  <div class="checkdate" :class="{active: disable}" ref='box' :style="{width:width + 'px',height:height + 'px'}">
    <input type="text"
            readonly
            :disabled="disable"
            :class="{active: disable}"
            class="timebox form-control"
            :placeholder="placeholder"
            v-model='checkTimeStart'
            :style="{width:width + 'px'}"
            v-on:change='changecheck1'
            ref='input'
            @blur="blur"
            @click.stop='calendarclick'/>
    <label class="iconfont" @click.stop='calendarclick' @mouseenter='mouseover' @mouseleave='mouseout'>&#xe637;</label>
    <calendar v-if='isCalendar'
              showtime=true
              class='calendars'
              :style="{top: top + 'px',width:width + 'px'}"
              @checktimes="getStart"
              :defaultdate='defaultdate'
              :timesback='timesBackStart'
              @click.native='calendarclick'
              @mouseenter.native='mouseover'
              @mouseleave.native='mouseout'></calendar>
  </div>
</template>

<script>
import calendar from './Calendar.vue'
export default {
  name: 'BSdateRange',
  components: {
    calendar
  },
  props: {
    datetime: { // 默认值
      type: [String, Date ]
    },
    width: {
      type: Number,
      default: 160
    },
    height: {
      type: Number,
      default: 26
    },
    disable: { // 置灰
      type: Boolean,
      default: false
    },
    upside: { // 日历展开方向
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择时间'
    }
  },
  data() {
    return {
      checkTimeStart: '',
      isCalendar: false,
      timesTampStart: '',
      timesBackStart: { time: '', newTime: '' },
      defaultdate: '',
      // left: '',
      top: '',
      move: false
    }
  },
  methods: {
    getStart(msg) {
      this.checkTimeStart = msg.time
      this.isCalendar = false
      this.timesTampStart = msg.t
      this.$emit('timeChange', { date: this.checkTimeStart, dateTimes: this.timesTampStart })
    },
    changecheck1: function() {
      this.isCalendar = false
    },
    calendarclick: function(e) {
      this.isCalendar = true
    },
    bindedOnClick() {
      this.isCalendar = false
    },
    resizefun() {
      let dom = this.$refs.box.getBoundingClientRect()
      if (this.upside) {
        this.top = dom.top - 292
      } else {
      }
    },
    mouseover() {
      this.move = true
    },
    mouseout() {
      this.move = false
      this.$refs.input.focus()
    },
    blur() {
      if (!this.move) {
        this.isCalendar = false
      }
    }
  },
  created: function() {
    if (this.datetime) {
      if (typeof (this.datetime) === 'string') {
        this.checkTimeStart = this.datetime
      } else {
        this.checkTimeStart = this.$moment(this.datetime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.defaultdate = this.checkTimeStart
    }
  },
  watch: {
    datetime(val) {
      if (typeof (this.datetime) === 'string') {
        this.checkTimeStart = this.datetime
      } else {
        this.checkTimeStart = this.$moment(this.datetime).format('YYYY-MM-DD HH:mm:ss')
      }
      this.defaultdate = this.checkTimeStart
    }
  },
  mounted: function() {
    document.querySelector('body').addEventListener('click', this.bindedOnClick)
    let dom = this.$refs.box.getBoundingClientRect()
    if (this.upside) {
      this.top = dom.top - 292
    } else {
    }
    window.addEventListener('resize', this.resizefun)
  },
  beforeDestroy() {
    document.querySelector('body').removeEventListener('click', this.bindedOnClick)
    this.bindedOnClick = null
    window.removeEventListener('resize', this.resizefun)
    this.resizefun = null
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
}

.checkdate {
  width: 100%;
  position: relative;
  border-radius: 3px;
  color: #fff;
  height: 100%;
  font-size: 14px;
}
.active{
  background: #535f77;
  color: #cacaca!important;
  pointer-events:none;
}

.checkdate label {
  position: absolute;
  /* color: #fff; */
  font-size: 18px;
  right: 4px;
  top: 50%;
  transform: translate(0,-50%);
  cursor: pointer;
}

.timebox {
  height: 100%;
  padding: 0 10px;
  color: #fff;
  border-radius: 3px;
  font-size: 12px;
  cursor: default;
  background: rgba(0, 0, 0, 0);
  border: 1px solid #5676a9;
}

.calendars {
  margin: 5px 0;
  position: fixed;
  z-index: 1000000;
}

</style>
