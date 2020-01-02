import {
  get,
  post,
  remove,
  put
} from '../../../http/base.js'
const state = {
  holidaysData: [{
    _id: 7,
    startTime: '1488038400',
    endTime: '1496299250',
    holidayName: '王小明',
    age: 18,
    type: 'month',
    enable: 'disabled',
    address: '北京市朝阳区芍药居'
  }, {
    _id: '9',
    startTime: '1488038400',
    endTime: '1496299250',
    holidayName: '王小明',
    age: 18,
    type: 'month',
    enable: 'enable',
    address: '北京市朝阳区芍药居'
  }, {
    _id: '10',
    startTime: '1488038400',
    endTime: '1496299250',
    holidayName: 'dcde',
    age: 18,
    type: 'date',
    enable: 'disabled',
    address: '北京市朝阳区芍药居'
  }]
}
const getters = {
  getHoliday(state) {
    return state.holidaysData
  }
}
const mutations = {
  // SET_STORESON_FLAG(state, payLoad) {
  //   state.storesonFlag = payLoad
  // }
}

const actions = {
  //  获取所有抓图计划
  getHolidayByUser({
    commit,
    state
  }, obj) {
    const params = {
      query: {},
      url: '/setting/holiday'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  //  修改
  changeHolidayByUser({
    commit,
    state
  }, obj) {
    const params = {
      body: obj,
      url: '/setting/holiday/' + obj._id
    }
    return new Promise((resolve, reject) => {
      put(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  //  添加
  addHolidayByUser({
    commit,
    state
  }, obj) {
    const params = {
      body: obj,
      url: '/setting/holiday'
    }
    return new Promise((resolve, reject) => {
      post(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  //  删除
  delHolidayByUser({
    commit,
    state
  }, obj) {
    const params = {
      url: '/setting/holiday/' + obj._id
    }
    return new Promise((resolve, reject) => {
      remove(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
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
