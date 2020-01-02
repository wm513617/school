import {
  getVideoCopyLogApi,
  postAddViodeCopyLogApi,
  deleteViodeCopyLogApi,
  updateVideoCopyLogApi,
  getDevInfoLogApi,
  postAddDevInfoLogApi,
  deleteDevInfoLogApi,
  updateDevInfoLogApi,
  getDeviceListApi,
  getResourceListApi
} from 'src/http/business/log/log.api'

const state = {

}
const mutations = {

}
const actions = {
  getVideoCopyLog({ commit }, query) {
    return getVideoCopyLogApi(query)
  },
  postAddViodeCopyLog({ commit }, body) {
    return postAddViodeCopyLogApi(body)
  },
  deleteViodeCopyLog({ commit }, id) {
    return deleteViodeCopyLogApi(id)
  },
  updateVideoCopyLog({ commit }, body) {
    return updateVideoCopyLogApi(body.id, body.content)
  },
  getDevInfoLog({ commit }, query) {
    return getDevInfoLogApi(query)
  },
  postAddDevInfoLog({ commit }, body) {
    return postAddDevInfoLogApi(body)
  },
  deleteDevInfoLog({ commit }, id) {
    return deleteDevInfoLogApi(id)
  },
  updateDevInfoLog({ commit }, body) {
    return updateDevInfoLogApi(body.id, body.content)
  },
  getDeviceList({ commit }) {
    return getDeviceListApi()
  },
  getResourceVideo({ commit }) {
    return getResourceListApi()
  }
}
const getters = {

}
export default {
  state,
  mutations,
  actions,
  getters
}
