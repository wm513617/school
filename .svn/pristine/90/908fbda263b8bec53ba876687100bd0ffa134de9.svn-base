<template>
  <div style="background: #1b3153;width:100%;line-height:35px">
    <h3>设备校时</h3>
    <div class="timecontent">
      <div>
        <label class="lefttitle">服务器时间</label>
        <DatePicker type="datetime" v-model="serverTime" placeholder="00:00:00" :readonly="true" style="width: 200px"></DatePicker>
      </div>
      <div>
        <label class="lefttitle">手动校时</label>
        <div class="rightcontent">
          <p>校时对象</p>
          <checkbox class="rightcontent" v-model="deviceProof">前端设备</checkbox>
          <Button style="display:block" @click="clickManualProof" :disabled="!deviceProof">校时</Button>
        </div>
      </div>
      <div>
        <label class="lefttitle">自动校时</label>
        <checkbox v-model="initData.autoProof">启用</checkbox>
        <div class="rightcontent">
          <p>校时对象</p>
          <checkbox v-model="initData.deviceSelected" class="rightcontent">前端设备</checkbox>
          <div style="margin-top:10px">
            <label class="lefttitle">校时周期</label>
            <Select v-model="initData.cycle" style="width:200px">
              <Option v-for="item in dayTime" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <span>天</span>
          </div>
          <div style="margin-top:10px">
            <label class="lefttitle">执行时间</label>
            <!--<TimePicker type="time" v-model="initData.execTime" style="width: 168px"></TimePicker>-->
            <el-time-picker v-model="initData.execTime" size="mini" popper-class="tp" placeholder="选择时间" style="width: 160px;" ></el-time-picker>
          </div>
          <div style="margin-top:16px">
            <Button @click="clickAutoCancel" style="margin-right:8px">取消</Button>
            <Button type="primary" @click="clickAutoProof" :disabled="!initData.deviceSelected">确定</Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      // 校时周期下拉框
      dayTime: [],
      // 服务器时间
      serverTime: '00:00:00',
      // 手动校时 前端设备勾选
      deviceProof: false,
      // 自动校时 数据对象
      initData: {
        cycle: 7,
        execTime: '00:00:00',
        autoProof: false,
        deviceSelected: false
      },
      // 定时器
      interval: null
    }
  },
  created() {
    this.dayTime = []
    for (let i = 1; i < 31; i++) {
      this.dayTime.push({ label: i, value: i })
    }
    this.initProof()
  },
  methods: {
    ...mapActions(['getProofInfo', 'manualProof', 'setAutoProof']),
    // 初始化页面数据
    initProof() {
      this.getProofInfo().then((res) => {
        let time = res.serverTime * 1000
        if (this.interval) {
          clearInterval(this.interval)
        }
        this.interval = setInterval(() => {
          this.serverTime = new Date(time)
          time += 1000
        }, 1000)
        delete res.serverTime
        this.initData = { ...this.initData, ...res, execTime: new Date(new Date().setHours(0, 0, 0) + (res.execTime || 0) * 1000) }
      }).catch((err) => {
        console.log('getProofInfo error: ' + err)
      })
    },
    // 点击手动校时
    clickManualProof() {
      if (this.deviceProof) {
        this.manualProof()
        this.successMsg('校时成功')
      }
    },
    // 自动校时
    clickAutoProof() {
      if (this.initData.deviceSelected) {
        let data = JSON.parse(JSON.stringify(this.initData))
        data.execTime = this.$moment(this.initData.execTime).format('HH:mm:ss')
        let s = ''
        let hour = data.execTime.split(':')[0]
        let min = data.execTime.split(':')[1]
        let sec = data.execTime.split(':')[2]
        s = Number(hour * 3600) + Number(min * 60) + Number(sec)
        data.execTime = s
        this.setAutoProof(data).then(suc => {
          if (suc.status === 200) {
            this.successMsg('校时成功')
          } else {
            this.errorMsg('校时失败')
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    clickAutoCancel() {
      this.successMsg('取消校时')
      this.initProof()
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  }
}
</script>
<style scoped>
h3 {
  font-size: 14px;
  height: 38px;
  line-height: 38px;
  background: #0f2243;
  padding-left: 24px;
  font-weight: normal;
  margin-bottom: 15px;
}
.timecontent {
  margin-left: 48px;
}
.lefttitle {
  width: 100px;
  display: inline-block;
  margin: 20px 0 0 0;
}
.rightcontent {
  margin-left: 100px;
}
/* .rightcontent p,
.rightcontent checkbox,
.rightcontent label {
  height: 30px;
  line-height: 30px;
} */
</style>
