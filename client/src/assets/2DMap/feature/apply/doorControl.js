// 门禁点位要素构造方法
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
    let { _id, name, status } = item
    let point = JSON.parse(JSON.stringify(item[pointMode]))
    point.mid = (pointMode === MAPMODE.point2D) ? point.mid : point.iid
    let symbol = getIconSymbol(status) // 根据状态获取门禁图标
    if (point.mid) { // 有图标信息时
      let icon = point.mid
      if (icon.files && icon.files instanceof Array) {
        for (const file of icon.files) {
          if (file.status === status) {
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
        loc: point.loc,
        isOuter: point.isouter,
        label: name
      },
      symbol: symbol
    }
    features.push(feature)
  }
  return features
}

/**
 * 根据状态获取门禁图标
 * @param {*} status 状态
 */
function getIconSymbol(status) {
  let symbol = SymbolConfig.doorControlOpenSymbol
  switch (status) {
    case POINTSTATE.OPEN: // 门禁-开启
      symbol = SymbolConfig.doorControlOpenSymbol
      break
    case POINTSTATE.CLOSE: // 门禁-关闭
      symbol = SymbolConfig.doorControlCloseSymbol
      break
    case POINTSTATE.ABNORMAL: // 门禁-异常
      symbol = SymbolConfig.doorControlAbnormalSymbol
      break
  }
  return JSON.parse(JSON.stringify(symbol))
}

export default {
  transFeatures
}
