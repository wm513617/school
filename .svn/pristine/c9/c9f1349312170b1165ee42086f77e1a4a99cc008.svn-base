import { get } from 'http/base'
const actions = {
  getKoalaServer({ commit }, analysisType) {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/pass/server'
      }).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('getResTree error:' + err)
        reject(err)
      })
    })
  },
  getHomeHumanOutline() {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/statistics/outline'
      }).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('getResTree error:' + err)
        reject(err)
      })
    })
  },
  getHomeHumanFeature() {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/statistics/feature'
      }).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('getResTree error:' + err)
        reject(err)
      })
    })
  },
  getHomeHumanTrend() {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/statistics/trend'
      }).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('getResTree error:' + err)
        reject(err)
      })
    })
  },
  getHomeHumanToday() {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/statistics/today'
      }).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('getResTree error:' + err)
        reject(err)
      })
    })
  },
  getHomeHumanPassToday() {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/pass/statistics/today'
      }).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('getResTree error:' + err)
        reject(err)
      })
    })
  },
  getHumanInquiryTrajectory({ commit }, payload) {
    return new Promise((resolve, reject) => {
      get({
        url: '/human/inquiry/trajectory',
        query: payload
      }).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('getResTree error:' + err)
        reject(err)
      })
    })
  }
}

export default {
  actions
}
