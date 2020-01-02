import {
  GeometryType
} from '../GeometryType.js'
import SymbolConfig from '../SymbolConfig'
import STATE from '../edit/state.js'
import ipcUtil from '../edit/ipcUtil.js'
// 胡红勋新添加
function convertPointDataToFeatures(pointDatas) {
  let features = []
  pointDatas.forEach((data, index) => {
    let symbol = getResourceSymbolByType(data) // 当前要添加的feature的样式
    let coods = data.point ? data.point.loc : data.point3D.loc
    let feature = {
      geom: {
        type: GeometryType.POINT,
        points: coods
      },
      attributes: {
        id: data._id,
        type: data.type,
        state: STATE.SAVE
      },
      symbol: symbol
    }
    // 如果该点位为视频通道资源------
    if (data.type === ipcUtil.CHANNELTYPE.vedioResource) {
      feature.attributes.monitorType = data.monitortype
    }
    features.push(feature)
  })
  return features
}
function getResourceSymbolByType(data) {
  let symbol = {}
  const {type, status, monitortype} = data
  if (type === ipcUtil.CHANNELTYPE.vedioResource) {
    symbol = ipcUtil.getStorageVedioSymbolByIpcTypeAndState(monitortype, status)
  }
  if (type === ipcUtil.CHANNELTYPE.commonAlarmResource) {
    if (status === 1) {
      symbol = SymbolConfig.alarmPointOnlineSymbol
    }
    if (status === 0) {
      symbol = SymbolConfig.alarmPointOfflineSymbol
    }
  }
  if (type === ipcUtil.CHANNELTYPE.fireAlarmResource) {
    if (status === 1) {
      symbol = SymbolConfig.fireAlarmPointSymbol
    }
    if (status === 0) {
      symbol = SymbolConfig.fireAlarmPointSymbol
    }
  }
  if (type === ipcUtil.CHANNELTYPE.alarmHostResource) {
    if (status === 1) {
      symbol = SymbolConfig.alarmPointOnlineSymbol
    }
    if (status === 0) {
      symbol = SymbolConfig.alarmPointOfflineSymbol
    }
  }
  if (type === ipcUtil.CHANNELTYPE.alarmBoxResource) {
    if (status === 1) {
      symbol = SymbolConfig.alarmBoxSaveSymbol
    }
    if (status === 0) {
      symbol = SymbolConfig.alarmBoxSaveSymbol
    }
  }
  if (type === ipcUtil.CHANNELTYPE.alarmColumnResource) {
    if (status === 1) {
      symbol = SymbolConfig.alarmColumnSaveSymbol
    }
    if (status === 0) {
      symbol = SymbolConfig.alarmColumnSaveSymbol
    }
  }
  return symbol
}
export default {
  convertPointDataToFeatures
}
