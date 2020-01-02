import DrawSymbol from '../DrawSymbol.js'
import { GeometryType } from '../GeometryType.js'
import SymbolConfig from '../SymbolConfig.js'
import STATE from './state.js'
import ipcUtil from './ipcUtil.js'
// 胡红勋新添加
function convertPointDataToFeatures(pointDatas) {
  let features = []
  pointDatas.forEach((data, index) => {
    let symbol = getAlarmHelpSaveSymbol(data.type) // 当前要添加的feature的样式
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
    features.push(feature)
  })
  return features
}
// 胡红勋 添加根据报警求助类型，选择绘制符号
function getDrawTypeByAlarmHelpType(type) {
  let symbol = ''
  if (ipcUtil.CHANNELTYPE.alarmBoxResource === type) {
    symbol = DrawSymbol.alarmBoxDrawSymbol
  }
  if (ipcUtil.CHANNELTYPE.alarmColumnResource === type) {
    symbol = DrawSymbol.alarmColumnDrawSymbol
  }
  return symbol
}
function getAlarmHelpSaveSymbol(type) {
  let symbol = ''
  if (ipcUtil.CHANNELTYPE.alarmBoxResource === type) {
    symbol = SymbolConfig.alarmBoxSaveSymbol
  }
  if (ipcUtil.CHANNELTYPE.alarmColumnResource === type) {
    symbol = SymbolConfig.alarmColumnSaveSymbol
  }
  return symbol
}
export default {
  convertPointDataToFeatures,
  getDrawTypeByAlarmHelpType
}
