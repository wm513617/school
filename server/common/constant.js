// 一些报警常量
module.exports = {
  deviceAlarmHash: [
    'sd卡故障',
    'sd卡满',
    '网络断开',
    'ip冲突',
    '时间异常',
    '非法网络访问' // 设备报警
  ],
  monitoryPointAlarmHash: [
    // 监控点报警
    '移动侦测',
    '视频遮挡',
    '镜头移位',
    '清晰度异常',
    '亮度异常',
    '噪声检测',
    '偏色检测',
    '信号缺失',
    '画面冻结'
  ],
  intelligentAlarmHash: [
    // 智能报警
    '周界保护',
    '绊线',
    '物品丢失',
    '物品遗留',
    '非法停留',
    '逆行检测',
    '徘徊检测',
    '双警戒线',
    '黑名单',
    '白名单',
    '布控',
    '红名单'
  ],
  deviceAlarm: ['hardDiskFailure', 'hardDiskFull', 'networkDown', 'ipConflict', 'timeAbnormal', 'illegalNetworkAccess'],
  monitoryPointAlarm: [
    'alarmMoveSense',
    'videoMask',
    'sceneSwitch',
    'definitionAbnormal',
    'brightnessAbnormal',
    'noise',
    'colorCast',
    'signalLoss',
    'screenFreeze'
  ],
  intelligentAlarm: [
    'perimeter',
    'tripwire',
    'missingObject',
    'leftObject',
    'loitering',
    'retrogradeDetection',
    'LingerDetection',
    'doubleCordon',
    'blackList',
    'whiteList',
    'dispatch',
    'redList'
  ],
  // 机构类型,值班管理班组类型为7
  organizationType: [7],
  // 通道默认名称
  RES_DEFAULT_NAME: {
    0: '视频通道',
    1: '报警输入',
    2: '报警输出',
    3: '对讲通道',
    4: '门禁通道',
    5: '解码通道',
    6: '音频通道',
    7: '报警输入',
    8: '报警输出',
    9: '报警防区',
    10: '报警输出',
    11: '防区输入',
    12: '防区输出',
    15: '输入源'
  },
  // 机构类型
  ORG_TYPE: {
    LOCALE: 0, // 现场
    VEHICLE: 1, // 车辆
    FACE: 2, // 人脸
    SENTRY: 3, // 单兵
    PATROL: 4, // 巡更
    EMERGENCY_PLAN: 5, // 应急预案
    FACE_CAPTURE: 6, // 人脸抓拍
    DUTY_PERSON: 7, // 班组列表
    VIDEO_STRUCTURE: 8 // 视频结构化
  },
  // 设备类型
  DEV_TYPE: {
    VIDEO: 0,
    ALARMHOST: 1,
    DOOR_ACCESS: 2,
    TALKBACK: 3,
    PATROL: 4,
    DECODER: 5,
    KEYBOARD: 6,
    FIREHOST: 7,
    TRAFFIC: 8,
    FINE_TRACK: 9
  },
  // 资源类型
  RES_TYPE: {
    VIDEO: 0,
    VIDEO_ALARM_IN: 1,
    VIDEO_ALARM_OUT: 2,
    TALKBACK: 3,
    DOOR_ACCESS: 4,
    DECODER: 5,
    VOICE: 6,
    DECODER_ALARM_IN: 7,
    DECODER_ALARM_OUT: 8,
    ALARMHOST_ALARM_IN: 9,
    ALARMHOST_ALARM_OUT: 10,
    FIRE_ALARM_IN: 11,
    FIRE_ALARM_OUT: 12,
    JOINT_INPUT: 15
  },
  CONTENT_TYPE: {
    css: 'text/css',
    gif: 'image/gif',
    html: 'text/html',
    ico: 'image/x-icon',
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    js: 'text/javascript',
    json: 'application/json',
    pdf: 'application/pdf',
    png: 'image/png',
    svg: 'image/svg+xml',
    swf: 'application/x-shockwave-flash',
    tiff: 'image/tiff',
    txt: 'text/plain',
    wav: 'audio/x-wav',
    wma: 'audio/x-ms-wma',
    wmv: 'video/x-ms-wmv',
    xml: 'text/xml',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    mp3: 'audio/mp3',
    '3gp': 'application/octet-stream'
  },
  ROLE_ID: '5be27279e74ee9376c681111' // 超级管理员角色id
}
