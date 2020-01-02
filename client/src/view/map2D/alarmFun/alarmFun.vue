<!-- 地图接收报警、单兵socket处理 -->
<script>
import alarm from '../../../socket/alarm.js'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { VIDEOTYPEKEY, RESICONOID, RESOURCETYPE } from 'assets/2DMap/meta/common'
import faceAlarm from './faceTrack/faceAlarm.js'
import TransformCoord from 'assets/2DMap/utils/transformcoord'
import { toMercator } from '@turf/projection'
import { point } from '@turf/helpers'
import { PROJ } from 'assets/2DMap/meta/common.js'
const oids = { // 对应 RESICONOID 中的属性
  alarmInput: 'commonAlarm',
  alarmZone: 'alarmHost',
  fireAlarm: 'fireAlarm',
  patrolAlarm: 'commonPatrol',
  singleAlarm: 'single',
  boltipc: 'boltipc',
  halfBallipc: 'halfBallipc',
  fastBallipc: 'fastBallipc',
  redBoltipc: 'redBoltipc',
  allViewipc: 'allViewipc',
  alarmBox: 'alarmBox',
  alarmPillar: 'alarmColumn',
  faceAlarm: 'verfaceipc'
}
const alarmModelType = {
  alarmInput: 'AlarmList',
  alarmZone: 'AlarmList',
  monitorAlarm: 'VideoAlarm',
  focusAttention: 'VideoAlarm',
  intelligent: 'IntelligentAlarm',
  violation: 'vioAlarm',
  faceAlarm: 'FaceAlarm',
  fireAlarm: 'FireAlarmList',
  alarmHelp: 'AlarmHelpList',
  patrolAlarm: 'AttrPatrol',
  singleAlarm: 'AttrSinglePawn'
}
let icons = {}
export default {
  data() {
    return {
      commonHostPointList: [], // 楼外
      firePointList: [],
      acceptHtlpPointList: [],
      pointFocusPointList: [],
      intellPointList: [],
      singlePatrolPointList: [],
      facePointList: [],
      commonHostBuildList: [], // 楼内
      fireBuildList: [],
      acceptHtlpBuildList: [],
      pointFocusBuildList: [],
      intellBuildList: [],
      singlePatrolBuildList: [],
      faceBuildList: [],
      defaultFaceSnapBorderColor: 'rgba(208, 2, 27, 0.75)' // 默认抓拍图片边框颜色
    }
  },
  mixins: [ faceAlarm ],
  computed: {
    ...mapState({
      normalAlarmList: ({ mapAlarm }) => mapAlarm.normalAlarmList, // 普通报警列表
      fireAlarmList: ({ mapAlarm }) => mapAlarm.fireAlarmList, // 消防报警列表
      alarmHelpList: ({ mapAlarm }) => mapAlarm.alarmHelpList, // 报警求助列表
      videoAlarmList: ({ mapAlarm }) => mapAlarm.videoAlarmList, // 视频报警列表
      intelligentAlarmList: ({ mapAlarm }) => mapAlarm.intelligentAlarmList, // 智能报警列表
      activeAlarmTag: ({ mapAlarm }) => mapAlarm.activeAlarmTag,
      activeAlarmInfo: ({ mapAlarm }) => mapAlarm.activeAlarmInfo,
      mapConfigArr: ({ mapIndex }) => mapIndex.mapConfigArr,
      filterState: ({ map2DApplyIX }) => map2DApplyIX.filterState,
      filterLevel: ({ map2DApplyIX }) => map2DApplyIX.filterLevel,
      videoAlarmIdInfo: ({ mapAlarm }) => mapAlarm.videoAlarmIdInfo,
      sosAlarmIdInfo: ({ mapAlarm }) => mapAlarm.sosAlarmIdInfo,
      singleTimeoutList: ({ mapAlarm }) => mapAlarm.singleTimeoutList,
      attrInfo: ({ mapPoint }) => mapPoint.mapResourceAttributes,
      alarmTabData: ({ mapAlarm }) => mapAlarm.alarmTabData,
      selectedFaceAlarmArr: ({ mapAlarm }) => mapAlarm.selectedFaceAlarmArr, // 选中的人脸报警数据数组
      showTrackModal2D: ({ mapIndex }) => mapIndex.showTrackModal2D, // 2D轨迹查询弹框显示状态
      showDrawTrack2D: ({ mapIndex }) => mapIndex.showDrawTrack2D // 2D绘制轨迹的显示状态
    }),
    ...mapGetters({
      selelctedSingle2D: 'selelctedSingle2D', // 选中的单兵数据
      singleRealTrackCoords2D: 'singleRealTrackCoords2D', // 单兵实时轨迹坐标
      realSingleMap2D: 'realSingleMap2D', // 单兵实时轨迹坐标
      isMapOuter: 'isMapOuter',
      mapProjection: 'mapProjection', // 地图投影坐标系
      activeMapConfig: 'activeMapConfig',
      currentFloor: 'currentFloor',
      showMapResourceAttributes: 'showMapResourceAttributes' // 是否显示地图资源属性面板
    }),
    ...mapGetters('map2DApplyIX', ['isEmergency', 'isAutoPosition', 'isFaceSnap', 'isInfoPanelFixed', 'isPlatformTrack']),
    ...mapGetters('patrol2DAlarm', ['singleAllList']),
    isFaceAlarmTrack() { // 是否启用人脸报警轨迹
      return this.selectedFaceAlarmArr && this.selectedFaceAlarmArr.length
    }
  },
  watch: {
    normalAlarmList(data) { // 普通报警 alarmInput + 报警主机 alarmZone
      if (this.filterState.isCommonAlarm.checked) {
        let list = data.slice(0, 20) // 截取前20条数据
        this.handleAlarmList(list, 'commonHost')
      }
    },
    fireAlarmList(data) { // 消防报警 fireAlarm
      if (this.filterState.isFireControl.checked) {
        let list = data.slice(0, 20) // 截取前20条数据
        this.handleAlarmList(list, 'fire')
      }
    },
    alarmHelpList(data) { // 报警求助 alarmHelp
      if (this.filterState.isAlarmHelp.checked) {
        let list = data.slice(0, 20) // 截取前20条数据
        this.handleSOSAlarmList(list, 'acceptHtlp')
      }
    },
    videoAlarmList(data) { // 视频报警 (监控点报警 monitorAlarm + 重点关注 focusAttention)
      if (this.filterState.isAlarmVideo.checked) {
        let list = data.slice(0, 20) // 截取前20条数据
        this.handleVideoAlarmList(list, 'pointFocus')
      }
    },
    intelligentAlarmList(data) { // 智能报警 (智能报警 intelligent + 违章报警 violation) + 人脸报警 faceAlarm
      if (this.filterState.isIntelligence.checked) {
        let list = data.slice(0, 20) // 截取前20条数据
        this.setIntelligenceData(list)
      }
    },
    singleAllList(data) { // 单兵报警 singleAlarm + 巡更报警 patrolAlarm + 常规信息 generalMsg(地图未接收常规信息)
      if (this.filterState.isAlarmSingle.checked) {
        let list = data.slice(0, 20) // 截取前20条数据
        this.handleAlarmList(list, 'singlePatrol')
      }
    },
    activeAlarmTag() {
      this.focueOnALarm()
    },
    'filterState.isCommonAlarm.checked': {
      handler(val) {
        if (val) {
          let list = this.normalAlarmList.slice(0, 20) // 截取前20条数据
          this.handleAlarmList(list, 'commonHost')
        } else {
          this.handleAlarmList([], 'commonHost')
        }
      },
      deep: true
    },
    'filterState.isAlarmVideo.checked': {
      handler(val) {
        if (val) {
          let list = this.videoAlarmList.slice(0, 20) // 截取前20条数据
          this.handleVideoAlarmList(list, 'pointFocus')
        } else {
          this.handleVideoAlarmList([], 'pointFocus')
        }
      },
      deep: true
    },
    'filterState.isIntelligence.checked': {
      handler(val) {
        if (val) {
          let list = this.intelligentAlarmList.slice(0, 20) // 截取前20条数据
          this.setIntelligenceData(list)
        } else {
          this.handleVideoAlarmList([], 'intell')
          this.handleAlarmList([], 'face')
        }
      },
      deep: true
    },
    'filterState.isFireControl.checked': {
      handler(val) {
        if (val) {
          let list = this.fireAlarmList.slice(0, 20) // 截取前20条数据
          this.handleAlarmList(list, 'fire')
        } else {
          this.handleAlarmList([], 'fire')
        }
      },
      deep: true
    },
    'filterState.isAlarmHelp.checked': {
      handler(val) {
        if (val) {
          let list = this.alarmHelpList.slice(0, 20) // 截取前20条数据
          this.handleSOSAlarmList(list, 'acceptHtlp')
        } else {
          this.handleSOSAlarmList([], 'acceptHtlp')
        }
      },
      deep: true
    },
    'filterState.isAlarmSingle.checked': {
      handler(val) {
        if (val) {
          let list = this.singleAllList.slice(0, 20) // 截取前20条数据
          this.handleAlarmList(list, 'singlePatrol')
        } else {
          this.handleAlarmList([], 'singlePatrol')
        }
      },
      deep: true
    },
    facePointList: { // 人脸报警数据
      handler(arr) {
        if (arr && arr.length) { // 有人像报警数据时
          if (this.isFaceSnap && !this.isFaceAlarmTrack && !this.showTrackModal2D && !this.showDrawTrack2D) { // 不显示轨迹查询弹框 、不显示绘制轨迹 且 不显示2D绘制轨迹时
            this.updateFaceSnaps(arr) // 更新人像抓拍图片
          }
        } else { // 无人像报警数据时，清空人脸头像数组
          this.SET_FACE_HEADS([])
        }
      },
      deep: true
    },
    isFaceSnap(flag) { // 抓拍图片开关
      if (flag) {
        this.updateFaceSnaps(this.facePointList) // 更新人像抓拍图片
      } else {
        this.SET_FACE_HEADS([]) // 设置人脸头像数组
      }
    },
    isFaceAlarmTrack(flag) { // 人像布控轨迹状态
      if (!flag && this.isFaceSnap) { // 不显示人像布控轨迹且显示抓拍图片时
        this.updateFaceSnaps(this.facePointList)
      }
    },
    showTrackModal2D(flag) { // 是否显示2D轨迹查询弹框状态
      if (flag) { // 显示2D绘制轨迹时
        this.SET_FACE_HEADS([]) // 清空人脸头像数组
      } else { // 不显示2D绘制轨迹状态时
        !this.showDrawTrack2D && this.isFaceSnap && this.updateFaceSnaps(this.facePointList) // 不显示绘制轨迹 且显示人像布控抓拍图片时，更新人像抓拍图片
      }
    },
    showDrawTrack2D(flag) { // 是否显示2D绘制轨迹状态
      if (flag) { // 显示2D绘制轨迹时
        this.SET_FACE_HEADS([]) // 清空人脸头像数组
      } else { // 不显示2D绘制轨迹状态时
        !this.showTrackModal2D && this.isFaceSnap && this.updateFaceSnaps(this.facePointList) // 不显示轨迹查询弹框 且 显示人像布控抓拍图片时，更新人像抓拍图片
      }
    }
  },
  methods: {
    ...mapActions([ 'updateRealSingle2D', 'deleteRealSingle2D', 'setSingleRealTrackCoords2D', 'pushSingleRealTrackCoords2D', 'getFoorById', 'getvideoResourceById', 'queryDefaultIconByOid', 'setIsMapOuter', 'setCurrentFloor', 'setActiveMapConfig', 'updateSingleAttrPos' ]),
    ...mapMutations('mapAlarm', [ 'SET_FACE_HEADS', 'SET_SIX_TYPE_ALARM_POINT_LIST', 'SET_ALLVIDEO_ALARM_POINT_LIST', 'SET_SOS_ALARM_POINT_LIST', 'SET_SIX_TYPE_ALARM_BUILD_LIST', 'SET_ALLVIDEO_ALARM_BUILD_LIST', 'SET_SOS_ALARM_BUILD_LIST', 'PUSH_VIDEO_ALARM_ARR', 'SET_VIDEO_ALARM_ARR', 'PUSH_SOS_ALARM_ARR', 'SET_SOS_ALARM_ARR', 'SET_SINGLE_TIMEOUT_ALARM_List', 'UPDATE_ALARMTAB_DATA' ]),
    ...mapMutations(['SET_MAP_RESOURCE_ATTRIBUTES', 'CHANGE_SINGLE_TIMEOUT_ALARM_STATUS', 'SET_SHOW_MAP_RESOURCE_ATTRIBUTES']),
    ...mapMutations('map2DApplyIX', ['SAVE_FILTERLEVEL', 'SAVE_FILTERSTATE']),
    ...mapActions('map2DApplyIX', ['switchEmergency', 'switchAutoPosition']),
    receiveSingleAlarm(data) { // 接收单兵报警回调
    },
    receiveSinglePos(data) { // 接收到单兵发送的实时位置
      console.log('接收到单兵发送的实时位置信息:', data)
      if (data && data.point && data.point.lon && data.point.lat) { // 过滤发送位置的有效值，单兵位置要进行坐标转换（wgs84 =》 gcj02）
        // console.log('转换前单兵坐标：', data.point)
        let coords = TransformCoord.wgs84togcj02(Number(data.point.lon), Number(data.point.lat))
        if (this.mapProjection !== PROJ.EPSG4326) {
          coords = toMercator(point(coords)).geometry.coordinates
        }
        data.geo.lon = coords[0]
        data.geo.lat = coords[1]
        // console.log('转换后单兵坐标：', data.point)
        this.updateRealSingle2D(data) // 更新实时单兵缓存
        let realSingle = this.realSingleMap2D.get(data._id)
        if (realSingle && realSingle.isOpenTrack) { // 更新单兵实时轨迹
          if (this.singleRealTrackCoords2D && this.singleRealTrackCoords2D.length) {
            const lastCoords = this.singleRealTrackCoords2D[this.singleRealTrackCoords2D.length - 1]
            if (lastCoords.toString() !== coords.toString()) { // 实时单兵位置与上一个点重合时
              this.pushSingleRealTrackCoords2D(coords) // 更新实时单兵轨迹坐标
            } else {
              console.log('单兵实时位置与轨迹最后一个位置重合！！！')
            }
          }
        }
        // 更新单兵悬浮面板位置
        if (!this.isInfoPanelFixed && this.showMapResourceAttributes && this.attrInfo) {
          if (this.attrInfo.rType === RESOURCETYPE.single && this.attrInfo._id === data._id) { // 面板展示的信息时此单兵时
            let {geo} = data
            this.updateSingleAttrPos(geo)
          }
        }
      }
    },
    singleStatusChange(data) { // 接收到单兵设备状态变化
      console.log('接收到单兵设备状态变化信息：', data)
      if (data.status === 'offline') {
        /**
         * ---by hanjie 2019-12-18 13:42:51，因需求变更注释掉单兵离线自动清除单兵短期轨迹的逻辑---
        let realSingle = this.realSingleMap2D.get(data._id)
        if (realSingle && realSingle.isOpenTrack) { // 离线单兵显示实时轨迹时，清空轨迹
          this.setSingleRealTrackCoords2D([]) // 清空实时单兵轨迹坐标
        }
        this.deleteRealSingle2D(data.userid) // 移除实时单兵缓存
         *
        */
        // 单兵离线，取消超时报警
        let alarmArr = JSON.parse(JSON.stringify(this.singleTimeoutList))
        let repeatIndex = -1
        let activeIndex = -1
        alarmArr.map((item, index) => {
          if (item._id === data.userid) {
            repeatIndex = index
          }
          if (this.attrInfo && (this.attrInfo._id === data.userid)) {
            activeIndex = index
          }
        })
        if (repeatIndex !== -1) {
          alarmArr.splice(repeatIndex, 1)
          this.SET_SINGLE_TIMEOUT_ALARM_List(alarmArr)
        }
        if (activeIndex !== -1) { // 将当前面板头像闪烁取消
          this.CHANGE_SINGLE_TIMEOUT_ALARM_STATUS(false)
        }
      }
    },
    // 获取报警图标
    getAlarmPointIcon() {
      const pros = []
      for (const item in oids) {
        const oid = RESICONOID[oids[item]]
        pros.push(this.queryDefaultIconByOid(oid))
      }
      Promise.all(pros).then(res => {
        let tag = 0
        for (let k in oids) {
          if (res && res[tag].default) {
            res[tag].files.filter(data => {
              if (data.status === 'alarm') {
                icons[oids[k]] = data.path
              }
            })
          } else {
            icons[oids[k]] = ''
          }
          tag++
        }
      }).catch(err => {
        console.log('获取默认图标失败', err)
      })
    },
    setIntelligenceData(data) {
      const intellArr = []
      const faceArr = []
      for (const i in data) {
        if (data[i].alarmTypeToMap === 'faceAlarm') {
          faceArr.push(data[i])
        } else {
          intellArr.push(data[i])
        }
      }
      this.handleVideoAlarmList(intellArr, 'intell')
      this.handleAlarmList(faceArr, 'face')
    },
    // 报警数据添加到地图上
    // 普通报警 报警主机 消防报警 巡更报警 单兵报警 人脸报警
    handleAlarmList(data, type) {
      this[type + 'PointList'] = []
      this[type + 'BuildList'] = []
      for (const i in data) {
        const item = JSON.parse(JSON.stringify(data[i]))
        if (item) {
          item.alarmModelType = alarmModelType[item.alarmTypeToMap]
          const ty = oids[item.alarmTypeToMap]
          item.symbolUrl = icons[ty]
          if (item.alarmTypeToMap === 'singleAlarm') {
            if (item.point && item.point.hasOwnProperty('lon') && item.point.hasOwnProperty('lat')) {
              // 单兵位置要经过坐标转换（wgs84 =》gcj02）
              if (!isNaN(Number(item.point.lon)) && !isNaN(Number(item.point.lat))) {
                let coords = TransformCoord.wgs84togcj02(Number(item.point.lon), Number(item.point.lat))
                if (this.mapProjection !== PROJ.EPSG4326) {
                  coords = toMercator(point(coords)).geometry.coordinates
                }
                item.point.lon = coords[0]
                item.point.lat = coords[1]
              }
            }
            this[type + 'PointList'].push({...item, point: { ...item.point, mapId: this.activeMapConfig.mapId }})
          } else {
            if ((item.point && item.point.isouter) || (item.map2D && item.map2D.isouter)) {
              this[type + 'PointList'].push(item)
            } else {
              this[type + 'BuildList'].push(item)
              this.UPDATE_ALARMTAB_DATA(data[i])
            }
          }
        }
      }
      const typeStr = ['commonHost', 'fire', 'singlePatrol', 'face']
      typeStr.splice(typeStr.indexOf(type), 1)
      let pointArr = this[type + 'PointList'].concat(this[typeStr[0] + 'PointList'], this[typeStr[1] + 'PointList'], this[typeStr[2] + 'PointList'])
      let buildArr = this[type + 'BuildList'].concat(this[typeStr[0] + 'BuildList'], this[typeStr[1] + 'BuildList'], this[typeStr[2] + 'BuildList'])
      this.SET_SIX_TYPE_ALARM_POINT_LIST(pointArr)
      this.SET_SIX_TYPE_ALARM_BUILD_LIST(buildArr)
    },

    // 视频点位报警(视频报警 + 智能报警): 枪机、半球、快球、红外枪机、全景
    // 该处处理还需要获取设备资源类型，得出点位类型
    handleVideoAlarmList(data, type) {
      this[type + 'PointList'] = []
      this[type + 'BuildList'] = []
      const pros = []
      const proData = []
      const curArr = []
      for (const i in data) {
        const item = { ...data[i] }
        const id = item.chanId || item.channelId || item.res
        item.alarmModelType = alarmModelType[item.alarmTypeToMap]
        // 判断是否需要从接口获取资源
        if (curArr.indexOf(id) === -1) {
          if (this.videoAlarmIdInfo.hasOwnProperty(id)) {
            item.alarmTypeToMap = this.videoAlarmIdInfo[id].type
            item.symbolUrl = this.videoAlarmIdInfo[id].url
            if ((item.point && item.point.isouter) || (item.map2D && item.map2D.isouter)) {
              this[type + 'PointList'].push(item)
            } else {
              this[type + 'BuildList'].push(item)
              this.UPDATE_ALARMTAB_DATA(data[i])
            }
          } else {
            proData.push(item)
            curArr.push(id)
            pros.push(this.getvideoResourceById(id))
          }
        }
      }
      Promise.all(pros).then(res => {
        for (const i in proData) {
          const item = { ...proData[i] }
          for (var key in VIDEOTYPEKEY) {
            if (res[i] && VIDEOTYPEKEY[key] === res[i].monitortype) {
              item.alarmTypeToMap = key
            }
          }
          if (item) {
            const ty = oids[item.alarmTypeToMap]
            item.symbolUrl = icons[ty]
            const record = {
              key: res[i]._id,
              type: item.alarmTypeToMap,
              url: item.symbolUrl
            }
            this.PUSH_VIDEO_ALARM_ARR(record)
            if ((item.point && item.point.isouter) || (item.map2D && item.map2D.isouter)) {
              this[type + 'PointList'].push(item)
            } else {
              this[type + 'BuildList'].push(item)
              this.UPDATE_ALARMTAB_DATA(proData[i])
            }
          }
        }
        const typeStr = ['pointFocus', 'intell']
        typeStr.splice(typeStr.indexOf(type), 1)
        let pointArr = this[type + 'PointList'].concat(this[typeStr[0] + 'PointList'])
        let buildArr = this[type + 'BuildList'].concat(this[typeStr[0] + 'BuildList'])
        this.SET_ALLVIDEO_ALARM_POINT_LIST(pointArr)
        this.SET_ALLVIDEO_ALARM_BUILD_LIST(buildArr)
      }).catch(err => {
        console.log('视频点位报警', err)
      })
    },
    // 报警求助: 报警柱 报警箱
    // 该处处理还需要区分是报警柱还是报警箱
    handleSOSAlarmList(data, type) {
      this[type + 'PointList'] = []
      this[type + 'BuildList'] = []
      const pros = []
      const proData = []
      const curArr = []
      for (const i in data) {
        const item = { ...data[i] }
        const id = (item && item.bondCarmerRes && item.bondCarmerRes._id) || (item.chanId)
        item.alarmModelType = alarmModelType[item.alarmTypeToMap]
        // 判断是否需要从接口获取资源
        if (curArr.indexOf(id) === -1) {
          if (this.sosAlarmIdInfo.hasOwnProperty(id)) {
            item.alarmTypeToMap = this.sosAlarmIdInfo[id].type
            item.symbolUrl = this.sosAlarmIdInfo[id].url
            const sosIsOuter = item.bondCarmerRes && item.bondCarmerRes.point && item.bondCarmerRes.point.isouter
            if (sosIsOuter || (item.point && item.point.isouter) || (item.map2D && item.map2D.isouter)) {
              this[type + 'PointList'].push(item)
            } else {
              this[type + 'BuildList'].push(item)
              this.UPDATE_ALARMTAB_DATA(data[i])
            }
          } else {
            proData.push(item)
            curArr.push(id)
            pros.push(this.getvideoResourceById(id))
          }
        }
      }
      Promise.all(pros).then(res => {
        for (const i in proData) {
          const item = { ...proData[i] }
          const devType = res[i] && res[i].eid && res[i].eid.type
          for (var key in RESOURCETYPE) {
            if (RESOURCETYPE[key] === devType) {
              item.alarmTypeToMap = key
              break
            }
          }
          if (item) {
            const ty = oids[item.alarmTypeToMap]
            item.symbolUrl = icons[ty]
            const record = {
              key: res[i]._id,
              type: item.alarmTypeToMap,
              url: item.symbolUrl
            }
            this.PUSH_SOS_ALARM_ARR(record)
            const sosIsOuter = item.bondCarmerRes && item.bondCarmerRes.point && item.bondCarmerRes.point.isouter
            if (sosIsOuter || (item.point && item.point.isouter) || (item.map2D && item.map2D.isouter)) {
              this[type + 'PointList'].push(item)
            } else {
              this[type + 'BuildList'].push(item)
              this.UPDATE_ALARMTAB_DATA(proData[i])
            }
          }
        }
        this.SET_SOS_ALARM_POINT_LIST(this.acceptHtlpPointList)
        this.SET_SOS_ALARM_BUILD_LIST(this.acceptHtlpBuildList)
      }).catch(err => {
        console.log('报警求助报警', err)
      })
    },
    focueOnALarm() {
      const obj = this.activeAlarmInfo
      // 设置地图中心位置
      let loc = ''
      let mapId = ''
      let sid
      let isouter
      let item
      if (obj && obj.map2D) {
        item = obj.map2D
        loc = item && item.geo.split(',').map(item => Number(item))
      }
      if (obj && obj.point) {
        item = obj.point
        if (item && item.loc) {
          loc = item && item.loc.split(',').map(item => Number(item))
        } else if (item.lon && item.lat) {
          loc = [Number(item.lon), Number(item.lat)]
        }
      }
      if (obj && obj.bondCarmerRes && obj.bondCarmerRes.point) {
        item = obj.bondCarmerRes.point
        loc = item && item.loc.split(',').map(item => Number(item))
      }
      if (!item || !loc) {
        console.log('no point')
        return
      }
      if (obj.alarmTypeToMap === 'singleAlarm') {
        if (loc && loc[0] && loc[1]) {
          loc = TransformCoord.wgs84togcj02(loc[0], loc[1])
          if (this.mapProjection !== PROJ.EPSG4326) {
            loc = toMercator(point(loc)).geometry.coordinates
          }
          this.setIsMapOuter(true)
          this.setCurrentFloor({})
          this.pointToCenter(loc)
          return
        }
      }
      mapId = item && item.mapId
      sid = item && item.sid
      isouter = item && item.isouter
      if (!mapId) {
        return
      }
      if (mapId !== this.activeMapConfig.mapId) {
        for (const config of this.mapConfigArr) {
          if (mapId === config.mapId) {
            this.setActiveMapConfig(config) // 设置当前地图配置
            this.setIsMapOuter(true)
            break
          }
        }
      }
      if (this.$context2D.map) {
        if (this.isMapOuter) {
          if (isouter) {
            this.pointToCenter(loc)
          } else {
            this.getFoorById(sid).then(res => {
              this.setCurrentFloor(res)
              this.setIsMapOuter(false)
              this.pointToCenter(loc)
            })
          }
        } else {
          if (isouter) {
            this.setIsMapOuter(true)
            this.setCurrentFloor({})
            this.pointToCenter(loc)
          } else {
            if (this.currentFloor._id === sid) {
              this.pointToCenter(loc)
            } else {
              this.getFoorById(sid).then(res => {
                this.setCurrentFloor(res)
                this.setIsMapOuter(false)
                this.pointToCenter(loc)
              })
            }
          }
        }
      }
    },
    pointToCenter(loc) {
      if (this.$context2D) { // 判断地图记载完成，设置地图中心
        this.$context2D.map.getView().setCenter(loc)
      }
    },
    receiveFaceTrail(data) {
      if (this.filterState.isIntelligence.checked && this.filterState.isIntelligence.faceOn && data.alarmInfo && data.alarmInfo.eventType === 'faceControl' && data.alarmInfo.level >= this.filterLevel.faceLevel && data.alarmInfo.verifaceMsg && data.alarmInfo.verifaceMsg.isdefense && data.alarmInfo.verifaceMsg.faceImage) {
        // console.log('监听到人像布控报警数据：', JSON.parse(JSON.stringify(data)))
        this.handlerAlarmInfo(data.alarmInfo.verifaceMsg)
      }
    },
    singleTimeOut(data) {
      if (this.isPlatformTrack) { return }
      let alarmArr = JSON.parse(JSON.stringify(this.singleTimeoutList))
      let repeatIndex = -1
      let activeIndex = -1
      alarmArr.map((item, index) => {
        if (item._id === data._id) {
          repeatIndex = index
        }
        if (this.attrInfo._id === data._id) {
          activeIndex = index
        }
      })
      const info = {
        ...data,
        affiliation: data.affiliation._id,
        alarmTypeToMap: 'singleAlarm',
        isTimeout: true // 用于判断当前是单兵超时还是单兵一键报警
      }
      if (data.timeOut) { // 接收超时报警
        console.log(data.username, '超时报警', data)
        if (repeatIndex !== -1) { return } // 重复超时报警
        const ty = oids[info.alarmTypeToMap]
        info.symbolUrl = icons[ty]
        info.alarmModelType = alarmModelType[info.alarmTypeToMap]
        const geo = info.geo || info.point
        if (geo) {
          let coords = TransformCoord.wgs84togcj02(Number(geo.lon), Number(geo.lat))
          if (this.mapProjection !== PROJ.EPSG4326) {
            coords = toMercator(point(coords)).geometry.coordinates
          }
          info.point = {
            lon: coords[0],
            lat: coords[1]
          }
        }
        alarmArr.push(info)
        this.SET_SINGLE_TIMEOUT_ALARM_List(alarmArr)
        this.SET_MAP_RESOURCE_ATTRIBUTES({res: {data: info, timeOut: true}, type: 'single'})
      } else { // 清除超时报警
        console.log(data.username, '未超时报警', data)
        if (repeatIndex !== -1) {
          alarmArr.splice(repeatIndex, 1)
          this.SET_SINGLE_TIMEOUT_ALARM_List(alarmArr)
        }
        if (activeIndex !== -1) { // 将当前面板头像闪烁取消
          this.CHANGE_SINGLE_TIMEOUT_ALARM_STATUS(false)
          // this.SET_SHOW_MAP_RESOURCE_ATTRIBUTES(false)
        }
      }
    },
    updateFaceSnaps(arr) { // 更新人像图片显示
      // console.log('人脸报警数据列表：', JSON.parse(JSON.stringify(arr)))
      let faceSnaps = []
      let faceSnapMap = new Map()
      for (const item of arr) { // 遍历人脸报警列表数据
        if (item.point) { // 有点位位置信息时
          let faceSnap = null // 抓拍图片数据
          const pointId = item.res // 资源点位唯一标识
          let coordinates = this.getPointCoordinates(item.point) // 处理坐标点位数据
          if (coordinates && coordinates.length) { // 坐标点位有效时
            if (faceSnapMap.has(pointId)) { // 抓拍图片存在时，更新抓拍图片为最近人像布控报警的抓拍图片
              faceSnap = faceSnapMap.get(pointId) // 获取点位的抓拍图片
              if (faceSnap.timestamp < item.timestamp) { // 点位抓拍图片不是最近时间时，更新点位抓拍图片
                faceSnap.id = 'faceSnap' + item.timestamp + '_' + pointId // 更新抓拍图片数据标识
                faceSnap.userId = item.userId || faceSnap.userId // 更新抓拍人员标识
                faceSnap.userImage = item.faceImage || faceSnap.faceImage // 更新抓拍图片
                faceSnap.userName = item.userName || faceSnap.userName // 更新抓拍人员名称
                faceSnap.coordinates = coordinates // 更新点位坐标
              }
            } else { // 抓拍图片不存在时
              faceSnap = { id: 'faceSnap' + item.timestamp + '_' + pointId + '_' + new Date().getTime(), userId: item.userId, borderColor: this.defaultFaceSnapBorderColor, userImage: item.faceImage, coordinates: coordinates, userName: item.userName, pointId: pointId, pointName: item.resName }
            }
          }
          faceSnap && faceSnapMap.set(pointId, faceSnap)
        }
      }
      faceSnaps = [...faceSnapMap.values()]
      // console.log('人像识别抓拍图片数据：', JSON.parse(JSON.stringify(faceSnaps)))
      this.SET_FACE_HEADS(faceSnaps) // 设置人脸头像数组
    },
    getPointCoordinates(point) { // 获取点位坐标
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
    }
  },
  mounted() {
    alarm.on('all', this.receiveFaceTrail)
    alarm.on('singlePawn', this.receiveSingleAlarm)
    alarm.on('singlePawnLoc', this.receiveSinglePos)
    alarm.on('singleStatus', this.singleStatusChange)
    alarm.on('singleTimeOut', this.singleTimeOut)
    this.getAlarmPointIcon()
  },
  created() {
    // 报警过滤
    let filterState = window.localStorage.getItem('alarm2DFilterState')
    if (!filterState) {
      window.localStorage.setItem('alarm2DFilterState', JSON.stringify(this.filterState))
    } else {
      this.SAVE_FILTERSTATE(JSON.parse(filterState))
    }
    let filterLevel = window.localStorage.getItem('alarm2DFilterLevel')
    if (!filterLevel) {
      window.localStorage.setItem('alarm2DFilterLevel', JSON.stringify(this.filterLevel))
    } else {
      this.SAVE_FILTERLEVEL(JSON.parse(filterLevel))
    }
    // 自动定位 应急预案
    let switchStatus = window.localStorage.getItem('alarm2Dswitch')
    if (!switchStatus) {
      switchStatus = {
        isAutoPosition: this.isAutoPosition,
        isEmergency: this.isEmergency
      }
      window.localStorage.setItem('alarm2Dswitch', JSON.stringify(switchStatus))
    } else {
      switchStatus = JSON.parse(switchStatus)
      this.switchAutoPosition(switchStatus.isAutoPosition)
      this.switchEmergency(switchStatus.isEmergency)
    }
  },
  beforeDestroy() {
    alarm.remove('all', this.receiveFaceTrail)
    alarm.remove('singlePawn', this.receiveSingleAlarm)
    alarm.remove('singlePawnLoc', this.receiveSinglePos)
    alarm.remove('singleStatus', this.singleStatusChange)
    alarm.remove('singleTimeOut', this.singleTimeOut)
    this.SET_VIDEO_ALARM_ARR({})
    this.SET_SOS_ALARM_ARR({})
  }
}
</script>

<style>
</style>
