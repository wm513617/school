const state = {
  pointDrawActive: false, // 点选
  lineDrawActive: false, // 绘制多边形
  circleDrawActive: false // 绘制圆形
}
const getters = {
  isPointDrawActive(state) {
    return state.pointDrawActive
  },
  isCircleDrawActive(state) {
    return state.circleDrawActive
  },
  isLineDrawActive(state) {
    return state.lineDrawActive
  }
}
const mutations = {
  ACTIVE_DRAW_FN(state, flag) {
    state.pointDrawActive = false
    state.lineDrawActive = false
    state.circleDrawActive = false
    if (flag === 'Point') { // 点选
      state.pointDrawActive = true
    } else if (flag === 'Circle') { // 激活圆形
      state.circleDrawActive = true
    } else if (flag === 'MultiPolygon') { // 激活多边形
      state.lineDrawActive = true
    }
  },
  CLOSE_DRAW_FN(sate, flag) {
    if (flag === 'Point') { // 点选
      state.pointDrawActive = false
    } else if (flag === 'Circle') { // 激活圆形
      state.circleDrawActive = false
    } else if (flag === 'MultiPolygon') { // 激活多边形
      state.lineDrawActive = false
    }
  }
}
const actions = {
  activeDrawFn({commit}, flag) {
    commit('ACTIVE_DRAW_FN', flag)
  },
  closeDrawFn({commit}, flag) {
    commit('CLOSE_DRAW_FN', flag)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
