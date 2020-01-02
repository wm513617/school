import {
  alarmToBeSureApi,
  getAlarmDeal,
  getAlarmDealStatus,
  getAlarmPower,
  manualAlarmSureApi,
  mapAlarmFiltering,
  mapAllAlarmData
} from 'src/http/alarm.api'
import { getType } from 'assets/2DMap/utils/common.js'
import { read } from '../../../storage/index'
const state = {
  alarmData: {
    // 普通报警
    normalAlarm: {
      alarmInput: 'alarmInput',
      alarmOut: 'alarmOut',
      alarmZone: 'alarmZone',
      alarmGT: 'alarmGT'
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
    alarmInput: '报警输入',
    helpSeek: '报警求助',
    alarmOut: '报警输出',
    alarmZone: '报警防区',
    alarmGT: '电子围栏',
    perimeterAlarm: '周界报警',
    intrusionAlarm: '入侵报警',
    electricFence: '电子围栏',
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
    acceptHelp: '接受对讲',
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
  alarmNewOne: {}, // 最新 报警数据
  streamType: {
    1: 'main',
    2: 'sub1',
    3: 'sub2',
    4: 'pic'
  },
  activeAlarmInfo3D: null, // 当前选中的报警信息
  activeAlarmTag3D: 0,
  mapsignType: 0,
  selectedFaceAlarmMap: new Map(), // 选中的人脸报警map（key：用户标识，value: 人脸报警数据）
  faceTrackDrawMap: new Map(), // 人脸轨迹绘制轨迹map（key：用户标识，value: 对应的绘制工具）
  pointFaceNodeMap: [], // 人脸点位节点
  selectedFaceAlarmArr: [], // 选中的智能报警轨迹数据
  receiveCurrentAlarmData: {} // socket接收到的当前智能报警数据
}

const getters = {
  alarmTypeList(state) {
    return state.alarmType
  },
  alarmTypeData(state) {
    return state.alarmData
  },
  carTypes(state) {
    return state.carTypeList
  },
  carDirect(state) {
    return state.carDirectList
  }
}

const mutations = {
  GET_ALARM_MODAL_TYPE(state, data) {
    state.alarmModalType = data
  },
  CHANGE_SHOWVIDEO(state, data) {
    state.showVideo = data
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
    console.log('state.alarmHelpList', state.alarmHelpList)
  },
  SAVE_VIDEO_ALARM_LIST(state, payload) {
    state.videoAlarmList = JSON.parse(JSON.stringify(payload))
  },
  SAVE_INTELLIGENT_ALARM_LIST(state, payload) {
    state.intelligentAlarmList = JSON.parse(JSON.stringify(payload))
  },
  CHANGE_FACEALARM_3D_TRAIL(state, param) {
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
  DELETE_CURRENT_FACE_TRACK(state, userId) {
    let alarmList = JSON.parse(JSON.stringify(state.intelligentAlarmList))
    // 更新同一个用户的轨迹显示状态
    for (let i = 0; i < alarmList.length; i++) {
      if (userId === alarmList[i].userId) {
        alarmList[i].isOpenTrail = false
      }
    }
    state.intelligentAlarmList = alarmList
    // 点击导航页面刷state.selectedFaceAlarmMap变为{}的情况
    let instanceType = getType(state.selectedFaceAlarmMap) // 获取Map的类型
    if (!state.selectedFaceAlarmMap || instanceType !== 'Map') {
      state.selectedFaceAlarmMap = new Map()
    } else {
      state.selectedFaceAlarmMap.delete(userId)
    }
    let [...selectedArr] = state.selectedFaceAlarmMap.values()
    state.selectedFaceAlarmArr = selectedArr
  },
  REMOVE_USER_FACEALARM_TRAIL(state, userId) {
    // 更新选择显示的轨迹的人脸报警
    state.selectedFaceAlarmMap.delete(userId) // map中移除人员的轨迹缓存
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
    // if (state.itemAlarmInput.eventType === 'faceControl' && state.itemAlarmInput.userId === userId) {
    //   state.itemAlarmInput.isOpenTrail = false
    // }
  },
  SET_SELECTED_FACE_ALARM_3D_MAP(state, map) {
    state.selectedFaceAlarmMap = map
    let [...selectedArr] = state.selectedFaceAlarmMap.values()
    state.selectedFaceAlarmArr = selectedArr
  },
  // 人像轨迹相关 --- SET
  SET_FACE_TRACK_3D_DRAW_MAP(state, map) {
    if (state.pointFaceNodeMap) {
      state.faceTrackDrawMap = map
    } else {
      state.faceTrackDrawMap = new Map()
    }
  },
  // 人像轨迹相关 ---DELETE
  DELETE_FACE_TRACK_3D_DRAW_MAP(state, userId) {
    // 更新选择显示的轨迹的人脸报警
    state.faceTrackDrawMap.delete(userId) // map中移除人员的轨迹缓存
  },
  SET_POINT_FACE_NODE_3D_MAP(state, arr) {
    state.pointFaceNodeMap = arr
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
  SET_ALARM_NEW_ONE(state, data) {
    state.alarmNewOne = data
  },
  GET_MAP_ALARM_LIST(state, payload) {
    let data = payload.value
    let arr = []
    if (payload.type === 'alarmHelpList' && data.length >= 2) {
      let indexArr = []
      const acceptHelpList = data.filter(item => {
        return item.eventType === 'acceptHelp'
      })
      data.forEach((item, index) => {
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
        data.splice(item, 1)
      })
    }
    data.forEach(item => {
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
  SPLICE_MAP_ALARM_LIST(state, payload) {
    let list = state[payload.type].splice(payload.index, 1)
    if (payload.type === 'intelligentAlarmList' && state.selectedFaceAlarmArr && state.selectedFaceAlarmArr.length > 0) {
      if (list[0].isOpenTrail) {
        state.selectedFaceAlarmArr.forEach(item => {
          state.selectedFaceAlarmMap.delete(list[0].userId)
          let [...selectedArr] = state.selectedFaceAlarmMap.values()
          state.selectedFaceAlarmArr = selectedArr
        })
        let pointFaceNodes = JSON.parse(JSON.stringify(state.pointFaceNodeMap))
        let pointFaceNewNodes = []
        pointFaceNodes.forEach(item => {
          (item.userId !== list[0].userId) && pointFaceNewNodes.push(item)
        })
        state.pointFaceNodeMap = pointFaceNewNodes
      }
    }
  },
  UNSHIFT_MAP_ALARM_LIST(state, payload) {
    state[payload.type].unshift(payload.data)
  },
  SET_ACTIVE_ALARM_INFO_3D(state, payload) {
    state.activeAlarmInfo3D = payload
    state.activeAlarmTag3D++
  },
  SET_MAP_SIGN_TYPE(state, payload) {
    state.mapsignType = payload
  },
  // 推送报警数据
  SET_RECEIVE_CURRENT_ALARM_DATA(state, payload) {
    // 推送数据是否存在对应的属性数据
    if (payload && payload.alarmInfo && payload.alarmInfo.eventType === 'faceControl' && payload.alarmInfo.verifaceMsg && payload.alarmInfo.verifaceMsg.faceImage && payload.alarmInfo.point3D) {
      state.receiveCurrentAlarmData = payload
    }
  }
}

const actions = {
  /* 报警确认（普通、消防、报警助） */
  alarmToBeSure({
    commit
  }, payload) {
    const data = {
      alarmIdList: payload
    }
    return new Promise((resolve, reject) => {
      alarmToBeSureApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取警情处理数据
  getMapAlarmDealList({commit}, data) {
    return getAlarmDeal(data)
  },
  // 获取警情处理启用状态
  getMapAlarmDealStatus({commit}, data) {
    return getAlarmDealStatus()
  },
  // 报警权限
  getMapAlarmPower({commit}, data) {
    const param = {
      roleId: read('roleId'),
      resId: data.resId,
      type: data.type
    }
    return getAlarmPower(param)
  },
  manualAlarmToBeSure({commit}, data) {
    return manualAlarmSureApi(data)
  },
  // 地图中 返回未处理的30条报警
  getMapAlarmList({commit, dispatch}, payload) {
    const param = {
      roleId: read('roleId'),
      ...payload.data
    }
    return new Promise((resolve, reject) => {
      mapAlarmFiltering(param).then(res => {
        if (res.data.length === 0) { return }
        if (payload.type === 'IndividualPolice') {
          dispatch('getMapSingleAlarm', res.data)
        } else {
          commit('GET_MAP_ALARM_LIST', {type: payload.type, value: res.data})
        }
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 地图中 一次性返回所有报警数据
  getMap3DAllAlarmList({commit, dispatch}) {
    return new Promise((resolve, reject) => {
      mapAllAlarmData({map: '3D', roleId: read('roleId')}).then(res => {
        for (let key in res.data) {
          if (key === 'singleAlarmList') {
            dispatch('getMapSingleAlarm', res.data[key])
          } else {
            commit('GET_MAP_ALARM_LIST', {type: key, value: res.data[key]})
          }
        }
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  setMapsignType({ commit }, data) {
    commit('SET_MAP_SIGN_TYPE', data)
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
