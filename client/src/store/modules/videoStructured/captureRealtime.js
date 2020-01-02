import { getCaptureInitDataApi, getDefenseAlarmDataApi, getDefenseAlarmCountApi, getCaptureTodayCountApi } from 'src/http/videoStructured/captureRealtime.api'
import { getSingleList } from 'src/http/resource/resource.api.js'
import { get } from 'src/http/base'
const state = {
  personCapList: [], // 实时抓拍——行人、摩托车、三轮车、自行车
  carCapList: [], // 实时抓拍——大客车、轿车、面包车、卡车
  structAlarmList: [], // 结构化报警
  structDefeAlarmCount: 0, // 今日报警数量
  integrateSearchType: -1 // 跳转至综合查询时，默认查询类型
}
const mutations = {
  SET_PERSON_CAP_LIST(state, data) {
    state.personCapList = data.splice(0, 32)
  },
  UPDATE_PERSON_CAP_LIST(state, data) {
    if (state.personCapList.length >= 32) {
      state.personCapList.pop()
    }
    state.personCapList.splice(0, 0, data)
  },
  SET_CAR_CAP_LIST(state, data) {
    state.carCapList = data.splice(0, 32)
  },
  UPDATE_CAR_CAP_LIST(state, data) {
    if (state.carCapList.length >= 32) {
      state.carCapList.pop()
    }
    state.carCapList.splice(0, 0, data)
  },
  SET_STRUCTURE_ALARM_LIST(state, data) {
    state.structAlarmList = data.splice(0, 64)
  },
  UPDATE_STRUCTURE_ALARM_LIST(state, data) {
    if (state.structAlarmList.length >= 64) {
      state.structAlarmList.pop()
    }
    state.structAlarmList.unshift(data)
  },
  CHANGE_STRUCT_ALARM_STATUS(state, data) {
    state.structAlarmList[data.index] = data.data
  },
  SET_STRUCT_DEFE_ALARM_COUNT(state, n) {
    state.structDefeAlarmCount = n
  },
  SET_SEARCH_TYPE(state, v) {
    state.integrateSearchType = v
  }
}
const actions = {
  getVideoStructTree() { // 视频结构化资源树
    var param = {
      url: 'setting/resource/tree',
      query: {
        orgtype: 8,
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
  changeStructAlarmCount({ state, commit }, count) { // 实时报警统计数量
    commit('SET_STRUCT_DEFE_ALARM_COUNT', count)
  },
  saveStructAlarmData({ state, commit }, data) { // 实时报警数据
    commit('SET_STRUCT_DEFE_ALARM_COUNT', state.structDefeAlarmCount + 1)
    commit('UPDATE_STRUCTURE_ALARM_LIST', data)
  },
  setStructContrastList({ state, commit }, data) { // 报警数据处理
    commit('CHANGE_STRUCT_ALARM_STATUS', data)
  },
  getCaptureInitData({ state, commit }) { // 获取默认抓拍数据
    return new Promise((resolve, reject) => {
      getCaptureInitDataApi().then((res) => {
        if (res.data) {
          res.data.nonVehArr && commit('SET_PERSON_CAP_LIST', res.data.nonVehArr)
          res.data.vehArr && commit('SET_CAR_CAP_LIST', res.data.vehArr)
        }
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getDefenseAlarmData({ state, commit }) { // 获取默认报警数据
    return new Promise((resolve, reject) => {
      getDefenseAlarmDataApi().then((res) => {
        commit('SET_STRUCTURE_ALARM_LIST', res.data)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getStructResourceInfo({ state, commit }, id) { // 获取资源信息
    return new Promise((resolve, reject) => {
      getSingleList(id).then((res) => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getDefenseAlarmCount({ state, commit }) { // 获取布控报警数据统计
    return new Promise((resolve, reject) => {
      getDefenseAlarmCountApi().then((res) => {
        commit('SET_STRUCT_DEFE_ALARM_COUNT', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getCaptureTodayCount({ state, commit }) { // 获取当天抓拍数据统计
    return new Promise((resolve, reject) => {
      getCaptureTodayCountApi().then((res) => {
        resolve(res.data)
      }).catch(err => {
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
