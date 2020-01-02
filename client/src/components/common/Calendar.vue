<template>
  <div class="container">
    <div class="row">
      <div class="calendar"
           @click='calendarclick'>
        <ul class="month">
          <li class="arrows left"
              v-on:click="pickPrey()">
            <span class="icon iconfont icon-shrink"></span>
          </li>
          <li class="mup arrows left"
              v-on:click="pickPre()">
            <span class="icon iconfont icon-jiantou-copy"></span>
          </li>
          <li class="year-month">
            <span class="choose-year"
                  v-if="state!=='en'">
                <span class="year" @click="showyear">{{ currentYear }}年 </span>
            <span class="month" @click="chooseoff('openMonth')">{{ currentMonth}}月</span>
            </span>
            <span class="choose-year"
                  v-else>
                <span @click="chooseoff('openMonth')">{{ currentMonth}}</span> /
            <span @click="showyear">{{ currentYear }}</span>
            </span>
          </li>
          <li class="mdown arrows right"
              v-on:click="pickNext()" style='line-height: 17px'>
            <span class="icon iconfont icon-jiantou-copy"></span>
          </li>
          <li class="arrows right"
              v-on:click="pickNexty()">
            <span class="icon iconfont icon-extend"></span>
          </li>
        </ul>

        <!-- 月份选择 -->
        <ul class="choosemonth"
            v-if="openMonth">
          <li v-for='(i,j) in months'
              :key="j"
              :class="{active:j==date.getMonth()}"
              @click="chooseMonth(j)">{{i}}</li>
        </ul>
        <!-- 年份选择 -->
        <ul class="chooseyear"
            v-if="openYear">
          <li class="upyear"
              @click="upyear">
            <i class="icon iconfont icon-arrow-up2"></i>
          </li>
          <li v-for='(i,j) in years'
              :key="j"
              :class="{active:i==date.getFullYear()}"
              @click="chooseYear(i)">{{i}}</li>
          <li class="downyear"
              @click="downyear">
            <i class="icon iconfont icon-arrow-down2"></i>
          </li>
        </ul>

        <ul class="weekdays">
          <li v-for='i in week'>{{i}}</li>
        </ul>
        <ul class="days">
          <li v-on:click="pick(day)"
              v-for="day in days">
            <span v-if="day.getMonth()+1 != currentMonth"
                  class="other-month">{{ day.getDate() }}</span>
            <span v-else-if="day.getFullYear() == date.getFullYear() && day.getMonth() == date.getMonth() && day.getDate() == date.getDate()"
                  class="active">{{ day.getDate() }}</span>
            <span v-else>{{ day.getDate() }}</span>
          </li>
        </ul>
        <ul class="times"
            v-if="showtime">
          <li style="float:left;"
              class="timesleft">
            <input type="text"
                   class="hours"
                   v-model="hours"
                   @focus.stop="hoursChange('hours')"
                   v-on:blur="changehours" />
            <span>:</span>
            <input type="text"
                   class="minutes"
                   v-model="minutes"
                   @focus.stop="hoursChange('minutes')"
                   v-on:blur="changeminutes" />
            <span>:</span>
            <input type="text"
                   class="seconds"
                   v-model="seconds"
                   @focus.stop="hoursChange('seconds')"
                   v-on:blur="changeseconds" />
          </li>
          <li style="float:right;"
              class="timesrigth">
            <button class="confirms"
                    v-on:click="nowtime">{{current}}</button>
            <button class="confirms"
                    v-on:click="confirm">{{determine}}</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
var moment = require('moment')
moment().format()
export default {
  name: 'BScalendar',
  props: {
    showtime: {
      default: true
    },
    isEmitTime: {
      default: false
    },
    hide: {},
    defaultdate: { type: String },
    timeLimit: {
      default() {
        return {
          minTime: '1900-01-01',
          maxTime: '2100-01-01'
        }
      }
    },
    timesback: {}
  },
  data() {
    return {
      date: '',
      week: [],
      years: [],
      months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      hours: '00',
      minutes: '00',
      seconds: '00',
      current: '当前',
      determine: '确定',
      openMonth: false,
      openYear: false,
      dateLimit: {
        minTime: '',
        maxTime: ''
      }
    }
  },
  watch: {
    'timesback.newTime'(val) {
      this.date = new Date(this.timesback.time.replace(/-/g, '/'))
      this.currentminutes()
      this.currentseconds()
      this.currenthours()
    },
    defaultdate(val) {
      this.date = new Date((val.slice(0, 10)).replace(/-/g, '/'))
    },
    hours(newval) {
      if (!newval) { return }
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) { newval = 0 }
      if (newval > 23) { newval = newval % 10 }
      this.hours = newval < 10 ? '0' + newval : newval
    },
    minutes(newval) {
      if (!newval) { return }
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) { newval = 0 }
      if (newval > 59) { newval = newval % 10 }
      this.minutes = newval < 10 ? '0' + newval : newval
    },
    seconds(newval) {
      if (!newval) { return }
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) { newval = 0 }
      if (newval > 59) { newval = newval % 10 }
      this.seconds = newval < 10 ? '0' + newval : newval
    }
  },
  computed: {
    ...mapState({
      // state: ({ config }) => config.locale
    }),
    currentYear() {
      return this.date.getFullYear()
    },
    currentDay() {
      return this.date.getDate()
    },
    currentMonth() {
      const month = this.date.getMonth() + 1
      if (month < 10) {
        return '0' + month
      }
      return month
    },
    currentWeek() {
      return this.date.getDay() + 1
    },
    currentNowWeek() {
      return Math.floor((this.currentDay + 6 - this.currentWeek) / 7)
    },
    days() {
      const dayArray = []
      // 今天是周日，放在第一行第7个位置，前面6个
      const center = this.currentNowWeek * 7 + this.currentWeek - 1
      for (var i = center; i >= 0; i--) {
        var d = new Date(this.date)
        d.setDate(d.getDate() - i)
        dayArray.push(d)
      }
      for (var j = 1; j <= 42 - center - 1; j++) {
        var setDay = new Date(this.date)
        setDay.setDate(setDay.getDate() + j)
        dayArray.push(setDay)
      }
      return dayArray
    }
  },
  methods: {
    hoursChange(val) {
      this[val] = ''
    },
    format(val) { return val < 10 ? '0' + val : val },
    pick: function(date) {
      if (date.getTime() > this.dateLimit.maxTime || date.getTime() < this.dateLimit.minTime) { return }
      this.date = date
      var test = this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
      this.$emit('clicktest', test, this.date)
    },
    pickPre: function() {
      var temp = new Date(this.date)
      temp.setDate(1)
      temp.setMonth(temp.getMonth() - 1)
      if (temp.getTime() > this.dateLimit.maxTime || temp.getTime() < this.dateLimit.minTime) { return }
      this.date = temp
      if (this.isEmitTime) { this.pick(this.date) }
    },
    pickNext: function(year, month) {
      var temp = new Date(this.date)
      temp.setDate(1)
      temp.setMonth(temp.getMonth() + 1)
      if (temp.getTime() > this.dateLimit.maxTime || temp.getTime() < this.dateLimit.minTime) { return }
      this.date = temp
      if (this.isEmitTime) { this.pick(this.date) }
    },
    pickPrey: function() {
      var temp = new Date(this.date)
      temp.setFullYear(temp.getFullYear() - 1)
      temp.setDate(1)
      if (temp.getTime() > this.dateLimit.maxTime || temp.getTime() < this.dateLimit.minTime) { return }
      this.date = temp
      this.years.pop()
      this.years.unshift(this.years[0] - 1)
      if (this.isEmitTime) { this.pick(this.date) }
    },
    pickNexty: function(year, month) {
      var temp = new Date(this.date)
      temp.setFullYear(temp.getFullYear() + 1)
      temp.setDate(1)
      if (temp.getTime() > this.dateLimit.maxTime || temp.getTime() < this.dateLimit.minTime) { return }
      this.date = temp
      this.years.shift()
      this.years.push(this.years[16] + 1)
      if (this.isEmitTime) { this.pick(this.date) }
    },
    changehours: function() {
      if (this.hours >= 0 && this.hours < 24) {
        this.date.setHours(this.hours)
      }
      this.currenthours()
    },
    changeminutes: function() {
      if (this.minutes >= 0 && this.minutes < 60) {
        this.date.setMinutes(this.minutes)
      }
      this.currentminutes()
    },
    changeseconds: function() {
      if (this.seconds >= 0 && this.seconds < 60) {
        this.date.setSeconds(this.seconds)
      }
      this.currentseconds()
    },
    // 返回 类似 2016-01-02 格式的字符串
    formatDate: function(year, month, day) {
      var y = year
      var m = month
      if (m < 10) { m = '0' + m }
      var d = day
      if (d < 10) { d = '0' + d }
      return y + '-' + m + '-' + d
    },
    confirm: function() {
      var time = this.currentYear + '-' + this.currentMonth + '-' + (this.currentDay < 10 ? '0' + this.currentDay : this.currentDay) + ' ' + this.currenthours() + ':' + this.currentminutes() + ':' + this.currentseconds()
      this.$emit('checktimes', { time, t: this.date })
      // this.hide.f = false
      return time
    },
    nowtime: function() {
      this.date = new Date()
      this.currentminutes()
      this.currentseconds()
      this.currenthours()
    },
    currenthours() {
      this.hours = this.date.getHours() < 10 ? '0' + this.date.getHours() : this.date.getHours()
      return this.hours
    },
    currentminutes() {
      this.minutes = this.date.getMinutes() < 10 ? '0' + this.date.getMinutes() : this.date.getMinutes()
      return this.minutes
    },
    currentseconds() {
      this.seconds = this.date.getSeconds() < 10 ? '0' + this.date.getSeconds() : this.date.getSeconds()
      return this.seconds
    },
    calendarclick: function(e) {
      e.stopPropagation()
    },
    chooseMonth(i) {
      var temp = new Date(this.date)
      temp.setMonth(i)
      temp.setDate(1)
      this.date = temp
      var test = this.formatDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
      this.$emit('clicktest', test, this.date)
      this.openMonth = false
    },
    chooseYear(i) {
      var temp = new Date(this.date)
      temp.setFullYear(i)
      temp.setDate(1)
      if (temp.getTime() > this.dateLimit.maxTime || temp.getTime() < this.dateLimit.minTime) {
        this.openYear = false
        return
      }
      this.date = temp
      var test = this.formatDate(this.date.getFullYear(), this.date.getMonth() + 1, this.date.getDate())
      this.$emit('clicktest', test, this.date)
      this.openYear = false
    },
    showyear() {
      this.years = []
      var nowyear = this.date.getFullYear()
      for (let i = 7; i > 0; i--) {
        this.years.push(nowyear - i)
      }
      for (let i = 0; i < 11; i++) {
        this.years.push(nowyear + i)
      }
      this.chooseoff('openYear')
    },
    downyear() {
      const oldyear = this.years[17]
      this.years = []
      for (let i = 1; i < 19; i++) {
        this.years.push(oldyear + i)
      }
    },
    upyear() {
      const oldyear = this.years[0]
      this.years = []
      for (let i = 18; i > 0; i--) {
        this.years.push(oldyear - i)
      }
    },
    chooseoff(i) {
      this.openMonth = false
      this.openYear = false
      if (i) {
        this[i] = true
      }
    }
  },
  created: function() {
    const minlimit = this.timeLimit.minTime
    const maxlimit = this.timeLimit.maxTime
    this.dateLimit.minTime = new Date(minlimit.replace(/-/g, '/')).getTime()
    this.dateLimit.maxTime = new Date(maxlimit.replace(/-/g, '/')).getTime()
    if (this.defaultdate) {
      var aa = this.defaultdate
      if (aa.length > 10) {
        this.date = new Date(aa.slice(0, 4), aa.slice(5, 7) - 1, aa.slice(8, 10), aa.slice(11, 13), aa.slice(14, 16), aa.slice(17, 19))
      } else {
        this.date = new Date()
        this.date = new Date(aa.slice(0, 4), aa.slice(5, 7) - 1, aa.slice(8, 10), this.currenthours(),
          this.currentminutes(), this.currentseconds())
      }
    } else {
      this.date = new Date()
    }
    this.state = 'zh_CN'
    if (this.state === 'zh_CN') {

    } else {
      this.current = 'now'
      this.determine = 'ok'
    }
    moment.locale(this.state)
    this.week = moment.weekdaysMin()
    this.currentminutes()
    this.currentseconds()
    this.currenthours()

    var _this = this
    document.querySelector('body').addEventListener('click', function(e) {
      _this.chooseoff()
    }, false)
  }

}
</script>
<style scoped>
* {
  box-sizing: border-box;
  margin: 0px;
  border: 0px;
  padding: 0px;
}

ul {
  list-style-type: none;
}

.container {
  width: 210px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

.calendar {
  border: 1px solid #4699f9;
  border-radius: 4px;
  margin: 0;
  padding: 0;
  color: #fff;
  width: 100%;
  height: auto;
  overflow: hidden;
  background: #1b3153;
  position: relative;
}

.choosemonth,
.chooseyear {
  background: #1b3153;
  top: 34px;
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 2;
}

.choosemonth li{
  width: 16.6666%;
  margin: 8px 8.33%;
  text-align: center;
  line-height: 32px;
  float: left;
  cursor: default;
  font-size: 12px;
  color: #fff;
  border-radius: 3px;
}
.chooseyear li {
  width: 16.6666%;
  margin: 5px 8.33%;
  text-align: center;
  line-height: 32px;
  float: left;
  cursor: default;
  font-size: 12px;
  color: #fff;
  border-radius: 3px;
}

.chooseyear li {
  line-height: 26px;
}

.choosemonth li:hover,
.chooseyear li:hover {
  /* background: #4499f7; */
  background: rgba(40,127,225, 0.7);
}
.choosemonth li:active,
.chooseyear li:active {
  background: #287fe1;
}

.choosemonth li.active,
.chooseyear li.active {
  background: #4499f7;
  color: #fff;
}

.chooseyear li.upyear,
.chooseyear li.downyear {
  width: 100%;
  height: 12px;
  margin: 0;
  line-height: 12px;
}

.month {
  background: #1b3153;
  margin: 0;
  padding: 0;
  color: #fff;
  height: 34px;
  font-size: 12px;
  border-bottom: 1px solid #203863;
}

.year-month {
  flex-direction: column;
  align-items: center;
  cursor: default;
  margin: 0 auto;
  line-height: 34px;
  width: 50%;
  text-align: center;
  float: left;
}

.choose-year {
  color: #fff;
  font-size: 12px;
}
.choose-year .year:hover{
  color: #4699f9;
}
.choose-year .month:hover{
  color: #4699f9;
}
.choose-month {
  text-align: center;
}
.month li {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
}

.arrows {
  padding: 8px 6px;
  color: #bbbec4;
  cursor: pointer;
  line-height: 18px;
  width: 15%;
  text-align: center;
}
.arrows:hover{
  color: #4699f9;
}
.iconfont {
  font-size: 12px;
}

.arrows.left {
  float: left;
}

.arrows.right {
  float: left;
}

.mup {
  width: 10%;
}

.mdown {
  transform: rotate(180deg);
  width: 10%;
}

.weekdays {
  width: 100%;
  margin: 0;
  height: 36px;
  line-height: 36px;
  color: #bbbec4;
  background: #1b3153;
}

.weekdays li {
  display: inline-block;
  width: 14.28%;
  text-align: center;
  cursor: default;
  float: left;
  font-size: 12px;
}

.days {
  padding: 0 0 10px 0;
  background: #1b3153;
  margin: 0;
  width: 100%;
  overflow: hidden;
}

.days li {
  width: 14.28%;
  height: 26px;
  padding: 2px 2px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  float: left;
  line-height: 22px;
  position: relative;
}

.days li > span {
  /*padding: 5px 2px;*/
  display: inline-block;
  width: 100%;
  height: 22px;
  color: #fff;
  margin: 0 auto;
}

.days li span.sign {
  position: absolute;
  width: 10px;
  height: 5px;
  bottom: 1px;
  right: calc(50% - 9px);
  text-align: center;
}
.days li span.sign span {
  /* display: inline-block;  */
  float: left;
  width: 5px;
  height: 5px;
}
.days li span.sign span.event {
  background: #fc6e30;
}
.days li span.sign span.manual {
  background: #e6c821;
}

.days li span.sign span.timed {
  background: #32e184;
}

.days li .other-month {
  color: #bbbec4;
}

.days li span:hover {
  background: rgba(40,127,225, 0.7);
  border-radius: 4px;
}
.days li span:active {
  background: #287fe1;
  border-radius: 4px;
}

.days li.range {
  background: rgba(40,127,225, 0.4);
}

.days li .active {
  border-radius: 5px;
  background: #4499f7;
  color: #fff;
  display: inline-block;
}

.days li .active:hover {
  background: #4499f7;
  color: #fff;
}

.days li.disabled, .days li.disabled span:hover {
  cursor: not-allowed;
  background: rgba(83,95,119,0.6);
}

.glyphicon {
  font-size: 12px;
  color: #414141;
}

.times {
  background: #1b3153;
  height: 44px;
  padding: 10px 5px;
  text-align: center;
  border-top: 1px solid #203863;
}

.timesleft {
  width: 60%;
  float: left;
}
.timesleft span{
  color: #fff;
}
.timesrigth {
  width: 40%;
  float: right;
}

.times input {
  width: 22%;
  height: 22px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: #3c5073;
  border-radius: 2px;
}

.times span {
  margin: 0px 1px;
}

.confirms {
  height: 22px;
  width: 40%;
  background: #4499f7;
  color: #fff;
  font-size: 12px;
  border-radius: 2px;
}
</style>
