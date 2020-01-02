import {
  getOneFloorApi,
  getFloorStaticDataApi,
  removeFloorApi,
  editFloorInfoApi,
  saveFloorToBuildApi,
  getAllGridList,
  addGridInFloor,
  editGridInFloor,
  deleteGridInFloor,
  getGridByGridId
} from '../../../http/map3d'
const state = {
  floorData: null, // 单个楼层信息
  floorStaticData: {}, // 楼层统计
  gridLoc: '', // 保存绘制的网格位置坐标串----胡红勋----
  gridAllList: [], // 所有网格列表
  gridPagingList: [], // 网格分页列表
  editGridData: null, // 保存编辑的网格
  isEditGrid: false, // 判断当前网格是否在编辑，如正在编辑，在点位无法点选---
  editFeaturesList: [], // 编辑临时图层的要素列表
  addFloorFlag: false, // 是否正在添加楼层
  drawGridStyle: null, // 网格绘制样式
  polygonLoc: '' // 楼宇中线/面绘制的位置坐标串 --- anli
}
const getters = {}
const mutations = {
  // addFloorFlag
  SET_FLOOR_FLAG(state, data) {
    state.addFloorFlag = data
  },
  // 编辑临时图层的要素列表
  SET_EDIT_FEATURE_List(state, data) {
    state.editFeaturesList = data
  },
  // 设置网格位置----网格相关---开始----
  SET_EDIT_GRID_DATA(state, data) {
    state.editGridData = data
  },
  SET_IS_EDIT_GRID(state, flag) {
    state.isEditGrid = flag
  },
  SET_GRID_LOC(state, data) {
    state.gridLoc = data
  },
  SET_POLYGON_LOC(state, data) {
    state.polygonLoc = data
  },
  SET_GRID_ALL_LIST(state, val) {
    state.gridAllList = val
  },
  // 当前分页网格列表
  SET_GRID_PAGING_LIST(state, val) {
    state.gridPagingList = val
  },
  // 设置网格位置----网格相关---结束----
  // 单个楼层信息
  SET_FLOOR_DATA(state, data) {
    state.floorData = data
  },
  // 楼层统计
  SET_FLOOR_STATIC_DATA(state, data) {
    state.floorStaticData = data
  },
  // 设置网格绘制样式
  SET_DRAW_GRID_STYLE(state, data) {
    state.drawGridStyle = data
  }
}
const actions = {
  // SET_FLOOR_FLAG
  setFloorFlag({commit}, data) {
    commit('SET_FLOOR_FLAG', data)
  },
  setEditFeaturesList({ commit }, data) {
    commit('SET_EDIT_FEATURE_List', data)
  },
  setIsEditGrid({ commit }, data) {
    commit('SET_IS_EDIT_GRID', data)
  },
  setEditGridData({ commit }, data) {
    commit('SET_EDIT_GRID_DATA', data)
  },
  // 胡红勋---
  setGridLoc({ commit }, data) {
    commit('SET_GRID_LOC', data)
  },
  // 设置楼宇中线/面的位置坐标
  setPolygonLoc({ commit }, data) {
    commit('SET_POLYGON_LOC', data)
  },
  // SET_FLOOR_DATA
  setFloorData({ commit }, data) {
    commit('SET_FLOOR_DATA', data)
  },
  // 设置网格绘制样式
  setDrawGridStyle({ commit }, data) {
    commit('SET_DRAW_GRID_STYLE', data)
  },
  // 获取单个楼层信息
  getOneFloor({ commit, state }, id) {
    return new Promise((resolve, reject) => {
      getOneFloorApi(id)
        .then(res => {
          commit('SET_FLOOR_DATA', res.data)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取某一楼层的统计数据-----
  getFloorStaticData({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getFloorStaticDataApi(playod)
        .then(res => {
          resolve(res.data)
          commit('SET_FLOOR_STATIC_DATA', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 新增楼层信息
  saveFloorToBuild({ commit }, data) {
    return new Promise((resolve, reject) => {
      saveFloorToBuildApi(data)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改楼层信息
  editFloorInfo({ commit }, playod) {
    return new Promise((resolve, reject) => {
      editFloorInfoApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 删除楼层
  removeFloor({ commit }, id) {
    return new Promise((resolve, reject) => {
      removeFloorApi(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 网格相关----- 开始
  /* 获取所有网格列表 */
  getGridList({commit}, payload) {
    return new Promise((resolve, reject) => {
      getAllGridList(payload).then(res => {
        console.log(res)
        commit('SET_GRID_ALL_LIST', res.data)
        resolve(res.data)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  /* 获取分页网格数据 */
  getPageGridList({commit}, payload) {
    return new Promise((resolve, reject) => {
      getAllGridList(payload).then(res => {
        console.log(res)
        commit('SET_GRID_PAGING_LIST', res.data)
        resolve(res.data)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  },
  /* 新增网格 */
  addMap3DOneGrid({commit}, payload) {
    return new Promise((resolve, reject) => {
      addGridInFloor(payload).then(res => {
        console.log(res)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /* 修改楼层内网格 */
  editMap3DOneGrid({commit}, payload) {
    return new Promise((resolve, reject) => {
      editGridInFloor(payload).then(res => {
        console.log(res)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /* 删除楼层内网格 */
  deleteMap3DOneGrid({commit}, payload) {
    return new Promise((resolve, reject) => {
      deleteGridInFloor(payload).then(res => {
        console.log(res)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  /* 根据网格ID获取单个网格 */
  getMap3DOneGridById({commit}, id) {
    return new Promise((resolve, reject) => {
      getGridByGridId(id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
  // 网格相关----- 结束
}
export default {
  state,
  mutations,
  actions,
  getters
}
