import { get, post, remove, put } from 'http/base'
const state = {
  pageTotal: 1,
  pageSize: 1,
  pageCurrent: 1,
  personList: [
    // {
    //   index: 0,
    //   username: '',
    //   sex: '',
    //   age: '',
    //   idcard: '',
    //   reason: '',
    //   similarity: '',
    //   picture: '',
    //   remark: '',
    //   id: '',
    //   type: ''
    // }
  ]
}

const mutations = {
  UPDATE_PERSONLIST(state, res) {
    state.pageTotal = parseInt(res.headers['x-bsc-count'])
    state.pageSize = parseInt(res.headers['x-bsc-limit'])
    state.pageCurrent = parseInt(res.headers['x-bsc-cur'])
    state.personList = res.data.results.map((val, index) => {
      const item = {}
      item.id = val._id
      item.index = (state.pageCurrent - 1) * state.pageSize + index + 1
      item.remark = val.remark
      item.username = val.username
      item.sex = val.gender ? '女' : '男'
      item.age = val.age
      item.idcard = val.idNumber
      item.reason = val.reason
      item.similarity = val.similarity + '%'
      item.type = val.type === 4 ? '白名单' : '黑名单'
      item.picture = val.picture
      return item
    })
  }
}

const actions = {
  getPersonList({ commit }, { page, limit, payload }) {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/roster',
        query: {
          page,
          limit,
          username: '',
          type: ''
        }
      })
        .then(res => {
          commit('UPDATE_PERSONLIST', res)
          resolve(res)
        })
        .catch(err => {
          console.log('getPersonList error', err)
          reject(err)
        })
    })
  },
  // 获取个人信息
  getPersonalListDetails({ commit }, id) {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/roster/' + id
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log('getPersonalListDetails error', err)
          reject(err)
        })
    })
  },
  // 检索
  getSearchPersonList({ commit }, { page, limit, payload }) {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/roster?' + payload,
        query: {
          page,
          limit
        }
      })
        .then(res => {
          commit('UPDATE_PERSONLIST', res)
          resolve(res)
        })
        .catch(err => {
          console.log('getPersonList error', err)
          reject(err)
        })
    })
  },
  // 人员验证身份证号
  verifyNumber({ commit }, payload) {
    return new Promise((resolve, reject) => {
      get({
        query: payload,
        url: '/human/roster/idNumber'
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          var msg = err.response.data.message
          reject(msg)
        })
    })
  },
  addPersonList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      post({
        url: '/human/roster',
        body: {
          username: payload.username,
          gender: Number(payload.gender),
          idNumber: payload.idNumber,
          picture: payload.photoUrl,
          age: Number(payload.age),
          reason: payload.reason,
          remark: payload.remark,
          type: payload.type,
          similarity: 90
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log('addPersonList error', err)
          reject(err)
        })
    })
  },
  deletePersonList({ commit }, delArr) {
    const promises = delArr.map(v => {
      return new Promise((resolve, reject) => {
        remove({
          url: '/human/roster/' + v
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log('deletePersonList error', err)
            reject(err)
          })
      })
    })
    return Promise.all(promises)
  },
  modifyPersonList({ commit }, payload) {
    return new Promise((resolve, reject) => {
      put({
        url: '/human/roster/' + payload._id,
        body: {
          username: payload.username,
          gender: Number(payload.gender),
          idNumber: payload.idNumber,
          similarity: payload.similarity,
          picture: payload.photoUrl,
          age: Number(payload.age),
          reason: payload.reason,
          remark: payload.remark,
          type: payload.type
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log('modifyPersonList error', err)
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
