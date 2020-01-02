import {
  getGroupList,
  addGroup,
  setGroup,
  delGroup,
  getUserList,
  addUser,
  setUser,
  delUser
} from '../../../http/veriface/manage.api'
const actions = {
  // 底库相关
  getGroup({ commit }) {
    return new Promise((resolve, reject) => {
      getGroupList()
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  addGroup({ commit }, params) {
    return new Promise((resolve, reject) => {
      addGroup(params)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  setGroup({ commit }, params) {
    return new Promise((resolve, reject) => {
      setGroup(params)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  delGroup({ commit }, params) {
    return new Promise((resolve, reject) => {
      delGroup(params)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 用户相关
  getManagUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      getUserList(params)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  addManageUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      console.log(params)
      addUser(params)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  setManageUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      setUser(params)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  delManageUser({ commit }, params) {
    return new Promise((resolve, reject) => {
      delUser(params)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }
}

export default {
  actions
}
