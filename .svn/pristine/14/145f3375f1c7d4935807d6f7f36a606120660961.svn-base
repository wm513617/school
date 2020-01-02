import {
  get,
  put
} from '../../../http/base.js'
const state = {
  Snapshot: []
}
const getters = {
  getSnapshot(state) {
    return state.Snapshot
  }
}
const mutations = {
  // SET_STORESON_FLAG(state, payLoad) {
  //   state.storesonFlag = payLoad
  // }
}

const actions = {
  //  获取所有抓图计划
  getCaptuteByTree({
    commit,
    state
  }, obj) {
    const params = {
      query: {
        page: obj.page,
        limit: obj.limit,
        key: obj.key,
        recursion: obj.recursion,
        collection: 'snapshot'
      },
      url: '/organization/video/conf'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  //  获取所有录像配置
  changeSnapshotByTree({
    commit,
    state
  }, obj) {
    const params = {
      body: obj,
      url: '/setting/snapshot/'
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
