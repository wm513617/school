import { GeometryType } from '../GeometryType.js'
import STATE from '../edit/state.js'
import ipcUtil from '../edit/ipcUtil.js'
import SymbolConfig from '../SymbolConfig'
import ALARMTYPE from './alarmType'
function addAlarmingFea(param, type) {
  let geo
  let ids
  let _id
  if (param.map2D) {
    geo = param.map2D.geo.split(',').map(item => Number(item))
    ids = param._id
  } else if (param.point) {
    geo = param.point.loc
    ids = param.channelId
    _id = param.point._id
  }
  if (geo) {
    let id = ids
    let loc = geo
    let patrolFeature = {
      geom: {
        type: GeometryType.POINT,
        points: loc
      },
      attributes: {
        id,
        type: param.type,
        alarmType: ALARMTYPE.PATROL,
        state: STATE.ALARMIMG,
        loc,
        _id
      },
      symbol: SymbolConfig[type]
    }
    return patrolFeature
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
      // 需要删除的点位元素下标数组
      let delArr = []
      features.forEach((feature, index) => {
        if (feature.attributes.id === id) {
          // features.splice(index, 1)
          delArr.push(index)
        }
      })
      if (delArr.length) {
        // 降序排序
        delArr.sort().reverse()
        // 删除元素
        delArr.forEach(item => {
          features.splice(item, 1)
        })
      }
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
      features.forEach(fea => {
        if (fea.attributes.id === id) {
          feature = fea
        }
      })
      return feature
    }
  }
}
/**
 * 根据属性名寻找对象
 * @param {*} features
 * @param {*} id
 */
function getFeatureByattr(features, attr, value) {
  let feature = null
  if (value) {
    if (features.length > 0) {
      features.forEach(fea => {
        if (fea.attributes[attr] === value) {
          feature = fea
          return feature
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
 * 从原图层中删除推送过来的报警点位
 * 并且将正在报警的消防点位添加到报警图层中
 * @param {*} alarmlist 消防报警图层数组
 * @param {*} alarminglist 报警图层数组
 * @param {*} param 推送的报警信息
 */
function addFireAlarming(alarmlist, alarminglist, param) {
  let alarms = JSON.parse(JSON.stringify(alarmlist))
  let alarmings = JSON.parse(JSON.stringify(alarminglist))
  let id = param.point._id
  alarms = deleteAlarmById(alarms, id) // 从原图层中删除推送过来的报警点位
  let isCommonAlarm = param.type === 'commonAlarm' // 判断是否是普通报警
  let alarmType = param.type === 'commonAlarm' ? ALARMTYPE.COMMON : ALARMTYPE.FIRE
  let sid = ''
  let alarming = getFeatureById(alarmings, id) // 判断报警图层是否含有推过来的点位
  let alarmFeature = null
  if (!alarming) {
    let type = null
    let symbol = null
    if (param.point.sid) {
      sid = param.point.sid
    }
    if (param.mapsign) {
      let coods = param.point.loc
      let locArr = coods.split(',')
      let length = locArr.length
      let mapsign = 0
      if (length > 2) {
        let startPoint = [locArr[0], locArr[1]]
        let endPoint = [locArr[length - 2], locArr[length - 1]]
        if (startPoint[0] === endPoint[0] && startPoint[1] === endPoint[1]) {
          mapsign = 2
        } else {
          mapsign = 1
        }
      }
      type = ipcUtil.getAlarmTypeByKey(mapsign)
      symbol = ipcUtil.getAlarmingSymbolByType(type)
    } else {
      symbol = ipcUtil.getAlarmPointSymbolByState(STATE.ALARMIMG)
      type = GeometryType.POINT
    }
    alarmFeature = {
      geom: {
        type,
        points: param.point.loc
      },
      attributes: {
        id: param.point._id,
        type: 'alarm' + type,
        alarmType,
        state: STATE.ALARMIMG,
        isCommonAlarm,
        loc: param.point.loc,
        isouter: param.point.isouter,
        sid,
        param
      },
      symbol
    }
    alarmings.push(alarmFeature)
  }
  return {
    alarmlist: alarms, // 消防点位图层数组
    alarming: alarmFeature, // 推送过来的报警对象
    alarminglist: alarmings // 报警图层数组
  }
}
/**
 * 添加正在报警的单兵点位
 * @param {*} alarmlist 消防报警图层数组
 * @param {*} alarminglist 报警图层数组
 * @param {*} param 推送的报警信息
 */
function addSingleAlarming(singlelist, alarminglist, param) {
  let singles = JSON.parse(JSON.stringify(singlelist))
  let alarmings = JSON.parse(JSON.stringify(alarminglist))
  let id = param.user._id
  let sinleFeature = getFeatureById(singles, id)
  if (sinleFeature) {
    singles = deleteAlarmById(singles, id)
  }
  let loc = param.point.loc + ',' + param.point.lat
  sinleFeature = {
    geom: {
      type: GeometryType.POINT,
      points: loc
    },
    attributes: {
      id,
      type: 'moveSingle',
      alarmType: ALARMTYPE.SINGLE,
      state: STATE.ALARMIMG,
      loc,
      user: param.user
    },
    symbol: SymbolConfig.singleAlarmSymbol
  }
  alarmings.push(sinleFeature)
  return {
    singleList: singles, // 单兵图层数组
    alarming: sinleFeature, // 推送过来的报警对象
    alarminglist: alarmings // 报警图层数组
  }
}
/**
 * 添加正在报警的巡更点位
 * @param {*} alarmlist 消防报警图层数组
 * @param {*} alarminglist 报警图层数组
 * @param {*} param 推送的报警信息
 */
function addPatrolAlarming(patrollist, alarminglist, param) {
  let patrols = JSON.parse(JSON.stringify(patrollist))
  let alarmings = JSON.parse(JSON.stringify(alarminglist))
  let id = param._id
  let patrolFeature = getFeatureById(patrols, id)
  if (param.map2D.geo) {
    if (patrolFeature) {
      patrols = deleteAlarmById(patrols, id)
    }
    let loc = param.map2D.geo
    patrolFeature = {
      geom: {
        type: GeometryType.POINT,
        points: loc
      },
      attributes: {
        id,
        type: 'patrol',
        alarmType: ALARMTYPE.PATROL,
        state: STATE.ALARMIMG,
        loc
      },
      symbol: SymbolConfig.patrolAlarmSymbol
    }
    alarmings.push(patrolFeature)
  }
  return {
    patrolList: patrols, // 单兵图层数组
    alarming: patrolFeature, // 推送过来的报警对象
    alarminglist: alarmings // 报警图层数组
  }
}
/**
 * 添加正在报警的汇聚巡更点位
 * @param {*} alarmlist 消防报警图层数组
 * @param {*} alarminglist 报警图层数组
 * @param {*} param 推送的报警信息
 */
function addPatrolConverTwink(patrollist, alarminglist, param) {
  let patrols = JSON.parse(JSON.stringify(patrollist))
  let alarmings = JSON.parse(JSON.stringify(alarminglist))
  // 汇聚的点位的id是bid
  let bid = param.bid
  let id = param._id
  let patrolFeature = getFeatureById(patrols, bid)
  if (patrolFeature) {
    patrols = deleteAlarmById(patrols, bid)
  }
  let loc = param.geo
  patrolFeature = {
    geom: {
      type: GeometryType.POINT,
      points: loc
    },
    attributes: {
      id,
      bid,
      type: 'patrolConver',
      alarmType: ALARMTYPE.PATROL,
      state: STATE.ALARMIMG,
      loc
    },
    symbol: SymbolConfig.patrolConverAlarmSymbol
  }
  alarmings.push(patrolFeature)
  return {
    patrolList: patrols, // 单兵图层数组
    alarming: patrolFeature, // 推送过来的报警对象
    alarminglist: alarmings // 报警图层数组
  }
}
/**
 * 控制正在报警的点位的显示隐藏，即就是闪烁效果
 * @param {*} alarmlist
 * @param {*} alarmings
 */
function controlAlarmingShowOrHide(alarminglist, currentAlarmings, isShow) {
  let alarmingCol = JSON.parse(JSON.stringify(alarminglist))
  let currentAlarmingCol = JSON.parse(JSON.stringify(currentAlarmings))
  alarmingCol.forEach(element => {
    let alarming = getFeatureById(currentAlarmingCol, element.attributes.id)
    if (isShow) {
      if (!alarming) {
        currentAlarmingCol.push(element)
      }
    } else {
      if (alarming) {
        currentAlarmingCol = deleteAlarmById(currentAlarmingCol, element.attributes.id)
      }
    }
  })
  return currentAlarmingCol
}
/**
 * 控制正在报警的点位的显示隐藏，即就是闪烁效果
 * @param {*} alarmlist
 * @param {*} alarmings
 */
function controlFloorAlarmingShowOrHide(alarminglist, currentAlarmings, isShow) {
  let alarmingCol = JSON.parse(JSON.stringify(alarminglist))
  let currentAlarmingCol = JSON.parse(JSON.stringify(currentAlarmings))
  alarmingCol.forEach(element => {
    let isOuter = element.attributes.isouter
    if (!isOuter) {
      let alarming = getFeatureById(currentAlarmingCol, element.attributes.id)
      if (isShow) {
        if (!alarming) {
          currentAlarmingCol.push(element)
        }
      } else {
        if (alarming) {
          currentAlarmingCol = deleteAlarmById(currentAlarmingCol, element.attributes.id)
        }
      }
    }
  })
  return currentAlarmingCol
}
/**
 * 获取楼层内/地图上的报警
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
 * @param {*} alarmlist
 * @param {*} alarms
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
    symbol = ipcUtil.getAlarmPointSymbolByState(state)
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
      bid: param.point.bid,
      param
    },
    symbol: SymbolConfig.alarmPolygonAlarmSymbol
  }
  alarms.push(alarmFeature)
  return {
    alarminglist: alarms,
    alarming: alarmFeature
  }
}
/**
 * 勾选普通报警或消防报警点位时，删除掉正在报警的点位
 * @param {*} alarmlist
 * @param {*} alarmings
 */
function deleteAlarmingFromList(alarmlist, alarmings) {
  let alarmCol = JSON.parse(JSON.stringify(alarmlist))
  let alarmingCol = JSON.parse(JSON.stringify(alarmings))
  alarmingCol.forEach(element => {
    let id = element.attributes.id
    alarmCol = deleteAlarmById(alarmCol, id)
  })
  return alarmCol
}

export default {
  deleteAlarmById,
  getFeatureById,
  getFeatureByattr,
  // 报警业务
  changeAlarmIconByIdAndState,
  isContainerAlarmingFeature,
  // 报警闪烁
  addFireAlarming,
  addSingleAlarming,
  addPatrolAlarming,
  alarmTwinkEvt,
  controlAlarmingShowOrHide,
  controlFloorAlarmingShowOrHide,
  getAlarmingsByIsOuter,
  deleteOrChangeStateById,
  addTwinkBuild,
  addPatrolConverTwink,
  deleteAlarmingFromList,
  addAlarmingFea
}
