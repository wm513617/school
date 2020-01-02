import {
  GeometryType
} from './GeometryType.js'
import SymbolConfig from './SymbolConfig'
// 将巡更点位数据转换为地图要素--胡红勋添加
function convertPatrolPointToFeature(datas, mapMode) {
  let patrols = []
  datas.forEach(data => {
    let coods = (data.point && data.point.geo) ? data.point.geo : data.point3D.geo
    if (mapMode && data[mapMode] && data[mapMode].geo) {
      coods = data[mapMode].geo
    }
    let feature = {
      geom: {
        type: GeometryType.POINT,
        points: coods
      },
      attributes: {
        id: data._id,
        type: data.device
      },
      symbol: SymbolConfig.patrolAppSymbol
    }
    feature.attributes.bid = data.point ? data.point.bid : data.point3D.bid
    feature.attributes.sid = data.point ? data.point.sid : data.point3D.sid
    patrols.push(feature)
  })
  return patrols
}
export default {
  convertPatrolPointToFeature
}
