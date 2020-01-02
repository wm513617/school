// 智能交通js
import trafficManage from './traffic/trafficManage'
import trafficServer from './traffic/trafficServer'
const state = {
  ...trafficManage.state,
  ...trafficServer.state
}
const getters = {
  ...trafficManage.getters,
  ...trafficServer.getters
}
const mutations = {
  ...trafficManage.mutations,
  ...trafficServer.mutations
}

const actions = {
  ...trafficManage.actions,
  ...trafficServer.actions
}

export default {
  state,
  mutations,
  actions,
  getters
}
