import moment from 'moment'
import { getSocket } from 'src/socket/socket.js'

const state = {
  userType: ['员工', '访客', 'VIP', '黑名单', '白名单', '布控', '陌生人'],
  realtimeList: [],
  contrastList: [],
  openDevArr: [],
  contrastType: 'all',
  contrastMsgList: [],
  faceSocketState: true
}

const mutations = {
  UPDATE_REALTIMEDATA(state, res) {
    res.map(data => {
      // if (true) {
      if (state.openDevArr.indexOf(data.resource) > -1) {
        const formatData = {
          // capture: data.snapshot,
          // picture: data.picture,
          capture: data.snapshot,
          picture: data.picture,
          device: data.resourcePoint,
          captureTime: moment.unix(data.snapshotTime).format('YYYY-MM-DD HH:mm:ss'),
          name: data.username,
          gender: data.gender ? '男' : '女',
          age: data.age,
          similarity: data.similarity ? data.similarity + '%' : '',
          type: state.userType[data.type],
          idcard: data.idNumber
        }
        if (state.realtimeList.length > 9) {
          state.realtimeList.length = 9
        }
        state.realtimeList.unshift(formatData)
        if (formatData.type !== '陌生人') {
          if (state.contrastMsgList.length > 4) {
            state.contrastMsgList.length = 4
          }
          state.contrastMsgList.unshift(formatData)

          if (state.contrastType === 'all') {
            state.contrastList.unshift(formatData)
          } else if (state.contrastType === data.type) {
            state.contrastList.unshift(formatData)
          }

          if (state.contrastList.length > 100) {
            state.contrastList.length = 100
          }
        }
      }
    })
  },
  CHANGE_FACE_OPENARR(state, data) {
    state.openDevArr = data
  },
  CAHANGE_FACESOCKETSTATE(state, data) {
    state.faceSocketState = false
  },
  CHANGE_FACE_CONTRAST_TYPE(state, data) {
    state.contrastType = data
  }
}

const actions = {
  getFaceRealTimeData({ state, commit }, payload) {
    if (state.faceSocketState) {
      commit('CAHANGE_FACESOCKETSTATE', false)
      getSocket().on('server:face.realTime', res => {
        if (state.openDevArr.length) {
          commit('UPDATE_REALTIMEDATA', res)
        }
      })
    }
  }
}
const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
