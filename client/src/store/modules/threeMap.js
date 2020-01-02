import {
  getModelOrganizaApi,
  getModelListApi,
  postModelAddApi,
  putModelUpdateApi,
  removeModelDeleteApi,
  putModelDefaultApi,
  getUpdateModelTypeApi,
  getModelBrightnessHeightApi,
  putModelBrightnessHeightApi,
  getMapIconListIn3d
} from 'src/http/threeMap.api'

const state = {}
const mutations = {}
const actions = {
  /**
     * 模型机构树数据
     */
  getModelOrganiza({ commit }) {
    return getModelOrganizaApi()
  },
  /**
     * 获取三维地图模型列表数据
     */
  getModelList({ commit }, query) {
    return getModelListApi(query)
  },
  /**
     * 添加三维地图模型
     */
  postModelAdd({ commit }, body) {
    return postModelAddApi(body)
  },
  /**
     * 修改三维地图模型
     */
  putModelUpdate({ commit }, body) {
    return putModelUpdateApi(body.id, body.content)
  },
  /**
     * 获取三维地图模型亮度和高度
     */
  getModelBrightnessHeight({ commit }, query) {
    return getModelBrightnessHeightApi(query)
  },
  /**
     * 修改三维地图模型亮度和高度
     */
  putModelBrightnessHeight({ commit }, body) {
    return putModelBrightnessHeightApi(body.id, body.content)
  },
  /**
     * 删除三维地图模型
     */
  removeModelDelete({ commit }, arrId) {
    return removeModelDeleteApi(arrId)
  },
  /**
     * 模型默认值接口
     */
  putModelDefault({ commit }, body) {
    return putModelDefaultApi(body.id, body.content)
  },
  /**
     * 获取一组模型数据
     */
  getUpdateModelType({ commit }, query) {
    return getUpdateModelTypeApi(query)
  },
  /**
   * 图标机构树-3d
   */
  getIconListIn3d({ commit }, query) {
    return getMapIconListIn3d(query)
  }
}
const getter = {}
export default {
  state,
  mutations,
  actions,
  getter
}
