import { getPeopleVehicleRecordApi, getVioParkRecordApi, getSpeedingRecordApi, getBayonetListApi, getConstListApi, getIntelliTrafficRecordPassApi, getIntelliTrafficRecordConstantApi, getIntelliTrafficRecordPassExportApi, getLocationApi } from 'http/smartTrafficRecord.api.js'
const state = {
  vehicleStateConstList: {}
}
const mutations = {
  SET_VEHICLE_STATE(state, data) {
    state.vehicleStateConstList = data
  }
}
const actions = {
  /* 获取人车同检记录 */
  getPepleVehicle({commit}, payload) {
    return getPeopleVehicleRecordApi(payload)
  },
  // 过车记录 获取过车记录
  getIntellTraRecordPass({commit}, payload) {
    return getIntelliTrafficRecordPassApi(payload)
  },
  // 过车记录 获取常量信息接口
  getIntellTraRecordConstant({commit}, payload) {
    return getIntelliTrafficRecordConstantApi(payload)
  },
  // 过车记录 过车记录导出
  getIntellTraRecordPassExport({commit}, payload) {
    return getIntelliTrafficRecordPassExportApi(payload)
  },
  /* 获取违章记录 */
  getVioParkRecord({commit}, payload) {
    return getVioParkRecordApi(payload)
  },
  /* 导出违章记录 */
  // exportVioParkExport({commit}, payload) {
  //   return exportVioParkExportApi(payload)
  // },
  /* 获取超速记录 */
  getSpeedingRecord({commit}, payload) {
    return getSpeedingRecordApi(payload)
  },
  /* 获取超速记录卡口列表 */
  getBayonetList({commit}, payload) {
    return getBayonetListApi(payload)
  },
  /* 获取车辆状态常量列表 */
  getConstList({commit}, payload) {
    return new Promise((resolve, reject) => {
      getConstListApi(payload)
        .then(res => {
          commit('SET_VEHICLE_STATE', res.data.vehicleState)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  /* 获取人车同检记录-位置列表 */
  getLocation({commit}, payload) {
    return getLocationApi()
  }
}
export default {
  state,
  mutations,
  actions
}
