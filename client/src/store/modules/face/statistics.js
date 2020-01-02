import {
  get,
  put
} from 'http/base'
import moment from 'moment'
import { getSocket } from 'src/socket/socket.js'
const state = {
  todayChart: {
    label: ['8045', '2132', '546', '4564'],
    serise: [{
      name: '2017-06-25',
      type: 'line',
      data: ['8045', '2132', '546', '4564']
    }, {
      name: '2017-06-21',
      type: 'line',
      data: ['55', '66', '22', '88']
    }]
  },
  analyzeChart: {
    label: ['8045', '2132', '546', '4564'],
    serise: [{
      name: '2017-06-25',
      type: 'bar',
      data: ['8045', '2132', '546', '4564']
    }]
  }
}

const mutations = {
  SET_TODAY_CHART(state, data) {
    state.todayChart.label = data.label
    state.todayChart.serise = data.serise.map(v => {
      return {
        name: moment(parseInt(v.name) * 1000).format('YYYY-MM-DD'),
        data: v.data
      }
    })
  },
  SET_ANALYZE_CHART(state, data) {
    state.analyzeChart.label = data.label.map(v => {
      return moment(parseInt(v) * 1000).format('YYYY-MM-DD')
    })
    state.analyzeChart.serise = data.serise
  },
  UPDATA_FACE_TODAY(state, data) {
    state.faceTodayData = data
  },
  UPDATA_FACE_TODAY_PASS(state, data) {
    state.faceTodayPassData = data
  }
}

const actions = {
  socketFaceToday({
    commit
  }) {
    getSocket().on('server:face.today', data => {
      commit('UPDATA_FACE_TODAY', data)
    })
  },
  socketFaceTodayPass({
    commit
  }) {
    getSocket().on('server:pass.today', data => {
      commit('UPDATA_FACE_TODAY_PASS', data)
    })
  },
  getTodayCapChart({
    commit
  }, paramsStr) {
    const params = {
      url: '/human/statistics/contrast' + paramsStr
    }
    return new Promise((resolve, reject) => {
      get(params).then((res) => {
        commit('SET_TODAY_CHART', res.data)
        resolve(res)
      }).catch(err => {
        console.log('getTodayCapChart error:' + err)
        reject(err)
      })
    })
  },
  getTodayCurChart({
    commit
  }, paramsStr) {
    const params = {
      url: '/human/pass/statistics/contrast' + paramsStr
    }
    return new Promise((resolve, reject) => {
      get(params).then((res) => {
        commit('SET_TODAY_CHART', res.data)
        resolve(res)
      }).catch(err => {
        console.log('getTodayCurChart error:' + err)
        reject(err)
      })
    })
  },
  getAnalyzeCapChart({
    commit
  }, paramsStr) {
    const params = {
      url: '/human/statistics/contrast' + paramsStr
    }
    return new Promise((resolve, reject) => {
      get(params).then((res) => {
        commit('SET_ANALYZE_CHART', res.data)
        resolve(res)
      }).catch(err => {
        console.log('getAnalyzeCapChart error:' + err)
        reject(err)
      })
    })
  },
  getAnalyzeCurChart({
    commit
  }, paramsStr) {
    const params = {
      url: '/human/pass/statistics/contrast' + paramsStr
    }
    return new Promise((resolve, reject) => {
      get(params).then((res) => {
        commit('SET_ANALYZE_CHART', res.data)
        resolve(res)
      }).catch(err => {
        console.log('getAnalyzeCurChart error:' + err)
        reject(err)
      })
    })
  },
  // 实时抓拍
  putRealtimeSnap({
    commit
  }, paramsStr) {
    const params = {
      body: paramsStr,
      url: '/human/realtime/camera'
    }
    return new Promise((resolve, reject) => {
      put(params).then((res) => {
        resolve(res)
      }).catch(err => {
        console.log('putRealtimeSnap error:' + err)
        reject(err)
      })
    })
  },
  // 导出数据
  getAnalyzeExportData({
    state
  }, payload) {
    const params = {
      url: '/human/statistics/export?' + payload
    }
    return new Promise((resolve, reject) => {
      get(params).then((res) => {
        resolve(res)
      }).catch(err => {
        console.log('getAnalyzeExportData error:' + err)
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
