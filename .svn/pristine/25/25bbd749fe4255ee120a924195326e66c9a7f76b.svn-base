<template>
  <div class="videoAlarmList">
    <div class="alarm-header">
      <h3 class="header">视频报警</h3>
      <div class="alarm-select">
        <Select v-model="alarmSelect" size="small">
          <Option v-for="item in alarmSelectList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </div>
    </div>
    <div class="alarm-scroll">
    <!-- 视频报警消息列表 -->
    <bs-scroll ref="scroller">
        <div class="alarm-item" v-for="(item, index) in filterAlarmList" :key="index">
          <div class="item-left" @click="getNearestSingleAndPlanData(item)">
            <div class="item-left-main">
              <div class="main-left" :title="item.eventTypeName">{{item.eventTypeName}}</div>
              <div class="main-right" :title="item.srcName">{{item.srcName}}</div>
            </div>
            <div class="item-left-main">
              <div class="main-left-b" :title="changeFormatTime(item.time)">{{changeFormatTime(item.time) }}</div>
              <div class="main-right">{{item.level}}级</div>
            </div>
            <div class="item-left-main">
              <div class="main-all" :title="item.organization">{{item.organization}}</div>
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
        label: '监控点报警',
        value: 'monitoringAlarm'
      }, {
        label: '重点关注',
        value: 'focusAttention'
      }],
      alarmSelect: 'all'
    }
  },
  mixins: [confirmAlarmFun],
  computed: {
    ...mapState({
      showVideo: ({ alarmThreeD }) => alarmThreeD.showVideo,
      itemAlarmInput: ({ alarmThreeD }) => alarmThreeD.itemAlarmInput,
      videoAlarmList: ({ alarmThreeD }) => alarmThreeD.videoAlarmList,
      alarmModalType: ({ alarmThreeD }) => alarmThreeD.alarmModalType,
      isAlarmVideo: ({ map3DApplyIX }) => map3DApplyIX.filterState.isAlarmVideo,
      filterLevel: ({ map3DApplyIX }) => map3DApplyIX.filterLevel
    }),
    ...mapGetters('map3DApplyIX', ['isRecAlarm']),
    ...mapGetters(['alarmTypeList', 'alarmTypeData']),
    filterAlarmList() {
      let filterList = []
      switch (this.alarmSelect) {
        case 'all':
          filterList = JSON.parse(JSON.stringify(this.videoAlarmList.slice(0, 21)))
          break
        case 'focusAttention':
          filterList = this.videoAlarmList.filter(item => {
            return item.eventType === 'focusAttention'
          }).slice(0, 21)
          break
        default:
          filterList = this.videoAlarmList.filter(item => {
            return item.eventType !== 'focusAttention'
          }).slice(0, 21)
          break
      }
      return filterList
    },
    alarmInputList() {
      return JSON.parse(JSON.stringify(this.videoAlarmList))
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
    videoAlarmList(newVal, oldVal) {
      if (newVal.length <= 20 && oldVal >= 20) {
        const data = {
          type: 'video',
          limit: 30,
          map: '3D',
          param: {
            flag: true,
            monitor: {
              flag: true,
              level: 1
            },
            focus: {
              flag: true,
              level: 1
            },
            dealState: 'unProcess'
          }
        }
        this.getMapAlarmList({type: 'videoAlarmList', data})
      }
    },
    isRecAlarm(newVal) {
      if (newVal) {
        // 是否开启报警
        alarm.on('all', this.receiveAlarmInput)
        alarm.on('confirmAlarm', this.autoSureAlarm)
      }
    }
  },
  methods: {
    ...mapActions(['alarmToBeSure', 'nearestSingle', 'emergencyAction', 'getMapAlarmPower', 'getMapAlarmList']),
    ...mapActions('map3DApplyIX', ['changeOpenAlarmPanel']),
    ...mapMutations(['CHANGE_SHOWVIDEO', 'SAVE_ITEM_ALARM_INPUT', 'SAVE_VIDEO_ALARM_LIST', 'GET_ALARM_MODAL_TYPE', 'SET_ALARM_NEW_ONE', 'SPLICE_MAP_ALARM_LIST', 'UNSHIFT_MAP_ALARM_LIST', 'SET_ACTIVE_ALARM_INFO_3D']),
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
      this.GET_ALARM_MODAL_TYPE('VideoAlarm')
      this.SAVE_ITEM_ALARM_INPUT(val)
      this.emergencyAction({ planId: '6,7' }) // 视频报警预案
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
              // 清除地图点位
              this.mapCleanPoint(index)
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
      if (infoData.point3D) {
        if (!this.isAlarmVideo.checked) { return }
        let isVideoAlarm = false
        for (let key in this.alarmTypeData.video) {
          if (infoData.eventType === key && infoData.eventType === 'focusAttention' && this.isAlarmVideo.focusOn && infoData.level >= this.filterLevel.focusOnLevel) {
            infoData.alarmTypeToMap = 'focusAttention'
            isVideoAlarm = true
            break
          } else if (infoData.eventType === key && infoData.eventType !== 'focusAttention' && this.isAlarmVideo.alarmPoint && infoData.level >= this.filterLevel.cameraSpearLevel) {
            infoData.alarmTypeToMap = 'monitorAlarm'
            isVideoAlarm = true
            break
          }
        }
        if (!isVideoAlarm) { return }
        this.SET_ALARM_NEW_ONE(infoData)
        this.getMapAlarmPower({resId: infoData.channelId || infoData.devId, type: '0'}).then(res => {
          this.alarmPower = {}
          if (res.data && res.data.properties.length) {
            res.data.properties.forEach(item => {
              this.alarmPower[item] = item
            })
          }
          infoData.eventTypeName = this.alarmTypeList[infoData.eventType.toString()]
          infoData.alarmPermission = this.alarmPower
          this.UNSHIFT_MAP_ALARM_LIST({type: 'videoAlarmList', data: infoData})
          // this.alarmInputList.unshift(infoData)
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
      if (this.showVideo && anctionAlarm && data.alarmId === anctionAlarm.alarmId) {
        this.CHANGE_SHOWVIDEO(false)
      }
      let isVideoAlarm = false
      for (let key in this.alarmTypeData.video) {
        if (data.eventType === key) {
          isVideoAlarm = true
          break
        }
      }
      if (isVideoAlarm) {
        let arr = []
        arr = this.alarmInputList
        this.$nextTick(() => {
          arr.forEach((item, index) => {
            if (data.alarmId === item.alarmId) {
              // 清除地图点位
              this.mapCleanPoint(index)
            }
          })
        })
      }
    },
    /** 地图清除点位事件 */
    mapCleanPoint(index) {
      if (!this.alarmInputList[index]) { return }
      let mapData = this.alarmInputList[index]
      if (mapData.point3D) {
        let obj = {
          pointIsouter: mapData.point3D.isouter,
          id: mapData.chanId || mapData.channelId,
          bcode: mapData.point3D.building3ds ? mapData.point3D.building3ds.code : '',
          type: 'videoAlarm'
        }
        // 对地图清除点位方法加try catch,免得影响报警功能
        try {
          this.SPLICE_MAP_ALARM_LIST({type: 'videoAlarmList', index})
          this.confirmAlarmData(obj)
        } catch (err) {
          console.log('地图清楚点位方法错误')
        }
      }
    },
    /** 获取报警附件的单兵及地图点位定位 */
    getNearestSingleAndPlanData(val) {
      const obj = {...val}
      obj.type = 'videoAlarm'
      this.SET_ACTIVE_ALARM_INFO_3D(obj)
      if (val && val.point3D) {
        if (!val.point3D.isouter) {
          this.focusOnFloorAlarm(val.point3D.sid)
        }
      }
    }
  },
  created() {
    if (this.isRecAlarm) {
      // 是否开启报警
      alarm.on('all', this.receiveAlarmInput)
      alarm.on('confirmAlarm', this.autoSureAlarm)
    }
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
