import {
  getSafePolicyApi,
  editSafePolicyApi
} from '../../../http/userManage.api'

const state = {
  policyData: {
    passwordType: 'low',
    loginCount: 6,
    lockTime: 1,
    length: 5,
    initPassword: '123456'
  }
}

const mutations = {
  /**
   * 安全策略
   * @method GET_SAFE_POLICY
   */
  GET_SAFE_POLICY(state, payload) {
    if (!payload.length) {
      payload.length = 5
    }
    state.policyData = payload
  }
}

const actions = {
  /**
   * 获取安全策略
   * @method getSafePolicy
   */
  getSafePolicy({ commit }) {
    return new Promise((resolve, reject) => {
      getSafePolicyApi().then(res => {
        resolve(res)
        commit('GET_SAFE_POLICY', res.data)
      }).catch(err => {
        console.log('this.getSafePolicy :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 修改安全策略
   * @method editSafePolicy
   * @param {Object} data 修改后的安全策略数据
   */
  editSafePolicy({ commit }, param) {
    return new Promise((resolve, reject) => {
      editSafePolicyApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.editSafePolicy :', err.response.data.message)
        reject(err.response.data)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
