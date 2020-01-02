<template>
    <div class="time-select" @click.stop='bodyClick'>
      <Input v-model="value" @on-blur='inputBlur' :disabled='disable' @on-change='timeChange' icon="ios-time-outline" @on-click='clickIcon' style="width: 160px;" />
      <div class="time-content" v-if='isContent'>
        <div class="time-box" v-if='isTimeBox'>
        <div class="hour row">
          <ul>
            <li @click='addHour'><Icon type="ios-arrow-up" /></li>
            <li @click='clickHour'>{{hour}}</li>
            <li @click='subtractHour'><Icon type="ios-arrow-down" /></li>
          </ul>
        </div>
        <div class="row">
          ：
        </div>
        <div class="minute row">
          <ul>
            <li @click='addMinute'><Icon type="ios-arrow-up" /></li>
            <li @click='clickMinute'>{{minute}}</li>
            <li @click='subtractMinute'><Icon type="ios-arrow-down" /></li>
          </ul>
        </div>
        <div class="row">
           ：
        </div>
        <div class="second row">
          <ul>
            <li @click='addSecond'><Icon type="ios-arrow-up" /></li>
            <li @click='clickSecond'>{{second}}</li>
            <li @click='subtractSecond'><Icon type="ios-arrow-down" /></li>
          </ul>
        </div>
      </div>
      <div class='hour-select box' v-if='isHour'>
        <ul>
          <li v-for='(item, index) in hourList' :key='index' @click='clickHourItem(item)'>{{item}}</li>
        </ul>
      </div>
      <div class='minute-select box' v-if='isMinute'>
        <ul>
          <li v-for='(item, index) in minuteList' :key='index' @click='clickMinuteItem(item)'>{{item}}</li>
        </ul>
      </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'TimeSelect',
  props: {
    datetime: {
      type: [String, Date],
      default: '00:00:00'
    },
    disable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isTimeBox: false,
      isHour: false,
      isMinute: false,
      isClick: false,
      isContent: false,
      value: '00:00:00',
      isSecond: '',
      hour: '',
      minute: '',
      second: '',
      hourList: [ '00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22' ],
      minuteList: [ '00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55' ]
    }
  },
  methods: {
    clickFun() {
    // console.log(e.target)
      this.isContent = false
      this.isTimeBox = false
      this.isHour = false
      this.isMinute = false
    },
    clickIcon() {
      document.addEventListener('click', this.clickFun)
      if (!this.disable) {
        this.isTimeBox = true
        let arr = this.value.split(':', 3)
        console.log(arr)
        this.hour = arr[0]
        this.minute = arr[1]
        this.second = arr[2]
      } else {
        this.isTimeBox = false
      }
    },
    addHour() {
      this.hour = Number(this.hour) + 1
      if (this.hour < 10) {
        this.hour = '0' + this.hour
      } else if (this.hour > 23) {
        this.hour = '00'
      }
    },
    subtractHour() {
      this.hour = Number(this.hour) - 1
      if (this.hour < 10) {
        if (this.hour < 0) {
          this.hour = '23'
        } else {
          this.hour = '0' + this.hour
        }
      }
    },
    addMinute() {
      this.minute = Number(this.minute) + 1
      if (this.minute < 10) {
        this.minute = '0' + this.minute
      } else if (this.minute > 59) {
        this.minute = '00'
      }
    },
    subtractMinute() {
      this.minute = Number(this.minute) - 1
      if (this.minute < 10) {
        if (this.minute < 0) {
          this.minute = '59'
        } else {
          this.minute = '0' + this.minute
        }
      }
    },
    addSecond() {
      this.second = Number(this.second) + 1
      if (this.second < 10) {
        this.second = '0' + this.second
      } else if (this.second > 59) {
        this.second = '00'
      }
    },
    subtractSecond() {
      this.second = Number(this.second) - 1
      if (this.second < 10) {
        if (this.second < 0) {
          this.second = '59'
        } else {
          this.second = '0' + this.second
        }
      }
    },
    clickHour() {
      this.isHour = true
      this.isTimeBox = false
    },
    clickMinute() {
      this.isMinute = true
      this.isTimeBox = false
      this.isSecond = '0'
    },
    clickSecond() {
      this.isSecond = '1'
      this.isMinute = true
      this.isTimeBox = false
    },
    clickHourItem(item) {
      this.hour = item
      this.isHour = false
      this.isTimeBox = true
    },
    clickMinuteItem(item) {
      if (this.isSecond === '0') {
        this.minute = item
      } else {
        this.second = item
      }
      this.isMinute = false
      this.isTimeBox = true
    },
    timeChange() {
      // console(111111)
    },
    bodyClick() {
      this.isContent = true
    },
    inputBlur() {
      if ((/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/).test(this.value)) {
        this.value = this.value
      } else if (Number(this.value)) {
        // console.log(this.value.substr(0, 2), '1111111111111')
        var arr = []
        if ((/^([0-1][0-9]|2[0-3])$/).test(this.value.substr(0, 2))) {
          arr.push(this.value.substr(0, 2))
          if ((/^([0-5][0-9])$/).test(this.value.substr(2, 2))) {
            arr.push(this.value.substr(2, 2))
            if ((/^([0-5][0-9])$/).test(this.value.substr(4, 2))) {
              arr.push(this.value.substr(4, 2))
              this.value = arr.join(':')
            } else {
              arr.push('00')
              this.value = arr.join(':')
            }
          } else {
            arr.push('00')
            arr.push('00')
            this.value = arr.join(':')
          }
        } else {
          // arr.push('00')
          this.value = this.datetime
        }
      } else {
        this.value = this.datetime
      }
      // this.$emit('on-change', this.value)
    }
  },
  created() {
    if (typeof (this.datetime) === 'string') {
      this.value = this.datetime
    } else {
      this.value = this.$moment(this.datetime).format('HH:mm:ss')
    }
    // this.value = this.datetime
    // document.onclick = (e) => {
    //   // console.log(e.target)
    //   this.isContent = false
    //   this.isTimeBox = false
    //   this.isHour = false
    //   this.isMinute = false
    // //   console.log(document.activeElement)
    // }
  },
  mounted() {
    let arr = this.value.split(':', 3)
    // console.log(arr)
    this.hour = arr[0]
    this.minute = arr[1]
    this.second = arr[2]
  },
  watch: {
    value() {
      if ((/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/).test(this.value)) {
        this.$emit('on-change', this.value)
      }
    },
    hour() {
      let arr = []
      arr.push(this.hour)
      arr.push(this.minute)
      arr.push(this.second)
      this.value = arr.join(':')
    },
    minute() {
      let arr = []
      arr.push(this.hour)
      arr.push(this.minute)
      arr.push(this.second)
      this.value = arr.join(':')
    },
    second() {
      let arr = []
      arr.push(this.hour)
      arr.push(this.minute)
      arr.push(this.second)
      this.value = arr.join(':')
    },
    datetime() {
      if (typeof (this.datetime) === 'string') {
        this.value = this.datetime
      } else {
        this.value = this.$moment(this.datetime).format('HH:mm:ss')
      // console.log(this.value, '2222222222222')
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickFun)
  }
}
</script>

<style lang='less' scoped>
  .time-select{
    width: 100%;
    height: 100%;
    // background: red;
    /deep/ .ivu-input{
      height: 26px;
    }
    /deep/ .ivu-input-icon{
      width: 26px;
      height: 26px;
      line-height: 26px;
    }
    .time-content{
      width: 100%;
      position: relative;
    }
    .time-box{
      position: absolute;
      border: 1px solid #4BA4FF;
      border-radius: 5px;
      padding: 10px 20px;
      width: 100%;
      height: 92px;
      background: #1B3153;
      top: 5px;
      left: 0;
      z-index: 10000;
      .row{
        width: 20%;
        height: 100%;
        text-align: center;
        line-height: 72px;
        font-size: 16px;
        color: #fff;
        float: left;
      }
      .row ul li{
        font-size: 12px;
        line-height: 24px;
        border-radius: 5px;
        text-align: center;
        i{
          color: #4597F6;
          font-size: 20px;
        }
      }
      .row ul li:hover{
        background: #657CA8;
      }
    }
    .box{
      position: absolute;
      border: 1px solid #4BA4FF;
      border-radius: 5px;
      padding: 16px 8px;
      width: 100%;
      // height: 92px;
      background: #1B3153;
      top: 5px;
      color: #fff;
      left: 0;
      z-index: 10000;
      ul{
        width: 100%;
        li{
          width: 16.6%;
          display: inline-block;
          padding: 5px 0;
          text-align: center;
          border-radius: 5px;
        }
        li:hover{
          background: #4597F6;
        }
      }
    }
  }
</style>
