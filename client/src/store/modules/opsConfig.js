import repair from './opsConfig/repairUnit'
// import parameter from './opsConfig/parameter'
import serve from './opsConfig/serve'

const state = {
  ...repair.state,
  // ...parameter.state,
  ...serve.state
}

const getters = {
  ...repair.getters,
  // ...parameter.getters,
  ...serve.getters
}
const mutations = {
  ...repair.mutations,
  // ...parameter.mutations,
  ...serve.mutations
}

const actions = {
  ...repair.actions,
  // ...parameter.actions,
  ...serve.actions
}

export default {
  state,
  mutations,
  actions,
  getters
}
