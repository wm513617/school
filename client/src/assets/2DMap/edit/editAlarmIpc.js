import { GeometryType } from '../GeometryType.js'
import SymbolConfig from '../SymbolConfig.js'
import ipcUtil from './ipcUtil.js'
import STATE from './state.js'
import areaUtil from '../areaUtil'
/**
 * 添加报警点位
 * @param {*} param
 */
function addAlarmIpc(param) {
  let { coods, node, style } = param
  let isFire = false
  if (node.type === 9 || node.type === 11) {
    isFire = true
  }
  let symbol = ipcUtil.getAlarmSymbolByType(node.mapsign.signtype, isFire) // 获取报警样式--
  let type = ipcUtil.getAlarmTypeByKey(node.mapsign.signtype) // 获取报警类型，点、线、面
  if (style) {
    // 如果为线、面,则使用数据库存的样式覆盖当前样式
    symbol = areaUtil.convertStyleToSymbol(symbol, style)
  }
  let feature = {
    geom: {
      type,
      points: coods
    },
    attributes: {
      id: node._id,
      type: 'alarm' + type,
      state: STATE.SAVE,
      loc: coods
    },
    symbol
  }
  return feature
}
/**
 * 加载所有已入库的视频点位
 * @param {*} param
 */
function addAllStorageAlarm(alarmlist, array, isOuter) {
  let alarms = JSON.parse(JSON.stringify(alarmlist))
  let featurelist = []
  if (array.length > 0) {
    array.forEach(element => {
      let symbol = null
      let type = null
      if (element.mapsign) {
        if (element.point) {
          if (isOuter === element.point.isouter) {
            let coods = element.point.loc
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
            symbol = ipcUtil.getAlarmSymbolByType(mapsign, true)
            type = ipcUtil.getAlarmTypeByKey(mapsign)
            if (type !== GeometryType.POINT) {
              if (element.point.style) {
                symbol = areaUtil.convertStyleToSymbol(symbol, element.point.style)
              }
            }
          }
        }
      }
      let feature = {
        geom: {
          type,
          points: element.point ? element.point.loc : ''
        },
        attributes: {
          id: element._id,
          _id: element._id,
          type: 'alarm' + type,
          state: STATE.SAVE,
          loc: element.point ? element.point.loc : ''
        },
        symbol
      }
      featurelist.push(feature)
      let alarm = getFeatureById(alarms, element._id)
      if (!alarm) {
        alarms.push(feature)
      }
    })
  }
  return {
    alarmList: alarms,
    commonAlarms: featurelist // 新增加的报警点位
  }
}
/**
 * 添加报警元素
 * @param {*} alarmList
 * @param {*} param
 */
function addFeatureToStorage(obj) {
  let { alarmList, param } = obj
  let alarmCol = JSON.parse(JSON.stringify(alarmList))
  let feature = getFeatureById(alarmCol, param.node._id)
  if (!feature) {
    feature = addAlarmIpc(param)
    alarmCol.push(feature)
  }
  return alarmCol
}
// 加载已经入库的报警点位
function addStorageAlarm(obj) {
  let { alarmList, param } = obj
  let alarmCol = JSON.parse(JSON.stringify(alarmList))
  let feature = getFeatureById(alarmCol, param.node._id)
  if (feature) {
    alarmCol = deleteAlarmById(alarmCol, param.node._id)
  }
  feature = addStorageAlarmIpc(param)
  alarmCol.push(feature)
  return alarmCol
}
// 加载有位置信息的报警，根据loc字段判断它的地图标识点、线、面
function addStorageAlarmIpc(param) {
  let { coods, node, style } = param
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
  let isFire = false
  if (param.node.type === 9 || param.node.type === 11) {
    isFire = true
  }
  let symbol = ipcUtil.getAlarmSymbolByType(mapsign, isFire)
  let type = ipcUtil.getAlarmTypeByKey(mapsign)
  if (type !== GeometryType.POINT) {
    if (style) {
      symbol = areaUtil.convertStyleToSymbol(symbol, style)
    }
  }
  let feature = {
    geom: {
      type,
      points: coods
    },
    attributes: {
      id: node._id,
      type: 'alarm' + type,
      state: STATE.SAVE,
      loc: coods
    },
    symbol
  }
  return feature
}

function convertAlarmPointsToFeatures(datas) {
  let features = []
  datas.forEach((data, index) => {
    let symbol = SymbolConfig.alarmPointSaveSymbol // 获取报警样式--
    let type = GeometryType.POINT // 获取报警类型，点、线、面
    let coods = data.point ? data.point.loc : data.point3D.loc
    let feature = {
      geom: {
        type,
        points: coods
      },
      attributes: {
        id: data._id,
        type: data.type,
        state: STATE.SAVE,
        loc: coods
      },
      symbol
    }
    features.push(feature)
  })
  return features
}
/**
 * 加载楼层中所有的报警点位
 * @param {*} obj
 */
function addFloorFeature(alarmlist, array) {
  let alarmCol = JSON.parse(JSON.stringify(alarmlist))
  if (array.length > 0) {
    array.forEach(element => {
      if (element.mapsign) {
        let param = JSON.parse(JSON.stringify(element.point))
        param.node = {
          _id: element._id,
          mapsign: element.mapsign
        }
        param.coods = element.point.loc
        if (element.point.style) {
          param.style = element.point.style
        }
        alarmCol = addFeatureToStorage({
          alarmList: alarmCol,
          param
        })
      }
    })
  }
  return alarmCol
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

function alarmClickEvt(obj, callback) {
  let feature = obj && obj.feature
  if (feature) {
    let attr = obj.attributes
    if (!attr) {
      return
    }
    if (attr.type && attr.type.indexOf('alarm') > -1) {
      let id = attr.id
      if (attr.state === 'save') {
        callback.changeState(id)
        callback.editFeature(feature)
      }
    }
  }
}

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
 * 改变feature的样式
 * edit状态即就是高亮样式
 * save状态即就是save样式
 * @param {*} feature
 * @param {*} state
 */
function changeSymbolByState(feature, state) {
  let isFire = false
  if (feature.symbol.iconStyle.url.indexOf('fire') > -1) {
    isFire = true
  }
  let newFeature = null
  if (feature) {
    feature.attributes.state = state
    let type = feature.geom.type
    let symbol = null
    if (type === GeometryType.POINT) {
      if (state === STATE.EDIT) {
        symbol = ipcUtil.getHLSymbolByKey(type, isFire)
      }
      if (state === STATE.SAVE) {
        symbol = ipcUtil.getAlarmSymbolByType(type, isFire)
      }
    } else {
      symbol = feature.symbol
    }
    let newSymbol = JSON.parse(JSON.stringify(symbol))
    newFeature = {
      geom: feature.geom,
      attributes: feature.attributes,
      symbol: newSymbol
    }
  }
  return newFeature
}
/**
 * 改变点位或可视域经纬度属性的值
 * @param {*} features
 * @param {*} coods
 */
function changeFeatureAttrPosition(feature, coods) {
  if (feature) {
    if (feature.geom.type === GeometryType.POLYGON) {
      feature.attributes.loc = coods[0]
      feature.geom.points = coods[0]
    } else {
      feature.attributes.loc = coods
      feature.geom.points = coods
    }
  } else {
    feature = null
  }
  return feature
}

/**
 * 改变报警元素的状态save-> edit/edit ->save
 * @param {*} currentFeature
 * @param {*} state
 */
function changeAlarmState(currentFeature, state) {
  let isFire = false
  if (currentFeature.symbol.iconStyle.url.indexOf('fire') > -1) {
    isFire = true
  }
  let feature = null
  if (currentFeature) {
    currentFeature.attributes.state = state
    let symbol = null
    if (currentFeature.geom.type === GeometryType.POINT) {
      if (state === STATE.EDIT) {
        // 编辑状态ipc得到样式
        symbol = ipcUtil.getAlarmEditSymbolByKey(currentFeature.geom.type, isFire)
      } else {
        // 保存状态ipc的样式
        symbol = ipcUtil.getAlarmSymbolByType(currentFeature.geom.type, isFire)
      }
    } else {
      symbol = currentFeature.symbol
    }
    let newSymbol = JSON.parse(JSON.stringify(symbol))
    // if (currentFeature.symbol.strokeStyle) {
    //   let outlineColor = currentFeature.symbol.strokeStyle.outLineColor
    //   currentFeature.symbol.strokeStyle.outLineColor = areaUtil.transformColor(outlineColor, 1)
    // }
    // if (currentFeature.symbol.fillColor) {
    //   let fillColor = currentFeature.symbol.fillColor
    //   currentFeature.symbol.fillColor = areaUtil.transformColor(fillColor, 1)
    // }
    feature = {
      geom: currentFeature.geom,
      attributes: currentFeature.attributes,
      symbol: newSymbol
      // symbol: currentFeature.symbol
    }
  }
  return feature
}
/**
 * 点击事件
 * 点击点位改变定位的状态save -> edit
 * @param {*} currentAlarm
 * @param {*} alarmList
 * @param {*} id
 * @param {*} state
 */
function changeStateById(obj) {
  let { currentAlarm, alarmList, id, state } = obj
  let curAlarm = JSON.parse(JSON.stringify(currentAlarm))
  let alarmCol = JSON.parse(JSON.stringify(alarmList))
  alarmCol = deleteAlarmById(alarmCol, id)
  curAlarm = changeAlarmState(curAlarm, state)
  curAlarm && alarmCol.push(curAlarm)
  return {
    alarmlist: alarmCol,
    currentAlarm: curAlarm
  }
}
/**
 * 编辑报警元素位置结束后
 * @param {*} currentVedio
 * @param {*} currentSector
 * @param {*} vedioList
 * @param {*} sectorList
 * @param {*} coods
 */
function modifyPositionEnd(obj) {
  let { currentAlarm, alarmList, coods } = obj
  let curAlarm = JSON.parse(JSON.stringify(currentAlarm))
  let alarmCol = JSON.parse(JSON.stringify(alarmList))
  let id = curAlarm && curAlarm.attributes.id
  alarmCol = deleteAlarmById(alarmCol, id)
  curAlarm = changeFeatureAttrPosition(curAlarm, coods)
  curAlarm && alarmCol.push(curAlarm)
  return {
    alarmlist: alarmCol,
    currentAlarm: curAlarm
  }
}
/**
 * 保存或取消按钮，将报警元素edit -> save状态
 * @param {*} alarmList
 * @param {*} id
 */
function saveAlarm(alarmList, id, style = null) {
  let alarmCol = JSON.parse(JSON.stringify(alarmList))
  let currentAlarm = getFeatureById(alarmCol, id) // 通过id先获取到该数组元素----
  alarmCol = deleteAlarmById(alarmCol, id) // 通过id数组中先清除该数组元素------
  let alarm = changeSymbolByState(currentAlarm, STATE.SAVE)
  if (style) {
    let newSymbol = areaUtil.convertStyleToSymbol(alarm.symbol, style)
    alarm.symbol = newSymbol
  }
  alarmCol.push(alarm)
  return alarmCol
}
/**
 * 删除报警点位
 * @param {*} obj
 */
function deleteAlarm(obj) {
  let { alarmList, id } = obj
  let alarmCol = JSON.parse(JSON.stringify(alarmList))
  alarmCol = deleteAlarmById(alarmCol, id)
  return alarmCol
}
/**
 * 编辑报警点位时的颜色等样式
 * @param {*} features
 * @param {*} id
 * @param {*} style
 */
function editAlarmStyle(features, id, style) {
  let alarmlist = JSON.parse(JSON.stringify(features))
  let feature = getFeatureById(alarmlist, id)
  alarmlist = deleteAlarmById(alarmlist, id)
  style = areaUtil.convertStyleToSymbol(feature.symbol, style)
  let newAlarm = {
    geom: feature.geom,
    attributes: feature.attributes,
    symbol: style
  }
  alarmlist.push(newAlarm)
  return {
    currentAlarm: newAlarm,
    alarmList: alarmlist
  }
}
export default {
  convertAlarmPointsToFeatures,
  addAllStorageAlarm,
  deleteAlarmById,
  getFeatureById,
  changeSymbolByState,
  addFloorFeature,
  // 业务
  addFeatureToStorage,
  addStorageAlarm,
  alarmClickEvt,
  changeStateById,
  modifyPositionEnd,
  saveAlarm,
  deleteAlarm,
  editAlarmStyle
}
//
