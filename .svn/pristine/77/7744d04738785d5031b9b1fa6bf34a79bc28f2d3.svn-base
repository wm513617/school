import SymbolConfig from './SymbolConfig.js'
import DrawSymbol from './DrawSymbol.js'
import STATE from './state.js'
// 地图模式
const MAPMODE = {
  mode2D: '2D', // 2D地图
  point2D: 'point', // 2D地图点位信息字段
  mode3D: '3D', // 3D地图
  point3D: 'point3D' // 3D地图点位信息字段
}
//  胡红勋--2018-09-5
// 视频点位类型
const VEDIOTYPE = {
  boltipc: 'boltipc',
  redBoltipc: 'redBoltipc',
  halfBallipc: 'halfBallipc',
  fastBallipc: 'fastBallipc',
  allViewipc: 'allViewipc'
}

// 视频点位类型key值
const VEDIOTYPEKEY = {
  boltipc: 0,
  redBoltipc: 1,
  halfBallipc: 2,
  fastBallipc: 3,
  allViewipc: 4
}

const CHANNELTYPE = {
  vedioResource: 0, // 视频
  commonAlarmResource: 1, // 普通报警
  fireAlarmResource: 11, // 消防报警
  alarmHostResource: 9, // 报警主机报警
  alarmBoxResource: 'alarmBox', // 报警箱
  alarmColumnResource: 'alarmPillar', // 报警柱
  patrol: 'patrol', // 巡更
  single: 'single', // 单兵
  assist: 'assist', // 辅助
  building: 'building', // 楼宇
  floor: 'storey', // 楼层
  grid: 'grid' // 网格
}
// 模型资源标识
const MODELOID = {
  video: '0', // 视频
  videoArr: ['0', '00', '01', '02', '03', '04'], // 视频数组
  boltipc: '00', // 枪机
  redBoltipc: '01', // 红外枪机
  halfBallipc: '02', // 半球
  fastBallipc: '03', // 快球
  allViewipc: '04', // 全景
  alarm: '1', // 报警
  alarmArr: ['1', '10', '90', '110'], // 报警数组
  commonAlarm: '10', // 普通报警
  alarmHost: '90', // 报警主机
  fireAlarm: '110', // 消防报警
  alarmHelp: '13', // 报警求助
  alarmHelpArr: ['13', '130', '129'], // 报警求助数组
  alarmBox: '130', // 报警箱
  alarmColumn: '129', // 报警柱
  patrol: '14', // 巡更
  patrolArr: ['14', '140', '141'], // 巡更数组
  commonPatrol: '140', // 常规巡更
  cluasterPatrol: '141', // 聚合巡更
  single: '151', // 单兵
  singleArr: ['15', '151'], // 单兵数组
  assist: '161', // 辅助
  assistArr: ['16', '161'] // 辅助数组
}
// 资源状态
const RESOURCESTATUS = {
  online: 'online', // 在线
  offline: 'offline', // 离线
  offlineColor: '#808080', // 离线
  alarm: 'alarm', // 报警
  alarmColor: '#ff0000', // 报警颜色
  unuse: 'stopped', // 停用
  unuseColor: '#101010', // 停用颜色
  twinkleStep: 5, // 闪烁间隔
  colorAmount: 0.7,
  deltaXStep: 5, // X轴方向间隔（单位：米）
  deltaYStep: 5 // Y轴方向间隔（单位：米）
}
// 设备资源类型，用于区分视频设备和报警求助设备
const TABTYPE = {
  video: 'video',
  alarmHelp: 'alarmHelp'
}
// 3D视图默认方位参数
const TDDEFAULTOPS = {
  singleDefaultImg: '/static/noSolider.jpg',
  singleDefaultScale: 0.075, // 单兵默认大小
  singleDefaultHeight: 13, // 单兵默认高度
  singleHeadDeltaHeight: 30, // 单兵头像高度差值
  locateHeading: -90, // 定位朝向角度
  locatePitch: -15, // 定位俯仰角度
  locateRoll: 0, // 定位滚动角度
  locateHeight: 50, // 定位高度
  minCameraHeight: 10, // 最小相机视角高度
  maxCameraHeight: 2000, // 最大相机视角高度
  trackPointHeight: 20, // 轨迹点位的高度
  entityMinShowHeight: 0, // 实体最小显示高度
  entityMaxShowHeight: 1000 // 实体最大显示高度
}
// 视角模式
const VIEWMODE = {
  tracklook: 0,
  followlook: 1,
  overlook: 2
}
// 点位类型
const pointTypes = { vedio: '0', commonAlarm: '1,9', fireAlarm: '11' }
// 点位类型实体分类
var entitys = { commonAlarm: [], fireAlarm: [], alarm: [], patrol: [], singel: [], alarmBox: [], alarmColumn: [], labels: [], vedio: [], alarmHelp: [], pole: [] }

/**
 * 获取点位实体类型
 * @returns
 */
function getKeyType() {
  let obj = {}
  for (let key in entitys) {
    obj[key] = key
  }
  return obj
}

/**
 * 根据标识获取视频实体
 * @param {*} id
 * @returns
 */
function getVedioEntityById(id) {
  let _entity = null
  if (entitys.vedio.length) {
    for (let index in entitys.vedio) {
      let entity = entitys.vedio[index]
      if (entity.id === id) {
        _entity = entity
      }
      if (_entity) {
        break
      }
    }
  }
  return _entity
}

/**
 * 根据类型获取报警柱或报警箱
 * @param {*} res 报警求助设备数据
 * @param {*} type 类型（报警柱或报警箱）
 * @returns
 */
function getAlarmBoxOrColumnByType(res, type) {
  let result = []
  res.forEach(elem => {
    if (elem.eid.type === type) {
      result.push(elem)
    }
  })
  return result
}

// 将资源类型转换为字符串表示形式----胡红勋添加 -2018-9-5
function convertChannelTypeToString(type) {
  let channelType = null
  switch (type) {
    case CHANNELTYPE.vedioResource:
      channelType = 'vedioChannel'
      break
    case CHANNELTYPE.commonAlarmResource:
      channelType = 'commonAlarm'
      break
    case CHANNELTYPE.fireAlarmResource:
      channelType = 'fireAlarm'
      break
    case CHANNELTYPE.alarmHostResource:
      channelType = 'alarmHost'
      break
    case CHANNELTYPE.alarmBoxResource:
      channelType = 'alarmBox'
      break
    case CHANNELTYPE.alarmColumnResource:
      channelType = 'alarmColumn'
      break
  }
  return channelType
}

function _isString(str) {
  return (typeof str === 'string') && (str.constructor === String)
}

/**
 * 根据点位类型的key值  将点位的数字类型转换成字符串类型
 * @param {*} typeKey 点位类型的key值
 */
function getVedioTypeByIpcKey(typeKey) {
  let vedioType = null
  switch (typeKey) {
    case VEDIOTYPEKEY.boltipc:
      vedioType = VEDIOTYPE.boltipc
      break
    case VEDIOTYPEKEY.redBoltipc:
      vedioType = VEDIOTYPE.redBoltipc
      break
    case VEDIOTYPEKEY.halfBallipc:
      vedioType = VEDIOTYPE.halfBallipc
      break
    case VEDIOTYPEKEY.fastBallipc:
      vedioType = VEDIOTYPE.fastBallipc
      break
    case VEDIOTYPEKEY.allViewipc:
      vedioType = VEDIOTYPE.allViewipc
      break
  }
  return vedioType
}

// 巡更状态-----
const PATROL_STATUS = {
  alarming: 'alarming', // 报警
  repair: 'repair', // 维修
  patrolled: 'patrolled', // 已巡更
  timeout: 'timeout', // 超时
  waitpatrol: 'waitpatrol' // 待巡更
}

/**
 * 编辑模式，加载已入库点位时，点位的样式
 * 根据视频点位类型key值  获取已保存点位的样式
 * @param {*} typeKey 点位类型的key值
 */
function getVedioSymbolByIpcKey(typeKey) {
  let vedioType = null
  let isStr = _isString(typeKey)
  if (!isStr) {
    vedioType = getVedioTypeByIpcKey(typeKey)
  } else {
    vedioType = typeKey
  }
  let symbol = null
  switch (vedioType) {
    case VEDIOTYPE.boltipc:
      symbol = SymbolConfig.boltSaveSymbol
      break
    case VEDIOTYPE.redBoltipc:
      symbol = SymbolConfig.redBoltSaveSymbol
      break
    case VEDIOTYPE.halfBallipc:
      symbol = SymbolConfig.halfBallSaveSymbol
      break
    case VEDIOTYPE.fastBallipc:
      symbol = SymbolConfig.fastBallSaveSymbol
      break
    case VEDIOTYPE.allViewipc:
      symbol = SymbolConfig.allViewSaveSymbol
      break
  }
  return symbol
}

/**
 * 根据点位的类型(数字或者字符串)，获取该点位类型在编辑状态下的图标---
 * @param {*} typeKey 点位类型的key值
 */
function getVedioEditSymbolByIpcKey(typeKey) {
  let vedioType = null
  let isStr = _isString(typeKey)
  if (!isStr) {
    vedioType = getVedioTypeByIpcKey(typeKey)
  } else {
    vedioType = typeKey
  }
  let symbol = null
  switch (vedioType) {
    case VEDIOTYPE.boltipc:
      symbol = SymbolConfig.boltEditSymbol
      break
    case VEDIOTYPE.redBoltipc:
      symbol = SymbolConfig.redBoltEditSymbol
      break
    case VEDIOTYPE.halfBallipc:
      symbol = SymbolConfig.halfBallEditSymbol
      break
    case VEDIOTYPE.fastBallipc:
      symbol = SymbolConfig.fastBallEditSymbol
      break
    case VEDIOTYPE.allViewipc:
      symbol = SymbolConfig.allViewEditSymbol
      break
  }
  return symbol
}

/**
 * 编辑模式，添加点位时，点位的样式
 * 根据视频点位类型key值  获取未保存点位的样式
 * @param {*} typeKey 点位类型的key值
 */
function getVedioUnSSymbolByIpcKey(typeKey) {
  let vedioType = getVedioTypeByIpcKey(typeKey)
  let symbol = null
  switch (vedioType) {
    case VEDIOTYPE.boltipc:
      symbol = SymbolConfig.boltUnSSymbol
      break
    case VEDIOTYPE.redBoltipc:
      symbol = SymbolConfig.redBoltUnSSymbol
      break
    case VEDIOTYPE.halfBallipc:
      symbol = SymbolConfig.halfBallUnSSymbol
      break
    case VEDIOTYPE.fastBallipc:
      symbol = SymbolConfig.fastBallUnSSymbol
      break
    case VEDIOTYPE.allViewipc:
      symbol = SymbolConfig.allViewUnSSymbol
      break
  }
  return symbol
}

/**
 * 编辑模式，点击节点添加点位时draw控件的样式
 * 根据点位类型key值  获取draw控件在地图上绘制时的样式
 * @param {*} typeKey 点位类型
 */
function getDrawSymbolByIpcKey(typeKey) {
  let vedioType = getVedioTypeByIpcKey(typeKey)
  let symbol = null
  switch (vedioType) {
    case VEDIOTYPE.boltipc:
      symbol = DrawSymbol.boltAddDrawSymbol
      break
    case VEDIOTYPE.redBoltipc:
      symbol = DrawSymbol.redBoltAddDrawSymbol
      break
    case VEDIOTYPE.halfBallipc:
      symbol = DrawSymbol.halfBallAddDrawSymbol
      break
    case VEDIOTYPE.fastBallipc:
      symbol = DrawSymbol.fastBallAddDrawSymbol
      break
    case VEDIOTYPE.allViewipc:
      symbol = DrawSymbol.allViewAddDrawSymbol
      break
  }
  return symbol
}

/**
 * 根据点位类型和状态 获取点位对应的样式
 * @param {*} ipcType 点位类型
 */
function getVedioSymbolByIpcTypeAndState(ipcType, state) {
  let vedioType = null
  let isStr = _isString(ipcType)
  if (!isStr) {
    vedioType = getVedioTypeByIpcKey(ipcType)
  } else {
    vedioType = ipcType
  }
  let symbol = null
  switch (vedioType) {
    case VEDIOTYPE.boltipc:
      if (state === STATE.SAVE) {
        symbol = SymbolConfig.boltSaveSymbol
      } else if (state === STATE.EDIT) {
        symbol = SymbolConfig.boltEditSymbol
      } else {
        symbol = SymbolConfig.boltUnSSymbol
      }
      break
    case VEDIOTYPE.redBoltipc:
      if (state === STATE.SAVE) {
        symbol = SymbolConfig.redBoltSaveSymbol
      } else if (state === STATE.EDIT) {
        symbol = SymbolConfig.redBoltEditSymbol
      } else {
        symbol = SymbolConfig.redBoltUnSSymbol
      }
      break
    case VEDIOTYPE.halfBallipc:
      if (state === STATE.SAVE) {
        symbol = SymbolConfig.halfBallSaveSymbol
      } else if (state === STATE.EDIT) {
        symbol = SymbolConfig.halfBallEditSymbol
      } else {
        symbol = SymbolConfig.halfBallUnSSymbol
      }
      break
    case VEDIOTYPE.fastBallipc:
      if (state === STATE.SAVE) {
        symbol = SymbolConfig.fastBallSaveSymbol
      } else if (state === STATE.EDIT) {
        symbol = SymbolConfig.fastBallEditSymbol
      } else {
        symbol = SymbolConfig.fastBallUnSSymbol
      }
      break
    case VEDIOTYPE.allViewipc:
      if (state === STATE.SAVE) {
        symbol = SymbolConfig.allViewSaveSymbol
      } else if (state === STATE.EDIT) {
        symbol = SymbolConfig.allViewEditSymbol
      } else {
        symbol = SymbolConfig.allViewUnSSymbol
      }
      break
  }
  return symbol
}

/**
 * 根据点位类型和点位的状态获取设备样式
 * @param {*} ipcType 点位类型
 * @param {*} state 1代表在线，0代表离线
 */
function getStorageVedioSymbolByIpcTypeAndState(ipcType, state) {
  let vedioType = null
  let isStr = _isString(ipcType)
  if (!isStr) {
    vedioType = getVedioTypeByIpcKey(ipcType)
  } else {
    vedioType = ipcType
  }
  let symbol = null
  switch (vedioType) {
    case VEDIOTYPE.boltipc:
      if (state === 1) {
        symbol = SymbolConfig.boltVedioOnlineSymbol
      } else {
        symbol = SymbolConfig.boltVedioOfflineSymbol
      }
      break
    case VEDIOTYPE.redBoltipc:
      if (state === 1) {
        symbol = SymbolConfig.redBoltVedioOnlineSymbol
      } else {
        symbol = SymbolConfig.redBoltVedioOfflineSymbol
      }
      break
    case VEDIOTYPE.halfBallipc:
      if (state === 1) {
        symbol = SymbolConfig.halfBallVedioOnlineSymbol
      } else {
        symbol = SymbolConfig.halfBallVedioOfflineSymbol
      }
      break
    case VEDIOTYPE.fastBallipc:
      if (state === 1) {
        symbol = SymbolConfig.fastBallVedioOnlineSymbol
      } else {
        symbol = SymbolConfig.fastBallVedioOfflineSymbol
      }
      break
    case VEDIOTYPE.allViewipc:
      if (state === 1) {
        symbol = SymbolConfig.allViewVedioOnlineSymbol
      } else {
        symbol = SymbolConfig.allViewVedioOfflineSymbol
      }
      break
  }
  return symbol
}

// 胡红勋 20180907
function getAlarmDrawSymol() {
  return DrawSymbol.alarmPointDrawSymbol
}

// 获取报警点位状态----在线，离线，报警，布防，撤防
function getAlarmStateByKey(key) {
  let state = null
  switch (key) {
    case 1:
      state = STATE.ONLINE
      break
    case 0:
      state = STATE.OFFLINE
      break
    case 2:
      state = STATE.ARMIMG
      break
    case 3:
      state = STATE.UNARM
      break
    case 4:
      state = STATE.ALARMIMG
      break
  }
  return state
}

/**
 * 根据报警点位状态获取报警点位样式
 * @param {*} state
 */
function getAlarmPointSymbolByState(alarmS) {
  let state = null
  let isStr = _isString(alarmS)
  if (!isStr) {
    state = getAlarmStateByKey(alarmS)
  } else {
    state = alarmS
  }
  let symbol = null
  switch (state) {
    case STATE.ONLINE:
      symbol = SymbolConfig.alarmPointOnlineSymbol
      break
    case STATE.OFFLINE:
      symbol = SymbolConfig.alarmPointOfflineSymbol
      break
    case STATE.ARMIMG:
      symbol = SymbolConfig.alarmPointArmSymbol
      break
    case STATE.UNARM:
      symbol = SymbolConfig.alarmPointUnarmSymbol
      break
    case STATE.ALARMIMG:
      symbol = SymbolConfig.alarmPointAlarmSymbol
      break
  }
  return symbol
}

// 根据编辑模式下巡更点的保存、未保存状态、编辑状态，获取相对应的图标----
function getPatrolSymbolByState(state) {
  let symbol = null
  if (state === STATE.SAVE) {
    symbol = SymbolConfig.patrolSaveSymbol
  }
  if (state === STATE.EDIT) {
    symbol = SymbolConfig.patrolEditSymbol
  }
  if (state === STATE.DRAW) {
    symbol = SymbolConfig.patrolUnSSymbol
  }
  return symbol
}

/**
 *根据key值获取巡更点位的状态,编辑模式
 */
function getPatrolStatusByKey(key) {
  let status = null
  switch (key) {
    case 1:
      status = PATROL_STATUS.alarming // 报警
      break
    case 2:
      status = PATROL_STATUS.repair // 维修
      break
    case 3:
      status = PATROL_STATUS.patrolled // 已巡更
      break
    case 4:
      status = PATROL_STATUS.timeout // 超时
      break
    case 5:
      status = PATROL_STATUS.waitpatrol // 待巡更
      break
  }
  return status
}

/**
 * 根据巡更点位的状态获取样式应用模式
 */
function getPatrolSymbolByStatus(state) {
  let status = null
  let symbol = null
  let isStr = _isString(state)
  if (!isStr) {
    status = getPatrolStatusByKey(state)
  } else {
    status = state
  }
  switch (status) {
    case PATROL_STATUS.alarming:
      symbol = SymbolConfig.patrolAlarmSymbol
      break
    case PATROL_STATUS.repair:
      symbol = SymbolConfig.patrolRepairSymbol
      break
    case PATROL_STATUS.patrolled:
      symbol = SymbolConfig.patroledSymbol
      break
    case PATROL_STATUS.timeout:
      symbol = SymbolConfig.patrolTimeoutSymbol
      break
    case PATROL_STATUS.waitpatrol:
      symbol = SymbolConfig.patrolWaitSymbol
      break
  }
  return symbol
}

export default {
  MAPMODE,
  CHANNELTYPE,
  VEDIOTYPEKEY,
  MODELOID,
  RESOURCESTATUS,
  TABTYPE,
  VIEWMODE,
  getAlarmDrawSymol,
  convertChannelTypeToString,
  getVedioTypeByIpcKey,
  getVedioSymbolByIpcKey,
  getVedioEditSymbolByIpcKey,
  getVedioUnSSymbolByIpcKey,
  getDrawSymbolByIpcKey,
  getStorageVedioSymbolByIpcTypeAndState,
  getAlarmStateByKey,
  getAlarmPointSymbolByState,
  getPatrolStatusByKey,
  getPatrolSymbolByState,
  getPatrolSymbolByStatus,
  entitys,
  pointTypes,
  getKeyType,
  getAlarmBoxOrColumnByType,
  TDDEFAULTOPS,
  getVedioEntityById,
  getVedioSymbolByIpcTypeAndState
}
