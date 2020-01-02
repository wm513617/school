import {
  get,
  post,
  remove,
  put
} from '../../../http/base.js'
const state = {
  planTemplates: [],
  planMolde: []
}
const getters = {
  getPlan(state) {
    return state.planTemplates
  },
  getPlanMolde(state) {
    return state.planMolde
  }
}
const mutations = {
  // SET_STORESON_FLAG(state, payLoad) {
  //   state.storesonFlag = payLoad
  // }
}

const actions = {
  //  获取所有抓图计划
  getplanByUser({
    commit,
    state
  }, obj) {
    const params = {
      query: {},
      url: '/setting/template'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  //  获取所有抓图计划
  getplanName({
    commit,
    state
  }, obj) {
    const params = {
      query: {},
      url: '/setting/template/name'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  //  添加抓图计划
  addPlanByUser({
    commit,
    state
  }, obj) {
    console.log(2, JSON.stringify(obj))
    const params = {
      body: obj,
      url: '/setting/template'
    }
    return new Promise((resolve, reject) => {
      post(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  // 修改抓图计划
  changePlanByUser({
    commit,
    state
  }, obj) {
    console.log(2, JSON.stringify(obj))
    const params = {
      body: obj.v,
      url: '/setting/template/' + obj.v._id
    }
    return new Promise((resolve, reject) => {
      put(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  //  删除抓图计划
  delectPlanByUser({
    commit,
    state
  }, obj) {
    console.log(2, obj._id)
    const params = {
      url: '/setting/template/' + obj._id
    }
    return new Promise((resolve, reject) => {
      remove(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
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
