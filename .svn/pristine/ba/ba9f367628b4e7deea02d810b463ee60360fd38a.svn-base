import {
  getPatrolOrgTreeApi,
  getAlarmResourceOrgTreeApi,
  getVedioResourceOrgTreeApi,
  getAlarmHelpOrgTreeApi,
  getPatrolPointApi,
  getMapOrgTreeApi,
  getResourceByIdApi,
  getAllPatrolPointApi,
  getResourcePointsByChannelTypeApi,
  getResourcePointsByFloorIdAndChannelTypeApi,
  saveOrUpdateAlarmHelpPointApi,
  saveOrUpdateVedioPointApi,
  saveOrUPdatePatrolPointApi,
  get3DSelectBoxDataApi,
  deletePatrolPointByIdApi,
  deleteResourceById,
  checkBuildNameIsRepeatApi,
  getOneFloorPatrolsApi,
  saveOrUPdateAlarmPointApi,
  getPointModelListApi,
  saveAssistHoleApi,
  deleteAssistHoleApi,
  updateAssistHoleApi,
  getAssistHoleApi,
  getHistoryPatrolPositionApi,
  getModelSettingParamsApi, // 获取模型设置参数
  queryDefaultIconByOidApi
} from '../../../http/map3d'
import mapUtils from 'assets/3DMap/mapUtil.js'
// import { cpus } from 'os'
const state = {
  mapResource: {}, // 获取地图通道资源---胡红勋--2018-09-06
  alarmFeatureList: [], // 报警要素列表-----
  alarmingFeatureList: [], // 报警闪烁图层要素数组
  patrolFeatureList: [], // 巡更要素列表
  highLightFeatureList: [], // 高亮定位要素
  highLightLabelList: null,
  alarmBoxFeatureList: [], // 报警箱要素列表  胡红勋--2018-09-06
  alarmColumnFeatureList: [], // 报警箱要素列表  胡红勋--2018-09-06
  alarmHelpFeatureList: [],
  fireAlarmFeatureList: [], // 消防报警要素列表
  videoFeatureList: [], //  图层要素数组
  polygonFeatureList: [], // 区域要素列表---
  gridFeatureList: [], // 网格要素列表---
  gridLabelFeatureList: [], // 网格名称数据
  treeNodeType: null, // 单击资源树节点，保存节点的类型
  videoTreeData: [], // 视频点位树数据----
  alarmTreeData: [], // 报警点位树数据-----
  partrolTreeData: [], // 巡更点位树数据----
  buildIngAlarmObj: {}, // 楼宇汇聚闪烁对象
  selectBoxVideoData: [], // 选取区域镜头信息
  selectBoxSingleData: [], // 选取区域单兵信息
  alarmHelpTreeData: [], // 报警求助点位树数据
  alarmingPointIdAndType: {}, // 底图上所有报警点位id及类型
  videoList: [], // 四弹框点位数组
  buildingArr: [], // 楼宇闪烁列表
  allAlarmEntities: [],
  floorAlarmPoints: {},
  previewPointList: [],
  isBoxChoosePreView: false,
  isBoxChooseClosed: false,
  singleModelParam: {},
  defaultPointIcon3D: null,
  activeModelId3D: '',
  drawFeature3DStyle: null, // 3D楼内绘制线及区域样式
  selectedPointRes: null // 当前选中的点的信息
}
const getters = {
  drawFeature3DStyle: state => {
    return state.drawFeature3DStyle
  }
}
const mutations = {
  // isBoxChooseClosed
  IS_BOX_CHOOSE_CLOSED(state, data) {
    state.isBoxChooseClosed = data
  },
  // isBoxChoosePreView
  IS_BOX_CHOOSE_PREVIEW(state, data) {
    state.isBoxChoosePreView = data
  },
  // previewPointList
  SET_PREVIEW_POINT_LIST(state, data) {
    state.previewPointList = data
  },
  // buildingArr
  SET_BUILDING_ARR(state, data) {
    state.buildingArr = data
  },
  // floorAlarmPoints
  SET_FLOORALARMPOINTS(state, data) {
    state.floorAlarmPoints = data
  },
  // allAlarmEntities
  SET_ALLALARM_ENTITIES(state, data) {
    state.allAlarmEntities = data
  },
  // 四弹框点位数组
  SET_VIDEO_LIST(state, data) {
    state.videoList = data
  },
  UPDATE_POINT_VIDEO_LIST_3D(state, item) {
    let tag = -1
    for (let i = 0; i < state.videoList.length; i++) {
      if (state.videoList[i]._id === item._id) {
        tag++
      }
    }
    if (tag === -1) {
      state.videoList.push(item)
    } else {
      if (item._id) { state.activeModelId3D = item._id }
    }
  },
  CLEAR_ACTIVEMODEL_ID_3D() {
    state.activeModelId3D = ''
  },
  // alarmingPointIdAndType
  SET_ALARMING_POINT_ID_AND_TYPE(state, data) {
    state.alarmingPointIdAndType = data
  },
  // 楼宇汇聚闪烁对象
  SET_BUILDING_ALARM_OBJ(state, data) {
    state.buildIngAlarmObj = data
  },
  SET_VEDIO_TREE_DATA(state, data) {
    state.videoTreeData = data
  },
  SET_ALARM_TREE_DATA(state, data) {
    state.alarmTreeData = data
  },
  SET_PATROL_TREE_DATA(state, data) {
    state.partrolTreeData = data
  },
  SET_ALARM_HELP_TREE_DATA(state, data) {
    state.alarmHelpTreeData = data
  },
  // 保存资源树节点类型-------胡红勋
  SET_TREE_NODE_TYPE(state, type) {
    state.treeNodeType = type
  },
  // 设置地图资源-------胡红勋--2018-09-06
  SET_MAP_RESOURCE(state, data) {
    state.mapResource = data
  },
  // 报警闪烁图层要素
  SET_ALARM_LIST(state, features) {
    state.alarmFeatureList = features
  },
  // 正在报警闪烁图层要素-----
  SET_ALARMING_LIST(state, features) {
    state.alarmingFeatureList = features
  },
  // 巡更feature
  SET_PATROL_LIST(state, features) {
    state.patrolFeatureList = features
  },
  // 楼层点位定位高亮标志
  SET_HIGHLIGHT_LIST(state, features) {
    state.highLightFeatureList = features
  },

  SET_HIGHLIGHT_LABEL_LIST(state, data) {
    state.highLightLabelList = data
  },
  // 设置报警箱-胡红勋
  SET_ALARM_BOX_List(state, data) {
    state.alarmBoxFeatureList = data
  },
  // 设置报警柱
  SET_ALARM_COLUMN_List(state, data) {
    state.alarmColumnFeatureList = data
  },
  SET_ALARM_Help_List(state, data) {
    state.alarmHelpFeatureList = data
  },
  // 消防报警----胡红勋-----
  SET_FIRE_ALARM_LIST(state, features) {
    state.fireAlarmFeatureList = features
  },
  // 楼层内视频点位要素
  SET_VEDIO_LIST(state, features) {
    state.videoFeatureList = features
  },
  // 楼层内网格要素
  SET_GRID_LIST(state, features) {
    state.gridFeatureList = features
  },
  SET_POLYGON_LIST(state, features) {
    state.polygonFeatureList = features
  },
  SET_GRID_LABEL_LIST(state, labelFeatures) {
    state.gridLabelFeatureList = labelFeatures
  },
  SET_CURRENT_GRID_3D(state, attr) {
    let id = attr._id
    let featureList = JSON.parse(JSON.stringify(state.gridFeatureList))
    for (let item of featureList) {
      if (item.attributes.id === id) {
        item.symbol.textStyle.label = '网格:' + attr.name
       // item.symbol.textStyle.fillColor = '#ffffff'
      }
    }
    state.gridFeatureList = featureList
  },
  SET_HIGHLIGHT_LABEL_TEXT(state, attr) {
    let id = attr._id
    let featureList = JSON.parse(JSON.stringify(state.highLightFeatureList))
    for (let item of featureList) {
      if (item.attributes.id === id) {
        item.symbol.textStyle.label = '网格:' + attr.name
       // item.symbol.textStyle.fillColor = '#ffffff'
      }
    }
    state.highLightFeatureList = featureList
  },
  DETEL_HIGHLIGHT_LABEL_TEXT(state) {
    let featureList = JSON.parse(JSON.stringify(state.highLightFeatureList))
    for (let item of featureList) {
      delete item.symbol.textStyle.label
    }
    state.highLightFeatureList = featureList
  },
  DETEL_CURRENT_GRID_3D(state) {
    let featureList = JSON.parse(JSON.stringify(state.gridFeatureList))
    for (let item of featureList) {
      delete item.symbol.textStyle.label
    }
    state.gridFeatureList = featureList
  },
  // 选取区域镜头信息
  SET_SELECT_BOX_VIDEO_DATA(state, data) {
    state.selectBoxVideoData = data
  },
  // 选取区域单兵信息
  SET_SELECT_BOX_SINGLE_DATA(state, data) {
    state.selectBoxSingleData = data
  },
  PUSH_SINGLE_DATA_LIST(state, data) {
    let isSave = true
    for (let i = 0; i < state.selectBoxSingleData.length; i++) {
      if (state.selectBoxSingleData[i]._id === data._id) {
        isSave = false
        break
      }
    }
    isSave && state.selectBoxSingleData.push(data)
  },
  // 设置单兵模型参数
  SET_SINGLE_MODEL_PARAM(state, data) {
    state.singleModelParam = data
  },
  SET_DEFAULT_POINT_ICON_3D(state, data) { // 设置默认点位图标文件
    state.defaultPointIcon3D = data
  },
  SET_DRAW_FEATURE_3D_STYLE(state, data) {
    state.drawFeature3DStyle = data
  },
  SET_SELECTED_POINT_RES(state, data) {
    state.selectedPointRes = data
  }
}
const actions = {
  // IS_BOX_CHOOSE_CLOSED
  setIsBoxChooseClosed({commit}, data) {
    commit('IS_BOX_CHOOSE_CLOSED', data)
  },
  // IS_BOX_CHOOSE_PREVIEW
  setIsBoxChoosePreview({commit}, data) {
    commit('IS_BOX_CHOOSE_PREVIEW', data)
  },
  // SET_PREVIEW_POINT_LIST
  setPreviewPointList({commit}, data) {
    commit('SET_PREVIEW_POINT_LIST', data)
  },
  setSelectSingleList({commit}, data) {
    commit('SET_SELECT_BOX_SINGLE_DATA', data)
  },
  pushSelectSingleList({commit}, data) {
    commit('PUSH_SINGLE_DATA_LIST', data)
  },
  // SET_BUILDING_ARR
  setBuildingArr({commit}, data) {
    commit('SET_BUILDING_ARR', data)
  },
  // SET_FLOORALARMPOINTS
  setFloorAlarmPoints({commit}, data) {
    commit('SET_FLOORALARMPOINTS', data)
  },
  // SET_ALLALARM_ENTITIES
  setAllAlarmEntities({ commit }, data) {
    commit('SET_ALLALARM_ENTITIES', data)
  },
  // 四弹框点位数组
  setVideoDragList({ commit }, data) {
    commit('SET_VIDEO_LIST', data)
  },
  updateVideoDragList({ commit }, data) {
    commit('UPDATE_POINT_VIDEO_LIST_3D', data)
  },
  // SET_ALARMING_POINT_ID_AND_TYPE
  setAlarmingPointIdAndType({ commit }, data) {
    commit('SET_ALARMING_POINT_ID_AND_TYPE', data)
  },
  // 楼宇汇聚闪烁对象
  setBuildingAlarmObj({ commit }, data) {
    commit('SET_BUILDING_ALARM_OBJ', data)
  },
  // 设置树节点类型
  setTreeNodeType({ commit }, type) {
    commit('SET_TREE_NODE_TYPE', type)
  },
  setGridList({ commit }, data) {
    commit('SET_GRID_LIST', data)
  },
  setPolygonFeatureList({ commit }, data) {
    commit('SET_POLYGON_LIST', data)
  },
  setGridLabelList({ commit }, data) {
    commit('SET_GRID_LABEL_LIST', data)
  },
  setCurrentGrid3D({ commit }, data) {
    commit('SET_CURRENT_GRID_3D', data)
  },
  // SET_MAP_RESOURCE
  setMapResource({ commit }, data) {
    commit('SET_MAP_RESOURCE', data)
  },
  // SET_ALARM_LIST
  setAlarmList({ commit }, data) {
    commit('SET_ALARM_LIST', data)
  },
  // SET_ALARMING_LIST
  setAlarmingList({ commit }, data) {
    commit('SET_ALARMING_LIST', data)
  },
  // SET_PATROL_LIST
  setPatrolList({ commit }, data) {
    commit('SET_PATROL_LIST', data)
  },
  // SET_HIGHLIGHT_LIST
  setHighLightList({ commit }, data) {
    commit('SET_HIGHLIGHT_LIST', data)
  },
  setHighLightLabelList({ commit }, data) {
    commit('SET_HIGHLIGHT_LABEL_LIST', data)
  },
  setCurrentHighLightGrid({ commit }, data) {
    commit('SET_HIGHLIGHT_LABEL_TEXT', data)
  },
  // SET_ALARM_Help_List
  setAlarmHelpList({ commit }, data) {
    commit('SET_ALARM_Help_List', data)
  },
  setAlarmBoxList({ commit }, data) {
    commit('SET_ALARM_BOX_List', data)
  },
  setAlarmColumnList({ commit }, data) {
    commit('SET_ALARM_COLUMN_List', data)
  },
  // SET_FIRE_ALARM_LIST
  setFirAlarmList({ commit }, data) {
    commit('SET_FIRE_ALARM_LIST', data)
  },
  // SET_VEDIO_LIST
  setVideoList({ commit }, data) {
    commit('SET_VEDIO_LIST', data)
  },
  // 获取单个巡更点位
  getSinglePatrolPoint({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getPatrolPointApi(playod)
        .then(res => {
          resolve(res.data)
          commit('SET_MAP_RESOURCE', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取单个巡更点位（不存储state状态）
  getSinglePatrolPointWithoutUpdateState({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getPatrolPointApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据id获取资源 ---胡红勋--2018-09-06
  getResourceById({ commit }, id) {
    return new Promise((resolve, reject) => {
      getResourceByIdApi(id)
        .then(res => {
          resolve(res.data)
          commit('SET_MAP_RESOURCE', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据id获取资源（不存储state状态）
  getResourceByIdWithoutUpdateState({ commit }, id) {
    return new Promise((resolve, reject) => {
      getResourceByIdApi(id)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取地图结构树
  getAppMapOrgTree({ commit }) {
    return new Promise((resolve, reject) => {
      getMapOrgTreeApi()
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取报警助树方法-----胡红勋添加---2018-09-03
  getAlarmHelpOrgTree({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getAlarmHelpOrgTreeApi(playod)
        .then(res => {
          resolve(res.data)
          commit('SET_ALARM_HELP_TREE_DATA', [res.data])
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取视频点位树列表
  getVedioResourceOrgTree({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getVedioResourceOrgTreeApi(playod)
        .then(res => {
          resolve(res.data)
          commit('SET_VEDIO_TREE_DATA', [res.data])
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取报警资源树
  getAlarmResourceOrgTree({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getAlarmResourceOrgTreeApi(playod)
        .then(res => {
          resolve(res.data)
          commit('SET_ALARM_TREE_DATA', [res.data])
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取巡更点位树
  getPatrolOrgTree({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getPatrolOrgTreeApi(playod)
        .then(res => {
          resolve(res.data)
          commit('SET_PATROL_TREE_DATA', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取3d地图的巡更点位 胡红勋添加
  getAllPatrolPoint({ commit }) {
    return new Promise((resolve, reject) => {
      getAllPatrolPointApi()
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 在3d地图上获取指定类型的通道资源-----------2018-09-09
  getResourcePointsByChannelType({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getResourcePointsByChannelTypeApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据楼层id获取本楼层上指定类型的通道资源---
  getResourcePointsByFloorIdAndChannelType({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getResourcePointsByFloorIdAndChannelTypeApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 胡红勋添加，保存或者修改报警求助点位----
  saveOrUpdateAlarmHelpPoint({ commit }, playod) {
    return new Promise((resolve, reject) => {
      saveOrUpdateAlarmHelpPointApi(playod)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改保存视频点位-
  saveOrUpdateVedioPoint({ commit }, playod) {
    return new Promise((resolve, reject) => {
      saveOrUpdateVedioPointApi(playod)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改添加巡更点位
  saveOrUPdatePatrolPoint({ commit }, playod) {
    return new Promise((resolve, reject) => {
      saveOrUPdatePatrolPointApi(playod)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 修改|添加资源报警点位
  saveOrUPdateAlarmPoint({ commit }, playod) {
    return new Promise((resolve, reject) => {
      saveOrUPdateAlarmPointApi(playod)
        .then(res => {
          console.log(res)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据地图范围统计资源
  get3DSelectBoxData({ commit }, playod) {
    return new Promise((resolve, reject) => {
      get3DSelectBoxDataApi(playod)
        .then(res => {
          commit('SET_SELECT_BOX_VIDEO_DATA', res.data.resource)
          res.data.security.map(item => {
            commit('PUSH_SINGLE_DATA_LIST', item)
          })
          resolve()
        })
        .catch(err => reject(err))
    })
  },
  // 胡红勋添加 2018 -09 -08
  deletePatrolPointById({ commit }, playod) {
    return new Promise((resolve, reject) => {
      deletePatrolPointByIdApi(playod)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 胡红勋，删除点位资源--------2018-09-08
  deleteResourceById({ commit }, playod) {
    return new Promise((resolve, reject) => {
      deleteResourceById(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 校验楼宇名称
  checkBuildNameIsRepeat({ commit }, playod) {
    return new Promise((resolve, reject) => {
      checkBuildNameIsRepeatApi(playod)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定楼层的巡更点位
  getOneFloorPatrols({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getOneFloorPatrolsApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取指定点位类型状态的模型列表数据
  getPointModelList({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getPointModelListApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取单兵模型列表数据
  getSingleModelList({ commit }) {
    let param = { oid: Number(mapUtils.MODELOID.single) }
    return new Promise((resolve, reject) => {
      getPointModelListApi(param)
        .then(res => {
          if (res.data && res.data.length > 0) {
            let model = res.data[0]
            for (const item of res.data) { // 编辑模型数组
              if (item.default) { // 默认模型
                model = item
                break
              }
            }
            let singleModelParam = {
              height: model.height || 0,
              brightness: model.brightness || 0,
              scale: model.scale || 0
            }
            for (const item of model.files) {
              if (item.status === 'online') {
                singleModelParam.onlineModeUrl = item.path
              } else if (item.status === 'alarm') {
                singleModelParam.alarmModeUrl = item.path
              }
            }
            commit('SET_SINGLE_MODEL_PARAM', singleModelParam)
          }
          // resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 添加辅助杆
  saveAssistHole({ commit }, playod) {
    return new Promise((resolve, reject) => {
      saveAssistHoleApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据标识删除辅助杆
  deleteAssistHoleById({ commit }, playod) {
    return new Promise((resolve, reject) => {
      deleteAssistHoleApi(playod)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据标识更新辅助杆
  updateAssistHoleById({ commit }, playod) {
    return new Promise((resolve, reject) => {
      updateAssistHoleApi(playod)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据标识获取辅助杆
  getAssistHoleById({ commit }, holdId) {
    return new Promise((resolve, reject) => {
      getAssistHoleApi(holdId)
        .then(res => {
          commit('SET_MAP_RESOURCE', res.data)
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 根据标识获取辅助杆（不存储state状态）
  getAssistHoleByIdWithoutUpdateState({ commit }, holdId) {
    return new Promise((resolve, reject) => {
      getAssistHoleApi(holdId)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取辅助杆列表
  getAssistHoleList() {
    return new Promise((resolve, reject) => {
      getAssistHoleApi()
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 查询历史巡更位置信息
  getHistoryPatrolPosition({ commit }, playod) {
    return new Promise((resolve, reject) => {
      getHistoryPatrolPositionApi(playod)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取模型设置参数
  getModelSettingParams({ commit }, oid) {
    return new Promise((resolve, reject) => {
      getModelSettingParamsApi(oid)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  queryDefaultIconByOid3D({ commit }, oid) { // 根据oid查询点位默认图标
    return new Promise((resolve, reject) => {
      queryDefaultIconByOidApi(oid).then(res => {
        commit('SET_DEFAULT_POINT_ICON_3D', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  setSelectedPointRes({ commit }, payload) {
    commit('SET_SELECTED_POINT_RES', payload)
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
