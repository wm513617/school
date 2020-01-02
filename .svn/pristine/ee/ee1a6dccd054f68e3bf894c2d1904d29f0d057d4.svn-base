import { get, post, remove, put } from 'http/base'
import moment from 'moment'

const state = {
  pageTotal: 1,
  pageSize: 1,
  pageCurrent: 1,
  dispatchedList: [
    // {
    //   index: 0,
    //   dateInfo: '',
    //   name: '',
    //   sex: '',
    //   age: '',
    //   idcard: '',
    //   reason: '',
    //   similarity: '',
    //   status: '',
    //   picture: '',
    //   remark: '',
    //   id: ''
    // }
  ]
}

const mutations = {
  UPDATE_DISPATCHEDLIST(state, res) {
    state.pageTotal = parseInt(res.headers['x-bsc-count'])
    state.pageSize = parseInt(res.headers['x-bsc-limit'])
    state.pageCurrent = parseInt(res.headers['x-bsc-cur'])
    state.dispatchedList = res.data.results.map((val, index) => {
      const item = {}
      item.id = val._id
      item.index = (state.pageCurrent - 1) * state.pageSize + index + 1
      item.dateInfo =
        moment(parseInt(val.startTime) * 1000).format('YYYY-MM-DD') +
        ' 至 ' +
        moment(parseInt(val.endTime) * 1000).format('YYYY-MM-DD')
      item.remark = val.remark
      item.information = val.username + '/' + (val.gender ? '女' : '男') + '/' + val.age
      item.idcard = val.idNumber
      item.reason = val.reason
      item.similarity = val.similarity + '%'
      switch (val.status) {
        case 0:
          item.status = '未布控'
          break
        case 1:
          item.status = '布控中'
          break
        case 2:
          item.status = '已停止'
          break
        case 3:
          item.status = '布控异常'
          break
      }
      item.picture = val.picture
      return item
    })
  }
}

const actions = {
  getDispatchedList({ commit }, { page, limit }) {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/attention',
        query: {
          page,
          limit,
          username: '',
          status: ''
        }
      })
        .then(res => {
          commit('UPDATE_DISPATCHEDLIST', res)
          resolve(res)
        })
        .catch(err => {
          console.log('getDispatchedList error', err)
          reject(err)
        })
    })
  },
  // 获取个人信息
  getPersonalDetails({ commit }, id) {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/attention/' + id
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log('getPersonalDetails error', err)
          reject(err)
        })
    })
  },
  // 检索
  getSearchList({ commit }, { page, limit, payload }) {
    console.log(payload)
    return new Promise((resolve, reject) => {
      get({
        url: '/human/attention?' + payload,
        query: {
          page,
          limit
        }
      })
        .then(res => {
          commit('UPDATE_DISPATCHEDLIST', res)
          resolve(res)
        })
        .catch(err => {
          console.log('getDispatchedList error', err)
          reject(err)
        })
    })
  },
  // 布控验证身份证号
  IDNumber({ commit }, payload) {
    return new Promise((resolve, reject) => {
      get({
        query: payload,
        url: '/human/attention/idNumber'
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
  addDispatched({ commit }, payload) {
    console.log(payload.startTime, payload.endTime, payload.remark)
    return new Promise((resolve, reject) => {
      post({
        url: '/human/attention',
        body: {
          username: payload.username,
          gender: Number(payload.gender),
          idNumber: payload.idNumber,
          similarity: payload.similarity,
          picture: payload.photoUrl,
          age: Number(payload.age),
          reason: payload.reason,
          remark: payload.remark,
          resources: payload.resources,
          startTime: parseInt(Date.parse(payload.startTime) / 1000),
          endTime: parseInt(Date.parse(payload.endTime) / 1000)
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log('addDispatched error', err)
          reject(err)
        })
    })
  },
  deleteDispatched({ commit }, delArr) {
    const promises = delArr.map(v => {
      return new Promise((resolve, reject) => {
        remove({
          url: '/human/attention/' + v
        })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            console.log('deleteDispatched error', err)
            reject(err)
          })
      })
    })
    return Promise.all(promises)
  },
  startMonitor({ commit }, payload) {
    return new Promise((resolve, reject) => {
      put({
        url: '/human/attention/start',
        body: payload
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log('startMonitor error', err)
          reject(err)
        })
    })
  },
  endMonitor({ commit }, startId) {
    return new Promise((resolve, reject) => {
      put({
        url: '/human/attention/end',
        body: {
          ids: startId
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log('endMonitor error', err)
          reject(err)
        })
    })
  },
  modifyDispatched({ commit }, payload) {
    return new Promise((resolve, reject) => {
      put({
        url: '/human/attention/' + payload._id,
        body: {
          _id: payload._id,
          username: payload.username,
          gender: Number(payload.gender),
          idNumber: payload.idNumber,
          similarity: payload.similarity,
          picture: payload.photoUrl,
          age: Number(payload.age),
          reason: payload.reason,
          remark: payload.remark,
          status: payload.status,
          resources: payload.resources,
          startTime: parseInt(Date.parse(payload.startTime) / 1000),
          endTime: parseInt(Date.parse(payload.endTime) / 1000)
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          console.log('modifyDispatched error', err)
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
