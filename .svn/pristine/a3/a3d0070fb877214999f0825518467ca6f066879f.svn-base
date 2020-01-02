<template>
  <div class="time-bar" @mouseleave="leave($event)">
    <!-- <div class="bar-title">{{timeDay}}</div> -->
    <div class="bar-box" :class="{disenable:disenable}" @mousemove="move($event)" @mousedown="down($event)" @mouseup="up($event)" @mouseleave="leave($event)">
      <div class="bar-box-f3" ref="f3">
        <!-- <div class="STshow show" v-if="showTime.isDisplay" :style="{left:showTime.leftPosition+'%'}">{{showTime.sth+":"+showTime.stm}}</div> -->
        <div class="show" v-if="showTime.isDisplay&&(showTime.rightPosition-showTime.leftPosition)>=7.5" :style="{left:showTime.leftPosition-2.4+'%'}">
          <div class="react">
            {{showTime.sth+":"+showTime.stm}}
          </div>
          <div class="trigon"></div>
        </div>
        <!-- <div class="ETshow show" v-if="showTime.isDisplay" :style="{left:showTime.rightPosition-6+'%'}">{{showTime.eth+":"+showTime.etm}}</div> -->
        <div class="show" v-if="showTime.isDisplay&&(showTime.rightPosition-showTime.leftPosition)>=7.5" :style="{left:showTime.rightPosition-2.8+'%'}">
          <div class="react">
            {{showTime.eth+":"+showTime.etm}}
          </div>
          <div class="trigon"></div>
        </div>
        <div class="SETshow show" v-if="showTime.isDisplay&&(showTime.rightPosition-showTime.leftPosition)<7.5" :style="{left:showTime.leftPosition-2+'%'}">
          <div class="react">
            {{showTime.sth+":"+showTime.stm}} - {{showTime.eth+":"+showTime.etm}}
          </div>
          <div class="trigon"></div>
        </div>
        <div class="insideBox" v-for="(time,index) in timeList " :index="index" :class="[{ activeTime: time.isActive },{disenable:disenable},{discolor:disenable}]" :style="{left:(time.startHouer+time.startMin/60)/24*100+'%',width:((time.endHouer+time.endMin/60)-(time.startHouer+time.startMin/60))/24*100+'%'}" @mouseover="!disenable?insideBoxOver($event,index):null" @mousedown="insideBoxDown($event,index)" @mouseleave="!disenable?insideBoxLeave($event,index):null" @dblclick="!disenable?insideBoxDbclick($event,index):null" :key="index">
          <span class="leftMove" :index="index"></span>
          <span class="rightMove" :index="index"></span>
        </div>
      </div>
      <div class="bar-box-f2 clearfix">
        <div v-for="n in 25" :key="n"></div>
      </div>
      <div class="bar-box-f1 clearfix">
        <div class="clearfixNumber" v-for="n in 13" :key="n">{{ (n-1)*2 }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import AdjustTime from "./AdjustTime.vue"
// import { prompt } from '../../../assets/js/alertMess.js'
export default {
  name: 'TimeBar',
  props: {
    timeDay: {
      type: Number
    },
    timeList: {
      type: Array
    },
    disenable: {
      type: Boolean,
      default: false
    },
    maxNum: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      currentDiv: {
        x1: 0,
        x2: 0,
        mousedown: false,
        dragdown: false
      },
      showTime: {
        sth: 0,
        stm: 0,
        eth: 0,
        etm: 0,
        isDisplay: false,
        leftPosition: 0,
        rightPosition: 0
      },
      f3left: 0,
      nowIndex: 0,
      mousedown: false,
      boxWidth: '',
      isleftMove: false,
      isrightMove: false
    }
  },
  computed: {
    f3width() {
      return this.$el.querySelector('.bar-box-f3').offsetWidth
    }
    // STshowWidth () {
    //   return (this.$el.querySelectorAll('.STshow')[0].offsetWidth) / (this.$el.querySelector('.bar-box-f3').offsetWidth) * 100
    // }
  },
  watch: {
    timeList: {
      handler(newVal, oldVal) {
        for (let i = 0; i < this.timeList.length; i++) {
          const sh = newVal[i].startHouer
          const sm = newVal[i].startMin
          const eh = newVal[i].endHouer
          const em = newVal[i].endMin
          if ((sh + sm / 60) < 0) {
            this.timeList[i].startHouer = 0
            this.timeList[i].startMin = 0
          } else if (eh === 24) {
            this.timeList[i].endHouer = 24
            this.timeList[i].endMin = 0
          }
          if (sm > 59) {
            this.timeList[i].startMin = 59
          } else if (sm < 0) {
            this.timeList[i].startMin = 0
          } else if (em > 59) {
            this.timeList[i].endMin = 59
          } else if (em < 0) {
            this.timeList[i].endMin = 0
          }
        }
      },
      deep: true
    }
  },
  methods: {
    // 格式化时间
    format(val) {
      if (val < 10) {
        val = '0' + val
      }
      return val
    },
    // **创建时间段鼠标按下事件*/
    down(e) {
      if (this.disenable) { return }
      this.leave()
      this.mousedown = true
      this.currentDiv.x1 = e.clientX
      this.f3left = this.$refs.f3.getBoundingClientRect().left
      this.f3right = this.$refs.f3.getBoundingClientRect().right
      if (e.target.className === 'bar-box-f3') {
        this.currentDiv.mousedown = true
        if (this.timeList.length >= this.maxNum) {
          this.$Notice.warning({
            title: '提示',
            desc: '同一天最多支持8个不同的时间段',
            duration: 2
          })
          this.currentDiv.mousedown = false
          return
        } else {
          this.timeList.push({
            startHouer: parseInt((this.currentDiv.x1 - this.f3left) / this.f3width * 24),
            startMin: parseInt((this.currentDiv.x1 - this.f3left) / this.f3width * 24 * 60) % 60,
            endHouer: 0,
            endMin: 0,
            isActive: false,
            isBoxDown: false
          })
        }
        this.nowIndex = this.timeList.length - 1
        // 传递当前值至父组件
        const selTime = this.timeList[this.timeList.length - 1]
        this.$emit('selectedTime', selTime)
      } else if (e.target.className === 'insideBox' || e.target.className === 'insideBox activeTime') {
        if (e.offsetX) { this.offsetX = e.offsetX } else { this.offsetX = e.layerX }
        this.nowIndex = e.target.attributes.index.nodeValue
        this.timeList[this.nowIndex].isBoxDown = true
        this.boxWidth = e.target.getBoundingClientRect().width
      } else if (e.target.className === 'leftMove') {
        this.nowIndex = e.target.attributes.index.nodeValue
        this.timeList[this.nowIndex].dragdown = true
        this.isleftMove = true
        this.isrightMove = false
      } else if (e.target.className === 'rightMove') {
        this.nowIndex = e.target.attributes.index.nodeValue
        this.timeList[this.nowIndex].dragdown = true
        this.isleftMove = false
        this.isrightMove = true
      }
    },
    // **鼠标移动事件*/
    move(e) {
      if (!this.mousedown || e.clientX - this.f3left < 0) { return }
      if (this.currentDiv.mousedown) {
        this.currentDiv.x2 = e.clientX + 1
        if (this.currentDiv.x2 > this.currentDiv.x1) {
          this.timeList[this.nowIndex].endHouer = parseInt((this.currentDiv.x2 - this.f3left) / this.f3width * 24)
          this.timeList[this.nowIndex].endMin = parseInt((this.currentDiv.x2 - this.f3left) / this.f3width * 24 * 60) % 60
          if (this.timeList[this.nowIndex].endHouer >= 24) {
            this.timeList[this.nowIndex].endHouer = 24
            this.timeList[this.nowIndex].endMin = 0
          }
        } else {
          this.timeList[this.nowIndex].startHouer = parseInt((this.currentDiv.x2 - this.f3left) / this.f3width * 24)
          this.timeList[this.nowIndex].startMin = parseInt((this.currentDiv.x2 - this.f3left) / this.f3width * 24 * 60) % 60
          this.timeList[this.nowIndex].endHouer = parseInt((this.currentDiv.x1 - this.f3left) / this.f3width * 24)
          this.timeList[this.nowIndex].endMin = parseInt((this.currentDiv.x1 - this.f3left) / this.f3width * 24 * 60) % 60
        }
        this.insideBoxOver(e, this.nowIndex)
      } else if (this.timeList[this.nowIndex] && this.timeList[this.nowIndex].isBoxDown) {
        const mousedownClient = e.clientX
        this.timeList[this.nowIndex].startHouer = parseInt((mousedownClient - this.f3left - this.offsetX) / this.f3width * 24)
        this.timeList[this.nowIndex].startMin = parseInt((mousedownClient - this.f3left - this.offsetX) / this.f3width * 24 * 60) % 60
        this.timeList[this.nowIndex].endHouer = parseInt((mousedownClient - this.f3left + this.boxWidth - this.offsetX) / this.f3width * 24)
        this.timeList[this.nowIndex].endMin = parseInt((mousedownClient - this.f3left + this.boxWidth - this.offsetX) / this.f3width * 24 * 60) % 60
        if ((mousedownClient - this.f3left - this.offsetX) < 0) {
          // console.log('左边')
          this.timeList[this.nowIndex].startHouer = 0
          this.timeList[this.nowIndex].startMin = 0
          this.timeList[this.nowIndex].endHouer = parseInt(this.boxWidth / this.f3width * 24)
          this.timeList[this.nowIndex].endMin = parseInt(this.boxWidth / this.f3width * 24 * 60) % 60
        } else if ((mousedownClient - this.f3left + this.boxWidth - this.offsetX) > this.f3width) {
          // console.log('右边')
          this.timeList[this.nowIndex].startHouer = parseInt((this.f3width - this.boxWidth) / this.f3width * 24)
          this.timeList[this.nowIndex].startMin = parseInt((this.f3width - this.boxWidth) / this.f3width * 24 * 60) % 60
          this.timeList[this.nowIndex].endHouer = 24
          this.timeList[this.nowIndex].endMin = 0
        }
        this.insideBoxOver(e, this.nowIndex)
      } else if (this.isleftMove || this.isrightMove) {
        const dragMoveClient = e.clientX
        if (this.timeList[this.nowIndex].startHouer > this.timeList[this.nowIndex].endHouer || (this.timeList[this.nowIndex].startHouer === this.timeList[this.nowIndex].endHouer && this.timeList[this.nowIndex].startMin > this.timeList[this.nowIndex].endMin)) {
          this.timeList.splice(this.nowIndex, 1)
          this.leave()
          return
        }
        if (this.isleftMove) {
          this.timeList[this.nowIndex].startHouer = parseInt((dragMoveClient - this.f3left) / this.f3width * 24)
          this.timeList[this.nowIndex].startMin = parseInt((dragMoveClient - this.f3left) / this.f3width * 24 * 60) % 60
        }
        if (this.isrightMove) {
          this.timeList[this.nowIndex].endHouer = parseInt((dragMoveClient - this.f3left) / this.f3width * 24)
          this.timeList[this.nowIndex].endMin = parseInt((dragMoveClient - this.f3left) / this.f3width * 24 * 60) % 60
          if (this.timeList[this.nowIndex].endHouer >= 24) {
            this.timeList[this.nowIndex].endHouer = 24
            this.timeList[this.nowIndex].endMin = 0
          }
        }
        this.insideBoxOver(e, this.nowIndex)
      }
    },
    // **鼠标抬起事件*/
    up(e) {
      this.mousedown = false
      this.currentDiv.mousedown = false
      this.isleftMove = false
      this.isrightMove = false
      for (let i = 0; i < this.timeList.length; i++) {
        this.timeList[i].isBoxDown = false
        this.timeList[i].dragdown = false
        if (this.timeList[i].endHouer === 0 && this.timeList[i].endMin === 0) {
          this.timeList.splice(i, 1)
        }
      }
      let now = this.timeList[this.nowIndex]
      if (now && ((now.startHouer === now.endHouer && now.endMin - now.startMin < 5) || (now.startHouer - now.endHouer === -1 && 60 - now.startMin + now.endMin < 5))) {
        this.timeList.splice(this.nowIndex, 1)
        this.warningMsg('绘制时间不得小于5分钟')
      }
      // 判断重叠部分合并
      if (this.timeList.length <= 1) { return }
      this.combine(this.timeList, this.timeList[this.nowIndex])
    },
    // **鼠标离开事件*/
    leave(e) {
      if (this.currentDiv.mousedown) {
        if ((this.timeList[this.timeList.length - 1].endHouer + parseInt(this.timeList[this.timeList.length - 1].endMin / 60) - this.timeList[this.timeList.length - 1].startHouer - parseInt(this.timeList[this.timeList.length - 1].startMin / 60)) <= 0) {
          this.timeList.pop()
        }
      }
      this.up()
      this.showTime.isDisplay = false
    },
    insideBoxDown(e, index) {
      this.nowIndex = index
      const selTime = this.timeList[index]
      this.$emit('selectedTime', selTime)
    },
    insideBoxOver(e, index) {
      if (!this.timeList[index]) { return }
      this.showTime.isDisplay = true
      this.showTime.leftPosition = (this.timeList[index].startHouer + this.timeList[index].startMin / 60) / 24 * 100
      this.showTime.rightPosition = (this.timeList[index].endHouer + this.timeList[index].endMin / 60) / 24 * 100
      this.showTime.sth = this.format(this.timeList[index].startHouer)
      this.showTime.stm = this.format(this.timeList[index].startMin)
      this.showTime.eth = this.format(this.timeList[index].endHouer)
      this.showTime.etm = this.format(this.timeList[index].endMin)
    },
    insideBoxLeave(e, index) {
      // 4-1 鼠标移出时间段时显示消失
      this.showTime.isDisplay = false
    },
    insideBoxDbclick(e, index) {
      // 5 双击鼠标显示弹出框，传递当前时间段时间给父组件
      const popTime = this.timeList[index]
      const sendPopWidth = ((this.timeList[index].endHouer + this.timeList[index].endMin / 60) - (this.timeList[index].startHouer + this.timeList[index].startMin / 60)) / 24 * 100
      const sendPopLeft = (this.timeList[index].startHouer + this.timeList[index].startMin / 60) / 24 * 100
      this.$emit('isPopTrue', popTime)
      this.$emit('position', [sendPopLeft, sendPopWidth, Number(this.timeDay)])
    },
    // **时间段判断重叠事件*/
    isOverlap(arr, a) {
      if (!a) { return }
      const lastEndH = a.endHouer
      const lastEndM = a.endMin
      const firstEndH = a.startHouer
      const firstEndM = a.startMin
      let overlapData = []
      let n = ''
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].endHouer === lastEndH && arr[i].endMin === lastEndM && arr[i].startHouer === firstEndH && arr[i].startMin === firstEndM) {
          n = i
        }
        if (arr[i].endHouer < firstEndH || (arr[i].endHouer === firstEndH && arr[i].endMin < firstEndM)) {
          // console.log('前')
          continue
        } else if (arr[i].startHouer > lastEndH || (arr[i].startHouer === lastEndH && arr[i].startMin > lastEndM)) {
          // console.log('后')
          continue
        } else if ((arr[i].startHouer > firstEndH || (arr[i].startHouer === firstEndH && arr[i].startMin > firstEndM)) && (arr[i].endHouer < lastEndH || (arr[i].endHouer === lastEndH && arr[i].endMin < lastEndM))) {
          // console.log('外包')
          overlapData.push({ type: 3, index: i })
          continue
        } else if ((arr[i].startHouer < firstEndH || (arr[i].startHouer === firstEndH && arr[i].startMin < firstEndM)) && (arr[i].endHouer > lastEndH || (arr[i].endHouer === lastEndH && arr[i].endMin > lastEndM))) {
          // console.log('内包')
          overlapData.push({ type: 4, index: i })
          continue
        } else if ((arr[i].startHouer < firstEndH || (arr[i].startHouer === firstEndH && arr[i].startMin < firstEndM)) && (arr[i].endHouer > firstEndH || (arr[i].endHouer === firstEndH && arr[i].endMin > firstEndM))) {
          // console.log('前叠')
          overlapData.push({ type: 1, index: i })
          continue
        } else if ((arr[i].startHouer < lastEndH || (arr[i].startHouer === lastEndH && arr[i].startMin < lastEndM)) && (arr[i].endHouer > lastEndH || (arr[i].endHouer === lastEndH && arr[i].endMin > lastEndM))) {
          // console.log('后叠')
          overlapData.push({ type: 2, index: i })
          continue
        } else {
          // console.log('none')
        }
      }
      return { overlapData, n }
    },
    // **时间段合并重叠事件*/
    combine(arr, a) {
      const combinedata = this.isOverlap(arr, a)
      if (!combinedata) { return }
      if (combinedata.overlapData && combinedata.overlapData[0]) {
        let overlapData = combinedata.overlapData[0]
        const n = combinedata.n
        if (overlapData.type === 1) {
          arr[overlapData.index].endHouer = arr[n].endHouer
          arr[overlapData.index].endMin = arr[n].endMin
          arr.splice(n, 1)
          this.combine(arr, arr[overlapData.index])
        } else if (overlapData.type === 2) {
          arr[overlapData.index].startHouer = arr[n].startHouer
          arr[overlapData.index].startMin = arr[n].startMin
          arr.splice(n, 1)
          this.combine(arr, arr[overlapData.index])
        } else if (overlapData.type === 3) {
          arr.splice(overlapData.index, 1)
          if (arr[n]) {
            this.combine(arr, arr[n])
          } else {
            this.combine(arr, arr[n - 1])
          }
        } else if (overlapData.type === 4) {
          arr.splice(n, 1)
          this.combine(arr, arr[overlapData.index])
        }
      }
      this.showTime.isDisplay = false
      this.nowIndex = 0
    }
  },
  mounted() {
    setTimeout(function() {
      if (this.timeList.length) {
        for (let i = 0; i < this.timeList.length; i++) {
          this.timeList[i].isBoxDown = false
          this.timeList[i].dragdown = false
          if (!this.timeList[i].endSecond) { this.timeList[i].endSecond = 0 }
          if (!this.timeList[i].startSecond) { this.timeList[i].startSecond = 0 }
        }
      }
    }.bind(this), 1000)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/******固定的样式列表******/

.time-bar {
  width: 100%;
  height: 35px;
  font-size: 6px;
  margin-top: 10px;
}

.bar-title {
  width: 40px;
  height: 35px;
  line-height: 35px;
  float: left;
  text-align: left;
  font-size: 11px;
  position: relative;
  left: 5px;
}

.bar-box {
  width: 100%;
  height: 35px;
  float: left;
  box-sizing: border-box;
  position: relative;
}

.bar-box-f1,
.bar-box-f2 {
  width: 100%;
  position: relative;
  right: 3.85%;
  font-size: 10px;
}

.bar-box-f1>div {
  float: left;
  width: 7.69%;
  text-align: center;
  margin-top: 1px;
}

.bar-box-f2>div {
  float: left;
  width: 3.85%;
  height: 3px;
  border-right: 1px solid #999;
  box-sizing: border-box;
}

/*nth-child(odd) 与 :nth-child(even)*/

.bar-box-f2>div:nth-child(odd) {
  height: 6px;
}

.bar-box-f2>div:first-child {
  position: relative;
  left: 1px;
}

.bar-box-f2>div:first-child {
  border-left: 0;
}

.bar-box-f3 {
  width: 92.4%;
  /*margin-right: 7.6%;*/
  height: 12px;
  box-sizing: border-box;
  position: relative;
  background-color: #0f2243;
}

.clearfix:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

/*时间段的样式*/

.insideBox {
  position: absolute;
  height: 100%;
  top: 0;
  background-color: #5675ab;
  box-sizing: border-box;
  cursor: pointer;
}

.insideBox>span {
  position: absolute;
  height: 100%;
  box-sizing: border-box;
  width: 10px;
  border: 1px solid transparent;
}

.insideBox>span:hover {
  cursor: e-resize;
}

.leftMove {
  left: -5px;
}

.rightMove {
  right: -5px;
}

.activeTime {
  background-color: #7a95c0;
  z-index: 2;
}

/*提示框的样式*/

.show {
  position: relative;
  position: absolute;
  width: 40px;
  text-align: center;
  height: 20px;
  bottom: 12px;
}

.SETshow {
  width: 77px;
}

.react {
  height: 15px;
  width: 100%;
  border-radius: 3px;
  background-color: #7a95c0;
  color: #fff;
  line-height: 15px;
  font-size: 10px;
}

.trigon {
  width: 0;
  height: 0;
  font-size: 0;
  border: solid 5px;
  border-color: #878787 transparent transparent transparent;
  position: absolute;
  left: 15px;
}

.disenable {
  cursor: default;
}

.discolor {
  background-color: #ababab;
}

.clearfixNumber {
  font-size: 12px;
}
</style>
