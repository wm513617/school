import {
  GeometryType
} from '../GeometryType.js'
import STATE from '../edit/state.js'
import ipcUtil from '../edit/ipcUtil.js'
import SymbolConfig from '../SymbolConfig'
import areaUtil from '../areaUtil'
import ALARMTYPE from './alarmType'
/**
 * 加载已入库的视频点位
 * @param {*} param
 */
function addAlarm(alarmlist, array, isOuter) {
  let alarms = JSON.parse(JSON.stringify(alarmlist))
  let featurelist = []
  if (array.length > 0) {
    array.forEach(element => {
      if (element.point) {
        let symbol = null
        let type = null
        let alarmType = null
        // 布撤防状态
        let defensestatus = null
        if (element.point.defensestatus) {
          defensestatus = STATE.ARMIMG
        } else {
          defensestatus = STATE.UNARM
        }
        // 消防报警和普通报警之分{
        if (element.alarmType) { // 是普通报警
          // 普通报警只有点
          alarmType = ALARMTYPE.COMMON
          if (element.point) {
            if (isOuter === element.point.isouter) {
              symbol = ipcUtil.getAlarmPointSymbolByState(element.status) // 在线离线状态
              type = GeometryType.POINT
              if (element.status.toString() === '1') {
                symbol = ipcUtil.getAlarmPointSymbolByState(defensestatus)
              }
            }
          }
        } else {
          if (element.mapsign) {
            alarmType = ALARMTYPE.FIRE
            if (isOuter === element.point.isouter) {
              let coods = element.point.loc
              let locArr = coods.split(',')
              let length = locArr.length
              let mapsign = 0
              if (length > 2) {
                let startPoint = [locArr[0], locArr[1]]
                let endPoint = [locArr[length - 2], locArr[length - 1]]
                if ((startPoint[0] === endPoint[0]) && (startPoint[1] === endPoint[1])) {
                  mapsign = 2
                } else {
                  mapsign = 1
                }
              }
              symbol = ipcUtil.getAlarmSymbolByType(mapsign, true)
              type = ipcUtil.getAlarmTypeByKey(mapsign)
              if (type !== GeometryType.POINT) {
                // 报警标识为线/面的样式
                if (element.point.style) {
                  symbol = areaUtil.convertStyleToSymbol(symbol, element.point.style)
                }
              } else {
                let status = element.status || 0
                symbol = ipcUtil.getAlarmPointSymbolByState(status, true)
                // 在线状态下判断是否布防/撤防
                if (element.status + '' === '1') {
                  symbol = ipcUtil.getAlarmPointSymbolByState(defensestatus, true)
                }
              }
            }
          }
        }
        let feature = {
          geom: {
            type,
            points: element.point.loc
          },
          attributes: {
            id: element.point._id,
            _id: element._id,
            alarmType,
            type: 'alarm' + type,
            defensestatus: element.point.defensestatus,
            status: element.status,
            state: STATE.SAVE,
            loc: element.point.loc
          },
          symbol
        }
        featurelist.push(feature)
        let alarm = getFeatureById(alarms, element.point._id)
        if (!alarm) {
          alarms.push(feature)
        }
      }
    })
  }
  return {
    alarmList: alarms,
    commonAlarms: featurelist // 新增加的报警点位
  }
}
/**
 * 根据id删除报警点位
 * @param {*} features
 * @param {*} id
 */
function deleteAlarmById(features, id) {
  if (id) {
    if (features.length > 0) {
      features.forEach((feature, index) => {
        if (feature.attributes.id === id) {
          features.splice(index, 1)
        }
      })
    } else {
      features = []
    }
  }
  return features
}
/**
 * 通过id找出数组中相同id的元素
 * @param {*} features 数组 视频点位
 * @param {*} id
 */
function getFeatureById(features, id) {
  let feature = null
  if (id) {
    if (features.length > 0) {
      features.forEach((fea) => {
        if (fea.attributes.id === id) {
          feature = fea
        }
      })
      return feature
    }
  }
}
/**
 * 通过id和状态改变报警点位图标
 * @param {*} features
 * @param {*} id
 * @param {*} state
 */
function changeAlarmIconByIdAndState(features, id, state) {
  let alarm = getFeatureById(features, id)
  features = deleteAlarmById(features, id)
  let symbol = null
  let type = alarm.geom.type
  if (type === GeometryType.POINT) {
    symbol = ipcUtil.getAlarmPointSymbolByState(state)
  } else {
    if (state === STATE.ALARMIMG) {
      symbol = ipcUtil.getAlarmingSymbolByType(type)
    } else {
      symbol = alarm.symbol
    }
  }
  let newAlarm = {
    geom: alarm.geom,
    attributes: alarm.attributes,
    symbol
  }
  newAlarm.attributes.state = state
  features.push(newAlarm)
  return {
    alarmList: features,
    alarm: newAlarm
  }
}

/**
 * 报警闪烁事件
 * @param {*} alarmlist // 报警点位总对象
 * @param {*} id // 点前推送的报警的对象
 */
function alarmTwinkEvt(alarmlist, id) {
  let alarms = JSON.parse(JSON.stringify(alarmlist))
  let alarmingFeature = getFeatureById(alarms, id)
  let alarmObj = null
  if (alarmingFeature) {
    let state = alarmingFeature.attributes.state
    if (state !== STATE.ALARMIMG) {
      alarmObj = changeAlarmIconByIdAndState(alarms, id, STATE.ALARMIMG)
    }
  }
  return alarmObj
}
/**
 * 判断当前报警中的对象是否包含推送带过来的对象
 * @param {*} alarmlist
 * @param {*} id
 */
function isContainerAlarmingFeature(alarmlist, id) {
  let alarms = JSON.parse(JSON.stringify(alarmlist))
  let isContainer = false
  alarms.forEach(element => {
    if (id === element.attributes.id) {
      isContainer = true
    }
  })
  return isContainer
}
/**
 * 从报警图层中删除普通报警点位
 * @param {*} alarmlist
 * @param {*} commonlist
 */
function deleteCommonAlarmFromLayer(alarmlist, commonlist) {
  let alarms = JSON.parse(JSON.stringify(alarmlist))
  let commonAlarms = JSON.parse(JSON.stringify(commonlist))
  commonAlarms.forEach(common => {
    let id = common && common.attributes.id
    alarms = deleteAlarmById(alarms, id)
  })
  return alarms
}
/**
 * 添加正在报警的消防/普通点位
 * @param {*} alarmlist
 * @param {*} param
 */
function addAlarming(alarmlist, param) {
  let alarms = JSON.parse(JSON.stringify(alarmlist))
  let id = param.point._id
  let alarmFeature = getFeatureById(alarms, id)
  let isCommonAlarm = false
  let sid = ''
  if (alarmFeature) {
    alarms = deleteAlarmById(alarms, id)
  }
  let type = null
  let symbol = null
  if (param.mapsign) {
    type = ipcUtil.getAlarmTypeByKey(param.mapsign.signtype)
    symbol = ipcUtil.getAlarmingSymbolByType(type)
  } else {
    symbol = ipcUtil.getAlarmPointSymbolByState(STATE.ALARMIMG)
    type = GeometryType.POINT
    isCommonAlarm = true
  }
  if (param.point.sid) {
    sid = param.point.sid
  }
  alarmFeature = {
    geom: {
      type,
      points: param.point.loc
    },
    attributes: {
      id: param.point._id,
      type: 'alarm' + type,
      state: STATE.ALARMIMG,
      isCommonAlarm,
      loc: param.point.loc,
      isouter: param.point.isouter,
      sid,
      param
    },
    symbol
  }
  alarms.push(alarmFeature)
  return {
    alarmList: alarms,
    alarming: alarmFeature,
    isCommonAlarm
  }
}
/**
 * 控制正在报警的消防/普通点位的显示隐藏，即就是闪烁效果
 * @param {*} alarmlist
 * @param {*} alarmings
 */
function controlAlarmingShowOrHide(alarmlist, alarmings, isShow) {
  let alarms = JSON.parse(JSON.stringify(alarmlist))
  let alarmingFeatures = JSON.parse(JSON.stringify(alarmings))
  alarmingFeatures.forEach(element => {
    let alarming = getFeatureById(alarms, element.attributes.id)
    if (isShow) {
      if (!alarming) {
        alarms.push(element)
      }
    } else {
      if (alarming) {
        alarms = deleteAlarmById(alarms, element.attributes.id)
      }
    }
  })
  return alarms
}
/**
 * 获取楼层内/地图上的消防/普通报警
 * @param {*} alarmings
 * @param {*} isouter
 */
function getAlarmingsByIsOuter(alarmings, isouter, sid) {
  let alarminglist = JSON.parse(JSON.stringify(alarmings))
  let alarmingCol = []
  alarminglist.forEach(element => {
    if (isouter) {
      if (element.attributes.isouter) {
        alarmingCol.push(element)
      }
    }
    if (!isouter) {
      if (sid) {
        if (element.attributes.sid === sid) {
          alarmingCol.push(element)
        }
      }
    }
  })
  return alarmingCol
}
/**
 * 删除正在报警的点位，加载在线状态的点位
 * @param {*} alarmlist // 当前地图上所有的消防报警点位
 * @param {*} alarms // 数据库中所有的消防报警点位
 * @param {*} id
 * @param {*} state
 */
function deleteOrChangeStateById(alarmlist, alarms, id, state) {
  let alarmCol = JSON.parse(JSON.stringify(alarmlist))
  let alarmsInMap = JSON.parse(JSON.stringify(alarms))
  let alarm = getFeatureById(alarmsInMap, id)
  alarmCol = deleteAlarmById(alarmCol, id)
  let symbol = null
  let type = alarm.geom.type
  if (type === GeometryType.POINT) {
    symbol = ipcUtil.getAlarmPointSymbolByState(state, true)
  } else {
    symbol = alarm.symbol
  }
  let newAlarm = {
    geom: alarm.geom,
    attributes: alarm.attributes,
    symbol
  }
  newAlarm.attributes.state = state
  alarmCol.push(newAlarm)
  return {
    alarmList: alarmCol,
    alarm: newAlarm
  }
}
/**
 * 添加闪烁的楼层
 * @param {*} alarmlist
 * @param {*} param
 */
function addTwinkBuild(alarmlist, param, loc) {
  let alarms = JSON.parse(JSON.stringify(alarmlist))
  let id = param.point._id
  let alarmFeature = getFeatureById(alarms, id)
  if (alarmFeature) {
    alarms = deleteAlarmById(alarms, id)
  }
  alarmFeature = {
    geom: {
      type: GeometryType.POLYGON,
      points: loc
    },
    attributes: {
      id,
      type: 'buildalarm',
      state: STATE.ALARMIMG,
      loc,
      isouter: true,
      param
    },
    symbol: SymbolConfig.alarmPolygonAlarmSymbol
  }
  alarms.push(alarmFeature)
  return {
    alarmList: alarms,
    alarming: alarmFeature
  }
}
/**
 * 设置报警点位的布撤防状态
 * @param {*} alarmlist
 * @param {*} id
 * @param {*} status
 */
function setAlarmArmStatus(alarmlist, id, status) {
  let alarms = JSON.parse(JSON.stringify(alarmlist))
  let feature = getFeatureById(alarmlist, id)
  // 当报警是在线状态时，才可以布撤防
  if (feature.attributes.status === 1) {
    // if ('status' in feature.attributes) {
    let defensestatus = null
    if (status) {
      defensestatus = STATE.ARMIMG
    } else {
      defensestatus = STATE.UNARM
    }
    let symbol = ipcUtil.getAlarmPointSymbolByState(defensestatus)
    let newFeature = JSON.parse(JSON.stringify(feature))
    newFeature.attributes.defensestatus = status
    newFeature.symbol = symbol
    alarms = deleteAlarmById(alarms, id)
    alarms.push(newFeature)
  }
  return alarms
}

export default {
  addAlarm,
  deleteAlarmById,
  getFeatureById,
  // 报警业务
  changeAlarmIconByIdAndState,
  alarmTwinkEvt,
  isContainerAlarmingFeature,
  deleteCommonAlarmFromLayer,
  setAlarmArmStatus,
  // 报警闪烁
  addAlarming,
  controlAlarmingShowOrHide,
  getAlarmingsByIsOuter,
  deleteOrChangeStateById,
  addTwinkBuild
}
