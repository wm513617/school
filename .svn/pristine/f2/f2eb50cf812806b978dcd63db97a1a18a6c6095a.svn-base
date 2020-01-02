// 高亮要素构造方法
import { GEOMETRYTYPE } from '../../meta/common'
import SymbolConfig from '../../SymbolConfig'

function getLocateFeature(id, loc) {
  let feature = null
  if (id) {
    feature = {
      geom: {
        type: GEOMETRYTYPE.POINT,
        points: loc
      },
      attributes: { id, loc },
      symbol: SymbolConfig.hightLightSymbol
    }
  }
  return feature
}

export default {
  getLocateFeature
}
