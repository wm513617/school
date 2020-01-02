import {
  getStructuredVideosApi, // 查询结构化视频资源
  getStructuredVideosInAreaApi // 查询区域内的结构化视频资源
} from '../../../http/videoStructured/structuredTrack.api'
const state = {
  selectPointHeightLightFeatures: []
}
const mutations = {
  SET_SELECT_POINT_HEIGHTLIGHT_FEATURES(state,data){
    state.selectPointHeightLightFeatures = data
    console.log(state.selectPointHeightLightFeatures)
  }
}
const actions = {
  loadStructuredVideosByMapId({commit}, query) { // 根据地图标识加载结构化视频数据
    return new Promise((resolve, reject) => {
      getStructuredVideosApi(query).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getStructuredVideosInArea({commit}, query) { // 根据地图标识加载结构化视频数据
    return new Promise((resolve, reject) => {
      getStructuredVideosInAreaApi(query).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
const getters = {
  getSelectPointHeightLightFeatures(state){
    return state.selectPointHeightLightFeatures
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
