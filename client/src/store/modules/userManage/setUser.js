import {
  getUserListApi,
  addUserApi,
  getUserInfoApi,
  editUserInfoApi,
  getUserLogApi,
  delUserApi,
  editPwdApi,
  getUserDetailApi,
  getmoduleListApi,
  moveNodeApi,
  searchUkeysApi
} from '../../../http/userManage.api'
import moment from 'moment'

function timeTransform(sec) {
  let data = ''
  let h = parseInt(sec / 3600)
  let m = parseInt((sec % 3600) / 60)
  let s = parseInt((sec % 3600) % 60)
  if (h > 0) {
    data += h + '小时'
  }
  if (m > 0) {
    data += m + '分钟'
  }
  if (s > 0) {
    data += s + '秒'
  }
  return data
}

const state = {
  userList: '',
  userInfo: '',
  userLog: '',
  userLogList: [],
  userDetailList: []
}

const mutations = {
  /**
   * 用户列表
   * @method GET_USER_LIST
   */
  GET_USER_LIST_TREE(state, payload) {
    state.userList = payload
  },
  /**
   * 用户详情
   * @method GET_USER_INFO
   */
  GET_USER_INFO(state, payload) {
    state.userInfo = payload
  },
  /**
   * 用户日志
   * @method GET_USER_LOG
   */
  GET_USER_LOG(state, payload) {
    state.userLog = payload
  },
  /**
   * 用户日志详情
   * @method GET_USER_LOG_LIST
   */
  GET_USER_LOG_LIST(state, payload) {
    state.userLogList = {
      logs: payload.data,
      count: parseInt(payload.headers['x-bsc-count'])
    }
  }
}

const getters = {
  userDetails(state) {
    return {
      name: state.userInfo.name,
      password: state.userInfo.pwd,
      realName: state.userInfo.realName,
      role: state.userInfo.role,
      rank: state.userInfo.level,
      date: state.userInfo.exptime !== -1 ? moment.unix(state.userInfo.exptime).format('YYYY-MM-DD') : '',
      Indefinitely: state.userInfo.exptime === -1 ? Boolean(1) : Boolean(0),
      duty: state.userInfo.duty === 'yes' ? Boolean(1) : Boolean(0)
    }
  },
  userLogs(state) {
    if (!state.userLog) { return }
    let logData = JSON.parse(JSON.stringify(state.userLog))
    logData.data.results.map(item => {
      item.loginTime = moment.unix(item.loginTime).format('YYYY-MM-DD HH:mm:ss')
      item.logoutTime = moment.unix(item.logoutTime).format('YYYY-MM-DD HH:mm:ss')
      item.user = item.user.realName ? item.user.realName : '-'
      item.onlineTime = timeTransform(parseInt(item.onlineTime))
      item.macIp = '-'
    })
    return {
      count: parseInt(logData.headers['x-bsc-count']),
      logs: logData.data.results
    }
  }
}

const actions = {
  /**
   * 获取用户列表
   * @method getUserListTree
   */
  getUserListTree({ commit }) {
    return new Promise((resolve, reject) => {
      getUserListApi().then(res => {
        commit('GET_USER_LIST_TREE', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getUserListTree :', err)
        reject(err)
      })
    })
  },
  /**
   * 增加用户
   * @method addUserManage
   * @param {Object} param 用户参数
   */
  addUserManage({ commit }, param) {
    return new Promise((resolve, reject) => {
      addUserApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.addUserManage :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 根据id获取用户
   * @method getUserInfo
   * @param {String} param 用户ID
   */
  getUserInfo({commit}, param) {
    return new Promise((resolve, reject) => {
      getUserInfoApi(param).then(res => {
        commit('GET_USER_INFO', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getUserInfo :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 修改用户
   * @method editUserInfo
   * @param {Object} param 用户参数
   */
  editUserInfo({commit}, param) {
    return new Promise((resolve, reject) => {
      editUserInfoApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.editUserInfo :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 删除用户
   * @method delUser
   * @param {String} param 用户ID
   */
  delUser({commit}, param) {
    return new Promise((resolve, reject) => {
      delUserApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.delUser :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 查询用户日志
   * @method getUserLog
   * @param {Object} param 日志查询参数
   */
  getUserLog({ commit }, param) {
    return new Promise((resolve, reject) => {
      getUserLogApi(param).then(res => {
        commit('GET_USER_LOG', res)
        resolve(res)
      }).catch(err => {
        console.log('this.getUserLog :', err)
        reject(err)
      })
    })
  },
  /**
   * 导航修改密码
   * @method editPwd
   * @param {Object} param 修改密码信息
   */
  editPwd({commit}, param) {
    return editPwdApi(param)
  },
  /**
   * 查询用户日志详情筛选
   * @method getUserDetailList
   * @param {Object} param 日志查询参数
   */
  getUserDetailList({ commit }, param) {
    return new Promise((resolve, reject) => {
      getUserDetailApi(param).then(res => {
        commit('GET_USER_LOG_LIST', res)
        resolve(res)
      }).catch(err => {
        console.log('this.getUserDetailList :', err)
        reject(err)
      })
    })
  },
  /**
   * 获取模块列表
   * @method getmoduleList
   */
  getModuleList({ commit }) {
    return getmoduleListApi()
  },
  /**
   * 用户树上下移
   * @method moveUserNode
   */
  moveUserNode({ commit }, param) {
    return moveNodeApi(param)
  },
  /**
   * 获取ukey对应的用户
   * @method getkeyUser
   * @param {Object} param keys
   */
  getkeyUser({ commit }, param) {
    return new Promise((resolve, reject) => {
      searchUkeysApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.getkeyUser :', err)
        reject(err)
      })
    })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
