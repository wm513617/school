<template>
  <div class="intelligentAlarmList">
    <div class="alarm-header">
      <h3 class="header">智能报警</h3>
      <div class="alarm-select">
        <Select v-model="alarmSelect" size="small">
          <Option v-for="item in alarmSelectList" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </div>
    </div>
    <div class="alarm-scroll">
      <!-- 普通报警消息列表 -->
      <bs-scroll ref="scroller">
        <div v-for="(item, index) in filterAlarmList" :key="index">
          <div class="alarm-item" v-if="item.eventType !== 'faceControl'">
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
                <div v-if="item.eventType === 'vioRetrograde' || item.eventType === 'vioPark' || item.eventType === 'vioTurnLeft' || item.eventType === 'vioTurnRight'" class="main-all">
                  <span style="width: 33.33%;">{{item.carNum === undefined ? '' : item.carNum}}</span>
                  <span style="width: 33.33%;">{{item.carType === undefined ? '' : carTypes[item.carType]}}</span>
                  <span style="width: 33.33%;">{{item.carDirect === undefined ? '' : carDirect[item.carDirect]}}</span>
                </div>
                <div v-else class="main-all" :title="item.organization">{{item.organization}}</div>
              </div>
            </div>
            <div class="item-right">
              <div class="item-right-btn" :class="{'no-allowed': showVideo}" @click="openModal(item, index)">处理</div>
              <div class="item-right-btn" :class="{'no-allowed': showVideo && itemAlarmInput.alarmId === item.alarmId}" @click="ignoreAlarm(item, index)">清除</div>
            </div>
          </div>
          <div v-else class="alarm-item" style="height:130px;">
            <div class="face-alarm-item">
              <div><i class="font-common icon iconfont icon-Location"></i>{{item.resName}}</div>
              <i class="font-common icon iconfont icon-guijichaxun1" :class="{'trail': item.isOpenTrail}" style="cursor: pointer;" @click.stop="openTrail(index)"></i>
            </div>
            <div style="display:flex;padding:0 5px;">
              <div class="img-box" :style="{'borderColor': item.color}"  @click="openModal(item)">
                <img :src="item.faceImage ? item.faceImage : '/static/noImg1.png'" alt="暂无图片">
                <img :src="item.userImage ? item.userImage : '/static/noImg1.png'" alt="暂无图片">
                <div class="similarity">{{item.similar + '%'}}</div>
              </div>
              <div class="face-alarm-right">
                <div class="face-item">
                  <i class="font-common icon iconfont icon-admin"></i>{{item.userName}}
                </div>
                <div class="face-item">
                  <i class="font-common icon iconfont icon-blacklist"></i>{{item.groupName}}
                </div>
                <div class="face-item">
                  <i class="font-common icon iconfont icon-shijian"></i>{{changeFormatTime(item.time)}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </bs-scroll>
    </div>
  </div>
  </div>
</template>
<script>
import alarm from 'src/socket/alarm.js'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import './alarm.less'
import mapUtil from 'assets/3DMap/mapUtil.js'
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
        label: '智能报警',
        value: 'intelligentAlarm'
      }, {
        label: '违章报警',
        value: 'violationAlarm'
      }, {
        label: '人像布控',
        value: 'faceAlarm'
      }],
      alarmSelect: 'all'
    }
  },
  mixins: [confirmAlarmFun],
  computed: {
    ...mapState({
      showVideo: ({ alarmThreeD }) => alarmThreeD.showVideo,
      itemAlarmInput: ({ alarmThreeD }) => alarmThreeD.itemAlarmInput,
      intelligentAlarmList: ({ alarmThreeD }) => alarmThreeD.intelligentAlarmList,
      alarmModalType: ({ alarmThreeD }) => alarmThreeD.alarmModalType,
      selectedFaceAlarmArr: ({ alarmThreeD }) => alarmThreeD.selectedFaceAlarmArr,
      filterState: ({ map3DApplyIX }) => map3DApplyIX.filterState, // 报警过滤状态
      filterLevel: ({ map3DApplyIX }) => map3DApplyIX.filterLevel
    }),
    ...mapGetters('map3DApplyIX', ['isRecAlarm']),
    ...mapGetters(['alarmTypeList', 'alarmTypeData', 'carTypes', 'carDirect']),
    filterAlarmList() {
      let filterList = []
      switch (this.alarmSelect) {
        case 'all':
          filterList = JSON.parse(JSON.stringify(this.intelligentAlarmList.slice(0, 21)))
          break
        case 'intelligentAlarm':
          filterList = this.intelligentAlarmList.filter(item => {
            return Object.keys(this.alarmTypeData.intelligent).includes(item.eventType)
          }).slice(0, 21)
          break
          // 人脸报警
        case 'faceAlarm':
          filterList = this.intelligentAlarmList.filter(item => {
            return item.eventType === 'faceControl'
          }).slice(0, 21)
          break
        default:
          filterList = this.intelligentAlarmList.filter(item => {
            return Object.keys(this.alarmTypeData.violation).includes(item.eventType)
          }).slice(0, 21)
          break
      }
      return filterList
    },
    alarmInputList() {
      return JSON.parse(JSON.stringify(this.intelligentAlarmList))
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
    intelligentAlarmList(newVal, oldVal) {
      if (newVal.length <= 20 && oldVal >= 20) {
        const data = {
          type: 'intelligent',
          limit: 30,
          map: '3D',
          param: {
            flag: true,
            intelligent: {
              flag: true,
              level: 1
            },
            violation: {
              flag: true,
              level: 1
            },
            face: {
              flag: true,
              level: 1
            },
            dealState: 'unProcess'
          }
        }
        this.getMapAlarmList({type: 'intelligentAlarmList', data})
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
    ...mapActions(['alarmToBeSure', 'nearestSingle', 'emergencyAction', 'getMapAlarmPower', 'getMapAlarmList', 'setTrackCoMap', 'setShowDrawTrack']),
    ...mapActions('map3DApplyIX', ['changeOpenAlarmPanel']),
    ...mapMutations(['CHANGE_SHOWVIDEO', 'SAVE_ITEM_ALARM_INPUT', 'SAVE_INTELLIGENT_ALARM_LIST', 'GET_ALARM_MODAL_TYPE', 'SET_ALARM_NEW_ONE', 'SPLICE_MAP_ALARM_LIST', 'UNSHIFT_MAP_ALARM_LIST', 'SET_ACTIVE_ALARM_INFO_3D', 'CHANGE_FACEALARM_3D_TRAIL']),
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
      if (val.eventType === 'faceControl') {
        this.GET_ALARM_MODAL_TYPE('FaceAlarm')
      } else if (val.eventType === 'vioRetrograde' || val.eventType === 'vioPark' || val.eventType === 'vioTurnLeft' || val.eventType === 'vioTurnRight') {
        this.GET_ALARM_MODAL_TYPE('vioAlarm')
      } else {
        this.GET_ALARM_MODAL_TYPE('IntelligentAlarm')
      }
      this.SAVE_ITEM_ALARM_INPUT(val)
      this.emergencyAction({ planId: '9,10,11' }) // 智能报警预案
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
      // 添加到地图点位上的报警接收
      if (infoData.point3D) {
        if (!this.filterState.isIntelligence.checked) { return }
        let isVideoAlarm = false
        // 是否是 智能报警
        for (let key in this.alarmTypeData.intelligent) {
          if (infoData.eventType === key && this.filterState.isIntelligence.alarmIntelligence && infoData.level >= this.filterLevel.intelligenceLevel) {
            infoData.alarmTypeToMap = 'intelligent'
            isVideoAlarm = true
            break
          }
        }
        // 是否是 违章报警
        if (!isVideoAlarm) {
          for (let key in this.alarmTypeData.violation) {
            if (infoData.eventType === key && this.filterState.isIntelligence.alarmPeccancy && infoData.level >= this.filterLevel.peccancyLevel) {
              infoData.alarmTypeToMap = 'violation'
              isVideoAlarm = true
              break
            }
          }
        }
        // 是否是 人像布控报警
        if (!isVideoAlarm) {
          if (infoData.eventType === 'faceControl' && this.filterState.isIntelligence.faceOn && infoData.level >= this.filterLevel.faceOnLevel && infoData.verifaceMsg && infoData.verifaceMsg.isdefense && infoData.verifaceMsg.faceImage) {
            infoData = {
              ...infoData,
              ...infoData.verifaceMsg
            }
            infoData.alarmTypeToMap = 'faceAlarm'
            infoData.isOpenTrail = false
            infoData.channelId = infoData.res
            isVideoAlarm = true
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
          this.UNSHIFT_MAP_ALARM_LIST({type: 'intelligentAlarmList', data: infoData})
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
      if (data.eventType === 'vioRetrograde' || data.eventType === 'vioPark' || data.eventType === 'vioTurnLeft' || data.eventType === 'vioTurnRight' || data.eventType === 'faceControl') {
        isVideoAlarm = true
      } else {
        for (let key in this.alarmTypeData.intelligent) {
          if (data.eventType === key) {
            isVideoAlarm = true
            break
          }
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
          id: mapData.chanId || mapData.channelId || mapData.res,
          bcode: mapData.point3D.building3ds ? mapData.point3D.building3ds.code : '',
          type: mapData.eventType === 'faceControl' ? 'faceAlarm' : 'intelligent'
        }
        // 对地图清除点位方法加try catch,免得影响报警功能
        try {
          // 报警列表清除该项
          this.SPLICE_MAP_ALARM_LIST({type: 'intelligentAlarmList', index})
          this.confirmAlarmData(obj)
        } catch (err) {
          console.log('地图清楚点位方法错误')
        }
      }
    },
    // 打开人像轨迹
    openTrail(index) {
      let alarmList = JSON.parse(JSON.stringify(this.alarmInputList))
      // alarmList[index].isOpenTrail = !alarmList[index].isOpenTrail
      // this.$set(this.alarmInputList, index, alarmList[index])
      // this.SAVE_INTELLIGENT_ALARM_LIST(this.alarmInputList)
      // 人像轨迹处理
      let param = { index: index, context: this.$context2D }
      if (this.selectedFaceAlarmArr.length >= 5) {
        if (alarmList[index].isOpenTrail) {
          this.CHANGE_FACEALARM_3D_TRAIL(param)
        }
      } else {
        this.CHANGE_FACEALARM_3D_TRAIL(param)
      }
    },
    getTrackLineCoords(trackList) { // 获取轨迹线的坐标
      // let lineCoords = []
      let trackNodeMap = new Map()
      for (let index = trackList.length - 1; index >= 0; index--) {
        const item = trackList[index]
        let attrObj = {index: index + 1, label: ''} // 构造点位数据
        if (item && item.point) {
          let point = item.point
          let coord = this.getPointCoodinates(point)
          if (coord && coord.length > 0) {
            // lineCoords.push(coord)
            let cartesian3 = null
            cartesian3 = this.$context.Cesium.Cartesian3.fromDegrees(coord[0], coord[1], mapUtil.TDDEFAULTOPS.trackPointHeight)
            trackNodeMap.set(attrObj, cartesian3)
          }
        }
      }
      this.setTrackCoMap(trackNodeMap)
    },
    getPointCoodinates(point) { // 获取点位坐标
      let coord = [] // 点位坐标数组
      let loc = ''
      if (point.hasOwnProperty('isouter') && point.isouter) { // 楼外点位
        loc = point.loc
      } else if (point.hasOwnProperty('bid') && point.bid && point.bid.center) { // 楼内点位
        loc = point.bid.center
      }
      if (loc) {
        coord = loc.split(',').map(item => Number(item))
      }
      return coord
    },
    /** 获取报警附件的单兵及地图点位定位 */
    getNearestSingleAndPlanData(val) {
      const obj = {...val}
      if (obj.eventType === 'faceControl') {
        obj.type = 'faceAlarm'
      } else {
        obj.type = 'intelligent'
      }
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
.face-alarm-item {
  display: flex;
  justify-content: space-between;
  height: 32px;
  line-height: 32px;
  padding: 0 10px;
}
.face-picture {
  width: 125px;
  height: 90px;
  margin-right: 5px;
}
.face-alarm-right {
  display: inline;
}
.font-common {
  margin-right: 5px;
}
.face-item {
  width: 105px;
  height: 32px;
  line-height: 32px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  .icon {
    vertical-align: middle;
  }
}
.img-box {
  border: 1px solid #ddd;
  overflow: hidden;
  height: 88px;
  margin-right: 4px;
  position: relative;
  display: flex;
  img {
    height: 88px;
    width: 60px;
    display: flex;
    flex: 1;
    cursor: pointer;
    &:first-child {
      margin-right: 2px;
    }
  }
}
.similarity {
  width: 55px;
  height: 20px;
  position: absolute;
  bottom: -1px;
  font-size: 12px;
  font-weight: 700;
  left: 50%;
  text-align: center;
  line-height: 20px;
  z-index: 10;
  background: url('../../../../../static/similarity.png') no-repeat;
  background-size: 100% 100%;
  transform: translateX(-50%);
}
.trail {
  color: red;
}
</style>
