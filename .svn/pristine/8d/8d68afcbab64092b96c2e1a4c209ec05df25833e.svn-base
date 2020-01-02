// 报警点位（普通报警、消防报警、报警主机）要素构造方法
import { GEOMETRYTYPE, POINTSTATE, MPSIGNKEY, RESOURCETYPE, MAPMODE } from '../../meta/common'
import SymbolConfig from '../../SymbolConfig'
import { VariableTypes } from '../../MapUtil'
import featureBase from '../base'
import areaTrans from './area'
import areaStyle from '../../areaStyle'
import styleConfig from '../../meta/style'
import spaceUtil from 'assets/2DMap/spaceAnalysisUtil'

/**
 * 构造要素
 * @param {*} arr 资源数组
 * @param {*} layerConfig 图层配置参数
 */
function transFeatures(arr, layerConfig, pointMode = MAPMODE.point2D) {
  let features = []
  for (let item of arr) {
    let { mapsign } = item
    let feature = null
    let point = JSON.parse(JSON.stringify(item[pointMode]))
    !mapsign && (mapsign = {signtype: MPSIGNKEY.point, signflag: true})
    if (point && point.loc && mapsign) {
      if (mapsign.signtype === MPSIGNKEY.point) { // 点
        feature = getPointFeature(item, layerConfig, pointMode)
      } else if (mapsign.signtype === MPSIGNKEY.lineString) { // 线
        feature = getLineStringFeature(item, layerConfig, pointMode)
      } else if (mapsign.signtype === MPSIGNKEY.polygon) { // 面
        feature = getPolygonFeature(item, layerConfig, pointMode)
      }
    }
    feature && features.push(feature)
  }
  return features
}

/**
 * 获取点要素
 * @param {*} alarm 资源数据
 * @param {*} layerConfig 图层配置参数
 * @update 2019-4-16 18:45:10 hanjie 报警设备去掉离线状态
 */
function getPointFeature(alarm, layerConfig, pointMode) {
  let { _id, type, name, mapsign, eid } = JSON.parse(JSON.stringify(alarm))
  let point = JSON.parse(JSON.stringify(alarm[pointMode]))
  point.mid = (pointMode === MAPMODE.point2D) ? point.mid : point.iid
  // let realState = (status.toString() === '1') ? (point.defensestatus ? POINTSTATE.ARMIMG : POINTSTATE.UNARM) : status
  let symbol = getSymbolByType(type, 1) // 根据类型、状态获取图标样式，——> 修改为只获取在线图标，去掉离线状态 --- hanjie 2019-4-16 18:47:43
  if (point.mid && eid) { // 有图标信息时
    let icon = point.mid
    if (icon.files && icon.files instanceof Array) {
      for (const file of icon.files) {
        if (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus) { // 设备无启用禁用状态或设备启用
          if (file.status === POINTSTATE.ONLINE) { // 在线
            symbol.iconStyle.url = file.path
            break
          } else { // 设备禁用
            if (file.status === POINTSTATE.UNUSE) { // 禁用
              symbol.iconStyle.url = file.path
              break
            }
          }
        }
      }
    }
  }
  let feature = {
    geom: {
      type: GEOMETRYTYPE.POINT,
      points: point.loc
    },
    attributes: {
      id: _id,
      type: layerConfig.name,
      rType: layerConfig.rType, // 资源类型
      label: name,
      mapsign: mapsign,
      loc: point.loc,
      isOuter: point.isouter
    },
    symbol: symbol
  }
  return feature
}

/**
 * 获取线要素
 * @param {*} alarm 资源数据
 * @param {*} layerConfig 图层配置参数
 */
function getLineStringFeature(alarm, layerConfig, pointMode) {
  let { _id, name, mapsign } = JSON.parse(JSON.stringify(alarm))
  let point = JSON.parse(JSON.stringify(alarm[pointMode]))
  let styleC = JSON.parse(JSON.stringify(areaStyle.alarmAreaStyle)) // 深拷贝样式
  let pointStyle = point.style ? point.style : styleConfig.defaultLine
  styleC = areaTrans.convertStyleToSymbol(styleC, pointStyle)
  let center = spaceUtil.getMultiLineStringCenter(point.loc).toString()
  let feature = {
    geom: {
      type: GEOMETRYTYPE.MULTIPOLYLINE,
      points: point.loc
    },
    attributes: {
      id: _id,
      type: layerConfig.name,
      rType: layerConfig.rType, // 资源类型
      label: name,
      mapsign: mapsign,
      loc: center,
      isOuter: point.isouter
    },
    symbol: styleC
  }
  return feature
}

/**
 * 获取面要素
 * @param {*} alarm 资源数据
 * @param {*} layerConfig 图层配置参数
 */
function getPolygonFeature(alarm, layerConfig, pointMode) {
  let { _id, name, mapsign } = JSON.parse(JSON.stringify(alarm))
  let point = JSON.parse(JSON.stringify(alarm[pointMode]))
  let styleC = JSON.parse(JSON.stringify(areaStyle.alarmAreaStyle)) // 深拷贝样式
  let pointStyle = point.style ? point.style : styleConfig.defaultArea
  styleC = areaTrans.convertStyleToSymbol(styleC, pointStyle)
  let center = spaceUtil.getMultiPolygonCenter(point.loc).toString()
  let feature = {
    geom: {
      type: GEOMETRYTYPE.MULTIPOLYGON,
      points: point.loc
    },
    attributes: {
      id: _id,
      type: layerConfig.name,
      rType: layerConfig.rType, // 资源类型
      label: name,
      mapsign: mapsign,
      loc: center,
      isOuter: point.isouter
    },
    symbol: styleC
  }
  return feature
}

/**
 * 根据类型、状态获取图标样式
 * @param {*} type 类型
 * @param {*} status 状态
 */
function getSymbolByType(type, status) {
  let symbol = SymbolConfig.alarmPointOnlineSymbol
  if (type === RESOURCETYPE.commonAlarm) { // 普通报警
    symbol = getCommonAlarmSymbolByState(status)
  } else if (type === RESOURCETYPE.fireAlarm) { // 消防报警
    symbol = getFireAlarmSymbolByState(status)
  } else if (type === RESOURCETYPE.alarmHost) { // 报警主机报警
    symbol = getAlarmHostSymbolByState(status)
  }
  return JSON.parse(JSON.stringify(symbol))
}

/**
 * 根据状态获取普通报警点位样式
 * @param {*} status
 */
function getCommonAlarmSymbolByState(status) {
  let state = status
  let isStr = VariableTypes.isString(status)
  if (!isStr) {
    state = featureBase.getAlarmStateByKey(status)
  }
  let symbol = null
  switch (state) {
    case POINTSTATE.ONLINE:
      symbol = SymbolConfig.alarmPointOnlineSymbol
      break
    case POINTSTATE.OFFLINE:
      symbol = SymbolConfig.alarmPointOfflineSymbol
      break
    case POINTSTATE.ARMIMG:
      symbol = SymbolConfig.alarmPointArmSymbol
      break
    case POINTSTATE.UNARM:
      symbol = SymbolConfig.alarmPointUnarmSymbol
      break
    case POINTSTATE.ALARMIMG:
      symbol = SymbolConfig.alarmPointAlarmSymbol
      break
  }
  return JSON.parse(JSON.stringify(symbol))
}

/**
 * 根据状态获取消防报警点位样式
 * @param {*} status
 */
function getFireAlarmSymbolByState(status) {
  let symbol = null
  let state = status
  let isStr = VariableTypes.isString(status)
  if (!isStr) {
    state = featureBase.getAlarmStateByKey(status)
  }
  switch (state) {
    case POINTSTATE.ONLINE:
    case POINTSTATE.ARMIMG:
    case POINTSTATE.UNARM:
      symbol = SymbolConfig.fireAlarmPointSymbol
      break
    case POINTSTATE.OFFLINE:
      symbol = SymbolConfig.fireAlarmOfflineSymbol
      break
    case POINTSTATE.ALARMIMG:
      symbol = SymbolConfig.fireAlarmAlarmSymbol
      break
  }
  return JSON.parse(JSON.stringify(symbol))
}

/**
 * 根据状态获取消防报警点位样式
 * @param {*} status
 */
function getAlarmHostSymbolByState(status) {
  let symbol = null
  let state = status
  let isStr = VariableTypes.isString(status)
  if (!isStr) {
    state = featureBase.getAlarmStateByKey(status)
  }
  switch (state) {
    case POINTSTATE.ONLINE:
    case POINTSTATE.ARMIMG:
    case POINTSTATE.UNARM:
      symbol = SymbolConfig.alarmHostOnlineSymbol
      break
    case POINTSTATE.OFFLINE:
      symbol = SymbolConfig.alarmHostOfflineSymbol
      break
    case POINTSTATE.ALARMIMG:
      symbol = SymbolConfig.alarmPointHostSymbol
      break
  }
  return JSON.parse(JSON.stringify(symbol))
}

export default {
  transFeatures
}
