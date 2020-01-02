import editFMtree from './editFMtree'
import point from './point'
import fmEditControl from './fmEditControl'
import { GEOMETRYTYPE } from 'assets/2DMap/meta/common'
const state = {
  ...editFMtree.state,
  ...point.state,
  ...fmEditControl.state,
  activeFMap: '',
  fmapID: 'zgrmdx', // 地图ID
  fmapLoadComplete: false,
  fmapMarkerHeight: 0,
  isfmOuter: true, // 地图是否在楼外
  boxChooseSecPanelStatus: false, // 框选类型面板
  measureMode: { // 测量模式
    panelVisible: false, // 面板是否可见
    isMeasure: false, // 量算状态
    type: GEOMETRYTYPE.POLYLINE // 量算类型，默认是线
  },
  fmapShowDrawTrack: false, // 是否显示轨迹
  fmapShowTrackModal: false // 是否显示轨迹查询弹出框
}
const getters = {
  ...editFMtree.getters,
  ...point.getters,
  ...fmEditControl.getters,
  boxChooseSecPanelStatus(state) {
    return state.boxChooseSecPanelStatus
  },
  isfmOuter(state) {
    return state.isfmOuter
  },
  fmapShowDrawTrack(state) {
    return state.fmapShowDrawTrack
  },
  fmapShowTrackModal(state) {
    return state.fmapShowTrackModal
  },
  measureMode: state => { // 获取量算模式
    return state.measureMode
  },
  showMeasurePanel: (state, getters) => { // 是否显示量算面板的标志
    return getters.measureMode.panelVisible
  }
}
const mutations = {
  ...editFMtree.mutations,
  ...point.mutations,
  ...fmEditControl.mutations,
  SET_ACTIVE_FMAP(state, v) {
    state.activeFMap = v
  },
  SET_FM_OUTER(state, v) {
    state.isfmOuter = v
  },
  SET_FMAP_ID(state, v) {
    state.fmapID = v
  },
  SET_LOAD_STATUS(state, v) {
    state.fmapLoadComplete = v
  },
  SET_BOX_SEC_PANEL_STATUS(state, flag) {
    state.boxChooseSecPanelStatus = flag
  },
  SET_FMAP_SHOW_DRAW_TRACK(state, flag) {
    state.fmapShowDrawTrack = flag
  },
  SET_FMAP_SHOW_TRACK_MODAL(state, flag) {
    state.fmapShowTrackModal = flag
  },
  SET_IS_MEASURE_PANEL_VISIVBLE(state, flag) { // 设置2D量面板是否可见
    if (!flag) { // 隐藏时
      state.measureMode.isMeasure = false // 关闭量算状态
    }
    state.measureMode.panelVisible = flag
  },
  CHANGE_MEASURE_TYPE(state, type) { // 改变量算类型
    state.measureMode.type = type
    state.measureMode.isMeasure = true
  },
  CHANGE_MEASUR_ACTIVED(state, flag) { // 改变量算状态
    state.measureMode.isMeasure = flag
  }
}

const actions = {
  ...editFMtree.actions,
  ...point.actions,
  ...fmEditControl.actions,
  // 设置地图量算面板是否显示
  setMeasurePanelVisible({ commit }, flag) {
    commit('SET_IS_MEASURE_PANEL_VISIVBLE', flag)
  },
  // 改变量算类型
  changeMeasureType({ commit }, type) {
    commit('CHANGE_MEASURE_TYPE', type)
  },
  // 改变量算状态
  changeMeasureActived({ commit }, flag) {
    commit('CHANGE_MEASUR_ACTIVED', flag)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
