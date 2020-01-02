import capture from './veriface/capture'
import alarmSearch from './veriface/alarmSearch'
import passerSearch from './veriface/passerSearch'
import statistics from './veriface/statistics'
import manage from './veriface/manage'
import dispatch from './veriface/dispatch'
import setting from './veriface/setting'
import track from './veriface/track'
const state = {
  ...capture.state,
  ...alarmSearch.state,
  ...passerSearch.state,
  ...manage.state,
  ...dispatch.state,
  ...setting.state,
  ...track.state,
  ...statistics.state
}
const getters = {
  ...capture.getters,
  ...alarmSearch.getters,
  ...passerSearch.getters,
  ...manage.getters,
  ...dispatch.getters,
  ...setting.getters,
  ...track.getters,
  ...statistics.getters
}
const mutations = {
  ...capture.mutations,
  ...alarmSearch.mutations,
  ...passerSearch.mutations,
  ...manage.mutations,
  ...dispatch.mutations,
  ...setting.mutations,
  ...track.mutations,
  ...statistics.mutations
}

const actions = {
  ...capture.actions,
  ...alarmSearch.actions,
  ...passerSearch.actions,
  ...manage.actions,
  ...dispatch.actions,
  ...setting.actions,
  ...track.actions,
  ...statistics.actions
}

export default {
  state,
  mutations,
  actions,
  getters
}
