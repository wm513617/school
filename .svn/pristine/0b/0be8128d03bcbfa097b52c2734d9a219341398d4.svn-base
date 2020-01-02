const state = {
  // 地图编辑模式右侧页面
  mapEditRightPage: {
    page: 'patrolEditPage',
    detail: 'show'
  },
  // 地图应用模式左侧页面
  mapAppLeftPage: '',
  // 地图编辑模式配置页面状态
  mapConfigMol: false,
  mapSettingMol: false, // 胡红勋
  // 地图编辑控件
  modifyActive: false,
  // 编辑模式的网格绘制是否触发，默认false
  isOpenAlarm: false, // 应用模式报警是否开启
  isDrawGrid: false,
  // 统计是否触发
  isStatic: false,
  // 测距是否触发
  isMeasure: false, // 测距图层是否显示
  // 应用模式右侧页面
  appPageRight: 'mapInfo',
  appPatrolDtailScan: false // 巡更列表中消息查看按钮的状态
}
const getters = {}
const mutations = {
  // 巡更列表中消息查看按钮的状态
  SET_PATROLLISTDETAIL_SCAN(state, data) {
    state.appPatrolDtailScan = data
  },
  // 应用模式报警是否开启
  SET_ISOPEN_ALARM(state, data) {
    state.isOpenAlarm = data
  },
  // 地图编辑模式右侧页面
  SET_EDITRIGHTPAGE_STATE(state, data) {
    state.mapEditRightPage = data
  },
  // 胡红勋添加
  SET_MAPSETTING_STATE(state, data) {
    state.mapSettingMol = data
  },
  // 地图应用模式右侧页面
  SET_APPLEFTPAGE_STATE(state, data) {
    state.mapAppLeftPage = data
  },
  // 地图编辑模式配置页面状态
  SET_MAPCONFIGMOL_STATE(state, data) {
    state.mapConfigMol = data
  },
  // 地图编辑控件
  SET_MODIFYACTIVE_STATE(state, data) {
    state.modifyActive = data
  },
  // 触发网格绘制
  SET_GRID_ADD(state, data) {
    state.isDrawGrid = data
  },
  // 触发统计
  SET_MAPSTATIC_STATE(state, data) {
    state.isStatic = data
  },
  // 测距图层是否显示
  SET_MAPMEASURE_STATE(state, data) {
    state.isMeasure = data
  },
  // 设置应用模式右侧页面
  SET_MAPAPPRIGHT_PAGE(state, data) {
    state.appPageRight = data
  }
}

const actions = {
  // SET_MODIFYACTIVE_STATE
  setModifyActiveState({ commit }, data) {
    commit('SET_MODIFYACTIVE_STATE', data)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
