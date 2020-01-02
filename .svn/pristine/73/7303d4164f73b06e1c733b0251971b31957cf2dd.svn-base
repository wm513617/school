import {
  get
} from '../../http/base'
const state = {
  intelligence: {
    statistic: [],
    contrast: {
      serise: [

      ]
    }
  },
  binocularIpcData: {
    label: [],
    serise: []
  },
  binocularIpcList: []
}
const mutations = {
  GET_INTELLIGENCE_DATA(state, payload) {
    state.intelligence = payload.data
  },
  GET_BINOCULAR_IPC_DATA(state, payload) {
    state.binocularIpcData = payload.data
  },
  GET_BINOCULAR_IPC_LIST(state, payload) {
    state.binocularIpcList = []
    payload.data.forEach((item) => {
      state.binocularIpcList.push({
        value: item._id,
        label: item.name
      })
    })
  }
}

const actions = {
  getIntelligenceData({
    commit
  }, payload) {
    const param = {
      url: '/human/statistics/intelligence'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('GET_INTELLIGENCE_DATA', res)
      }).catch(err => {
        console.log('getIntelligenceData error:' + err)
        reject(err)
      })
    })
  },
  // 双目IPC的人数统计（即ipc大华HFW7233X-E2设备）
  getBinocularIpcData({
    commit
  }, payload) {
    const param = {
      url: '/human/statistics/outin?res=' + payload
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('GET_BINOCULAR_IPC_DATA', res)
      }).catch(err => {
        console.log('getBinocularIpcData error:' + err)
      })
    })
  },
  // 获得所有的双目IPC的设备
  getBinocularIpcList({
    commit
  }, payload) {
    const param = {
      url: '/setting/device/byseries?series=' + payload
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('GET_BINOCULAR_IPC_LIST', res)
      }).catch(err => {
        console.log('getBinocularIpcList error:' + err)
        reject(err)
      })
    })
  }
}
export default {
  state,
  mutations,
  actions
}
