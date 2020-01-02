import {
  get,
  post,
  remove,
  put
} from 'http/base'
import toTreeData from '../../../assets/js/toTreeData'
const state = {
  pageInfo: {
    pages: 0,
    curPage: 1,
    limit: 0,
    count: 0
  },
  // 应急预案模式控制
  emPlanMOdel: 'app',
  // 应急预案树
  emTree: [],
  emNode: {
    isroot: true
  },
  oneEmergency: {},
  emergencyList: []
}
const getters = {
  emergencyData(state) {
    return state.emergencyList.results
  }
}
const mutations = {
  GET_POINT_LIST(state, payload) {
    state.pageInfo.pages = Number(payload.headers['x-bsc-pages'])
    state.pageInfo.curPage = Number(payload.headers['x-bsc-cur'])
    state.pageInfo.count = Number(payload.headers['x-bsc-count'])
    state.pageInfo.limit = Number(payload.headers['x-bsc-limit'])
  },
  // 新增应急预案
  SET_ONE_EMERGENCY(state, data) {
    state.oneEmergency = data
  },
  SET_EMPLAN_MODEL(state, data) {
    state.emPlanMOdel = data
  },
  GET_EMPLAN_TREE(state, data) {
    state.emTree = data
  },
  // 预案节点
  SET_EMNOSE_STATE(state, data) {
    state.emNode = data
  },
  // 单个预案信息
  SET_ONEEM_INFO(state, data) {
    state.oneEmInfo = data
  },
  EMERGENCY_ACTION(state, data) {
    state.emergencyList = data
  }
}
const actions = {
  // 获取应急预案树
  getEmTree({
    commit
  }, playod) {
    const param = {
      query: {
        type: playod
      },
      url: '/setting/org/tree/'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        var arr = []
        arr.push(JSON.parse(JSON.stringify(res.data)))
        commit('GET_EMPLAN_TREE', toTreeData(arr))
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取应急预案信息
  getEmInfo({
    commit,
    state
  }, type) {
    const param = {
      query: {
        type: type.type
      },
      url: '/setting/org/' + type.Id
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        // commit('SET_ORG_INFO', res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取全部应急预案信息
  getEmInfoById({
    commit,
    state
  }, obj) {
    const param = {
      query: {
        type: obj.type
      },
      url: '/setting/org/' + obj.id
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        // commit('SET_ORG_INFO', res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 新增应急预案
  // 3-添加机构
  addEm({
    commit,
    state
  }, form) {
    const param = {
      body: form,
      url: '/setting/org/'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 删除应急预案
  deleteEm({
    commit,
    state
  }, id) {
    const param = {
      url: '/setting/org/' + id
    }
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res.data)
        // commit('SET_ORG_INFO', res.data)
      }).catch(err => {
        reject(err.response.data.message)
      })
    })
  },
  // 获取指定应急预案
  getOneEmPlan({
    commit
  }, id) {
    const param = {
      query: {
        orgid: id
      },
      url: '/emergency/plan/'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data[0])
        commit('SET_ONEEM_INFO', res.data[0])
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 新增应急预案
  addOneEmPlan({
    commit
  }, body) {
    const param = {
      body,
      url: '/emergency/plan'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res.data)
        commit('SET_ONE_EMERGENCY', res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 删除应急预案
  deleteOneEm({
    commit,
    state
  }, id) {
    const param = {
      url: '/emergency/plan/' + id
    }
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res.data)
        // commit('SET_ORG_INFO', res.data)
      }).catch(err => {
        reject(err.response.data.message)
      })
    })
  },
  // 获取不同报警类型下的应急预案信息
  emergencyAction({
    commit
  }, payload) {
    const param = {
      url: '/emergency/plan/list',
      query: payload || {}
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('EMERGENCY_ACTION', res.data)
        commit('GET_POINT_LIST', res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 修改应急预案信息
  setEmergency({
    commit
  }, payload) {
    const param = {
      url: '/emergency/plan/' + payload.id,
      body: payload.body
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 批量删除
  deleteplan({
    commit
  }, payload) {
    const param = {
      url: '/emergency/plan'
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
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
