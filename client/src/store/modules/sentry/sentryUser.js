import {
  get,
  post,
  put,
  remove
} from '../../../http/base'
const state = {
  // newPointID: '',
  userData: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 0,
    count: 0
  },
  userDataOne: {}
}

const getters = {}

const mutations = {
  GET_USER_LIST(state, payload) {
    state.userData.list = payload.data.results
    state.userData.pages = Number(payload.headers['x-bsc-pages'])
    state.userData.curPage = Number(payload.headers['x-bsc-cur'])
    state.userData.count = Number(payload.headers['x-bsc-count'])
    state.userData.limit = Number(payload.headers['x-bsc-limit'])
  },
  GET_USER_ONE(state, payload) {
    state.userDataOne = payload.data
  },
  CLEAR_USER_LIST(state, payload) {
    state.userData.list = []
  }
  // GET_POINT_ID (state, payload) {
  //  state.newPointID = payload.data
  // }
}

const actions = {
  // 获取单兵用户列表
  getUserList({
    commit,
    rootState
  }, obj) {
    const param = {
      query: {
        page: obj.page,
        limit: obj.limit,
        orgid: obj.orgId || rootState.orgSetting.orgActiveId
      },
      url: '/setting/sentry/user/list'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_USER_LIST', res)
      }).catch(err => reject(err))
    })
  },
  clearUserList({commit}) {
    commit('CLEAR_USER_LIST')
  },
  // 获取某一个用户信息
  getUserOne({
    commit
  }, id) {
    const param = {
      url: '/setting/sentry/user/' + id
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_USER_ONE', res)
      }).catch(err => reject(err))
    })
  },
  // 创建用户
  addUser({
    commit
  }, payload) {
    const param = {
      body: payload,
      url: '/setting/sentry/user'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 修改用户信息
  editUser({
    commit
  }, payload) {
    const param = {
      body: payload.object,
      url: '/setting/sentry/user/' + payload._id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 删除用户信息
  deleteUser({
    commit
  }, payload) {
    const param = {
      url: '/setting/sentry/user'
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        headers: {
          'x-bsc-ids': payload.join(',')
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 重置密码接口
  resetPassword({
    commit
  }, payload) {
    const param = {
      body: payload.object,
      url: '/setting/sentry/user/' + payload.id + '/password/reset'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 查询接口
  getSeekUserList({
    commit,
    rootState
  }, obj) {
    const param = {
      query: {
        page: obj.page,
        limit: obj.limit,
        type: obj.type,
        key: obj.seek
      },
      url: '/setting/sentry/query'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_USER_LIST', res)
      }).catch(err => reject(err))
    })
  },
  // 设置报警时长默认配置
  setPointInfo({
    commit,
    state
  }, obj) {
    const param = {
      body: obj,
      url: '/setting/sentry/pointSetting'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  // 获取报警时长默认配置
  getUserSetting({
    commit,
    state
  }, obj) {
    const param = {
      body: obj,
      url: '/setting/sentry/setting'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
