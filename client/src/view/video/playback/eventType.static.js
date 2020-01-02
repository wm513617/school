export default {
  1: '报警输入',
  2: '视频丢失',
  3: '移动侦测',
  4: '视频遮挡',
  5: '镜头移位',
  6: '清晰度异常',
  7: '亮度异常',
  8: '噪声检测',
  9: '偏色控制',
  10: '信号缺失',
  11: '画面冻结',
  12: '周界保护',
  13: '绊线',
  14: '遗留物检测',
  15: '物品丢失',
  16: '人数统计',
  17: '斗殴',
  18: '人员滞留',
  19: '人员贴近',
  20: '哨兵管控',
  21: 'ATM看护',
  22: '车辆识别',
  23: '人脸识别',
  24: '逆行检测',
  25: '徘徊检测',
  26: '黑名单',
  27: '白名单',
  28: '布控',
  29: '区域入侵',
  30: '快速移动',
  31: '停车检测',
  32: '人员聚集',
  33: '物品搬移',
  40: '报警链路异常',
  41: '消防报警',
  42: '消防故障',
  43: '门禁报警',
  45: '报警求助',
  46: '接收求助',
  47: '结束求助',
  48: '重点关注',
  100: '违章逆行',
  101: '违章停车',
  102: '违章左转',
  103: '违章右转',
  500: '硬盘故障',
  501: '硬盘满',
  502: '风扇异常',
  503: '网络断开',
  504: '主板异常',
  505: '通道异常',
  506: '温度异常',
  507: '时间异常',
  508: 'IP地址冲突',
  509: '非法本地访问',
  510: '硬盘坏道',
  511: 'IPC MAC校验异常',
  800: '定时录像',
  512: '手动录像',
  2147483647: '事件标记',
  // 以下为前端回放
  timeVideo: '定时录像',
  eventVideo: '事件录像',
  signVideo: '事件标记',
  vehicleVideo: '车辆',
  faceVideo: '人脸'
}
export const evtType = {
  1: 'alarmInput', // 报警输入 alarmInput
  2: 'alarmVideoLost', // 视频丢失 alarmVideoLost
  3: 'alarmMoveSense', // 移动侦测 alarmMoveSense
  4: 'videoMask', // 视频遮挡 videoMask
  5: 'sceneSwitch', // 镜头移位 sceneSwitch
  6: 'definitionAbnormal', // 清晰度异常 definitionAbnormal
  7: 'brightnessAbnormal', // 亮度异常 brightnessAbnormal
  8: 'noise', // 噪声检测 noise
  9: 'colorCast', // 偏色控制 colorCast
  10: 'signalLoss', // 信号缺失 signalLoss
  11: 'screenFreeze', // 画面冻结 screenFreeze
  12: 'perimeter', // 周界保护 perimeter
  13: 'tripwire', // 绊线 tripwire
  14: 'leftObject', // 遗留物检测 leftObject
  15: 'missingObject', // 物品丢失 missingObject
  16: 'peopleCount', // 人数统计 peopleCount
  17: 'fight', // 斗殴 fight
  18: 'loitering', // 人员滞留 loitering
  19: 'approach', // 人员贴近 approach
  20: 'armyGuard', // 哨兵管控 armyGuard
  21: 'atmCare', // ATM看护 atmCare
  22: 'vehicle', // 车辆识别 vehicle
  23: 'face', // 人脸识别 face
  24: 'retrogradeDetection', // 逆行检测 retrogradeDetection
  25: 'lingerDetection', // 徘徊检测 lingerDetection
  26: 'blackList', // 黑名单 blackList
  27: 'whiteList', // 白名单 whiteList
  28: 'dispatch', // 布控 dispatch
  29: 'areaInvade', // 区域入侵 areaInvade
  30: 'fastMove', // 快速移动 fastMove
  31: 'parkDetect', // 停车检测 parkDetect
  32: 'humanAssemble', // 人员聚集 humanAssemble
  33: 'objectMove', // 物品搬移 objectMove
  41: 'fireAlarm', // 消防报警 fireAlarm
  42: 'fireFailure', // 消防故障 fireFailure
  44: 'violationAlarm',
  45: 'askHelp', // 请求对讲 askHelp
  46: 'acceptHelp', // 接受对讲 accpeptHelp
  47: 'endHelp', // 结束对讲 endHelp
  100: 'vioRetrograde', // 违章逆行 vioRetrograde
  101: 'vioPark', // 违章停车 vioPark
  102: 'vioTurnLeft', // 违章左转 vioTurnLeft
  103: 'vioTurnRight', // 违章右转 vioTurnRight
  500: 'hardDiskFailure', // 硬盘故障 hardDiskFailure
  501: 'hardDiskFull', // 硬盘满 hardDiskFull
  502: 'fanAbnormal', // 风扇异常 fanAbnormal
  503: 'networkDown', // 网络断开 networkDown
  504: 'mainBoardAbnormal', // 主板异常 mainBoardAbnormal
  505: 'channelAbnormal', // 通道异常 channelAbnormal
  506: 'temperatureAbnormal', // 温度异常 temperatureAbnormal
  507: 'timeAbnormal', // 时间异常 timeAbnormal
  508: 'ipConflict', // IP地址冲突 ipConflict
  509: 'illegalNetworkAccess', // 非法本地访问 illegalNetworkAccess
  510: 'damagedDiskSectors', // 硬盘坏道 damagedDiskSectors
  511: 'ipcMacCheckException' // IPC MAC校验异常 ipcMacCheckException
}
