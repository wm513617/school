<template>
  <div id="parent">
    <div class="startRange clearfix">
      <span class="startTag">{{$t('playBack.startTime')}}</span>
      <div class="startInput"
           :style="{'margin-left':marginLeft + 'px'}">
        <timepicker v-on:timeChange="getStartTimeChange"
                    v-on:childHours="getChildStartHours"
                    v-on:childMinute="getChildStartMinute"
                    v-on:childSecond="getChildStartSecond"
                    :hourValue="starthours"
                    :minuteValue="startminute"
                    :secondValue="startsecond"></timepicker>
      </div>
    </div>
    <div class="endRange clearfix">
      <span class="endTag">{{$t('playBack.endTime')}}</span>
      <div class="endInput "
           :style="{'margin-left':marginLeft + 'px'}">
        <timepicker v-on:timeChange="getEndTimeChange"
                    v-on:childHours="getChildEndHours"
                    v-on:childMinute="getChildEndMinute"
                    v-on:childSecond="getChildEndSecond"
                    :hourValue="endhours"
                    :minuteValue="endminute"
                    :secondValue="endsecond"></timepicker>
      </div>
    </div>
  </div>
</template>

<script>
import timepicker from './BStimePicker.vue'

export default {
  name: 'BStimeRange',
  data() {
    return {
      starthours: 0,
      startminute: 0,
      startsecond: 0,
      endhours: new Date().getHours(),
      endminute: new Date().getMinutes(),
      endsecond: new Date().getSeconds()
    }
  },
  props: {
    defaultStartTime: { type: String },
    defaultEndTime: { type: String },
    marginLeft: {
      default: 5
    }
  },
  components: {
    timepicker
  },
  created() {
    this.$emit('timeNormalChange', this.setStartNormalTime, this.setEndNormalTime)
  },
  computed: {
    setStartNormalTime: function() {
      const startNormalHours = this.starthours < 10 ? '0' + this.starthours : this.starthours
      const startNormalMinute = this.startminute < 10 ? '0' + this.startminute : this.startminute
      const startNormalSecond = this.startsecond < 10 ? '0' + this.startsecond : this.startsecond
      const startNormalTime = startNormalHours + ':' + startNormalMinute + ':' + startNormalSecond
      return startNormalTime
    },
    setEndNormalTime: function() {
      const endNormalHours = this.endhours < 10 ? '0' + this.endhours : this.endhours
      const endNormalMinute = this.endminute < 10 ? '0' + this.endminute : this.endminute
      const endNormalSecond = this.endsecond < 10 ? '0' + this.endsecond : this.endsecond
      const endNormalTime = endNormalHours + ':' + endNormalMinute + ':' + endNormalSecond
      return endNormalTime
    }
  },
  watch: {
    defaultEndTime() {
      const defaultTimes2 = this.defaultEndTime.split(':')
      this.endhours = defaultTimes2[0]
      this.endminute = defaultTimes2[1]
      this.endsecond = defaultTimes2[2]
    },
    defaultStartTime() {
      const defaultTimes1 = this.defaultStartTime.split(':')
      this.starthours = defaultTimes1[0]
      this.startminute = defaultTimes1[1]
      this.startsecond = defaultTimes1[2]
    }
  },
  methods: {
    getChildStartHours(childHoursArgs) {
      this.starthours = childHoursArgs
    },
    getChildEndHours(childHoursArgs) {
      this.endhours = childHoursArgs
    },
    getChildStartMinute(childHoursArgs) {
      this.startminute = childHoursArgs
    },
    getChildEndMinute(childHoursArgs) {
      this.endminute = childHoursArgs
    },
    getChildStartSecond(childHoursArgs) {
      this.startsecond = childHoursArgs
    },
    getChildEndSecond(childHoursArgs) {
      this.endsecond = childHoursArgs
    },
    getStartTimeChange(setvalue) {
      if (setvalue[0] > this.endhours) {
        this.endhours = parseInt(setvalue[0])
      } else {
        this.endhours = parseInt(this.endhours)
      }
      if (setvalue[0] === this.endhours && setvalue[1] > this.endminute) {
        this.endminute = parseInt(setvalue[1])
      } else {
        this.endminute = parseInt(this.endminute)
      }
      if (setvalue[0] === this.endhours && setvalue[1] === this.endminute && setvalue[2] > this.endsecond) {
        this.endsecond = parseInt(setvalue[2])
      } else {
        this.endsecond = parseInt(this.endsecond)
      }
      const startChangeTime = setvalue[0] + ':' + setvalue[1] + ':' + setvalue[2]
      const endHours = this.endhours < 10 ? '0' + this.endhours : this.endhours
      const endMinute = this.endminute < 10 ? '0' + this.endminute : this.endminute
      const endSecond = this.endsecond < 10 ? '0' + this.endsecond : this.endsecond
      const endChangeTime = endHours + ':' + endMinute + ':' + endSecond
      this.$emit('timeStartChange', startChangeTime, endChangeTime)
    },
    getEndTimeChange(setvalue) {
      if (setvalue[0] < this.starthours) {
        this.starthours = parseInt(setvalue[0])
      } else {
        this.starthours = parseInt(this.starthours)
      }
      if (setvalue[0] === this.starthours && setvalue[1] < this.startminute) {
        this.startminute = parseInt(setvalue[1])
      } else {
        this.startminute = parseInt(this.startminute)
      }
      if (setvalue[0] === this.starthours && setvalue[1] === this.startminute && setvalue[2] < this.startsecond) {
        this.startsecond = parseInt(setvalue[2])
      } else {
        this.startsecond = parseInt(this.startsecond)
      }
      const changeStartHours = this.starthours < 10 ? '0' + this.starthours : this.starthours
      const changeStartMinute = this.startminute < 10 ? '0' + this.startminute : this.startminute
      const changeStartSecond = this.startsecond < 10 ? '0' + this.startsecond : this.startsecond
      const startChangeTime = changeStartHours + ':' + changeStartMinute + ':' + changeStartSecond
      const endChangeTime = setvalue[0] + ':' + setvalue[1] + ':' + setvalue[2]
      this.$emit('timeEndChange', startChangeTime, endChangeTime)
    }
  },
  mounted: function() {
    if (this.defaultStartTime) {
      const defaultTimes1 = this.defaultStartTime.split(':')
      this.starthours = defaultTimes1[0]
      this.startminute = defaultTimes1[1]
      this.startsecond = defaultTimes1[2]
    }
    if (this.defaultEndTime) {
      const defaultTimes2 = this.defaultEndTime.split(':')
      this.endhours = defaultTimes2[0]
      this.endminute = defaultTimes2[1]
      this.endsecond = defaultTimes2[2]
    }
  }
}
</script>

<style scoped>
#parent {
  margin-top: 25px;
}

.startRange,
.endRange {
  margin-bottom: 10px;
  font-size: 14px;
}

.startTag {
  line-height: 24px;
  float: left;
  font-size: 12px;
  width: 53px;
}

.startInput {
  float: left;
  margin-left: 5px;
}

.endRange {
  clear: both;
}

.endTag {
  float: left;
  line-height: 24px;
  font-size: 12px;
  width: 53px;
}

.endInput {
  float: left;
  margin-left: 5px;
}
</style>
