import {
  getMap3DParamConfig,
  setMap3DParamConfig,
  saveLayerSettingsApi,
  updateLayerSettingsApi,
  getLayerSettingsApi,
  deleteLayerSettingsApi,
  getGroundLayerSettingsApi,
  getRealSingleListApi,
  addOneFlightApi,
  getAllFlightsApi,
  updateOneFlightApi,
  deleteOneFilghtApi
} from '../../../http/map3d'
import { getType } from 'assets/3DMap/utils/common'
import mapUtil from 'assets/3DMap/mapUtil'

const state = {
  // 应用模式属性---
  isClearDrawExtent: false,
  isShowAreaDailog: false, // 地图上绘制区域后是否显示对话框
  is3DMapOuter: true, // 判断是在3d地图还是在平面地图的标志---
  ready: false, // 地图是否加载完成的标志----胡红勋添加
  active3DDraw: false, // 控制3d绘制工具的激活
  active2DDraw: false, // 控制2d绘制工具的激活
  active2DEdit: false, // 控制2d编辑工具的激活
  active2DStringDraw: false, // 控制2d线绘制工具的激活---
  active2DGridDraw: false, // 控制2d网格绘制工具的激活---
  active3DPoleDraw: false, // 控制3D辅助杆绘制工具的激活---韩杰--2018-11-6 14:21:32
  area2DDrawActive: false, // 楼层平面图的区域绘制工具
  map3DConfig: null, // 3d地图下的地图配置属性
  active3DChangePositionDraw: false, // 控制3d绘制工具的激活以修改模型的位置
  mapConfigModal: false, // 3D地图配置框控制---高鹏添加
  mapConfigType: '', // outer 3D地图配置参数; inner 3D室内楼层参数配置
  map3DParam: null, // 3D地图配置参数
  mapMode: mapUtil.MAPMODE.point3D, // 地图模式-------胡红勋 ---2018-09-8
  rightPanelType: '',
  rightPanelShow: false,
  showBuildingAlarm: false, // 楼宇报警列表控制
  videoPreviewFlag: false,
  // 地图编辑下的点位显隐控制
  editResourcesTypeControl: {
    videoCheck: true,
    alarmCheck: true,
    alarmHelpCheck: true,
    patrolCheck: true,
    tipCheck: false
  },
  showTrackModal: false, // 是否显示轨迹查询弹出框---韩杰---2018-10-25
  showDrawTrack: false, // 是否显示绘制轨迹---韩杰---2018-10-25
  trackCoMap: null, // 轨迹坐标map(key: 坐标点信息，value：三维坐标)---韩杰---2018-11-2 14:06:33
  faceTrackCoMap: {}, // 人像轨迹信息
  showPopup: false, // 是否显示气泡弹出框---韩杰---2018-10-26 09:25:13
  selectedEntity: {}, // 选择的实体---韩杰---2018-10-26 09:25:13
  selectedEntityScreenCo: {}, // 选择实体的Cartesian2屏幕坐标---韩杰---2018-10-26 09:25:13
  viewSetting: false,
  layerSettingsMap: new Map(), // 图层设置map(key: 图层名称， value: 图层设置信息)
  realSingleMap3D: new Map(), // 实时单兵缓存(key: 单兵用户标识，value：单兵用户信息)
  selelctedSingle3D: null, // 选择的单兵
  realSingles3D: [], // 实时单兵数组
  singleRealTrackCoords3D: [], // 单兵实时轨迹坐标
  showSingleHeads3D: [], // 显示的单兵头像数组
  allFlights: [],
  videoLabelFeatures: [], // 视频label集合
  alarmLabelFeatures: [], // 普通报警label集合
  alarmHelpBoxLabelFeatures: [], // 报警求助箱label集合
  alarmHelpColumnLabelFeatures: [], // 报警求助柱label集合
  gridLabelFeatures: [], // 网格label集合
  patrolLabelFeatures: [], // 巡更label集合
  trackCoordinates3D: [] // 3D轨迹坐标数组
}
const mutations = {
  // viewSetting
  SET_VIEWSETTING(state, data) {
    state.viewSetting = data
  },
  // videoPreviewFlag
  SET_VIDEO_PREVIEW_FLAG(state, data) {
    state.videoPreviewFlag = data
  },
  // showBuildingAlarm
  SET_SHOW_BUILDING_ALARM(state, data) {
    state.showBuildingAlarm = data
  },
  SET_IS_CLEAR_DRAW_EXTENT(state, data) {
    state.isClearDrawExtent = data
  },
  SET_IS_SHOW_AREA_DIALOG(state, data) {
    state.isShowAreaDailog = data
  },
  SET_RIGHTPANEL_SHOW(state, data) {
    state.rightPanelShow = data
  },
  // 右侧面板控制
  SET_RIGHT_PANEL_TYPE(state, data) {
    state.rightPanelType = data
  },
  // 楼层外
  SET_ISOUTER(state, data) {
    state.is3DMapOuter = data
  },
  // 地图是否加载完成的标志----胡红勋添加
  SET_READY(state, data) {
    state.ready = data
  },
  // 是否激活3d绘制工具--
  SET_3D_ACTIVE_DRAW(state, flag) {
    state.active3DDraw = flag
  },
  SET_2D_AREA_ACTIVE_DRAW(state, flag) {
    state.area2DDrawActive = flag
  },
  // 是否激活2d绘制工具---
  SET_2D_ACTIVE_DRAW(state, flag) {
    state.active2DDraw = flag
  },
  // 是否激活2d编辑工具
  SET_2D_ACTIVE_EDIT(state, flag) {
    state.active2DEdit = flag
  },
  SET_2D_ACTIVE_STRING_DRAW(state, flag) {
    state.active2DStringDraw = flag
  },
  // 是否激活2d网格绘制工具 ---胡红勋
  SET_2D_ACTIVE_GRID_DRAW(state, flag) {
    state.active2DGridDraw = flag
  },
  // 保存3d地图的配置文件
  SET_3D_MAP_CONFIG(state, config) {
    state.map3DConfig = config
  },
  // 3D地图配置弹框控制
  SET_3D_EDIT_CONFIG_MODAL(state, flag) {
    state.mapConfigModal = flag
  },
  // 保存3D地图的配置参数
  SET_MAP_3D_PARAM(state, val) {
    state.map3DParam = val
  },
  // 是否激活改变3d模型的位置的绘制工具
  SET_3D_ACTIVE_CHANGE_POSITION_DRAW(state, flag) {
    state.active3DChangePositionDraw = flag
  },
  // 设置地图模式-胡红勋 2018 -09--08
  SET_MAP_MODE(state, mode) {
    state.mapMode = mode
  },
  // 设置地图编辑模式下点位资源类型控制-胡红勋
  SET_EDIT_RESOURCES_TYPE_CONTROL(state, obj) {
    state.editResourcesTypeControl = obj
  },
  // 设置是否显示轨迹查询弹出框---韩杰---2018-10-25
  SET_SHOW_TRACK_MODAL(state, flag) {
    state.showTrackModal = flag
  },
  // 设置是否显示绘制轨迹---韩杰---2018-10-25
  SET_SHOW_DRAW_TRACK(state, flag) {
    state.showDrawTrack = flag
  },
  // 设置是否显示气泡弹窗---韩杰---2018-10-26 09:26:11
  SET_SHOW_POPUP(state, flag) {
    state.showPopup = flag
  },
  // 设置选择的实体对象---韩杰---2018-10-26 09:26:11
  SET_SELECTED_ENTITY(state, obj) {
    state.selectedEntity = obj
  },
  // 设置选择的实体对象的屏幕坐标Cartesian2对象---韩杰---2018-10-26 09:26:11
  SET_SELECTED_ENTITY_SCREEN_CO(state, obj) {
    state.selectedEntityScreenCo = obj
  },
  // 设置轨迹坐标map(key: 坐标点信息，value：三维坐标)---韩杰---2018-11-2 14:12:16
  SET_TRACK_CO_MAP(state, map) {
    state.trackCoMap = map
  },
  SET_FACE_TRACK_CO_MAP(state, map) {
    state.faceTrackCoMap = map
  },
  // 设置激活3D辅助杆绘制工具---韩杰---2018年11月6日14:23:28
  SET_ACTIVE_3D_POLE_DRAW(state, flag) {
    state.active3DPoleDraw = flag
  },
  // 设置图层设置map
  SET_LAYER_SETTINGS_MAP(state, map) {
    let instanceType = getType(map) // 获取Map的类型
    if (!map || instanceType !== 'Map') {
      map = new Map()
    }
    state.layerSettingsMap = map
  },
  SET_REAL_SINGLE_MAP_3D(state, map) { // 设置实时单兵缓存
    let instanceType = getType(map) // 获取Map的类型
    if (!map || instanceType !== 'Map') {
      map = new Map()
    }
    state.realSingleMap3D = map
    state.realSingles3D = [...state.realSingleMap3D.values()]
  },
  // 更新实时单兵缓存
  UPDATE_REAL_SINGLE_3D(state, data) {
    let instanceType = getType(state.realSingleMap3D) // 获取Map的类型
    if (!state.realSingleMap3D || instanceType !== 'Map') {
      state.realSingleMap3D = new Map()
    }
    let { _id, point, photo } = data
    if (point && point.hasOwnProperty('lon') && point.hasOwnProperty('lat')) { // 判断是否有位置信息
      photo = photo || mapUtil.TDDEFAULTOPS.singleDefaultImg
      let param = { id: _id, geo: point, photo, isOpenTrack: false }
      let realSingle = state.realSingleMap3D.get(_id)
      if (realSingle) {
        param.isOpenTrack = realSingle.isOpenTrack
      }
      state.realSingleMap3D.set(param.id, param)
      state.realSingles3D = [...state.realSingleMap3D.values()]
    }
  },
  // 删除实时单兵缓存
  DELETE_REAL_SINGLE_3D(state, userId) {
    let instanceType = getType(state.realSingleMap3D) // 获取Map的类型
    if (!state.realSingleMap3D || instanceType !== 'Map') {
      state.realSingleMap3D = new Map()
    }
    if (state.realSingleMap3D.has(userId)) {
      state.realSingleMap3D.delete(userId)
      state.realSingles3D = [...state.realSingleMap3D.values()]
    }
  },
  // 设置显示的单兵头像
  SET_SHOW_SINGLE_HEADS_3D(state, arr) {
    let instanceType = getType(state.realSingleMap3D) // 获取Map的类型
    if (!state.realSingleMap3D || instanceType !== 'Map') {
      state.realSingleMap3D = new Map()
    }
    state.showSingleHeads3D = arr
    state.realSingles3D = [...state.realSingleMap3D.values()]
  },
  CHANGE_PRE_SINGLE_STATE(state, singleId) { // 改变之前选择的单兵状态
    let instanceType = getType(state.realSingleMap3D) // 获取Map的类型
    if (!state.realSingleMap3D || instanceType !== 'Map') {
      state.realSingleMap3D = new Map()
    }
    if (state.realSingleMap3D.has(singleId)) {
      let realSingle = state.realSingleMap3D.get(singleId)
      realSingle.isOpenTrack = false
      state.realSingleMap3D.set(realSingle.id, realSingle)
      state.realSingles3D = [...state.realSingleMap3D.values()]
    }
  },
  CHANGE_SINGLE_REAL_TRACK_STATE_3D(state, singleId) { // 修改单兵实时轨迹状态
    let instanceType = getType(state.realSingleMap3D) // 获取Map的类型
    if (!state.realSingleMap3D || instanceType !== 'Map') {
      state.realSingleMap3D = new Map()
    }
    if (state.realSingleMap3D.has(singleId)) {
      let realSingle = state.realSingleMap3D.get(singleId)
      realSingle.isOpenTrack = !realSingle.isOpenTrack
      state.realSingleMap3D.set(realSingle.id, realSingle)
      state.selelctedSingle3D = realSingle
      state.realSingles3D = [...state.realSingleMap3D.values()]
    }
  },
  SET_SINGLE_REAL_TRACK_COORDS_3D(state, arr) { // 设置单兵实时轨迹坐标
    state.singleRealTrackCoords3D = arr
  },
  PUSH_SINGLE_REAL_TRACK_COORDS_3D(state, coords) { // 添加实时单兵轨迹坐标
    state.singleRealTrackCoords3D.push(coords)
  },
  GET_ALL_FLIGHTS(state, data) {
    state.allFlights = data
  },
  SET_VIDEO_LABEL_FEATURES(state, features) {
    state.videoLabelFeatures = features
  },
  SET_ALARM_LABEL_FEATURES(state, features) {
    state.alarmLabelFeatures = features
  },
  SET_ALARM_HELP_BOX_LABEL_FEATURES(state, features) {
    state.alarmHelpBoxLabelFeatures = features
  },
  SET_ALARM_HELP_COLUMN_LABEL_FEATURES(state, features) {
    state.alarmHelpColumnLabelFeatures = features
  },
  SET_GRID_LABEL_FEATURES(state, features) {
    state.gridLabelFeatures = features
  },
  SET_PATROL_LABEL_FEATURES(state, features) {
    state.patrolLabelFeatures = features
  },
  SET_TRACK_COORDINATES_3D(state, arr) { // 设置3D轨迹坐标数组
    state.trackCoordinates3D = arr
  }
}
const actions = {
  // SET_VIEWSETTING
  setViewSetting: {
    root: true,
    handler({ commit }, data) {
      commit('SET_VIEWSETTING', data)
    }
  },
  set2DAreaDraw: {
    root: true,
    handler({ commit }, data) {
      commit('SET_2D_AREA_ACTIVE_DRAW', data)
    }
  },
  // SET_VIDEO_PREVIEW_FLAG
  setVideoPreviewFlag: {
    root: true,
    handler({ commit }, data) {
      commit('SET_VIDEO_PREVIEW_FLAG', data)
    }
  },
  // SET_SHOW_BUILDING_ALARM
  setShowBuildingAlarm: {
    root: true,
    handler({ commit }, data) {
      commit('SET_SHOW_BUILDING_ALARM', data)
    }
  },
  setClearDrawExtent: {
    root: true,
    handler({ commit }, data) {
      commit('SET_IS_CLEAR_DRAW_EXTENT', data)
    }
  },
  // 区域对话框显示---
  setAreaDialogShow: {
    root: true,
    handler({ commit }, data) {
      commit('SET_IS_SHOW_AREA_DIALOG', data)
    }
  },
  // SET_RIGHTPANEL_SHOW
  setRightPanelShow: {
    root: true,
    handler({ commit }, data) {
      commit('SET_RIGHTPANEL_SHOW', data)
    }
  },
  // 提交SET_RIGHT_PANEL_TYPE
  setRightPanelType: {
    root: true,
    handler({ commit }, data) {
      commit('SET_RIGHT_PANEL_TYPE', data)
    }
  },
  // 提交SET_ISOUTER 楼层内外
  setIsOuter: {
    root: true,
    handler({ commit }, data) {
      commit('SET_ISOUTER', data)
    }
  },
  // 提交SET_READY 3d地图加载完成标识

  setReady: {
    root: true,
    handler({ commit }, data) {
      commit('SET_READY', data)
    }
  },
  // 提交SET_ACTIVE_DRAW 绘制控件
  set3DActiveDraw: {
    root: true,
    handler({ commit }, data) {
      commit('SET_3D_ACTIVE_DRAW', data)
    }
  },
  set2DActiveDraw: {
    root: true,
    handler({ commit }, data) {
      commit('SET_2D_ACTIVE_DRAW', data)
    }
  },
  set2DActiveEdit: {
    root: true,
    handler({ commit }, data) {
      commit('SET_2D_ACTIVE_EDIT', data)
    }
  },
  // 绘制网格工具---
  set2DActiveGridDraw: {
    root: true,
    handler({ commit }, data) {
      commit('SET_2D_ACTIVE_GRID_DRAW', data)
    }
  },
  // 绘制画线工具--- set2DActiveStringDraw
  set2DActiveStringDraw: {
    root: true,
    handler({ commit }, data) {
      commit('SET_2D_ACTIVE_STRING_DRAW', data)
    }
  },
  set3DActiveChangePositionDraw: {
    root: true,
    handler({ commit }, data) {
      commit('SET_3D_ACTIVE_CHANGE_POSITION_DRAW', data)
    }
  },
  // 3d地图参数配置弹框控制
  set3DEditConfigModal: {

    root: true,
    handler({ commit }, data) {
      commit('SET_3D_EDIT_CONFIG_MODAL', data)
    }
  },
  set3DEditConfigType: {
    root: true,
    handler({ commit }, data) {
      commit('SET_3D_EDIT_CONFIG_TYPE', data)
    }
  },
  // 设置地图模式
  setMapMode: {
    root: true,
    handler({ commit }, data) {
      commit('SET_MAP_MODE', data)
    }
  },
  setEditResourceTypeControl: {
    root: true,
    handler({ commit }, data) {
      commit('SET_EDIT_RESOURCES_TYPE_CONTROL', data)
    }
  },
  // 设置是否显示轨迹查询弹出框---韩杰---2018-10-25
  setShowTrackModal: {
    root: true,
    handler({ commit }, flag) {
      commit('SET_SHOW_TRACK_MODAL', flag)
    }
  },
  // 设置是否显示绘制轨迹---韩杰---2018-10-25
  setShowDrawTrack: {
    root: true,
    handler({ commit }, flag) {
      commit('SET_SHOW_DRAW_TRACK', flag)
    }
  },
  // 设置是否显示气泡弹窗---韩杰---2018-10-26 09:26:11
  setShowPopup: {

    root: true,
    handler({ commit }, flag) {
      commit('SET_SHOW_POPUP', flag)
    }
  },
  // 设置选择的实体对象---韩杰---2018-10-26 09:26:11
  setSelectedEntity: {
    root: true,
    handler({ commit }, obj) {
      commit('SET_SELECTED_ENTITY', obj)
    }
  },
  // 设置选择的实体对象的屏幕坐标Cartesian2对象---韩杰---2018-10-26 09:26:11
  setSelectedEntityScreenCo: {
    root: true,
    handler({ commit }, obj) {
      commit('SET_SELECTED_ENTITY_SCREEN_CO', obj)
    }
  },
  // 设置轨迹坐标map(key: 坐标点信息，value：三维坐标)---韩杰---2018年11月2日14:10:45
  setTrackCoMap: {

    root: true,
    handler({ commit }, map) {
      commit('SET_TRACK_CO_MAP', map)
    }
  },
  setFaceTrackCoMap: {
    root: true,
    handler({ commit }, map) {
      commit('SET_FACE_TRACK_CO_MAP', map)
    }
  },
  // 获取3D地图配置参数
  getMap3DParamConfig: {
    root: true,
    handler({commit}) {
      return new Promise((resolve, reject) => {
        getMap3DParamConfig()
          .then(res => {
            console.log(res, '3DParam')
            if (res.data.dataSet) {
              commit('SET_3D_MAP_CONFIG', res.data)
            }
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  // 设置3D地图配置参数
  setMap3DParamConfig: {
    root: true,
    handler({commit}, payload) {
      return new Promise((resolve, reject) => {
        setMap3DParamConfig(payload)
          .then(res => {
            console.log(res)
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }

  },
  // 设置控制3D辅助杆绘制工具---韩杰---2018-11-6 14:25:17
  setActive3DPoleDraw: {
    root: true,
    handler({ commit }, flag) {
      commit('SET_ACTIVE_3D_POLE_DRAW', flag)
    }

  },
  // 添加图层设置信息
  saveLayerSettings: {
    root: true,
    handler({commit}, playod) {
      return new Promise((resolve, reject) => {
        saveLayerSettingsApi(playod)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }

  },
  // 根据标识删除图层设置信息
  deleteLayerSettingsById: {
    root: true,
    handler({commit}, playod) {
      return new Promise((resolve, reject) => {
        deleteLayerSettingsApi(playod)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }

  },
  // 根据标识更新图层设置信息
  updateLayerSettingsById: {
    root: true,
    handler({commit}, playod) {
      return new Promise((resolve, reject) => {
        updateLayerSettingsApi(playod)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }

  },
  // 获取图层设置信息列表
  getLayerSettingsList: {
    root: true,
    handler: function({ commit }) {
      return new Promise((resolve, reject) => {
        getLayerSettingsApi()
          .then(res => {
            let settingsArr = res.data
            let settingsMap = new Map()
            for (const settings of settingsArr) {
              settingsMap.set(settings.name, settings)
            }
            commit('SET_LAYER_SETTINGS_MAP', settingsMap)
            resolve(settingsArr)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },
  // 获取地面图层设置
  getGroundLayerSettings: {
    root: true,
    handler: function({ commit }) {
      return new Promise((resolve, reject) => {
        getGroundLayerSettingsApi()
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }

  },
  getRealSingleList3D: { // 获取实时单兵列表
    root: true,
    handler: function({ commit }, query) {
      return new Promise((resolve, reject) => {
        getRealSingleListApi(query).then(res => {
          let singleList = res.data
          let singleMap = new Map()
          for (const item of singleList) { // 遍历结果数据
            let { _id, geo, photo } = item
            if (geo && geo.hasOwnProperty('lon') && geo.hasOwnProperty('lat')) { // 判断是否有位置信息
	    geo.lon = Number(geo.lon)
              geo.lat = Number(geo.lat)
              geo.height = geo.height ? Number(geo.height) : 0
              photo = photo || mapUtil.TDDEFAULTOPS.singleDefaultImg
              let param = { id: _id, geo, photo, isOpenTrack: false }
              singleMap.set(param.id, param)
            }
          }
          // this.commit('SET_REAL_SINGLE_MAP_3D', singleMap)
          commit('SET_REAL_SINGLE_MAP_3D', singleMap)
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    }

  },
  // 新增飞行路线
  addOneFlight: {
    root: true,
    handler: function({ commit }, data) {
      return new Promise((resolve, reject) => {
        addOneFlightApi(data)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }

  },
  // 获取全部飞行路线
  getAllFlights: {
    root: true,
    handler: function({ commit }) {
      return new Promise((resolve, reject) => {
        getAllFlightsApi()
          .then(res => {
            resolve(res.data)
            commit('SET_BUILD_LIST', res.data, {root: true})
          })
          .catch(err => {
            reject(err)
          })
      })
    }

  },
  // 修改飞行路线
  updateOneFlight: {
    root: true,
    handler: function({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateOneFlightApi(data)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }

  },
  // 删除飞行路线
  deleteOneFilght: {
    root: true,
    handler: function({ commit }, data) {
      return new Promise((resolve, reject) => {
        deleteOneFilghtApi(data)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => {
            reject(err)
          })
      })
    }

  },
  // 更新实时单兵缓存
  updateRealSingle3D: {
    root: true,
    handler: function({ commit }, data) {
      commit('UPDATE_REAL_SINGLE_3D', data)
    }

  },
  // 删除实时单兵缓存
  deleteRealSingle3D: {
    root: true,
    handler: function({ commit }, userId) {
      commit('DELETE_REAL_SINGLE_3D', userId)
    }

  },
  // 设置显示的单兵头像
  setShowSingleHeads3D: {
    root: true,
    handler: function({ commit }, arr) {
      commit('SET_SHOW_SINGLE_HEADS_3D', arr)
    }

  },
  // 改变之前选择的单兵状态
  changePreSelectedState3D: {
    root: true,
    handler: function({ commit }, singleId) {
      commit('CHANGE_PRE_SINGLE_STATE', singleId)
    }

  },
  // 改变单兵实时轨迹显示状态
  changeSingleRealTrackState3D: {
    root: true,
    handler: function({ commit }, singleId) {
      commit('CHANGE_SINGLE_REAL_TRACK_STATE_3D', singleId)
    }

  },
  // 设置单兵实时轨迹坐标
  setSingleRealTrackCoords3D: {
    root: true,
    handler: function({ commit }, coords) {
      commit('SET_SINGLE_REAL_TRACK_COORDS_3D', coords)
    }

  },
  // 向单兵实时轨迹添加坐标
  pushSingleRealTrackCoords3D: {

    root: true,
    handler: function({ commit }, coords) {
      commit('PUSH_SINGLE_REAL_TRACK_COORDS_3D', coords)
    }
  },
  // 设置视频名称要素
  setVideoLabelFeatures({ commit }, features) {
    commit('SET_VIDEO_LABEL_FEATURES', features)
  },
  // 设置普通报警名称要素
  setAlarmLabelFeatures({ commit }, features) {
    commit('SET_ALARM_LABEL_FEATURES', features)
  },
  setAlarmHelpBoxLabelFeatures({ commit }, features) {
    commit('SET_ALARM_HELP_BOX_LABEL_FEATURES', features)
  },
  setAlarmHelpColmunLabelFeatures({ commit }, features) {
    commit('SET_ALARM_HELP_COLUMN_LABEL_FEATURES', features)
  },
  setGridLabelFeatures({ commit }, features) {
    commit('SET_GRID_LABEL_FEATURES', features)
  },
  setPatrolLabelFeatures({ commit }, features) {
    commit('SET_PATROL_LABEL_FEATURES', features)
  },
  setTrackCoordinates3D({ commit }, arr) { // 设置2D轨迹坐标数组
    commit('SET_TRACK_COORDINATES_3D', arr)
  }
}
const getters = {
  dbcdef(state) {
    // 是否显示名称标签
    return state.editResourcesTypeControl
  },
  // SET_VIDEO_LABEL_FEATURES
  videoLabels(state) {
    return state.videoLabelFeatures
  },
  alarmLabels(state) {
    return state.alarmLabelFeatures
  },
  alarmHelpBoxLabels(state) {
    return state.alarmHelpBoxLabelFeatures
  },
  alarmHelpColumnLabels(state) {
    return state.alarmHelpColumnLabelFeatures
  },
  gridLabels(state) {
    return state.gridLabelFeatures
  },
  patrolLabels(state) {
    return state.patrolLabelFeatures
  },
  trackCoordinates3D: state => { // 3D轨迹坐标数组
    return state.trackCoordinates3D
  }
}

export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true
}
