import {
  get
} from '../../http/base'
const state = {
  logList: []
}
const getters = {}
const mutations = {
  // 获取平台参数
  GET_LOG(state, payload) {
    var tempArr = payload.map((val) => {
      return {
        date: val.name,
        link: val.path
      }
    })
    state.logList = tempArr
  }
}

const actions = {
  // 获取所有类型的数据信息
  getLog({
    commit,
    state
  }, playod) {
    const param = {
      query: {
        page: playod.page,
        limit: playod.limit,
        type: playod.type
      },
      url: '/log'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('GET_LOG', res.data)
        resolve(res)
      }).catch((err) => {
        console.log('getLog error: ' + err)
        reject(err)
      })
    })
  },
  upLoadLog({
    commit,
    state
  }, playod) {
    console.log(playod)
    const param = {
      url: playod
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        // commit('GET_LOG', res.data)
        resolve(res)
      }).catch((err) => {
        console.log('getLog error: ' + err)
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
