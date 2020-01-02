import {
  get,
  post,
  put,
  remove
} from '../../../http/base'
const state = {
  newPointID: '',
  pointData: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 0,
    count: 0
  },
  pointDataOne: {}
}

const getters = {}

const mutations = {
  GET_POINT_LIST(state, payload) {
    state.pointData.list = payload.data.results
    state.pointData.pages = Number(payload.headers['x-bsc-pages'])
    state.pointData.curPage = Number(payload.headers['x-bsc-cur'])
    state.pointData.count = Number(payload.headers['x-bsc-count'])
    state.pointData.limit = Number(payload.headers['x-bsc-limit'])
  },
  GET_POINT_ONE(state, payload) {
    state.pointDataOne = payload.data
  },
  GET_POINT_ID(state, payload) {
    state.newPointID = payload.data
  }
}

const actions = {
  // 获取巡更点位列表
  getPointList({
    commit,
    dispatch,
    rootState
  }, obj) {
    const param = {
      query: {
        page: obj.page,
        limit: obj.limit,
        orgid: rootState.orgSetting.orgActiveId
      },
      url: '/setting/sentry/point/list'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_POINT_LIST', res)
      }).catch(err => reject(err))
    })
  },
  // 获取巡更某一个点位信息
  getPointOne({
    commit
  }, id) {
    const param = {
      url: '/setting/sentry/point/' + id
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_POINT_ONE', res)
      }).catch(err => reject(err))
    })
  },
  // 获取巡更点位设备id
  getPointID({
    commit
  }, obj) {
    const param = {
      url: '/setting/sentry/point/uniqid'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_POINT_ID', res)
      }).catch(err => reject(err))
    })
  },
  // 创建巡更点位
  addPoint({
    commit
  }, payload) {
    const param = {
      body: payload,
      url: '/setting/sentry/point'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 修改巡更点位信息
  editPoint({
    commit
  }, payload) {
    const param = {
      body: payload,
      url: '/setting/sentry/point/' + payload._id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 删除巡更点位信息
  deletePoint({
    commit
  }, payload) {
    const param = {
      url: '/setting/sentry/point'
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        headers: {
          'x-bsc-ids': payload.join(',')
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 查询接口
  getSeekPointList({
    commit,
    rootState
  }, obj) {
    const param = {
      query: {
        page: obj.page,
        limit: obj.limit,
        type: obj.type,
        key: obj.seek
      },
      url: '/setting/sentry/query'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_POINT_LIST', res)
      }).catch(err => reject(err))
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
