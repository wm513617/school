import { get } from 'http/base'
import moment from 'moment'

const state = {
  compareList: [
    {
      username: '6e7a560c90e',
      age: 48,
      gender: '女',
      idNumber: '82472348.61160107',
      similarity: '88%',
      picture: '/static/defaultFace.jpg',
      resourcePoint: '西门',
      snapshot: '/static/defaultFace.jpg',
      snapshotTime: '2017-05-12 04:54:00',
      mold: '黑名单'
    }
  ]
}

const mutations = {
  UPDATE_COMPARELIST(state, res) {
    state.pageTotal = parseInt(res.headers['x-bsc-count'])
    state.pageSize = parseInt(res.headers['x-bsc-limit'])
    state.pageCurrent = parseInt(res.headers['x-bsc-cur'])
    state.compareList = JSON.parse(JSON.stringify(res.data)).map((v, index) => {
      v.index = (state.pageCurrent - 1) * state.pageSize + index + 1
      v.similarity && (v.similarity = v.similarity + '%')
      v.mold = v.type
      // 时间戳格式化为yyyy-MM-dd返回
      v.snapshotTime = moment(parseInt(v.snapshotTime) * 1000).format('YYYY-MM-DD HH:mm:ss')
      // 由于服务端未实现，前端做假的对比图
      return v
    })
  }
}

const actions = {
  searchCompareExport({ commit }, payload) {
    const params = {
      url: payload.url,
      query: payload.params
    }
    return new Promise((resolve, reject) => {
      get(params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log('searchCompare error:' + err)
          reject(err)
        })
    })
  },
  searchCompare({ commit }, payload) {
    const params = {
      url: payload.url,
      query: payload.params
    }
    return new Promise((resolve, reject) => {
      get(params)
        .then(res => {
          commit('UPDATE_COMPARELIST', res)
          resolve(res)
        })
        .catch(err => {
          console.log('searchCompare error:' + err)
          reject(err)
        })
    })
  }
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
