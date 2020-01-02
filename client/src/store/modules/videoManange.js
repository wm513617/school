import videoStore from './videoManangeFile/videoStore'
import tree from './videoManangeFile/tree'
import plan from './videoManangeFile/plan'
import holiday from './videoManangeFile/holiday'
import record from './videoManangeFile/record'
import snapshot from './videoManangeFile/snapshot'

const state = {
  ...videoStore.state,
  ...tree.state,
  ...plan.state,
  ...holiday.state,
  ...record.state,
  ...snapshot.state
}
const getters = {
  ...videoStore.getters,
  ...tree.getters,
  ...plan.getters,
  ...holiday.getters,
  ...record.getters,
  ...snapshot.getters
}
const mutations = {
  ...videoStore.mutations,
  ...tree.mutations,
  ...plan.mutations,
  ...holiday.mutations,
  ...record.mutations,
  ...snapshot.mutations
}

const actions = {
  ...videoStore.actions,
  ...tree.actions,
  ...plan.actions,
  ...holiday.actions,
  ...record.actions,
  ...snapshot.actions
}

export default {
  state,
  mutations,
  actions,
  getters
}
