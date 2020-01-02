import SymbolConfig from '../SymbolConfig.js'
import DrawSymbol from '../DrawSymbol.js'
import STATE from './state.js'
import {
  VariableTypes
} from '../MapUtil.js'
import {
  GeometryType
} from '../GeometryType'
import {
  toMercator,
  toWgs84
} from '@turf/projection'
import {
  point
} from '@turf/helpers'
//  胡红勋--2018-09-5
const CHANNELTYPE = {
  vedioResource: 0,
  commonAlarmResource: 1,
  fireAlarmResource: 11,
  alarmHostResource: 9,
  alarmBoxResource: 14,
  alarmColumnResource: 13,
  patrol: 'patrol',
  single: 'single'
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

// 报警点位类型key值
const ALARMTYPEKEY = {
  point: 0,
  lineString: 1,
  polygon: 2
}

// 报警点位类型
const ALARMTYPE = {
  point: 'Point',
  lineString: 'LineString',
  polygon: 'Polygon' // 面
}
// 巡更状态-----
const PATROL_STATUS = {
  alarming: 'alarming', // 报警
  repair: 'repair', // 维修
  patrolled: 'patrolled', // 已巡更
  timeout: 'timeout', // 超时
  waitpatrol: 'waitpatrol' // 待巡更
}
// 将点位的数字类型转换成字符串类型
/**
 * 根据点位类型的key值  获取点位的类型
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
/**
 * 编辑模式，加载已入库点位时，点位的样式
 * 根据视频点位类型key值  获取已保存点位的样式
 * @param {*} typeKey 点位类型的key值
 */
function getVedioSymbolByIpcKey(typeKey) {
  let vedioType = null
  let isStr = VariableTypes.isString(typeKey)
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
 * 编辑模式，加载编辑状态点位的样式
 * 根据视频点位类型key值  获取编辑状态点位的样式
 * @param {*} typeKey 点位类型的key值
 */
function getVedioEditSymbolByIpcKey(typeKey) {
  let vedioType = null
  let isStr = VariableTypes.isString(typeKey)
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
 * 根据点位类型key值  获取draw控件的样式key值
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
 * 编辑点位位置时,draw控件对应的样式
 * (两种：编辑已保存点位、编辑未保存点位)
 * 根据点位类型和状态 获取draw控件的样式
 * @param {*} ipcType 点位类型
 * @param {*} state 点位状态（save,draw,edit,select）
 */
// function getDrawSymbolByIpcTypeAndState (ipcType, state) {
//   let vedioType = null
//   let isStr = VariableTypes.isString(ipcType)
//   if (!isStr) {
//     vedioType = getVedioTypeByIpcKey(ipcType)
//   } else {
//     vedioType = ipcType
//   }
//   let symbol = null
//   switch (vedioType) {
//     case VEDIOTYPE.boltipc:
//       if (state === STATE.EDIT) {
//         symbol = DrawSymbol.boltEditDrawSymbol
//       } else {
//         symbol = DrawSymbol.boltEditUnSDrawSymbol
//       }
//       break
//     case VEDIOTYPE.redBoltipc:
//       if (state === STATE.EDIT) {
//         symbol = DrawSymbol.redBoltEditDrawSymbol
//       } else {
//         symbol = DrawSymbol.redBoltEditUnSDrawSymbol
//       }
//       break
//     case VEDIOTYPE.halfBallipc:
//       if (state === STATE.EDIT) {
//         symbol = DrawSymbol.halfBallEditDrawSymbol
//       } else {
//         symbol = DrawSymbol.halfBallEditUnSDrawSymbol
//       }
//       break
//     case VEDIOTYPE.fastBallipc:
//       if (state === STATE.EDIT) {
//         symbol = DrawSymbol.fastBallEditDrawSymbol
//       } else {
//         symbol = DrawSymbol.fastBallEditUnSDrawSymbol
//       }
//       break
//     case VEDIOTYPE.allViewipc:
//       if (state === STATE.EDIT) {
//         symbol = DrawSymbol.allViewEditDrawSymbol
//       } else {
//         symbol = DrawSymbol.allViewEditUnSDrawSymbol
//       }
//       break
//   }
//   return symbol
// }
/**
 * 根据点位类型和状态 获取点位对应的样式
 * @param {*} ipcType 点位类型
 */
function getVedioSymbolByIpcTypeAndState(ipcType, state) {
  let vedioType = null
  let isStr = VariableTypes.isString(ipcType)
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
// function getVedioSymbolByIpcTypeAndState (ipcType, state) {
//   let vedioType = null
//   let isStr = VariableTypes.isString(ipcType)
//   if (!isStr) {
//     vedioType = getVedioTypeByIpcKey(ipcType)
//   } else {
//     vedioType = ipcType
//   }
//   let symbol = null
//   switch (vedioType) {
//     case VEDIOTYPE.boltipc:
//       if (state === STATE.SAVE) {
//         symbol = SymbolConfig.boltSaveSymbol
//       } else if (state === STATE.EDIT) {
//         symbol = SymbolConfig.boltEditSymbol
//       } else {
//         symbol = SymbolConfig.boltUnSSymbol
//       }
//       break
//     case VEDIOTYPE.redBoltipc:
//       if (state === STATE.SAVE) {
//         symbol = SymbolConfig.redBoltSaveSymbol
//       } else if (state === STATE.EDIT) {
//         symbol = SymbolConfig.redBoltEditSymbol
//       } else {
//         symbol = SymbolConfig.redBoltUnSSymbol
//       }
//       break
//     case VEDIOTYPE.halfBallipc:
//       if (state === STATE.SAVE) {
//         symbol = SymbolConfig.halfBallUnSSymbol
//       } else if (state === STATE.EDIT) {
//         symbol = SymbolConfig.halfBallEditSymbol
//       } else {
//         symbol = SymbolConfig.halfBallSaveSymbol
//       }
//       break
//     case VEDIOTYPE.fastBallipc:
//       if (state === STATE.SAVE) {
//         symbol = SymbolConfig.fastBallUnSSymbol
//       } else if (state === STATE.EDIT) {
//         symbol = SymbolConfig.fastBallEditSymbol
//       } else {
//         symbol = SymbolConfig.fastBallSaveSymbol
//       }
//       break
//     case VEDIOTYPE.allViewipc:
//       if (state === STATE.SAVE) {
//         symbol = SymbolConfig.allViewUnSSymbol
//       } else if (state === STATE.EDIT) {
//         symbol = SymbolConfig.allViewEditSymbol
//       } else {
//         symbol = SymbolConfig.allViewSaveSymbol
//       }
//       break
//   }
//   return symbol
// }
/**
 * 根据点位类型和点位的状态获取设备样式
 * @param {*} ipcType 点位类型
 * @param {*} state 1代表在线，0代表离线
 */
function getStorageVedioSymbolByIpcTypeAndState(ipcType, state) {
  let vedioType = null
  let isStr = VariableTypes.isString(ipcType)
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
// 获取组成扇形的点
function getSectorPoints(config) {
  let {
    lon,
    lat,
    radius,
    sides,
    endAngle,
    startAngle
  } = config
  startAngle = startAngle || 0
  sides = sides || 60
  // radius = radius ? radius / 10000 : 0
  // startAngle = rotation + startAngle
  // radius = radius ? radius / 10000 : 0
  // startAngle = rotation + startAngle
  // radius = radius ? radius / 10000 : 0
  let angle = endAngle - startAngle
  // if (startAngle > 360) {
  //   startAngle = startAngle - 360
  // }
  if (angle === 360) {
    angle = 359.999
  }
  let origin = toMercator(point([lon, lat])).geometry.coordinates
  let anglePer = angle / sides
  let points = []
  // points.push(origin)
  points.push([lon, lat])
  for (let i = 0; i < sides; ++i) {
    let rotatedAngle = (i * anglePer + startAngle) * Math.PI / 180
    let cur = [origin[0] + radius * Math.cos(rotatedAngle), origin[1] + radius * Math.sin(rotatedAngle)]
    cur = toWgs84(cur)
    points.push(cur)
  }
  points.push(points[0])
  return points
}
// 获取组成扇形的点
function getCirclePoints(config) {
  let {
    lon,
    lat,
    radius,
    sides
  } = config
  sides = sides || 60
  radius = radius ? radius / 10000 : 0
  let origin = [lon, lat]
  let anglePer = 360 / sides
  let points = []
  for (let i = 0; i < sides; ++i) {
    let rotatedAngle = (i * anglePer) * Math.PI / 180
    let cur = [origin[0] + radius * Math.cos(rotatedAngle), origin[1] + radius * Math.sin(rotatedAngle)]
    points.push(cur)
  }
  points.push(points[0])
  return points
}
/**
 * 根据类型获取报警点位的类型
 * @param {*} key
 */
function getAlarmTypeByKey(key) {
  let alarmType = null
  switch (key) {
    case ALARMTYPEKEY.point:
      alarmType = ALARMTYPE.point
      break
    case ALARMTYPEKEY.lineString:
      alarmType = ALARMTYPE.lineString
      break
    case ALARMTYPEKEY.polygon:
      alarmType = ALARMTYPE.polygon
      break
  }
  return alarmType
}
/**
 * 根据报警类型获取 绘制报警控件的样式
 * @param {*} key
 */
function getDrawAlarmSymbolByType(key, flag) {
  let symbol = null
  let alarmType = null
  let isStr = VariableTypes.isString(key)
  if (!isStr) {
    alarmType = getAlarmTypeByKey(key)
  } else {
    alarmType = key
  }
  switch (alarmType) {
    case ALARMTYPE.point:
      if (flag) {
        symbol = DrawSymbol.fireAlarmPointDrawSymbol
      } else {
        symbol = DrawSymbol.alarmPointDrawSymbol
      }
      break
    case ALARMTYPE.lineString:
      symbol = DrawSymbol.alarmLineDrawSymbol
      break
    case ALARMTYPE.polygon:
      symbol = DrawSymbol.alarmPolygonDrawSymbol
      break
  }
  return symbol
}
// 胡红勋 20180907
function getAlarmDrawSymol() {
  return DrawSymbol.alarmPointDrawSymbol
}
/**
 * 编辑状态根据报警类型获取 报警设备的样式
 * @param {*} key
 */
function getAlarmSymbolByType(key, flag) {
  let symbol = null
  let alarmType = null
  let isStr = VariableTypes.isString(key)
  if (!isStr) {
    alarmType = getAlarmTypeByKey(key)
  } else {
    alarmType = key
  }
  switch (alarmType) {
    case ALARMTYPE.point:
      if (flag) {
        symbol = SymbolConfig.fireAlarmPointSymbol
      } else {
        symbol = SymbolConfig.alarmPointSaveSymbol
      }
      break
    case ALARMTYPE.lineString:
      symbol = SymbolConfig.alarmLineSaveSymbol
      break
    case ALARMTYPE.polygon:
      symbol = SymbolConfig.alarmPolygonSaveSymbol
      break
  }
  return symbol
}
/**
 * 应用模式根据报警类型获取 报警设备的样式
 */
function getAlarmSymbolByTypeInApp(key) {
  let symbol = null
  let alarmType = null
  let isStr = VariableTypes.isString(key)
  if (!isStr) {
    alarmType = getAlarmTypeByKey(key)
  } else {
    alarmType = key
  }
  switch (alarmType) {
    case ALARMTYPE.point:
      symbol = SymbolConfig.alarmPointOnlineSymbol
      break
    case ALARMTYPE.lineString:
      symbol = SymbolConfig.alarmLineSaveSymbol
      break
    case ALARMTYPE.polygon:
      symbol = SymbolConfig.alarmPolygonSaveSymbol
      break
  }
  return symbol
}
/**
 * 编辑模式，加载编辑状态报警元素的样式
 * 根据报警类型key值  获取编辑状态报警元素的样式
 * @param {*} typeKey 点位类型的key值
 */
function getAlarmEditSymbolByKey(typeKey, flag) {
  let alarmType = null
  let isStr = VariableTypes.isString(typeKey)
  if (!isStr) {
    alarmType = getAlarmTypeByKey(typeKey)
  } else {
    alarmType = typeKey
  }
  let symbol = null
  switch (alarmType) {
    case ALARMTYPE.point:
      if (flag) {
        symbol = SymbolConfig.fireAlarmPointEditSymbol
      } else {
        symbol = SymbolConfig.alarmPointEditSymbol
      }
      break
    case ALARMTYPE.lineString:
      symbol = SymbolConfig.alarmLineEditSymbol
      break
    case ALARMTYPE.polygon:
      symbol = SymbolConfig.alarmPolygonEditSymbol
      break
  }
  return symbol
}
/**
 * 编辑模式，根据报警类型获取高亮样式
 * @param {*} typeKey
 */
function getHLSymbolByKey(typeKey) {
  let alarmType = null
  let isStr = VariableTypes.isString(typeKey)
  if (!isStr) {
    alarmType = getAlarmTypeByKey(typeKey)
  } else {
    alarmType = typeKey
  }
  let symbol = null
  switch (alarmType) {
    case ALARMTYPE.point:
      symbol = SymbolConfig.alarmPointEditSymbol
      break
    case ALARMTYPE.lineString:
      symbol = SymbolConfig.alarmLineHLSymbol
      break
    case ALARMTYPE.polygon:
      symbol = SymbolConfig.alarmPolygonHLSymbol
      break
  }
  return symbol
}

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
function getAlarmPointSymbolByState(alarmS, flag) {
  let state = null
  let isStr = VariableTypes.isString(alarmS)
  if (!isStr) {
    state = getAlarmStateByKey(alarmS)
  } else {
    state = alarmS
  }
  let symbol = null
  switch (state) {
    case STATE.ONLINE:
      if (flag) {
        symbol = SymbolConfig.fireAlarmPointSymbol
      } else {
        symbol = SymbolConfig.alarmPointOnlineSymbol
      }
      break
    case STATE.OFFLINE:
      if (flag) {
        symbol = SymbolConfig.fireAlarmPointSymbol
      } else {
        symbol = SymbolConfig.alarmPointOfflineSymbol
      }
      break
    case STATE.ARMIMG:
      if (flag) {
        symbol = SymbolConfig.fireAlarmPointSymbol
      } else {
        symbol = SymbolConfig.alarmPointArmSymbol
      }
      break
    case STATE.UNARM:
      if (flag) {
        symbol = SymbolConfig.fireAlarmPointSymbol
      } else {
        symbol = SymbolConfig.alarmPointUnarmSymbol
      }
      break
    case STATE.ALARMIMG:
      symbol = SymbolConfig.alarmPointAlarmSymbol
      break
  }
  return symbol
}
/**
 * 根据报警类型（线、面）获取报警时的样式
 * @param {*} type
 */
function getAlarmingSymbolByType(type) {
  let symbol = null
  switch (type) {
    case GeometryType.POLYLINE:
      symbol = SymbolConfig.alarmLineAlarmSymbol
      break
    case GeometryType.POLYGON:
      symbol = SymbolConfig.alarmPolygonAlarmSymbol
      break
    case GeometryType.POINT:
      symbol = SymbolConfig.alarmPointAlarmSymbol
      break
  }
  return symbol
}

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
function getPatrolSymbolByStatusInApp(state) {
  let status = null
  let symbol = null
  let isStr = VariableTypes.isString(state)
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
  CHANNELTYPE,
  getAlarmDrawSymol,
  convertChannelTypeToString,
  getVedioTypeByIpcKey,
  getVedioSymbolByIpcKey,
  getVedioEditSymbolByIpcKey,
  getVedioUnSSymbolByIpcKey,
  getDrawSymbolByIpcKey,
  getStorageVedioSymbolByIpcTypeAndState,
  getSectorPoints,
  getCirclePoints,
  getVedioSymbolByIpcTypeAndState,
  // 报警
  getAlarmTypeByKey,
  getDrawAlarmSymbolByType,
  getAlarmSymbolByType,
  getAlarmSymbolByTypeInApp,
  getAlarmEditSymbolByKey,
  getHLSymbolByKey,
  getAlarmStateByKey,
  getAlarmPointSymbolByState,
  getAlarmingSymbolByType,
  // 巡更
  getPatrolStatusByKey,
  getPatrolSymbolByState,
  getPatrolSymbolByStatusInApp
}
