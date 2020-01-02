import {addNonVehicleApi, editNonVehicleApi, getNonVehicleApi, deleteNonVehicleApi, getOneNonVehicleApi, exportNonVehicleApi, getNonVehicleCountApi, getNonVehicleCheckApi, ImportNonVehicleApi, getCheckTotalApi, getCheckFailedApi, getVehicleTotalApi, getBreakRuleVehicleApi, deleteNodeNonVehicleApi, getBreakRulesRecordApi} from 'http/nonVehicle.api.js'
const state = {}
const mutations = {}
const actions = {
  /* 添加 */
  addNonVehicle({commit}, payload) {
    return addNonVehicleApi(payload)
  },
  /* 修改 */
  editNonVehicle({commit}, payload) {
    return editNonVehicleApi(payload)
  },
  /* 获取 */
  getNonVehicle({commit}, payload) {
    return getNonVehicleApi(payload)
  },
  /* 删除 */
  deleteNonVehicle({commit}, payload) {
    return deleteNonVehicleApi(payload)
  },
  deleteNodeNonVehicle({commit}, payload) {
    return deleteNodeNonVehicleApi(payload)
  },
  /* 获取详细信息 */
  getOneNonVehicle({commit}, payload) {
    return getOneNonVehicleApi(payload)
  },
  /* 导出 */
  exportNonVehicle({commit}, payload) {
    return exportNonVehicleApi(payload)
  },
  /* 备案统计 */
  getNonVehicleCount() {
    return getNonVehicleCountApi()
  },
  /* 机动车扫码次数统计 */
  getNonVehicleCheck({commit}, payload) {
    return getNonVehicleCheckApi(payload)
  },
  /* 导入 非机动车管理 数据 */
  ImportNonVehicle({commit}, payload) {
    return ImportNonVehicleApi(payload)
  },
  /* 数据统计-人车同检统计 核验总量统计 */
  getCheckTotal({commit}, payload) {
    return getCheckTotalApi(payload)
  },
  /* 数据统计-人车同检统计 核验失败统计 */
  getCheckFailed({commit}, payload) {
    return getCheckFailedApi(payload)
  },
  /* 数据统计-车流量统计 车辆统计 */
  getVehicleTotal({commit}, payload) {
    return getVehicleTotalApi(payload)
  },
  /* 数据统计-车流量统计 违章统计 */
  getBreakRuleVehicle({commit}, payload) {
    return getBreakRuleVehicleApi(payload)
  },
  /* 获取电动车 违规记录 */
  getBreakRulesRecord({commit}, payload) {
    return getBreakRulesRecordApi(payload)
  }
}
export default {
  state,
  mutations,
  actions
}
