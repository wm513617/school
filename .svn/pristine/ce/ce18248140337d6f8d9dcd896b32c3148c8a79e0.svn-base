import {getServeListDataApi, postServeDataAddApi, putServeDataUpdateApi, removeServeDataDeleteApi, getServeDetailsApi} from 'src/http/opsConfig/serve.api'

const state = {
  serveListData: [],
  serveUpdateData: {}
}

const mutations = {
  /**
   * 处理服务器诊断列表状态
   */
  GET_SERVE_LIST_DATA(state, list) {
    state.serveListData = list
  },
  GET_SERVE_DETAILS(state, list) {
    state.serveUpdateData = list
  }
}

const actions = {
  /**
   * 获取诊断服务器列表信息
   */
  getServeListData({commit}, query) {
    return new Promise((resolve, reject) => {
      getServeListDataApi(query).then(res => {
        commit('GET_SERVE_LIST_DATA', res.data)
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  /**
   * 添加服务器请求
   */
  postServeDataAdd({commit}, body) {
    return new Promise((resolve, reject) => {
      postServeDataAddApi(body).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 修改选中服务器信息
   */
  putServeDataUpdate({commit}, body) {
    return new Promise((resolve, reject) => {
      putServeDataUpdateApi(body.id, body.content).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
   * 删除选中服务器
   */
  removeServeDataDelete({commit}, id, body) {
    return new Promise((resolve, reject) => {
      removeServeDataDeleteApi(id, body).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /**
 * 修改框详情
 */
  getServeDetails({commit}, id, body) {
    return new Promise((resolve, reject) => {
      getServeDetailsApi(id, body).then(res => {
        commit('GET_SERVE_DETAILS', res.data)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

const getter = {}

export default {
  state,
  mutations,
  actions,
  getter
}
