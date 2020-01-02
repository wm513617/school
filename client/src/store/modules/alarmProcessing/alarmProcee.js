import { outputControlApi } from 'http/alarmProcessing/alarmProcess.api'
import alarm from 'src/socket/alarm'
const state = {
}

const mutations = {
}

const actions = {
  // 维修单位添加post
  outputCol({ commit, dispatch, state }, payLoad) {
    return new Promise((resolve, reject) => {
      outputControlApi(payLoad)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
  // 从socket接收报警
  // alarmWarning({state, commit, dispatch, rootGetters}) {
  //   alarm.on('all', (data) => {
  //     console.log(data, 'socket接收到的报警信息')
  //   })
  //   // alarm.on('confirmAlarm', (val) => {
  //   //   removeAlarm(state, commit, dispatch, val)
  //   // })
  // }
}

const getters = {
}

export default {
  state,
  mutations,
  actions,
  getters
}
