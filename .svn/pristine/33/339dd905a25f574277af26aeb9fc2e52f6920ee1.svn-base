import {
  get,
  put,
  post
} from '../../../http/base'
import axios from 'axios'

const state = {
  dutyLogData: [],
  dutyPerson: []
}
const getters = {
  todyDutyPersonList(state) {
    var list = []
    state.dutyPerson.map((item) => {
      list.push({
        label: item.name,
        value: item._id
      })
    })
    return list
  }
}
const mutations = {
  GET_BUSINESS_DUTYLOG(state, data) {
    state.dutyLogData = data
  },
  GET_DUTY_PERSON(state, data) {
    state.dutyPerson = data
  }
}
const actions = {
  // 获取列表
  getDutyLog({
    commit,
    state
  }, payload) {
    const param = {
      url: 'business/duty/log',
      query: payload
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_BUSINESS_DUTYLOG', res.data)
      }).catch(err => reject(err))
    })
  },
  // 新建
  addDutyLog({
    commit,
    state
  }, data) {
    delete data.staff.title
    delete data.staff.phone
    delete data.staff.groupName
    const param = {
      body: data,
      url: 'business/duty/log'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 修改
  editDutyLog({
    commit,
    state
  }, data) {
    // 修改时 staff是值班人的_id，不是对象
    var staffId = data.staff._id
    delete data.staff
    data.staff = staffId
    const id = data._id
    delete data._id
    const param = {
      body: data,
      url: 'business/duty/log/' + id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 删除
  delDutyLog({
    commit,
    state
  }, data) {
    return new Promise((resolve, reject) => {
      axios({
        headers: {
          'x-bsc-ids': data
        },
        url: 'business/duty/log',
        method: 'delete'
      }).then((res) => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 获取今日值班人列表
  getDutyPerson({
    commit,
    state
  }, payload) {
    const param = {
      url: 'business/duty/today',
      query: payload
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_DUTY_PERSON', res.data)
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
