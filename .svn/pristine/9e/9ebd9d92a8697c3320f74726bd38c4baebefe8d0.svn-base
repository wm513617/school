import {
  getCotlMageTaskApi,
  addCotlMageTaskApi,
  editCotlMageTaskApi,
  deleteCotlMageTaskApi
} from 'src/http/videoStructured/controlManage.api'
import { findIndex } from 'lodash'
const state = {
  carStyleGroup: [], // 级联数据(品牌-型号-年款)
  cotlMageTaskList: [], // 布控任务列表
  cotlTaskNameList: [] // 布控名称列表
}
const mutations = {
  CAR_STYLE_CODE_GROUP(state, arr) {
    let plateArr = []
    for (let i = 0; i < arr.length; i++) {
      const index = findIndex(plateArr, { Name: arr[i].CarFamilyName })
      if (index === -1) {
        plateArr.push({
          Code: arr[i].CarFamily,
          Name: arr[i].CarFamilyName,
          brandArr: [
            {
              Code: arr[i].CarFamily + ',' + arr[i].CarBrand,
              Name: arr[i].CarBrandName,
              patternArr: [
                {
                  Code: arr[i].CarFamily + ',' + arr[i].CarBrand + ',' + arr[i].CarPattern,
                  Name: arr[i].CarStyleName
                }
              ]
            }
          ]
        })
      } else {
        const brandIndex = findIndex(plateArr[index].brandArr, { Name: arr[i].CarBrandName })
        if (brandIndex === -1) {
          plateArr[index].brandArr.push({
            Code: arr[i].CarFamily + ',' + arr[i].CarBrand,
            Name: arr[i].CarBrandName,
            patternArr: [
              {
                Code: arr[i].CarFamily + ',' + arr[i].CarBrand + ',' + arr[i].CarPattern,
                Name: arr[i].CarStyleName
              }
            ]
          })
        } else {
          const patternIndex = findIndex(plateArr[index].brandArr[brandIndex].patternArr, { Name: arr[i].CarStyleName })
          if (patternIndex === -1) {
            plateArr[index].brandArr[brandIndex].patternArr.push({
              Code: arr[i].CarFamily + ',' + arr[i].CarBrand + ',' + arr[i].CarPattern,
              Name: arr[i].CarStyleName
            })
          }
        }
      }
    }
    state.carStyleGroup = JSON.parse(JSON.stringify(plateArr))
  },
  SET_COTLMAGE_TASKLIST(state, list) {
    for (let i = 0; i < list.length; i++) {
      state.cotlTaskNameList.push({
        value: list[i]._id,
        label: list[i].taskName
      })
    }
    state.cotlMageTaskList = list
  }
}
const actions = {
  getCotlMageTask({ state, commit }, param) { // 获取布控任务列表
    return new Promise((resolve, reject) => {
      getCotlMageTaskApi(param)
        .then(res => {
          commit('SET_COTLMAGE_TASKLIST', res.data.results)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  addCotlMageTask({ state, commit }, param) { // 添加布控任务
    return new Promise((resolve, reject) => {
      addCotlMageTaskApi(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  editCotlMageTask({ state, commit }, param) { // 修改布控任务
    return new Promise((resolve, reject) => {
      editCotlMageTaskApi(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  deleteCotlMageTask({ state, commit }, id) { // 删除布控任务
    return new Promise((resolve, reject) => {
      deleteCotlMageTaskApi(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }
}
export default {
  state,
  mutations,
  actions
}
