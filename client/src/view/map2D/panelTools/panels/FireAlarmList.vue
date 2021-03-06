<template>
  <div class="fireAlarmList">
    <div class="alarm-header">
      <h3 class="header">消防报警</h3>
    </div>
    <div class="alarm-scroll">
    <!-- 消防报警消息列表 -->
    <bs-scroll ref="scroller">
        <div class="alarm-item" v-for="(item, index) in fireAlarmData" :key="index">
          <div class="item-left" @click="getNearestSingle(item)">
            <div class="item-left-main">
              <div class="main-left" :title="item.name">{{item.name}}</div>
              <div class="main-right" :title="item.srcName">{{item.srcName}}</div>
            </div>
            <div class="item-left-main">
              <div class="main-left-b" :title="changeFormatTime(item.time)">{{changeFormatTime(item.time) }}</div>
              <div class="main-right">{{item.level}}级</div>
            </div>
            <div class="item-left-main">
              <div class="main-left" :title="item.eventTypeName">{{item.eventTypeName}}</div>
              <div class="main-right" :title="item.organization">{{item.organization}}</div>
            </div>
          </div>
          <div class="item-right">
            <div class="item-right-btn" :class="{'no-allowed': showVideo}" @click="openModal(item, index)">处理</div>
            <div class="item-right-btn" :class="{'no-allowed': showVideo && itemAlarmInput.alarmId === item.alarmId}" @click="ignoreAlarm(item, index)">清除</div>
          </div>
        </div>
      </bs-scroll>
    </div>
  </div>
</template>
<script>
import alarm from 'src/socket/alarm.js'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import './alarm.less'
import confirmAlarmFun from '../../alarmFun/confirmAlarmFun'

export default {
  name: 'fireAlarmList',
  components: {
  },
  data() {
    return {
      ignoreAlarmVal: null,
      ignoreAlarmIndex: 0,
      // fireAlarmList: [],
      alarmPower: {}
    }
  },
  mixins: [confirmAlarmFun],
  computed: {
    ...mapGetters('mapAlarm', ['alarmTypeList']),
    ...mapState({
      showVideo: ({ mapAlarm }) => mapAlarm.showVideo,
      itemAlarmInput: ({ mapAlarm }) => mapAlarm.itemAlarmInput,
      fireAlarmStateList: ({ mapAlarm }) => mapAlarm.fireAlarmList,
      alarmModalType: ({ mapAlarm }) => mapAlarm.alarmModalType,
      isModalSureOrClean: ({ mapAlarm }) => mapAlarm.isModalSureOrClean,
      filterState: ({ map2DApplyIX }) => map2DApplyIX.filterState, // 报警过滤状态
      filterLevel: ({ map2DApplyIX }) => map2DApplyIX.filterLevel
    }),
    fireAlarmData() {
      return this.fireAlarmList.slice(0, 20)
    },
    fireAlarmList() {
      return JSON.parse(JSON.stringify(this.fireAlarmStateList))
    }
  },
  watch: {
    fireAlarmList: {
      handler: function(val) {
        if (val.length !== 0) {
          this.$emit('isUnread', true)
        } else {
          this.$emit('isUnread', false)
        }
        // this.SAVE_FIRE_ALARM_LIST(val)
      },
      deep: true
    },
    fireAlarmStateList(newVal, oldVal) {
      if (newVal.length <= 20 && oldVal >= 20) {
        const payload = {
          limit: 30,
          map: '2D',
          type: 'fireAlarm',
          param: {
            flag: true,
            level: 1,
            dealState: 'unProcess'
          }
        }
        this.getMapAlarmList({type: 'fireAlarmList', payload})
      }
    }
  },
  methods: {
    ...mapActions(['alarmToBeSure', 'nearestSingle', 'emergencyAction', 'getMapAlarmPower']),
    ...mapActions('map2DApplyIX', ['changeOpenAlarmPanel']),
    ...mapActions('mapAlarm', ['getMapAlarmList']),
    ...mapMutations('mapAlarm', ['CHANGE_SHOWVIDEO', 'SAVE_ITEM_ALARM_INPUT', 'SAVE_FIRE_ALARM_LIST', 'GET_ALARM_MODAL_TYPE', 'SET_ALARM_NEW_ONE', 'SET_MAP2D_ALARM_LIST', 'SPLICE_MAP2D_ALARM_LIST', 'SET_ACTIVE_ALARM_INFO']),
    expand() {
      this.$refs.scroller.update()
    },
    /** 查看，视频弹框控制
     * 入参：当前报警信息
     * return：index
     */
    openModal(val, index) {
      if (this.showVideo) { return }
      this.CHANGE_SHOWVIDEO(true)
      this.changeOpenAlarmPanel(true)
      this.SAVE_ITEM_ALARM_INPUT(val)
      this.GET_ALARM_MODAL_TYPE('FireAlarmList')
      this.emergencyAction({planId: '13'}) // 消防报警预案
    },
    /**
     * 时间戳格式转换
     * 入参：报警时间戳
     * return：转换格式的时间
     */
    changeFormatTime(time) {
      return this.$moment(parseInt(time) * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    /** 清除报警
     *  入参：当前报警信息
     * return：index
     */
    ignoreAlarm(val, index) {
      if (val.alarmId === this.itemAlarmInput.alarmId) { return }
      if (val.alarmPermission.alarmClean) {
        this.$Modal.confirm({
          title: '警告',
          content: '<p>确认清除此报警吗?</p>',
          loading: true,
          onOk: () => {
            let alarmArr = []
            alarmArr.push({
              _id: val.alarmId,
              ackContent: '',
              devIp: val.devIp,
              devPort: val.devPort,
              channel: val.channel,
              eventType: val.eventType,
              devId: val.devId,
              channelId: val.channelId,
              ackType: 'ignore'
            })
            this.alarmToBeSure(alarmArr).then(res => {
              // 报警列表清除该项
              // this.fireAlarmList.splice(index, 1)
              this.SPLICE_MAP2D_ALARM_LIST({type: 'fireAlarmList', index})
              setTimeout(() => {
                this.$Modal.remove()
              }, 0)
            }).catch(() => {
              this.errorMsg('清除报警失败')
            })
          }
        })
      } else {
        this.warningMsg('该报警资源没有权限')
      }
    },
    /** 消防报警消息格式处理
     *  入参：收到的报警信息
     */
    receiveFireAlarm(data) {
      if (data.alarmInfo.point) {
        if (!this.filterState.isFireControl.checked) { return }
        if ((data.alarmInfo.eventType === 'fireAlarm' || data.alarmInfo.eventType === 'fireFailure') && data.alarmInfo.level >= this.filterLevel.fireControlLevel) {
          let infoData = data.alarmInfo
          infoData.alarmTypeToMap = 'fireAlarm'
          this.SET_ALARM_NEW_ONE(infoData)
          this.getMapAlarmPower({resId: infoData.channelId, type: '2'}).then(res => {
            this.alarmPower = {}
            if (res.data && res.data.properties.length) {
              res.data.properties.forEach(item => {
                this.alarmPower[item] = item
              })
            }
            infoData.eventTypeName = infoData.subtype ? this.alarmTypeList[infoData.subtype] : (infoData.eventType ? this.alarmTypeList[infoData.eventType] : '')
            infoData.alarmPermission = this.alarmPower
            // this.fireAlarmList.unshift(infoData)
            this.SET_MAP2D_ALARM_LIST({type: 'fireAlarmList', data: infoData})
          }).catch(err => {
            console.log('getMapAlarmPower', err)
            this.errorMsg('权限获取失败')
          })
        }
      }
    },
    /** 收到自动确认消息，清除页面报警
     *  入参：收到的ackInfo自动确认的报警信息
     */
    autoSureAlarm(data) {
      const anctionAlarm = this.itemAlarmInput
      if (this.showVideo && anctionAlarm && data.alarmId === anctionAlarm.alarmId) {
        this.CHANGE_SHOWVIDEO(false)
      }
      if (data.eventType === 'fireAlarm' || data.eventType === 'fireFailure') {
        let arr = []
        arr = this.fireAlarmList
        this.$nextTick(() => {
          arr.forEach((item, index) => {
            if (data.alarmId === item.alarmId) {
              // this.fireAlarmList.splice(index, 1)
              this.SPLICE_MAP2D_ALARM_LIST({type: 'fireAlarmList', index})
            }
          })
        })
      }
    },
    /** 获取报警附件的单兵及地图点位定位 */
    getNearestSingle(val) {
      this.SET_ACTIVE_ALARM_INFO(val)
    }
  },
  created() {
    alarm.on('all', this.receiveFireAlarm)
    alarm.on('confirmAlarm', this.autoSureAlarm)
  },
  destroyed() {
    alarm.remove('all', this.receiveFireAlarm)
    alarm.remove('confirmAlarm', this.autoSureAlarm)
    this.$emit('isUnread', false)
  }
}
</script>

<style lang="less" scoped>
</style>
