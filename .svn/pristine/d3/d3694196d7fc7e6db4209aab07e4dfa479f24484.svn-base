const g1 = ['alarmInput']
const g2 = ['alarmZone', 'alarmGT']
const g3 = ['alarmMoveSense', 'videoMask', 'sceneSwitch', 'definitionAbnormal', 'brightnessAbnormal', 'screenFreeze', 'noise', 'signalLoss', 'colorCast']
const g4 = ['focusAttention']
const g5 = ['perimeter', 'tripwire', 'leftObject', 'missingObject', 'loitering', 'retrogradeDetection', 'lingerDetection', 'doubleCordon', 'blackList', 'whiteList', 'dispatch', 'areaInvade', 'fastMove', 'parkDetect', 'humanAssemble', 'objectMove']
const g6 = ['vioRetrograde', 'vioPark', 'vioTurnLeft', 'vioTurnRight']
const g7 = ['faceControl']
const g8 = ['askHelp', 'acceptHelp', 'endHelp']
const g9 = ['fireAlarm', 'fireFailure']
const g10 = ['soldier', 'individualAlarm']
const g11 = ['patrol', 'patrolAlarm']
const g12 = ['manualAlarm']
const getName = type => {
  const name =
    (g1.includes(type) && '报警输入') ||
    (g2.includes(type) && '报警防区') ||
    (g3.includes(type) && '监控点报警') ||
    (g4.includes(type) && '重点关注') ||
    (g5.includes(type) && '智能报警') ||
    (g6.includes(type) && '违章报警') ||
    (g7.includes(type) && '人像布控') ||
    (g8.includes(type) && '报警求助') ||
    (g9.includes(type) && '消防报警') ||
    (g10.includes(type) && '单兵一键报警') ||
    (g11.includes(type) && '巡更异常报警') ||
    (g12.includes(type) && '手工报警')

  return name
}

const moment = require('moment')

const formatTime = (v) => {
  return v ? moment(v * 1000).format('YYYY-MM-DD HH:mm:ss') : null
}

const getProcess = type => {
  const v =
    (type === 'ignore' && '已清除') ||
    (type === 'process' && '已确认') ||
    (type === 'unProcess' && '未确认') || '未知的类型'

  return v
}

const getSubType = subType => {
  const v =
    (subType === 'perimeterAlarm' && '周界保护') ||
    (subType === 'intrusionAlarm' && '入侵报警') ||
    (subType === 'electricFence' && '电子围栏') ||
    (subType === 'helpSeek' && '报警求助') ||
    (subType === 'smoke' && '感烟') ||
    (subType === 'temperature' && '感温') ||
    (subType === 'hydrant' && '消火栓') ||
    (subType === 'handNewspaper' && '手报') || '未知类型'

  return v
}

const carDirect = {
  '0': '东->西',
  '1': '西->东',
  '2': '南->北',
  '3': '北->南',
  '4': '东南->西北',
  '5': '西北->东南',
  '6': '东北->西南',
  '7': '西南->东北'
}

const carTypeList = {
  '0': '未识别',
  '15': '轻便摩托车',
  '1': '小型汽车',
  '16': '机动车',
  '2': '大型汽车',
  '17': '公交车',
  '3': '使馆汽车',
  '18': '摩托车',
  '4': '领馆汽车',
  '19': '客车',
  '5': '境外汽车',
  '20': '大货车',
  '6': '外籍汽车',
  '21': '中货车',
  '7': '低速汽车',
  '22': '轿车',
  '8': '拖拉机',
  '23': '面包车',
  '9': '挂车',
  '24': '小货车',
  '10': '教练车',
  '256': '非机动车',
  '11': '临时行驶车',
  '257': '自行车',
  '12': '警用汽车',
  '258': '三轮车',
  '13': '警用摩托车',
  '512': '行人',
  '14': '普通摩托车',
  '513': '军用汽车'
}

module.exports = {
  getName,
  formatTime,
  getProcess,
  getSubType,
  carDirect,
  carTypeList
}

