import {
  put
} from '../../../http/base.js'
const state = {
  record: []
}
const getters = {
  getRecord(state) {
    return state.record
  }
}
const mutations = {
  // SET_STORESON_FLAG(state, payLoad) {
  //   state.storesonFlag = payLoad
  // }
}

const actions = {
  //  获取所有录像配置
  changeRecordByTree({
    commit,
    state
  }, obj) {
    const params = {
      body: obj,
      url: '/setting/record/'
    }
    return new Promise((resolve, reject) => {
      put(params).then(res => {
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
