const CONSTANT = require('./constant')


const COMMON = {
  orgName: '机构',
  level: '报警级别',
  'ackContent.alarmDeal': '警情处理',
  'ackContent.situationType': '警情类型',
  'ackContent.alarmContent': '警情信息'
}

// 报警输入
const alarmInput = {
  name: '报警名称',
  srcName: '报警源',
  eventType: {
    name: '报警分类',
    format: (type) => CONSTANT.getName(type)
  },
  subtype: {
    name: '报警子类型',
    format: (subType) => CONSTANT.getSubType(subType)
  },
  time: {
    name: '报警时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  endTime: {
    name: '停止时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  dealState: {
    name: '处理状态',
    format: (type) => CONSTANT.getProcess(type)
  },
  ackTime: {
    name: '确认时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  ...COMMON
}

// 报警防区
const alarmZone = alarmInput
const alarmGT = alarmInput

// 监控点报警
const alarmMoveSense = {
  name: '通道名称',
  eventType: {
    name: '报警分类',
    format: (type) => CONSTANT.getName(type)
  },
  subType: '报警类型',
  time: {
    name: '报警时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  endTime: {
    name: '停止时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  dealState: {
    name: '处理状态',
    format: (type) => CONSTANT.getProcess(type)
  },
  ackTime: {
    name: '确认时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  ...COMMON
}
const videoMask = alarmMoveSense
const sceneSwitch = alarmMoveSense
const definitionAbnormal = alarmMoveSense
const brightnessAbnormal = alarmMoveSense
const screenFreeze = alarmMoveSense
const noise = alarmMoveSense
const signalLoss = alarmMoveSense
const colorCast = alarmMoveSense

// 重点关注
const { endTime, ...other } = alarmMoveSense
const focusAttention = {
  ...other,
  attentionType: '报警子类型',
  userName: '发起人'
}

// 智能报警
const perimeter = alarmMoveSense
const tripwire = alarmMoveSense
const leftObject = alarmMoveSense
const missingObject = alarmMoveSense
const loitering = alarmMoveSense
const retrogradeDetection = alarmMoveSense
const lingerDetection = alarmMoveSense
const doubleCordon = alarmMoveSense
const blackList = alarmMoveSense
const whiteList = alarmMoveSense
const dispatch = alarmMoveSense
const areaInvade = alarmMoveSense
const fastMove = alarmMoveSense
const parkDetect = alarmMoveSense
const humanAssemble = alarmMoveSense
const objectMove = alarmMoveSense

// 违章报警
const vioRetrograde = {
  ...other,
  carNum: '车牌号码',
  carType: {
    name: '车辆类型',
    format: (key) => CONSTANT.carTypeList[key]
  },
  carDirect: {
    name: '行车方向',
    format: (key) => CONSTANT.carDirect[key]
  }
}
const vioPark = vioRetrograde
const vioTurnLeft = vioRetrograde
const vioTurnRight = vioRetrograde

// 人像布控
const faceControl = {
  ...other,
  similar: '相似度',
  defenseTime: '布控时间',
  remark: '备注',
  userName: '人员姓名',
  age: '年龄',
  userGender: '性别',
  userCode: '身份证号',
  groupName: '底库信息'
}

// 报警求助
const askHelp = {
  name: '设备名称',
  eventType: {
    name: '报警分类',
    format: (type) => CONSTANT.getName(type)
  },
  askId: '对讲ID',
  level: '报警级别',
  time: {
    name: '报警时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  ackTime: {
    name: '确认时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  endTime: {
    name: '停止时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  dealState: {
    name: '处理状态',
    format: (type) => CONSTANT.getProcess(type)
  },
  ...COMMON
}
const acceptHelp = askHelp
const endHelp = askHelp

// 消防报警
const fireAlarm = alarmInput
const fireFailure = alarmInput

// 单兵一键报警
const soldier = {
  eventType: {
    name: '报警类型',
    format: (type) => CONSTANT.getName(type)
  },
  'message.realname': '报警人',
  dealState: {
    name: '处理状态',
    format: (type) => CONSTANT.getProcess(type)
  },
  time: {
    name: '报警时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  ackTime: {
    name: '确认时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  ...COMMON
}
const individualAlarm = soldier

// 巡更异常报警
const patrol = {
  eventType: {
    name: '报警类型',
    format: (type) => CONSTANT.getName(type)
  },
  dealState: {
    name: '处理状态',
    format: (type) => CONSTANT.getProcess(type)
  },
  ackTime: {
    name: '确认时间',
    format: (v) => CONSTANT.formatTime(v)
  },
  sender: '报警人',
  'message.position': '位置',
  charger: '点位管理员',
  phone: '负责人电话',
  ...COMMON
}
const patrolAlarm = patrol

// 手工报警
const manualAlarm = {
  eventType: {
    name: '报警分类',
    format: (type) => CONSTANT.getName(type)
  },
  dealState: {
    name: '处理状态',
    format: (type) => CONSTANT.getProcess(type)
  },
  ...COMMON,
  orgName: '机构',
  scrName: '名称',
  level: '报警级别',
  time: {
    name: '报警时间',
    format: (v) => CONSTANT.formatTime(v)
  },
}

module.exports = {
  alarmInput,
  alarmZone,
  alarmGT,
  alarmMoveSense,
  videoMask,
  sceneSwitch,
  definitionAbnormal,
  brightnessAbnormal,
  screenFreeze,
  noise,
  signalLoss,
  colorCast,
  focusAttention,
  perimeter,
  tripwire,
  leftObject,
  missingObject,
  loitering,
  retrogradeDetection,
  lingerDetection,
  doubleCordon,
  blackList,
  whiteList,
  dispatch,
  areaInvade,
  fastMove,
  parkDetect,
  humanAssemble,
  objectMove,
  vioRetrograde,
  vioPark,
  vioTurnLeft,
  vioTurnRight,
  faceControl,
  askHelp,
  acceptHelp,
  endHelp,
  fireAlarm,
  fireFailure,
  individualAlarm,
  soldier,
  patrolAlarm,
  patrol,
  manualAlarm
}