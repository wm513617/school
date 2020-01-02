import {
  get,
  post,
  put,
  remove
} from '../../http/base'
const state = {
  structureList: []
}
const mutations = {
  GET_RES_LIST(state, payload) {
    state.structureList = payload
  }
}
const actions = {
  getResList({
    commit
  }) {
    const param = {
      url: '/vehicle/structure'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('GET_RES_LIST', res.data)
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  addResList({
    commit
  }, payload) {
    const param = {
      body: payload,
      url: '/vehicle/structure'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  editResList({
    commit
  }, payload) {
    const param = {
      body: payload,
      url: '/vehicle/structure'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  deleteResList({
    commit
  }, payload) {
    const param = {
      url: '/vehicle/structure'
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        params: payload
      }).then(res => {
        console.log(res)
        resolve(res.data)
      }).catch(err => reject(err))
    })
  }
}

export default {
  state,
  mutations,
  actions
}
