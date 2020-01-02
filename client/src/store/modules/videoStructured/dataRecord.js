import { get } from '../../../http/base'
const state = {

}
const mutations = {}
const actions = {
  getDataRecord({commit}, query) { // 数据分析
    let params = {
      query,
      url: '/structure/statistic/analyz'
    }
    return get(params)
  },
  getDataToday({commit}) { // 今日数据
    return get({url: '/structure/statistic/today'})
  },
  exportDatas({commit}, query) {
    let params = {
      url: '/structure/statistic/export',
      query
    }
    return get(params)
  }
}
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true
}
