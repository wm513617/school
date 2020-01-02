import {
  get,
  post,
  put,
  remove
} from '../../http/base'
const state = {
  list: [],
  count: 0,
  cur: 1,
  limit: 10,
  pages: 1
  // 表格数据
}
const getters = {
}
const mutations = {
  GET_DICT_LIST(state, payload) {
    console.log(payload, 19)
    state.list = payload.data
    state.count = payload.headers['x-bsc-count']
    state.cur = payload.headers['x-bsc-cur']
    state.limit = payload.headers['x-bsc-limit']
    state.pages = payload.headers['x-bsc-pages']
  }
}
const actions = {
  addDict({ commit }, payload) {
    var param = {
      body: payload,
      url: '/setting/dict'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  getDictList({ commit }, payload) {
    var param = {
      query: payload,
      url: '/setting/dict'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('GET_DICT_LIST', res)
      }).catch(err => reject(err))
    })
  },
  editDict({ commit }, payload) {
    var param = {
      body: payload,
      url: '/setting/dict/' + payload._id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  deleteDict({ commit }, payload) {
    var param = {
      url: '/setting/dict/' + payload._id
    }
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
