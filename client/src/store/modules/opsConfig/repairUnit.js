import { getRepairUnitApi, addRepairUnitApi, getEditorRepairInfoApi, editorRepairUnitApi, delRepairUnitApi, getMonitorIntervalApi, setMonitorIntervalApi } from 'src/http/opsConfig/repairUnit.api'

const state = {
  repairUnitData: [], // 维修单位列表数据
  editorUnitInfo: {},
  pageShowData: {
    counts: '',
    pages: '',
    current: '',
    limits: ''
  },
  videoMonitorInterval: '' // 录像检测间隔
}
const getters = {}
const mutations = {
  SET_MONITOR_INTERVAL(state, data) {
    state.videoMonitorInterval = data
  },
  SET_EDITOR_INFO(state, data) {
    state.editorUnitInfo = data
  },
  SET_REPAIRNIT_DATA(state, data) {
    state.repairUnitData = data.data
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
  }
}
const actions = {
  // 维修单位get
  getRepairUnit({ commit, state }, payLoad) {
    return new Promise((resolve, reject) => {
      getRepairUnitApi(payLoad)
        .then(res => {
          resolve(res)
          commit('SET_REPAIRNIT_DATA', res)
          commit('GET_PAGE_DATA', res.headers)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 维修单位添加post
  addRepairUnit({ commit, dispatch, state }, payLoad) {
    return new Promise((resolve, reject) => {
      addRepairUnitApi(payLoad)
        .then(res => {
          resolve(res)
          // dispatch('getRepairUnit')
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 维修单位修改put前的get
  getEditorRepairInfo({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      getEditorRepairInfoApi(id)
        .then(res => {
          resolve(res)
          commit('SET_EDITOR_INFO', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 维修单位修改put
  editorRepairUnit({ commit, state }, payLoad) {
    return new Promise((resolve, reject) => {
      editorRepairUnitApi(payLoad)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 维修单位delete
  delRepairUnit({ commit, state }, idArr) {
    const promises = idArr.map(v => {
      return new Promise((resolve, reject) => {
        delRepairUnitApi(v)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log('delRepairUnit error', err)
            reject(err)
          })
      })
    })
    return Promise.all(promises)
  },
  // 录像检测间隔get
  getMonitorInterval({ commit, state }, payLoad) {
    return new Promise((resolve, reject) => {
      getMonitorIntervalApi(payLoad)
        .then(res => {
          resolve(res)
          commit('SET_MONITOR_INTERVAL', res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 录像检测间隔set
  setMonitorInterval({ state, commit }, payLoad) {
    return new Promise((resolve, reject) => {
      setMonitorIntervalApi(payLoad)
        .then(res => {
          resolve(res)
          commit('SET_MONITOR_INTERVAL', payLoad)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
