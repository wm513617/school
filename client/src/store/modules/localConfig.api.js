import { save, read } from '../../storage'
import { STORE_KEY_LOCAL_CONFIG } from '../../constants'
const state = {
  lockingActive: '000',
  navActive: '111',
  treeActive: '222',
  mapPath: '333',
  mapData: ''
}

const mutations = {
  // 设置锁定
  SET_LOCK_ACTIVE(state, value) {
    state.lockingActive = value
  },
  SET_NAV_ACTIVE(state, value) {
    state.navActive = value
  },
  SET_TREE_ACTIVE(state, value) {
    state.treeActive = value
  },
  SET_MAP_PATH(state, value) {
    state.mapPath = value
  },
  SET_CONFIG(state, value) {
    if (value) {
      state.lockingActive = value.lockingActive
      state.navActive = value.navActive
      state.treeActive = value.treeActive
      state.mapPath = value.mapPath
      state.mapData = value.mapData
    }
  }
}

const actions = {
  inintConfig({ commit }) {
    const config = JSON.parse(read(STORE_KEY_LOCAL_CONFIG))
    commit('SET_CONFIG', config)
  },
  saveConfig({ commit }, value) {
    let config = JSON.parse(read(STORE_KEY_LOCAL_CONFIG))
    config = Object.assign(config || {}, value)

    commit('SET_CONFIG', config)
    // save(STORE_KEY_LOCAL_CONFIG, JSON.stringify(config))
    save(STORE_KEY_LOCAL_CONFIG, config)
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
