import {
  msgReplay,
  confirmAlarm,
  confirmSingleAlarm,
  nearestSingleAlarm
} from '@http/patrolAlarm.api'
import moment from 'moment'

const state = {
  nearestSingle: [],
  patrolAlarmList: [], // 巡更报警
  patrolModalType: '',
  patrolShow: false,
  patrolAlarmData: null,
  isRelyModal: false, // 消息弹框
  singleAlarmData: null, // 单兵一键报警数据
  singleAlarmList: [], // 单兵报警
  alarmType: '',
  patrolId: '',
  singleId: '',
  singleAlarmInDatabase: [], // 从数据库 中获取的单兵报警数据
  listTotal: [],
  modalStatus: false,
  talkDataInfo: {}, // 对讲信息
  isTalkModal: false
}

const getters = {
  nearestSingleList(state) {
    return state.nearestSingle
  },
  // 单兵一键报警、常规信息、巡更报警数据
  singleAllList(state) {
    return state.listTotal
  }
}

const mutations = {
  SET_SINGLE_TOTAL(state, payload) {
    state.listTotal.unshift(payload)
  },
  GET_NEAREST_SINGLE(state, payload) {
    state.nearestSingle = payload
  },
  GET_PATROL_TYPE(state, data) {
    state.patrolModalType = data
  },
  SAVE_PATROL_STUATES(state, payload) {
    state.patrolShow = payload
  },
  SAVE_PATROL_DATA(state, payload) {
    state.patrolAlarmData = JSON.parse(JSON.stringify(payload))
  },
  SAVE_PATROL_RELY_STUATES(state, payload) {
    state.isRelyModal = payload
  },
  SAVE_SINGLE_DATA(state, payload) {
    state.singleAlarmData = JSON.parse(JSON.stringify(payload))
  },
  SAVE_ALARM_TYPE(state, payload) {
    state.alarmType = payload
  },
  SAVE_PATROL_ID(state, payload) {
    if (payload.type !== 'talkAlarm') {
      state.patrolId = payload.uniqueId
    } else {
      state.patrolId = payload.srcId
    }
    for (let i = 0; i < state.listTotal.length; i++) {
      if (payload.type !== 'talkAlarm') {
        if (payload.uniqueId === state.listTotal[i].uniqueId) {
          state.listTotal.splice(i, 1)
        }
      } else {
        if (payload.srcId === state.listTotal[i].srcId) {
          state.listTotal.splice(i, 1)
        }
      }
    }
  },
  GET_MAP_SINGLE_ALARM(state, payload) {
    let data
    data = JSON.parse(JSON.stringify(payload))
    state.listTotal = []
    let message = {}
    data.map(item => {
      if (item.eventType === 'patrolAlarm') {
        message = {
          message: {
            ...item.message,
            time: moment(item.message.date * 1000).format('YYYY-MM-DD') + ' ' + item.message.moment
          },
          type: item.eventType === 'patrolAlarm' ? '巡更异常上报' : '单兵一键报警',
          isType: true,
          msgType: item.message.type,
          uniqueId: item.uniqueId,
          map3D: item.message.point3D,
          _id: item.message._id,
          alarmTypeToMap: 'patrolAlarm'
        }
      } else {
        message = {
          realname: item.message.realname,
          time: item.message.time,
          uniqueId: item.message.uniqueId,
          phone: item.message.phone,
          photo: item.message.photo,
          type: item.eventType === 'patrolAlarm' ? '巡更异常上报' : '单兵一键报警',
          isAlarm: true,
          isType: false,
          uid: item.message.uid,
          point: item.message.point,
          alarmTypeToMap: 'singleAlarm'
        }
      }
      state.listTotal.push(message)
    })
  },
  SAVE_TALK_DATA(state, payload) {
    state.talkDataInfo = payload
  },
  SAVE_TALK_STUATES(state, payload) {
    state.isTalkModal = payload
  },
  SAVE_MODAL_STATUS(state, payload) {
    state.modalStatus = payload
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
  },
  // 从数据库 中获取报警数据
  getMapSingleAlarm({commit}, data) {
    commit('GET_MAP_SINGLE_ALARM', data)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
