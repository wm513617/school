<template>
  <div class="time-table-all" style="position:relative;">
    <div class="time-button-box">
      <Button class="delect-button-style" @click="delateAllTime" type="ghost" :disabled="flag" v-if="showDel">全部删除</Button>
      <Button class="delect-button-style" @click="delateSelectedTime" type="ghost" :disabled="flag" v-if="showDel">删除</Button>
    </div>
    <div class="time-table-box">
      <div class="time-title-box">
        <div class="" v-for="value of week" :key="value">{{value}}</div>
      </div>
      <div class="time-view-box" style="position:absolute;left:70px;" :style="{width:tablewidth+ 'px'}">
        <TimeBar v-for="(index,key) of timetable" :timeDay="key" :maxNum="maxNum" :key="key" :disenable="index.disenable" :timeList="index.timeList" v-on:isPopTrue="displayPopDiv" v-on:selectedTime="getSelectedTime" @position="getPopTimePosition"></TimeBar>
        <PopTime :cPopData="popData" v-if="popData.isPop" v-on:isPopFalse="hiddenPopDiv"></PopTime>
      </div>
    </div>
  </div>
</template>
<script>
import TimeBar from './TimeBar.vue'
import PopTime from './PopTime.vue'
export default {
  name: 'AlarmTimeTable',
  components: {
    TimeBar,
    PopTime
  },
  props: {
    showDel: {
      type: Boolean,
      default: true
    },
    timetable: {
      type: Array
    },
    maxNum: {
      type: Number,
      default: 8

    },
    buttonWidth: {
      type: Number
    },
    tablewidth: {
      type: Number,
      default: 877.5
    }
  },
  data() {
    return {
      week: [
        '周一',
        '周二',
        '周三',
        '周四',
        '周五',
        '周六',
        '周日',
        '节假日'
      ],
      popData: {
        time: {},
        isPop: false,
        sth: 0,
        stm: 0,
        eth: 0,
        etm: 0,
        left: 0,
        top: 0
      },
      flag: true // 没有设置时间段删除禁用
    }
  },
  created() {
    const temp = 0
    // for (let i = 0; i < 7; i++) {
    //   if (this.timetable[i].timeList.length >= 1) {
    //     temp++
    //   }
    // }
    if (temp === 0) {
      this.flag = true
    } else {
      this.flag = false
    }
  },
  watch: {
    timetable: {
      handler: function(val, oldVal) {
        let temp = 0
        for (let i = 0; i < 8; i++) {
          if (val[i].timeList.length >= 1) {
            temp++
          }
        }
        if (temp === 0) {
          this.flag = true
        } else {
          this.flag = false
        }
      },
      deep: true
    }
  },
  methods: {
    format(val) {
      val = parseInt(val) ? parseInt(val) : 0
      if (val < 10) {
        val = '0' + val
      }
      return val
    },
    getSelectedTime: function(selTime) {
      // 使所有isActive等于false,当前选中时间为true,这样当前选中才会高亮显示
      for (let i = 0; i < this.timetable.length; i++) {
        for (let r = 0; r < this.timetable[i].timeList.length; r++) {
          this.timetable[i].timeList[r].isActive = false
          selTime.isActive = true
        }
      }
    },
    delateSelectedTime: function() {
      if (this.flag) {

      } else {
        let temp = 0
        for (let i = 0; i < this.timetable.length; i++) {
          for (let r = 0; r < this.timetable[i].timeList.length; r++) {
            if (this.timetable[i].timeList[r].isActive === true) {
              this.$Modal.confirm({
                title: '警告',
                content: '<p>确认删除吗?</p>',
                onOk: () => {
                  this.sureDel()
                }
              })
              temp++
            } else {
              continue
            }
          }
        }
        if (temp === 0) {
          this.$Notice.warning({
            title: '提示',
            desc: '请选择要删除的时间段',
            duration: 2
          })
        }
        temp = null
      }
    },
    delateAllTime: function() {
      if (this.flag) {

      } else {
        let temp = 0
        for (let i = 0; i < this.timetable.length; i++) {
          temp += this.timetable[i].timeList.length
        }
        if (temp === 0) {
          return
        } else {
          this.showModalAll = true
          this.$Modal.confirm({
            title: '警告',
            content: '<p>确认删除吗?</p>',
            onOk: () => {
              this.sureAllDel()
            }
          })
        }
        temp = ''
      }
    },
    saveAllTime: function() {
      // 使所有isActive都为false
      for (let i = 0; i < this.timetable.length; i++) {
        if (this.timetable[i].timeList.length > 0) {
          this.timetable[i].timeList = this.delRepeatTime(this.timetable[i].timeList)
        }
        for (let r = 0; r < this.timetable[i].timeList.length; r++) {
          this.timetable[i].timeList[r].isActive = false
        }
      }
    },
    delRepeatTime: function(oldArr) {
      let arr = []
      for (let r = 0; r < oldArr.length; r++) {
        // arr[i].left = oldArr[i].startHouer * 60 + oldArr[i].startMin
        // arr[i].right = oldArr[i].endHouer * 60 + oldArr[i].endMin
        arr.push({
          left: oldArr[r].startHouer * 60 + oldArr[r].startMin,
          right: oldArr[r].endHouer * 60 + oldArr[r].endMin
        })
      }
      arr.sort(function(a, b) {
        return a.left === b.right ? a.right - b.right : a.left - b.left
      })
      let result = []
      while (arr.length) {
        var obj = arr[0]
        arr.splice(0, 1)
        for (let i = 0; i < arr.length; i++) {
          const cur = arr[i]
          if (cur.left > obj.right) {
            result.push(obj)
            break
          } else if (cur.right >= obj.right) {
            obj.right = cur.right
            arr.splice(i--, 1)
          } else {
            arr.splice(i--, 1)
          }
        }
      };
      result.push(obj)
      let newArr = []
      for (let d = 0; d < result.length; d++) {
        newArr.push({
          startHouer: parseInt(result[d].left / 60),
          startMin: result[d].left - parseInt(result[d].left / 60) * 60,
          endHouer: parseInt(result[d].right / 60),
          endMin: result[d].right - parseInt(result[d].right / 60) * 60
        })
      }
      return newArr
    },
    displayPopDiv: function(popTime) {
      // 显示时间弹出框，并使将弹出时间存入this.popData中
      this.popData.time = popTime
      this.popData.isPop = true
      this.popData.sth = this.format(popTime.startHouer)
      this.popData.stm = this.format(popTime.startMin)
      this.popData.eth = this.format(popTime.endHouer)
      this.popData.etm = this.format(popTime.endMin)
    },
    hiddenPopDiv: function() {
      // 隐藏弹出框
      this.popData.isPop = false
    },
    getPopTimePosition: function(dblTime) {
      // 求双击时间段的PX
      this.popData.left = this.tablewidth * 0.924 * ((dblTime[0] / 100) + (dblTime[1] / 100) / 2)
      this.popData.top = (dblTime[2]) * 45 - 130
    },
    sureDel: function() {
      // 找到isActive为true的对象删除掉
      for (let i = 0; i < this.timetable.length; i++) {
        for (let r = 0; r < this.timetable[i].timeList.length; r++) {
          if (this.timetable[i].timeList[r].isActive === true) {
            this.timetable[i].timeList.splice(r, 1)
          }
        }
      }
    },
    sureAllDel: function() {
      // 所有对象删除掉
      for (let i = 0; i < this.timetable.length; i++) {
        this.timetable[i].timeList = []
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.time-table-box {
  margin-top: 10px
}

.time-table-all {
  min-height: 300px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}

.time-view-box {
  float: left;
  box-sizing: border-box;
  position: relative;
}

.time-title-box {
  float: left;
  width: 50px;
  margin-right: 10px;
}

.time-title-box>div {
  height: 45px;
  line-height: 45px;
}

.time-button-box {
  overflow: hidden;
  width: 100%
}

.time-button-box .delect-button-style {
  float: right;
  margin-left: 5px;
  margin-right: 25px;
}

.time-button-box .delect-button-style[disabled] {
  background: #535f77;
  color: #cacaca;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .3);
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  border-radius: 2px;
  position: relative;
}

.modal-container-list {
  width: 370px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  position: fixed;
  left: 50%;
  top: 35%;
  margin-left: -175px;
}

.modal-header {
  height: 46px;
  line-height: 46px;
  padding: 0;
  overflow: hidden;
}

.modal-header span {
  float: left;
  margin-left: 20px;
  font-size: 14px;
}

.modal-header p {
  float: right;
  margin: 0;
  margin-right: 10px;
  font-size: 20px;
  color: #a8a8a8;
  cursor: pointer;
}

.modal-header p:hover {
  color: #333;
}

.modal-body {
  margin: 0;
  padding: 20px 20px 0;
  overflow: hidden;
}

.modal-body i {
  float: left;
  font-size: 26px;
  line-height: 26px;
  margin: 0 10px 20px 0;
  color: #fc6e30;
}

.modal-body p {
  line-height: 26px;
  margin: 0;
  padding-right: 10px;
}

.modal-footer {
  padding: 0 30px 10px;
  text-align: right;
  border-top: none;
  overflow: hidden;
}

.modal-footer p {
  float: right;
  height: 28px;
  line-height: 28px;
  padding: 0 20px;
  font-size: 12px;
  border-radius: 2px;
  cursor: pointer;
}

.sure-btn {
  background-color: #20a0ff;
  color: #fff;
}

.sure-btn:hover {
  background-color: #217ebd;
}

.delt-btn {
  color: #414141;
  border: 1px solid #d1d1d1;
  margin-left: 20px;
}

.delt-btn:hover {
  border-color: #20a0ff;
  color: #20a0ff;
}

.model-body {
  position: relative;
  padding-left: 16px;
}

.model-body div {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  position: absolute;
  top: 0;
  font-size: 12px;
  margin-left: 20px;
}
</style>
