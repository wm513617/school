/**
 * 人脸系统常量
 * @time: 2017-7-14
 * @author: hansen
 */
const FACE = {
  'GRANULARITY': { // 时间颗粒度
    'DAY': 2, // 时间颗粒度 天
    'HOUR': 1, // 时间颗粒度 小时
    'RANGE': [1, 2] // 时间颗粒度 取值范围
  },
  'SUMMARY': { // 资源统计类型
    'MUTILPART': 0, // 统计所有资源
    'SINGLE': 1, // 统计单个资源
    'RANGE': [0, 1] // 统计取值范围
  },
  'PEOPLE': { // 人员类型
    'SUBJECT': 0, // 员工
    'VISITOR': 1, // 访客
    'VIP': 2, // vip
    'BLACK': 3, // 黑名单
    'WHITE': 4, // 白名单
    'ATTENTION': 5, // 布控
    'STRANGER': 6, // 陌生人
    'COMPARSION': 7, // 对比识别
    'NORMAL': [0, 1, 2], // 旷视人员类型
    'UNUSUAL': [3, 4, 5], // 平台人脸类型
    'NORMALSTATIC': [0, 1, 2, 6], // 旷视人员统计类型
    'UNUSUALSTATIC': [3, 4, 5, 7], // 抓拍人员统计类型
    'TYPES': [0, 1, 2, 3, 4, 5, 6] // 平台人脸统计类型
  },
  'CONTINUITY': { // 查询参数 时间范围
    'RANGE': [0, 1] // 查询参数 0|false|时间不连续 1|true|时间连续
  },
  'PASSWAY': { // 出入园
    'NORMAL': 0,
    'ENTRY': 1, // 入园
    'EXIT': 2 // 出园
  },
  'ZHPASSWAY': { // 出入园
    'ZHNORMAL': '普通',
    'ZHENTRY': '入园', // 入园
    'ZHEXIT': '出园' // 出园
  },
  SYS: { // 系统类型
    'PASS': 0, // 通行系统
    'CAPUTRUE': 1 // 抓批系统
  },
  'GENDER': { // 性别
    'MALE': 1, // 男性
    'FEMALE': 0 // 女性
  },
  'ATTENTION': { // 布控状态
    'PREBEGIN': 0, // 未布控
    'GOING': 1, // 布控中
    'STOP': 2 // 布控状态
  },
  'ALARM': {
    'PEOPLE': 2
  },
  'ORG': {
    'FACE': 2
  },
  'SERVERCFG': {
    'TYPE': 0
  }
}
exports.FACE = FACE
