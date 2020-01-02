import { searchStructAlarmApi } from 'src/http/videoStructured/alarmSearch.api'
const state = {
  cotlMageAlarmList: [], // 报警检索列表
  structAlarmPageinfo: {},
  defaultStructAlarmSearch: false
}
const mutations = {
  SET_COLMAGE_ALARM_LIST(state, res) {
    state.cotlMageAlarmList = res.data || []
  },
  SET_STRUCT_ALARM_PAGE_INFO(state, res) {
    const count = res.totalNum || res.count
    const limit = Number(res.limit || res.pageNum.limit)
    const a = count / limit
    const b = count % limit ? 1 : 0
    state.structAlarmPageinfo.count = count
    state.structAlarmPageinfo.current = Number(res.current || res.pageNum.page)
    state.structAlarmPageinfo.limit = limit
    state.structAlarmPageinfo.pages = parseInt(a) + b
  },
  SET_DEFAULT_STRUCT_ALARM_SEARCH(state, v) {
    state.defaultStructAlarmSearch = v
  }
}
const actions = {
  getStructAlarmData({ state, commit }, param) { // 报警检索
    return new Promise((resolve, reject) => {
      searchStructAlarmApi(param).then((res) => {
        commit('SET_COLMAGE_ALARM_LIST', res.data)
        commit('SET_STRUCT_ALARM_PAGE_INFO', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
export default {
  state,
  mutations,
  actions
}
