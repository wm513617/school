import { alarmFiltering, alarmCount } from 'http/alarm.api'
import { read } from '../../../storage/index'

const state = {
  fireAlarmFilter: { // 过滤状态
    flag: true,
    level: 1,
    isShowConfirmed: false
  },
  warningTabs: [
    {
      title: '消防报警',
      value: '0',
      number: 0,
      disabled: false,
      active: true
    }
  ],
  fireAlarmPageData: '',
  fireAlarmData: [], // 消防报警数据
  activeWarnInfo: {}, // 当前点击的消防报警
  fireAlarmVideos: [], // 消防报警联动视频
  confirmFireAlarm: [], // 收到确认的消防报警信息
  fireAlarmCounts: 0,
  fireAlarmNewData: {} // 最新的消防报警
}

const mutations = {
  SET_FIRE_ALARM_DATA(state, data) {
    state.fireAlarmData = data
  },
  CLEAR_FIREALARM_VIDEOS() {
    state.fireAlarmVideos = []
  },
  SPLICE_FIREALARM_VIDEOS(state, data) {
    let arr = state.fireAlarmVideos
    state.fireAlarmVideos.map((item, index) => {
      if (data.uid === item.uid) {
        arr.splice(index, 1)
      }
    })
    state.fireAlarmVideos = arr
  },
  SET_FIRE_ALARM_FILTER(state, data) {
    state.fireAlarmFilter = data
  },
  NAV_FIREALARM_PAGE(state, data) {
    state.fireAlarmPageData = data
  },
  // 实时接收消防报警信息
  RECEIVE_WARNNING(state, payload) {
    let data = JSON.parse(JSON.stringify(payload.alarmInfo))
    state.fireAlarmCounts++
    state.fireAlarmNewData = data
    data.alarmPermission = JSON.parse(JSON.stringify(payload.alarmPermission))
    state.fireAlarmData.unshift(data)
    if (state.warningTabs[0].number < 999) {
      state.warningTabs[0].number++
    }
  },
  RECEIVE_FIREALARM_VIDEO(state, data) {
    let isClient = data.actionList && data.actionList.some(item => { // 判断客户端是否显示视频
      return item.client
    })
    if (isClient) {
      data.uid = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}`
      if (state.fireAlarmVideos.length === 0) {
        state.fireAlarmVideos.push(data)
      } else {
        // 同源报警联动视频去重
        let isRepeat = false
        for (let i = 0; i < state.fireAlarmVideos.length; i++) {
          if (state.fireAlarmVideos[i].uid === data.uid) {
            isRepeat = true
            break
          }
        }
        if (!isRepeat) {
          state.fireAlarmVideos.push(data)
        }
      }
      console.log(state.fireAlarmVideos, '==================================')
    }
  },
  RECEIVE_CONFIRM_FIREALARM(state, data) {
    data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}`
    state.confirmFireAlarm = []
    state.confirmFireAlarm.push(data)
  },
  SET_ACTIVE_WARN_INFO(state, data) {
    data.groupId = `${data.devIp}|${data.devPort}|${data.channel}|${data.eventType}`
    state.activeWarnInfo = data
  },
  SET_COUNTS(state, data) {
    state.warningTabs[0].number = data.fireAlarmCount > 999 ? '999+' : data.fireAlarmCount
  },
  REDUCE_TAB_COUNTS(state, data) {
    if (state.warningTabs[0].number === '999+' || state.warningTabs[0].number <= 0) { return }
    state.warningTabs[0].number--
  },
  CLEAR_TAB_COUNTS(state) {
    state.warningTabs[0].number = 0
  }
}

const actions = {
  fireAlarmPage({
    commit
  }, data) {
    commit('NAV_FIREALARM_PAGE', data)
  },
  // 实时接收消防报警
  receiveFireAlarm({state, commit}, payload) {
    // 消防报警 过滤
    if (!state.fireAlarmFilter.flag) { return }
    let data = JSON.parse(JSON.stringify(payload.alarmInfo))
    if ((data.eventType === 'fireAlarm' || data.eventType === 'fireFailure') && data.level >= state.fireAlarmFilter.level) {
      commit('RECEIVE_WARNNING', payload)
      commit('RECEIVE_FIREALARM_VIDEO', data)
    }
  },
  // 从数据库中按照过滤条件 获取消防报警数据
  getFireAlarmLists({commit, state}, data) {
    const payload = {
      param: {
        flag: state.fireAlarmFilter.flag,
        level: state.fireAlarmFilter.level,
        dealState: state.fireAlarmFilter.isShowConfirmed ? 'process' : 'unProcess'
      },
      roleId: read('roleId'),
      type: 'fireAlarm'
    }
    return new Promise((resolve, reject) => {
      alarmFiltering(payload).then(res => {
        commit('SET_FIRE_ALARM_DATA', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取数据库中消防报警数量
  getFireAlarmCounts({commit, state}, data) {
    const params = {
      param: {
        alarmHelp: {flag: false, level: 1},
        exception: {flag: false},
        intelligent: {flag: false, face: {flag: false, level: 1}, intelligent: {flag: false, level: 1}, violation: {flag: false, level: 1}},
        normal: {flag: false, alarmInput: {flag: false, level: 1}, alarmZone: {flag: false, level: 1}},
        single: {flag: false, single: false, patrol: false},
        video: {flag: false, focus: {flag: false, level: 1}, monitor: {flag: false, level: 1}},
        fireAlarm: {flag: state.fireAlarmFilter.flag, level: state.fireAlarmFilter.level},
        dealState: state.fireAlarmFilter.isShowConfirmed ? 'process' : 'unProcess'
      }
    }
    return new Promise((resolve, reject) => {
      alarmCount(params).then(res => {
        commit('SET_COUNTS', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 收到消防报警 确认信息
  receiveConfirmFireAlarm({commit}, data) {
    commit('RECEIVE_CONFIRM_FIREALARM', data)
  }
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
