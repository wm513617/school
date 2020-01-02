import {
  get,
  put,
  post
} from '../../../http/base'
import axios from 'axios'

const state = {
  alarmHelpServer: null,
  alarmCenter: []
}
const getters = {

}
const mutations = {
  GET_ALARM_HELP_SERVER(state, data) {
    state.alarmHelpServer = data
  },
  GET_ALARM_CENTER(state, data) {
    state.alarmCenter = data
  }
}
const actions = {
  // 服务器配置获取
  getAlarmHelpServer({
    commit,
    state
  }) {
    const param = {
      url: 'setting/alarmhelp/server'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_ALARM_HELP_SERVER', res.data.device)
      }).catch(err => reject(err))
    })
  },
  // 服务器配置保存
  setAlarmHelpServer({
    commit,
    state
  }, data) {
    const param = {
      body: data,
      url: 'setting/alarmhelp/server'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 接警获取
  getAlarmCenter({
    commit,
    state
  }, payload) {
    const param = {
      url: 'setting/alarmhelp/receive',
      query: {
        name: payload.name,
        page: payload.page,
        limit: payload.limit
      }
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_ALARM_CENTER', res.data)
      }).catch(err => reject(err))
    })
  },
  // 接警添加保存
  addAlarmCenter({
    commit,
    state
  }, data) {
    delete data._id
    const param = {
      body: data,
      url: 'setting/alarmhelp/receive'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 接警修改保存
  editAlarmCenter({
    commit,
    state
  }, data) {
    delete data.body._id
    const param = {
      body: data.body,
      url: 'setting/alarmhelp/receive/' + data.id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 删除接警中心数据
  delAlarmCenter({
    commit,
    state
  }, data) {
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          'x-bsc-ids': data
        },
        url: 'setting/alarmhelp/receive',
        method: 'delete'
      }).then((res) => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  offRingAudio({
    commit,
    state
  }, data) {
    const param = {
      body: data,
      url: 'ctl/setDevAlarmOutPut' // 北京接口
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
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
