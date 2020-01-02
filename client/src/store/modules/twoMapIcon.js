import {
  getMapIconOrganizaApi,
  getMapIconList,
  postIconApi,
  putIconApi,
  removeIconApi,
  // getGroupIconApi,
  setIconDefaultApi,
  setIconRotateApi
} from 'src/http/twoMapIcon.api'

const state = {}
const mutations = {}
const actions = {
  /**
   * 图标机构树
   */
  getIconOrganiza({ commit }) {
    return getMapIconOrganizaApi()
  },
  /**
   * 图标机构树
   */
  getIconList({ commit }, query) {
    return getMapIconList(query)
  },
  /**
   * 添加图标
   */
  addIcon({ commit }, body) {
    return postIconApi(body)
  },
  /**
   * 修改图标
   */
  updateIcon({ commit }, body) {
    return putIconApi(body.id, body.content)
  },
  /**
   * 删除图标
   */
  removeIcon({ commit }, arrId) {
    return removeIconApi(arrId)
  },
  /**
   * 设置默认图标
   */
  setDefaultIcon({ commit }, body) {
    return setIconDefaultApi(body.id, body.content)
  },
  /**
   * 设置图标旋转
   */
  setIconRotate({ commit }, param) {
    return setIconRotateApi(param.oid, param.isRotate)
  }
  /**
   * 获取一组图标
   */
  // getGroupIcon({ commit }, query) {
  //   return getGroupIconApi(query)
  // }
}
const getter = {}
export default {
  state,
  mutations,
  actions,
  getter
}
