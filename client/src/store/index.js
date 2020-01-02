import Vue from 'vue'
import Vuex from 'vuex'
import {read, save} from '../storage'
import routeLoading from './modules/route'
import config from './modules/global-config'
import user from './modules/user'
import pagination from './modules/page'
import playback from './modules/playback'
import preview from './modules/preview'
import mapGisData from './modules/map/mapGisdata'
import mapPageState from './modules/map/mapPageState'
import mapAreaData from './modules/map/mapAreaData'
import mapVedioData from './modules/map/mapVedioData'
import mapAlarmData from './modules/map/mapAlarmData'
import mapFormCheck from './modules/map/mapFormCheck'
import localConfig from './modules/localConfig.api'
import orgSetting from './modules/orgSetting'
import equipment from './modules/equipment'
import newEquipment from './modules/newEquipment'
import resource from './modules/resource'
import vehicle from './modules/vehicle'
import alarmManage from './modules/alarmManage/alarmManage'
import sortShow from './modules/alarmManage/sortShow'
import timeTemplate from './modules/alarmManage/timeTemplate'
import paramsSetting from './modules/alarmManage/paramsSetting'
import videoManage from './modules/videoManange'
import tvwall from './modules/tvwall'
import videoOrg from './modules/videoOrg'
import platform from './modules/platform'
import warningCount from './modules/warning/warningCount'
import warningDispose from './modules/warning/warningDispose'
import dict from './modules/dict'
import face from './modules/face'
import homePage from './modules/homepage'
import query from './modules/query'
import structure from './modules/structure'
import firecontrol from './modules/fire/fireAlarm'
import sysDoor from './modules/door/sysDoor'
import funDoor from './modules/door/funDoor'
// 单兵管理
import sentry from './modules/sentry'
// 巡更任务
import patrol from './modules/patrol'
// 应急预案
import emergencyMan from './modules/emergency/emergencyMan'
// 地图巡更
import patrolData from './modules/map/patrol/patrolData'
// 地图移送单兵
import mobilePatrol from './modules/map/patrol/mobilePatrol'
// 人脸抓拍
import veriface from './modules/veriface'
// 视频结构化
import videoStructured from './modules/videoStructured'
// 视频结构化配置
import videoStructuredSetting from './modules/videoStructured/setting'
// 视频结构化数据统计
import videoStructuredDataRecord from './modules/videoStructured/dataRecord'
// 视频结构化以图搜图
import videoStructuredImageSearch from './modules/videoStructured/imageSearch'
// 视频结构化追踪
import structuredTrack from './modules/videoStructured/structuredTrack'
// 综合查询
import synthesizeQuery from './modules/videoStructured/synthesizeQuery'
// 报警求助
import alarmHelps from './modules/alarmHelps'
import tdBuild from './modules/3DMap/build'
import tdFloor from './modules/3DMap/floor'
import tdPoint from './modules/3DMap/point'
import tdIndex from './modules/3DMap/index'
import alarmThreeD from './modules/3DMap/alarm'
// 智能交通
import traffic from './modules/traffic'
// 运维管理
import opsManage from './modules/opsManange'
// 运维配置
import opsConfig from './modules/opsConfig'
// 业务管理_接警
import businessAlarm from './modules/business/receiveAlarm'
import dutyLog from './modules/business/dutyLog'
// 业务管理_值班列表
import dutyList from './modules/business/dutyList'
// 业务管理_日志管理
import logManage from './modules/business/logManage'
// 业务管理_接力追踪
import relayTracking from './modules/business/relayTracking'
// 平台互联
import interconnect from './modules/interconnect'
// 用户管理
import userManage from './modules/userManage/setUser'
import roleManage from './modules/userManage/setRole'
import securityPolicy from './modules/userManage/setSecurityPolicy'
import powerDist from './modules/userManage/setPowerDist'
// 巡更报警
import patrolAlarm from './modules/3DMap/patrolAlarm'
import alarmMainFrame from './modules/warning/alarmMainFrame'
// 三维地图模型库
import threeMap from './modules/threeMap'
import twoMapIcon from './modules/twoMapIcon'
// 3D地图应用模式交互状态
import map3DApplyIX from './modules/3DMap/map3DApplyInteractive'
// 3D地图配置模式交互状态
// import map3DEditIX from './modules/3DMap/index'
// 用户
import security from './modules/security'
// 2D地图状态
import map2DEditIX from './modules/2DMap/map2DEdit'
import map2DApplyIX from './modules/2DMap/map2DApplyInteractive'
import mapIndex from './modules/2DMap/index' // 地图控制相关
import mapArea from './modules/2DMap/area' // 网格、楼宇、楼层相关
import mapPoint from './modules/2DMap/point' // 点位资源相关
import patrol2DAlarm from './modules/2DMap/patrolAlarm' // 巡更和单兵
import mapAlarm from './modules/2DMap/alarm' // 报警相关
// 报警处理
import alarmProcess from './modules/alarmProcess'
// 广播对讲
import broadcast from './modules/broadcast'
// 非机动车管理
import nonVehicle from './modules/nonVehicleManage/nonVehicle'
// 人车同检
import smartTrafficRecord from './modules/smartTrafficRecord/smartTrafficRecord'
// 110呼叫中心
import phone from './modules/callCenter'
// 通行管理--人员管理
import personnelManagementStatus from './modules/passageModule/configuration/personnelManagementStatus'
// 通行管理-设备管理
import deviceManagementStatus from './modules/passageModule/configuration/deviceManagementStatus'
// 对讲配置
import talkConfig from './modules/talkConfig'
// 机动车管理
import vehicleManage from './modules/vehicleManage/vehicleManage'
// 历史对讲
import historyIntercom from './modules/intercom/historyIntercom'
// 对讲管理
import intercom from './modules/intercom/intercom'

// 人员通行-门禁权限
import accessControlAuthorityStatus from './modules/passageModule/adhibition/accessControlAuthorityStatus'

// 人员通行-实时监控
import monitoringStatus from './modules/passageModule/adhibition/monitoringStatus'

// 人员通行- 数据统计
import dataStatisticsStatus from './modules/passageModule/adhibition/dataStatisticsStatus'
// 人员通行- 通行记录
import accessRecords from './modules/passageModule/adhibition/accessRecords'
// FengMap 3D
import fengMap from './modules/fengMap/fengmap'
// FengMap 绘制
import fengMapDraw from './modules/fengMap/area'
import fengMapPoint from './modules/fengMap/point'
// FengMap 头像绘制
import fengMapFace from './modules/fengMap/face'
// FengMap 线绘制
import fengMapLine from './modules/fengMap/line'
// FengMap 地图应用点位联动相关
import fengMapApplyInteractive from './modules/fengMap/fengMapApplyInteractive'
// FengMap 地图应用报警相关相关
import fengMapAlarm from './modules/fengMap/alarm'
Vue.use(Vuex)
Vue.config.devtools = true
let plugin = null
let modules = {
  homePage,
  user,
  config,
  routeLoading,
  pagination,
  playback,
  videoManage,
  localConfig,
  preview,
  equipment,
  newEquipment,
  userManage,
  roleManage,
  securityPolicy,
  powerDist,
  resource,
  vehicle,
  sortShow,
  timeTemplate,
  paramsSetting,
  orgSetting,
  tvwall,
  videoOrg,
  platform,
  warningCount,
  dict,
  face,
  warningDispose,
  query,
  structure,
  mapGisData,
  mapPageState,
  mapAreaData,
  mapVedioData,
  mapAlarmData,
  mapFormCheck,
  patrol,
  firecontrol,
  sysDoor,
  funDoor,
  emergencyMan,
  sentry,
  patrolData,
  mobilePatrol,
  veriface,
  videoStructured,
  videoStructuredImageSearch,
  alarmHelps,
  // TdMap,
  traffic,
  opsManage,
  opsConfig,
  dutyList,
  businessAlarm,
  dutyLog,
  interconnect,
  tdBuild,
  tdFloor,
  tdPoint,
  tdIndex,
  patrolAlarm,
  alarmMainFrame,
  twoMapIcon,
  threeMap,
  alarmThreeD,
  map3DApplyIX,
  // map3DEditIX,
  security,
  mapIndex,
  mapArea,
  mapPoint,
  patrol2DAlarm,
  mapAlarm,
  map2DApplyIX,
  map2DEditIX,
  alarmProcess,
  alarmManage,
  broadcast,
  logManage,
  relayTracking,
  videoStructuredSetting,
  synthesizeQuery,
  nonVehicle,
  smartTrafficRecord,
  phone,
  videoStructuredDataRecord,
  structuredTrack, // 视频结构化-结构化追踪
  personnelManagementStatus, // 通行管理-人员管理
  deviceManagementStatus, // 通行管理-设备管理
  talkConfig,
  vehicleManage,
  historyIntercom,
  intercom,
  accessControlAuthorityStatus,
  monitoringStatus, // 人员通行-实时管理
  dataStatisticsStatus, // 人员通行-数据统计
  accessRecords,
  fengMap,
  fengMapDraw,
  fengMapPoint,
  fengMapFace,
  fengMapLine,
  fengMapApplyInteractive,
  fengMapAlarm
}
// 刷新页面后把保存到stroage的数据还原到store中
let state = read('state') || '{}'
state = JSON.parse(state)
for (const key in state) {
  const obj = state[key] || modules[key].state
  modules[key].state = {...obj}
}
save('state', '{}')
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: modules,
  getters: {
    plugin() {
      return plugin
    }
  },
  mutations: {
    SET_PLUGIN(state, pl) {
      plugin = pl
    }
  }
})

export default store
