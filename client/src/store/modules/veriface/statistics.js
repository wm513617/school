import { getVerifaceStatisticTodayApi, getVerifaceStatisticAnalysisApi } from '../../../http/veriface/statistics.api'
import { getSocket } from 'src/socket/socket.js'
import moment from 'moment'
/**
 * 数据统计模块
 */
const state = {
  todayData: {
    passbyCount: 0,
    alarmCount: 0,
    userCount: 0,
    faceResCount: 0,
    onlineFaceRes: 0
  },
  todayAlarmData: [],
  todayPassbyData: [],
  contrastData: {
    label: [],
    data: []
  },
  deployData: {
    label: [],
    data: []
  }
}
const mutations = {
  SET_TODAY_DATA(state, payload) {
    state.todayData = payload
  },
  SET_TODAY_ALARM_DATA(state, payload) {
    state.todayAlarmData = payload
  },
  SET_TODAY_PASSBY_DATA(state, payload) {
    state.todayPassbyData = payload
  },
  SET_CONTRAST_DATA(state, payload) {
    state.contrastData = payload
  },
  SET_DEPLOY_DATA(state, payload) {
    state.deployData = payload
  }
}
const actions = {
  // 获取今日识别的路人量和报警量
  getVerifaceStatisticAnalysis({commit}, payload) {
    return getVerifaceStatisticAnalysisApi(payload).then(res => {
      const passbyData = res.data.passbyData
      let contrast = {
        label: [],
        data: []
      }
      passbyData.forEach(item => {
        contrast.label.push(moment.unix(item.date).format('MM-DD'))
        if (item.count) {
          contrast.data.push(item.count)
        } else {
          contrast.data.push(0)
        }
      })
      commit('SET_CONTRAST_DATA', contrast)
      const aralarmDatar = res.data.alarmData
      let deploy = {
        label: [],
        data: []
      }
      aralarmDatar.forEach(item => {
        deploy.label.push(moment.unix(item.date).format('MM-DD'))
        if (item.count) {
          deploy.data.push(item.count)
        } else {
          deploy.data.push(0)
        }
      })
      commit('SET_DEPLOY_DATA', deploy)
    })
  },
  // 获取今日识别的路人量和报警量
  getVerifaceStatisticToday({commit}, payload) {
    return getVerifaceStatisticTodayApi().then(res => {
      let alarmData = []
      let passbyData = []
      let data = res.data
      // let data = {
      //   alarmData: [
      //     {hour: 10, count: 565},
      //     {hour: 15, count: 5123}
      //   ],
      //   passbyData: [
      //     {hour: 2, count: 999},
      //     {hour: 24, count: 5484}
      //   ]
      // }
      let a = 0
      let p = 0
      for (let i = 1; i < 25; i++) {
        if (data.alarmData[a] && data.alarmData[a].hour === i) {
          alarmData[i - 1] = data.alarmData[a].count
          a++
        } else {
          alarmData[i - 1] = 0
        }
      }
      commit('SET_TODAY_ALARM_DATA', alarmData)
      for (let i = 1; i < 25; i++) {
        if (data.alarmData[p] && data.passbyData[p].hour === i) {
          passbyData[i - 1] = data.passbyData[p].count
          p++
        } else {
          passbyData[i - 1] = 0
        }
      }
      commit('SET_TODAY_PASSBY_DATA', passbyData)
    })
  },
  // 今日数据- 实时数据
  socketVerifaceToday({ state, commit }, payload) {
    getSocket().on('verifaceToday', data => {
      commit('SET_TODAY_DATA', data)
    })
  }
}

export default {
  state,
  mutations,
  actions
}
