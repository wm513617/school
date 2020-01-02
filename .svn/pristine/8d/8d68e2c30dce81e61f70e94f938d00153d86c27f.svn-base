import { get, put } from '../../http/base'
const state = {
  pasw: ['low', 'weak', 'middle', 'strong'],
  getSafeData: {}
}
const mutations = {
  GET_SAVE_DATA(state, payLoad) {
    state.getSafeData = payLoad
  }
}
const actions = {
  // 获取安全策略配置
  getSafeSet({state, commit}) {
    const param = {
      url: '/setting/strategy'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_SAVE_DATA', res.data)
        // console.log(res.data)
      }).catch(err => {
        console.log('getSafeSet error:' + err)
        reject(err)
      })
    })
  },
  // 修改安全策略
  reviseSafeSet({state, commit}, payLoad) {
    const param = {
      body: payLoad,
      url: '/setting/strategy'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('reviseSafeSet error:' + err)
        reject(err)
      })
    })
  }
}
export default {
  state,
  mutations,
  actions
}
