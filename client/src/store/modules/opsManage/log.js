import { getLogDataApi, getLogServeApi, getLogDetailsApi } from 'src/http/opsManage/log.api'
// import Vue from 'vue'

const state = {
  logData: [],
  pageShowData: {
    counts: '',
    pages: '',
    current: '',
    limits: ''
  },
  logServe: [],
  logDetails: {}
}
const mutations = {
  SET_LOG_DATA(state, data) {
    state.logData = data
  },
  GET_PAGE_DATA(state, payLoad) {
    // 总数
    state.pageShowData.counts = payLoad['x-bsc-count'] // eslint-disable-line
    // 总页数
    state.pageShowData.pages = payLoad['x-bsc-pages'] // eslint-disable-line
    // 当前页
    state.pageShowData.current = payLoad['x-bsc-cur'] // eslint-disable-line
    // 每页限定数据
    state.pageShowData.limits = payLoad['x-bsc-limit'] // eslint-disable-line
  },
  GET_LOG_SERVE(state, data) {
    data.forEach((item, index) => {
      item.value = index
    })
    state.logServe = data
  },
  GET_LOG_DETAILS(state, data) {
    state.logDetails = data
  }
}
const actions = {
  // 运维日志get
  getLogData({ commit, state }, payLoad) {
    return new Promise((resolve, reject) => {
      getLogDataApi(payLoad).then(res => {
        resolve(res)
        commit('SET_LOG_DATA', res.data)
        commit('GET_PAGE_DATA', res.headers)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * 运维日志服务器列表
   */
  getLogServe({commit}) {
    return new Promise((resolve, reject) => {
      getLogServeApi().then(res => {
        resolve(res)
        commit('GET_LOG_SERVE', res.data)
        console.log(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 日志详情图片状态
   */
  getLogDetails({commit}, query) {
    return new Promise((resolve, reject) => {
      getLogDetailsApi(query.id, query.diagnid).then(res => {
        resolve(res)
        commit('GET_LOG_DETAILS', res.data)
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
