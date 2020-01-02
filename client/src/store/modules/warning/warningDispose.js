import {
  post
} from '../../../http/base'
import { confirmAlarm } from '@http/patrolAlarm.api'
import Vue from 'vue'
import moment from 'moment'
import alarm from 'src/socket/alarm'
import { getAlarmPower, alarmFiltering, alarmCount, getAlarmWallApi } from 'http/alarm.api'
import { read } from '../../../storage/index'
const state = {
  filterStatus: [
    {value: '0', lable: 'normal'},
    {value: '1', lable: 'video'},
    {value: '2', lable: 'intelligent'},
    {value: '3', lable: 'alarmHelp'},
    {value: '4', lable: 'fireAlarm'},
    {value: '5', lable: 'single'},
    {value: '6', lable: 'exception'}
  ],
  alarmDataList: {
    // 普通报警
    normal: {
      alarmInput: {
        alarmInput: 'alarmInput'
      },
      alarmZone: {
        alarmZone: 'alarmZone',
        alarmGT: 'alarmGT'
      }
    },
    // 智能报警
    intelligent: {
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
      violation: { // 违章报警
        vioRetrograde: 'vioRetrograde',
        vioPark: 'vioPark',
        vioTurnLeft: 'vioTurnLeft',
        vioTurnRight: 'vioTurnRight'
      },
      face: {
        // 人像布控
        faceDispatch: 'faceDispatch',
        faceControl: 'faceControl'
      }
    },
    // 视频报警
    video: {
      monitor: {
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
      focus: {
        focusAttention: 'focusAttention'
      }
    },
    single: {
      single: {
        soldier: 'soldier'
      },
      patrol: {
        patrol: 'patrol'
      }
    },
    alarmHelp: {
      // askHelp: 'askHelp',
      // acceptHelp: 'acceptHelp',
      // endHelp: 'endHelp'
    }
  },
  filterState: {
    normal: {
      flag: true,
      alarmInput: {
        flag: true,
        level: 1
      },
      alarmZone: {
        flag: true,
        level: 1
      }
    },
    video: {
      flag: true,
      monitor: {
        flag: true,
        level: 1
      },
      focus: {
        flag: true,
        level: 1
      }
    },
    intelligent: {
      flag: true,
      intelligent: {
        flag: true,
        level: 1
      },
      violation: {
        flag: true,
        level: 1
      },
      face: {
        flag: true,
        level: 1
      }
    },
    alarmHelp: {
      flag: true,
      level: 1
    },
    fireAlarm: {
      flag: true,
      level: 1
    },
    single: {
      flag: true,
      single: true,
      patrol: true
    },
    exception: {
      flag: true
    },
    dealState: 'unProcess'
  },
  alarmTypeList: [
    { value: '0', lable: 'normal' },
    { value: '1', lable: 'video' },
    { value: '2', lable: 'intelligent' },
    { value: '3', lable: 'alarmHelp' },
    { value: '4', lable: 'fireAlarm' },
    { value: '5', lable: 'single' },
    { value: '6', lable: 'exception' }
  ],
  confirmedAlarm: { // 显示已确认报警
    checked: false
  },
  filterLevel: {
    alarmInputLevel: 1,
    alarmSectorLevel: 1,
    cameraSpearLevel: 1,
    focusOnLevel: 1,
    intelligenceLevel: 1,
    peccancyLevel: 1,
    fireControlLevel: 1
  },
  // 报警类型Tabs
  warningTabs: [
    {
      title: '普通报警',
      value: '0',
      number: 0,
      disabled: false,
      active: false
    },
    {
      title: '视频报警',
      value: '1',
      number: 0,
      disabled: false,
      active: false
    },
    {
      title: '智能报警',
      value: '2',
      number: 0,
      disabled: false,
      active: false
    },
    {
      title: '报警求助',
      value: '3',
      number: 0,
      disabled: false,
      active: false
    },
    {
      title: '消防报警',
      value: '4',
      number: 0,
      disabled: false,
      active: false
    },
    {
      title: '单兵报警',
      value: '5',
      number: 0,
      disabled: false,
      active: false
    },
    {
      title: '系统异常',
      value: '6',
      number: 0,
      disabled: false,
      active: false
    }
  ],
  receiveWarnList: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  receiveFireWarning: null,
  sendSocket: {
    name: 'stone2'
  },
  activeWarnInfo: {},
  activeWarnInfoView: {},
  activeWarnTab: '',
  videoWarnList: [],
  warnCounts: 0,
  warnNewData: {},
  couldPlay: false,
  allAlarmDataButFire: [],
  // 接收到的数据以确认过
  confirmedData: [],
  activedIndex: 0,
  // 区别于其他报警，单独保存报警求助
  alarmHelpsSocketValue: [],
  allAlarmNewOne: '',
  alarmPageData: '',
  receive: {},
  alarmType: [],
  isAcceptWarn: true, // 报警处理页面是否接收报警
  alarmPower: {}, // 报警权限
  warningActive: 0,
  isTheme: false,
  acceptTime: 0
}
const mutations = {
  // 界面详情数据置空
  SET_DETAIL_NULL(state, payload) {
    state.activeWarnInfoView = {}
  },
  SPLICE_VIDEO_LIST(state, payload) {
    for (let i = 0; i < state.videoWarnList.length; i++) {
      state.videoWarnList[i].uid = payload
      state.videoWarnList.splice(i, 1)
    }
  },
  SET_WARNING_NUM(state, payload) {
    if (state.warningTabs[payload].number === '999+' || state.warningTabs[payload].number <= 0) { return }
    state.warningTabs[payload].number--
  },
  CLEAN_VIDEO_LIST(state) {
    state.videoWarnList = []
  },
  SET_THEME(state, payload) {
    state.isTheme = payload
  },
  SET_LOCALSTORAGE_FILTER(state, payload) {
    state.filterState = JSON.parse(JSON.stringify(payload))
  },
  SET_DEAL_STATUS(state, payload) {
    state.confirmedAlarm = JSON.parse(JSON.stringify(payload))
  },
  SET_WARN_RANG(state, payload) {
    state.warningActive = payload
    state.isTheme = true
    for (let i = 0; i < state.warningTabs.length; i++) {
      state.warningTabs[i].active = false
    }
    state.warningTabs[payload].active = true
    state.activeWarnTab = String(payload)
  },
  SET_TABS_VALUE(state, payload) {
    for (let i = 0; i < state.warningTabs.length; i++) {
      state.warningTabs[i].active = false
    }
    state.warningTabs[0].active = payload
  },
  SET_TABS_VAL(state, payload) {
    state.warningTabs[payload.index].active = payload.flag
  },
  SET_ITEM_STATE(state, {arr, isFilter = true}) {
    // console.log(arr, 'arr')
    let result = ''
    result = state.filterState[arr[0]]
    // console.log(result, 'result')
    if (arr[0] === 'dealState') { // 改变确认报警check状态
      state.confirmedAlarm.checked = !state.confirmedAlarm.checked
      // console.log(state.confirmedAlarm.checked, 'check')
      if (state.confirmedAlarm.checked) { // 是否显示确认报警
        state.filterState[arr[0]] = 'process'
      } else {
        state.filterState[arr[0]] = 'unProcess'
      }
      // console.log(state.filterState, 'result')
      return
    }
    if (arr.length === 2) { // 小类check & 无小类的大类级别
      // console.log('小类check')
      if (arr[0] === 'alarmHelp' || arr[0] === 'fireAlarm' || arr[0] === 'exception') {
        // console.log('消防、求助、异常')
        result.level = arr[1]
      } else if (arr[0] === 'single') {
        // console.log('单兵')
        result[arr[1]] = !result[arr[1]]
      } else {
        result[arr[1]].flag = !result[arr[1]].flag
      }
    } else if (arr.length === 3) { // 小类级别
      // console.log('小类级别')
      result[arr[1]].level = arr[2]
    } else { // 大类check
      // console.log('大类')
      result.flag = !result.flag
    }
    // console.log(state.filterState, 'state.filterState')
  },
  CLOSE_VIDEO_WARNLIAT(state, data) {
    state.videoWarnList = data
  },
  SET_WARN_COUNTS(state, payload) {
    let data = {}
    if (payload.eventType === 'patrol' || payload.eventType === 'soldier') {
      data = JSON.parse(JSON.stringify(payload))
    } else {
      if (payload.alarmInfo === undefined) {
        data = JSON.parse(JSON.stringify(payload))
      } else {
        data = JSON.parse(JSON.stringify(payload.alarmInfo))
      }
      data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}`
    }
    state.warnCounts++
    state.warnNewData = data
  },
  SET_RECEIVE_WARNLIAST(state, payload) {
    state.acceptTime = 0
    let data = {}
    if (payload.eventType === 'patrol' || payload.eventType === 'soldier') {
      data = JSON.parse(JSON.stringify(payload))
      if (payload.eventType === 'patrol') {
        data.time = Date.parse(new Date(moment(parseInt(data.message ? data.message.date : data.date) * 1000).format('YYYY-MM-DD ') + (data.message ? data.message.moment : data.moment))) / 1000
      }
      if (payload.eventType === 'soldier') {
        data.time = Date.parse(new Date(data.time)) / 1000
        data.message = {realname: data.realname}
      }
    } else {
      if (payload.alarmInfo === undefined) {
        data = JSON.parse(JSON.stringify(payload))
      } else {
        data = JSON.parse(JSON.stringify(payload.alarmInfo))
      }
      data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}`
    }
    data.alarmPermission = state.alarmPower // 给报警信息中加权限
    // 对报警信息进行分类，添加对应的Tab index值
    // console.log(data.eventType, 'eventType')
    // console.log(data, 'data')
    data.tabIndex = tabIndexSet(data.eventType)
    if (data.eventType === 'acceptHelp') {
      state.acceptTime = data.time
    }
    if (state.alarmPageData !== 'alarmPage') {
      state.receiveWarnList = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
      let arrVal = []
      data.count = 1
      arrVal.push(data)
      state.receiveWarnList[data.tabIndex] = arrVal
    } else if (state.alarmPageData === 'alarmPage') {
      if (data.tabIndex === undefined) { return }
      // if (parseInt(state.activeWarnTab) !== data.tabIndex) { return }
      // 根据过滤条件判断是否继续接收报警
      // console.log(state.activeWarnTab, 'activeWarnTab')
      // for (let j = 0; j < state.alarmTypeList.length; j++) {
      //   if (state.alarmTypeList[j].value === state.activeWarnTab) {
      //     console.log(state.filterState[state.alarmTypeList[j].lable], state.filterState[state.alarmTypeList[j].lable].flag, 'ppp')
      //     if (state.filterState[state.alarmTypeList[j].lable].flag === false) {
      //       console.log('=====================================')
      //       return
      //     }
      //   }
      // }
      console.log(isAcceptAlarm(data.eventType, data.level, isAcceptAlarm(data.eventType, data.level) === false), 'isAcceptAlarm')
      if (isAcceptAlarm(data.eventType, data.level) === false) { return }
      if ((data.eventType === 'fireAlarm' || data.eventType === 'fireFailure') && data.level < state.filterState['fireAlarm'].level) { return }
      // 报警求助
      if (data.eventType === 'askHelp' || data.eventType === 'acceptHelp' || data.eventType === 'endHelp') {
        if (data.level < state.filterState['alarmHelp'].level) { return }
        let alarmHelps = state.receiveWarnList[data.tabIndex]
        if (alarmHelps.length === 0) {
          data.status = (data.eventType === 'askHelp' ? '请求对讲' : '接受对讲')
          alarmHelps.push(data)
          if (state.warningTabs[state.activeWarnTab].number < 999) {
            state.warningTabs[state.activeWarnTab].number++ // 暂时关闭
          }
        } else {
          let helpRepeat = false
          for (let j = 0; j < alarmHelps.length; j++) {
            if (alarmHelps[j].devIp === data.devIp && alarmHelps[j].devPort === data.devPort && alarmHelps[j].channel === data.channel && data.eventType === 'acceptHelp') {
              alarmHelps[j].status = data.eventType === 'acceptHelp' ? '接受对讲' : '请求对讲'
              alarmHelps[j].acceptTime = state.acceptTime
              Vue.set(state.receiveWarnList[data.tabIndex], j, alarmHelps[j])
              helpRepeat = true
              break
            }
          }
          if (!helpRepeat) {
            // if (alarmHelps.length >= 50) {
            //   state.receiveWarnList[data.tabIndex].shift()
            // }
            if (state.warningTabs[state.activeWarnTab].number < 999) {
              state.warningTabs[state.activeWarnTab].number++ // 暂时关闭
            }
            data.status = (data.eventType === 'askHelp' ? '请求对讲' : '接受对讲')
            state.receiveWarnList[data.tabIndex].unshift(data)
            if (state.receiveWarnList[data.tabIndex] > 100) {
              state.receiveWarnList[data.tabIndex].splice(state.receiveWarnList[data.tabIndex].length - 1, 1)
            }
          }
        }
        console.log(state.receiveWarnList, 'state.receiveWarnList')
        return
      }
      // console.log('不应该走这里')
      if (state.warningTabs[data.tabIndex].number < 999) {
        console.log('开始累加')
        state.warningTabs[data.tabIndex].number++ // 暂时关闭
      }
      // if (data.eventType === 'faceControl' && data.isdefense && data.faceImage) { // 人脸布控
      //   console.log('faceControl 接收')
      // } else {
      //   console.log('faceControl 不接收')
      //   return
      // }
      state.receiveWarnList[data.tabIndex].unshift(data)
      if (state.receiveWarnList[data.tabIndex] > 100) {
        state.receiveWarnList[data.tabIndex].splice(state.receiveWarnList[data.tabIndex].length - 1, 1)
      }
    }
    // console.log(state.receiveWarnList, 'state.receiveWarnList')
  },
  CONFIRM_ALARM(state, payload) {
    let data = JSON.parse(JSON.stringify(payload))
    if (state.alarmPageData !== 'alarmPage' && data.devIp === state.allAlarmNewOne.devIp && data.devPort === state.allAlarmNewOne.devPort && data.channel === state.allAlarmNewOne.channel) {
      if (state.allAlarmNewOne.eventType === data.eventType) {
        state.receiveWarnList = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
      } else if (data.eventType === 'endHelp') {
        state.alarmHelpsSocketValue = []
      }
      state.videoWarnList = []
    } else if (state.alarmPageData === 'alarmPage') {
      // 报警求助 tabs显示，视频联动显示，统计分析的报警类型显示，不走table
      if (data.eventType === 'endHelp') {
        data.groupId1 = `${data.devIp}|${data.devPort}|${data.channel}|askHelp`
        data.groupId2 = `${data.devIp}|${data.devPort}|${data.channel}|acceptHelp`
        data.tabIndex = tabIndexSet(data.eventType)
        // state.receiveWarnList[data.tabIndex] = []
        state.confirmedData = []
        state.confirmedData.push(data)
      } else {
        if (data.eventType === 'vioRetrograde' || data.eventType === 'vioPark' || data.eventType === 'vioTurnLeft' || data.eventType === 'vioTurnRight') {
          data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}|${data.alarmId}`
          data.tabIndex = tabIndexSet(data.eventType)
        } else {
          data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}`
          data.tabIndex = tabIndexSet(data.eventType)
        }
        state.confirmedData = []
        state.confirmedData.push(data)
      }
    }
    for (let i = 0; i < state.allAlarmDataButFire.length; i++) {
      if (state.allAlarmDataButFire[i].alarmId === payload.alarmId) {
        state.allAlarmDataButFire.splice(i, 1)
        break
      }
    }
  },
  SET_VIDEO_WARN_LIST(state, payload) {
    console.log(payload, 'payload111111')
    // if (payload.eventType === 'soldier') { // 单兵一键报警（没有视频和图片，直接返回）
    //   return
    // }
    let data = {}
    if (payload.alarmInfo === undefined) {
      data = JSON.parse(JSON.stringify(payload))
    } else {
      data = JSON.parse(JSON.stringify(payload.alarmInfo))
    }
    let isClient = data.actionList && data.actionList.some(item => { // 判断客户端是否显示视频
      return item.client
    })
    if (data.eventType === 'patrol' || data.eventType === 'individualAlarm' || data.eventType === 'soldier' || data.eventType === 'patrolAlarm') {
      data.level = 1 // 没有级别，给加上
      if (!data.uid) {
        data.uid = `${data.uniqueId}`
      }
      if (data.eventType === 'soldier') {
        data.time = Math.floor(new Date(data.time).getTime() / 1000)
      }
      if (data.message && data.message.video) {
        data.video = data.message.video
      } else if (data.message ? data.message.photo : data.photo) {
        data.url = []
        // 经确认，巡更异常报警photo字段代表联动的图片，但单兵一键报警的photo不是联动的图片，而是单兵头像，所以不传给视频
        if (data.eventType === 'patrol' || data.eventType === 'patrolAlarm') {
          data.url.push(data.message ? data.message.photo : data.photo)
        }
      }
    } else if (data.eventType === 'askHelp' || data.eventType === 'acceptHelp' || data.eventType === 'endHelp') {
      if (isClient) {
        data.uid = `${data.devIp}|${data.devPort}|${data.channel}|${'askHelp'}`
      } else {
        return
      }
    } else if (data.eventType === 'vioRetrograde' || data.eventType === 'vioPark' || data.eventType === 'vioTurnLeft' || data.eventType === 'vioTurnRight') {
      data.url = []
      if (data.carImg1Base64) {
        data.url.push(data.carImg1Base64)
      }
      if (data.carImg2Base64) {
        data.url.push(data.carImg2Base64)
      }
      if (data.carImgBase64) {
        data.url.push(data.carImgBase64)
      }
      if (data.carNumPicBase64) {
        data.url.push(data.carNumPicBase64)
      }
      if (data.combinedPicBase64) {
        data.url.push(data.combinedPicBase64)
      }
      if (data.url.length !== 0 || isClient) {
        data.uid = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}|${data.alarmId}`
      } else {
        return
      }
    } else {
      if (isClient) {
        data.uid = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}`
      } else {
        return
      }
    }
    if (state.alarmPageData !== 'alarmPage') {
      state.videoWarnList = []
      state.videoWarnList.push(data)
      state.couldPlay = true
    } else if (state.alarmPageData === 'alarmPage') {
      console.log(state.activeWarnTab, 'state.activeWarnTab')
      if (state.videoWarnList && state.videoWarnList.length === 0) {
        for (let j = 0; j < state.alarmTypeList.length; j++) {
          if (state.alarmTypeList[j].value === state.activeWarnTab) {
            // console.log(state.filterState[state.alarmTypeList[j].lable], state.filterState[state.alarmTypeList[j].lable].flag, 'ppp')
            if (state.filterState[state.alarmTypeList[j].lable].flag === false) {
              return
            }
          }
        }
        console.log(isAcceptAlarm(data.eventType, data.level), 'isAcceptAlarm')
        if (isAcceptAlarm(data.eventType, data.level) === false) {
          return
        }
        if ((data.eventType === 'fireAlarm' || data.eventType === 'fireFailure') && data.level < state.filterState['fireAlarm'].level) {
          return
        }
        if ((data.eventType === 'askHelp' || data.eventType === 'acceptHelp' || data.eventType === 'endHelp') && data.level < state.filterState['alarmHelp'].level) {
          return
        }
        state.videoWarnList.push(data)
        state.couldPlay = true
      } else if (state.videoWarnList && state.videoWarnList.length !== 0) { // 开始同源去重
        let isRepeat = false
        for (let i = 0; i < state.videoWarnList.length; i++) {
          if (state.videoWarnList[i].uid === data.uid) {
            isRepeat = true
            state.couldPlay = false
            break
          }
        }
        if (!isRepeat) {
          state.couldPlay = true
          if (state.videoWarnList.length >= 500) {
            state.videoWarnList.shift()
          }
          for (let j = 0; j < state.alarmTypeList.length; j++) {
            if (state.alarmTypeList[j].value === state.activeWarnTab) {
              // console.log(state.filterState[state.alarmTypeList[j].lable], state.filterState[state.alarmTypeList[j].lable].flag, 'ppp')
              if (state.filterState[state.alarmTypeList[j].lable].flag === false) {
                return
              }
            }
          }
          console.log(isAcceptAlarm(data.eventType, data.level), 'isAcceptAlarm')
          if (isAcceptAlarm(data.eventType, data.level) === false) {
            return
          }
          if ((data.eventType === 'fireAlarm' || data.eventType === 'fireFailure') && data.level < state.filterState['fireAlarm'].level) {
            return
          }
          if ((data.eventType === 'askHelp' || data.eventType === 'acceptHelp' || data.eventType === 'endHelp') && data.level < state.filterState['alarmHelp'].level) {
            return
          }
          state.videoWarnList.push(data)
        }
      }
    }
  },
  SET_ACTIVE_WARN_INFOS(state, payload) {
    // if (payload.eventType === 'soldier' || payload.eventType === 'individualAlarm') { // 单兵一键报警（没有视频和图片，直接返回）
    //   return
    // }
    console.log(payload, 'payload33333')
    let data = JSON.parse(JSON.stringify(payload))
    if (data.eventType === 'vioRetrograde' || data.eventType === 'vioPark' || data.eventType === 'vioTurnLeft' || data.eventType === 'vioTurnRight') {
      if (data.carImg1Base64 || data.carImg2Base64 || data.carImgBase64 || data.carNumPicBase64 || data.combinedPicBase64 || data.carImgUrl) {
        data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}|${data.alarmId || data._id}`
        data.url = []
        data.url.push(data.carImg1Base64 || data.carImg2Base64 || data.carImgBase64 || data.carNumPicBase64 || data.combinedPicBase64 || data.carImgUrl)
      } else {
        data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}`
      }
    } else if (data.eventType === 'askHelp' || data.eventType === 'acceptHelp' || data.eventType === 'endHelp') {
      data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${'askHelp'}`
    } else if (data.eventType === 'patrol' || data.eventType === 'individualAlarm' || data.eventType === 'soldier' || data.eventType === 'patrolAlarm') {
      data.level = 1 // 没有级别，给加上
      data.groupId = `${data.uniqueId}`
      if ((data.eventType === 'individualAlarm' || data.eventType === 'soldier') && !data.uid) {
        data.uid = `${data.message.uid}`
        data.sn = `${data.message.sn}`
        data.realname = `${data.message.realname}`
      }
      if (data.message && data.message.video) {
        data.video = data.message.video
      } else if (data.message ? data.message.photo : data.photo) {
        data.url = []
        // 经确认，巡更异常报警photo字段代表联动的图片，但单兵一键报警的photo不是联动的图片，而是单兵头像，所以不传给视频
        if (data.eventType === 'patrol' || data.eventType === 'patrolAlarm') {
          data.url.push(data.message ? data.message.photo : data.photo)
        }
      }
    } else {
      data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}`
    }
    state.activeWarnInfoView = data
    if ((data.action && data.action.length !== 0) || (data.actionList && data.actionList.length !== 0) || (data.url && data.url.length !== 0)) {
      state.activeWarnInfo = data
    } else if (data.eventType === 'patrol' || data.eventType === 'individualAlarm' || data.eventType === 'soldier' || data.eventType === 'patrolAlarm') {
      state.activeWarnInfo = data
    } else {}
    console.log(state.activeWarnInfo, 'state.activeWarnInfo')
  },
  SET_ACTIVE_WARN_TAB(state, data) {
    state.activeWarnTab = data
  },
  ALL_ALARM_TOBE_SURE(state, payload) {
    let data = {}
    data = JSON.parse(JSON.stringify(payload.alarmInfo))
    // 相同报警的不同时间报警_id不同，可用groupId归类同一个报警
    if (data.eventType === 'vioRetrograde' || data.eventType === 'vioPark' || data.eventType === 'vioTurnLeft' || data.eventType === 'vioTurnRight') {
      data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}|${data.alarmId}`
    } else {
      data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}`
    }
    // 判断是否非消防报警
    if (data.eventType !== 'fireAlarm' && data.eventType !== 'fireFailure') {
      state.allAlarmDataButFire.push(data)
    }
  },
  INDEX_CHANGE(state, data) {
    state.activedIndex = data
  },
  /** 关闭当前要确认的报警的播放窗口 */
  SPLICE_CLOSE_DATA(state, data) {
    let arr = state.videoWarnList
    state.videoWarnList.map((item, index) => {
      if (data.uid === item.uid || data.uid === item.uniqueId) {
        arr.splice(index, 1)
      }
    })
    state.videoWarnList = arr
  },
  SPLICE_RECEIVE_WARN_LIST(state, data) {
    state.receiveWarnList[data.activeWarnTab].splice(data.index, 1)
  },
  CLEAR_RECEIVE_WARN_LIST(state) {
    state.receiveWarnList = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }
  },
  CLEAR_ALARMHELP_DATA(state, data) {
    state.alarmHelpsSocketValue = data
  },
  SPLICE_ALARMHELP_DATA(state, data) {
    state.alarmHelpsSocketValue.splice(data, 1)
  },
  // 警铃相关(最新一条)
  ALL_ALARM_NEWONE(state, data) {
    if (data && data.alarmInfo) {
      state.allAlarmNewOne = data.alarmInfo
    } else if (data && data.alarmInfo === undefined) {
      state.allAlarmNewOne = data
    } else {
      state.allAlarmNewOne = {}
    }
  },
  NAV_ALARM_PAGE(state, data) {
    state.alarmPageData = data
  },
  SET_ALARM_TYPE(state, data) {
    state.alarmType = data
  },
  SET_IS_ACCEPT_WARN(state, data) {
    state.isAcceptWarn = data
  },
  SPLICE_ALLALARM_DATA_BUT_FIRE(state, data) {
    for (let i = data.length - 1; i >= 0; i--) {
      state.allAlarmDataButFire.splice(i, 1)
    }
  },
  // 报警权限
  SET_ALARM_POWER_LIST(state, data) {
    state.alarmPower = {}
    data && data.properties && data.properties.forEach(item => {
      state.alarmPower[item] = 1
    })
  },
  SET_CHECK_DATA(state, data) {
    state.receiveWarnList[state.activeWarnTab] = data
  },
  SET_INDEX_NUM(state, data) {
    let tabsCountList = JSON.parse(JSON.stringify(data))
    for (let i = 0; i < state.warningTabs.length; i++) {
      if (state.warningTabs[i].value === '0') {
        state.warningTabs[i].number = (tabsCountList.normalCount > 999) ? 999 + '+' : tabsCountList.normalCount
      } else if (state.warningTabs[i].value === '1') {
        state.warningTabs[i].number = (tabsCountList.videoCount > 999) ? 999 + '+' : tabsCountList.videoCount
      } else if (state.warningTabs[i].value === '2') {
        state.warningTabs[i].number = (tabsCountList.intelligentCount > 999) ? 999 + '+' : tabsCountList.intelligentCount
      } else if (state.warningTabs[i].value === '3') {
        state.warningTabs[i].number = (tabsCountList.alarmHelpCount > 999) ? 999 + '+' : tabsCountList.alarmHelpCount
      } else if (state.warningTabs[i].value === '4') {
        state.warningTabs[i].number = (tabsCountList.fireAlarmCount > 999) ? 999 + '+' : tabsCountList.fireAlarmCount
      } else if (state.warningTabs[i].value === '5') {
        state.warningTabs[i].number = (tabsCountList.singleCount > 999) ? 999 + '+' : tabsCountList.singleCount
      } else if (state.warningTabs[i].value === '6') {
        state.warningTabs[i].number = (tabsCountList.exceptionCount > 999) ? 999 + '+' : tabsCountList.exceptionCount
      }
    }
  }
}
const isAcceptAlarm = (type, level) => {
  console.log(type, level)
  if (type === 'fireAlarm' || type === 'fireFailure') {
    console.log(state.filterState, '进去简单类别过滤')
    console.log(state.filterState['fireAlarm'], state.filterState['fireAlarm'].flag, 'flag======')
    if (state.filterState['fireAlarm'].flag === false) {
      return false
    } else {
      return true
    }
  }
  console.log('进去复杂类别过滤')
  for (const key in state.alarmDataList) {
    for (const keys in state.alarmDataList[key]) {
      for (const k in state.alarmDataList[key][keys]) {
        if (type === state.alarmDataList[key][keys][k]) {
          if (state.filterState[key].flag === false || (state.filterState[key][keys] && state.filterState[key][keys].flag === false) || (state.filterState[key] && state.filterState[key][type === 'soldier' ? 'single' : type] === false)) {
            console.log('类型过滤不通过')
            return false
          } else {
            if (state.filterState[key][keys] && level < state.filterState[key][keys].level) {
              console.log('级别过滤不通过')
              return false
            } else {
              console.log('类型、级别过滤均通过')
              return true
            }
          }
        }
      }
    }
  }
}

const tabIndexSet = (type) => {
  if (type === 'alarmInput' || type === 'alarmZone' || type === 'alarmGT') { // 普通报警 = 报警输入+报警防区
    return 0
  }
  // 视频报警 = 监控点报警+重点关注
  if (type === 'alarmMoveSense' || type === 'videoMask' ||
      type === 'sceneSwitch' || type === 'definitionAbnormal' ||
      type === 'brightnessAbnormal' || type === 'screenFreeze' ||
      type === 'noise' || type === 'signalLoss' || type === 'colorCast' ||
      type === 'focusAttention') {
    return 1
  }
  // 智能报警 = 智能报警+违章报警+人像布控
  if (type === 'perimeter' || type === 'tripwire' ||
      type === 'leftObject' || type === 'missingObject' ||
      type === 'loitering' || type === 'retrogradeDetection' ||
      type === 'lingerDetection' || type === 'doubleCordon' ||
      type === 'blackList' || type === 'whiteList' ||
      type === 'dispatch' || type === 'areaInvade' ||
      type === 'fastMove' || type === 'parkDetect' ||
      type === 'humanAssemble' || type === 'objectMove' ||
      type === 'vioRetrograde' || type === 'vioPark' ||
      type === 'vioTurnLeft' || type === 'vioTurnRight' ||
      type === 'faceDispatch' || type === 'faceControl') { // 普通报警 = 报警输入+报警防区
    return 2
  }
  // 报警求助
  if (type === 'askHelp' || type === 'acceptHelp' || type === 'endHelp') {
    return 3
  }
  // 消防报警
  if (type === 'fireAlarm' || type === 'fireFailure') {
    return 4
  }
  // 单兵报警
  if (type === 'patrol' || type === 'soldier') {
    return 5
  }
}

const receiveAlarm = (state, commit, dispatch, data) => {
  /** 导航最新报警消息 */
  commit('ALL_ALARM_NEWONE', data) // 设置导航的警铃相关(最新一条)
  dispatch('getAlarmPowers', data)
}
const removeAlarm = (state, commit, dispatch, val) => {
  const alarmNewOne = state.allAlarmNewOne
  if (val && alarmNewOne && val.devIp === alarmNewOne.devIp && val.devPort === alarmNewOne.devPort && (val.eventType === alarmNewOne.eventType || val.eventType === 'endHelp')) {
    commit('ALL_ALARM_NEWONE', {})
  }
  commit('CONFIRM_ALARM', val)
  // 如果在消防报警页面 单独处理消防报警
  if (state.alarmPageData === 'fireAlarmPage' && (val.eventType === 'fireAlarm' || val.eventType === 'fireFailure')) {
    dispatch('receiveConfirmFireAlarm', val)
  }
}

const actions = {
  /**
   * 获取电视墙信息
   */
  getAlarmWallInfo({commit}, payload) {
    return new Promise((resolve, reject) => {
      getAlarmWallApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 确认报警
   */
  confirmAlarmPatrol({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      confirmAlarm(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /* 报警过滤 */
  alarmFilters({state, commit, dispatch}, data) {
    commit('CLEAR_RECEIVE_WARN_LIST')
    let filterFactor = {}
    let params = {}
    for (let i = 0; i < state.filterStatus.length; i++) {
      if (state.filterStatus[i].value === state.activeWarnTab) {
        params = JSON.parse(JSON.stringify(state.filterState[state.filterStatus[i].lable]))
        params.dealState = state.filterState.dealState
        filterFactor = {
          param: params,
          roleId: read('roleId'),
          type: state.filterStatus[i].lable
        }
      }
    }
    return new Promise((resolve, reject) => {
      alarmFiltering(filterFactor).then(res => {
        resolve(res.data)
        // console.log(state.activeWarnTab, 'state.activeWarnTab')
        // state.receiveWarnList[state.activeWarnTab] = res.data
        commit('SET_CHECK_DATA', res.data)
        // console.log(state.receiveWarnList, 'state.receiveWarnList')
        // res.data.forEach(function(data) {
        //   // commit('SET_RECEIVE_WARNLIAST', data)
        //   commit('SET_WARN_COUNTS', data) // 设置播放警笛、tts语音
        //   commit('SET_VIDEO_WARN_LIST', data) // 设置视频播放
        // })
      }).catch(err => {
        reject(err)
      })
    })
  },
  /* 报警过滤数量 */
  alarmCounts({state, commit, dispatch}, data) {
    let filterFactor = {
      param: state.filterState
    }
    return new Promise((resolve, reject) => {
      alarmCount(filterFactor).then(res => {
        resolve(res.data)
        commit('SET_INDEX_NUM', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 改变选中过滤报警
  changeFilters({commit}, arr) {
    commit('SET_ITEM_STATE', {arr: arr})
  },
  navAlarmPage({
    commit
  }, data) {
    commit('NAV_ALARM_PAGE', data)
  },
  creatReceiveWarnList({ commit }) {
    // commit('CREAT_RECEIVE_WARNLIST')
  },
  /**
   * 接收socket推送的报警信息以及确认报警的信息
   */
  alarmWarning({ state, commit, dispatch }) {
    alarm.on('all', (data) => {
      receiveAlarm(state, commit, dispatch, data)
    })
    alarm.on('confirmAlarm', (val) => {
      removeAlarm(state, commit, dispatch, val)
    })
    alarm.on('patrol', (data) => {
      let patrolData = JSON.parse(JSON.stringify(data))
      patrolData.eventType = 'patrol'
      receiveAlarm(state, commit, dispatch, patrolData)
    })
    alarm.on('singlePawnMsg', (data) => {
      let patrolData = JSON.parse(JSON.stringify(data))
      patrolData.eventType = 'patrol'
      receiveAlarm(state, commit, dispatch, patrolData)
    })
    alarm.on('singlePawn', (data) => {
      let singelData = JSON.parse(JSON.stringify(data))
      singelData.eventType = 'soldier'
      receiveAlarm(state, commit, dispatch, singelData)
    })
  },
  /** 清除导航栏报警信息 */
  clearNavWarningData({
    commit,
    data
  }) {
    commit('ALL_ALARM_NEWONE', data)
  },
  clearWarningList({
    commit,
    data
  }) {
    alarm.remove('all', () => {})
    alarm.remove('confirmAlarm', () => {})
  },
  setActiveWarnInfo({
    commit
  }, data) {
    commit('SET_ACTIVE_WARN_INFOS', data)
  },
  setActiveWarnTab({
    commit
  }, data) {
    commit('SET_ACTIVE_WARN_INFOS', {})
    commit('SET_ACTIVE_WARN_TAB', data)
  },
  spliceReceiveWarnList({
    commit
  }, data) {
    commit('SPLICE_RECEIVE_WARN_LIST', data)
  },
  confirmWarnMessages({
    state,
    commit
  }, obj) {
    let sendList = []
    obj.list.map((item, index) => {
      sendList.push({
        _id: item.eventType === 'soldier' ? item.uid : (item._id ? item._id : item.alarmId),
        ackContent: JSON.stringify(item.ackContentItem),
        devIp: item.devIp,
        devPort: item.devPort,
        channel: parseInt(item.channel),
        eventType: item.eventType,
        devId: item.devId,
        channelId: item.channelId,
        index: item.index !== undefined ? item.index : '',
        ackType: obj.ackType
      })
    })
    const data = {
      alarmIdList: sendList
    }
    const param = {
      body: data,
      url: '/alarm/alarmaffirm'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  clearAlarmHelpData({
    commit
  }, data) {
    commit('CLEAR_ALARMHELP_DATA', data)
  },
  clearVideoWarnList({commit}, data) {
    commit('CLOSE_VIDEO_WARNLIAT', data)
  },
  spliceAlarmHelpData({commit}, data) {
    commit('SPLICE_ALARMHELP_DATA', data)
  },
  setIsAcceptWarn({commit}, data) {
    commit('SET_IS_ACCEPT_WARN', data)
  },
  /* 获取报警权限 */
  getAlarmPowers({state, commit, dispatch}, data) {
    if (data && (data.eventType === 'patrol' || data.eventType === 'soldier')) {
      commit('SET_RECEIVE_WARNLIAST', data) // 设置报警列表
      commit('SET_WARN_COUNTS', data) // 设置播放警笛、tts语音
      commit('SET_VIDEO_WARN_LIST', data) // 设置视频播放
      return
    }
    let type = '0'
    switch (data.alarmInfo.eventType) {
      case 'alarmInput':
      case 'alarmZone':
      case 'alarmGT':
        type = '1'
        break
      case 'fireAlarm':
      case 'fireFailure':
        type = '2'
        break
      case 'askHelp':
      case 'acceptHelp':
      case 'endHelp':
        type = '3'
        break
      case 'faceControl':
        type = '5'
        break
      default:
        type = '0'
        break
    }
    let param = {
      roleId: read('roleId'),
      resId: data.alarmInfo.channelId || data.alarmInfo.devId,
      type: type
    }
    if (!param.resId) { return }
    return new Promise((resolve, reject) => {
      getAlarmPower(param).then(res => {
        // console.log(res.data, '权限')
        commit('SET_ALARM_POWER_LIST', res.data) // 设置权限列表
        commit('SET_RECEIVE_WARNLIAST', data) // 设置报警列表
        commit('SET_WARN_COUNTS', data) // 设置播放警笛、tts语音
        commit('SET_VIDEO_WARN_LIST', data) // 设置视频播放
        // 如果正处于消防报警页面，单独处理消防报警
        if (state.alarmPageData === 'fireAlarmPage') {
          dispatch('receiveFireAlarm', {alarmInfo: data.alarmInfo, alarmPermission: state.alarmPower})
        }
        // commit('ALL_ALARM_TOBE_SURE', data) // 不再需要
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /* 获取报警主机及防区权限 */
  getAlarmHostPowers(store, data) {
    const param = {
      roleId: read('roleId'),
      resId: data,
      type: '1'
    }
    return getAlarmPower(param)
  }
}

const getters = {
  allAlarmNewOneData(state) {
    let data = ''
    if (state.allAlarmNewOne.eventType) {
      data = {
        name: state.allAlarmNewOne.name,
        organization: state.allAlarmNewOne.organization,
        time: state.allAlarmNewOne.eventType === 'soldier' ? Date.parse(new Date(state.allAlarmNewOne.time)) / 1000 : (state.allAlarmNewOne.eventType === 'patrol' ? (state.allAlarmNewOne.message ? state.allAlarmNewOne.message.date : state.allAlarmNewOne.date + state.allAlarmNewOne.date.moment) : state.allAlarmNewOne.time),
        eventType: state.allAlarmNewOne.eventType,
        tabIndex: tabIndexSet(state.allAlarmNewOne.eventType),
        attentionType: state.allAlarmNewOne.attentionType
      }
    } else {
      data = {}
    }
    return data
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
