import {
  msgReplay,
  confirmAlarm,
  confirmSingleAlarm,
  nearestSingleAlarm
} from '@http/patrolAlarm.api'

const state = {
  nearestSingle: [],
  patrolAlarmList: [], // 巡更报警
  patrolModalType: '',
  patrolShow: false,
  patrolAlarmData: null,
  isRelyModal: false,
  singleAlarmData: null, // 单兵一键报警数据
  singleAlarmList: [], // 单兵报警
  alarmType: ''
}

const getters = {
  nearestSingleList(state) {
    return state.nearestSingle
  },
  singleAllList(state) {
    return state.patrolAlarmList.concat(state.singleAlarmList)
  }
}

const mutations = {
  GET_NEAREST_SINGLE(state, payload) {
    state.nearestSingle = payload
  },
  SAVE_PATROL_LIST(state, payload) {
    console.log('巡更', payload)
    state.patrolAlarmList = []
    state.patrolAlarmList = JSON.parse(JSON.stringify(payload))
  },
  GET_PATROL_TYPE(state, data) {
    console.log('巡更11', data)
    state.patrolModalType = data
  },
  SAVE_PATROL_STUATES(state, payload) {
    console.log('SAVE_PATROL_STUATES', payload)
    state.patrolShow = payload
  },
  SAVE_PATROL_DATA(state, payload) {
    console.log('巡更patrolAlarmData', payload)
    state.patrolAlarmData = JSON.parse(JSON.stringify(payload))
  },
  SAVE_PATROL_RELY_STUATES(state, payload) {
    console.log('SAVE_PATROL_RELY_STUATES', payload)
    state.isRelyModal = payload
  },
  SAVE_SINGLE_DATA(state, payload) {
    console.log('单兵patrolAlarmData', payload)
    state.singleAlarmData = JSON.parse(JSON.stringify(payload))
  },
  SAVE_SINGLE_LIST(state, payload) {
    console.log('单兵', payload)
    state.singleAlarmList = []
    state.singleAlarmList = JSON.parse(JSON.stringify(payload))
  },
  SAVE_ALARM_TYPE(state, payload) {
    console.log('装填', payload)
    state.alarmType = payload
  }
}

const actions = {
  /**
   * 消息回复发送
   */
  massageReplay({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      msgReplay(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   * 确认报警
   */
  confirmAlarms({
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
  confirmSingle({}, id) {
    return new Promise((resolve, reject) => {
      confirmSingleAlarm(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /**
   * 地图,获取报警点位附近单兵
   * payload 报警点位id
   */
  nearestSingle({
    commit
  }, payload) {
    return new Promise((resolve, reject) => {
      nearestSingleAlarm(payload)
        .then(res => {
          commit('GET_NEAREST_SINGLE', res.data)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
