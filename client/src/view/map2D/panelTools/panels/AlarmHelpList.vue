<template>
  <div class="AlarmHelpList">
    <div class="alarm-header">
      <h3 class="header">报警求助</h3>
    </div>
    <div class="alarm-scroll">
      <!-- 报警求助消息列表 -->
      <bs-scroll ref="scroller">
        <div class="alarm-item" v-for="(item, index) in alarmHelpData" :key="index">
          <div class="item-left"  @click="getNearestSingle(item)">
            <div class="item-left-main">
              <div class="main-left" :title="item.name">{{item.name}}</div>
              <div class="main-right">{{item.level}}级</div>
            </div>
            <div class="item-left-main">
              <div class="main-left" :title="item.eventTypeName">{{item.eventTypeName}}</div>
              <div class="main-right" :title="changeFormatTime(item.time)">{{changeFormatTime(item.time) }}</div>
            </div>
          </div>
          <div class="item-right">
            <div class="item-right-btn" :class="{'no-allowed': showVideo}" @click="openModal(item, index)">处理</div>
            <div class="item-right-btn" :class="{'no-allowed': showVideo && itemAlarmInput.alarmId === item.alarmId}" @click="stopAlarm(item, index)">挂断</div>
          </div>
        </div>
      </bs-scroll>
      <Modal title="提示" v-model="stopModel" :mask-closable="false" @on-ok="sureStopAlarm" @on-cancel="cancelStopAlarm" width='366'>
        <p>确定挂断请求？</p>
      </Modal>
    </div>
  </div>
</template>
<script>
import alarm from 'src/socket/alarm.js'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import confirmAlarmFun from '../../alarmFun/confirmAlarmFun'

export default {
  name: 'AlarmHelpList',
  components: {
  },
  data() {
    return {
      stopModel: false,
      stopAlarmVal: null,
      stopAlarmIndex: 0,
      // alarmHelpList: [],
      isUnread: false, // 是否有未处理报警
      alarmPower: {}
    }
  },
  mixins: [confirmAlarmFun],
  computed: {
    ...mapState({
      showVideo: ({ mapAlarm }) => mapAlarm.showVideo,
      itemAlarmInput: ({ mapAlarm }) => mapAlarm.itemAlarmInput,
      alarmHelpStoreList: ({ mapAlarm }) => mapAlarm.alarmHelpList,
      alarmModalType: ({ mapAlarm }) => mapAlarm.alarmModalType,
      isModalSureOrClean: ({ mapAlarm }) => mapAlarm.isModalSureOrClean,
      filterState: ({ map2DApplyIX }) => map2DApplyIX.filterState, // 报警过滤状态
      filterLevel: ({ map2DApplyIX }) => map2DApplyIX.filterLevel // 报警过滤级别
    }),
    ...mapGetters('mapAlarm', ['alarmTypeList']),
    alarmHelpData() {
      return this.alarmHelpStoreList.slice(0, 20)
    },
    alarmHelpList() {
      return JSON.parse(JSON.stringify(this.alarmHelpStoreList))
    }
  },
  watch: {
    alarmHelpList: {
      handler: function(val) {
        if (val.length !== 0) {
          this.$emit('isUnread', true)
        } else {
          this.$emit('isUnread', false)
        }
        // this.SAVE_ALARM_HELP_LIST(val)
      },
      deep: true
    },
    alarmHelpStoreList(newVal, oldVal) {
      if (newVal.length <= 20 && oldVal >= 20) {
        const payload = {
          limit: 30,
          map: '2D',
          type: 'alarmHelp',
          param: {
            flag: true,
            level: 1,
            dealState: 'unProcess'
          }
        }
        this.getMapAlarmList({type: 'alarmHelpList', payload})
      }
    }
    // isModalSureOrClean(val) {
    //   if (val && this.alarmModalType === 'AlarmHelpList') {
    //     this.alarmHelpList = JSON.parse(JSON.stringify(this.alarmHelpStoreList))
    //   }
    // }
  },
  methods: {
    ...mapActions(['alarmToBeSure', 'nearestSingle', 'emergencyAction', 'getMapAlarmPower']),
    ...mapActions('map2DApplyIX', ['changeOpenAlarmPanel']),
    ...mapActions('mapAlarm', ['getMapAlarmList']),
    ...mapMutations('mapAlarm', ['CHANGE_SHOWVIDEO', 'SAVE_ITEM_ALARM_INPUT', 'SAVE_ALARM_HELP_LIST', 'GET_ALARM_MODAL_TYPE', 'SET_ALARM_NEW_ONE', 'SET_MAP2D_ALARM_LIST', 'SPLICE_MAP2D_ALARM_LIST', 'SET_ACTIVE_ALARM_INFO']),
    expand() {
      this.$refs.scroller.update()
    },
    /** 查看，视频弹框控制 */
    openModal(val, index) {
      if (this.showVideo) { return }
      this.CHANGE_SHOWVIDEO(true)
      this.changeOpenAlarmPanel(true)
      this.GET_ALARM_MODAL_TYPE('AlarmHelpList')
      this.SAVE_ITEM_ALARM_INPUT(val)
      this.emergencyAction({planId: '15'}) // 报警求助预案
    },
    /**
     * 时间戳格式转换
     * 入参：报警时间戳
     * return：转换格式的时间
     */
    changeFormatTime(time) {
      return this.$moment(parseInt(time) * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    /**
     * 手动挂断
     * 入参：当前报警信息，index
     */
    stopAlarm(val, index) {
      if (val.alarmId === this.itemAlarmInput.alarmId) { return }
      this.stopModel = true
      this.stopAlarmVal = val
      this.stopAlarmIndex = index
    },
    /** 挂断弹框，确认挂断该报警求助 */
    sureStopAlarm() {
      let alarmArr = []
      const sureAlarmInfo = this.stopAlarmVal
      alarmArr.push({
        _id: sureAlarmInfo.alarmId,
        ackContent: '',
        devIp: sureAlarmInfo.devIp,
        devPort: sureAlarmInfo.devPort,
        channel: sureAlarmInfo.channel,
        eventType: sureAlarmInfo.eventType,
        devId: sureAlarmInfo.devId,
        channelId: sureAlarmInfo.channelId
      })
      this.alarmToBeSure(alarmArr)
        .then(res => {
          // 挂断报警（确认报警）成功，清除报警信息
          // this.alarmHelpList.splice(this.stopAlarmIndex, 1)
          let index = this.stopAlarmIndex
          this.SPLICE_MAP2D_ALARM_LIST({type: 'alarmHelpList', index})
        })
        .catch(err => {
          console.log('alarmToBeSure', err)
          this.errorMsg('挂断失败')
        })
    },
    /** 挂断弹框，取消挂断 */
    cancelStopAlarm() {
      this.stopModel = false
      this.stopAlarmVal = null
      this.stopAlarmIndex = 0
    },
    /** 报警求助消息格式处理 */
    receiveAlarmHelp(data) {
      // 添加到地图点位上的报警
      if (data.alarmInfo.bondCarmerRes && data.alarmInfo.bondCarmerRes.point) {
        if (!this.filterState.isAlarmHelp.checked) { return }
        if ((data.alarmInfo.eventType === 'askHelp' || data.alarmInfo.eventType === 'acceptHelp') && data.alarmInfo.level >= this.filterLevel.alarmHelpLevel) {
          let infoData = data.alarmInfo
          infoData.alarmTypeToMap = 'alarmHelp'
          this.SET_ALARM_NEW_ONE(infoData)
          this.getMapAlarmPower({resId: infoData.chanId || infoData.devId, type: '3'}).then(res => {
            this.alarmPower = {}
            if (res.data && res.data.properties.length) {
              res.data.properties.forEach(item => {
                this.alarmPower[item] = item
              })
            }
            let repeat = false
            let repeatIndex = null
            infoData.eventTypeName = this.alarmTypeList[infoData.eventType.toString()]
            infoData.alarmPermission = this.alarmPower
            if (this.alarmHelpList.length === 0) {
              this.SET_MAP2D_ALARM_LIST({type: 'alarmHelpList', data: infoData})
            } else {
              for (let j = 0; j < this.alarmHelpList.length; j++) {
                if (this.alarmHelpList[j].name === infoData.name) {
                  repeat = true
                  repeatIndex = j
                  break
                }
              }
              if (repeat && this.alarmHelpList[repeatIndex].eventType === infoData.eventType) {
                // this.alarmHelpList.unshift(infoData)
                this.SET_MAP2D_ALARM_LIST({type: 'alarmHelpList', data: infoData})
              } else if (repeat && this.alarmHelpList[repeatIndex].eventType !== infoData.eventType) {
                this.alarmHelpList[repeatIndex] = infoData
                this.SAVE_ALARM_HELP_LIST(this.alarmHelpList)
                // 当前查看的报警状态 请求对讲 => 接收对讲时
                if (infoData.devIp === this.itemAlarmInput.devIp && infoData.devPort === this.itemAlarmInput.devPort && infoData.channel === this.itemAlarmInput.channel) {
                  this.SAVE_ITEM_ALARM_INPUT(this.alarmHelpList[repeatIndex])
                }
              } else {
                // this.alarmHelpList.unshift(infoData)
                this.SET_MAP2D_ALARM_LIST({type: 'alarmHelpList', data: infoData})
              }
            }
          }).catch(err => {
            console.log('getMapAlarmPower', err)
            this.errorMsg('权限获取失败')
          })
        }
      }
    },
    /** 收到自动确认消息，清除页面报警 */
    autoStopAlarm(data) {
      const anctionAlarm = this.itemAlarmInput
      if (this.showVideo && anctionAlarm && data.devIp === anctionAlarm.devIp && data.devPort === anctionAlarm.devPort && data.eventType === 'endHelp') {
        this.CHANGE_SHOWVIDEO(false)
      }
      if (data.eventType === 'endHelp') {
        let arr = []
        arr = this.alarmHelpList
        arr.forEach((item, index) => {
          if (data.devIp === item.devIp && data.devPort === item.devPort) {
            // this.alarmHelpList.splice(index, 1)
            this.SPLICE_MAP2D_ALARM_LIST({type: 'alarmHelpList', index})
          }
        })
      }
    },
    /** 弹框中得清除报警 */
    cleanAlarmFromModal(val) {
      this.alarmHelpList.splice(this.stopAlarmIndex, 1)
    },
    /** 获取报警附件的单兵 */
    getNearestSingle(val) {
      this.SET_ACTIVE_ALARM_INFO(val)
    }
  },
  created() {
    alarm.on('all', this.receiveAlarmHelp)
    alarm.on('confirmAlarm', this.autoStopAlarm)
  },
  destroyed() {
    alarm.remove('all', this.receiveAlarmHelp)
    alarm.remove('confirmAlarm', this.autoStopAlarm)
    this.$emit('isUnread', false)
  }
}
</script>

<style lang="less" scoped>
.AlarmHelpList {
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 12px;
  background-color: rgb(44, 62, 92);
  border-radius: 5px;
  .alarm-header {
    height: 38px;
    background-color: #0f2343;
    padding: 0 16px;
    .header {
      float: left;
      line-height: 38px;
      font-size: 14px;
    }
    .alarm-select {
      float: right;
      padding-top: 7px;
      width: 100px;
    }
  }
  .alarm-scroll {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgb(27, 49, 83);
    .alarm-item {
      clear: both;
      display: block;
      background-color: #50617a;
      border-radius: 5px;
      height: 80px;
      width: 93%;
      margin: 15px 10px;
      .ivu-badge {
        width: 100%;
      }
      .item-left {
        float: left;
        width: 75%;
        .item-left-main {
          clear: both;
          height: 39px;
          line-height: 39px;
          display: block;
          width: 100%;
          padding: 0 10px;
          cursor: pointer;
          .main-left {
            float: left;
            width: 50%;
            height: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .main-all {
            float: left;
            width: 100%;
            height: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .main-right {
            height: 100%;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
      .item-right {
        float: left;
        width: 22%;
        height: 80px;
        text-align: center;
        border-left: 1px solid #ccc;
        cursor: default;
        .item-right-btn {
          height: 39px;
          line-height: 39px;
          cursor: pointer;
          &.hover {
            color: #20adff;
          }
        }
        .no-allowed {
          cursor: not-allowed;
        }
      }
    }
  }
  .ivu-badge-count {
    position: absolute;
    right: 10px !important;
  }
}
</style>
