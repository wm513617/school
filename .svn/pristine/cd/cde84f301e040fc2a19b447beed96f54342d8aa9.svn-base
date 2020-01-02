/**
 * 2D地图点位相关状态
 */
import {
  VIDEOTYPEKEY,
  RESOURCETYPE,
  CAMERATYPE,
  PROJ,
  MPSIGNKEY
} from 'assets/2DMap/meta/common'
import toTreeData from '../../../assets/js/toTreeData'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'
import area from './area'
import mapIndex from './map2DApplyInteractive'
import indexModule from './index'
import TransformCoord from 'assets/2DMap/utils/transformcoord'
import { toMercator } from '@turf/projection'
import { point } from '@turf/helpers'
import {
  loadVideosByMapIdApi,
  loadPatrolsByMapIdApi,
  loadCommonAlarmsByMapIdApi,
  loadFireAlarmsByMapIdApi,
  loadAlarmHostsByMapIdApi,
  getCommonResourceByIdApi,
  getPatrolDataByIdApi,
  getSingleDataByIdApi,
  loadSubVideosByMapIdApi,
  loadSubVideosByFloorIdApi,
  getAlarmHelpOrgTreeApi,
  getResourceTreeApi,
  getAlarmOrgApi,
  getPatrolPointApi,
  delOnePointApi,
  loadVideosByFloorIdApi,
  loadResourceByFloorIdApi,
  loadPatrolByFloorIdApi,
  get2DSelectBoxDataApi,
  queryDefaultIconByOidApi,
  saveCommonPointResApi,
  savePatrolPointResApi,
  deletePatrolPointResApi,
  queryAlarmHelpResApi,
  get2DPatrolCountInfoApi
} from '../../../http/map2d'
import { putTracking } from '../../../http/business/tracking.api'
const state = {
  mapResourceAttributes: {
    // 点位信息
    type: 'AttrAlarm', // 枚举， 'AttrAlarm','AttrAlarmHelp','AttrBuilding', 'AttrModel', 'AttrPatrol', 'AttrSinglePawn', 'AttrVideo'
    position: {}, // 经纬度位置
    name: '',
    vendor: '',
    contacts: '',
    telContacts: 0,
    tempName: '',
    resourceId: ''
  },
  showMapResourceAttributes: false,
  selectBoxSingleData: [],
  alarmHelpTreeData: [], // 报警求助点位树数据
  boltipcResourceArr: [], // 枪机资源数组
  boltipcFeatures: [], // 枪机要素
  boltipcSectorFeatures: [], // 枪机覆盖区域要素
  boltipcLabelFeatures: [], // 枪机名称要素
  halfBallipcResourceArr: [], // 半球资源数组
  halfBallipcFeatures: [], // 半球要素
  halfBallipcSectorFeatures: [], // 半球覆盖区域要素
  halfBallipcLabelFeatures: [], // 半球名称要素
  fastBallipcResourceArr: [], // 快球资源数组
  fastBallipcFeatures: [], // 快球要素
  fastBallipcSectorFeatures: [], // 快球覆盖区域要素
  fastBallipcLabelFeatures: [], // 快球名称要素
  allViewipcResourceArr: [], // 全景资源数组
  allViewipcFeatures: [], // 全景要素
  allViewipcSectorFeatures: [], // 全景覆盖区域要素
  allViewipcLabelFeatures: [], // 全景名称要素
  redBoltipcResourceArr: [], // 红外枪机资源数组
  redBoltipcFeatures: [], // 红外枪机要素
  redBoltipcSectorFeatures: [], // 红外枪机覆盖区域要素
  redBoltipcLabelFeatures: [], // 红外枪机名称要素
  verfaceipcResourceArr: [], // 人脸抓拍资源数组
  verfaceipcFeatures: [], // 人脸抓拍要素
  verfaceipcSectorFeatures: [], // 人脸抓拍覆盖区域要素
  verfaceipcLabelFeatures: [], // 人脸抓拍名称要素
  trafficipcResourceArr: [], // 交通抓拍资源数组
  trafficipcFeatures: [], // 交通抓拍要素
  trafficipcSectorFeatures: [], // 交通抓拍覆盖区域要素
  trafficipcLabelFeatures: [], // 交通抓拍名称要素
  doorControlResourceArr: [], // 门禁资源数据
  doorControlFeatures: [], // 门禁要素
  doorControlLabelFeatures: [], // 门禁名称要素
  patrolResourceArr: [], // 巡更资源数据
  patrolFeatures: [], // 巡更要素
  patrolLabelFeatures: [], // 巡更名称要素
  commonAlarmResourceArr: [], // 普通报警资源数据
  commonAlarmFeatures: [], // 普通报警要素
  commonAlarmLabelFeatures: [], // 普通报警名称要素
  fireAlarmResourceArr: [], // 消防报警资源数据
  fireAlarmFeatures: [], // 消防报警要素
  fireAlarmLabelFeatures: [], // 消防报警名称要素
  alarmHostResourceArr: [], // 报警主机资源数据
  alarmHostFeatures: [], // 报警主机要素
  alarmHostLabelFeatures: [], // 报警主机名称要素
  alarmColumnResourceArr: [], // 报警柱资源数据
  alarmColumnFeatures: [], // 报警柱要素数据
  alarmColumnLabelFeatures: [], // 报警柱名称要素数据
  alarmBoxResourceArr: [], // 报警箱资源数据
  alarmBoxFeatures: [], // 报警箱要素数据
  alarmBoxLabelFeatures: [], // 报警箱名称要素数据
  isSelectBoxPreview: false, // 是否打开框选预览
  isSelectBoxRelayTrack: false, // 是否打开接力追踪
  previewPointList: [], // 框选预览视频列表
  playbackTrackVideoList: [], // 接力追踪数据
  playbackPointList: [], // 框选回放视频列表
  videoCheckedNum: 0, // 视频列表选中的数量
  singleFeatures: [], // 单兵要素
  pointDrawActive: false, // 点绘制是否激活
  lineDrawActive: false, // 点绘制是否激活
  // 地图编辑模式资源列表
  mapSourceList: [],
  mapAlarmList: [], // 地图编辑模式报警资源列表
  partrolData: [], // 地图编辑模式巡更点位列表
  doorControlTreeData: [], // 地图编辑模式-门禁树数据
  locateFeatures: [], // 地图高亮定位要素
  selectedMapPointRes: {}, // 地图资源点位
  videoEditSectorChecked: false, // 视频编辑时覆盖区域是否勾选
  videoEditPointData: null, // 视频编辑时点位信息
  defaultPointIcon: null // 默认点位图标文件
}
const getters = {
  boltipcResourceArr: state => { // 获取枪机资源数组
    return state.boltipcResourceArr
  },
  boltipcFeatures: state => { // 获取枪机要素
    return state.boltipcFeatures
  },
  boltipcSectorFeatures: state => { // 获取枪机覆盖区域要素
    return state.boltipcSectorFeatures
  },
  boltipcLabelFeatures: state => { // 获取枪机名称要素
    return state.boltipcLabelFeatures
  },
  halfBallipcResourceArr: state => { // 获取半球资源数组
    return state.halfBallipcResourceArr
  },
  halfBallipcFeatures: state => { // 获取半球要素
    return state.halfBallipcFeatures
  },
  halfBallipcSectorFeatures: state => { // 获取半球覆盖区域要素
    return state.halfBallipcSectorFeatures
  },
  halfBallipcLabelFeatures: state => { // 获取半球名称要素
    return state.halfBallipcLabelFeatures
  },
  fastBallipcResourceArr: state => { // 获取快球资源数组
    return state.fastBallipcResourceArr
  },
  fastBallipcFeatures: state => { // 获取快球要素
    return state.fastBallipcFeatures
  },
  fastBallipcSectorFeatures: state => { // 获取快球覆盖区域要素
    return state.fastBallipcSectorFeatures
  },
  fastBallipcLabelFeatures: state => { // 获取快球名称要素
    return state.fastBallipcLabelFeatures
  },
  allViewipcResourceArr: state => { // 获取全景资源数组
    return state.allViewipcResourceArr
  },
  allViewipcFeatures: state => { // 获取全景要素
    return state.allViewipcFeatures
  },
  allViewipcSectorFeatures: state => { // 获取全景覆盖区域要素
    return state.allViewipcSectorFeatures
  },
  allViewipcLabelFeatures: state => { // 获取全景名称要素
    return state.allViewipcLabelFeatures
  },
  redBoltipcResourceArr: state => { // 获取红外枪机资源数组
    return state.redBoltipcResourceArr
  },
  redBoltipcFeatures: state => { // 获取红外枪机要素
    return state.redBoltipcFeatures
  },
  redBoltipcSectorFeatures: state => { // 获取红外枪机覆盖区域要素
    return state.redBoltipcSectorFeatures
  },
  redBoltipcLabelFeatures: state => { // 获取红外枪机名称要素
    return state.redBoltipcLabelFeatures
  },
  verfaceipcResourceArr: state => { // 获取人脸抓拍资源数组
    return state.verfaceipcResourceArr
  },
  verfaceipcFeatures: state => { // 获取人脸抓拍要素
    return state.verfaceipcFeatures
  },
  verfaceipcSectorFeatures: state => { // 获取人脸抓拍覆盖区域要素
    return state.verfaceipcSectorFeatures
  },
  verfaceipcLabelFeatures: state => { // 获取人脸抓拍名称要素
    return state.verfaceipcLabelFeatures
  },
  trafficipcResourceArr: state => { // 获取交通抓拍资源数组
    return state.trafficipcResourceArr
  },
  trafficipcFeatures: state => { // 获取交通抓拍要素
    return state.trafficipcFeatures
  },
  trafficipcSectorFeatures: state => { // 获取交通抓拍覆盖区域要素
    return state.trafficipcSectorFeatures
  },
  trafficipcLabelFeatures: state => { // 获取交通抓拍名称要素
    return state.trafficipcLabelFeatures
  },
  doorControlResourceArr: state => { // 获取巡更要素
    return state.doorControlResourceArr
  },
  doorControlFeatures: state => { // 获取巡更资源数据
    return state.doorControlFeatures
  },
  doorControlLabelFeatures: state => { // 获取巡更名称要素
    return state.doorControlLabelFeatures
  },
  patrolFeatures: state => { // 获取门禁资源数据
    return state.patrolFeatures
  },
  patrolResourceArr: state => { // 获取门禁要素
    return state.patrolResourceArr
  },
  patrolLabelFeatures: state => { // 获取门禁名称要素
    return state.patrolLabelFeatures
  },
  commonAlarmFeatures: state => { // 获取普通报警要素
    return state.commonAlarmFeatures
  },
  commonAlarmResourceArr: state => { // 获取普通报警资源数据
    return state.commonAlarmResourceArr
  },
  commonAlarmLabelFeatures: state => { // 获取普通报警名称要素
    return state.commonAlarmLabelFeatures
  },
  fireAlarmResourceArr: state => { // 获取消防报警资源数据
    return state.fireAlarmResourceArr
  },
  fireAlarmFeatures: state => { // 获取消防报警要素
    return state.fireAlarmFeatures
  },
  fireAlarmLabelFeatures: state => { // 获取消防报警名称要素
    return state.fireAlarmLabelFeatures
  },
  alarmHostResourceArr: state => { // 获取报警主机资源数据
    return state.alarmHostResourceArr
  },
  alarmHostFeatures: state => { // 获取报警主机要素
    return state.alarmHostFeatures
  },
  alarmHostLabelFeatures: state => { // 获取报警主机名称要素
    return state.alarmHostLabelFeatures
  },
  mapResourceAttributes: state => { // 获取点位信息
    return state.mapResourceAttributes
  },
  showMapResourceAttributes: state => { // 获取是否显示
    return state.showMapResourceAttributes
  },
  alarmColumnResourceArr: state => { // 报警柱要素数据
    return state.alarmColumnResourceArr
  },
  alarmColumnFeatures: state => { // 获取报警柱要素数据
    return state.alarmColumnFeatures
  },
  alarmColumnLabelFeatures: state => { // 获取报警柱名称要素数据
    return state.alarmColumnLabelFeatures
  },
  alarmBoxResourceArr: state => { // 报警箱资源数据
    return state.alarmBoxResourceArr
  },
  alarmBoxFeatures: state => { // 获取报警箱要素数据
    return state.alarmBoxFeatures
  },
  alarmBoxLabelFeatures: state => { // 获取报警箱名称要素数据
    return state.alarmBoxLabelFeatures
  },
  singleFeatures: state => { // 获取单兵要素
    return state.singleFeatures
  },
  pointDrawActive: state => { // 获取点位绘制激活状态
    return state.pointDrawActive
  },
  lineDrawActive: state => { // 获取线绘制激活状态
    return state.lineDrawActive
  },
  locateFeatures: state => { // 获取高亮定位要素数组
    return state.locateFeatures
  },
  selectedMapPointRes: state => { // 地图资源点位
    return state.selectedMapPointRes
  },
  videoEditSectorChecked: state => { // 视频编辑时覆盖区域是否勾选
    return state.videoEditSectorChecked
  },
  videoEditPointData: state => { // 视频编辑时点位信息
    return state.videoEditPointData
  },
  defaultPointIcon: state => { // 获取默认点位图标文件
    return state.defaultPointIcon
  }
}
const mutations = {
  SET_IS_SELECT_BOX_PREVIEW(state, data) { // 是否打开框选预览
    state.isSelectBoxPreview = data
  },
  SET_IS_SELECT_BOX_RELAYTRACK(state, data) { // 是否打开接力追踪
    state.isSelectBoxRelayTrack = data
  },
  SET_BOLTIPC_RESOURCE_ARR(state, arr) { // 设置枪机资源数组
    state.boltipcResourceArr = arr
  },
  SET_BOLTIPC_FEATURES(state, features) { // 设置枪机要素
    state.boltipcFeatures = features
  },
  SET_BOLTIPC_SECTOR_FEATURES(state, features) { // 设置枪机覆盖区域要素
    state.boltipcSectorFeatures = features
  },
  SET_BOLTIPC_LABEL_FEATURES(state, features) { // 设置枪机名称要素
    state.boltipcLabelFeatures = features
  },
  SET_HALFBALLIPC_RESOURCE_ARR(state, arr) { // 设置半球资源数组
    state.halfBallipcResourceArr = arr
  },
  SET_HALFBALLIPC_FEATURES(state, features) { // 设置半球要素
    state.halfBallipcFeatures = features
  },
  SET_HALFBALLIPC_SECTOR_FEATURES(state, features) { // 设置半球覆盖区域要素
    state.halfBallipcSectorFeatures = features
  },
  SET_HALFBALLIPC_LABEL_FEATURES(state, features) { // 设置半球名称要素
    state.halfBallipcLabelFeatures = features
  },
  SET_FASTBALLIPC_RESOURCE_ARR(state, arr) { // 设置快球资源数组
    state.fastBallipcResourceArr = arr
  },
  SET_FASTBALLIPC_FEATURES(state, features) { // 设置快球要素
    state.fastBallipcFeatures = features
  },
  SET_FASTBALLIPC_SECTOR_FEATURES(state, features) { // 设置快球覆盖区域要素
    state.fastBallipcSectorFeatures = features
  },
  SET_FASTBALLIPC_LABEL_FEATURES(state, features) { // 设置快球名称要素
    state.fastBallipcLabelFeatures = features
  },
  SET_ALLVIEWIPC_RESOURCE_ARR(state, arr) { // 设置全景资源数组
    state.allViewipcResourceArr = arr
  },
  SET_ALLVIEWIPC_FEATURES(state, features) { // 设置全景要素
    state.allViewipcFeatures = features
  },
  SET_ALLVIEWIPC_SECTOR_FEATURES(state, features) { // 设置全景覆盖区域要素
    state.allViewipcSectorFeatures = features
  },
  SET_ALLVIEWIPC_LABEL_FEATURES(state, features) { // 设置全景名称要素
    state.allViewipcLabelFeatures = features
  },
  SET_REDBOLTIPC_RESOURCE_ARR(state, arr) { // 设置红外枪机资源数组
    state.redBoltipcResourceArr = arr
  },
  SET_REDBOLTIPC_FEATURES(state, features) { // 设置红外枪机要素
    state.redBoltipcFeatures = features
  },
  SET_REDBOLTIPC_SECTOR_FEATURES(state, features) { // 设置红外枪机覆盖区域要素
    state.redBoltipcSectorFeatures = features
  },
  SET_REDBOLTIPC_LABEL_FEATURES(state, features) { // 设置红外枪机名称要素
    state.redBoltipcLabelFeatures = features
  },
  SET_VERFACEIPC_RESOURCE_ARR(state, arr) { // 设置人脸抓拍资源数组
    state.verfaceipcResourceArr = arr
  },
  SET_VERFACEIPC_FEATURES(state, features) { // 设置人脸抓拍要素
    state.verfaceipcFeatures = features
  },
  SET_VERFACEIPC_SECTOR_FEATURES(state, features) { // 设置人脸抓拍覆盖区域要素
    state.verfaceipcSectorFeatures = features
  },
  SET_VERFACEIPC_LABEL_FEATURES(state, features) { // 设置人脸抓拍名称要素
    state.verfaceipcLabelFeatures = features
  },
  SET_TRAFFICIPC_RESOURCE_ARR(state, arr) { // 设置交通抓拍资源数组
    state.trafficipcResourceArr = arr
  },
  SET_TRAFFICIPC_FEATURES(state, features) { // 设置交通抓拍要素
    state.trafficipcFeatures = features
  },
  SET_TRAFFICIPC_SECTOR_FEATURES(state, features) { // 设置交通抓拍覆盖区域要素
    state.trafficipcSectorFeatures = features
  },
  SET_TRAFFICIPC_LABEL_FEATURES(state, features) { // 设置交通抓拍名称要素
    state.trafficipcLabelFeatures = features
  },
  SET_DOORCONTROL_RESOURCE_ARR(state, arr) { // 设置门禁资源
    state.doorControlResourceArr = arr
  },
  SET_DOORCONTROL_FEATURES(state, features) { // 设置门禁要素
    state.doorControlFeatures = features
  },
  SET_DOORCONTROL_LABEL_FEATURES(state, features) { // 设置门禁名称要素
    state.doorControlLabelFeatures = features
  },
  SET_PATROL_RESOURCE_ARR(state, arr) { // 设置巡更资源
    state.patrolResourceArr = arr
  },
  SET_PATROL_FEATURES(state, features) { // 设置巡更要素
    state.patrolFeatures = features
  },
  SET_PATROL_LABEL_FEATURES(state, features) { // 设置巡更名称要素
    state.patrolLabelFeatures = features
  },
  SET_COMMON_ALARM_RESOURCE_ARR(state, arr) { // 设置普通报警资源数据
    state.commonAlarmResourceArr = arr
  },
  SET_COMMON_ALARM_FEATURES(state, features) { // 设置普通报警要素
    state.commonAlarmFeatures = features
  },
  SET_COMMON_ALARM_LABEL_FEATURES(state, features) { // 设置普通报警名称要素
    state.commonAlarmLabelFeatures = features
  },
  SET_FIRE_ALARM_RESOURCE_ARR(state, arr) { // 设置消防报警资源数据
    state.fireAlarmResourceArr = arr
  },
  SET_FIRE_ALARM_FEATURES(state, features) { // 设置消防报警要素
    state.fireAlarmFeatures = features
  },
  SET_FIRE_ALARM_LABEL_FEATURES(state, features) { // 设置消防报警名称要素
    state.fireAlarmLabelFeatures = features
  },
  SET_ALARM_HOST_RESOURCE_ARR(state, arr) { // 设置报警主机资源数据
    state.alarmHostResourceArr = arr
  },
  SET_ALARM_HOST_FEATURES(state, features) { // 设置报警主机要素
    state.alarmHostFeatures = features
  },
  SET_ALARM_HOST_LABEL_FEATURES(state, features) { // 设置报警主机名称要素
    state.alarmHostLabelFeatures = features
  },
  SET_ALARM_COLUMN_RESOURCE_ARR(state, arr) { // 设置报警柱资源
    state.alarmColumnResourceArr = arr
  },
  SET_ALARM_COLUMN_FEATURES(state, features) { // 设置报警柱要素
    state.alarmColumnFeatures = features
  },
  SET_ALARM_COLUMN_LABEL_FEATURES(state, features) { // 设置报警柱名称要素
    state.alarmColumnLabelFeatures = features
  },
  SET_ALARM_BOX_RESOURCE_ARR(state, arr) { // 设置报警箱资源
    state.alarmBoxResourceArr = arr
  },
  SET_ALARM_BOX_FEATURES(state, features) { // 设置报警箱要素
    state.alarmBoxFeatures = features
  },
  SET_ALARM_BOX_LABEL_FEATURES(state, features) { // 设置报警箱名称要素
    state.alarmBoxLabelFeatures = features
  },
  SET_SINGLE_FEATURES(state, features) { // 设置单兵要素
    state.singleFeatures = features
  },
  SET_SUB_VIDEOS_RESOURSE_ARR(state, param) {
    let {
      query,
      data
    } = param
    let {
      monitoryPointGenera,
      monitortype
    } = query
    monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
    if (Number(monitoryPointGenera) === CAMERATYPE.normalipc) { // 普通ipc
      switch (monitortype) {
        case VIDEOTYPEKEY.boltipc: // 枪机
          state.boltipcResourceArr = data
          break
        case VIDEOTYPEKEY.halfBallipc: // 半球
          state.halfBallipcResourceArr = data
          break
        case VIDEOTYPEKEY.fastBallipc: // 快球
          state.fastBallipcResourceArr = data
          break
        case VIDEOTYPEKEY.allViewipc: // 全景
          state.allViewipcResourceArr = data
          break
        case VIDEOTYPEKEY.redBoltipc: // 红外枪机
          state.redBoltipcResourceArr = data
          break
      }
    } else if (Number(monitoryPointGenera) === CAMERATYPE.verfaceipc) { // 人脸抓拍
      state.verfaceipcResourceArr = data
    } else if (Number(monitoryPointGenera) === CAMERATYPE.trafficipc) { // 交通抓拍
      state.trafficipcResourceArr = data
    }
  },
  SET_MAP_RESOURCE_ATTRIBUTES(state, features) { // 设置地图资源信息
    state.showMapResourceAttributes = true
    let data = null
    let params = features.res
    console.log('选中资源信息：', params && params.data)
    switch (features.type) {
      case 0: // 视频
        data = {
          type: 'AttrVideo',
          rType: features.type,
          name: params.data.name || '',
          position: params.data.point && params.data.point.loc ? { lon: Number(params.data.point.loc.split(',')[0]), lat: Number(params.data.point.loc.split(',')[1]) } : { lon: 0, lat: 0 },
          vendor: (params.data.eid && params.data.eid.manufacturer) || '',
          contactsInfo: params.data.point
            ? params.data.point.principal.map(v => {
              return {
                contacts: v.name || '',
                telContacts: v.mobile || ''
              }
            }) : [],
          videoInfo: params.data, // 视频组件所需信息
          isOnline: params.data.status // 0：不在线 1：在线
        }
        break
      case 1:
      case 11:
      case 9: // 报警
        let center = params.data.point && params.data.point.loc ? params.data.point.loc : '0,0'
        if (params.data.mapsign.signtype === MPSIGNKEY.lineString) {
          center = spaceUtil.getMultiLineStringCenter(center)
        } else if (params.data.mapsign.signtype === MPSIGNKEY.polygon) {
          center = spaceUtil.getMultiLineStringCenter(center)
        } else {
          center = center.split(',')
        }
        data = {
          type: 'AttrAlarm',
          rType: features.type,
          name: params.data.name || '',
          level: params.data.level || '',
          position: Array.isArray(center) ? { lon: Number(center[0]), lat: Number(center[1]) } : { lon: 0, lat: 0 },
          contactsInfo: params.data.point
            ? params.data.point.principal.map(v => {
              return {
                contacts: v.name || '',
                telContacts: v.mobile || ''
              }
            }) : [],
          resourceId: params.data._id || '',
          alarmtemplate: params.data.alarmtemplate || ''
        }
        break
      case 4: // 门禁
        data = {
          type: 'AttrDoorControl',
          rType: features.type,
          name: params.data.name || '',
          vendor: (params.data.eid && params.data.eid.manufacturer) || '',
          position: params.data.point && params.data.point.loc ? { lon: Number(params.data.point.loc.split(',')[0]), lat: Number(params.data.point.loc.split(',')[1]) } : { lon: 0, lat: 0 },
          contactsInfo: params.data.point
            ? params.data.point.principal.map(v => {
              return {
                contacts: v.name || '',
                telContacts: v.mobile || ''
              }
            }) : []
        }
        break
      case 'alarmBox':
      case 'alarmPillar': // 报警求助
        data = {
          type: 'AttrAlarmHelp',
          rType: params.data.eid.type,
          name: params.data.name || '',
          position: params.data.point && params.data.point.loc ? { lon: Number(params.data.point.loc.split(',')[0]), lat: Number(params.data.point.loc.split(',')[1]) } : { lon: 0, lat: 0 },
          contactsInfo: params.data.point
            ? params.data.point.principal.map(v => {
              return {
                contacts: v.name || '',
                telContacts: v.mobile || ''
              }
            }) : [],
          videoInfo: params.data
        }
        break
      case 'patrol': // 巡更
        data = {
          type: 'AttrPatrol',
          rType: RESOURCETYPE.patrol,
          id: params.data._id || '',
          name: params.data.devName || '',
          contacts: params.data.charger || '',
          position: params.data.point && params.data.point.geo ? { lon: Number(params.data.point.geo.split(',')[0]), lat: Number(params.data.point.geo.split(',')[1]) } : { lon: 0, lat: 0 },
          telContacts: params.data.phone || '',
          mapid: params.data.point.mapid || '',
          patrolMan: '',
          telPatrolMan: '',
          patrolNum: '',
          alarmNum: '',
          repairNum: ''
        }
        break
      case 'single': // 单兵
        let geo = { lon: 0, lat: 0 }
        if (params.data.geo && params.data.geo.lon && params.data.geo.lat) {
          let coords = TransformCoord.wgs84togcj02(Number(params.data.geo.lon), Number(params.data.geo.lat))
          if (indexModule.state.mapProjection !== PROJ.EPSG4326) {
            coords = toMercator(point(coords)).geometry.coordinates
          }
          geo.lon = coords[0]
          geo.lat = coords[1]
        }
        data = {
          type: 'AttrSinglePawn',
          rType: RESOURCETYPE.single,
          name: params.data.username || '',
          org: params.data.affiliation || '',
          position: geo,
          post: params.data.position || '',
          jobNum: params.data.id || '',
          telContacts: params.data.phone || '',
          percent: 0,
          photo: params.data.photo || '',
          _id: params.data._id || '',
          sn: params.data.sn || '',
          timeOut: params.timeOut || false
        }
        break
      case 'pointalarming': // 单兵超时显示面板，暂时写在这，后续再修改
        let alarmingGeo = { lon: 0, lat: 0 }
        if (params.data.geo && params.data.geo.lon && params.data.geo.lat) {
          let coords = TransformCoord.wgs84togcj02(Number(params.data.geo.lon), Number(params.data.geo.lat))
          if (indexModule.state.mapProjection !== PROJ.EPSG4326) {
            coords = toMercator(point(coords)).geometry.coordinates
          }
          alarmingGeo.lon = coords[0]
          alarmingGeo.lat = coords[1]
        }
        data = {
          type: 'AttrSinglePawn',
          rType: RESOURCETYPE.single,
          name: params.data.username || '',
          org: params.data.affiliation || '',
          position: alarmingGeo,
          post: params.data.position || '',
          jobNum: params.data.id || '',
          telContacts: params.data.phone || '',
          percent: 0,
          photo: params.data.photo || '',
          _id: params.data._id || '',
          sn: params.data.sn || '',
          timeOut: params.timeOut || false
        }
        break
      case 'building': // 楼宇
        data = {
          type: 'AttrBuilding',
          rType: RESOURCETYPE.building,
          name: params.data.name || '',
          position: params.data.center ? { lon: Number(params.data.center.split(',')[0]), lat: Number(params.data.center.split(',')[1]) } : { lon: 0, lat: 0 },
          contactsInfo: params.data.pid
            ? params.data.pid.map(v => {
              return {
                contacts: v.name || '',
                telContacts: v.mobile || ''
              }
            }) : [],
          id: params.data._id || '',
          storey: params.data.sids ? params.data.sids : [],
          image: params.data.picture && params.data.picture.path ? params.data.picture.path : '',
          synopsis: params.data.desc || '',
          grid: (params.data.gid && params.data.gid.name) ? params.data.gid.name : ''
        }
        break
      case 'grid': // 网格
        data = {
          type: 'AttrGrid',
          rType: RESOURCETYPE.grid,
          gid: params.data._id || '',
          name: params.data.name || '',
          number: params.data.code || '',
          position: params.data.center ? { lon: Number(params.data.center.split(',')[0]), lat: Number(params.data.center.split(',')[1]) } : { lon: 0, lat: 0 },
          contactsInfo: params.data.pids
            ? params.data.pids.map(v => {
              return {
                contacts: v.name || '',
                telContacts: v.mobile || ''
              }
            }) : [],
          synopsis: params.data.desc || ''
        }
        break
      case 'buildingAlarm':
        data = {
          type: 'AttrBuildingAlarm',
          position: features.center ? { lon: Number(features.center.split(',')[0]), lat: Number(features.center.split(',')[1]) } : { lon: 0, lat: 0 }
        }
    }
    state.mapResourceAttributes = data
  },
  CHANGE_SINGLE_TIMEOUT_ALARM_STATUS(state, v) {
    state.mapResourceAttributes.timeOut = v
  },
  UPDATE_SINGLE_ATTR_POS(state, position) { // 更新单兵属性面板的位置
    state.mapResourceAttributes.position = position
  },
  SET_ALARM_HELP_TREE_DATA(state, data) { // 报警求助树
    state.alarmHelpTreeData = data
  },
  // 地图点位资源
  GET_RESOURCEORG_TREE(state, data) {
    state.mapSourceList = data
  },
  // 地图报警资源
  GET_ALARMORG_TREE(state, data) {
    state.mapAlarmList = data
  },
  GET_PARTROL_TREE(state, data) {
    state.partrolData = data
  },
  SET_DOORCONTROL_TREE_DATA(state, data) {
    state.doorControlTreeData = data
  },
  SET_SHOW_MAP_RESOURCE_ATTRIBUTES(state, flag) { // 设置面板是否显示
    state.showMapResourceAttributes = flag
  },
  // 选取区域单兵信息
  SET_SELECT_BOX_SINGLE_DATA(state, data) {
    state.selectBoxSingleData = data
  },
  PUSH_VIDEO_DATA_LIST(state, data) {
    let isSave = true
    for (let i = 0; i < state.previewPointList.length; i++) {
      if (state.previewPointList[i]._id === data._id) {
        isSave = false
        break
      }
    }
    isSave && state.previewPointList.push(data)
  },
  PUSH_SINGLE_DATA_LIST(state, data) {
    let isSave = true
    for (let i = 0; i < state.selectBoxSingleData.length; i++) {
      if (state.selectBoxSingleData[i]._id === data._id) {
        isSave = false
        break
      }
    }
    isSave && state.selectBoxSingleData.push(data)
  },
  // 框选预览视频列表
  SET_PREVIEW_POINT_LIST(state, data) {
    state.previewPointList = data
  },
  PUSH_PREVIEW_POINT_LIST(state, data) {
    const nextArr = []
    for (let i = 0; i < state.previewPointList.length; i++) {
      if (state.previewPointList[i].checked || state.previewPointList[i].collect) {
        nextArr.push(state.previewPointList[i])
      }
    }
    for (let j = 0; j < data.length; j++) {
      let isSave = true
      for (let i = 0; i < nextArr.length; i++) {
        if (nextArr[i]._id === data[j]._id) {
          isSave = false
          break
        }
      }
      isSave && nextArr.push(data[j])
    }
    state.previewPointList = nextArr
  },
  SET_POINT_DRAW_ACTIVE(state, flag) { // 设置点位绘制激活状态
    if (flag) {
      state.lineDrawActive = false
      area.state.areaDrawActive = false
    }
    state.pointDrawActive = flag
  },
  SET_LINE_DRAW_ACTIVE(state, flag) { // 设置线绘制激活状态
    if (flag) {
      state.pointDrawActive = false
      area.state.areaDrawActive = false
    }
    state.lineDrawActive = flag
  },
  SET_LOCATE_FEATURES(state, features) { // 设置高亮定位要素
    state.locateFeatures = features
  },
  SET_SELECTED_MAP_POINT_RES(state, data) { // 设置选中的地图资源点位
    state.selectedMapPointRes = data
  },
  SET_VIDEO_EDIT_SECTOR_CHECKED(state, flag) { // 设置视频编辑时覆盖区域是否勾选
    state.videoEditSectorChecked = flag
  },
  SET_VIDEO_EDIT_POINT_DATA(state, data) { // 设置视频编辑时点位状态
    state.videoEditPointData = data
  },
  SET_DEFAULT_POINT_ICON(state, data) { // 设置默认点位图标文件
    state.defaultPointIcon = data
  },
  // 【接力追踪】
  // 设置【接力追踪模式】视频数据
  SET_PLAYBACK_TRACK_VODEO_LIST(state, data) {
    state.playbackTrackVideoList = data
  },
  // 设置列表选中数量
  SET_VIDEO_CHECKED_NUM(state, data) {
    state.videoCheckedNum = data
  },
  // 设置【标记时间】
  SET_TRACK_COLLECTIONTIME(state, data) {
    let _data1 = JSON.parse(JSON.stringify(state.playbackPointList))
    let _data2 = JSON.parse(JSON.stringify(state.playbackTrackVideoList))
    _data1[0] = data
    _data2[0] = data
    state.playbackPointList = _data1
    state.playbackTrackVideoList = _data2
  },
  // 设置【接力追踪模式】列表数据(上移、下移、删除、清空)
  SET_PLAYBACK_POINT_LIST(state, data) {
    state.playbackPointList = data
    // 需同步到playbackTrackVideoList
    if (state.playbackTrackVideoList.length) { // 当【接力追踪】弹窗有数据时
      this.commit('SORT_PLAYBACK_LIST', {
        main: 'poinList'
      })
    }
  },
  // 添加【接力追踪模式】列表数据
  PUSH_PLAYBACK_VIDEO_DATA_LIST(state, data) {
    let isSave = true
    for (let i = 0; i < state.playbackPointList.length; i++) {
      if (state.playbackPointList[i]._id === data._id) {
        isSave = false
        break
      }
    }
    isSave && state.playbackPointList.push(data)
  },
  // 更新列表的选中项，同时修改【接力追踪】和【回放列表】数据
  PUT_PLAYBACK_POINT_LIST(state, data) {
    state.playbackPointList[data.index].checked = !data.status
    let _data = JSON.parse(JSON.stringify(state.playbackTrackVideoList))
    if (!data.status) { // 选中
      _data.push(state.playbackPointList[data.index])
    } else {
      let num = state.playbackTrackVideoList.findIndex(e => e._id === state.playbackPointList[data.index]._id)
      _data.splice(num, 1)
    }
    state.playbackTrackVideoList = _data
  },
  // 排序
  SORT_PLAYBACK_LIST(state, data) {
    // main 以哪个数组顺序为主
    if (data.main === 'poinList') {
      let _data = state.playbackPointList.filter(e => state.playbackTrackVideoList.some(f => e._id === f._id))
      state.playbackTrackVideoList = _data
    } else if (data.main === 'trackList') {
      mapIndex.state.resouceChooseIndex = 0 // 排序后，默认选中的index = 0
      let arr = data.data.concat(state.playbackPointList)
      let obj = {}
      let _data = []
      arr.map(e => {
        if (!obj[e._id]) {
          _data.push(e)
          obj[e._id] = true
        }
      })
      state.playbackTrackVideoList = data.data
      state.playbackPointList = _data
    }
  }
}
const actions = {
  loadVideosByMapId({
    commit
  }, mapId) { // 根据地图标识加载视频数据
    return new Promise((resolve, reject) => {
      loadVideosByMapIdApi(mapId).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadVideosByFloorId({
    commit
  }, mapId) { // 根据楼层标识加载视频数据
    return new Promise((resolve, reject) => {
      loadVideosByFloorIdApi(mapId).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取报警助树方法
  get2DAlarmHelpOrgTree({
    commit
  }, playod) {
    return new Promise((resolve, reject) => {
      getAlarmHelpOrgTreeApi(playod)
        .then(res => {
          resolve(res.data)
          commit('SET_ALARM_HELP_TREE_DATA', [res.data])
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取2d地图资源树方法
  getVideoResourceTree({
    commit
  }, playod) {
    return new Promise((resolve, reject) => {
      getResourceTreeApi(playod)
        .then(res => {
          resolve(res.data)
          let arr = []
          arr.push(JSON.parse(JSON.stringify(res.data)))
          commit('GET_RESOURCEORG_TREE', toTreeData(arr))
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取2d地图资源树方法
  getAlarmTree({
    commit
  }, playod) {
    return new Promise((resolve, reject) => {
      getAlarmOrgApi(playod)
        .then(res => {
          resolve(res.data)
          let arr = []
          arr.push(JSON.parse(JSON.stringify(res.data)))
          commit('GET_ALARMORG_TREE', toTreeData(arr))
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取2d地图资源树方法
  getPatrolPointTree({
    commit
  }, playod) {
    return new Promise((resolve, reject) => {
      getPatrolPointApi(playod)
        .then(res => {
          resolve(res.data)
          commit('GET_PARTROL_TREE', toTreeData(res.data))
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取2d门禁资源树方法
  getDoorControlTree({
    commit,
    state
  }, floorId) {
    let dcTree = window.localStorage.getItem('dcTree')
    if (dcTree) {
      let treeData = JSON.parse(dcTree)
      if (treeData && treeData.length > 0) {
        let resourceArr = JSON.parse(JSON.stringify(treeData[0].children))
        if (floorId) { // 传入楼层标识，过滤未添加或指定楼层的数据
          resourceArr = resourceArr.filter(item => !item.hasOwnProperty('point') || (item.hasOwnProperty('point') && !item.point.isouter))
        } else { // 未传入楼层标识，过滤未添加或楼外的数据
          resourceArr = resourceArr.filter(item => !item.hasOwnProperty('point') || (item.hasOwnProperty('point') && item.point.isouter))
        }
        treeData[0].children = resourceArr
        commit('SET_DOORCONTROL_TREE_DATA', toTreeData(treeData))
      }
    }
  },
  // 根据地图标识加载门禁数据
  loadDoorControlByMapId({
    commit,
    state
  }, mapId) {
    let dcTree = window.localStorage.getItem('dcTree')
    if (dcTree) {
      let treeData = JSON.parse(dcTree)
      if (treeData && treeData.length > 0) {
        let resourceArr = JSON.parse(JSON.stringify(treeData[0].children))
        resourceArr = resourceArr.filter(item => item.hasOwnProperty('point') && item.point.isouter)
        if (mapId) {
          resourceArr = resourceArr.filter(item => item.point.mapId === mapId)
        }
        commit('SET_DOORCONTROL_RESOURCE_ARR', resourceArr)
      }
    }
  },
  // 根据楼层标识加载门禁数据
  loadDoorControlByFloorId({
    commit
  }, floorId) {
    let dcTree = window.localStorage.getItem('dcTree')
    if (dcTree) {
      let treeData = JSON.parse(dcTree)
      if (treeData && treeData.length > 0) {
        let resourceArr = JSON.parse(JSON.stringify(treeData[0].children))
        resourceArr = resourceArr.filter(item => item.hasOwnProperty('point') && !item.point.isouter)
        if (floorId) {
          resourceArr = resourceArr.filter(item => item.point.sid === floorId)
        }
        commit('SET_DOORCONTROL_RESOURCE_ARR', resourceArr)
      }
    }
  },
  loadSubVideosByMapId({
    commit
  }, query) { // 根据地图标识、监控类型加载视频数据
    return new Promise((resolve, reject) => {
      loadSubVideosByMapIdApi(query).then(res => {
        let param = {
          query,
          data: res.data
        }
        commit('SET_SUB_VIDEOS_RESOURSE_ARR', param)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadPatrolsByMapId({
    commit
  }, mapId) { // 根据地图标识加载巡更数据
    return new Promise((resolve, reject) => {
      loadPatrolsByMapIdApi(mapId).then(res => {
        commit('SET_PATROL_RESOURCE_ARR', res.data.grid) // 设置视频资源数组
        resolve(res.data.grid)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadCommonAlarmsByMapId({
    commit
  }, id) { // 根据id加载普通报警数据
    return new Promise((resolve, reject) => {
      loadCommonAlarmsByMapIdApi(id).then(res => {
        commit('SET_COMMON_ALARM_RESOURCE_ARR', res.data) // 设置普通报警资源数据
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadFireAlarmsByMapId({
    commit
  }, mapId) { // 根据地图标识加载消防报警数据
    return new Promise((resolve, reject) => {
      loadFireAlarmsByMapIdApi(mapId).then(res => {
        commit('SET_FIRE_ALARM_RESOURCE_ARR', res.data) // 设置消防报警资源数据
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadAlarmHostsByMapId({
    commit
  }, mapId) { // 根据地图标识加载报警主机数据
    return new Promise((resolve, reject) => {
      loadAlarmHostsByMapIdApi(mapId).then(res => {
        commit('SET_ALARM_HOST_RESOURCE_ARR', res.data) // 设置报警主机资源数据
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getCommonResourceById({
    commit,
    rootState
  }, id) { // 根据id获取普通资源数据
    return new Promise((resolve, reject) => {
      getCommonResourceByIdApi(id).then(res => {
        let type = rootState.mapIndex.selectedAttr ? rootState.mapIndex.selectedAttr.rType : res.data.type
        commit('SET_MAP_RESOURCE_ATTRIBUTES', {
          res: res,
          type: type
        })
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getvideoResourceById({
    commit,
    rootState
  }, id) { // 根据id获取普通资源数据
    return new Promise((resolve, reject) => {
      getCommonResourceByIdApi(id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getCommonPointResById({
    commit
  }, pointId) {
    return new Promise((resolve, reject) => {
      getCommonResourceByIdApi(pointId).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getPatrolPointResById({
    commit
  }, pointId) {
    return new Promise((resolve, reject) => {
      getPatrolDataByIdApi(pointId).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getSinglePointById({
    commit
  }, id) { // 根据id加载单兵数据
    return new Promise((resolve, reject) => {
      getSingleDataByIdApi(id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getPatrolDataById({
    commit,
    rootState
  }, id) { // 根据id加载巡更数据
    return new Promise((resolve, reject) => {
      getPatrolDataByIdApi(id).then(res => {
        commit('SET_MAP_RESOURCE_ATTRIBUTES', {
          res: res,
          type: rootState.mapIndex.selectedAttr.rType
        })
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getSingleDataById({
    commit,
    rootState
  }, id) { // 根据id加载单兵数据
    return new Promise((resolve, reject) => {
      getSingleDataByIdApi(id).then(res => {
        commit('SET_MAP_RESOURCE_ATTRIBUTES', {
          res: res,
          type: rootState.mapIndex.selectedAttr.rType
        })
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getSingleHeadDataById({
    commit,
    rootState
  }, id) { // 根据id加载单兵数据
    return new Promise((resolve, reject) => {
      getSingleDataByIdApi(id).then(res => {
        commit('SET_MAP_RESOURCE_ATTRIBUTES', {
          res: res,
          type: RESOURCETYPE.single
        })
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadSubVideosByFloorId({
    commit
  }, query) { // 根据楼层标识加载视频子资源数据
    return new Promise((resolve, reject) => {
      loadSubVideosByFloorIdApi(query).then(res => {
        let param = {
          query,
          data: res.data
        }
        commit('SET_SUB_VIDEOS_RESOURSE_ARR', param)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadResourceByFloorId({
    commit
  }, query) { // 根据楼层标识加载资源数据
    return new Promise((resolve, reject) => {
      loadResourceByFloorIdApi(query).then(res => {
        switch (query.channelTypes) {
          case RESOURCETYPE.video: // 视频
            break
          case RESOURCETYPE.commonAlarm: // 普通报警
            commit('SET_COMMON_ALARM_RESOURCE_ARR', res.data)
            break
          case RESOURCETYPE.fireAlarm: // 消防报警
            commit('SET_FIRE_ALARM_RESOURCE_ARR', res.data)
            break
          case RESOURCETYPE.alarmHost: // 报警主机
            commit('SET_ALARM_HOST_RESOURCE_ARR', res.data)
            break
        }
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  queryAlarmHelpRes({
    commit
  }, query) { // 查询报警求助设备
    return new Promise((resolve, reject) => {
      queryAlarmHelpResApi(query).then(res => {
        switch (query.alarm) {
          case RESOURCETYPE.alarmColumn: // 报警柱
            commit('SET_ALARM_COLUMN_RESOURCE_ARR', res.data)
            break
          case RESOURCETYPE.alarmBox: // 报警箱
            commit('SET_ALARM_BOX_RESOURCE_ARR', res.data)
            break
        }
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadPatrolByFloorId({
    commit
  }, floorId) { // 根据楼层标识加载巡更数据
    return new Promise((resolve, reject) => {
      loadPatrolByFloorIdApi(floorId).then(res => {
        commit('SET_PATROL_RESOURCE_ARR', res.data) // 设置视频资源数组
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  delOnePointApi({
    commit
  }, payload) { // 删除点位
    return new Promise((resolve, reject) => {
      delOnePointApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  setIsSelectBoxPreview({
    commit
  }, arr) { // 是否打开框选预览
    commit('SET_IS_SELECT_BOX_PREVIEW', arr)
  },
  setIsSelectBoxRelayTrack({
    commit
  }, arr) { // 是否打开接力追踪
    commit('SET_IS_SELECT_BOX_RELAYTRACK', arr)
  },
  setBoltipcResourceArr({
    commit
  }, arr) { // 设置枪机资源数据
    commit('SET_BOLTIPC_RESOURCE_ARR', arr)
  },
  setBoltipcFeatures({
    commit
  }, features) { // 设置枪机要素
    commit('SET_BOLTIPC_FEATURES', features)
  },
  setBoltipcSectorFeatures({
    commit
  }, features) { // 设置枪机覆盖区域要素
    commit('SET_BOLTIPC_SECTOR_FEATURES', features)
  },
  setBoltipcLabelFeatures({
    commit
  }, features) { // 设置枪机名称要素
    commit('SET_BOLTIPC_LABEL_FEATURES', features)
  },
  setHalfBallipcResourceArr({
    commit
  }, arr) { // 设置半球资源数据
    commit('SET_HALFBALLIPC_RESOURCE_ARR', arr)
  },
  setHalfBallipcFeatures({
    commit
  }, features) { // 设置半球要素
    commit('SET_HALFBALLIPC_FEATURES', features)
  },
  setHalfBallipcSectorFeatures({
    commit
  }, features) { // 设置半球覆盖区域要素
    commit('SET_HALFBALLIPC_SECTOR_FEATURES', features)
  },
  setHalfBallipcLabelFeatures({
    commit
  }, features) { // 设置半球名称要素
    commit('SET_HALFBALLIPC_LABEL_FEATURES', features)
  },
  setFastBallipcResourceArr({
    commit
  }, arr) { // 设置快球资源数据
    commit('SET_FASTBALLIPC_RESOURCE_ARR', arr)
  },
  setFastBallipcFeatures({
    commit
  }, features) { // 设置快球要素
    commit('SET_FASTBALLIPC_FEATURES', features)
  },
  setFastBallipcSectorFeatures({
    commit
  }, features) { // 设置快球覆盖区域要素
    commit('SET_FASTBALLIPC_SECTOR_FEATURES', features)
  },
  setFastBallipcLabelFeatures({
    commit
  }, features) { // 设置快球名称要素
    commit('SET_FASTBALLIPC_LABEL_FEATURES', features)
  },
  setAllViewipcResourceArr({
    commit
  }, arr) { // 设置全景资源数据
    commit('SET_ALLVIEWIPC_RESOURCE_ARR', arr)
  },
  setAllViewipcFeatures({
    commit
  }, features) { // 设置全景要素
    commit('SET_ALLVIEWIPC_FEATURES', features)
  },
  setAllViewipcSectorFeatures({
    commit
  }, features) { // 设置全景覆盖区域要素
    commit('SET_ALLVIEWIPC_SECTOR_FEATURES', features)
  },
  setAllViewipcLabelFeatures({
    commit
  }, features) { // 设置全景名称要素
    commit('SET_ALLVIEWIPC_LABEL_FEATURES', features)
  },
  setRedBoltipcResourceArr({
    commit
  }, arr) { // 设置红外枪机资源数据
    commit('SET_REDBOLTIPC_RESOURCE_ARR', arr)
  },
  setRedBoltipcFeatures({
    commit
  }, features) { // 设置红外枪机要素
    commit('SET_REDBOLTIPC_FEATURES', features)
  },
  setRedBoltipcSectorFeatures({
    commit
  }, features) { // 设置红外枪机覆盖区域要素
    commit('SET_REDBOLTIPC_SECTOR_FEATURES', features)
  },
  setRedBoltipcLabelFeatures({
    commit
  }, features) { // 设置红外枪机名称要素
    commit('SET_REDBOLTIPC_LABEL_FEATURES', features)
  },
  setVerfaceipcResourceArr({
    commit
  }, arr) { // 设置人脸抓拍资源数据
    commit('SET_VERFACEIPC_RESOURCE_ARR', arr)
  },
  setVerfaceipcFeatures({
    commit
  }, features) { // 设置人脸抓拍要素
    commit('SET_VERFACEIPC_FEATURES', features)
  },
  setVerfaceipcSectorFeatures({
    commit
  }, features) { // 设置人脸抓拍覆盖区域要素
    commit('SET_VERFACEIPC_SECTOR_FEATURES', features)
  },
  setVerfaceipcLabelFeatures({
    commit
  }, features) { // 设置人脸抓拍名称要素
    commit('SET_VERFACEIPC_LABEL_FEATURES', features)
  },
  setTrafficipcResourceArr({
    commit
  }, arr) { // 设置交通抓拍资源数据
    commit('SET_TRAFFICIPC_RESOURCE_ARR', arr)
  },
  setTrafficipcFeatures({
    commit
  }, features) { // 设置交通抓拍要素
    commit('SET_TRAFFICIPC_FEATURES', features)
  },
  setTrafficipcSectorFeatures({
    commit
  }, features) { // 设置交通抓拍覆盖区域要素
    commit('SET_TRAFFICIPC_SECTOR_FEATURES', features)
  },
  setTrafficipcLabelFeatures({
    commit
  }, features) { // 设置交通抓拍名称要素
    commit('SET_TRAFFICIPC_LABEL_FEATURES', features)
  },
  setDoorControlResources({
    commit
  }, arr) { // 设置门禁资源数据
    commit('SET_DOORCONTROL_RESOURCE_ARR', arr)
  },
  setDoorControlFeatures({
    commit
  }, features) { // 设置门禁要素
    commit('SET_DOORCONTROL_FEATURES', features)
  },
  setDoorControlLabelFeatures({
    commit
  }, features) { // 设置门禁名称要素
    commit('SET_DOORCONTROL_LABEL_FEATURES', features)
  },
  setPatrolResources({
    commit
  }, arr) { // 设置巡更资源数据
    commit('SET_PATROL_RESOURCE_ARR', arr)
  },
  setPatrolFeatures({
    commit
  }, features) { // 设置巡更要素
    commit('SET_PATROL_FEATURES', features)
  },
  setPatrolLabelFeatures({
    commit
  }, features) { // 设置巡更名称要素
    commit('SET_PATROL_LABEL_FEATURES', features)
  },
  setCommonAlarmResources({
    commit
  }, arr) { // 设置普通报警资源数据
    commit('SET_COMMON_ALARM_RESOURCE_ARR', arr)
  },
  setCommonAlarmFeatures({
    commit
  }, arr) { // 设置普通报警资源数据
    commit('SET_COMMON_ALARM_FEATURES', arr)
  },
  setCommonAlarmLabelFeatures({
    commit
  }, features) { // 设置普通报警名称要素
    commit('SET_COMMON_ALARM_LABEL_FEATURES', features)
  },
  setFireAlarmResources({
    commit
  }, arr) { // 设置消防报警资源数据
    commit('SET_FIRE_ALARM_RESOURCE_ARR', arr)
  },
  setFireAlarmFeatures({
    commit
  }, features) { // 设置消防报警要素
    commit('SET_FIRE_ALARM_FEATURES', features)
  },
  setFireAlarmLabelFeatures({
    commit
  }, features) { // 设置消防报警名称要素
    commit('SET_FIRE_ALARM_LABEL_FEATURES', features)
  },
  setAlarmHostResources({
    commit
  }, arr) { // 设置报警主机资源数据
    commit('SET_ALARM_HOST_RESOURCE_ARR', arr)
  },
  setAlarmHostFeatures({
    commit
  }, features) { // 设置报警主机要素
    commit('SET_ALARM_HOST_FEATURES', features)
  },
  setAlarmHostLabelFeatures({
    commit
  }, features) { // 设置报警主机名称要素
    commit('SET_ALARM_HOST_LABEL_FEATURES', features)
  },
  setAlarmColumnResources({
    commit
  }, arr) { // 设置报警柱资源数据
    commit('SET_ALARM_COLUMN_RESOURCE_ARR', arr)
  },
  setAlarmColumnFeatures({
    commit
  }, features) { // 设置报警柱要素
    commit('SET_ALARM_COLUMN_FEATURES', features)
  },
  setAlarmColumnLabelFeatures({
    commit
  }, features) { // 设置报警柱名称要素
    commit('SET_ALARM_COLUMN_LABEL_FEATURES', features)
  },
  setAlarmBoxResources({
    commit
  }, arr) { // 设置报警箱资源数据
    commit('SET_ALARM_BOX_RESOURCE_ARR', arr)
  },
  setAlarmBoxFeatures({
    commit
  }, features) { // 设置报警箱要素
    commit('SET_ALARM_BOX_FEATURES', features)
  },
  setAlarmBoxLabelFeatures({
    commit
  }, features) { // 设置报警箱名称要素
    commit('SET_ALARM_BOX_LABEL_FEATURES', features)
  },
  get2DSelectBoxData({
    state,
    commit
  }, playod) { // 框选
    return new Promise((resolve, reject) => {
      get2DSelectBoxDataApi(playod)
        .then(res => {
          let [...openedPointList] = res.data.resource
          openedPointList = openedPointList.filter(item => {
            return item.eid.deviceStatus === 1 && item.status === 1
          })
          if (mapIndex.state.isPlatformTrack) {
            openedPointList.map(item => {
              commit('PUSH_PLAYBACK_VIDEO_DATA_LIST', item)
            })
          } else {
            openedPointList.map(item => {
              commit('PUSH_VIDEO_DATA_LIST', item)
            })
          }
          // res.data.security.map(item => {
          // commit('PUSH_VIDEO_DATA_LIST', item)
          // })
          if (res.data.security) {
            commit('SET_SELECT_BOX_SINGLE_DATA', res.data.security)
          }
          resolve(res.data.resource)
        })
        .catch(err => reject(err))
    })
  },
  setMapPreviewPointList({ // 设置预览视频列表
    commit
  }, data) {
    commit('SET_PREVIEW_POINT_LIST', data)
  },
  setMapPlaybackPointList({ // 设置回放视频列表
    commit
  }, data) {
    commit('SET_PLAYBACK_POINT_LIST', data)
  },
  setSelect2DSingleList({
    commit
  }, data) {
    commit('SET_SELECT_BOX_SINGLE_DATA', data)
  },
  setSingleFeatures({
    commit
  }, features) { // 设置单兵要素
    commit('SET_SINGLE_FEATURES', features)
  },
  clearPointFeatures({
    commit
  }) { // 清空点位要素
    commit('SET_BOLTIPC_RESOURCE_ARR', []) // 枪机
    commit('SET_BOLTIPC_FEATURES', [])
    commit('SET_BOLTIPC_SECTOR_FEATURES', [])
    commit('SET_BOLTIPC_LABEL_FEATURES', [])
    commit('SET_HALFBALLIPC_RESOURCE_ARR', []) // 半球
    commit('SET_HALFBALLIPC_FEATURES', [])
    commit('SET_HALFBALLIPC_SECTOR_FEATURES', [])
    commit('SET_HALFBALLIPC_LABEL_FEATURES', [])
    commit('SET_FASTBALLIPC_RESOURCE_ARR', []) // 快球
    commit('SET_FASTBALLIPC_FEATURES', [])
    commit('SET_FASTBALLIPC_SECTOR_FEATURES', [])
    commit('SET_FASTBALLIPC_LABEL_FEATURES', [])
    commit('SET_ALLVIEWIPC_RESOURCE_ARR', []) // 全景
    commit('SET_ALLVIEWIPC_FEATURES', [])
    commit('SET_ALLVIEWIPC_SECTOR_FEATURES', [])
    commit('SET_ALLVIEWIPC_LABEL_FEATURES', [])
    commit('SET_REDBOLTIPC_RESOURCE_ARR', []) // 红外枪机
    commit('SET_REDBOLTIPC_FEATURES', [])
    commit('SET_REDBOLTIPC_SECTOR_FEATURES', [])
    commit('SET_REDBOLTIPC_LABEL_FEATURES', [])
    commit('SET_VERFACEIPC_RESOURCE_ARR', []) // 人脸抓拍
    commit('SET_VERFACEIPC_FEATURES', [])
    commit('SET_VERFACEIPC_SECTOR_FEATURES', [])
    commit('SET_VERFACEIPC_LABEL_FEATURES', [])
    commit('SET_TRAFFICIPC_RESOURCE_ARR', []) // 交通抓拍
    commit('SET_TRAFFICIPC_FEATURES', [])
    commit('SET_TRAFFICIPC_SECTOR_FEATURES', [])
    commit('SET_TRAFFICIPC_LABEL_FEATURES', [])
    commit('SET_COMMON_ALARM_RESOURCE_ARR', []) // 普通报警
    commit('SET_COMMON_ALARM_FEATURES', [])
    commit('SET_COMMON_ALARM_LABEL_FEATURES', [])
    commit('SET_FIRE_ALARM_RESOURCE_ARR', []) // 消防报警
    commit('SET_FIRE_ALARM_FEATURES', [])
    commit('SET_FIRE_ALARM_LABEL_FEATURES', [])
    commit('SET_ALARM_HOST_RESOURCE_ARR', []) // 报警主机
    commit('SET_ALARM_HOST_FEATURES', [])
    commit('SET_ALARM_HOST_LABEL_FEATURES', [])
    commit('SET_ALARM_COLUMN_RESOURCE_ARR', []) // 报警柱
    commit('SET_ALARM_COLUMN_FEATURES', [])
    commit('SET_ALARM_COLUMN_LABEL_FEATURES', [])
    commit('SET_ALARM_BOX_RESOURCE_ARR', []) // 报警箱
    commit('SET_ALARM_BOX_FEATURES', [])
    commit('SET_ALARM_BOX_LABEL_FEATURES', [])
    commit('SET_PATROL_RESOURCE_ARR', []) // 巡更
    commit('SET_PATROL_FEATURES', [])
    commit('SET_PATROL_LABEL_FEATURES', [])
    commit('SET_DOORCONTROL_RESOURCE_ARR', []) // 门禁
    commit('SET_DOORCONTROL_FEATURES', [])
    commit('SET_DOORCONTROL_LABEL_FEATURES', [])
    commit('SET_SINGLE_FEATURES', []) // 单兵
    commit('SET_LOCATE_FEATURES', []) // 高亮定位
  },
  setPointDrawActive({
    commit
  }, flag) { // 设置点位绘制激活状态
    commit('SET_POINT_DRAW_ACTIVE', flag)
  },
  setSelectedMapPointRes({
    commit
  }, data) { // 设置地图选中的资源点位
    commit('SET_SELECTED_MAP_POINT_RES', data)
  },
  queryDefaultIconByOid({
    commit
  }, oid) { // 根据oid查询点位默认图标
    return new Promise((resolve, reject) => {
      queryDefaultIconByOidApi(oid).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  saveCommonPointRes({
    commit
  }, playod) { // 保存点位资源数据
    return new Promise((resolve, reject) => {
      saveCommonPointResApi(playod).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  savePatrolPointRes({
    commit
  }, playod) { // 保存巡更点位资源数据
    return new Promise((resolve, reject) => {
      savePatrolPointResApi(playod).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  deletePatrolPointRes({
    commit
  }, playod) { // 删除巡更点位资源数据
    return new Promise((resolve, reject) => {
      deletePatrolPointResApi(playod).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  get2DPatrolCountInfo({
    commit
  }, patrolId) { // 巡更点位资源数据
    return new Promise((resolve, reject) => {
      get2DPatrolCountInfoApi(patrolId).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  deleteDoorControlPointRes({
    commit,
    state
  }, resId) { // 删除门禁点位资源数据
    return new Promise((resolve, reject) => {
      let dcTree = window.localStorage.getItem('dcTree')
      if (dcTree) {
        let treeData = JSON.parse(dcTree)
        if (treeData && treeData.length > 0) {
          let resArr = JSON.parse(JSON.stringify(treeData[0].children))
          let target = null
          for (let res of resArr) {
            if (res._id === resId) {
              delete res.point
              target = res
              break
            }
          }
          treeData[0].children = resArr
          window.localStorage.setItem('dcTree', JSON.stringify(treeData))
          resolve(target)
        }
      }
    })
  },
  addDoorControlPointRes({
    commit,
    state
  }, data) { // 添加门禁点位资源数据
    return new Promise((resolve, reject) => {
      let dcTree = window.localStorage.getItem('dcTree')
      if (dcTree) {
        let treeData = JSON.parse(dcTree)
        if (treeData && treeData.length > 0) {
          let resArr = JSON.parse(JSON.stringify(treeData[0].children))
          let target = null
          for (let index = 0; index < resArr.length; index++) {
            if (data._id === resArr[index]._id) {
              resArr.splice(index, 1)
              resArr.splice(index, 0, data)
              target = data
              break
            }
          }
          treeData[0].children = resArr
          window.localStorage.setItem('dcTree', JSON.stringify(treeData))
          resolve(target)
        }
      }
    })
  },
  updateDoorControlPointRes({
    commit,
    state
  }, data) { // 更新门禁点位资源数据
    return new Promise((resolve, reject) => {
      let dcTree = window.localStorage.getItem('dcTree')
      if (dcTree) {
        let treeData = JSON.parse(dcTree)
        if (treeData && treeData.length > 0) {
          let resArr = JSON.parse(JSON.stringify(treeData[0].children))
          let target = null
          for (let index = 0; index < resArr.length; index++) {
            if (data._id === resArr[index]._id) {
              resArr.splice(index, 1)
              resArr.splice(index, 0, data)
              target = data
              break
            }
          }
          treeData[0].children = resArr
          window.localStorage.setItem('dcTree', JSON.stringify(treeData))
          resolve(target)
        }
      }
    })
  },
  getDoorControlPointResById({
    commit,
    state
  }, resId) { // 获取门禁点位资源数据
    return new Promise((resolve, reject) => {
      let dcTree = window.localStorage.getItem('dcTree')
      if (dcTree) {
        let target = null
        let treeData = JSON.parse(dcTree)
        if (treeData && treeData.length > 0) {
          let resArr = JSON.parse(JSON.stringify(treeData[0].children))
          for (let res of resArr) {
            if (res._id === resId) {
              target = res
              break
            }
          }
        }
        resolve(target)
      }
    })
  },
  saveTrackingRecord({ commit, state }, param) {
    return new Promise((resolve, reject) => {
      putTracking(param._id, param).then((res) => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  clearTrackVideoDataList({ state, commit }, data) { // 【接力追踪】事件关流清空
    let _data = JSON.parse(JSON.stringify(state.playbackPointList))
    _data.forEach(e => {
      e.checked = false
    })
    commit('SET_PLAYBACK_TRACK_VODEO_LIST', [])
    commit('SET_PLAYBACK_POINT_LIST', _data)
    commit('SET_VIDEO_CHECKED_NUM', 0)
  },
  updateSingleAttrPos({ state, commit }, position) { // 更新单兵属性面板的位置信息
    commit('UPDATE_SINGLE_ATTR_POS', position)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
