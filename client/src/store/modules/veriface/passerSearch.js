import { getPasserConditionApi, getImagesConditionApi, getPasserExportApi, gettPasserCountApi, getPasserImagesCountApi } from 'src/http/veriface/passerSearch.api'
const state = {
  passerList: [],
  passerPageinfo: {},
  passerImageList: [],
  passerImagePageinfo: {}
}

const mutations = {
  SET_PASSER_LIST(state, list) {
    state.passerList = list
  },
  SET_PASSER_CONDITION(state, info) {
    if (info) {
      state.passerPageinfo.count = Number(info['x-bsc-count']) // 总数
      state.passerPageinfo.pages = Number(info['x-bsc-pages']) // 总页数
      state.passerPageinfo.current = Number(info['x-bsc-cur']) // 当前页
      state.passerPageinfo.limit = Number(info['x-bsc-limit']) // 每页限定数据
    } else {
      state.passerPageinfo.pages = 0
      state.passerPageinfo.count = 0
      state.passerPageinfo.current = 1
      state.passerPageinfo.limit = 20
    }
  },
  SET_IMAGES_LIST(state, list) {
    state.passerImageList = list
  },
  SET_IMAGES_PAGE_INFO(state, info) {
    if (info) {
      state.passerImagePageinfo.count = Number(info['x-bsc-count']) // 总数
      state.passerImagePageinfo.pages = Number(info['x-bsc-pages']) // 总页数
      state.passerImagePageinfo.current = Number(info['x-bsc-cur']) // 当前页
      state.passerImagePageinfo.limit = Number(info['x-bsc-limit']) // 每页限定数据
    } else {
      state.passerImagePageinfo.pages = 0
      state.passerImagePageinfo.count = 0
      state.passerImagePageinfo.current = 1
      state.passerImagePageinfo.limit = 20
    }
  }
}
const actions = {
  getPasserCondition({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      getPasserConditionApi(payload)
        .then(res => {
          commit('SET_PASSER_LIST', res.data)
          // commit('SET_PASSER_CONDITION', res.headers)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getImagesCondition({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      getImagesConditionApi(payload)
        .then(res => {
          commit('SET_IMAGES_LIST', res.data)
          // commit('SET_IMAGES_PAGE_INFO', res.headers)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getPasserExport({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      getPasserExportApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  gettPasserCount({ state }, payload) {
    return new Promise((resolve, reject) => {
      gettPasserCountApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getPasserImagesCount({ state }, payload) {
    return new Promise((resolve, reject) => {
      getPasserImagesCountApi(payload)
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
