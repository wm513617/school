<!--应用模式 点击地图上报警点位的气泡弹框页面-->
<template>
  <div class="mapAppAlarmInfo">
    <div class="mapAppInfoTittle">
      <div class="mapAppVideoTittle">
        <div class="detail">报警信息</div>
        <div class="close iconfont icon-error" @click.prevent="close" title="关闭"></div>
      </div>
    </div>
    <div class="mapAppInfoContent">
      <div class="infoTop">
        <div class="infoDetail">
          <div class="infoLabel">名称</div>
          <div class="infoValue">{{oneAlarmData.name}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">编号</div>
          <div class="infoValue">{{oneAlarmData.chan}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">级别</div>
          <div class="infoValue">{{oneAlarmData.level}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">状态</div>
          <div class="infoValue">{{withdraw}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">点位类型</div>
          <div class="infoValue">{{pointType}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">负责单位</div>
          <div class="infoValue">{{oneAlarmData.point.charge}}</div>
        </div>
        <div v-for="(item, index) in oneAlarmData.point.principal" :key="index">
          <div class="infoDetail">
            <div class="infoLabel">负责人</div>
            <div class="infoValue">{{item.name}}</div>
          </div>
          <div class="infoDetail">
            <div class="infoLabel">电话</div>
            <div class="infoValue">{{item.mobile}}</div>
          </div>
        </div>
        <div class="infoDetail" v-if="oneAlarmData.type === 1">
          <div class="infoLabel">布防时间</div>
          <div class="infoValue">{{withdrawTime}}</div>
        </div>
        <div class="infoDetail">
          <div class="infoLabel">简介</div>
          <div class="infoValueArea">{{oneAlarmData.point.desc}}</div>
        </div>
        <Button type="primary" v-if="oneAlarmData.type === 1" @click="setAlarmArm" :disabled="isOnline ? defensestatus : true">布防</Button>
        <Button type="primary" v-if="oneAlarmData.type === 1" @click="setAlarmUnArm" :disabled="isOnline ? !defensestatus : true">撤防</Button>
        <!-- <Button type="primary" @click="setAlarmArm" :disabled="!(isOnline && !defensestatus)">布防</Button>
                    <Button type="primary" @click="setAlarmUnArm" :disabled="!(isOnline && defensestatus)">撤防</Button> -->
        <Button type="primary" @click="openall" v-if="isShowButton">查看消息</Button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import appFireAlarm from '../../../../assets/map/app/appFireAlarm'
export default {
  data() {
    return {
      oneAlarmData: {
        name: '',
        status: '',
        point: {
          charge: '',
          principal: [],
          desc: ''
        }
      },
      pointType: '',
      withdrawTime: '',
      withdraw: '',
      defensestatus: null,
      isOnline: false,
      isShowButton: true
    }
  },
  computed: {
    ...mapState({
      oneMapAlarm: ({ mapAlarmData }) => mapAlarmData.oneMapAlarmData, // 报警资源
      appAlarmList: ({ mapAlarmData }) => mapAlarmData.appAlarmList,
      fireAlarmList: ({ mapAlarmData }) => mapAlarmData.fireAlarmList, // 报警消息列表列表
      isAppOuter: ({ mapAreaData }) => mapAreaData.isAppOuter // 楼层内外
    })
  },
  watch: {
    oneMapAlarm(val) {
      this.todata(val)
    }
  },
  methods: {
    ...mapActions(['setDefenseOn', 'setDefenseOff', 'getOneAlarm']),
    ...mapMutations(['SET_APPDETAIL_STATE', 'SET_MAPAPPRIGHT_PAGE', 'SET_APPALARM_LIST']),
    todata(val) {
      this.oneAlarmData = JSON.parse(JSON.stringify(val))
      if (this.oneAlarmData.status.toString() === '1') {
        this.isOnline = true
      } else {
        this.isOnline = false
      }
      this.pointType = this.toMapSign(this.oneAlarmData.mapsign) // 点位类型
      this.withdrawTime = this.toWithdrawTime(this.oneAlarmData.alarmtemplate) // 布撤防时间
      this.withdraw = this.toWithdraw(this.oneAlarmData) // 布撤防状态
    },
    // 布防
    setAlarmArm() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认布防吗？</p>',
        onOk: () => {
          this.setDefensesOn(true)
        },
        onCancel: () => {}
      })
    },
    // 撤防
    setAlarmUnArm() {
      this.$Modal.confirm({
        title: '警告',
        content: '<p>确认撤防吗？</p>',
        onOk: () => {
          this.setDefensesOff(false)
        },
        onCancel: () => {}
      })
    },
    // 根据当前报警点位的布撤防状态改变图标显示
    changeAlarmArmStatus(status) {
      let alarms = appFireAlarm.setAlarmArmStatus(this.appAlarmList, this.oneAlarmData.point._id, status)
      this.$store.commit('SET_APPALARM_LIST', alarms)
    },
    setDefensesOn(val) {
      // 撤防接口报错
      this.setDefenseOn(this.oneAlarmData._id)
        .then(res => {
          this.defensestatus = val
          let isInAlarming = this.fireAlarmList.some(item => item.param[0].channelId === this.oneAlarmData._id)
          if (!isInAlarming) {
            this.changeAlarmArmStatus(val)
          }
          this.getOneAlarm(this.oneAlarmData._id)
            .then(res => {
              console.log(res)
            })
            .catch(err => {
              console.log(err)
              this.errorMsg('报警点位信息获取失败')
            })
        })
        .catch(err => {
          console.log(err)
          this.errorMsg(err.response.data.message)
        })
    },
    setDefensesOff(val) {
      // 撤防接口报错
      this.setDefenseOff(this.oneAlarmData._id)
        .then(res => {
          this.defensestatus = val
          let isInAlarming = this.fireAlarmList.some(item => item.param[0].channelId === this.oneAlarmData._id)
          if (!isInAlarming) {
            this.changeAlarmArmStatus(val)
          }
          this.getOneAlarm(this.oneAlarmData._id)
            .then(res => {})
            .catch(err => {
              console.log(err)
              this.errorMsg('报警点位信息获取失败')
            })
        })
        .catch(err => {
          console.log(err)
          this.errorMsg(err.response.data.message)
        })
    },
    close() {
      this.$store.commit('SET_APPDETAIL_STATE', '')
    },
    toMapSign(val) {
      if (val) {
        let sign = val.signtype.toString()
        if (sign === '0') {
          return '图标'
        } else if (sign === '1') {
          return '线'
        } else if (sign === '2') {
          return '区域'
        }
      } else {
        return '图标'
      }
    },
    // 布防时间
    toWithdrawTime(val) {
      if (val) {
        return val.name
      } else {
        return '无'
      }
    },
    // 布防状态
    toWithdraw(val) {
      if (val.status.toString() === '1') {
        if (val.alarmStatus && val.alarmStatus === 'arm') {
          this.defensestatus = true // val.alarmStatus
          return '布防中'
        } else {
          this.defensestatus = false // val.alarmStatus
          return '未布防'
        }
      } else {
        this.defensestatus = false
        return '未布防'
      }
    },
    openall() {
      this.$store.commit('SET_MAPAPPRIGHT_PAGE', 'alarmList')
    }
  },
  mounted() {
    this.todata(this.oneMapAlarm)
    this.isShowButton = JSON.parse(JSON.stringify(this.isAppOuter))
  }
}
</script>
<style scoped>
.mapAppAlarmInfo {
  color: #fff;
  font-size: 12px;
  background-color: #0f2343;
  border-radius: 5px;
  width: 300px;
  height: 100%;
}

.mapAppVideoTittle {
  height: 40px;
  line-height: 40px;
  width: 100%;
  text-align: center;
  cursor: default;
  clear: both;
  border-radius: 5px;
  background-color: rgb(1, 21, 50);
}

.mapAppVideoTittle .detail {
  float: left;
  margin: 0 24px;
}

.mapAppVideoTittle .close {
  float: right;
  margin: 0 10px;
}

.mapAppInfo .mapAppInfoTittle {
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  background-color: #1c3053;
}

.mapAppInfoContent {
  width: 100%;
  clear: both;
  padding: 10px;
  height: 100%;
}

.mapAppInfoContent .infoDetail {
  width: 100%;
  height: 26px;
  line-height: 26px;
  clear: both;
}

.mapAppInfoContent .infoDetail .infoLabel {
  width: 60px;
}

.mapAppInfoContent .infoDetail .infoValue {
  width: 220px;
  overflow: hidden;
}

.mapAppInfoContent .infoDetail .infoValueArea {
  width: 220px;
  height: auto;
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
}

.mapAppInfoContent .infoDetail > div {
  float: left;
}
</style>
