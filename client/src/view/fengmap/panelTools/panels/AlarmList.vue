<template>
  <div class="alarmInputList">
    <div class="alarm-header">
      <h3 class="header">普通报警</h3>
      <div class="alarm-select">
        <Select v-model="alarmSelect" size="small" style="">
          <Option v-for="item in alarmSelectList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </div>
    </div>
    <div class="alarm-scroll">
    <!-- 普通报警消息列表 -->
    <bs-scroll ref="scroller">
        <div class="alarm-item" v-for="(item, index) in filterAlarmList" :key="index">
          <div class="item-left" @click="getNearestSingleAndPlanData(item)">
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
  name: 'alarmInputList',
  components: {
  },
  data() {
    return {
      // alarmInputList: [],
      alarmPower: {},
      alarmSelectList: [{
        label: '全部',
        value: 'all'
      }, {
        label: '报警输入',
        value: 'alarmInput'
      }, {
        label: '报警防区',
        value: 'alarmOut'
      }],
      alarmSelect: 'all'
    }
  },
  mixins: [confirmAlarmFun],
  computed: {
    ...mapState({
      showVideo: ({ mapAlarm }) => mapAlarm.showVideo,
      itemAlarmInput: ({ mapAlarm }) => mapAlarm.itemAlarmInput,
      normalAlarmList: ({ mapAlarm }) => mapAlarm.normalAlarmList,
      alarmModalType: ({ mapAlarm }) => mapAlarm.alarmModalType,
      isModalSureOrClean: ({ mapAlarm }) => mapAlarm.isModalSureOrClean,
      isCommonAlarm: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.filterState.isCommonAlarm,
      filterLevel: ({ fengMapApplyInteractive }) => fengMapApplyInteractive.filterLevel
    }),
    ...mapGetters('mapAlarm', ['alarmTypeList', 'alarmTypeData']),
    filterAlarmList() {
      let filterList = []
      switch (this.alarmSelect) {
        case 'all':
          filterList = JSON.parse(JSON.stringify(this.normalAlarmList.slice(0, 20)))
          break
        case 'alarmInput':
          filterList = this.normalAlarmList.filter(item => {
            return item.eventType === 'alarmInput'
          }).slice(0, 20)
          break
        case 'alarmOut':
          filterList = this.normalAlarmList.filter(item => {
            return item.eventType === 'alarmZone' || item.eventType === 'alarmGT'
          }).slice(0, 20)
          break
      }
      return filterList
    },
    alarmInputList() {
      return JSON.parse(JSON.stringify(this.normalAlarmList))
    }
  },
  watch: {
    alarmInputList: {
      handler: function(val) {
        if (val.length !== 0) {
          this.$emit('isUnread', true)
        } else {
          this.$emit('isUnread', false)
        }
      },
      deep: true
    },
    normalAlarmList(newVal, oldVal) {
      if (newVal.length <= 20 && oldVal.length >= 20) {
        const payload = {
          limit: 30,
          map: '2D',
          type: 'normal',
          param: {
            flag: true,
            alarmInput: {
              flag: true,
              level: 1
            },
            alarmZone: {
              flag: true,
              level: 1
            },
            dealState: 'unProcess'
          }
        }
        this.getMapAlarmList({type: 'normalAlarmList', payload})
      }
    }
    // isModalSureOrClean(val) {
    //   if (val && this.alarmModalType === 'AlarmList') {
    //     this.alarmInputList = JSON.parse(JSON.stringify(this.normalAlarmList))
    //   }
    // }
  },
  methods: {
    ...mapActions(['alarmToBeSure', 'nearestSingle', 'emergencyAction', 'getMapAlarmPower']),
    ...mapActions('fengMapApplyInteractive', ['changeOpenAlarmPanel']),
    ...mapActions('mapAlarm', ['getMapAlarmList']),
    ...mapMutations('mapAlarm', ['CHANGE_SHOWVIDEO', 'SAVE_ITEM_ALARM_INPUT', 'SAVE_NORMAL_ALARM_LIST', 'GET_ALARM_MODAL_TYPE', 'SET_ALARM_NEW_ONE', 'SET_CONFIRMED_NEW_ALARM', 'SET_MAP2D_ALARM_LIST', 'SPLICE_MAP2D_ALARM_LIST', 'SET_ACTIVE_ALARM_INFO']),
    /** 查看，视频弹框控制
     * 入参：当前报警信息
     * return：index
     */
    expand() {
      this.$refs.scroller.update()
    },
    openModal(val, index) {
      console.log(val)
      if (this.showVideo) { return }
      this.CHANGE_SHOWVIDEO(true)
      this.changeOpenAlarmPanel(true)
      this.GET_ALARM_MODAL_TYPE('AlarmList')
      this.SAVE_ITEM_ALARM_INPUT(val)
      this.emergencyAction({planId: '3,4'}) // 普通报警预案
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
    ignoreAlarm(val) {
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
              // this.alarmInputList.splice(index, 1)
              let index = this.normalAlarmList.findIndex(item => {
                return val.alarmId === item.alarmId
              })
              index !== -1 && this.SPLICE_MAP2D_ALARM_LIST({type: 'normalAlarmList', index})
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
    /** 报警消息格式处理
     *  入参：收到的报警信息
     */
    receiveAlarmInput(data) {
      let infoData = data.alarmInfo
      if (infoData.point) {
        if (!this.isCommonAlarm.checked) { return }
        let isVideoAlarm = false
        if (infoData.eventType === 'alarmInput' && this.isCommonAlarm.alarmInput && infoData.level >= this.filterLevel.alarmInputLevel) {
          infoData.alarmTypeToMap = 'alarmInput'
          isVideoAlarm = true
        } else if ((infoData.eventType === 'alarmZone' || infoData.eventType === 'alarmGT') && this.isCommonAlarm.alarmSector && infoData.level >= this.filterLevel.alarmSectorLevel) {
          infoData.alarmTypeToMap = 'alarmZone'
          isVideoAlarm = true
        }
        if (!isVideoAlarm) { return }
        this.SET_ALARM_NEW_ONE(infoData)
        this.getMapAlarmPower({resId: infoData.channelId || infoData.devId, type: '1'}).then(res => {
          this.alarmPower = {}
          if (res.data && res.data.properties.length) {
            res.data.properties.forEach(item => {
              this.alarmPower[item] = item
            })
          }
          infoData.eventTypeName = infoData.subtype ? this.alarmTypeList[infoData.subtype] : (infoData.eventType ? this.alarmTypeList[infoData.eventType] : '')
          infoData.alarmPermission = this.alarmPower
          this.SET_MAP2D_ALARM_LIST({type: 'normalAlarmList', data: infoData})
        }).catch(err => {
          console.log('getMapAlarmPower', err)
          this.errorMsg('权限获取失败')
        })
      }
    },
    /** 收到自动确认消息，清除页面报警
     *  入参：收到的ackInfo字段内报警信息
     */
    autoSureAlarm(data) {
      const anctionAlarm = this.itemAlarmInput
      this.SET_CONFIRMED_NEW_ALARM(anctionAlarm.alarmId)
      if (this.showVideo && anctionAlarm && data.alarmId === anctionAlarm.alarmId) {
        this.CHANGE_SHOWVIDEO(false)
      }
      if (data.eventType === 'alarmInput' || data.eventType === 'alarmZone' || data.eventType === 'alarmGT') {
        let arr = []
        arr = this.alarmInputList
        this.$nextTick(() => {
          arr.forEach((item, index) => {
            if (data.alarmId === item.alarmId) {
              // this.alarmInputList.splice(index, 1)
              this.SPLICE_MAP2D_ALARM_LIST({type: 'normalAlarmList', index})
            }
          })
        })
      }
    },
    /** 获取报警附件的单兵及地图点位定位 */
    getNearestSingleAndPlanData(val) {
      this.SET_ACTIVE_ALARM_INFO(val)
    }
  },
  created() {
    alarm.on('all', this.receiveAlarmInput)
    alarm.on('confirmAlarm', this.autoSureAlarm)
  },
  destroyed() {
    alarm.remove('all', this.receiveAlarmInput)
    alarm.remove('confirmAlarm', this.autoSureAlarm)
    this.$emit('isUnread', false)
  }
}
</script>

<style lang="less" scoped>
</style>
