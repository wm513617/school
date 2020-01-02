import {
  get
} from 'http/base'
import { getSocket } from 'src/socket/socket.js'
const state = {
  editVedioDraw: false, // 地图编辑模式绘制视频点位控件状态
  editAlarmDraw: false, // 地图编辑模式绘制报警点位控件状态
  editVedioDrawSymbol: null, // 地图编辑模式绘制控件样式
  isTriggerClickEvt: false, // 编辑模式节点的点击事件是否触发，默认false
  // 应用模式视频点位数组
  appVedioIpcList: [],
  appVedioSectorList: [],
  appVedioIpcInMapList: [],
  appVedioSectorInMapList: [],
  appCurrentVedio: null,
  // 楼层所有的视频资源
  floorVedioResourceList: [],
  // 应用模式视频点位socket推送结果
  appVedioIpcStatusList: [],
  // 地图编辑模式当前操作的报警点位对象
  editCurrentAlarm: null,
  addVedioInfo: null, // 点击切换校区时，添加视频点位所需参数
  // 地图当前的放大级别
  mapZoom: 2,
  // 编辑模式点位元素勾选项
  editCheckList: ['boltipc', 'redBoltipc', 'halfBallipc', 'fastBallipc', 'allViewipc'],
  // 应用模式点位元素勾选项
  appCheckList: ['boltipc', 'redBoltipc', 'halfBallipc', 'fastBallipc', 'allViewipc']
}
const getters = {}
const mutations = {
  // 点击切换校区时，添加视频点位所需参数
  SET_ADDVEDIO_INFO(state, data) {
    state.addVedioInfo = data
  },
  // 应用模式点位元素勾选项
  SET_APPCHECK_LIST(state, data) {
    state.appCheckList = data
  },
  // 编辑模式点位元素勾选项
  SET_EDITCHECK_LIST(state, data) {
    state.editCheckList = data
  },
  // 地图当前的放大级别
  SET_MAPZOOM_NUMBER(state, data) {
    state.mapZoom = data
  },
  // 地图编辑模式绘制视频点位控件状态
  SET_EDITVEDIODRAW_STATE(state, data) {
    state.editVedioDraw = data
  },
  // 地图编辑模式绘制报警点位控件状态
  SET_EDITALARDRAW_STATE(state, data) {
    state.editAlarmDraw = data
  },
  // 地图编辑模式绘制控件样式
  SET_EDITVEDIODRAWSYMBOL_STATE(state, data) {
    state.editVedioDrawSymbol = data
  },
  // 编辑模式节点的点击事件是否触发，默认false
  SET_ISTRIGGERCLICKEVT_STATE(state, data) {
    state.isTriggerClickEvt = data
  },
  SET_APPVEDIOIPC_LIST(state, data) {
    state.appVedioIpcList = data
  },
  SET_APPVEDIOSECTOR_LIST(state, data) {
    state.appVedioSectorList = data
  },
  SET_APPVEDIOIPCINMAP_LIST(state, data) {
    state.appVedioIpcInMapList = data
  },
  SET_APPVEDIOSECTORINMAP_LIST(state, data) {
    state.appVedioSectorInMapList = data
  },
  SET_APPCURRENT_VEDIO(state, data) {
    state.appCurrentVedio = data
  },
  // 楼层所有的视频点位
  GET_FLOORRVEDIOESOURCE_LIST(state, data) {
    state.floorVedioResourceList = data
  },
  // 应用模式视频点位socket推送结果
  SET_APPVEDIOIPCSTATUS_LIST(state, data) {
    state.appVedioIpcStatusList = data
  }
}
const actions = {
  // 监听视频设备是否在线
  listenDevOnline({
    commit
  }) {
    getSocket().on('server:devOnline', (data) => {
      console.log('视频点位接收状态')
      commit('SET_APPVEDIOIPCSTATUS_LIST', data)
    })
  },
  removeListenDevEvt() {
    getSocket().removeAllListeners('server:devOnline')
  },
  // 获取楼层所有资源
  getFloorResources({
    commit
  }, playod) {
    const param = {
      url: '/map/storey/' + playod + '/reses?channelTypes=0'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('GET_FLOORRVEDIOESOURCE_LIST', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
