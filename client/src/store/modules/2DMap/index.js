/**
 * 2D地图控制相关状态
 */
import {
  loadMapConfigArrApi,
  getRealSingleListApi,
  querySingleTrackApi,
  setMapCenterApi,
  setMapServerListApi,
  updateMapServerListApi,
  deleteMapDataApi
} from '../../../http/map2d'
import { GEOMETRYTYPE, PROJ, DEFAULTOPS } from 'assets/2DMap/meta/common'
import { toMercator } from '@turf/projection'
import { point } from '@turf/helpers'
import { getType } from 'assets/2DMap/utils/common'
import pointModule from './point'
import areaModule from './area'
import AreaUtil from 'assets/2DMap/areaUtil'
import map2DApply from './map2DApplyInteractive'
import TransformCoord from 'assets/2DMap/utils/transformcoord'
const state = {
  isMapOuter: true, // 是否是楼外地图
  isBsMapReady: false, // 地图是否加载完成
  mapZoom: 0, // 地图缩放级别
  mapProjection: PROJ.EPSG4326, // 地图投影坐标系
  toolVisible: true, // 工具栏是否显示
  leftPanelShow: true, // 左侧控制面板是否显示
  activeMapConfig: {}, // 当前地图配置信息
  mapConfigArr: [], // 地图配置列表数组
  pointVideoList: [], // 四窗口播放信息列表
  activeModelId: '', // 当前要播放的视频Id
  selectedTreeNode: {}, // 选中的树节点
  loading: true,
  realSingleMap2D: new Map(), // 实时单兵缓存(key: 单兵用户标识，value：单兵用户信息)
  realSingles2D: [], // 实时单兵数组
  showSingleHeads2D: [], // 显示的单兵头像数组
  selelctedSingle2D: null, // 选择的单兵
  singleRealTrackCoords2D: [], // 单兵实时轨迹坐标
  // 地图编辑模式右侧页面
  mapEditRightPage: {
    page: '',
    detail: 'show'
  },
  // 地图编辑模式配置页面状态
  mapConfigMol: false,
  mapSettingMol: false,
  featureEditActive: false, // 要素编辑状态
  measureMode2D: {
    panelVisible: false, // 面板是否可见
    isMeasure: false, // 量算状态
    type: GEOMETRYTYPE.POLYLINE // 量算类型，默认是面
  },
  showTrackModal2D: false, // 是否显示轨迹查询弹出框---韩杰---2019-7-23 10:00:49
  showDrawTrack2D: false, // 是否显示绘制轨迹---韩杰---2019-7-23 10:00:49
  trackCoordinates2D: [] // 2D轨迹坐标数组
}
const getters = {
  isMapOuter: state => { // 获取当前地图是否是楼外地图
    return state.isMapOuter
  },
  isBsMapReady: state => { // 获取当前地图是否加载完成
    return state.isBsMapReady
  },
  mapZoom: state => { // 获取当前地图缩放级别
    return state.mapZoom
  },
  mapProjection: state => { // 地图参考坐标系
    return state.mapProjection
  },
  loading: state => { // 地图加载
    return state.loading
  },
  toolVisible: state => { // 获取工具栏是否显示
    return state.toolVisible
  },
  leftPanelShow: state => { // 获取左侧控制面板是否显示
    return state.leftPanelShow
  },
  activeMapConfig: state => { // 获取当前地图配置信息
    return state.activeMapConfig
  },
  mapConfigArr: state => { // 获取地图配置信息数组
    return state.mapConfigArr
  },
  selectedAttr: state => { // 获取选中的资源要素参数
    return state.selectedAttr
  },
  selectedTreeNode: state => { // 获取选中的树节点
    return state.selectedTreeNode
  },
  realSingleMap2D: state => { // 获取实时单兵缓存
    return state.realSingleMap2D
  },
  realSingles2D: state => { // 获取实时单兵数组
    return state.realSingles2D
  },
  showSingleHeads2D: state => { // 获取单兵头像数据
    return state.showSingleHeads2D
  },
  selelctedSingle2D: state => { // 选择的单兵信息
    return state.selelctedSingle2D
  },
  singleRealTrackCoords2D: state => { // 获取单兵实时轨迹坐标
    return state.singleRealTrackCoords2D
  },
  mapEditRightPage: state => { // 图编辑模式右侧页面
    return state.mapEditRightPage
  },
  featureEditActive: state => { // 获取要素编辑状态
    return state.featureEditActive
  },
  measureMode2D: state => { // 获取2D的量算
    return state.measureMode2D
  },
  isMeasurePanel2D: (state, getters) => { // 获取2D量算状态
    return getters.measureMode2D.panelVisible
  },
  showTrackModal2D: state => { // 是否显示轨迹查询弹出框
    return state.showTrackModal2D
  },
  showDrawTrack2D: state => { // 是否显示绘制轨迹
    return state.showDrawTrack2D
  },
  trackCoordinates2D: state => { // 2D轨迹坐标数组
    return state.trackCoordinates2D
  }
}
const mutations = {
  CHANGE_POINT_VIDEO_LIST(state, arr) {
    state.pointVideoList = arr
  },
  UPDATE_POINT_VIDEO_LIST(state, item) {
    let tag = -1
    for (let i = 0; i < state.pointVideoList.length; i++) {
      if (state.pointVideoList[i]._id === item._id) {
        tag++
      }
    }
    if (tag === -1) {
      state.pointVideoList.push(item)
    } else {
      if (item._id) { state.activeModelId = item._id }
    }
  },
  CLEAR_ACTIVEMODEL_ID() {
    state.activeModelId = ''
  },
  SET_IS_MAP_OUTER(state, flag) {
    state.pointVideoList = []
    state.isMapOuter = flag
  },
  // 地图编辑模式配置页面状态
  SET_MAP_CONFIG_MOL_STATE(state, data) {
    state.mapConfigMol = data
  },
  SET_MAP_SET_TING_STATE(state, data) {
    state.mapSettingMol = data
  },
  SET_IS__BS_MAP_READY(state, flag) {
    state.isBsMapReady = flag
  },
  SET_MAP_ZOOM(state, zoom) { // 设置地图缩放级别
    state.mapZoom = zoom
  },
  SET_MAP_PROJECTION(state, proj) { // 地图参考坐标系
    state.mapProjection = proj
  },
  // 地图编辑模式右侧页面
  SET_EDIT_RIGHT_PAGE_STATE(state, data) {
    if (data.detail === 'show') {
      areaModule.state.currentGrid = null
      areaModule.state.currentBuilding = null
      pointModule.state.selectedMapPointRes = null
      pointModule.state.videoEditSectorChecked = false
      areaModule.state.drawFeatureLoc = ''
      areaModule.state.drawFeatureStyle = null
      areaModule.state.areaDrawActive = false
      pointModule.state.pointDrawActive = false
      pointModule.state.lineDrawActive = false
      pointModule.state.featureEditActive = false
    }
    state.mapEditRightPage = data
  },
  SET_TOOL_VISIBLE(state, flag) {
    state.toolVisible = flag
  },
  SET_LEFT_PANEL_SHOW(state, flag) {
    state.leftPanelShow = flag
  },
  SET_MAP_CONFIG_ARR(state, arr) {
    state.mapConfigArr = arr
    if (arr && arr.length > 0) {
      if (!state.activeMapConfig || !state.activeMapConfig._id) {
        let mapConfig = arr[0]
        if (mapConfig.projection) {
          state.mapProjection = mapConfig.projection
        }
        state.activeMapConfig = mapConfig
      }
    }
  },
  SET_ACTIVE_MAP_CONFIG(state, flag) {
    state.activeMapConfig = flag
  },
  SET_LOADING(state, flag) {
    state.loading = flag
  },
  SET_SELECTED_ATTR(state, attr) {
    state.selectedAttr = attr
  },
  SET_SELECTED_TREE_NODE(state, node) { // 设置选中的树节点
    state.selectedTreeNode = node
  },
  HANDLE_GET_REAL_SINGLE_LIST_2D(state, singleList) {
    let instanceType = getType(state.realSingleMap2D) // 获取Map的类型
    if (!state.realSingleMap2D || instanceType !== 'Map') {
      state.realSingleMap2D = new Map()
    }
    let {groupId, singleIdList} = map2DApply.state.pointState.isSingle // 获取单兵分组标识和组内的单兵标识列表
    for (const item of singleList) { // 遍历结果数据
      let { _id, geo, photo, selectedColor } = item // 查询到的单兵为GPS坐标，需要进行坐标转换
      if (geo) {
        let coords = TransformCoord.wgs84togcj02(Number(geo.lon), Number(geo.lat))
        if (state.mapProjection !== PROJ.EPSG4326) {
          coords = toMercator(point(coords)).geometry.coordinates
        }
        geo.lon = coords[0]
        geo.lat = coords[1]
        photo = photo || DEFAULTOPS.singleHeadImg
        if (selectedColor) {
          // console.log('转换前的单兵轨迹颜色：', selectedColor)
          selectedColor = AreaUtil.transformColor(selectedColor, DEFAULTOPS.singleTrackOpcity) // 转换成带透明度的颜色，默认透明度为 0.5
          // console.log('转换后的单兵轨迹颜色：', selectedColor)
        }
        let showFlag = false // 单兵是否显示的标志
        if (groupId) { // 选择指定单兵机构时
          if (singleIdList.includes(_id)) { // 单兵在显示列表中时
            showFlag = true
          }
        } else { // 未指定单兵机构时
          showFlag = true
        }
        if (showFlag && geo && geo.hasOwnProperty('lon') && geo.hasOwnProperty('lat')) { // 判断是否有位置信息
          let param = state.realSingleMap2D.get(_id) // 从缓存中获取单兵数据
          if (param) { // 单兵已在缓存中时，初始化轨迹为关闭状态
            param.isOpenTrack = false
          } else {
            param = { id: _id, geo, photo, selectedColor, isOpenTrack: false }
          }
          state.realSingleMap2D.set(param.id, param)
        }
      }
    }
    state.realSingles2D = [ ...state.realSingleMap2D.values() ]
  },
  REFREASH_SINGLE_RELATED_SHOW_2D(state, param) {
    let {singleMap, singleList} = param
    let instanceType = getType(singleMap) // 获取Map的类型
    if (!singleMap || instanceType !== 'Map') {
      singleMap = new Map()
    }
    let {groupId, singleIdList} = map2DApply.state.pointState.isSingle // 获取单兵分组标识和组内的单兵标识列表
    for (const item of singleList) { // 遍历结果数据
      let { _id, geo, photo } = item
      if (geo) {
        photo = photo || DEFAULTOPS.singleHeadImg
        let showFlag = false // 单兵是否显示的标志
        if (groupId) { // 选择指定单兵机构时
          if (singleIdList.includes(_id)) { // 单兵在显示列表中时
            showFlag = true
          }
        } else { // 未指定单兵机构时
          showFlag = true
        }
        if (showFlag && geo && geo.hasOwnProperty('lon') && geo.hasOwnProperty('lat')) { // 判断是否有位置信息
          let param = singleMap.get(_id) // 从缓存中获取单兵数据
          if (param) { // 单兵已在缓存中时，初始化轨迹为关闭状态
            param.isOpenTrack = false
          } else { // 单兵未存在缓存中时
            param = { id: _id, geo, photo, isOpenTrack: false }
          }
          singleMap.set(param.id, param)
        }
      }
    }
    state.realSingleMap2D = singleMap
    state.realSingles2D = [ ...state.realSingleMap2D.values() ]
  },
  // 更新实时单兵缓存
  UPDATE_REAL_SINGLE_2D(state, data) {
    let instanceType = getType(state.realSingleMap2D) // 获取Map的类型
    if (!state.realSingleMap2D || instanceType !== 'Map') {
      state.realSingleMap2D = new Map()
    }
    let { _id, geo, photo, selectedColor } = data // 此处坐标已经过转换
    if (geo) {
      photo = photo || DEFAULTOPS.singleHeadImg
      if (selectedColor) {
        // console.log('转换前的单兵轨迹颜色：', selectedColor)
        selectedColor = AreaUtil.transformColor(selectedColor, DEFAULTOPS.singleTrackOpcity) // 转换成带透明度的颜色，默认透明度为 0.5
        // console.log('转换后的单兵轨迹颜色：', selectedColor)
      }
      // console.log('更新实时单兵缓存UPDATE_REAL_SINGLE_2D：', data)
      let {groupId, singleIdList} = map2DApply.state.pointState.isSingle // 获取单兵分组标识和组内的单兵标识列表
      let showFlag = false // 单兵是否显示的标志
      if (groupId) { // 选择指定单兵机构时
        if (singleIdList.includes(_id)) { // 单兵在显示列表中时
          showFlag = true
        }
      } else { // 未指定单兵机构时
        showFlag = true
      }
      if (showFlag && geo && geo.hasOwnProperty('lon') && geo.hasOwnProperty('lat')) { // 判断是否有位置信息
        let param = { id: _id, geo: geo, photo, selectedColor, isOpenTrack: false }
        let realSingle = state.realSingleMap2D.get(_id)
        if (realSingle) {
          param.isOpenTrack = realSingle.isOpenTrack
        }
        state.realSingleMap2D.set(param.id, param)
        state.realSingles2D = [ ...state.realSingleMap2D.values() ]
        // console.log('显示的实时单兵列表数据：', state.realSingles2D)
      }
    }
  },
  // 删除实时单兵缓存
  DELETE_REAL_SINGLE_2D(state, userId) {
    let instanceType = getType(state.realSingleMap2D) // 获取Map的类型
    if (!state.realSingleMap2D || instanceType !== 'Map') {
      state.realSingleMap2D = new Map()
    }
    if (state.realSingleMap2D.has(userId)) {
      state.realSingleMap2D.delete(userId)
      state.realSingles2D = [ ...state.realSingleMap2D.values() ]
    }
  },
  SET_REAL_SINGLE_MAP_2D(state, map) { // 设置实时单兵缓存
    let instanceType = getType(map) // 获取Map的类型
    if (!state.realSingleMap2D || instanceType !== 'Map') {
      map = new Map()
    }
    state.realSingleMap2D = map
    state.realSingles2D = [ ...state.realSingleMap2D.values() ]
  },
  SET_SHOW_SINGLE_HEADS_2D(state, arr) { // 设置显示的单兵头像
    state.showSingleHeads2D = arr
  },
  SET_SELECTED_SINGLE_2D(state, data) { // 设置选中的单兵数据
    state.selelctedSingle2D = data
  },
  CHANGE_SINGLE_REAL_TRACK_STATE_2D(state, singleId) { // 修改单兵实时轨迹状态
    let instanceType = getType(state.realSingleMap2D) // 获取Map的类型
    if (!state.realSingleMap2D || instanceType !== 'Map') {
      state.realSingleMap2D = new Map()
    }
    if (state.realSingleMap2D.has(singleId)) {
      let realSingle = state.realSingleMap2D.get(singleId)
      realSingle.isOpenTrack = !realSingle.isOpenTrack
      state.realSingleMap2D.set(realSingle.id, realSingle)
      state.selelctedSingle2D = realSingle
      state.realSingles2D = [ ...state.realSingleMap2D.values() ]
    }
  },
  CHANGE_PRE_SINGLE_STATE_2D(state, singleId) { // 改变之前选择的单兵状态
    let instanceType = getType(state.realSingleMap2D) // 获取Map的类型
    if (!state.realSingleMap2D || instanceType !== 'Map') {
      state.realSingleMap2D = new Map()
    }
    if (state.realSingleMap2D.has(singleId)) {
      let realSingle = state.realSingleMap2D.get(singleId)
      realSingle.isOpenTrack = false
      state.realSingleMap2D.set(realSingle.id, realSingle)
      state.realSingles2D = [ ...state.realSingleMap2D.values() ]
    }
  },
  SET_SINGLE_REAL_TRACK_COORDS_2D(state, arr) { // 设置单兵实时轨迹坐标
    state.singleRealTrackCoords2D = arr
  },
  PUSH_SINGLE_REAL_TRACK_COORDS_2D(state, coords) { // 添加实时单兵轨迹坐标
    state.singleRealTrackCoords2D.push(coords)
  },
  SET_FEATURE_EDIT_ACTIVE(state, flag) { // 设置要素编辑状态
    state.featureEditActive = flag
    areaModule.state.drawFeatureLoc = ''
    // pointModule.state.drawPointLoc = ''
  },
  SET_FEATURE_EDIT_ACTIVE_WITHOUT_CLEAR(state, flag) { // 设置要素编辑状态，不清除胡资质区域
    state.featureEditActive = flag
  },
  RESET_ALL_MAP_STATE_2D(state) { // 重置所以地图状态
    state.isMapOuter = true // 恢复楼外地图
    state.isBsMapReady = false // 恢复地图未加载完成
    state.mapZoom = 0 // 重置地图缩放级别
    state.toolVisible = true // 默认工具栏显示
    state.leftPanelShow = true // 默认左侧控制栏显示
    state.activeMapConfig = {} // 重置当前地图配置
    state.mapConfigArr = [] // 重置地图配置列表
    state.pointVideoList = [] // 重置地图配置列表
    state.selectedTreeNode = {} // 重置地图配置列表
    state.loading = true // 重置地图配置列表
    state.showSingleHeads2D = [] // 重置实时单兵头像
    state.selelctedSingle2D = null // 重置选择的单兵
    state.singleRealTrackCoords2D = [] // 重置单兵实时轨迹坐标
    state.showTrackModal2D = false
    state.showDrawTrack2D = false
    // 点位资源
    pointModule.state.boltipcResourceArr = [] // 枪机
    pointModule.state.boltipcFeatures = []
    pointModule.state.boltipcSectorFeatures = []
    pointModule.state.boltipcLabelFeatures = []
    pointModule.state.halfBallipcResourceArr = [] // 半球
    pointModule.state.halfBallipcFeatures = []
    pointModule.state.halfBallipcSectorFeatures = []
    pointModule.state.halfBallipcLabelFeatures = []
    pointModule.state.fastBallipcResourceArr = [] // 快球
    pointModule.state.fastBallipcFeatures = []
    pointModule.state.fastBallipcSectorFeatures = []
    pointModule.state.fastBallipcLabelFeatures = []
    pointModule.state.allViewipcResourceArr = [] // 全景球
    pointModule.state.allViewipcFeatures = []
    pointModule.state.allViewipcSectorFeatures = []
    pointModule.state.allViewipcLabelFeatures = []
    pointModule.state.redBoltipcResourceArr = [] // 红外枪机
    pointModule.state.redBoltipcFeatures = []
    pointModule.state.redBoltipcSectorFeatures = []
    pointModule.state.redBoltipcLabelFeatures = []
    pointModule.state.commonAlarmResourceArr = [] // 普通报警
    pointModule.state.commonAlarmFeatures = []
    pointModule.state.commonAlarmLabelFeatures = []
    pointModule.state.fireAlarmResourceArr = [] // 消防报警
    pointModule.state.fireAlarmFeatures = []
    pointModule.state.fireAlarmLabelFeatures = []
    // 报警柱
    // 报警箱
    pointModule.state.patrolResourceArr = [] // 巡更
    pointModule.state.patrolFeatures = []
    pointModule.state.patrolLabelFeatures = []
    pointModule.state.singleFeatures = [] // 单兵
  },
  SET_IS_MEASURE_PANEL_VISIVBLE_2D(state, flag) { // 设置2D量面板是否可见
    if (!flag) { // 隐藏时
      state.measureMode2D.isMeasure = false // 关闭量算状态
    }
    state.measureMode2D.panelVisible = flag
  },
  CHANGE_MEASURE_MODE_2D(state, type) { // 改变2D量算模式
    state.measureMode2D.type = type
    state.measureMode2D.isMeasure = true
  },
  CHANGE_MEASUR_ACTIVED_2D(state, flag) { // 改变2D量算状态
    state.measureMode2D.isMeasure = flag
  },
  CHANGE_SHOW_TRACK_MODAL_2D(state, flag) { // 改变是否显示轨迹查询弹出框状态
    state.showTrackModal2D = flag
  },
  CHANGE_SHOW_DRAW_TRACK_2D(state, flag) { // 改变是否绘制轨迹状态
    state.showDrawTrack2D = flag
  },
  SET_TRACK_COORDINATES_2D(state, arr) { // 设置2D轨迹坐标数组
    state.trackCoordinates2D = arr
  }
}
const actions = {
  setIsMapOuter({ commit }, flag) {
    commit('SET_IS_MAP_OUTER', flag)
  },
  setIsBSMapReady({ commit }, flag) {
    commit('SET_IS__BS_MAP_READY', flag)
  },
  setMapZoom({ commit }, zoom) {
    commit('SET_MAP_ZOOM', zoom)
  },
  setMapProjection({ commit }, proj) {
    commit('SET_MAP_PROJECTION', proj)
  },
  setToolVisible({ commit }, flag) {
    commit('SET_TOOL_VISIBLE', flag)
  },
  setLeftPanelShow({ commit }, flag) {
    commit('SET_LEFT_PANEL_SHOW', flag)
  },
  loadMapConfigArr({ commit }) {
    return new Promise((resolve, reject) => {
      loadMapConfigArrApi().then(res => {
        commit('SET_MAP_CONFIG_ARR', res.data)
        commit('SET_LOADING', false)
        resolve(res.data)
      }).catch(err => {
        commit('SET_LOADING', false)
        reject(err)
      })
    })
  },
  setSelectedAttr({ commit }, attr) {
    commit('SET_SELECTED_ATTR', attr)
  },
  setSelectedTreeNode({ commit }, node) {
    commit('SET_SELECTED_TREE_NODE', node)
  },
  updatePointVideoList({ commit }, node) {
    // console.log(node, '1111111111111111')
    commit('UPDATE_POINT_VIDEO_LIST', node)
  },
  setActiveMapConfig({ commit }, node) {
    commit('SET_ACTIVE_MAP_CONFIG', node)
  },
  // 更新实时单兵缓存
  updateRealSingle2D({ commit }, data) {
    commit('UPDATE_REAL_SINGLE_2D', data)
  },
  // 删除实时单兵缓存
  deleteRealSingle2D({ commit }, userId) {
    commit('DELETE_REAL_SINGLE_2D', userId)
  },
  // 设置显示的单兵头像
  setShowSingleHeads2D({ commit }, arr) {
    commit('SET_SHOW_SINGLE_HEADS_2D', arr)
  },
  // 改变之前选择的单兵状态
  changePreSelectedState2D({ commit }, singleId) {
    commit('CHANGE_PRE_SINGLE_STATE_2D', singleId)
  },
  // 改变单兵实时轨迹显示状态
  changeSingleRealTrackState2D({ commit }, singleId) {
    commit('CHANGE_SINGLE_REAL_TRACK_STATE_2D', singleId)
  },
  // 设置单兵实时轨迹坐标
  setSingleRealTrackCoords2D({ commit }, coords) {
    commit('SET_SINGLE_REAL_TRACK_COORDS_2D', coords)
  },
  // 向单兵实时轨迹添加坐标
  pushSingleRealTrackCoords2D({ commit }, coords) {
    commit('PUSH_SINGLE_REAL_TRACK_COORDS_2D', coords)
  },
  // 设置2D地图量算状态
  setMeasurePanelVisible2D({ commit }, flag) {
    commit('SET_IS_MEASURE_PANEL_VISIVBLE_2D', flag)
  },
  // 改变2D量算模式
  changeMeasureMode2D({ commit }, type) {
    commit('CHANGE_MEASURE_MODE_2D', type)
  },
  // 改变2D量算状态
  changeMeasureActived2D({ commit }, flag) {
    commit('CHANGE_MEASUR_ACTIVED_2D', flag)
  },
  // 设置选中的单兵数据
  setSelectedSingle2D({ commit }, data) {
    commit('SET_SELECTED_SINGLE_2D', data)
  },
  // 获取实时单兵列表
  getRealSingleList2D({ commit, state }, query) {
    return new Promise((resolve, reject) => {
      getRealSingleListApi(query).then(res => {
        let singleList = res.data
        this.commit('HANDLE_GET_REAL_SINGLE_LIST_2D', singleList)
        resolve(singleList)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 查询单兵轨迹
  querySingleTrack({ commit }, query) {
    return new Promise((resolve, reject) => {
      querySingleTrackApi(query).then(res => {
        let points = res.data
        let lineCoords = []
        for (const pointModule of points) {
          let coords = [Number(pointModule.lon), Number(pointModule.lat)]
          lineCoords.push(coords)
        }
        resolve(lineCoords)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 根据分组刷新单兵相关显示
  refreashSingleRelatedShow2D({ commit, state }) {
    let {groupId, singleIdList} = map2DApply.state.pointState.isSingle // 获取单兵分组标识和组内的单兵标识列表
    let singleMap = new Map() // 重新构造单兵缓存
    if (groupId) { // 选择单兵机构时
      if (state.selelctedSingle2D && !singleIdList.includes(state.selelctedSingle2D.id)) { // 选中开启轨迹的单兵不属于单兵机构时
        commit('SET_SELECTED_SINGLE_2D', null) // 清空选中开启轨迹的单兵
        commit('SET_SINGLE_REAL_TRACK_COORDS_2D', []) // 清空单兵实时轨迹
        commit('SET_SHOW_MAP_RESOURCE_ATTRIBUTES', false) // 关闭资源树属性面板
      }
      let showSingles = JSON.parse(JSON.stringify(state.realSingles2D))
      for (const showSingle of showSingles) {
        if (singleIdList.includes(showSingle.id)) {
          singleMap.set(showSingle.id, showSingle)
        }
      }
    }
    return new Promise((resolve, reject) => {
      getRealSingleListApi({ devStaus: 'online' }).then(res => {
        let singleList = res.data
        this.commit('REFREASH_SINGLE_RELATED_SHOW_2D', {singleMap, singleList})
        resolve(singleList)
      }).catch(err => {
        reject(err)
      })
    })
  },
  resetAllMapState2D({ commit }) {
    commit('RESET_ALL_MAP_STATE_2D')
  },
  // 设置中心点位置
  setMapCenterApi({ commit }, playod) {
    return new Promise((resolve, reject) => {
      setMapCenterApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 设置地图列表
  setMapServerListApi({ commit }, playod) {
    return new Promise((resolve, reject) => {
      setMapServerListApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 更新地图列表
  updateMapServerList({ commit }, playod) {
    return new Promise((resolve, reject) => {
      updateMapServerListApi(playod)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 清库
  deleteMapDataApi({ commit }, playod) {
    return new Promise((resolve, reject) => {
      deleteMapDataApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取地图列表
  get2DConfig({ commit }, url) {
    if (url.indexOf('geoserver') > 0 || url.indexOf('geowebcache') > 0) { // 验证地图数据时添加——hanjie——2019-7-1 17:16:05
      // geoserver地图服务
      return new Promise((resolve, reject) => {
        let xmlhttp = new window.XMLHttpRequest()
        xmlhttp.open('GET', url, true)
        xmlhttp.send(null)
        xmlhttp.onreadystatechange = function(res) {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            resolve(res.currentTarget.responseText)
          }
          // 胡红勋添加，请求超时的判断方法
          setTimeout(() => {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
              // resolve(res.currentTarget.responseText)
            } else {
              reject(new Error('请求超时，请核实该地图服务器是否开启'))
            }
          }, 5000)
        }
      })
    } else if (url.indexOf('iserver') > 0) {
      // iserver地图服务
      return new Promise((resolve, reject) => {
        let xmlhttp = new window.XMLHttpRequest()
        xmlhttp.open('GET', url, true)
        xmlhttp.send(null)
        xmlhttp.onreadystatechange = function(res) {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            resolve(res.currentTarget.responseText)
          }
          // 胡红勋添加，请求超时的判断方法
          setTimeout(() => {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
              // resolve(res.currentTarget.responseText)
            } else {
              reject(new Error('请求超时，请核实该地图服务器是否开启'))
            }
          }, 5000)
        }
      })
    } else {
      console.log('地图服务解析有误，请联系管理员')
    }
  },
  // 获取超图
  get2DIserverConfig({ commit }, url) {
    return new Promise((resolve, reject) => {
      let xmlhttp = new window.XMLHttpRequest()
      xmlhttp.open('GET', url, true)
      xmlhttp.send(null)
      xmlhttp.onreadystatechange = function(res) {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
          resolve(res.currentTarget.responseText)
        }
      }
    })
  },
  changeShowTrackModal2D({ commit }, flag) { // 改变是否显示轨迹查询弹出框状态
    commit('CHANGE_SHOW_TRACK_MODAL_2D', flag)
  },
  changeShowDrawTrack2D({ commit }, flag) { // 改变是否绘制轨迹状态
    commit('CHANGE_SHOW_DRAW_TRACK_2D', flag)
  },
  setTrackCoordinates2D({ commit }, arr) { // 设置2D轨迹坐标数组
    commit('SET_TRACK_COORDINATES_2D', arr)
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
