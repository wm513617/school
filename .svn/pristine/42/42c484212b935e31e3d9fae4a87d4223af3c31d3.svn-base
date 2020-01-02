// 地图编辑 点位资源的 增删改查
import { loadSubVideosByMapIdApi, loadSubVideosByFloorIdApi, delOnePointApi, queryDefaultIconByOidApi, getCommonResourceByIdApi, saveCommonPointResApi, loadCommonAlarmsByMapIdApi, loadResourceByFloorIdApi, loadAlarmHostsByMapIdApi, loadFireAlarmsByMapIdApi, queryAlarmHelpResApi, loadPatrolsByMapIdApi, getPatrolDataByIdApi, loadPatrolByFloorIdApi, deletePatrolPointResApi, getSingleDataByIdApi} from 'http/map2d'
import { VIDEOTYPEKEY, CAMERATYPE, RESOURCETYPE } from 'assets/2DMap/meta/common'
const state = {
  // 视频点位资源数组
  boltipcfmResourceArr: [], // 枪机
  halfBallipcfmResourceArr: [], // 半球
  fastBallipcfmResourceArr: [], // 快球
  allViewipcfmResourceArr: [], // 全景
  redBoltipcfmResourceArr: [], // 红外枪机
  verfaceipcfmResourceArr: [], // 人脸抓拍
  trafficipcfmResourceArr: [], // 交通抓拍
  doorfmResourceArr: [], // 门禁
  commonAlarmfmResourceArr: [], // 普通报警
  fireAlarmfmResourceArr: [], // 消防报警
  alarmColumnfmResourceArr: [], // 报警柱
  alarmBoxfmResourceArr: [], // 报警箱
  patrolResourceArr: [], // 巡更
  defaultfmPointIcon: null, // 默认点位图标文件
  selectedFMapPointRes: {}, // 当前选中的资源点位
  fengMapResourceAttributes: { // 蜂鸟点位资源属性信息
    // 点位信息
    type: 'AttrVideo', // 枚举， 'AttrAlarm','AttrAlarmHelp','AttrBuilding', 'AttrModel', 'AttrPatrol', 'AttrSinglePawn', 'AttrVideo'
    position: {}, // 经纬度位置
    name: '',
    vendor: '',
    contacts: '',
    telContacts: 0,
    tempName: '',
    resourceId: ''
  },
  showFengMapResourceAttributesPanel: false, // 是否显示蜂鸟地图点位资源属性面板
  showFengMapResourceAttributesPanelSolids: false, // 是否显示悬浮蜂鸟地图点位资源属性面板
  deleteResource: { // 删除点位
    type: '',
    channelId: ''
  },
  updateFMEditIcon: [] // 更换图标[oid, icon]
}
const getters = {
  boltipcfmResourceArr: state => {
    return state.boltipcfmResourceArr
  },
  halfBallipcfmResourceArr: state => {
    return state.halfBallipcfmResourceArr
  },
  fastBallipcfmResourceArr: state => {
    return state.fastBallipcfmResourceArr
  },
  allViewipcfmResourceArr: state => {
    return state.allViewipcfmResourceArr
  },
  redBoltipcfmResourceArr: state => {
    return state.redBoltipcfmResourceArr
  },
  verfaceipcfmResourceArr: state => {
    return state.verfaceipcfmResourceArr
  },
  trafficipcfmResourceArr: state => {
    return state.trafficipcfmResourceArr
  },
  doorfmResourceArr: state => {
    return state.doorfmResourceArr
  },
  defaultfmPointIcon: state => {
    return state.defaultfmPointIcon
  },
  selectedFMapPointRes: state => { // 选中的点位信息
    return state.selectedFMapPointRes
  },
  getFengMapResourceAttributes: state => state.fengMapResourceAttributes, // 获取蜂鸟点位资源属性
  getShowFengMapResourceAttributesPanel: state => state.showFengMapResourceAttributesPanel, // 获取蜂鸟点位资源属性
  getShowFengMapResourceAttributesPanelSolids: state => state.showFengMapResourceAttributesPanelSolids, // 获取悬浮蜂鸟点位资源属性
  deleteResource: state => state.deleteResource,
  updateFMEditIcon: state => state.updateFMEditIcon,
  commonAlarmfmResourceArr: state => state.commonAlarmfmResourceArr,
  fireAlarmfmResourceArr: state => state.fireAlarmfmResourceArr,
  alarmColumnfmResourceArr: state => state.alarmColumnfmResourceArr,
  alarmBoxfmResourceArr: state => state.alarmBoxfmResourceArr,
  patrolResourceArr: state => state.patrolResourceArr
}
const mutations = {
  SET_SUB_VIDEOS_FMRESOURSE_ARR(state, param) { // 设置获取的视频资源
    let { query, data } = param
    let { monitoryPointGenera, monitortype } = query
    monitoryPointGenera = (typeof monitoryPointGenera === 'undefined') ? CAMERATYPE.normalipc : monitoryPointGenera
    if (Number(monitoryPointGenera) === CAMERATYPE.normalipc) { // 普通ipc
      switch (monitortype) {
        case VIDEOTYPEKEY.boltipc: // 枪机
          state.boltipcfmResourceArr = data
          break
        case VIDEOTYPEKEY.halfBallipc: // 半球
          state.halfBallipcfmResourceArr = data
          break
        case VIDEOTYPEKEY.fastBallipc: // 快球
          state.fastBallipcfmResourceArr = data
          break
        case VIDEOTYPEKEY.allViewipc: // 全景
          state.allViewipcfmResourceArr = data
          break
        case VIDEOTYPEKEY.redBoltipc: // 红外枪机
          state.redBoltipcfmResourceArr = data
          break
      }
    } else if (Number(monitoryPointGenera) === CAMERATYPE.verfaceipc) { // 人脸抓拍
      state.verfaceipcfmResourceArr = data
    } else if (Number(monitoryPointGenera) === CAMERATYPE.trafficipc) { // 交通抓拍
      state.trafficipcfmResourceArr = data
    }
  },
  SET_BOLTIPC_FMRESOURCE_ARR(state, arr) { // 设置枪机资源数组
    state.boltipcfmResourceArr = arr
  },
  SET_HALFBALLIPC_FMRESOURCE_ARR(state, arr) { // 设置半球资源数组
    state.halfBallipcfmResourceArr = arr
  },
  SET_FASTBALLIPC_FMRESOURCE_ARR(state, arr) { // 设置快球资源数组
    state.fastBallipcfmResourceArr = arr
  },
  SET_ALLVIEWIPC_FMRESOURCE_ARR(state, arr) { // 设置全景资源数组
    state.allViewipcfmResourceArr = arr
  },
  SET_REDBOLTIPC_FMRESOURCE_ARR(state, arr) { // 设置红外枪机资源数组
    state.redBoltipcfmResourceArr = arr
  },
  SET_VERFACEIPC_FMRESOURCE_ARR(state, arr) { // 设置人脸抓拍资源数组
    state.verfaceipcfmResourceArr = arr
  },
  SET_TRAFFICIPC_FMRESOURCE_ARR(state, arr) { // 设置交通抓拍资源数组
    state.trafficipcfmResourceArr = arr
  },
  SET_DOOR_FMRESOURCE_ARR(state, arr) { // 设置门禁资源数组
    state.doorfmResourceArr = arr
  },
  SET_DEFAULT_FMPOINT_ICON(state, data) { // 设置默认点位图标文件
    state.defaultfmPointIcon = data
  },
  SET_SELECTED_FMAP_POINT_RES(state, data) { // 设置选中的点位信息
    state.selectedFMapPointRes = data
  },
  SET_FENGMAP_PANEL_STATUS(state, status) { // 固定窗口状态
    state.showFengMapResourceAttributesPanel = status
  },
  SET_FENGMAP_PANEL_STATUS_SOLIDS(state, status) { // 悬浮窗口状态
    state.showFengMapResourceAttributesPanelSolids = status
  },
  SET_FENGMAP_RESOURCE_ATTRIBUTES(state, attr) {
    if (attr) {
      state.fengMapResourceAttributes = attr
    }
  },
  SET_DEL_MARKER_POINT(state, item) { // 设置要删除的点位信息
    state.deleteResource = item
  },
  UPDATE_FMEDIT_ICON(state, icon) {
    state.updateFMEditIcon = icon
  },
  SET_COMMON_ALARM_FMRESOURCE_ARR(state, arr) {
    state.commonAlarmfmResourceArr = arr
  },
  SET_FIRE_ALARM_RESOURCE_ARR(state, arr) { // 设置消防报警资源集合
    state.fireAlarmfmResourceArr = arr
  },
  SET_ALARM_COLUMN_RESOURCE_ARR(state, arr) { // 设置报警柱资源集合
    state.alarmColumnfmResourceArr = arr
  },
  SET_ALARM_BOX_RESOURCE_ARR(state, arr) { // 设置报警箱资源集合
    state.alarmBoxfmResourceArr = arr
  },
  SET_PATROL_RESOURCE_ARR(state, arr){ // 设置巡更资源数组
    state.patrolResourceArr = arr
  }
}

const actions = {
  setFengMapResourceAttributes({commit}, attr) {
    commit('SET_FENGMAP_RESOURCE_ATTRIBUTES', attr)
  },
  // 视频资源获取相关
  loadFMSubVideosByMapId({ commit }, query) { // 根据地图标识 获取视频资源
    return new Promise((resolve, reject) => {
      loadSubVideosByMapIdApi(query).then(res => {
        let param = { query, data: res.data }
        commit('SET_SUB_VIDEOS_FMRESOURSE_ARR', param)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadFMSubVideosByFloorId({ commit }, query) { // 根据楼层标识 获取视频资源
    return new Promise((resolve, reject) => {
      loadSubVideosByFloorIdApi(query).then(res => {
        let param = { query, data: res.data }
        commit('SET_SUB_VIDEOS_FMRESOURSE_ARR', param)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 根据资源id，获取资源详情信息
  // 视频、普通报警、报警主机、消防报警、报警柱、报警箱
  getfmResourceById({ commit }, pointId) {
    return new Promise((resolve, reject) => {
      getCommonResourceByIdApi(pointId).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 在地图上添加、修改资源点位
  // 视频、普通报警、报警主机、报警箱、报警柱、消防报警
  savefmResourcePoint({ commit }, playod) {
    return new Promise((resolve, reject) => {
      saveCommonPointResApi(playod).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  delOneFMPoint({ commit }, payload) { // 删除点位 (视频、报警求助、普通报警、消防报警、报警主机)
    return new Promise((resolve, reject) => {
      delOnePointApi(payload).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  queryDefaultfmIconByOid({ commit }, oid) { // 根据oid查询点位默认图标
    return new Promise((resolve, reject) => {
      queryDefaultIconByOidApi(oid).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  setBoltipcfmResourceArr({ commit }, arr) { // 枪机
    commit('SET_BOLTIPC_FMRESOURCE_ARR', arr)
  },
  setHalfBallipcfmResourceArr({ commit }, arr) { // 半球
    commit('SET_HALFBALLIPC_FMRESOURCE_ARR', arr)
  },
  setFastBallipcfmResourceArr({ commit }, arr) { // 快球
    commit('SET_FASTBALLIPC_FMRESOURCE_ARR', arr)
  },
  setAllViewipcfmResourceArr({ commit }, arr) { // 全景
    commit('SET_ALLVIEWIPC_FMRESOURCE_ARR', arr)
  },
  setRedBoltipcfmResourceArr({ commit }, arr) { // 红外枪机
    commit('SET_REDBOLTIPC_FMRESOURCE_ARR', arr)
  },
  setVerfaceipcfmResourceArr({ commit }, arr) { // 人脸抓拍
    commit('SET_VERFACEIPC_FMRESOURCE_ARR', arr)
  },
  setTrafficipcfmResourceArr({ commit }, arr) { // 交通抓拍
    commit('SET_TRAFFICIPC_FMRESOURCE_ARR', arr)
  },
  setDoorfmResourceArr({ commit }, arr) { // 门禁
    commit('SET_DOOR_FMRESOURCE_ARR', arr)
  },
  setCommonAlarmfmResourceArr({ commit }, arr) { // 门禁
    commit('SET_COMMON_ALARM_FMRESOURCE_ARR', arr)
  },
  setSelectedMapPointRes({ commit }, data) { // 当前选中的资源点位
    commit('SET_SELECTED_FMAP_POINT_RES', data)
  },
  clearPointFeatures({ commit }) { // 清空地图点位要素
    commit('SET_BOLTIPC_FMRESOURCE_ARR', [])
    commit('SET_HALFBALLIPC_FMRESOURCE_ARR', [])
    commit('SET_FASTBALLIPC_FMRESOURCE_ARR', [])
    commit('SET_ALLVIEWIPC_FMRESOURCE_ARR', [])
    commit('SET_REDBOLTIPC_FMRESOURCE_ARR', [])
    commit('SET_VERFACEIPC_FMRESOURCE_ARR', [])
    commit('SET_TRAFFICIPC_FMRESOURCE_ARR', [])
    commit('SET_DOOR_FMRESOURCE_ARR', [])
  },
  // 门禁资源相关
  getDoorfmPointResById({ commit, state }, resId) { // 根据资源id，获取资源详情信息
    return new Promise((resolve, reject) => {
      let dcTree = window.localStorage.getItem('dcTree')
      if (dcTree) {
        let target = null
        let treeData = JSON.parse(dcTree)
        if (treeData && treeData.length > 0) {
          let resArr = JSON.parse(JSON.stringify(treeData[0].children))
          for (let res of resArr) {
            if (res._id === resId) {
              target = res
              break
            }
          }
        }
        resolve(target)
      }
    })
  },
  loadfmDoorByMapId({ commit, state }, mapId) { // 根据地图标识加载门禁数据
    let dcTree = window.localStorage.getItem('dcTree')
    if (dcTree) {
      let treeData = JSON.parse(dcTree)
      if (treeData && treeData.length > 0) {
        let resourceArr = JSON.parse(JSON.stringify(treeData[0].children))
        resourceArr = resourceArr.filter(item => item.hasOwnProperty('point') && item.point.isouter)
        if (mapId) {
          resourceArr = resourceArr.filter(item => item.point.mapId === mapId)
        }
        commit('SET_DOOR_FMRESOURCE_ARR', resourceArr)
      }
    }
  },
  loadfmDoorByFloorId({ commit }, floorId) { // 根据楼层标识加载门禁数据
    let dcTree = window.localStorage.getItem('dcTree')
    if (dcTree) {
      let treeData = JSON.parse(dcTree)
      if (treeData && treeData.length > 0) {
        let resourceArr = JSON.parse(JSON.stringify(treeData[0].children))
        resourceArr = resourceArr.filter(item => item.hasOwnProperty('point') && !item.point.isouter)
        if (floorId) {
          resourceArr = resourceArr.filter(item => item.point.sid === floorId)
        }
        commit('SET_DOOR_FMRESOURCE_ARR', resourceArr)
      }
    }
  },
  addDoorfmPointRes({ commit, state }, data) { // 在地图上添加门禁资源数据
    return new Promise((resolve, reject) => {
      let dcTree = window.localStorage.getItem('dcTree')
      if (dcTree) {
        let treeData = JSON.parse(dcTree)
        if (treeData && treeData.length > 0) {
          let resArr = JSON.parse(JSON.stringify(treeData[0].children))
          let target = null
          for (let index = 0; index < resArr.length; index++) {
            if (data._id === resArr[index]._id) {
              resArr.splice(index, 1)
              resArr.splice(index, 0, data)
              target = data
              break
            }
          }
          treeData[0].children = resArr
          window.localStorage.setItem('dcTree', JSON.stringify(treeData))
          resolve(target)
        }
      }
    })
  },
  deletefmDoorPointRes({ commit, state }, resId) { // 删除门禁点位资源数据
    return new Promise((resolve, reject) => {
      let dcTree = window.localStorage.getItem('dcTree')
      if (dcTree) {
        let treeData = JSON.parse(dcTree)
        if (treeData && treeData.length > 0) {
          let resArr = JSON.parse(JSON.stringify(treeData[0].children))
          let target = null
          for (let res of resArr) {
            if (res._id === resId) {
              delete res.point
              target = res
              break
            }
          }
          treeData[0].children = resArr
          window.localStorage.setItem('dcTree', JSON.stringify(treeData))
          resolve(target)
        }
      }
    })
  },
  updatefmDoorPointRes({ commit, state }, data) { // 更新门禁点位资源数据
    return new Promise((resolve, reject) => {
      let dcTree = window.localStorage.getItem('dcTree')
      if (dcTree) {
        let treeData = JSON.parse(dcTree)
        if (treeData && treeData.length > 0) {
          let resArr = JSON.parse(JSON.stringify(treeData[0].children))
          let target = null
          for (let index = 0; index < resArr.length; index++) {
            if (data._id === resArr[index]._id) {
              resArr.splice(index, 1)
              resArr.splice(index, 0, data)
              target = data
              break
            }
          }
          treeData[0].children = resArr
          window.localStorage.setItem('dcTree', JSON.stringify(treeData))
          resolve(target)
        }
      }
    })
  },
  // 普通报警资源相关
  loadFMCommonAlarmByMapId({ commit }, id) { // 根据地图标识加载普通报警资源
    return new Promise((resolve, reject) => {
      loadCommonAlarmsByMapIdApi(id).then(res => {
        commit('SET_COMMON_ALARM_FMRESOURCE_ARR', res.data) // 设置普通报警资源数据
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 根据楼层标识加载普通报警、消防报警、报警主机
  loadfmAlarmResourceByFloorId({ commit }, query) {
    return new Promise((resolve, reject) => {
      loadResourceByFloorIdApi(query).then(res => {
        switch (query.channelTypes) {
          case RESOURCETYPE.video: // 视频
            break
          case RESOURCETYPE.commonAlarm: // 普通报警
            commit('SET_COMMON_ALARM_FMRESOURCE_ARR', res.data)
            break
          case RESOURCETYPE.fireAlarm: // 消防报警
            commit('SET_FIRE_ALARM_RESOURCE_ARR', res.data)
            break
          case RESOURCETYPE.alarmHost: // 报警主机
            // commit('SET_ALARM_HOST_RESOURCE_ARR', res.data)
            break
        }
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadfmAlarmHostByMapId({ commit }, mapId) { // 根据地图标识加载报警主机
    return new Promise((resolve, reject) => {
      loadAlarmHostsByMapIdApi(mapId).then(res => {
        // commit('SET_ALARM_HOST_RESOURCE_ARR', res.data) // 设置报警主机资源数据
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadfmFireAlarmByMapId({ commit }, mapId) { // 根据地图标识加载消防报警
    return new Promise((resolve, reject) => {
      loadFireAlarmsByMapIdApi(mapId).then(res => {
        commit('SET_FIRE_ALARM_RESOURCE_ARR', res.data) // 设置消防报警资源数据
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 根据地图标识加载报警求助资源
  loadfmAlarmHelpRes({ commit }, query) {
    return new Promise((resolve, reject) => {
      queryAlarmHelpResApi(query).then(res => {
        switch (query.alarm) {
          case RESOURCETYPE.alarmColumn: // 报警柱
            commit('SET_ALARM_COLUMN_RESOURCE_ARR', res.data)
            break
          case RESOURCETYPE.alarmBox: // 报警箱
            commit('SET_ALARM_BOX_RESOURCE_ARR', res.data)
            break
        }
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 巡更点位相关
  loadfmPatrolByMapId({ commit }, mapId) { // 根据地图标识加载巡更数据
    return new Promise((resolve, reject) => {
      loadPatrolsByMapIdApi(mapId).then(res => {
        commit('SET_PATROL_RESOURCE_ARR', res.data.grid) // 设置巡更资源数组
        resolve(res.data.grid)
      }).catch(err => {
        reject(err)
      })
    })
  },
  loadfmPatrolByFloorId({ commit }, floorId) { // 根据楼层标识加载巡更数据
    return new Promise((resolve, reject) => {
      loadPatrolByFloorIdApi(floorId).then(res => {
        commit('SET_PATROL_RESOURCE_ARR', res.data) // 设置巡更资源数组
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getfmPatrolResById({ commit }, pointId) { // 根据id获取资源详情
    return new Promise((resolve, reject) => {
      getPatrolDataByIdApi(pointId).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  deletefmPatrolRes({ commit }, playod) { // 删除巡更点位资源数据
    return new Promise((resolve, reject) => {
      deletePatrolPointResApi(playod).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getfmSingleResById({ commit }, pointId) { // 根据id加载单兵数据
    return new Promise((resolve, reject) => {
      getSingleDataByIdApi(pointId).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
