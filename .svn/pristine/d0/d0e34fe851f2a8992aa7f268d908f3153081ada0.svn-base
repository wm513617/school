import { getDeviceTree, postDeviceMove } from '../../http/device/device.api'

const state = {}

const mutations = {}

const actions = {
/**
 * 获取设备管理移动机构树
 */
  getDevMoveList({
    state,
    commit,
    rootState
  }, payload) {
    const param = {
      oid: rootState.orgSetting.orgActiveId,
      bigType: payload,
      orgtype: 0
    }
    return new Promise((resolve, reject) => {
      getDeviceTree(param).then(suc => {
        resolve(suc)
      }).catch(err => {
        reject(err)
      })
    })
  },
  postDevMove({
    state,
    commit,
    rootState
  }, payload) {
    const param = {
      body: {
        oid: payload.oid,
        _ids: payload._ids
      }
    }
    return new Promise((resolve, reject) => {
      postDeviceMove(param).then(suc => {
        resolve(suc)
      }).catch(err => {
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
