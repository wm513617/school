// 巡更点位要素构造方法
import { GEOMETRYTYPE, MAPMODE, POINTSTATE } from '../../meta/common'
import SymbolConfig from '../../SymbolConfig'

/**
 * 构造要素
 * @param {*} arr 资源数组
 * @param {*} layerConfig 图层配置参数
 */
function transFeatures(arr, layerConfig, pointMode = MAPMODE.point2D) {
  let features = []
  for (let item of arr) {
    let { _id, devName } = item
    let point = JSON.parse(JSON.stringify(item[pointMode]))
    point.mid = (pointMode === MAPMODE.point2D) ? point.mid : point.iid
    let symbol = JSON.parse(JSON.stringify(SymbolConfig.patrolAppSymbol))
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
        points: point.geo
      },
      attributes: {
        id: _id,
        type: layerConfig.name,
        rType: layerConfig.rType, // 资源类型
        loc: point.geo,
        label: devName,
        isOuter: point.isouter
      },
      symbol: symbol
    }
    features.push(feature)
  }
  return features
}

/**
 * 构造单兵要素
 * @param {*} patrol 巡更点位资源数据
 * @param {*} layerConfig 图层配置参数
 */
function transOneFeature(patrol, layerConfig, pointMode = MAPMODE.point2D) {
  let feature = null
  let { _id, devName } = patrol
  let point = JSON.parse(JSON.stringify(patrol[pointMode]))
  point.mid = (pointMode === MAPMODE.point2D) ? point.mid : point.iid
  let symbol = JSON.parse(JSON.stringify(SymbolConfig.patrolAppSymbol))
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
  feature = {
    geom: {
      type: GEOMETRYTYPE.POINT,
      points: point.geo
    },
    attributes: {
      id: _id,
      type: layerConfig.name,
      rType: layerConfig.rType, // 资源类型
      loc: point.geo,
      label: devName
    },
    symbol: symbol
  }
  return feature
}

export default {
  transFeatures,
  transOneFeature
}
