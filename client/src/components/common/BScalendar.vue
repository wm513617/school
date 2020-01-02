<template>
  <div class="container" :style="{width:width + 'px'}">
    <div class="row">
      <div class="calendar" @click='calendarclick'>
        <ul class="month">
          <li class="arrows left" v-on:click="pickPrey()">
            <span class="icon iconfont icon-shrink"></span>
          </li>
          <li class="mup arrows left" v-on:click="pickPre()">
            <span class="icon iconfont icon-jiantou-copy"></span>
          </li>
          <li class="year-month">
            <span class="choose-year" v-if="state!=='en'">
              <span @click="showyear">{{ currentYear }}年 </span>
              <span @click="chooseoff('openMonth')">{{ currentMonth}}月</span>
            </span>
            <span class="choose-year" v-else>
              <span @click="chooseoff('openMonth')">{{ currentMonth}}</span> /
              <span @click="showyear">{{ currentYear }}</span>
            </span>
          </li>
          <li class="mdown arrows right" v-on:click="pickNext()">
            <span class="icon iconfont icon-jiantou-copy"></span>
          </li>
          <li class="arrows right" v-on:click="pickNexty()">
            <span class="icon iconfont icon-extend"></span>
          </li>
        </ul>

        <!-- 月份选择 -->
        <ul class="choosemonth" v-if="openMonth">
          <li v-for='(i,j) in months' :class="{active:j==date.getMonth()}" @click="chooseMonth(j)" :key="j">{{i}}</li>
        </ul>
        <!-- 年份选择 -->
        <ul class="chooseyear" v-if="openYear">
          <li class="upyear" @click="upyear">
            <i class="icon iconfont icon-arrow-up2"></i>
          </li>
          <li v-for='(i,j) in years' :class="{active:i==date.getFullYear()}" @click="chooseYear(i)" :key="j">{{i}}</li>
          <li class="downyear" @click="downyear">
            <i class="icon iconfont icon-arrow-down2"></i>
          </li>
        </ul>

        <ul class="weekdays">
          <li v-for='i in week' :key="i">{{i}}</li>
        </ul>
        <ul class="days">
          <li v-on:click="pick(day)" v-for="day in days" :key="day.getTime()" :class="{range: isRange(day), disabled: day.getTime() > dateLimit.maxTime}">
            <span v-if="day.getMonth()+1 != currentMonth" class="other-month" :class="{active:isActive(day)}">{{ day.getDate() }}</span>
            <span v-else :class="{active:isActive(day)}">{{ day.getDate() }}</span>
            <span class="sign" v-if="getShowClass(day)" v-show="showSign">
              <!-- <span class="green" v-if="getShow(day, 'timed') && !getShow(day, 'event') && !getShow(day, 'manual')"></span>
              <span class="red" v-if="getShow(day, 'event')"></span>
              <span class="blue" v-if="getShow(day, 'manual') && !getShow(day, 'event')"></span> -->
              <span :class="[getShowClass(day)]"></span>
            </span>
          </li>
        </ul>
        <ul class="times" v-if="showtime">
          <li style="float:left;" class="timesleft">
            <input type="text" class="hours" v-model="hours" v-on:change="changehours" />
            <span>:</span>
            <input type="text" class="minutes" v-model="minutes" v-on:change="changeminutes" />
            <span>:</span>
            <input type="text" class="seconds" v-model="seconds" v-on:change="changeseconds" />
          </li>
          <li style="float:right;" class="timesrigth">
            <button class="confirms" v-on:click="nowtime">{{current}}</button>
            <button class="confirms" v-on:click="confirm">{{determine}}</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { QUERY_RECORD_CALENDAR } from '../../http/video.api'
import { CancelToken } from 'axios'
var moment = require('moment')
moment().format()
export default {
  name: 'Calendar',
  props: {
    showtime: {
      // type: Boolean,
      default: false
    },
    showSign: {
      type: Boolean,
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
    timesback: {},
    width: {
      type: [Number, String],
      default: 258
    },
    daterange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      date: '',
      week: [],
      years: [],
      months: [],
      hours: '00',
      minutes: '00',
      seconds: '00',
      current: '当前',
      determine: '确定',
      openMonth: false,
      openYear: false,
      recordObj: {},
      dateLimit: {
        minTime: '',
        maxTime: ''
      },
      state: this.$lang,
      isNewCalendarQuery: true,
      startDate: null,
      endDate: null,
      startRange: false
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
      this.date = new Date(val.slice(0, 10).replace(/-/g, '/'))
    },
    hours(newval) {
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) {
        newval = 0
      }
      if (newval > 23) {
        newval = newval % 10
      }
      this.hours = newval < 10 ? '0' + newval : newval
    },
    minutes(newval) {
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) {
        newval = 0
      }
      if (newval > 59) {
        newval = newval % 10
      }
      this.minutes = newval < 10 ? '0' + newval : newval
    },
    seconds(newval) {
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) {
        newval = 0
      }
      if (newval > 59) {
        newval = newval % 10
      }
      this.seconds = newval < 10 ? '0' + newval : newval
    },
    curNode() {
      this.recordObj = {}
      if (this.curNode && 'eid' in this.curNode) {
        this.videoFilter()
      }
    },
    date(d) {
      if (!this.curNode) {
        return
      }
      if (this.queryDate) {
        const date = this.queryDate
        if (
          d.getMonth() !== date.getMonth() ||
          d.getFullYear() !== date.getFullYear()
        ) {
          this.videoFilter()
        }
      } else {
        this.videoFilter()
      }
    }
  },
  computed: {
    ...mapState({
      curNode: ({ videoOrg }) => videoOrg.curNode
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
      for (let i = center; i >= 0; i--) {
        const d = new Date(this.date)
        d.setDate(d.getDate() - i)
        dayArray.push(d)
      }
      for (let j = 1; j <= 42 - center - 1; j++) {
        let setDay = new Date(this.date)
        setDay.setDate(setDay.getDate() + j)
        dayArray.push(setDay)
      }
      return dayArray
    }
  },
  methods: {
    format(val) {
      return val < 10 ? '0' + val : val
    },
    pick: function(date) {
      if (
        date.getTime() > this.dateLimit.maxTime ||
        date.getTime() < this.dateLimit.minTime
      ) {
        return
      }
      if (this.daterange) {
        this.pickRange(date)
      }
      this.date = date
      const test = this.formatDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      )
      this.$emit('clicktest', test, this.date)
    },
    /**
     * 范围选择
     */
    pickRange(date) {
      if (!this.startRange) {
        this.startDate = date
        this.endDate = null
        this.$emit('range', { startDate: this.startDate, endDate: this.startDate })
      } else {
        if (date.getTime() < this.startDate.getTime()) {
          this.endDate = this.startDate
          this.startDate = date
        } else {
          this.endDate = date
        }
        this.$emit('range', { startDate: this.startDate, endDate: this.endDate })
      }
      this.startRange = !this.startRange
    },
    /**
     * 是否高亮
     */
    isActive(date) {
      // 是否是同一天
      const isSame = (preDate, nextDate) => {
        return preDate.getFullYear() === nextDate.getFullYear() && preDate.getMonth() === nextDate.getMonth() && preDate.getDate() === nextDate.getDate()
      }
      if (!this.daterange && isSame(date, this.date)) {
        return true
      } else if ((this.startDate && isSame(date, this.startDate)) || (this.endDate && isSame(date, this.endDate))) {
        return true
      }
      return false
    },
    /**
     * 是否在选择范围之内
     */
    isRange(date) {
      if (this.startDate && this.endDate && date.getTime() > this.startDate.getTime() && date.getTime() < this.endDate.getTime()) {
        return true
      }
      return false
    },
    pickPre: function() {
      let temp = new Date(this.date)
      temp.setDate(1)
      temp.setMonth(temp.getMonth() - 1)
      if (
        temp.getTime() > this.dateLimit.maxTime ||
        temp.getTime() < this.dateLimit.minTime
      ) {
        return
      }
      this.date = temp
      if (this.isEmitTime) { this.pick(this.date) }
      // this.videoFilter()
    },
    pickNext: function(year, month) {
      let temp = new Date(this.date)
      temp.setDate(1)
      temp.setMonth(temp.getMonth() + 1)
      if (
        temp.getTime() > this.dateLimit.maxTime ||
        temp.getTime() < this.dateLimit.minTime
      ) {
        return
      }
      this.date = temp
      if (this.isEmitTime) { this.pick(this.date) }
      // this.videoFilter()
    },
    pickPrey: function() {
      let temp = new Date(this.date)
      temp.setFullYear(temp.getFullYear() - 1)
      temp.setDate(1)
      if (
        temp.getTime() > this.dateLimit.maxTime ||
        temp.getTime() < this.dateLimit.minTime
      ) {
        return
      }
      this.date = temp
      this.years.pop()
      this.years.unshift(this.years[0] - 1)
      // this.showyear()
      if (this.isEmitTime) { this.pick(this.date) }
      // this.videoFilter()
    },
    pickNexty: function(year, month) {
      let temp = new Date(this.date)
      temp.setFullYear(temp.getFullYear() + 1)
      temp.setDate(1)
      if (
        temp.getTime() > this.dateLimit.maxTime ||
        temp.getTime() < this.dateLimit.minTime
      ) {
        return
      }
      this.date = temp
      this.years.shift()
      this.years.push(this.years[10] + 1)
      // this.showyear()
      if (this.isEmitTime) { this.pick(this.date) }
      // this.videoFilter()
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
      const y = year
      let m = month
      if (m < 10) { m = '0' + m }
      let d = day
      if (d < 10) { d = '0' + d }
      return y + '-' + m + '-' + d
    },
    confirm: function() {
      const time =
        this.currentYear +
        '-' +
        this.currentMonth +
        '-' +
        (this.currentDay < 10 ? '0' + this.currentDay : this.currentDay) +
        ' ' +
        this.currenthours() +
        ':' +
        this.currentminutes() +
        ':' +
        this.currentseconds()
      // console.log(time)
      this.$emit('checktimes', { time, f: this.hide.f, t: this.date })
      this.hide.f = false
      return time
    },
    nowtime: function() {
      this.date = new Date()
      this.currentminutes()
      this.currentseconds()
      this.currenthours()
    },
    currenthours() {
      this.hours =
        this.date.getHours() < 10
          ? '0' + this.date.getHours()
          : this.date.getHours()
      return this.hours
    },
    currentminutes() {
      this.minutes =
        this.date.getMinutes() < 10
          ? '0' + this.date.getMinutes()
          : this.date.getMinutes()
      return this.minutes
    },
    currentseconds() {
      this.seconds =
        this.date.getSeconds() < 10
          ? '0' + this.date.getSeconds()
          : this.date.getSeconds()
      return this.seconds
    },
    calendarclick: function(e) {
      e.stopPropagation()
    },
    chooseMonth(i) {
      const temp = new Date(this.date)
      temp.setMonth(i)
      temp.setDate(1)
      this.date = temp
      const test = this.formatDate(
        this.date.getFullYear(),
        this.date.getMonth() + 1,
        this.date.getDate()
      )
      this.$emit('clicktest', test, this.date)
      this.openMonth = false
    },
    chooseYear(i) {
      const temp = new Date(this.date)
      temp.setFullYear(i)
      temp.setDate(1)
      if (
        temp.getTime() > this.dateLimit.maxTime ||
        temp.getTime() < this.dateLimit.minTime
      ) {
        this.openYear = false
        return
      }
      this.date = temp
      const test = this.formatDate(
        this.date.getFullYear(),
        this.date.getMonth() + 1,
        this.date.getDate()
      )
      this.$emit('clicktest', test, this.date)
      this.openYear = false
    },
    showyear() {
      this.years = []
      const nowyear = this.date.getFullYear()
      for (let i = 7; i > 0; i--) {
        this.years.push(nowyear - i)
      }
      for (let i = 0; i < 5; i++) {
        this.years.push(nowyear + i)
      }
      this.chooseoff('openYear')
    },
    downyear() {
      const oldyear = this.years[11]
      this.years = []
      for (let i = 1; i < 13; i++) {
        this.years.push(oldyear + i)
      }
    },
    upyear() {
      const oldyear = this.years[0]
      this.years = []
      for (let i = 12; i > 0; i--) {
        this.years.push(oldyear - i)
      }
    },
    chooseoff(i) {
      this.openMonth = false
      this.openYear = false
      if (i) {
        this[i] = true
      }
    },
    // IP转成整型
    ip2int(ip) {
      let num = 0
      ip = ip.split('.')
      num =
        Number(ip[0]) * 256 * 256 * 256 +
        Number(ip[1]) * 256 * 256 +
        Number(ip[2]) * 256 +
        Number(ip[3])
      num = num >>> 0
      return num
    },
    getMaxDate(date) {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    },
    queryCalendarFlag() {
      if (this.cancelToken) {
        this.cancelToken.cancel('cancel')
      }
      let dateParam = []
      const date = new Date(this.date.getTime())
      const dateEnd = new Date(date)
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      dateEnd.setHours(23)
      dateEnd.setMinutes(59)
      dateEnd.setSeconds(59)
      let maxDate = this.getMaxDate(date)
      while (maxDate !== 0) {
        date.setDate(maxDate)
        dateEnd.setDate(maxDate)
        dateParam.push({
          sTm: parseInt(date.getTime() / 1000),
          eTm: parseInt(dateEnd.getTime() / 1000)
        })
        maxDate--
      }
      dateParam = dateParam.reverse()
      const node = this.curNode
      this.cancelToken = CancelToken.source()
      // 设备停用不能看日历上标记并且不能回放
      if (node.eid.deviceStatus === 0) {
        return {data: {}}
      }
      return QUERY_RECORD_CALENDAR(
        {
          devIp: this.$formatDevIp(node.eid.ip || node.ip),
          channel: node.chan,
          devPort: node.eid.cport,
          streamType: 'all',
          timeRecord: dateParam,
          eventRecord: dateParam,
          manualRecord: dateParam
        },
        this.cancelToken
      )
    },
    getParsedDate(datevalue) {
      return new Date(datevalue * 1000).getDate()
    },
    dealCalendarData(res) {
      const result = {}

      const eventList = res.eventRecord || []
      eventList.forEach(item => {
        if (item.event === 0) {
          return
        }
        const date = this.getParsedDate(item.sTm)
        result[date] = result[date] || {}
        result[date]['event'] = true
      })

      const timeList = res.timeRecord || []
      timeList.forEach(item => {
        if (item.event === 0) {
          return
        }
        const date = this.getParsedDate(item.sTm)
        result[date] = result[date] || {}
        result[date]['timed'] = true
      })

      // !!!!!!!!!!!后台接口还没有添加 --- manualRecord
      const manualList = res.manualRecord || []
      manualList.forEach(item => {
        if (item.event === 0) {
          return
        }
        const date = this.getParsedDate(item.sTm)
        result[date] = result[date] || {}
        result[date]['manual'] = true
      })

      return result
    },
    async newVideoFilter() {
      try {
        const res = await this.queryCalendarFlag()
        const data = this.dealCalendarData(res.data)
        this.recordObj = data
      } catch (e) {
        if (e.message !== 'cancel') {
          console.error('获取日历标记失败', e)
        }
      }
    },
    videoFilter() {
      this.recordObj = {}
      this.queryDate = this.date
      if (!('eid' in this.curNode)) {
        return
      }
      if (this.isNewCalendarQuery) {
        return this.newVideoFilter()
      }
    },
    getShowClass(date) {
      if (
        this.date.getFullYear() === date.getFullYear() &&
        this.date.getMonth() === date.getMonth()
      ) {
        const info = this.recordObj[date.getDate()] || {}
        if (info.event) {
          return 'event'
        } else if (info.manual) {
          return 'manual'
        } else if (info.timed) {
          return 'timed'
        }
      }
      return false
    }
  },
  created: function() {
    const minlimit = this.timeLimit.minTime
    const maxlimit = this.timeLimit.maxTime
    this.dateLimit.minTime = new Date(minlimit.replace(/-/g, '/')).getTime()
    this.dateLimit.maxTime = new Date(maxlimit.replace(/-/g, '/')).getTime()
    if (this.defaultdate) {
      let aa = this.defaultdate
      if (aa.length > 10) {
        this.date = new Date(
          aa.slice(0, 4),
          aa.slice(5, 7) - 1,
          aa.slice(8, 10),
          aa.slice(11, 13),
          aa.slice(14, 16),
          aa.slice(17, 19)
        )
      } else {
        this.date = new Date()
        this.date = new Date(
          aa.slice(0, 4),
          aa.slice(5, 7) - 1,
          aa.slice(8, 10),
          this.currenthours(),
          this.currentminutes(),
          this.currentseconds()
        )
      }
    } else {
      this.date = new Date()
    }
    this.state = this.$lang
    if (this.state === 'zh_CN') {
    } else {
      this.current = 'now'
      this.determine = 'ok'
    }
    moment.locale(this.state)
    this.week = moment.weekdaysMin()
    this.months = moment.months()
    this.currentminutes()
    this.currentseconds()
    this.currenthours()
    this.onClickOutside = () => {
      this.chooseoff()
    }
    document
      .querySelector('body')
      .addEventListener('click', this.onClickOutside, false)
  },
  beforeDestroy() {
    document
      .querySelector('body')
      .removeEventListener('click', this.onClickOutside)
    delete this.onClickOutside
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
  width: 230px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

.calendar {
  border-radius: 3px;
  margin: 0;
  padding: 0;
  color: #fff;
  width: 100%;
  height: auto;
  overflow: hidden;
  background: #374f7b;
  position: relative;
}

.choosemonth,
.chooseyear {
  background: #374f7b;
  top: 40px;
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 2;
}

.choosemonth li,
.chooseyear li {
  width: 16.6666%;
  margin: 8px 8.33%;
  text-align: center;
  line-height: 32px;
  float: left;
  cursor: default;
  font-size: 12px;
  color: #fff;
}

.chooseyear li {
  line-height: 26px;
}

.choosemonth li:hover,
.chooseyear li:hover {
  background: #4499f7;
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
  background: #2a4169;
  margin: 0;
  padding: 0;
  color: #fff;
  height: 40px;
  font-size: 14px;
}

.year-month {
  flex-direction: column;
  align-items: center;
  cursor: default;
  margin: 0 auto;
  line-height: 38px;
  width: 50%;
  text-align: center;
  float: left;
}

.choose-year {
  color: #fff;
  font-size: 14px;
}

.choose-month {
  text-align: center;
}

.month li {
  color: white;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;
}

.arrows {
  padding: 8px 6px;
  color: #fff;
  cursor: pointer;
  line-height: 24px;
  width: 15%;
  text-align: center;
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
  color: #fff;
  background: #37507c;
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
  padding: 0 0 5px 0;
  background: #37507c;
  margin: 0;
  width: 100%;
  overflow: hidden;
}

.days li {
  width: 14.28%;
  height: 26px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  float: left;
  line-height: 26px;
  position: relative;
}

.days li > span {
  /*padding: 5px 2px;*/
  display: inline-block;
  width: 34px;
  height: 26px;
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
  border-radius: 5px;
}
.days li span:active {
  background: #287fe1;
  border-radius: 5px;
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
  background: #e2ebf4;
  height: 34px;
  padding: 5px;
  text-align: center;
}

.timesleft {
  width: 60%;
  float: left;
}

.timesrigth {
  width: 40%;
  float: right;
}

.times input {
  width: 24%;
  height: 24px;
  text-align: center;
}

.times span {
  margin: 0px 3px;
}

.confirms {
  height: 24px;
  width: 40%;
  background: #4499f7;
  color: #fff;
  font-size: 13px;
  border-radius: 2px;
}
</style>
