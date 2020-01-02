import {
  get,
  post,
  put,
  remove
} from '../../../http/base'
import { trafficHighList, trafficHighEdit } from 'http/trafficManage.api'
const state = {
  serverData: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 0,
    count: 0
  },
  serverTree: []
}

const getters = {}

const mutations = {
  GET_SERVER_LIST(state, payload) {
    state.serverData.list = payload.data
    state.serverData.pages = Number(payload.headers['x-bsc-pages'])
    state.serverData.curPage = Number(payload.headers['x-bsc-cur'])
    state.serverData.count = Number(payload.headers['x-bsc-count'])
    state.serverData.limit = Number(payload.headers['x-bsc-limit'])
  },
  // 设置服务器树数据
  SET_SERVER_TREE(state, payload) {
    state.serverTree = payload
  }
}

const actions = {
  // 获取智能交通服务器列表
  getTrafficSerList({
    commit,
    dispatch,
    rootState
  }, obj) {
    const param = {
      query: obj,
      url: '/setting/traffic/server'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        if (obj.struct === 'list') {
          commit('GET_SERVER_LIST', res)
        }
        commit('SET_SERVER_TREE', res.data)
        resolve(res)
        console.log('智能交通设备树', res.data)
      }).catch(err => reject(err))
    })
  },
  // 获取指定智能交通服务器
  getTrafficSerOne({ dispatch }, id) {
    console.log('获取指定智能交通服务器', id)
    const param = {
      url: '/setting/traffic/server/' + id
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 创建智能交通服务器
  addTrafficSerData({
    commit
  }, payload) {
    const param = {
      body: payload,
      url: '/setting/traffic/server'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 修改智能交通服务器
  editTrafficSerData({
    commit
  }, payload) {
    const param = {
      body: payload,
      url: '/setting/traffic/server/' + payload._id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 删除智能交通服务器
  deleteTrafficSerData({
    commit
  }, id) {
    const param = {
      url: '/setting/traffic/server/' + id
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        // headers: {
        //   'x-bsc-ids': payload.join(',')
        // }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 智能交通 服务器地址链接 获取
  getTrafficServerURL({ commit }, id) {
    return new Promise((resolve, reject) => {
      get({
        url: '/setting/traffic/servercfg'
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 智能交通 服务器地址链接 修改
  postTrafficServerURL({ commit }, url) {
    const param = {
      body: {
        url: url
      },
      url: '/setting/traffic/servercfg'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 高级参数获取
  trafficHighSetList({state, commit}, data) {
    return new Promise((resolve, reject) => {
      trafficHighList().then(res => {
        resolve(res)
      }).catch((err) => {
        console.log('downloadAlarmInfo error: ' + err)
        reject(err)
      })
    })
  },
  // 高级参数保存
  trafficHighSetEdit({state, commit}, data) {
    console.log('trafficHighSetEdit', data)
    return new Promise((resolve, reject) => {
      trafficHighEdit(data).then(res => {
        resolve(res)
      }).catch((err) => {
        console.log('downloadAlarmInfo error: ' + err)
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
