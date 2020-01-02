import {
  get,
  post
} from '../../../http/base'
import { getAlarmRemarksApi, putAlarmRemarksApi, backupAlarmInfo, downloadAlarmInfo, inquireDownloadInfo } from 'http/alarm.api'

const state = {
  historyList: [],
  channel: {},
  warningOrgTreeData: [], // 机构树数据
  warningTypeTreeData: [], // 机构树数据
  alarmSort: '', // 报警分类
  partentName: '',
  partentAlarmName: {
    alarmInput: '报警输入',
    alarmZone: '报警防区',
    intelligentAlarm: '智能报警',
    violation: '违章报警',
    portraitControl: '人像布控',
    monitoryPointAlarm: '监控点报警',
    focusAttention: '重点关注',
    alarmHelp: '报警求助',
    fireAlarm: '消防报警',
    individualAlarm: '单兵一键报警',
    patrolAlarm: '巡更报警',
    manualAlarm: '手工报警'
  },
  allAlarmType: {
    alarmInput: '报警输入',
    alarmOut: '报警输出',
    alarmZone: '报警防区',
    helpSeek: '报警求助',
    focusAttention: '重点关注',
    perimeterAlarm: '周界报警',
    intrusionAlarm: '入侵报警',
    electricFence: '电子围栏',
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
    sdCardFailure: 'sd卡故障',
    sdCardFull: 'sd卡满',
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
    ipcMacCheckException: 'MAC校验异常',
    // 单兵报警
    individualAlarm: '单兵一键报警',
    // 巡更报警
    patrolAlarm: '巡更异常上报',
    faceControl: '人像布控'
  },
  alarmData: {
    // 普通报警
    alarmInput: 'alarmInput',
    alarmZone: 'alarmZone',
    // 智能报警
    intelligentAlarm: {
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
    // 监控点报警报警
    monitoryPointAlarm: {
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
    },
    // 重点关注
    focusAttention: 'focusAttention',
    // 报警求助
    alarmHelp: 'alarmHelp',
    // 消防报警
    fireAlarm: 'fireAlarm',
    // 单兵报警
    individualAlarm: 'individualAlarm',
    // 巡更报警
    patrolAlarm: 'patrolAlarm',
    // 手工报警
    manualAlarm: 'manualAlarm'
  }
}

const mutations = {
  // 机构树
  SET_WARNINGORGTREE_DATA(state, data) {
    state.warningOrgTreeData = [data]
  },
  // 报警信息
  GET_WARNIN_DATA(state, payload) {
  },
  GET_WARNIN_CHANNEL(state, payload) {
    state.channel = payload
  },
  // 报警类型
  GET_TYPE_DATA(state, payload) {
    let dataList = [
      { label: '全部', value: 'all' },
      { label: '普通报警', value: 'normalAlarm' },
      { label: '视频报警', value: 'videoAlarm' },
      { label: '智能报警', value: 'intelligent' },
      { label: '报警求助', value: 'alarmHelp' },
      { label: '消防报警', value: 'fireAlarm' },
      { label: '单兵报警', value: 'individualPolice' },
      { label: '手工报警', value: 'manualAlarm' }
    ]
    let val = 0
    for (let i in payload) {
      for (let j = 0; j < dataList.length; j++) {
        if (i === dataList[j].value) {
          if (payload[i].length > 1) {
            dataList[j].children = payload[i]
            if (dataList[j].children.length > 0) {
              dataList[j].children.unshift({ label: '全部_' + dataList[j].label, value: dataList[j].value })
              dataList[j].children.forEach((item, index) => {
                if (item.children && item.children.length > 0) {
                  item.children.unshift({ label: '全部_' + item.label, value: item.value })
                }
              })
            }
          }
        }
      }
      val++
    }
    if (val === 7) {
      state.warningTypeTreeData = dataList
      val = 0
    }
  }
}

const actions = {
  // 1-获取机构树
  getWarningOrgTree({
    commit,
    state
  }, type) {
    const param = {
      query: {
        type: 0
      },
      url: '/setting/org/tree/'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('SET_WARNINGORGTREE_DATA', res.data)
      }).catch((err) => {
        console.log('getWarningOrgTree error: ' + err)
        reject(err)
      })
    })
  },
  // 获取报警分类
  getWarningTypeTree({
    commit
  }) {
    const param = {
      url: 'setting/alarm'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_TYPE_DATA', res.data)
      }).catch((err) => {
        console.log('getWarningTypeTree error: ' + err)
        reject(err)
      })
    })
  },
  // 获取报警信息
  getWarningNews({
    commit,
    state
  }, playod) {
    const param = {
      // body: playod,
      query: playod,
      url: '/warning/query'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_WARNIN_DATA', res.data)
      }).catch((err) => {
        console.log('getWarningNews error: ' + err)
        reject(err)
      })
    })
  },
  // 确认报警
  confirmWarning({
    state,
    commit
  }, list) {
    const data = {
      alarmIdList: list
    }
    const param = {
      body: data,
      url: '/alarm/alarmaffirm'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch((err) => {
        console.log('confirmWarning error: ' + err)
        reject(err)
      })
    })
  },
  // 获取 某条报警 备注信息
  getAlarmRemarks({commit}, id) {
    return getAlarmRemarksApi(id)
  },
  // 添加 某条报警 备注信息
  putAlarmRemarks({commit}, data) {
    return putAlarmRemarksApi(data)
  },
  // 报警记录备份
  putBackupAlarmInfo({commit}, data) {
    return new Promise((resolve, reject) => {
      backupAlarmInfo(data).then(res => {
        resolve(res)
      }).catch((err) => {
        console.log('downloadAlarmInfo error: ' + err)
        reject(err)
      })
    })
  },
  // 报警记录备份下载
  downloadInfo({state, commit}, data) {
    return new Promise((resolve, reject) => {
      downloadAlarmInfo(data).then(res => {
        resolve(res)
      }).catch((err) => {
        console.log('downloadAlarmInfo error: ' + err)
        reject(err)
      })
    })
  },
  // 报警记录备份下载
  inquireDownload({state, commit}, id) {
    return inquireDownloadInfo(id)
  }
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
