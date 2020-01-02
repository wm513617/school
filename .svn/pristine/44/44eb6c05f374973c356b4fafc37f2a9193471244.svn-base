/**
 * 2D地图网格、楼宇、楼层相关状态
 */
import { RESOURCETYPE } from 'assets/2DMap/meta/common.js'
import {
  loadGridsByMapIdApi,
  loadGridsByFloorIdApi,
  loadBuildingsByMapIdApi,
  getGridDataByIdApi,
  getGridPagingApi,
  getGridPagingByFloorIdApi,
  editOneGridApi,
  deleteOneGridApi,
  addOneGridApi,
  isGridNameApi,
  getBuildingDataByIdApi,
  getMapOrgTreeApi,
  getLevelApi,
  addOneLevelApi,
  editOneLevelApi,
  getBuildPagingApi,
  deleteOneBuildApi,
  addOneBuildApi,
  editOneBuildApi,
  isBuildNameApi,
  deleteOneLevelApi,
  getFoorByIdApi,
  getAddressbookApi,
  getPrincipalApi,
  searchAddressbookApi,
  addAddressbookGroupApi,
  addAddressbookOneApi,
  addAddressbookOneForPointApi,
  editAddressbookApi,
  collectAddressbookApi,
  collectAddressbookGroupApi,
  deleteAddressbookApi,
  sortAddressbookApi,
  deleteAddressbookNewGroupApi,
  editAddressbookNewGroupApi,
  getCollectAddressbookApi,
  setEditCollectSettingApi,
  getEditCollectSettingApi,
  searchCollectAddressbookApi
} from '../../../http/map2d'
import point from './point'
const state = {
  gridPagingList: [], // 获取分页网格数据
  gridPaging: {
    // 总条数
    count: 0,
    // 当前页
    cur: 0,
    // 页大小
    limit: 0,
    // 总页数
    pages: 0
  },
  levelList: [],
  // 楼宇分页列表
  buildPagingList: {},
  // 楼宇分页参数
  buildPaging: {
    // 总条数
    count: 0,
    // 当前页
    cur: 0,
    // 页大小
    limit: 0,
    // 总页数
    pages: 0
  },
  gridResourceArr: [], // 当前地图中的网格资源数据
  gridFeatures: [], // 当前地图中的网格要素
  gridLabelFeatures: [], // 当前地图中的网格名称要素
  buildingResourceArr: [], // 当前地图中的楼宇资源数据
  buildingFeatures: [], // 当前地图中的楼宇要素
  buildingLabelFeatures: [], // 当前地图中的楼宇名称要素
  currentGrid: null, // 当前的网格数据
  currentBuilding: null, // 当前的楼宇数据
  currentFloor: null, // 当前的楼层数据
  areaDrawActive: false, // 区域绘制是否激活
  drawFeatureStyle: null, // 绘制要素的样式
  drawFeatureLoc: '', // 绘制区域的位置
  locateAreaFeatures: [] // 区域定位要素
}
const getters = {
  gridResourceArr: state => { // 获取网格资源数据
    return state.gridResourceArr
  },
  gridFeatures: state => { // 获取网格要素
    return state.gridFeatures
  },
  gridLabelFeatures: state => { // 获取网格名称要素
    return state.gridLabelFeatures
  },
  buildingFeatures: state => { // 获取楼宇要素
    return state.buildingFeatures
  },
  buildingResourceArr: state => { // 获取楼宇资源数据
    return state.buildingResourceArr
  },
  buildingLabelFeatures: state => { // 获取楼宇名称要素
    return state.buildingLabelFeatures
  },
  currentGrid: state => { // 获取当前的网格数据
    return state.currentGrid
  },
  currentBuilding: state => { // 获取当前的楼宇数据
    return state.currentBuilding
  },
  currentFloor: state => { // 获取当前的楼层数据
    return state.currentFloor
  },
  areaDrawActive: state => { // 获取区域绘制激活状态
    return state.areaDrawActive
  },
  drawFeatureLoc: state => { // 绘制区域的位置
    return state.drawFeatureLoc
  },
  drawFeatureStyle: state => { // 绘制要素的样式
    return state.drawFeatureStyle
  },
  locateAreaFeatures: state => { // 区域定位桃酥
    return state.locateAreaFeatures
  }
}
const mutations = {
  SET_GRID_RESOURCE_ARR(state, arr) { // 设置网格资源数据
    state.gridResourceArr = arr
  },
  SET_GRID_FEATURES(state, features) { // 设置网格要素
    state.gridFeatures = features
  },
  SET_GRID_LABEL_FEATURES(state, features) { // 设置网格名称要素
    state.gridLabelFeatures = features
  },
  SET_BUILDING_RESOURCE_ARR(state, arr) { // 设置楼宇资源数据
    state.buildingResourceArr = arr
  },
  SET_BUILDING_FEATURES(state, features) { // 设置楼宇要素
    state.buildingFeatures = features
  },
  SET_BUILDING_LABEL_FEATURES(state, features) { // 设置楼宇名称要素
    state.buildingLabelFeatures = features
  },
  SET_CURRENT_GRID(state, data) { // 设置当前楼网格数据
    state.currentGrid = data
  },
  SET_CURRENT_BUILDING(state, data) { // 设置当前楼宇数据
    state.currentBuilding = data
  },
  SET_CURRENT_FLOOR(state, data) { // 设置当前楼层数据
    state.currentFloor = data
  },
  SET_AREA_DRAW_ACTIVE(state, flag) { // 设置区域绘制激活状态
    if (flag) {
      point.state.pointDrawActive = false
      point.state.lineDrawActive = false
    }
    state.areaDrawActive = flag
    state.drawFeatureLoc = ''
  },
  SET_AREA_DRAW_ACTIVE_WITHOUT_CLEAR(state, flag) { // 设置区域绘制激活状态
    if (flag) {
      point.state.pointDrawActive = false
      point.state.lineDrawActive = false
    }
    state.areaDrawActive = flag
  },
  SET_DRAW_FEATURE_LOC(state, data) { // 设置绘制区域的位置
    state.drawFeatureLoc = data
  },
  SET_DRAW_FEATURE_STYLE(state, data) { // 设置绘制要素的样式
    state.drawFeatureStyle = data
  },
  // 楼层列表
  SET_LEVEL_LIST(state, data) {
    state.levelList = data
  },
  // 获取楼宇分页
  SET_BUILDPADING_LIST(state, data) {
    state.buildPagingList = data.data
    // 总条数
    state.buildPaging.count = parseInt(data.headers['x-bsc-count'])
    // 当前页
    state.buildPaging.cur = parseInt(data.headers['x-bsc-cur'])
    // 页大小
    state.buildPaging.limit = parseInt(data.headers['x-bsc-limit'])
    // 总页数
    state.buildPaging.pages = parseInt(data.headers['x-bsc-pages'])
  },
  // 获取网格分页
  SET_GRID_PADING_LIST(state, data) {
    state.gridPagingList = data.data
    // 总条数
    state.gridPaging.count = parseInt(data.headers['x-bsc-count'])
    // 当前页
    state.gridPaging.cur = parseInt(data.headers['x-bsc-cur'])
    // 页大小
    state.gridPaging.limit = parseInt(data.headers['x-bsc-limit'])
    // 总页数
    state.gridPaging.pages = parseInt(data.headers['x-bsc-pages'])
  },
  SET_LOCATE_AREA_FEATURES(state, arr) { // 设置区域定位要素
    state.locateAreaFeatures = arr
  }
}
const actions = {
  loadGridsByMapId({ commit }, mapId) { // 根据地图标识加载网格数据
    return new Promise((resolve, reject) => {
      loadGridsByMapIdApi(mapId).then(res => {
        commit('SET_GRID_RESOURCE_ARR', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadGridsByFloorId({ commit }, floorId) { // 根据楼层标识加载网格数据
    return new Promise((resolve, reject) => {
      loadGridsByFloorIdApi(floorId).then(res => {
        commit('SET_GRID_RESOURCE_ARR', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getGridPagingApi({ commit }, payload) { // 获取分页网格
    return new Promise((resolve, reject) => {
      getGridPagingApi(payload).then(res => {
        commit('SET_GRID_PADING_LIST', res)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getGridPagingByFloorId({ commit }, payload) { // 根据楼层标识获取分页网格
    return new Promise((resolve, reject) => {
      getGridPagingByFloorIdApi(payload).then(res => {
        commit('SET_GRID_PADING_LIST', res)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  editOneGridApi({ commit }, payload) { // 编辑指定网格
    return new Promise((resolve, reject) => {
      editOneGridApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  deleteOneGridApi({ commit }, payload) { // 删除指定网格
    return new Promise((resolve, reject) => {
      deleteOneGridApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  addOneGridApi({ commit }, payload) { // 添加网格
    return new Promise((resolve, reject) => {
      addOneGridApi(payload).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  isGridNameApi({ commit }, payload) { // 校验网格名称
    return new Promise((resolve, reject) => {
      isGridNameApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadBuildingsByMapId({ commit }, mapId) { // 根据地图标识加载楼宇数据
    return new Promise((resolve, reject) => {
      loadBuildingsByMapIdApi(mapId).then(res => {
        commit('SET_BUILDING_RESOURCE_ARR', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getGridDataById({ commit, rootState }, id) { // 根据id获取网格数据
    return new Promise((resolve, reject) => {
      getGridDataByIdApi(id).then(res => {
        commit('SET_MAP_RESOURCE_ATTRIBUTES', { res: res, type: RESOURCETYPE.grid })
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getGridData({ commit, rootState }, id) { // 根据id获取网格数据
    return new Promise((resolve, reject) => {
      getGridDataByIdApi(id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getBuildingDataById({ commit, rootState }, id) { // 根据id获取楼宇数据
    return new Promise((resolve, reject) => {
      getBuildingDataByIdApi(id).then(res => {
        commit('SET_MAP_RESOURCE_ATTRIBUTES', { res: res, type: RESOURCETYPE.building })
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getBuildingData({ commit, rootState }, id) { // 根据id获取楼宇数据
    return new Promise((resolve, reject) => {
      getBuildingDataByIdApi(id).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  setGridFestures({ commit }, features) { // 设置网格要素
    commit('SET_GRID_FEATURES', features)
  },
  setGridLabelFestures({ commit }, features) { // 设置网格名称要素
    commit('SET_GRID_LABEL_FEATURES', features)
  },
  setBuildingFestures({ commit }, features) { // 设置建筑物要素
    commit('SET_BUILDING_FEATURES', features)
  },
  setBuildingLabelFestures({ commit }, features) { // 设置建筑物要素
    commit('SET_BUILDING_LABEL_FEATURES', features)
  },
  // 获取地图结构树
  getMapOrg({ commit }, id) {
    return new Promise((resolve, reject) => {
      getMapOrgTreeApi(id)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  setCurrentGrid({ commit }, data) { // 设置当前网格数据
    commit('SET_CURRENT_GRID', data)
  },
  setCurrentBuilding({ commit }, data) { // 设置当前楼宇数据
    commit('SET_CURRENT_BUILDING', data)
  },
  setCurrentFloor({ commit }, data) { // 设置当前楼层数据
    commit('SET_CURRENT_FLOOR', data)
  },
  // 根据id获取楼层数据
  getFoorById({ commit }, id) {
    return new Promise((resolve, reject) => {
      getFoorByIdApi(id)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 删除指定楼层
  deleteOneLevelApi({ commit }, id) {
    return new Promise((resolve, reject) => {
      deleteOneLevelApi(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 校验楼宇名称
  isBuildNameApi({ commit }, id) {
    return new Promise((resolve, reject) => {
      isBuildNameApi(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改指定网格
  editOneBuildApi({ commit }, id) {
    return new Promise((resolve, reject) => {
      editOneBuildApi(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 删除指定网格
  deleteOneBuildApi({ commit }, id) {
    return new Promise((resolve, reject) => {
      deleteOneBuildApi(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 删除指定网格
  addOneBuildApi({ commit }, id) {
    return new Promise((resolve, reject) => {
      addOneBuildApi(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取所有楼层列表
  getLevelApi({ commit }, id) {
    return new Promise((resolve, reject) => {
      getLevelApi(id)
        .then(res => {
          commit('SET_LEVEL_LIST', res.data)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 添加楼层
  addOneLevelApi({ commit }, id) {
    return new Promise((resolve, reject) => {
      addOneLevelApi(id)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改指定楼层
  editOneLevelApi({ commit }, id) {
    return new Promise((resolve, reject) => {
      editOneLevelApi(id)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取分页楼宇信息
  getBuildPagingApi({ commit }, id) {
    return new Promise((resolve, reject) => {
      getBuildPagingApi(id)
        .then(res => {
          commit('SET_BUILDPADING_LIST', res)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  clearAreaFeatures({ commit }) { // 清空区域要素
    commit('SET_CURRENT_FLOOR', null) // 当前楼层
    commit('SET_GRID_FEATURES', []) // 网格
    commit('SET_GRID_LABEL_FEATURES', [])
    commit('SET_BUILDING_FEATURES', []) // 楼宇
    commit('SET_BUILDING_LABEL_FEATURES', [])
    commit('SET_LOCATE_AREA_FEATURES', []) // 区域定位
  },
  setAreaDrawActive({ commit }, flag) {
    commit('SET_AREA_DRAW_ACTIVE', flag)
  },
  // 通讯录相关
  // 获取通讯录分组信息
  getAddressbook({ commit }, mapId) {
    return getAddressbookApi(mapId)
  },
  // 获取通讯录当前分组人员信息
  getPrincipal({ commit }, mapId) {
    return getPrincipalApi(mapId)
  },
  // 搜索通讯录联系人
  searchAddressbook({ commit }, keyword, mapId) {
    return searchAddressbookApi(keyword, mapId)
  },
  // 添加通讯录新分组
  addAddressbookGroup({ commit }, playod) {
    return addAddressbookGroupApi(playod)
  },
  // 添加通讯录人员信息
  addAddressbookOne({ commit }, playod) {
    return addAddressbookOneApi(playod)
  },
  addAddressbookOneForPoint({ commit }, playod) {
    return addAddressbookOneForPointApi(playod)
  },
  // 修改通讯录人员信息
  editAddressbook({ commit }, playod) {
    return editAddressbookApi(playod)
  },
  // 收藏通讯录人员
  collectAddressbook({ commit }, playod) {
    return collectAddressbookApi(playod)
  },
  // 收藏分组
  collectAddressbookGroup({ commit }, playod) {
    return collectAddressbookGroupApi(playod)
  },
  // 删除通讯录人员信息
  deleteAddressbook({ commit }, playod) {
    return deleteAddressbookApi(playod)
  },
  // 保存通讯录排序
  sortAddressbook({ commit }, body) {
    return sortAddressbookApi(body)
  },
  // 2d地图配置-新分组删除
  deleteAddressbookNewGroup({ commit }, id) {
    return deleteAddressbookNewGroupApi(id)
  },
  // 编辑新分组
  editAddressbookNewGroup({ commit }, id) {
    return editAddressbookNewGroupApi(id)
  },
  // 获取已收藏列表
  getCollectAddressbook({ commit }, id) {
    return getCollectAddressbookApi(id)
  },
  // 2d地图配置-修改同步收藏参数
  setEditCollectSetting({ commit }, playod) {
    return setEditCollectSettingApi(playod)
  },
  // 2d地图应用-获取同步收藏参数
  getEditCollectSetting({ commit }) {
    return getEditCollectSettingApi()
  },
  // 搜索已收藏列表
  searchCollectAddressbook({ commit }, playod) {
    return searchCollectAddressbookApi(playod)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
