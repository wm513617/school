const state = {
  selectnode: '',
  monmentVideoTabs: ''
}
const getters = {
  monmentVideoTabs(state) {
    return state.monmentVideoTabs
  },
  getTree(state) {
    return state.treeData
  },
  getSelectTree(state) {
    return state.selectnode
  }
}
const mutations = {
  TREE_SET_NODE(state, payLoad) {
    state.selectnode = payLoad
  },
  SET_VIDEO_TABS(state, payLoad) {
    state.monmentVideoTabs = payLoad
  }
}

const actions = {

}

export default {
  state,
  mutations,
  actions,
  getters
}
