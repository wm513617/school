import {
  getImagesConditionSearchApi,
  getPassagewayDataApi,
  creatExportTaskApi,
  getExportTaskListApi,
  removeExportTaskApi
} from 'src/http/videoStructured/imageSearch.api'
const state = {
  imageList: [],
  imageListBlock: [],
  imageUrl: '',
  imageCurrentUrl: ''
}

const mutations = {
  SET_IMAGES_LIST(state, list) {
    state.imageList = list
  },
  SET_IMAGES_LIST_BLOCK(state, list) {
    state.imageListBlock = list
  },
  SET_UPLOAD_IMAGE_URL(state, info) {
    state.imageUrl = info
  },
  SET_IMAGE_URL(state, info) {
    state.imageCurrentUrl = info
  }
}
const actions = {
  /**
   * 检索
   * * */
  getImagesConditionSearch({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      getImagesConditionSearchApi(payload)
        .then(res => {
          commit('SET_IMAGES_LIST', res.data)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  /**
   * 获取通道数据
   * */
  getPassagewayData({ state }, payload) {
    return new Promise((resolve, reject) => {
      getPassagewayDataApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  /**
   * 导出以图搜图任务创建
   * */
  creatExportTask({ state }, payload) {
    return new Promise((resolve, reject) => {
      creatExportTaskApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  /**
   * 获取导出列表
   * */
  getExportTaskList({ state }, payload) {
    return new Promise((resolve, reject) => {
      const param = {
        type: payload
      }
      getExportTaskListApi(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  /**
   * 删除导出任务
   * */
  removeExportTask({ state }, payload) {
    return new Promise((resolve, reject) => {
      removeExportTaskApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  /**
   * 更新上传图片的url
   * */
  setUploadImageUrl({ commit }, payload) {
    commit('SET_UPLOAD_IMAGE_URL', payload)
  },
  /**
   * 更新以图搜图的url
   * */
  setImageUrl({ commit }, payload) {
    commit('SET_IMAGE_URL', payload)
  },
  /**
   * 更新请求的图片列表数据
   * */
  setImageList({ commit }, payload) {
    commit('SET_IMAGES_LIST', payload)
  },
  /**
   * 更新当前显示的图片列表数据
   * */
  setImageListBlock({ commit }, payload) {
    commit('SET_IMAGES_LIST_BLOCK', payload)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
