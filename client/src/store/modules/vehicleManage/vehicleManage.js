import {addMotorVehicleApi, editMotorVehicleApi, getMotorVehicleApi, deleteMotorVehicleApi, exportMotorVehicleApi, ImportMotorVehicleApi, deleteMotorVehicleOrgApi} from 'http/vehicle.api.js'
const state = {}
const mutations = {}
const actions = {
  /* 添加 */
  addMotorVehicle({commit}, payload) {
    return addMotorVehicleApi(payload)
  },
  /* 修改 */
  editMotorVehicle({commit}, payload) {
    return editMotorVehicleApi(payload)
  },
  /* 获取 */
  getMotorVehicle({commit}, payload) {
    return getMotorVehicleApi(payload)
  },
  /* 删除 */
  deleteMotorVehicle({commit}, payload) {
    return deleteMotorVehicleApi(payload)
  },
  /* 导出 */
  exportMotorVehicle({commit}, payload) {
    return exportMotorVehicleApi(payload)
  },
  /* 导入 机动车管理 数据 */
  ImportMotorVehicle({commit}, payload) {
    return ImportMotorVehicleApi(payload)
  },
  /* 删除机构下设备 */
  deleteMotorVehicleOrg({commit}, payload) {
    return deleteMotorVehicleOrgApi(payload)
  }
}
export default {
  state,
  mutations,
  actions
}
