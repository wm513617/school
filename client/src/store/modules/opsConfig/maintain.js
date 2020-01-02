import { get, put, post, remove } from '../../../http/base'

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
    const params = {
      query: payLoad,
      url: 'setting/operation/config/list'
    }
    return new Promise((resolve, reject) => {
      get(params)
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
    const params = {
      body: payLoad,
      url: 'setting/operation/config/'
    }
    return new Promise((resolve, reject) => {
      post(params)
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
    const params = {
      url: 'setting/operation/config/' + id
    }
    return new Promise((resolve, reject) => {
      get(params)
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
    const params = {
      body: payLoad.addParams,
      url: 'setting/operation/config/' + payLoad.id
    }
    return new Promise((resolve, reject) => {
      put(params)
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
        remove({
          url: 'setting/operation/config/' + v
        })
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
    const params = {
      query: {
        minute: payLoad
      },
      url: ''
    }
    return new Promise((resolve, reject) => {
      get(params)
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
    const params = {
      url: '/door/servers/' + payLoad._id,
      body: payLoad
    }
    return new Promise((resolve, reject) => {
      put(params)
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
