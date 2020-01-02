import {
  GeometryType
} from './GeometryType.js'
import SymbolConfig from './SymbolConfig'
import STATE from './state.js'
import mapUtil from './mapUtil.js'
// 胡红勋新添加
function convertPointDataToFeatures(pointDatas, mapMode) {
  let features = []
  pointDatas.forEach((data, index) => {
    if (data[mapMode] && data[mapMode].loc) {
      let symbol = _getResourceSymbolByType(data) // 当前要添加的feature的样式
      let coods = data.point ? data.point.loc : data.point3D.loc // 位置信息
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
          id: data._id,
          state: STATE.SAVE
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
    }
  })
  return features
}

function _getResourceSymbolByType(data) {
  let symbol = {}
  const {type, monitortype, eid} = data
  if (type === mapUtil.CHANNELTYPE.vedioResource) { // 视频资源
    if (eid && eid.type) { // 判断是否是报警求助设备
      if (eid.type === mapUtil.CHANNELTYPE.alarmColumnResource) { // 报警柱
        symbol = SymbolConfig.alarmColumnSaveSymbol
      } else if (eid.type === mapUtil.CHANNELTYPE.alarmBoxResource) { // 报警箱
        symbol = SymbolConfig.alarmBoxSaveSymbol
      } else {
        symbol = mapUtil.getVedioSymbolByIpcKey(monitortype)
      }
    } else {
      symbol = mapUtil.getVedioSymbolByIpcKey(monitortype)
    }
  }
  if (type === mapUtil.CHANNELTYPE.commonAlarmResource) { // 普通报警
    symbol = SymbolConfig.alarmPointSaveSymbol
  }
  if (type === mapUtil.CHANNELTYPE.fireAlarmResource) { // 消防报警
    symbol = SymbolConfig.fireAlarmPointSaveSymbol
  }
  if (type === mapUtil.CHANNELTYPE.alarmHostResource) { // 报警主机
    symbol = SymbolConfig.alarmHostPointSaveSymbol
  }
  return symbol
}
export default {
  convertPointDataToFeatures
}
