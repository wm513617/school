import {
  getActionApi,
  addActionApi,
  delActionApi,
  modifyActionApi
} from '../../../http/userManage.api'

const state = {
  powerData: []
}

const mutations = {
  GET_ALL_POWER(state, payLoad) {
    state.powerData = payLoad
  }
}

const actions = {
  /**
   * 获取角色功能权限
   * @method getAction
   */
  getAction({ commit }) {
    return new Promise((resolve, reject) => {
      getActionApi().then(res => {
        commit('GET_ALL_POWER', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getAction :' + err)
        reject(err)
      })
    })
  },
  /**
   * 增加角色功能权限
   * @method addAction
   */
  addAction({ commit }, param) {
    return new Promise((resolve, reject) => {
      addActionApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
        console.log('this.addAction :' + err)
      })
    })
  },
  /**
   * 删除角色功能权限
   * @method delAction
   */
  delAction({ state }, param) {
    return new Promise((resolve, reject) => {
      delActionApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
        console.log('this.delAction :' + err)
      })
    })
  },
  /**
   * 修改角色功能权限
   * @method modifyAction
   */
  modifyAction({ state }, param) {
    return new Promise((resolve, reject) => {
      modifyActionApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
        console.log('this.modifyAction :' + err)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
