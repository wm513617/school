import { getTrackConditionApi } from 'src/http/veriface/track.api'
import { getMapAlarmTemp, getLayoutStatus } from 'http/alarm.api.js'
import { protectionActionApi, removalActionApi } from 'http/alarmMainFrame.api.js'
import { GEOMETRYTYPE } from 'assets/2DMap/meta/common'
import { save } from '../../../storage/index'
import { getMapAlarmStatistic, getMapResourcesStatistic, get2DPatrolInfoApi, singleSendMsg, getAllResourceByBoxApi, getSingleListByOrgIdApi, getAllAlarmByGridApi, getAllResourceByGridApi } from 'http/map2d.js'
export default {
  namespaced: true,
  state: {
    isShowLeftPanel: true, // 左侧应急预案面板是否展开/缩回
    isEmergency: false, // 是否开启应急预案模式
    isAutoPosition: false, // 接收到报警是否自动定位
    isExpandLeftTree: false, // 左侧机构树是否展开/缩回
    modalNumber: 0, // 2D地图弹窗个数
    pointState: {
      isCamera: { // 摄像机
        gun: true,
        hemisphere: true,
        fastBall: true,
        panorama: true,
        infraRed: true,
        verface: false,
        traffic: false,
        visualField: false
      },
      isAlarm: { // 报警
        alarm: false,
        fireControl: false,
        alarmColumn: false,
        alarmBox: false
      },
      isPoint: false, // 巡更点位
      isDoorControl: false, // 门禁点位
      isSingle: { // 移动单兵
        removeSingle: false,
        singlePic: false,
        groupId: '',
        singleIdList: [] // 显示的单兵标识列表
      },
      isInfoPanelFixed: true, // 信息面板位置是否是固定，默认固定
      isNameTitle: false, // 名称标签
      isBuilding: false, // 楼宇
      isGrid: false // 网格
    },
    filterState: {
      isCommonAlarm: { // 普通报警
        checked: true,
        alarmInput: true,
        alarmSector: true
      },
      isAlarmVideo: { // 视频报警
        checked: true,
        alarmPoint: true,
        focusOn: true
      },
      isIntelligence: { // 智能报警
        checked: true,
        alarmIntelligence: true, // 智能报警
        alarmPeccancy: true, // 违章上报
        faceOn: true, // 人像布控
        isFold: true, // 折叠显示
        snapPictures: true // 抓拍图片
      },
      isAlarmHelp: { // 报警求助
        checked: true
      },
      isFireControl: { // 消防报警
        checked: true
      },
      isAlarmSingle: { // 单兵报警
        checked: true,
        singleOneKey: true,
        alarmPatrol: true
      },
      isPlan: { // 应急预案
        checked: false
      }
    },
    filterLevel: { // 报警过滤级别
      alarmInputLevel: 1, // 报警输入
      alarmSectorLevel: 1, // 报警防区
      cameraSpearLevel: 1, // 监控点报警
      focusOnLevel: 1, // 重点关注
      intelligenceLevel: 1, // 智能报警
      peccancyLevel: 1, // 违章报警
      faceLevel: 1, // 人像布控
      alarmHelpLevel: 1, // 报警求助
      fireControlLevel: 1 // 消防报警
    },
    toolsPanelActive: '', // 右侧当前激活面板
    isShowToolsPanel: false, // 是否显示右侧工具面板
    isOpenFirstToolPanel: true, // 右侧一级面板是否展开
    boxChooseSecPanelStatus: false,
    toolsPanelIsUnread: {
      // 右侧工具栏未读状态
      AlarmList: false, // 报警
      FireAlarmList: false, // 消防
      AlarmHelpList: false, // 报警求助
      // KeepWatchList: false, // 巡更
      // SinglePawnList: false, // 单兵
      IntelligentAlarm: false, // 智能报警
      VideoAlarm: false, // 视频报警
      ManualAlarm: false, // 手工报警
      IndividualPolice: false
    },
    isShowPTattr: false, // 是否显示点位属性面板
    trackList: [], // 人脸轨迹数组
    isOpenTrail: false,
    isOpenAlarmPanel: false, // 报警视频弹框是否打开，用于应急预案面板是否弹出
    bottomCanvasData: [],
    mapStatisticOnCount: [],
    mapStatisticOffCount: [],
    boxChooseType: GEOMETRYTYPE.MULTIPOLYGON, // 框选类型
    isPointChoose: false, // 是否点选
    boxStatisticOnCountsOn: [],
    boxStatisticOnCountsOff: [],
    isGridStatistic: false, // 网格统计面板
    isPlatformTrack: false, // 是否接力追踪
    faceHistoryTrackNodes: [], // 人像历史轨迹节点数组
    showTrackInfoTabData: [], // 地图上显示的追踪信息
    resouceChooseIndex: 0 // 框选资源,选中资源的index
  },
  getters: {
    isShowEmergencyPanel(state) {
      // 是否显示应急预案面板
      // 打开了应急预案的开关，并且查看报警的弹框打开，则显示应急预案面板
      // console.log(state.isEmergency, 'state.isEmergency1111')
      // console.log(state.isOpenAlarmPanel, 'state.isOpenAlarmPanel1111')
      return state.isOpenAlarmPanel && state.isEmergency
    },
    // 左侧应急预案面板是否展开
    isOpenLeftPanel(state) {
      return state.isShowLeftPanel
    },
    // 左侧机构树是否展开
    isExpandTree(state) {
      return state.isExpandLeftTree
    },
    isEmergency(state) {
      // 是否开启应急预案开关
      return state.isEmergency
    },
    isAutoPosition(state) {
      return state.isAutoPosition
    },
    isShowEmergency(state) {
      // 是否显示应急预案面板
      return state.isShowToolsPanel && state.isEmergency
    },
    toolsPanelActive(state) {
      // 右侧当前激活面板
      return state.toolsPanelActive
    },
    isShowPTattr(state) {
      // 是否显示点位属性面板
      return state.isShowPTattr
    },
    isShowToolsPanel(state) {
      // 是否显示右侧工具栏二级面板
      return state.isShowToolsPanel
    },
    getModalNumber(state) {
      return state.modalNumber
    },
    isShowFirstToolPanel(state) {
      return state.isOpenFirstToolPanel
    },
    // -------------------点位元素-----------------------
    isCamera(state) {
      return state.pointState.isCamera
    },
    gun(state, getters) {
      return getters.isCamera.gun
    },
    hemisphere(state, getters) {
      return getters.isCamera.hemisphere
    },
    fastBall(state, getters) {
      return getters.isCamera.fastBall
    },
    panorama(state, getters) {
      return getters.isCamera.panorama
    },
    infraRed(state, getters) {
      return getters.isCamera.infraRed
    },
    verface(state, getters) {
      return getters.isCamera.verface
    },
    traffic(state, getters) {
      return getters.isCamera.traffic
    },
    visualField(state, getters) {
      return getters.isCamera.visualField
    },
    isAlarm(state) {
      return state.pointState.isAlarm
    },
    alarm(state, getters) {
      return getters.isAlarm.alarm
    },
    fireControl(state, getters) {
      return getters.isAlarm.fireControl
    },
    alarmColumn(state, getters) {
      return getters.isAlarm.alarmColumn
    },
    alarmBox(state, getters) {
      return getters.isAlarm.alarmBox
    },
    isPoint(state) {
      return state.pointState.isPoint
    },
    isDoorControl(state) {
      return state.pointState.isDoorControl
    },
    isSingle(state) {
      return state.pointState.isSingle
    },
    removeSingle(state, getters) {
      return getters.isSingle.removeSingle
    },
    singlePic(state, getters) {
      return getters.isSingle.singlePic
    },
    singleGroupId(state, getters) {
      return getters.isSingle.groupId
    },
    singleIdList(state, getters) { // 获取显示的单兵标识列表
      return getters.isSingle.singleIdList
    },
    isNameTitle(state) {
      return state.pointState.isNameTitle
    },
    isInfoPanelFixed(state) {
      return state.pointState.isInfoPanelFixed
    },
    isBuilding(state) {
      return state.pointState.isBuilding
    },
    isGrid(state) {
      return state.pointState.isGrid
    },
    // 框选二级面板显隐状态
    boxChooseSecPanelStatus: state => {
      return state.boxChooseSecPanelStatus
    },
    toolsPanelIsUnread: state => type => {
      return state.toolsPanelIsUnread[type]
    },
    // 报警过滤数据
    isFaceSnap(state) { // 抓拍图片
      return state.filterState.isIntelligence.snapPictures
    },
    isFold(state) { // 折叠
      return state.filterState.isIntelligence.isFold
    },
    boxChooseType(state) { // 框选类型
      return state.boxChooseType
    },
    isPointChoose(state) { // 是否点选
      return state.isPointChoose
    },
    isPlatformTrack(state) { // 是否接力追踪
      return state.isPlatformTrack
    },
    faceHistoryTrackNodes(state) { // 人像历史轨迹节点数组
      return state.faceHistoryTrackNodes
    }
  },
  mutations: {
    CHANGE_IS_OPEN_LEFT_PANEL(state, data) {
      state.isShowLeftPanel = data
    },
    CHANGE_IS_EXPAND_LEFT_TREE(state, data) {
      state.isExpandLeftTree = data
    },
    CHANGE_IS_OPEN_FIRST_TOOL_PANNEL(state, data) {
      state.isOpenFirstToolPanel = data
    },
    CHANGE_IS_EMERGENCY(state, v) {
      state.isEmergency = v
    },
    CHANGE_IS_AUTO_POSITION(state, v) {
      state.isAutoPosition = v
    },
    CHANGE_IS_FACE_SNAP(state, v) {
      state.filterState.isIntelligence.snapPictures = v
    },
    CHANGE_IS_FOLD(state, v) {
      state.filterState.isIntelligence.isFold = v
    },
    BOX_CHOOSE_SEC_PANEL_STATUS(state, v) {
      state.boxChooseSecPanelStatus = v
    },
    CHANGE_TOOLS_PANEL_ACTIVE(state, v) {
      state.toolsPanelActive = v
    },
    CHANGE_IS_SHOW_TOOLS_PANEL(state, v) {
      state.isShowToolsPanel = v
    },
    CHANGE_MODAL_NUMBER(state, n) {
      state.modalNumber = n
    },
    CHANGE_TOOLS_PANEL_IS_UNREAD(state, { type, value }) {
      state.toolsPanelIsUnread[type] = value
    },
    CHANGE_IS_SHOW_PT_ATTR(state, v) {
      state.isShowPTattr = v
    },
    CHANGE_BOX_CHOOSE_TYPE(state, type) { // 改变框选类型
      state.boxChooseType = type
    },
    CHANGE_IS_POINT_CHOOSE(state, flag) { // 改变点选状态
      state.isPointChoose = flag
    },
    CHANGE_ITEM_STATE(state, {arr, isFilter = true}) {
      let result = ''
      if (isFilter) {
        result = state.filterState[arr[0]]
        arr[1]
          ? result[arr[1]] = !result[arr[1]]
          : result.checked = !result.checked
      } else {
        result = state.pointState[arr[0]]
        arr[1]
          ? result[arr[1]] = !result[arr[1]]
          : state.pointState[arr[0]] = !result
      }
      // 接下来处理监听socket逻辑，过滤到未选中的报警消息
    },
    CHANGE_IS_SINGLE_PIC(state, flag) { // 改变单兵头像显隐状态
      state.pointState.isSingle.singlePic = flag
    },
    CHANGE_SINGLE_GROUPID(state, groupId) {
      state.pointState.isSingle.groupId = groupId
    },
    CHANGE_SINGLE_ID_LIST(state, list) {
      state.pointState.isSingle.singleIdList = list
    },
    CHANGE_FILTER_LEAVEL(state, arr) {
      state.filterLevel[arr[0]] = arr[1]
    },
    GET_TRACK_LISTS(state, list) {
      state.trackList = list
    },
    OPEN_ALARM_TRAIL(state, val) {
      state.isOpenTrail = val
    },
    CHANGE_IS_OPEN_ALARM_PANEL(state, v) {
      console.log(v, '报警')
      state.isOpenAlarmPanel = v
    },
    GET_ALARM_LIST(state, arr) {
      const result = [0, 0, 0, 0, 0, 0, 0]
      Object.keys(arr).forEach(aName => {
        switch (aName) {
          case 'ordinary':
            result[0] = arr[aName].sum
            break
          case 'video':
            result[1] = arr[aName].sum
            break
          case 'Intelligence':
            result[2] = arr[aName].sum
            break
          case 'alarmHelp':
            result[3] = arr[aName].sum
            break
          case 'fireAlarm':
            result[4] = arr[aName].sum
            break
          case 'soldierAlarm':
            result[5] = arr[aName].sum
            break
          case 'manualAlarm':
            result[6] = arr[aName].sum
            break
        }
      })
      state.bottomCanvasData = result
    },
    GET_RESOUSE_LIST(state, arr) {
      let result1 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
      let result2 = [0, 0, 0, 0, 0, 0, 0, 0, 0]
      Object.keys(arr).forEach(aName => {
        switch (aName) {
          case 'gridsNum':
            result1[0] = arr[aName]
            break
          case 'buildingsNum':
            result1[1] = arr[aName]
            break
          case 'securityNum':
            result1[2] = arr[aName].online
            result2[2] = arr[aName].offline
            break
          case 'patrolNum':
            result1[3] = arr[aName]
            break
          case 'resourceNum':
            arr[aName].forEach(n => {
              switch (n.type) {
                case 0:
                  result1[8] = n.online
                  result2[8] = n.offline
                  break
                case 1:
                  result1[7] = n.online
                  result2[7] = n.offline
                  break
                case 9:
                  result1[6] = n.sum
                  break
                case 13:
                  result1[5] = n.sum
                  break
                case 14:
                  result1[4] = n.sum
                  break
              }
            })
            break
        }
      })
      state.mapStatisticOnCount = result1 // 在线
      state.mapStatisticOffCount = result2 // 离线
    },
    CHANGE_GRID_STATISTIC_COUNT(state, arr) { // 网格统计数据
      let arrOn = [0, 0, 0, 0, 0, 0, 0, 0, 0]
      let arrOff = [0, 0, 0, 0, 0, 0, 0, 0, 0]
      Object.keys(arr).forEach(aName => {
        switch (aName) {
          case 'gridNum':
            arrOn[0] = arr[aName]
            break
          case 'buildNum':
            arrOn[1] = arr[aName]
            break
          case 'securityNum':
            arrOn[2] = arr[aName]
            break
          case 'patrolPoint':
            arrOn[3] = arr[aName]
            break
          case 'alarmBox':
            arrOn[4] = arr[aName].onlineNum
            arrOff[4] = arr[aName].offlineNum
            break
          case 'alarmPillar':
            arrOn[5] = arr[aName].onlineNum
            arrOff[5] = arr[aName].offlineNum
            break
          case 'fireAlarm':
            arrOn[6] = arr[aName].onlineNum
            arrOff[6] = arr[aName].offlineNum
            break
          case 'alarmCommon':
            arrOn[7] = arr[aName].onlineNum
            arrOff[7] = arr[aName].offlineNum
            break
          case 'videoPoint':
            arrOn[8] = arr[aName].onlineNum
            arrOff[8] = arr[aName].offlineNum
            break
        }
      })
      state.mapStatisticOnCount = arrOn // 在线
      state.mapStatisticOffCount = arrOff // 离线
    },
    CHANGE_BOX_STATISTIC_COUNTS(state, arr) {
      let arrOn = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      let arrOff = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      Object.keys(arr).forEach(aName => {
        switch (aName) {
          case 'securityNum':
            arrOn[0] = arr[aName]
            break
          case 'buildNum':
            arrOn[1] = arr[aName]
            break
          case 'doorPoint':
            arrOn[2] = arr[aName].onlineNum
            arrOff[2] = arr[aName].offlineNum
            break
          case 'gridNum':
            arrOn[3] = arr[aName]
            break
          case 'patrolPoint':
            arrOn[4] = arr[aName]
            break
          case 'alarmBox':
            arrOn[5] = arr[aName].onlineNum
            arrOff[5] = arr[aName].offlineNum
            break
          case 'alarmPillar':
            arrOn[6] = arr[aName].onlineNum
            arrOff[6] = arr[aName].offlineNum
            break
          case 'fireAlarm':
            arrOn[7] = arr[aName].onlineNum
            arrOff[7] = arr[aName].offlineNum
            break
          case 'alarmCommon':
            arrOn[8] = arr[aName].onlineNum
            arrOff[8] = arr[aName].offlineNum
            break
          case 'videoPoint':
            arrOn[9] = arr[aName].onlineNum
            arrOff[9] = arr[aName].offlineNum
            break
        }
      })
      state.boxStatisticOnCountsOn = arrOn // 在线
      state.boxStatisticOnCountsOff = arrOff // 离线
    },
    CHANGE_IS_GRID_STATISTIC(state, v) {
      state.isGridStatistic = v
    },
    SAVE_FILTERSTATE(state, obj) {
      state.filterState = obj
    },
    SAVE_POINTSTATE(state, obj) {
      state.pointState = obj
    },
    SAVE_FILTERLEVEL(state, obj) {
      state.filterLevel = obj
    },
    SET_PLATFORM_TRACK(state, v) {
      state.isPlatformTrack = v
    },
    SET_FACE_HISTORY_TRACK_NODES(state, arr) { // 设置人像历史轨迹节点数据
      state.faceHistoryTrackNodes = arr
    },
    TRACK_INFO_TO_MAP_TAB(state, v) {
      state.showTrackInfoTabData = v
    },
    CHANGE_RESOUCE_CHOOSE_INDEX(state, index) {
      state.resouceChooseIndex = index
    }
  },
  actions: {
    /**
     * 开启关闭应急预案模式
     * @param v 是否开启状态Boolean
     */
    switchEmergency({ commit }, v) {
      commit('CHANGE_IS_EMERGENCY', v)
    },
    switchAutoPosition({ commit }, v) {
      commit('CHANGE_IS_AUTO_POSITION', v)
    },
    // 改变抓拍图片开关
    switchFaceSnap({ commit }, v) {
      commit('CHANGE_IS_FACE_SNAP', v)
    },
    // 改变折叠显示开关
    switchIsFold({ commit }, v) {
      commit('CHANGE_IS_FOLD', v)
    },
    // 改变选中过滤报警
    changeFilter({commit}, arr) {
      commit('CHANGE_ITEM_STATE', {arr: arr})
    },
    savePoint({commit}, arr) {
      commit('SAVE_POINTSTATE', JSON.parse(arr))
    },
    singleSendMssage({ commit }, obj) {
      return new Promise((resolve, reject) => {
        singleSendMsg(obj)
          .then(resp => {
            resolve(resp)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 改变是否打开报警弹框的状态
    changeOpenAlarmPanel({ commit }, flag) {
      commit('CHANGE_IS_OPEN_ALARM_PANEL', flag)
    },
    /*
     * 布防
     */
    layoutAlarm({ commit }, data) {
      return protectionActionApi(data)
    },
    /**
     *撤防
     */
    removalAlram({ commit }, data) {
      return removalActionApi(data)
    },
    getTempName({ commit }, data) {
      return getMapAlarmTemp()
    },
    getAlarmLayout({ commit }, data) {
      return getLayoutStatus(data)
    },
    /**
     * 获取巡更信息
     * @param {String} data 巡更id
     */
    getPatrolInfo({ commit }, data) {
      return get2DPatrolInfoApi(data)
    },
    changePoint({commit}, arr) {
      commit('CHANGE_ITEM_STATE', {arr: arr, isFilter: false})
    },
    changeIsSinglePic({commit}, flag) { // 改变单兵头像显隐状态
      commit('CHANGE_IS_SINGLE_PIC', flag)
    },
    changeSingleGroupId({commit}, groupId) { // 改变单兵所在机构的标识
      commit('CHANGE_SINGLE_GROUPID', groupId)
      if (groupId) {
        return new Promise((resolve, reject) => {
          getSingleListByOrgIdApi(groupId).then(res => {
            let singles = res.data.results
            let singleIds = singles.map(single => single._id)
            commit('CHANGE_SINGLE_ID_LIST', singleIds)
            resolve(singles)
          }).catch(err => reject(err))
        })
      } else {
        commit('CHANGE_SINGLE_ID_LIST', [])
        return false
      }
    },
    changeAlarmFilterLeavel({ commit }, arr) {
      commit('CHANGE_FILTER_LEAVEL', arr)
    },
    // BOX_CHOOSE_SEC_PANEL_STATUS
    changeBoxChooseSecPanelStatus({ commit }, v) {
      commit('BOX_CHOOSE_SEC_PANEL_STATUS', v)
    },
    /**
     * 开/关右侧工具栏二级面板
     * @param v 是否开启Boolean
     */
    switchToolsPanel({ commit }, v) {
      commit('CHANGE_IS_SHOW_TOOLS_PANEL', v)
    },
    /**
     * 打开属性点位面板
     * @param {Object} info 对象，字段暂不确定
     */
    openPTattr({ commit }, info) {
      // 返回的点位属性有数据则打开属性面板
      if (info.data && Object.keys(info.data).length > 0) {
        commit('CHANGE_IS_SHOW_PT_ATTR', true)
        commit('CHANGE_ATTR_INFO', info)
      }
    },
    closePTattr({ commit }) {
      commit('CHANGE_IS_SHOW_PT_ATTR', false)
    },
    /**
     * 打开工具栏面板
     * @param {string} type 打开的面板类型
     */
    openToolsPanel({ commit, state, dispatch }, type) {
      // 如果将要打开面板已经打开，直接返回
      if (state.toolsPanelActive === type && state.isShowToolsPanel) {
        return
      }
      // 如果是报警类型，应急预案相应切换
      // let planId = null
      // switch (type) {
      //   case 'AlarmList':
      //     planId = 1
      //     break
      //   case 'FireAlarmList':
      //     planId = 2
      //     break
      //   case 'AlarmHelpList':
      //     planId = 3
      //     break
      //   case 'KeepWatchList':
      //     planId = 5
      //     break
      //   case 'SinglePawnList':
      //     planId = 4
      //     break
      // }
      // if (planId) {
      //   dispatch('emergencyAction', { planId }, { root: true }).catch(err => {
      //     console.log('action emergencyAction:', err)
      //   })
      // }

      if (state.isShowToolsPanel) {
        commit('CHANGE_TOOLS_PANEL_ACTIVE', type)
      } else {
        commit('CHANGE_TOOLS_PANEL_ACTIVE', type)
        commit('CHANGE_IS_SHOW_TOOLS_PANEL', true)
      }
    },
    closeToolsPanel({ commit }) {
      commit('CHANGE_TOOLS_PANEL_ACTIVE', '')
      commit('CHANGE_IS_SHOW_TOOLS_PANEL', false)
    },
    changeToolsPanelToBoxChoose({ commit }, data) {
      commit('CHANGE_TOOLS_PANEL_ACTIVE', data)
      commit('CHANGE_IS_SHOW_TOOLS_PANEL', true)
    },
    chnageToolIsUnread({ commit }, { type, value }) {
      commit('CHANGE_TOOLS_PANEL_IS_UNREAD', { type, value })
    },
    openAlarmTrail({ commit }, value) {
      commit('OPEN_ALARM_TRAIL', value)
    },
    // 获取轨迹信息
    getTrackCond({ commit }, payload) {
      return new Promise((resolve, reject) => {
        getTrackConditionApi(payload)
          .then(res => {
            resolve(res.data)
          })
          .catch(err => reject(err))
      })
    },
    getMap2DAlarmList({ commit }, mapId) {
      return getMapAlarmStatistic(mapId).then(res => {
        commit('GET_ALARM_LIST', res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    getMap2DResouseList({ commit }, id) {
      return getMapResourcesStatistic(id).then(res => {
        commit('GET_RESOUSE_LIST', res.data)
      }).catch(err => {
        console.log(err)
      })
    },
    changeBoxChooseType({ commit }, type) { // 改变框选类型
      commit('CHANGE_BOX_CHOOSE_TYPE', type)
    },
    changeIsPointChoose({ commit }, flag) { // 改变是否点选
      commit('CHANGE_IS_POINT_CHOOSE', flag)
    },
    getStatisticsCountByBox({ commit }, param) { // 获取框选统计资源信息
      return new Promise((resolve, reject) => {
        getAllResourceByBoxApi(param)
          .then(res => {
            commit('CHANGE_BOX_STATISTIC_COUNTS', res.data)
            resolve()
          })
          .catch(err => reject(err))
      })
    },
    getGridAlarmStatisticsCount({ commit }, gid) { // 获取网格内警情数量
      return new Promise((resolve, reject) => {
        getAllAlarmByGridApi(gid)
          .then(res => {
            commit('GET_ALARM_LIST', res.data)
            resolve()
          })
          .catch(err => reject(err))
      })
    },
    getGridStatisticsCount({ commit }, gid) { // 获取网格内元素数量
      return new Promise((resolve, reject) => {
        getAllResourceByGridApi(gid)
          .then(res => {
            commit('CHANGE_GRID_STATISTIC_COUNT', res.data)
            resolve()
          })
          .catch(err => reject(err))
      })
    },
    setIsPlatformTrack({ commit }, flag) { // 是否接力追踪
      commit('SET_PLATFORM_TRACK', flag)
    },
    setFaceHistoryTrackNodes({ commit }, arr) { // 设置人像历史轨迹节点数据
      commit('SET_FACE_HISTORY_TRACK_NODES', arr)
    },
    setResouceChooseIndex({ commit }, index) {
      commit('CHANGE_RESOUCE_CHOOSE_INDEX', index)
    }
  }
}
