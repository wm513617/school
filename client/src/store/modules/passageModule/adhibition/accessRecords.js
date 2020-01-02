import { get, post } from '../../../../http/base'

const state = {
  accessRecordsList: []
}
const getters = {}
const mutations = {
  GETACCESSRECORDS(state, payload) {
    state.accessRecordsList = payload
  }

}
const actions = {
  // 获取门树
  // getDoorTreeList({ commit }, payload) {
  //   var param = {
  //     query: payload,
  //     url: '/through/zkteco/getDoorTree'
  //   }
  //   return new Promise((resolve, reject) => {
  //     get(param).then(res => {
  //       commit('CURRENTNEWLIST', res)
  //       resolve(res.data)
  //     }).catch(err => reject(err))
  //   })
  // },
  // 1-获取机构树
  // getOrgTree({
  //   commit,
  //   state
  // }, type) {
  //   const param = {
  //     query: {
  //       type: type
  //     },
  //     url: '/setting/org/tree/'
  //   }
  //   return new Promise((resolve, reject) => {
  //     get(param).then(res => {
  //       resolve(res)
  //     }).catch((err) => {
  //       reject(err)
  //     })
  //   })
  // },
  // 获取通行记录列表
  getPassgeListData({ commit }, payload) {
    var param = {
      body: payload,
      url: '/through/passage/getPassgeList'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        commit('GETACCESSRECORDS', res)
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 导出通行记录列表
  exportPassage({ commit }, payload) {
    var param = {
      body: payload,
      url: '/through/passage/exportPassage'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 根据相机id获取对应视频信息
  getCameraInfo({ commit }, payload) {
    var param = {
      body: payload,
      url: '/through/passage/findVieoMessage'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
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
