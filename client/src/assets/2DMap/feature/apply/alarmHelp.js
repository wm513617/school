// 报警求助点位要素构造方法
import { GEOMETRYTYPE, RESOURCETYPE, POINTSTATE, MAPMODE } from '../../meta/common'
import SymbolConfig from '../../SymbolConfig'

/**
 * 构造要素
 * @param {*} arr 资源数组
 * @param {*} layerConfig 图层配置参数
 */
function transFeatures(arr, layerConfig, pointMode = MAPMODE.point2D) {
  let features = []
  for (let item of arr) {
    let { _id, name, eid } = item
    let point = JSON.parse(JSON.stringify(item[pointMode]))
    point.mid = (pointMode === MAPMODE.point2D) ? point.mid : point.iid
    let symbol = getSymbolByEidType(eid)
    if (point.mid && eid) { // 有图标信息时
      let icon = point.mid
      if (icon.files && icon.files instanceof Array) {
        for (const file of icon.files) {
          if (!eid.hasOwnProperty('deviceStatus') || eid.deviceStatus) { // 启用
            if (file.status === POINTSTATE.ONLINE) { // 在线
              symbol.iconStyle.url = file.path
              break
            }
          } else {
            if (file.status === POINTSTATE.UNUSE) { // 禁用
              symbol.iconStyle.url = file.path
              break
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
        loc: point.loc,
        label: name,
        isOuter: point.isouter
      },
      symbol: symbol
    }
    features.push(feature)
  }
  return features
}

/**
 * 获取点位图标信息
 * @param {*} eid 资源设备信息
 */
function getSymbolByEidType(eid) {
  let symbol = JSON.parse(JSON.stringify(SymbolConfig.alarmBoxSaveSymbol))
  if (eid && eid.type) {
    if (eid.type === RESOURCETYPE.alarmColumn) { // 报警柱
      symbol = JSON.parse(JSON.stringify(SymbolConfig.alarmColumnSaveSymbol))
    } else if (eid.type === RESOURCETYPE.alarmBox) { // 报警箱
      symbol = JSON.parse(JSON.stringify(SymbolConfig.alarmBoxSaveSymbol))
    }
  }
  return JSON.parse(JSON.stringify(symbol))
}

/**
 * 构造单兵要素
 * @param {*} alarmHelp 报警求助点位资源数据
 * @param {*} layerConfig 图层配置参数
 */
function transOneFeature(alarmHelp, layerConfig) {
  let { _id, name, point, eid } = alarmHelp
  let feature = null
  let symbol = getSymbolByEidType(eid)
  if (point.mid) { // 有图标信息时
    let icon = point.mid
    for (const file of icon.files) {
      if (file.status === POINTSTATE.ONLINE) {
        symbol.iconStyle.url = file.path
        break
      }
    }
  }
  feature = {
    geom: {
      type: GEOMETRYTYPE.POINT,
      points: point.loc
    },
    attributes: {
      id: _id,
      type: layerConfig.name,
      rType: layerConfig.rType, // 资源类型
      loc: point.loc,
      label: name,
      isOuter: point.isouter
    },
    symbol: symbol
  }
  return feature
}

export default {
  transFeatures,
  transOneFeature
}
