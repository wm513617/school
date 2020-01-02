import {
  get, post
} from 'http/base'
const state = {
  mobilePatrolList: [],
  mobilePatrolTask: {},
  mobilePatrolOrglist: [],
  appMoveSingleCheck: false, // 点位元素中移动单兵勾选状态
  appMoveSingleList: [], // 移动单兵数组
  oneSingleData: null
}
const getters = {}
const mutations = {
  // 移动单兵数组
  SET_APPMOVESINGLE_LIST(state, data) {
    state.appMoveSingleList = data
  },
  // 点位元素中移动单兵勾选状态
  SET_APPMOVESINGLE_CHECK(state, data) {
    state.appMoveSingleCheck = data
  },
  // 获取巡更单兵列表
  GET_MOBILEPARTROL_LIST(state, data) {
    state.mobilePatrolList = data
  },
  // 获取巡更任务
  GET_MOBILEPARTROL_TASK(state, data) {
    state.mobilePatrolTask = data
  },
  // 获取移动单兵组织列表
  GET_MOBILEORG_LIST(state, data) {
    state.mobilePatrolOrglist = data
  },
  // 获取单个移动单兵信息
  GET_ONESINGLE_DATA(state, data) {
    state.oneSingleData = data
  }
}
const actions = {
  // 获取巡更单兵列表
  getMobilePatrol({
    commit
  }, playod) {
    const param = {
      url: '/setting/sentry/user/running/task?key=' + encodeURIComponent(playod.name.toString()) + '&org=' + playod.orgId
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('GET_MOBILEPARTROL_LIST', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取巡更单兵任务
  getMobilePatrolTask({
    commit
  }, playod) {
    const param = {
      url: '/patrol/record/' + playod
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('GET_MOBILEPARTROL_TASK', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取巡更组织列表
  getMobilePatrolOrgList({
    commit
  }, playod) {
    const param = {
      url: '/setting/org/list?type=3'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('GET_MOBILEORG_LIST', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 根据id获取单个移动单兵信息
  getOneSingle({
    commit
  }, playod) {
    const param = {
      url: '/setting/sentry/user/' + playod
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('GET_ONESINGLE_DATA', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getSinglePawnVideo({ dispatch }, param) { // id=巡更单兵的id  command= close|open
    const p = {
      url: `/patrol/user/camera?id=${param.id}&command=${param.command}&uniqueId=${param.uniqueId}&name=${param.webName}`
    }
    return new Promise((resolve, reject) => {
      get(p).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getSingleStream({ dispatch }, param) { // 手机开流
    return new Promise((resolve, reject) => {
      post({
        url: '/phone/playvideo',
        body: param
      }).then(suc => {
        resolve(suc.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  stopSingleStream({ dispatch }, param) { // 手机关流
    return new Promise((resolve, reject) => {
      post({
        url: '/phone/stopvideo',
        body: param
      }).then(suc => {
        resolve(suc.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  startRecord({ dispatch }, param) { // 手机开始录像
    return new Promise((resolve, reject) => {
      post({
        url: '/phone/startrecord',
        body: param
      }).then(suc => {
        resolve(suc.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  stopRecord({ dispatch }, param) { // 手机停止录像
    return new Promise((resolve, reject) => {
      post({
        url: '/phone/stoprecord',
        body: param
      }).then(suc => {
        resolve(suc.data)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  queryRecord({ dispatch }, param) { // 手机录像查询
    return new Promise((resolve, reject) => {
      post({
        url: '/record/phonequery',
        body: param
      }).then(suc => {
        resolve(suc.data)
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
