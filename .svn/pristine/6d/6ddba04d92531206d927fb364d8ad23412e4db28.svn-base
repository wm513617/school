// 报警点位（普通报警、消防报警、报警主机）要素构造方法
import { GEOMETRYTYPE, RESOURCETYPE, MPSIGNKEY, MAPMODE, POINTSTATE } from '../2DMap/meta/common'
import SymbolConfig from '../2DMap/SymbolConfig'
import areaTrans from '../2DMap/feature/edit/area'
import areaStyle from '../2DMap/areaStyle'
import styleConfig from '../2DMap/meta/style'

/**
 * 构造要素
 * @param {*} arr 资源数组
 * @param {*} layerConfig 图层配置参数
 */
function transFeatures(arr, layerConfig, pointMode = MAPMODE.point3D) {
  let features = []
  for (let item of arr) {
    let { mapsign } = item
    let feature = null
    let point = JSON.parse(JSON.stringify(item[pointMode]))
    if (point && point.loc) {
      if (mapsign && mapsign.signtype) {
        if (mapsign.signtype === MPSIGNKEY.point) { // 点
          feature = getPointFeature(item, layerConfig, pointMode)
        } else if (mapsign.signtype === MPSIGNKEY.lineString) { // 线
          feature = getLineStringFeature(item, layerConfig, pointMode)
        } else if (mapsign.signtype === MPSIGNKEY.polygon) { // 面
          feature = getPolygonFeature(item, layerConfig, pointMode)
        }
      } else {
        feature = getPointFeature(item, layerConfig, pointMode)
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
 */
function getPointFeature(alarm, layerConfig, pointMode) {
  let { _id, type, name } = alarm
  let point = JSON.parse(JSON.stringify(alarm[pointMode]))
  point.mid = (pointMode === MAPMODE.point2D) ? point.mid : point.iid
  let symbol = getSymbolByType(type)
  if (point.mid) { // 有图标信息时
    let icon = point.mid
    if (icon.files && icon.files instanceof Array) {
      for (const file of icon.files) {
        if (file.status === POINTSTATE.ONLINE) {
          symbol.iconStyle.url = file.path
          break
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
      loc: point.loc
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
  let { _id, name } = alarm
  let point = JSON.parse(JSON.stringify(alarm[pointMode]))
  let styleC = JSON.parse(JSON.stringify(areaStyle.alarmAreaStyle2)) // 深拷贝样式
  let pointStyle = point.style ? point.style : styleConfig.defaultLine
  styleC = areaTrans.convertStyleToSymbol(styleC, pointStyle)
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
      loc: point.loc
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
  let { _id, name } = alarm
  let point = JSON.parse(JSON.stringify(alarm[pointMode]))
  let styleC = JSON.parse(JSON.stringify(areaStyle.alarmAreaStyle2)) // 深拷贝样式
  let pointStyle = point.style ? point.style : styleConfig.defaultArea
  styleC = areaTrans.convertStyleToSymbol(styleC, pointStyle)
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
      loc: point.loc
    },
    symbol: styleC
  }
  return feature
}

/**
 * 构造要素
 * @param {*} arr 资源数据
 * @param {*} layerConfig 图层配置参数
 */
function transOneFeature(alarm, layerConfig, pointMode = MAPMODE.point3D) {
  let feature = null
  let { mapsign } = alarm
  let point = JSON.parse(JSON.stringify(alarm[pointMode]))
  if (point && point.loc) {
    if (mapsign && mapsign.signtype) {
      if (mapsign.signtype === MPSIGNKEY.point) { // 点
        feature = getPointFeature(alarm, layerConfig, pointMode)
      } else if (mapsign.signtype === MPSIGNKEY.lineString) { // 线
        feature = getLineStringFeature(alarm, layerConfig, pointMode)
      } else if (mapsign.signtype === MPSIGNKEY.polygon) { // 面
        feature = getPolygonFeature(alarm, layerConfig, pointMode)
      }
    } else {
      feature = getPointFeature(alarm, layerConfig, pointMode)
    }
  }
  return feature
}

/**
 * 根据类型获取图标样式
 * @param {*} type 类型
 */
function getSymbolByType(type) {
  let symbol = SymbolConfig.alarmPointOnlineSymbol
  if (type === RESOURCETYPE.commonAlarm) { // 普通报警
    symbol = SymbolConfig.alarmPointOnlineSymbol
  } else if (type === RESOURCETYPE.fireAlarm) { // 消防报警
    symbol = SymbolConfig.fireAlarmPointSymbol
  } else if (type === RESOURCETYPE.alarmHost) { // 报警主机报警
    symbol = SymbolConfig.alarmHostOnlineSymbol
  }
  return JSON.parse(JSON.stringify(symbol))
}

export default {
  transFeatures,
  transOneFeature
}
