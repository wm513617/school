import { getTrackConditionApi, getUserTrackConditionApi } from 'src/http/veriface/track.api'
const state = {
  trackList: [],
  trackPageinfo: {}
}

const mutations = {
  SET_TRACK_LIST(state, list) {
    state.trackList = list
  },
  SET_TRACK_PAGE_INFO(state, info) {
    if (info) {
      state.trackPageinfo.count = Number(info['x-bsc-count']) // 总数
      state.trackPageinfo.pages = Number(info['x-bsc-pages']) // 总页数
      state.trackPageinfo.current = Number(info['x-bsc-cur']) // 当前页
      state.trackPageinfo.limit = Number(info['x-bsc-limit']) // 每页限定数据
    } else {
      state.trackPageinfo.pages = 0
      state.trackPageinfo.count = 0
      state.trackPageinfo.current = 1
      state.trackPageinfo.limit = 25
    }
  }
}
const actions = {
  getTrackCondition({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      getTrackConditionApi(payload)
        .then(res => {
          commit('SET_TRACK_LIST', res.data)
          commit('SET_TRACK_PAGE_INFO', res.headers)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getUserTrackCondition({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      getUserTrackConditionApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }
}
export default {
  state,
  mutations,
  actions
}
