import { getSocket } from 'src/socket/socket.js'
import { get } from 'src/http/base'
import { getVerifaceIdentifyApi } from '../../../http/veriface/capture.api'

/**
 * 人脸抓拍模块
 */
const state = {
  realtimeList: [], // 可能是实时抓拍中的数据
  contrastList: [], // 可能是人员对比中的列表
  openDevArr: [],
  contrastType: '全部',
  contrastMsgList: [],
  realtimeNumber: 0, // 用于实时路人做列表滑动效果的辅助值
  contrastNumber: 0, // 用于今日报警做列表滑动效果的辅助值
  faceSocketState: true,
  strangerNumber: 0, // 实时抓拍数量
  defenseAlarmNumber: 0, // 今日报警数量
  defenseList: [] // 可能是布控报警的内容
}

const mutations = {
  UPDATE_VERIFACE_REALTIMEDATA(state, formatData) {
    if (!formatData.faceImage) {
      return
    }
    if (state.openDevArr.indexOf(formatData.res) > -1) {
      state.realtimeList.unshift(formatData)
      state.realtimeNumber++
      (state.realtimeNumber > 999999999) && (state.realtimeNumber = 0)
      state.realtimeList[0].dispose = false
      if (state.realtimeList.length > 64) {
        state.realtimeList.length = 64
      }
    }
    if (formatData.isdefense) {
      // if (state.contrastType === '全部') {
      //   state.contrastList.unshift(formatData)
      // } else if (state.contrastType === formatData.group) {
      //   state.contrastList.unshift(formatData)
      // }
      state.contrastList.unshift(formatData)
      state.contrastNumber++
      (state.contrastNumber > 999999999) && (state.contrastNumber = 0)
      if (state.contrastList.length > 64) {
        state.contrastList.length = 64
      }
      state.contrastList = state.contrastList.map(item => {
        item.userCode = item.userCode || '-'
        return item
      })
    }
  },
  UPDATE_VERIFACE_IMAGE(state, data) {
    for (let i = 0; i < state.contrastList.length; i++) {
      if (data === state.contrastList[i]._id) {
        state.contrastList[i].faceImage = state.contrastList[i].faceImage.split('?')[0] + '?' + Math.random()
        return
      }
    }
    for (let i = 0; i < state.realtimeList.length; i++) {
      if (data === state.realtimeList[i]._id) {
        state.realtimeList[i].faceImage = state.realtimeList[i].faceImage.split('?')[0] + '?' + Math.random()
        return
      }
    }
  },
  IMAGE_ERROR(state, paloay) { // 根据路径找不到图片资源时，只允许图片循环更新3次
    if (paloay.type === 'realtimeList') {
      const times = state.realtimeList[paloay.index].refreshImgTime
      if (!(times && times > 3)) {
        state.realtimeList[paloay.index].refreshImgTime = times ? times + 1 : 1
        state.realtimeList[paloay.index].faceImage = state.realtimeList[paloay.index].faceImage.split('?')[0] + '?' + Math.random()
      }
    }
    if (paloay.type === 'contrastList') {
      const trastTime = state.contrastList[paloay.index].refreshImgTime
      if (!(trastTime && trastTime > 3)) {
        state.contrastList[paloay.index].faceImage = state.contrastList[paloay.index].faceImage.split('?')[0] + '?' + Math.random()
        state.contrastList[paloay.index].refreshImgTime = state.contrastList[paloay.index].refreshImgTime ? ++state.contrastList[paloay.index].refreshImgTime : 1
      }
    }
  },
  CHANGE_VERIFACE_OPENARR(state, data) {
    state.openDevArr = data
  },
  CAHANGE_VERIFACE_SOCKETSTATE(state) {
    state.faceSocketState = false
  },
  CHANGE_VERIFACE_CONTRAST_TYPE(state, data) {
    state.contrastType = data
  },
  CHANGE_VERIFACE_DEFENSE_LIST(state, formatData) {
    state.defenseList.unshift(formatData)
    if (state.defenseList.length > 20) {
      state.defenseList.length = 20
    }
  },
  INITIALIZE_VERIFACE_REALTIMEDATA(state, data) {
    state.realtimeList = data
  },
  INITIALIZE_VERIFACE_CONTRASTLIST(state, data) {
    state.contrastList = data.map(item => {
      item.dispose = false
      return item
    })
  },
  SET_VERIFACE_CONTRASTLIST(state, payload) {
    state.contrastList[payload.index] = payload.data
  },
  SET_VERIFACE_STRANGER_NUMBER(state, data) {
    state.strangerNumber = data
  },
  SET_VERIFACE_DEFENSE_ALARM_NUMBER(state, data) {
    state.defenseAlarmNumber = data
  },
  SET_VERIFACE_DEFENSE_REALTIME_NUMBER(state) {
    state.realtimeNumber++
  },
  SET_VERIFACE_DEFENSE_CONTRAST_NUMBER(state) {
    state.contrastNumber++
  }
}
const actions = {
  getVerifaceOrgTree() {
    var param = {
      url: 'setting/resource/tree',
      query: {
        orgtype: 6,
        type: 0
      }
    }
    return new Promise((resolve, reject) => {
      return get(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getVeriFaceRealTimeData({ state, commit }) {
    if (state.faceSocketState) {
      commit('CAHANGE_VERIFACE_SOCKETSTATE', false)
      getSocket().on('veriFaceNotify', data => {
        if (data._id) {
          commit('UPDATE_VERIFACE_IMAGE', data._id)
        }
      })
      getSocket().on('veriFaceStatics', data => {
        if (data) {
          commit('SET_VERIFACE_STRANGER_NUMBER', data.passerNumber)
          commit('SET_VERIFACE_DEFENSE_ALARM_NUMBER', data.defenseAlarmNumber)
        }
      })
      getSocket().on('veriFaceData', data => {
        if (!data) { return }
        commit('UPDATE_VERIFACE_REALTIMEDATA', data)
        if (data.isdefense) {
          commit('CHANGE_VERIFACE_DEFENSE_LIST', data)
        }
      })
    }
  },
  getVerifaceIdentify({ state, commit }) { // 获取最近的实时路人或者报警列表
    return getVerifaceIdentifyApi().then(data => {
      commit('INITIALIZE_VERIFACE_REALTIMEDATA', data.data.passers)
      commit('INITIALIZE_VERIFACE_CONTRASTLIST', data.data.defenseAlarms)
      commit('SET_VERIFACE_DEFENSE_ALARM_NUMBER', data.data.defenseAlarmNumber)
      commit('SET_VERIFACE_STRANGER_NUMBER', data.data.passerNumber)
    }).catch((err) => {
      console.log(err)
    })
  },
  setVerifaceContrastList({ state, commit }, payload) {
    commit('SET_VERIFACE_CONTRASTLIST', payload)
  }
}

export default {
  state,
  mutations,
  actions
}
