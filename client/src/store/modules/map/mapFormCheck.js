import {
  get
} from 'http/base'
const state = {}
const getters = {

}
const mutations = {}

const actions = {
  // 校验网格名称
  isGridName({
    commit
  }, playod) {
    const param = {
      query: playod,
      url: '/map/grid/checkRepeat'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 校验楼宇名称
  isBuildName({
    commit
  }, playod) {
    const param = {
      query: playod,
      url: '/map/building/checkRepeat'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => {
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
