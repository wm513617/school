import {
  mapAlarmFiltering, mapAllAlarmData
} from 'src/http/alarm.api'
import { read } from '../../../storage/index'
import { getType } from 'assets/2DMap/utils/common.js'
import { getCommonResourceByIdApi } from 'http/map2d'
import map2DApply from './map2DApplyInteractive'
const state = {
  alarmData: {
    // 普通报警
    normalAlarm: {
      alarmInput: 'alarmInput',
      alarmOut: 'alarmOut'
    },
    // 智能报警
    intelligent: {
      perimeter: 'perimeter',
      tripwire: 'tripwire',
      leftObject: 'leftObject',
      missingObject: 'missingObject',
      loitering: 'loitering',
      retrogradeDetection: 'retrogradeDetection',
      lingerDetection: 'lingerDetection',
      doubleCordon: 'doubleCordon',
      blackList: 'blackList',
      whiteList: 'whiteList',
      dispatch: 'dispatch',
      areaInvade: 'areaInvade',
      fastMove: 'fastMove',
      parkDetect: 'parkDetect',
      humanAssemble: 'humanAssemble',
      objectMove: 'objectMove'
    },
    // 违章报警
    violation: {
      vioRetrograde: 'vioRetrograde',
      vioPark: 'vioPark',
      vioTurnLeft: 'vioTurnLeft',
      vioTurnRight: 'vioTurnRight'
    },
    // 视频报警
    video: {
      focusAttention: 'focusAttention',
      alarmMoveSense: 'alarmMoveSense',
      videoMask: 'videoMask',
      sceneSwitch: 'sceneSwitch',
      definitionAbnormal: 'definitionAbnormal',
      brightnessAbnormal: 'brightnessAbnormal',
      screenFreeze: 'screenFreeze',
      noise: 'noise',
      signalLoss: 'signalLoss',
      colorCast: 'colorCast'
    }
  },
  alarmType: {
    perimeterAlarm: '周界报警',
    intrusionAlarm: '入侵报警',
    electricFence: '电子围栏',
    alarmInput: '报警输入',
    alarmOut: '报警输出',
    helpSeek: '报警求助',
    focusAttention: '重点关注',
    // 智能类
    perimeter: '周界保护',
    tripwire: '绊线',
    leftObject: '物品遗留',
    missingObject: '物品丢失',
    loitering: '非法停留',
    retrogradeDetection: '逆行检测',
    lingerDetection: '徘徊检测',
    doubleCordon: '双警戒线',
    blackList: '黑名单',
    whiteList: '白名单',
    dispatch: '布控',
    areaInvade: '区域入侵',
    fastMove: '快速移动',
    parkDetect: '停车检测',
    humanAssemble: '人员聚集',
    objectMove: '物品搬移',
    // 人像布控
    faceControl: '人像布控',
    // 监控点类
    alarmMoveSense: '移动侦测',
    videoMask: '视频遮挡',
    sceneSwitch: '镜头移位',
    definitionAbnormal: '清晰度异常',
    brightnessAbnormal: '亮度异常',
    screenFreeze: '画面冻结',
    noise: '噪声检测',
    signalLoss: '信号缺失',
    colorCast: '偏色检测',
    // 消防类
    fireAlarm: '消防报警',
    fireFailure: '消防故障',
    smoke: '感烟',
    temperature: '感温',
    hydrant: '消防栓',
    handNewspaper: '手报',
    // 违章报警
    vioRetrograde: '违章逆行',
    vioPark: '违章停车',
    vioTurnLeft: '违章左转',
    vioTurnRight: '违章右转',
    // 报警求助
    askHelp: '请求对讲',
    acceptHelp: '正在对讲',
    endHelp: '结束对讲',
    // 设备报警
    hardDiskFailure: 'sd卡故障',
    hardDiskFull: 'sd卡满',
    networkDown: '网络断开',
    ipConflict: 'IP冲突',
    timeAbnormal: '时间异常',
    illegalNetworkAccess: '非法网络访问',
    // 其他
    alarmVideoLost: '视频丢失',
    vehicleBlack: '车辆识别黑名单',
    vehicleWhite: '车辆白名单',
    vehicleDispatch: '车辆布控',
    faceBlack: '人脸识别',
    faceWhite: '人脸白名单',
    faceDispatch: '人脸布控',
    peopleCount: '人数统计',
    fight: '斗殴',
    approach: '人员贴近',
    armyGuard: '哨兵管控',
    atmCare: 'ATM看护',
    fanAbnormal: '风扇异常',
    mainBoardAbnormal: '主板异常',
    channelAbnormal: '通道异常',
    temperatureAbnormal: '温度异常',
    damagedDiskSectors: '硬盘坏道',
    ipcMacCheckException: 'MAC校验异常'
  },
  carTypeList: {
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
  },
  carDirectList: {
    '0': '东->西',
    '1': '西->东',
    '2': '南->北',
    '3': '北->南',
    '4': '东南->西北',
    '5': '西北->东南',
    '6': '东北->西南',
    '7': '西南->东北'
  },
  alarmModalType: '', // 当前报警视频弹框类型
  showVideo: false,
  isModalSureOrClean: false, // 当前报警弹框是否清除报警或确认报警成功
  itemAlarmInput: {},
  normalAlarmList: [], // 普通报警列表
  fireAlarmList: [], // 消防报警列表
  alarmHelpList: [], // 报警求助列表
  videoAlarmList: [], // 视频报警列表
  intelligentAlarmList: [], // 智能报警列表
  alarmNewOne: {}, // 最新的 报警数据
  sixTypeAlarmPointList: [], // 楼外报警列表 包含:普通报警 报警主机 消防报警 巡更报警 单兵报警
  allVideoAlarmPointList: [], // 楼外报警列表 包含: 视频报警  智能报警
  sosAlarmPointList: [], // 楼外报警列表 包含: 报警求助
  outerAlarmingTag: 0, // 楼外 实时点位报警tag
  outerAlarmPointFeatures: [], // 楼外 实时点位报警要素
  outerAlarmPointLabels: [], // 点位报警 名称要素
  sixTypeAlarmBuildList: [], // 楼内报警列表
  allVideoAlarmBuildList: [], // 楼内报警列表
  sosAlarmBuildList: [], // 楼内报警列表
  buildingAlarmingTag: 0, // 楼内 实时点位报警tag
  buildingAlarmingFeatures: [], // 楼内 实时点位报警要素
  buildingAreaAlarmingFeatures: [], // 楼外 实时楼宇区域报警
  confirmedNewAlarm: null, // 已确认的最新一条报警信息
  activeAlarmInfo: null, // 当前选中的报警信息
  streamType: {
    1: 'main',
    2: 'sub1',
    3: 'sub2',
    4: 'pic'
  },
  activeAlarmTag: 0,
  // 人像轨迹相关
  faceTrackDrawMap: new Map(), // 人脸轨迹绘制轨迹map（key：用户标识，value: 对应的绘制工具）
  pointFaceNodeMap: new Map(), // 人脸点位节点map(key: 人脸设备点位标识， value：对应点位的人脸头像数组)
  faceHeadMap: new Map(), // 人脸头像数组
  faceHeads: [], // 人脸头像数组
  selectedFaceAlarmMap: new Map(), // 选中的人脸报警map（key：用户标识，value: 人脸报警数据）
  selectedFaceAlarmArr: [], // 选中的人脸报警数组
  videoAlarmIdInfo: {}, // 视频类报警资源 id: {type: alarmTypeToMap, url: symbolUrl}
  sosAlarmIdInfo: {}, // 报警求助报警资源 id: {type: alarmTypeToMap, url: symbolUrl}
  buildingIdInfo: {}, // 报警楼宇资源 id: {获取的楼宇信息}
  isReportPolice: false, // 一键报案弹窗
  reportPoliceResource: [],
  alarmChangeInfo: '',
  singleTimeoutList: [],
  singleTimeoutAlarmFeatures: [], // 超时定点报警要素
  alarmTabData: [], // 楼内报警列表
  curBuildData: {},
  faceImageUrl: '' // 从人像报警跳轨迹追踪的人像路径
}

const getters = {
  alarmTypeList(state) {
    return state.alarmType
  },
  alarmTypeData(state) {
    return state.alarmData
  },
  carType(state) {
    return state.carTypeList
  },
  carDirect(state) {
    return state.carDirectList
  },
  // 楼外实时点位报警 列表
  sixTypeAlarmPointList(state) {
    return state.sixTypeAlarmPointList
  },
  allVideoAlarmPointList(state) {
    return state.allVideoAlarmPointList
  },
  sosAlarmPointList(state) {
    return state.sosAlarmPointList
  },
  // 楼外实时点位报警 要素
  outerAlarmPointFeatures(state) {
    return state.outerAlarmPointFeatures
  },
  outerAlarmPointLabels: state => { // 获取报警名称要素
    return state.outerAlarmPointLabels
  },
  // 楼外实时点位报警 列表更新 tag
  outerAlarming(state) {
    return state.outerAlarmingTag
  },
  // 楼内实时点位报警 列表
  sixTypeAlarmBuildList(state) {
    return state.sixTypeAlarmBuildList
  },
  allVideoAlarmBuildList(state) {
    return state.allVideoAlarmBuildList
  },
  sosAlarmBuildList(state) {
    return state.sosAlarmBuildList
  },
  // 楼内实时点位报警 要素
  buildingAlarmingFeatures(state) {
    return state.buildingAlarmingFeatures
  },
  // 楼内实时点位报警 列表更新 tag
  buildingAlarming(state) {
    return state.buildingAlarmingTag
  },
  // 楼外 实时楼宇区域报警
  buildingAreaAlarmingFeatures(state) {
    return state.buildingAreaAlarmingFeatures
  },
  // 超时定点报警
  singleTimeoutList(state) {
    return state.singleTimeoutList
  },
  singleTimeoutAlarmFeatures(state) {
    return state.singleTimeoutAlarmFeatures
  }
}

const mutations = {
  GET_ALARM_MODAL_TYPE(state, data) {
    state.alarmModalType = data
  },
  CHANGE_SHOWVIDEO(state, data) {
    state.showVideo = data
  },
  CHANGE_REPORT_POLICE(state, data) {
    state.isReportPolice = data
  },
  CHANGE_REPORT_POLICE_RESOURCE(state, data) {
    state.reportPoliceResource = data
  },
  SAVE_ITEM_ALARM_INPUT(state, payload) {
    state.itemAlarmInput = payload
  },
  SAVE_NORMAL_ALARM_LIST(state, payload) {
    state.normalAlarmList = JSON.parse(JSON.stringify(payload))
  },
  SAVE_FIRE_ALARM_LIST(state, payload) {
    state.fireAlarmList = JSON.parse(JSON.stringify(payload))
  },
  SAVE_ALARM_HELP_LIST(state, payload) {
    state.alarmHelpList = JSON.parse(JSON.stringify(payload))
  },
  SAVE_VIDEO_ALARM_LIST(state, payload) {
    state.videoAlarmList = JSON.parse(JSON.stringify(payload))
  },
  SAVE_INTELLIGENT_ALARM_LIST(state, payload) {
    state.intelligentAlarmList = JSON.parse(JSON.stringify(payload))
  },
  CHANGE_FACE_TRAIL_STATUS(state, payload) {
    const list = JSON.parse(JSON.stringify(state.intelligentAlarmList))
    for (let i = 0; i < list.length; i++) {
      if (list[i].alarmId === payload.alarmId) {
        list[i] = payload
        state.intelligentAlarmList = list
        break
      }
    }
  },
  CLEAR_ALL_ALARM_LIST(state) {
    state.normalAlarmList = []
    state.fireAlarmList = []
    state.alarmHelpList = []
    state.videoAlarmList = []
    state.intelligentAlarmList = []
  },
  SAVE_ISMODAL_SURE_OR_CLEAN(state, data) {
    state.isModalSureOrClean = data
  },
  // 楼外实时点位报警 列表
  SET_SIX_TYPE_ALARM_POINT_LIST(state, arr) {
    state.sixTypeAlarmPointList = arr
    state.outerAlarmingTag++
  },
  SET_ALLVIDEO_ALARM_POINT_LIST(state, arr) {
    state.allVideoAlarmPointList = arr
    state.outerAlarmingTag++
  },
  SET_SOS_ALARM_POINT_LIST(state, arr) {
    state.sosAlarmPointList = arr
    state.outerAlarmingTag++
  },
  // 楼外实时点位报警 要素
  SET_OUTER_ALARM_POINT_FEATURES(state, features) {
    state.outerAlarmPointFeatures = features
  },
  SET_OUTER_ALARM_POINT_LABELS(state, features) {
    state.outerAlarmPointLabels = features
  },
  SET_ALARM_NEW_ONE(state, data) {
    state.alarmNewOne = data
  },
  SET_CONFIRMED_NEW_ALARM(state, data) {
    state.confirmedNewAlarm = data
  },
  // 楼内实时点位报警 列表
  SET_SIX_TYPE_ALARM_BUILD_LIST(state, arr) {
    state.sixTypeAlarmBuildList = arr
    state.buildingAlarmingTag++
  },
  SET_ALLVIDEO_ALARM_BUILD_LIST(state, arr) {
    state.allVideoAlarmBuildList = arr
    state.buildingAlarmingTag++
  },
  SET_SOS_ALARM_BUILD_LIST(state, arr) {
    state.sosAlarmBuildList = arr
    state.buildingAlarmingTag++
  },
  // 楼内实时点位报警 要素
  SET_BUILDING_ALARMING_FEATURES(state, features) {
    state.buildingAlarmingFeatures = features
  },
  // 楼外 实时楼宇区域报警
  SET_BUILDING_AREA_ALARMING_FEATURES(state, features) {
    state.buildingAreaAlarmingFeatures = features
  },
  // 20条报警数据
  GET_ALARM_LIST(state, payload) {
    let alarmList = payload.data
    let arr = []
    // 报警求助 askHelp acceptHelp 合并
    if (payload.type === 'alarmHelpList' && alarmList.length >= 2) {
      let indexArr = []
      const acceptHelpList = alarmList.filter(item => {
        return item.eventType === 'acceptHelp'
      })
      alarmList.forEach((item, index) => {
        acceptHelpList.forEach(info => {
          if (item.devIp === info.devIp && item.devPort === info.devPort && item.channel === info.channel && item.eventType === 'askHelp') {
            indexArr.push(index)
          }
        })
      })
      indexArr.sort((a, b) => {
        return b - a
      })
      indexArr.forEach(item => {
        alarmList.splice(item, 1)
      })
    }
    alarmList.forEach(item => {
      if (state[payload.type].length && item.time >= state[payload.type][state[payload.type].length - 1].time) { return }
      item.actionList = item.action ? item.action : null
      item.actionList && item.actionList.forEach(item => {
        item.streamType = state.streamType[item.streamType] || item.streamType
      })
      // item.channelId = item.chanId ? item.chanId : ''
      item.alarmId = item._id
      item.organization = item.orgName ? item.orgName : ''
      item.eventTypeName = item.subtype ? state.alarmType[item.subtype] : (item.eventType ? state.alarmType[item.eventType] : '')
      if (item.eventType === 'alarmInput') {
        item.alarmTypeToMap = 'alarmInput'
      } else if (item.eventType === 'alarmZone' || item.eventType === 'alarmGT') {
        item.alarmTypeToMap = 'alarmZone'
      } else if (item.eventType === 'askHelp' || item.eventType === 'acceptHelp') {
        item.alarmTypeToMap = 'alarmHelp'
      } else if (item.eventType === 'fireAlarm' || item.eventType === 'fireFailure') {
        item.alarmTypeToMap = 'fireAlarm'
      } else if (state.alarmData.intelligent.hasOwnProperty(item.eventType)) {
        item.alarmTypeToMap = 'intelligent'
      } else if (state.alarmData.violation.hasOwnProperty(item.eventType)) {
        item.alarmTypeToMap = 'violation'
      } else if (item.eventType === 'faceControl') {
        item.alarmTypeToMap = 'faceAlarm'
      } else if (item.eventType === 'focusAttention') {
        item.alarmTypeToMap = 'focusAttention'
      } else if (state.alarmData.video.hasOwnProperty(item.eventType) && item.eventType !== 'focusAttention') {
        item.alarmTypeToMap = 'monitorAlarm'
      }
      arr.push(item)
    })
    state[payload.type] = state[payload.type].concat(arr)
  },
  SET_MAP2D_ALARM_LIST(state, payload) {
    state[payload.type].unshift(payload.data)
  },
  SPLICE_MAP2D_ALARM_LIST(state, payload) {
    const item = state[payload.type][payload.index]
    state[payload.type].splice(payload.index, 1) // 删除报警列表
    for (let i = 0; i < state.alarmTabData.length; i++) { // 删除楼内报警
      const v = state.alarmTabData[i]
      if (v.alarmId === item.alarmId) {
        state.alarmTabData.splice(i, 1)
      }
    }
  },
  SET_ACTIVE_ALARM_INFO(state, payload) {
    state.activeAlarmInfo = payload
    state.activeAlarmTag++
  },
  // 人像轨迹相关
  SET_FACE_TRACK_DRAW_MAP(state, map) {
    let instanceType = getType(state.pointFaceNodeMap) // 获取Map的类型
    if (state.pointFaceNodeMap && instanceType === 'Map') {
      state.faceTrackDrawMap = map
    } else {
      state.faceTrackDrawMap = new Map()
    }
  },
  UPDATE_POINT_FACE_NODE_MAP(state, data) {
    let instanceType = getType(state.pointFaceNodeMap) // 获取Map的类型
    if (state.pointFaceNodeMap && instanceType === 'Map') {
      state.pointFaceNodeMap.set(data.pointId, data.pointNodes)
    } else {
      state.pointFaceNodeMap = new Map()
    }
  },
  DELETE_POINT_FACE_NODE_MAP(state, pointId) {
    let instanceType = getType(state.pointFaceNodeMap) // 获取Map的类型
    if (state.pointFaceNodeMap && instanceType === 'Map') {
      state.pointFaceNodeMap.delete(pointId)
    } else {
      state.pointFaceNodeMap = new Map()
    }
  },
  HANDLE_REPEAT_FACE_HEAD_NODES(state) {
    let instanceType = getType(state.pointFaceNodeMap) // 获取Map的类型
    if (!state.pointFaceNodeMap || instanceType !== 'Map') {
      state.pointFaceNodeMap = new Map()
    }
    state.faceHeads = []
    let [...pointNodesArr] = state.pointFaceNodeMap.values()
    for (let pointNodes of pointNodesArr) {
      let num = pointNodes.length
      if (num > 1) { // 有重复节点时
        let midNum = num / 2.0
        for (let index = 0; index < pointNodes.length; index++) {
          let pointNode = pointNodes[index]
          let deltaX = (index - midNum + 0.5) * 48
          pointNode.deltaX = deltaX
          // console.log('num: ', num, ', midNum: ', midNum, ', deltaX: ', deltaX)
          state.faceHeadMap.set(pointNode.userId, pointNode)
        }
      } else { // 无重复节点时
        let pointNode = pointNodes[0]
        pointNode.deltaX = 0
        state.faceHeadMap.set(pointNode.userId, pointNode)
      }
    }
    let [...faceHeads] = state.faceHeadMap.values()
    state.faceHeads = faceHeads
  },
  CHANGE_FACEALARM_TRAIL(state, param) {
    let alarmList = JSON.parse(JSON.stringify(state.intelligentAlarmList))
    let index = param.index
    let currentUser = alarmList[index]
    currentUser.isOpenTrail = !currentUser.isOpenTrail
    // 更新同一个用户的轨迹显示状态
    for (let i = 0; i < alarmList.length; i++) {
      if (index !== i && currentUser.userId === alarmList[i].userId) {
        if (alarmList[i].isOpenTrail && currentUser.isOpenTrail) {
          alarmList[i].isOpenTrail = false
        }
      }
    }
    state.intelligentAlarmList = alarmList
    // 点击导航页面刷state.selectedFaceAlarmMap变为{}的情况
    let instanceType = getType(state.selectedFaceAlarmMap) // 获取Map的类型
    if (!state.selectedFaceAlarmMap || instanceType !== 'Map') {
      state.selectedFaceAlarmMap = new Map()
    }
    // 设置选择显示的轨迹的人脸报警
    if (currentUser.isOpenTrail) {
      state.selectedFaceAlarmMap.set(currentUser.userId, currentUser)
    } else {
      state.selectedFaceAlarmMap.delete(currentUser.userId)
    }
    let [...selectedArr] = state.selectedFaceAlarmMap.values()
    state.selectedFaceAlarmArr = selectedArr
  },
  REMOVE_USER_FACEALARM_TRAIL(state, userId) {
    // 更新选择显示的轨迹的人脸报警
    state.selectedFaceAlarmMap.delete(userId) // map中移除人员的轨迹缓存
    if (state.selectedFaceAlarmMap && state.selectedFaceAlarmMap.size === 0) {
      state.faceHeads = []
    }
    let [...selectedArr] = state.selectedFaceAlarmMap.values()
    state.selectedFaceAlarmArr = selectedArr // 更新选中显示轨迹的人脸报警数据
    // 更新人像布控报警列表里的轨迹开启状态 isOpenTrail，关闭列表中所有人员标识为 userId 的轨迹追踪
    let alarmList = JSON.parse(JSON.stringify(state.intelligentAlarmList)) // 深拷贝人像布控报警列表数据
    for (let i = 0; i < alarmList.length; i++) { // 遍历人像报警列表数据
      if (alarmList[i].eventType === 'faceControl' && alarmList[i].userId === userId) { // 人员为 userId 时
        alarmList[i].isOpenTrail = false // 关闭轨迹追踪
      }
    }
    state.intelligentAlarmList = alarmList
    // 更新人像布控处境弹框中的轨迹状态
    if (state.itemAlarmInput.eventType === 'faceControl' && state.itemAlarmInput.userId === userId) {
      state.itemAlarmInput.isOpenTrail = false
    }
  },
  SET_FACE_HEAD_MAP(state, map) {
    state.faceHeadMap = map
    let [...faceHeads] = state.faceHeadMap.values()
    if (state.selectedFaceAlarmArr && state.selectedFaceAlarmArr.length) {
      state.faceHeads = faceHeads
    }
  },
  SET_FACE_HEADS(state, arr) { // 设置人脸头像数组
    state.faceHeads = arr
  },
  SET_POINT_FACE_NODE_MAP(state, map) {
    state.pointFaceNodeMap = map
  },
  SET_SELECTED_FACE_ALARM_MAP(state, map) {
    state.selectedFaceAlarmMap = map
    let [...selectedArr] = state.selectedFaceAlarmMap.values()
    state.selectedFaceAlarmArr = selectedArr
  },
  PUSH_VIDEO_ALARM_ARR(state, item) {
    state.videoAlarmIdInfo[item.key] = item
  },
  SET_VIDEO_ALARM_ARR(state, obj) {
    state.videoAlarmIdInfo = obj
  },
  PUSH_SOS_ALARM_ARR(state, item) {
    state.sosAlarmIdInfo[item.key] = item
  },
  SET_SOS_ALARM_ARR(state, obj) {
    state.sosAlarmIdInfo = obj
  },
  PUSH_BUILD_ALARM_ARR(state, item) {
    state.buildingIdInfo[item.key] = item
  },
  SET_BUILD_ALARM_ARR(state, obj) {
    state.buildingIdInfo = obj
  },
  // 智能报警类型选择信息
  SAVE_ALARM_CHANGE(state, payload) {
    state.alarmChangeInfo = payload
  },
  SET_SINGLE_TIMEOUT_ALARM_List(state, list) {
    state.singleTimeoutList = list
  },
  SET_SINGLE_TIMEOUT_ALARM_FEATURES(state, features) {
    state.singleTimeoutAlarmFeatures = features
  },
  UPDATE_ALARMTAB_DATA(state, item) {
    state.alarmTabData.push(item)
  },
  REMOVE_ALARMTAB_ITEM(state, item) {
    for (let i = 0; i < state.alarmTabData.length; i++) {
      const v = state.alarmTabData[i]
      if (v.alarmId === item.alarmId) {
        state.alarmTabData.splice(i, 1)
      }
    }
  },
  UPDATE_CURBUILD_DATA(state, item) {
    state.curBuildData = item
  },
  SET_FACE_IMAGE_URL(state, url) {
    state.faceImageUrl = url
  }
}

const actions = {
  // 地图中 返回未处理的20条报警
  getMapAlarmList({commit, dispatch}, data) {
    console.log('返回未处理的20条报警', data)
    const param = {
      roleId: read('roleId'),
      ...data.payload
    }
    return new Promise((resolve, reject) => {
      mapAlarmFiltering(param).then(res => {
        if (res.data.length === 0) { return }
        if (data.type === 'IndividualPolice') {
          dispatch('patrol2DAlarm/getMap2DSingleAlarm', res.data, { root: true })
        } else {
          commit('GET_ALARM_LIST', {type: data.type, data: res.data})
        }
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 地图中 一次性返回所有报警数据
  getMapAllAlarmList({commit, dispatch}) {
    return new Promise((resolve, reject) => {
      mapAllAlarmData({map: '2D', roleId: read('roleId')}).then(res => {
        for (let key in res.data) {
          if (key === 'singleAlarmList') {
            dispatch('patrol2DAlarm/getMap2DSingleAlarm', res.data[key], { root: true })
          } else {
            commit('GET_ALARM_LIST', {type: key, data: res.data[key]})
          }
        }
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getMachinaResource({commit}, pointId) {
    return new Promise((resolve, reject) => {
      getCommonResourceByIdApi(pointId).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}
