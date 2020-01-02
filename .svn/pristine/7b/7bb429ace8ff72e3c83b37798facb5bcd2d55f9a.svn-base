import { get, put, post } from '../../../http/base'
import axios from 'axios'

const state = {
  alarmTermData: []
}
const getters = {

}
const mutations = {
  GET_ALARM_TERM_DATA(state, data) {
    state.alarmTermData = data
  }
}
const actions = {
  // 列表数据获取
  getAlarmTermData({ commit, state }, payload) {
    const param = {
      url: 'setting/alarmhelp/client',
      query: {
        name: payload.name,
        page: payload.page,
        limit: payload.limit
      }
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_ALARM_TERM_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  // 表格添加保存
  addAlarmTermianl({ commit, state }, data) {
    const param = {
      body: data,
      url: 'setting/alarmhelp/client'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 表格修改保存,及联动配置保存
  editAlarmTermianl({ commit, state }, data) {
    const id = data._id
    delete data._id
    if (data.configType) {
      delete data.configType
    }
    const param = {
      body: data,
      url: 'setting/alarmhelp/client/' + id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  delAlarmTerminal({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      axios({
        headers: { 'x-bsc-ids': data },
        url: 'setting/alarmhelp/client',
        method: 'delete'
      }).then((res) => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 获取机构资源树
  getResourceTree({ state, commit }) {
    const params = {
      url: '/setting/resource/tree?type=0'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
        console.log('this.getResourceTree :' + err)
      })
    })
  },
  offTerminalRingAudio({ commit, state }, data) {
    const param = {
      body: data,
      url: 'ctl/talkServerTerminalOutPutSet' // 北京接口
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
