const state = {
  loading: false,
  routeState: ''
}

const mutations = {
  CHANGE(state, status) {
    state.loading = !!status
  },
  SET_ROUTE_STATE(state, status) {
    state.routeState = status
  }
}

const actions = {
  changeRouteLoading({
    commit
  }, status) {
    commit('CHANGE', status)
  }
}

const getters = {
  routeLoadingStatus(state) {
    return state.loading
  },
  getRouteState(state) {
    return state.routeState
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
