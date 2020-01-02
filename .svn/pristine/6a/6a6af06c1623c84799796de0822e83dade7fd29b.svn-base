<template>
  <div class="popTimeBox">
    <div class="popTime" :style="{left: cPopData.left - 138 + 'px',top: cPopData.top + 'px'}">
      <div class='amendTime'>
        <input style="backgroundColor: #1C3053;border: 1px solid #5676a9;color:#FFF" type="text" v-model="cPopData.sth">：
        <input style="backgroundColor: #1C3053;border: 1px solid #5676a9;color:#FFF" type="text" v-model="cPopData.stm">
        <span>-</span>
        <input style="backgroundColor: #1C3053;border: 1px solid #5676a9;color:#FFF" type="text" v-model="cPopData.eth">：
        <input style="backgroundColor: #1C3053;border: 1px solid #5676a9;color:#FFF" type="text" v-model="cPopData.etm">
      </div>
      <div class="modal-footer">
        <Button size="small" type="primary" @click="savePopTime">确定</Button>
        <Button size="small" type="ghost" @click="backPopTime">取消</Button>
      </div>
      <div class='closePop icon iconfont icon-close1' @click="backPopTime "></div>
      <div class='trigon'>
        <div class='cont'></div>
      </div>
      <div class='mask'></div>
    </div>
    <div class="modal-mask" @click='backPopTime'></div>
  </div>
</template>

<script>
export default {
  name: 'PopTime',
  props: {
    cPopData: {
      type: Object
    }
  },
  data: function() {
    return {}
  },
  watch: {
    'cPopData.sth'(newValue) {
      newValue = parseInt(newValue) ? parseInt(newValue) : 0
      if (newValue >= 24) {
        this.cPopData.sth = 24
        this.cPopData.stm = 0
      } else if (newValue < 0) {
        this.cPopData.sth = 0
        this.cPopData.stm = 0
      } else {
        this.cPopData.sth = this.format(newValue)
      }
    },
    'cPopData.stm'(newValue) {
      newValue = parseInt(newValue) ? parseInt(newValue) : 0
      if (newValue >= 60) {
        // this.cPopData.sth += 1
        this.cPopData.stm = 0
      } else if (newValue < 0) {
        this.cPopData.stm = 0
      } else if (this.cPopData.sth === 24) {
        this.cPopData.stm = 0
      } else {
        this.cPopData.stm = this.format(newValue)
      }
    },
    'cPopData.eth'(newValue) {
      newValue = parseInt(newValue) ? parseInt(newValue) : 0
      if (newValue >= 24) {
        this.cPopData.eth = 24
        this.cPopData.etm = 0
      } else if (newValue < 0) {
        this.cPopData.eth = 0
        this.cPopData.etm = 0
      } else {
        this.cPopData.eth = this.format(newValue)
      }
    },
    'cPopData.etm'(newValue) {
      newValue = parseInt(newValue) ? parseInt(newValue) : 0
      if (newValue >= 60) {
        // this.cPopData.eth += 1
        this.cPopData.etm = 0
      } else if (newValue < 0) {
        this.cPopData.etm = 0
      } else if (this.cPopData.eth === 24) {
        this.cPopData.etm = 0
      } else {
        this.cPopData.etm = this.format(newValue)
      }
    }
  },
  methods: {
    // 格式化时间
    format(val) {
      val = parseInt(val) ? parseInt(val) : 0
      if (val < 10) {
        val = '0' + val
      }
      if (val === 0) { val = '00' }
      return val
    },
    savePopTime: function() {
      if (parseInt(this.cPopData.sth) > parseInt(this.cPopData.eth)) {
        this.$Notice.warning({
          title: '提示',
          desc: '开始时间应小于结束时间',
          duration: 2
        })
      } else if (this.cPopData.sth === this.cPopData.eth && parseInt(this.cPopData.stm) > parseInt(this.cPopData.etm)) {
        this.$Notice.warning({
          title: '提示',
          desc: '开始时间应小于结束时间',
          duration: 2
        })
      } else if (
        (this.cPopData.sth === this.cPopData.eth && this.cPopData.etm - this.cPopData.stm < 5) ||
        (this.cPopData.sth - this.cPopData.eth === -1 && 60 - this.cPopData.stm + this.cPopData.etm < 5)
      ) {
        this.$Notice.warning({
          title: '提示',
          desc: '最小绘制时间为5分钟',
          duration: 2
        })
      } else {
        this.cPopData.time.startHouer = parseInt(this.cPopData.sth)
        this.cPopData.time.startMin = parseInt(this.cPopData.stm)
        this.cPopData.time.endHouer = parseInt(this.cPopData.eth)
        this.cPopData.time.endMin = parseInt(this.cPopData.etm)
        this.$emit('isPopFalse')
      }
    },
    backPopTime: function() {
      this.$emit('isPopFalse')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.popTime {
  width: 300px;
  height: 124px;
  padding: 0 30px 0 20px;
  text-align: center;
  background-color: #7a95c0;
  /*border: 1px solid #0f2243;*/
  font-size: 12px;
  position: absolute;
  z-index: 99999;
}

.amendTime {
  margin: 30px 0 20px;
}

input {
  height: 26px;
  width: 45px;
  line-height: 22px;
  text-align: center;
}

input[type='number'] {
  -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
}

.modal-footer {
  width: 100%;
  padding: 0 30px;
  margin-bottom: 20px;
  text-align: center;
  border-top: none;
  overflow: hidden;
}

.modal-footer p {
  margin: 0;
  float: right;
  height: 26px;
  line-height: 26px;
  padding: 0 10px;
  font-size: 12px;
  border-radius: 2px;
  cursor: pointer;
}

.modal-footer p.sure-btn {
  background-color: #20a0ff;
  margin-right: 20px;
  color: #fff;
}

.trigon {
  position: absolute;
  top: 123px;
  left: 138px;
  width: 0;
  height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 11px solid #1c3053;
}

.cont {
  position: absolute;
  top: -11px;
  left: -6px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 9px solid #7a95c0;
}

.popTime .closePop {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 10px;
  height: 10px;
  color: #ffffff;
  font-size: 10px;
  cursor: pointer;
}
</style>
