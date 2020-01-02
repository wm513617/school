import {
  GeometryType
} from '../GeometryType.js'
import SymbolConfig from '../SymbolConfig.js'
/**
 * 加载高亮图标
 * @param {*} id
 * @param {*} loc
 */
function addHightLightIcon(id, loc) {
  let hightList = []
  if (id) {
    let feature = {
      geom: {
        type: GeometryType.POINT,
        points: loc
      },
      attributes: {
        id,
        loc
      },
      symbol: SymbolConfig.hightLightSymbol
    }
    hightList.push(feature)
  }
  return hightList
}
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
export default {
  addHightLightIcon,
  getFeatureById
}
