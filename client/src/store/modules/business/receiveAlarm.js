import {
  get,
  put,
  post
} from '../../../http/base'
import axios from 'axios'

const state = {
  receiveAlarmData: [],
  historyDataStore: []
}
const getters = {

}
const mutations = {
  GET_BUSINESS_ALARM(state, data) {
    state.receiveAlarmData = data
  },
  GET_BUSINESS_HISTORY(state, data) {
    state.historyDataStore = data
  }
}
const actions = {
  // 获取接警列表
  getBusinessAlarm({
    commit,
    state
  }, payload) {
    const param = {
      url: 'business/alarm',
      query: payload
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_BUSINESS_ALARM', res.data)
      }).catch(err => reject(err))
    })
  },
  // 接警 新建
  addBusinessAlarm({
    commit,
    state
  }, data) {
    delete data.alarmTimeyms
    delete data._id
    delete data.eventCode
    const param = {
      body: data,
      url: 'business/alarm'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 接警 修改
  editBusinessAlarm({
    commit,
    state
  }, data) {
    delete data.alarmTimeyms
    const id = data._id
    delete data._id
    delete data.eventCode
    const param = {
      body: data,
      url: 'business/alarm/' + id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 删除 接警
  delBusinessAlarm({
    commit,
    state
  }, data) {
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          'x-bsc-ids': data
        },
        url: 'business/alarm',
        method: 'delete'
      }).then((res) => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 接警 处理
  disposeBusinessAlarm({
    commit,
    state
  }, data) {
    var id = data._id
    delete data._id
    const param = {
      body: data,
      url: 'business/alarm/handle/' + id
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  getHistoryData({
    commit,
    state
  }, payload) {
    const param = {
      url: 'business/alarm/history',
      query: payload
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_BUSINESS_HISTORY', res.data)
      }).catch(err => reject(err))
    })
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
