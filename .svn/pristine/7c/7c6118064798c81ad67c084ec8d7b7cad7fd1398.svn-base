import { get } from 'http/base'
import toTree from 'assets/js/toTreeData'
const state = {
  faceResTree: []
}

const mutations = {
  UPDATE_RES_TREE(state, res) {
    const tree = toTree([res.data])
    state.faceResTree = tree
  }
}

const actions = {
  getResTree({commit}, analysisType) {
    const query = {}
    query.orgtype = 2
    query.type = 0
    analysisType && (query.analysisType = analysisType)
    return new Promise((resolve, reject) => {
      get({
        url: '/setting/resource/tree',
        query
      }).then(res => {
        commit('UPDATE_RES_TREE', res)
        resolve(res)
      }).catch(err => {
        console.log('getResTree error:' + err)
        reject(err)
      })
    })
  }
}

const getters = {
}

export default {
  state,
  mutations,
  actions,
  getters
}
