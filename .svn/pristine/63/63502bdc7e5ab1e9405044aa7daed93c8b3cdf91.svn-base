<template>
  <div class="checkdate">
    <div type="text"
         v-if="editable"
         class="timebox editDiv"
         v-on:click='clicks'
         :style="{width:inputwidth + 'px'}">
      <div v-if="format === 'YMD'">
        <input type="text"
               v-model="edityear"
               @blur="changeDate"
               @click='editInputClick'
               class="year"
               @focus='yearFocus'>-
        <input type="text"
               v-model="editmonth"
               @blur="changeDate"
               @click='editInputClick'>-
        <input type="text"
               v-model="editday"
               @blur="changeDate"
               @click='editInputClick'>
      </div>
      <div v-else-if="format === 'MDY'">
        <input type="text"
               v-model="editmonth"
               @blur="changeDate"
               @click='editInputClick'>-
        <input type="text"
               v-model="editday"
               @blur="changeDate"
               @click='editInputClick'>-
        <input type="text"
               v-model="edityear"
               @blur="changeDate"
               @click='editInputClick'
               class="year">
      </div>
      <div v-else-if="format === 'DMY'">
        <input type="text"
               v-model="editday"
               @blur="changeDate"
               @click='editInputClick'>-
        <input type="text"
               v-model="editmonth"
               @blur="changeDate"
               @click='editInputClick'>-
        <input type="text"
               v-model="edityear"
               @blur="changeDate"
               @click='editInputClick'
               class="year">
      </div>

    </div>
    <input type="text"
           v-else
           :tabindex="tabindex"
           readonly
           class="timebox form-control"
           v-model='checkTimeStart'
           v-on:focus='clicks'
           :style="{width:inputwidth + 'px'}"
           v-on:change='changecheck1'
           @click='calendarclick' />
    <calendar v-show='hideStart.startF'
              class='calendars'
              @clicktest="getStart"
              :hide='hideStart'
              :defaultdate='defaultdate'
              :width='width'
              :timeLimit="timeLimit"
              :timesback='timesBack'
              @click='calendarclick'></calendar>
  </div>
</template>

<script>
import calendar from './BScalendar.vue'
export default {
  name: 'BScalendarInput',
  components: {
    calendar
  },
  props: {
    defaultdate: { type: String },
    width: {
      default: 244
    },
    tabindex: {
      type: [String, Number],
      default: 'none'
    },
    inputwidth: {
      default: 244
    },
    editable: {
      default: true
    },
    format: {
      default: 'YMD'
    },
    timeLimit: {
      default() {
        return {
          minTime: '1900-01-01',
          maxTime: '2100-01-01'
        }
      }
    }
  },
  watch: {
    edityear(newval) {
      newval = parseInt(newval) ? parseInt(newval) : 0
      // if (newval < parseInt(this.timeLimit.minTime.slice(0, 2))) { newval = parseInt(this.timeLimit.minTime.slice(0, 2)) }
      if (newval < 1) { newval = 0 }
      if (newval > parseInt(this.timeLimit.maxTime.slice(0, 4))) {
        if (parseInt(newval / 10) === this.oldYear) {
          newval = newval % 10
        } else {
          newval = this.oldYear
        }
      }
      this.edityear = newval
    },
    editmonth(newval) {
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 1) { newval = 0 }
      if (newval > 12) { newval = newval % 10 }
      this.editmonth = newval < 10 ? '0' + newval : newval
    },
    editday(newval) {
      newval = parseInt(newval) ? parseInt(newval) : 0
      const nowmonthday = 32 - new Date(this.edityear, parseInt(this.editmonth) - 1, 32).getDate()
      if (newval < 1) { newval = 0 }
      if (newval > nowmonthday) { newval = newval % 10 }
      this.editday = newval < 10 ? '0' + newval : newval
    }
  },
  data() {
    return {
      checkTimeStart: this.$t('commonComponents.calendar.select'),
      hideStart: { startF: false },
      edityear: '',
      editmonth: '',
      editday: '',
      oldYear: '',
      timesBack: { time: '', newTime: '' }
    }
  },
  methods: {
    getStart(msg, date) {
      this.edityear = msg.slice(0, 4)
      this.editmonth = msg.slice(5, 7)
      this.editday = msg.slice(8, 10)
      this.hideStart.startF = false
      if (this.format === 'YMD') {
        this.checkTimeStart = msg
      } else if (this.format === 'MDY') {
        this.checkTimeStart = this.editmonth + '-' + this.editday + '-' + this.edityear
      } else if (this.format === 'DMY') {
        this.checkTimeStart = this.editday + '-' + this.editmonth + '-' + this.edityear
      }
      this.$emit('starendtime', { start: this.checkTimeStart, startTimes: date.getTime() })
    },
    changecheck1: function() {
      this.hideStart.startF = false
    },
    editInputClick(e) {
      e.stopPropagation()
      this.hideStart.startF = true
    },
    clicks: function(e) {
      e.stopPropagation()
      this.changeDate()
      if (this.hideStart.startF) {
        this.hideStart.startF = false
      } else {
        this.hideStart.startF = true
      }
    },
    calendarclick: function(e) {
      e.stopPropagation()
    },
    changeDate() {
      if (this.editmonth === '00') { this.editmonth = '01' }
      if (this.editday === '00') { this.editday = '01' }
      if (this.edityear < parseInt(this.timeLimit.minTime.slice(0, 4))) { this.edityear = this.oldYear }
      this.timesBack.time = this.edityear + '-' + this.editmonth + '-' + this.editday
      this.timesBack.newTime = new Date()
      this.$emit('starendtime', { start: this.timesBack.time, startTimes: new Date(this.timesBack.time.replace(/-/g, '/')).getTime() })
    },
    yearFocus() {
      this.oldYear = this.edityear
    }
  },
  created: function() {
    if (this.defaultdate) {
      this.edityear = this.defaultdate.slice(0, 4)
      this.editmonth = this.defaultdate.slice(5, 7)
      this.editday = this.defaultdate.slice(8, 10)
      if (this.format === 'YMD') {
        this.checkTimeStart = this.defaultdate
      } else if (this.format === 'MDY') {
        this.checkTimeStart = this.editmonth + '-' + this.editday + '-' + this.edityear
      } else if (this.format === 'DMY') {
        this.checkTimeStart = this.editday + '-' + this.editmonth + '-' + this.edityear
      }
    }
    this.bindedOnClick = (e) => {
      if (this.hideStart.startF) {
        this.hideStart.startF = false
      }
    }
  },
  mounted: function() {
    document.querySelector('body').addEventListener('click', this.bindedOnClick, false)
  },
  beforeDestroy() {
    document.querySelector('body').removeEventListener('click', this.bindedOnClick)
    this.bindedOnClick = null
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
  width: 110px;
  position: relative;
  height: 26px;
  font-size: 14px;
  float: right;
}

.timebox {
  height: 26px;
  text-align: center;
  padding: 0 10px;
  color: #414141;
  border-radius: 2px;
  font-size: 12px;
  cursor: default;
  background: #fff;
}

.editDiv {
  border: 1px solid #D1D1D1;
  text-align: center;
  line-height: 26px;
  color: #414141;
}

.editDiv input {
  height: 22px;
  width: 14px;
  text-align: center;
  border: 0;
}

.editDiv input.year {
  width: 27px;
}

.calendars {
  position: absolute;
  left: 0;
  top: 27px;
  z-index: 999;
}
</style>
