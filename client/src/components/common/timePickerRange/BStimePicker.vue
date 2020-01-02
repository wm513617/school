<template>
  <div class="child"
       :style="{width:width + 'px', height:height + 'px'}">
    <div class="timeInput">
      <input type="text"
             class="timeInputShow test1"
             name="HH"
             v-model="getHours"
             v-bind:id="hoursName"
             @focus.stop="onHoursFocus('getHours')"
             v-on:blur="onHoursChange"
             v-bind:class="{activeHours: isActiveHours}">
      <span class="timeInputOnly"
            readOnly=true
            value=":"><p>:</p></span>
      <input type="text"
             class="timeInputShow test2"
             name="MM"
             v-model="getMinute"
             v-bind:id="minuteName"
             @focus.stop="onMinuteFocus('getMinute')"
             v-on:blur="onMinuteChange"
             v-bind:class="{activeMinute: isActiveMinute}">
      <span class="timeInputOnly "
            readOnly=true
            value=": "><p>:</p></span>
      <input type="text"
             class="timeInputShow test3"
             name="SS "
             v-model="getSecond"
             v-bind:id="secondName"
             @focus.stop="onSecondFocus('getSecond')"
             v-on:blur="onSecondChange"
             v-bind:class="{activeSecond: isActiveSecond}">
    </div>
    <div class="computedButton ">
      <button type="button "
              class="add icon iconfont icon-arrow-up2"
              v-on:click.prevent="add" v-on:mousedown.prevent="londadd" v-on:mouseup="stop"></button>
      <button type="button "
              class="down icon iconfont icon-arrow-down2"
              v-on:click.prevent="down" v-on:mousedown.prevent="londdown" v-on:mouseup="stop"></button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BStimePicker',
  props: {
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 26
    },
    datetime: { // 默认值
      type: [String, Date],
      default: '00:00:00'
    },
    hourValue: {
      default: 0
    },
    minuteValue: {
      default: 0
    },
    secondValue: {
      default: 0
    }
  },
  data() {
    return {
      value: '',
      getHours: '',
      getMinute: '',
      getSecond: '',
      hoursName: 'hh',
      minuteName: 'mm',
      secondName: 'ss',
      flag: 'hh',
      normalValue: '',
      value: '',
      isActiveHours: false,
      isActiveMinute: false,
      isActiveSecond: false,
      londtime: ''
    }
  },
  created() {
    if (typeof (this.datetime) === 'string') {
      this.value = this.datetime.split(':', 3)
    } else {
      this.value = this.$moment(this.datetime).format('HH:mm:ss').split(':', 3)
    }
    this.getHours = this.value[0]
    this.getMinute = this.value[1]
    this.getSecond = this.value[2]
  },
  watch: {
    datetime(val) {
      if (typeof (this.datetime) === 'string') {
        this.value = this.datetime.split(':', 3)
      } else {
        this.value = this.$moment(this.datetime).format('HH:mm:ss').split(':', 3)
      }
      this.getHours = this.value[0]
      this.getMinute = this.value[1]
      this.getSecond = this.value[2]
    },
    getHours(newval) {
      if (!newval) { return }
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) { newval = 0 }
      if (newval > 23) { newval = newval % 10 }
      this.getHours = newval < 10 ? '0' + newval : newval
      this.$emit('childHours', newval)
    },
    getMinute(newval) {
      if (!newval) { return }
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) { newval = 0 }
      if (newval > 59) { newval = newval % 10 }
      this.getMinute = newval < 10 ? '0' + newval : newval
      this.$emit('childMinute', newval)
    },
    getSecond(newval) {
      if (!newval) { return }
      newval = parseInt(newval) ? parseInt(newval) : 0
      if (newval < 0) { newval = 0 }
      if (newval > 59) { newval = newval % 10 }
      this.getSecond = newval < 10 ? '0' + newval : newval
      this.$emit('childSecond', newval)
    }
  },
  methods: {
    onHoursFocus: function(val) {
      setTimeout(() => {
        // 滥用watch 导致数据更改陷入循环
        this[val] = ''
      }, 100)
      this.flag = 'hh'
      this.isActiveHours = true
      this.isActiveMinute = false
      this.isActiveSecond = false
    },
    onMinuteFocus: function(val) {
      this.flag = 'mm'
      setTimeout(() => {
        this[val] = ''
      }, 100)
      this.isActiveHours = false
      this.isActiveMinute = true
      this.isActiveSecond = false
    },
    onSecondFocus: function(val) {
      this.flag = 'ss'
      setTimeout(() => {
        this[val] = ''
      }, 100)
      this.isActiveHours = false
      this.isActiveMinute = false
      this.isActiveSecond = true
    },
    onHoursChange: function() {
      this.flag = 'hh'
      this.getHours = parseInt(this.getHours)
      if (this.flag === 'hh') {
        if (this.getHours <= 0 || this.getHours === '' || isNaN(this.getHours)) {
          this.getHours = '00'
        } else if (this.getHours < 10) {
          this.getHours = '0' + this.getHours
        } else if (this.getHours > 23) {
          this.getHours = 23
        }
      }
      this.$emit('timeChange', ([this.getHours, this.getMinute, this.getSecond]).join(':'))
    },
    onMinuteChange: function() {
      this.flag = 'mm'
      this.getMinute = parseInt(this.getMinute)
      if (this.flag === 'mm') {
        if (this.getMinute <= 0 || this.getMinute === '' || isNaN(this.getMinute)) {
          this.getMinute = '00'
        } else if (this.getMinute < 10) {
          this.getMinute = '0' + this.getMinute
        } else if (this.getMinute > 59) {
          this.getMinute = 59
        }
      }
      this.$emit('timeChange', ([this.getHours, this.getMinute, this.getSecond]).join(':'))
    },
    onSecondChange: function() {
      this.flag = 'ss'
      this.getSecond = parseInt(this.getSecond)
      if (this.flag === 'ss') {
        if (this.getSecond <= 0 || this.getSecond === '' || isNaN(this.getSecond)) {
          this.getSecond = '00'
        } else if (this.getSecond < 10) {
          this.getSecond = '0' + this.getSecond
        } else if (this.getSecond > 59) {
          this.getSecond = 59
        }
      }
      this.$emit('timeChange', ([this.getHours, this.getMinute, this.getSecond]).join(':'))
    },
    add: function() {
      if (this.flag === 'hh') {
        this.getHours++
        if (this.getHours < 10) {
          this.getHours = '0' + this.getHours
        }
        if (this.getHours > 23) {
          this.getHours = '00'
        }
      } else if (this.flag === 'mm') {
        this.getMinute++
        if (this.getMinute < 10) {
          this.getMinute = '0' + this.getMinute
        }
        if (this.getMinute > 59) {
          this.getMinute = '00'
        }
      } else if (this.flag === 'ss') {
        this.getSecond++
        if (this.getSecond < 10) {
          this.getSecond = '0' + this.getSecond
        }
        if (this.getSecond > 59) {
          this.getSecond = '00'
        }
      }
      this.$emit('timeChange', ([this.getHours, this.getMinute, this.getSecond]).join(':'))
    },
    londadd() {
      this.londtime = setInterval(this.add, 200)
    },
    stop() {
      clearInterval(this.londtime)
    },
    londdown() {
      this.londtime = setInterval(this.down, 200)
    },
    down: function() {
      if (this.flag === 'hh') {
        this.getHours = parseInt(this.getHours)
        this.getHours = this.getHours - 1
        if (this.getHours < 0) {
          this.getHours = 23
        } else if (this.getHours < 10) {
          this.getHours = '0' + this.getHours
        } else if (this.getHours >= 10 && this.getHours <= 23) {
          this.getHours = this.getHours
        }
      } else if (this.flag === 'mm') {
        this.getMinute = parseInt(this.getMinute)
        this.getMinute = this.getMinute - 1
        if (this.getMinute < 0) {
          this.getMinute = 59
        } else if (this.getMinute < 10) {
          this.getMinute = '0' + this.getMinute
        } else if (this.getMinute >= 10 && this.getMinute <= 59) {
          this.getMinute = this.getMinute
        }
      } else if (this.flag === 'ss') {
        this.getSecond = parseInt(this.getSecond)
        this.getSecond = this.getSecond - 1
        if (this.getSecond < 0) {
          this.getSecond = 59
        } else if (this.getSecond < 10) {
          this.getSecond = '0' + this.getSecond
        } else if (this.getSecond >= 10 && this.getSecond <= 59) {
          this.getSecond = this.getSecond
        }
      }
      this.$emit('timeChange', ([this.getHours, this.getMinute, this.getSecond]).join(':'))
    }
  }
}
</script>
<style scoped>
.child {
  width: 100%;
  height: 100%;
  border: #5676a9 1px solid;
  font-size: 14px;
  border-radius: 3px;
  padding-left: 5px;
  color: #fff;
  clear: both;
}

.timeInput {
  float: left;
  height: 100%;
}

.computedButton {
  border: 0px;
  float: right;
  margin-right: 1px;
  height: 100%;
}

.computedButton button {
  padding: 0px;
  display: block;
  width: 22px;
  height: calc(50% - 0.5px);
  cursor: pointer;
  border: 0px;
  color: white;
  background: rgba(0, 0, 0, 0);
  text-align: center;
  line-height: 5px;
  font-size: 10px;
  border-radius: 10%;
  font-weight: lighter;
}
.computedButton button:hover{
  background: #20a0ff;
}
.timeInputShow {
  color: #fff;
  width: 25px;
  height: calc(100% - 1px);
  /* line-height: calc(100% - 1px); */
  border: 0px;
  text-align: center;
  cursor: pointer;
  background: none;
  float: left;
}

.timeInputOnly {
  float: left;
  width: 25px;
  height: calc(100% - 1px);
  border: 0px;
  text-align: center;
  background: none;
  position: relative;
}
.timeInputOnly p{
  position: absolute;
  top:48%;
  left: 50%;
 transform: translate(-50%,-50%);
}

.add,
.down {
  font-weight: 900;
  font-size: 24px;
  line-height: 12px;
  margin-right: -0.5px;
}
.add {
  margin-bottom: 1px;
  line-height: 1px !important;
}
.glyphicon-chevron-up {
  margin-top: -1px;
  margin-left: 0.5px;
}

.activeHours,
.activeMinute,
.activeSecond {
  border: 1px solid #20a0ff;
  color: #fff;
}
</style>
