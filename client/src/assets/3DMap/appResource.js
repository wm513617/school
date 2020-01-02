import {
  GeometryType
} from './GeometryType.js'
import SymbolConfig from './SymbolConfig'
import mapUtil from './mapUtil'

/**
 * 将点位数据转换为图层要素数据源
 * @param {*} pointDatas 点位数据数组
 * @param {*} mapMode 地图模式
 * @returns
 */
function convertPointDataToFeatures(pointDatas, mapMode) {
  let features = []
  pointDatas.forEach((data, index) => {
    let symbol = getResourceSymbolByType(data) // 根据类型获取资源要添加的feature的样式
    let coods = data.point ? data.point.loc : data.point3D.loc
    let {type, monitortype, eid} = data
    if (mapMode && data[mapMode] && data[mapMode].loc) {
      coods = data[mapMode].loc
    }
    let feature = {
      geom: {
        type: GeometryType.POINT,
        points: coods
      },
      attributes: {
        id: data._id
      },
      symbol: symbol
    }
    // 如果该点位为视频通道资源------
    if (type === mapUtil.CHANNELTYPE.vedioResource) { // 视频资源
      feature.attributes.monitorType = monitortype
      if (eid && eid.type) { // 判断是否是报警求助
        if (eid.type === mapUtil.CHANNELTYPE.alarmColumnResource || eid.type === mapUtil.CHANNELTYPE.alarmBoxResource) { // 报警柱
          type = eid.type
        }
      }
    }
    feature.attributes.type = type // 设置要素类型
    features.push(feature)
  })
  return features
}

/**
 * 根据类型获取资源的样式
 * @param {*} data 资源数据
 * @returns
 */
function getResourceSymbolByType(data) {
  let symbol = {}
  const {type, status, monitortype, eid} = data
  if (type === mapUtil.CHANNELTYPE.vedioResource) { // 视频资源
    if (eid && eid.type) { // 判断是否是报警求助
      if (eid.type === mapUtil.CHANNELTYPE.alarmColumnResource) { // 报警柱
        if (status === 1) { // 在线
          symbol = SymbolConfig.alarmColumnSaveSymbol
        }
        if (status === 0) { // 离线
          symbol = SymbolConfig.alarmColumnSaveSymbol
        }
      } else if (eid.type === mapUtil.CHANNELTYPE.alarmBoxResource) { // 报警箱
        if (status === 1) { // 在线
          symbol = SymbolConfig.alarmBoxSaveSymbol
        }
        if (status === 0) { // 离线
          symbol = SymbolConfig.alarmBoxSaveSymbol
        }
      } else {
        symbol = mapUtil.getStorageVedioSymbolByIpcTypeAndState(monitortype, status)
      }
    } else {
      symbol = mapUtil.getStorageVedioSymbolByIpcTypeAndState(monitortype, status)
    }
  }
  if (type === mapUtil.CHANNELTYPE.commonAlarmResource) { // 普通报警
    if (status === 1) { // 在线
      symbol = SymbolConfig.alarmPointOnlineSymbol
    }
    if (status === 0) { // 离线
      symbol = SymbolConfig.alarmPointOfflineSymbol
    }
  }
  if (type === mapUtil.CHANNELTYPE.fireAlarmResource) { // 消防报警
    if (status === 1) { // 在线
      symbol = SymbolConfig.fireAlarmPointOnlineSymbol
    }
    if (status === 0) { // 离线
      symbol = SymbolConfig.fireAlarmPointOfflineSymbol
    }
  }
  if (type === mapUtil.CHANNELTYPE.alarmHostResource) { // 报警主机报警
    if (status === 1) { // 在线
      symbol = SymbolConfig.alarmHostPointOnlineSymbol
    }
    if (status === 0) { // 离线
      symbol = SymbolConfig.alarmHostPointOfflineSymbol
    }
  }
  return symbol
}

/**
 * 根据类型过滤数据
 * @param {*} arr 数据数组
 * @param {*} types 类型
 * @returns 过滤后的数据数组
 */
function fitlerArrByTypes(arr, types) {
  let pointArr = []
  arr.forEach((elem, index) => {
    let isExist = _checkElemIsExistInTypes(elem, types)
    if (isExist) {
      pointArr.push(elem)
    }
  })
  return pointArr
}

/**
 * 检查元素的类型是否在给定类型中
 * @param {*} elem 元素
 * @param {*} types 类型数组
 * @returns
 */
function _checkElemIsExistInTypes(elem, types) {
  let flag = false
  const deviceType = elem.monitortype
  for (let type of types) {
    if (deviceType === type) {
      flag = true
      break
    }
  }
  return flag
}

/**
 * 根据类型获取视频要素
 * @param {*} features 要素数组
 * @param {*} types 类型数组
 * @returns
 */
function getVedioPointFeaturesByTypes(features, types) {
  let vedioFeatures = []
  features.forEach((feature, index, arr) => {
    let isExist = _checkVedioFeatureTypeIsExistInTypes(feature, types)
    if (isExist) {
      vedioFeatures.push(feature)
    }
  })
  return vedioFeatures
}

/**
 * 检查视频类型是否在给定类型中
 * @param {*} feature 要素
 * @param {*} types 类型数组
 * @returns
 */
function _checkVedioFeatureTypeIsExistInTypes(feature, types) {
  let flag = false
  const deviceType = feature.attributes.monitorType
  for (let type of types) {
    if (deviceType === type) {
      flag = true
      break
    }
  }
  return flag
}
export default {
  getVedioPointFeaturesByTypes,
  convertPointDataToFeatures,
  fitlerArrByTypes
}
