import alarmCenter from './alarmHelps/alarmCenter'
import alarmTermStore from './alarmHelps/alarmTermStore'

const state = {
  ...alarmCenter.state,
  ...alarmTermStore.state
}
const getters = {
  ...alarmCenter.getters,
  ...alarmTermStore.getters
}
const mutations = {
  ...alarmCenter.mutations,
  ...alarmTermStore.mutations
}

const actions = {
  ...alarmCenter.actions,
  ...alarmTermStore.actions
}

export default {
  state,
  mutations,
  actions,
  getters
}
