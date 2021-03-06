import { get, post, remove } from '../../../../http/base'
import { getSocket } from '../../../../socket/socket.js'
const state = {
  treeData: []
}
const getters = {}
const mutations = {
  CURRENTNEWLIST(state, payload) {
    state.treeData = payload
  }

}
const actions = {
  // 获取门树
  getDoorTreeList({ commit }, payload) {
    var param = {
      query: payload,
      url: '/through/zkteco/getDoorTree'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('CURRENTNEWLIST', res)
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },

  // 获取今日统计数据
  getStatisticToday({ commit }, payload) {
    var param = {
      query: payload,
      url: '/through/statistic/today'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },

  // 获取机构层级的统计数据
  getStatisticpassData({ commit }, payload) {
    var param = {
      body: payload,
      url: '/through/statistic/passData'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 获取统计分析
  getStatisticanalyz({ commit }, payload) {
    var param = {
      body: payload,
      url: '/through/statistic/analyz'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  // 获取机构树层级
  getStatistictree({ commit }, payload) {
    var param = {
      query: payload,
      url: '/through/statistic/tree'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
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
