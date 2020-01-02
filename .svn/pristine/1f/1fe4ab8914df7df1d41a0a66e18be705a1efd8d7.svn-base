import { protectionActionApi, removalActionApi } from 'http/alarmMainFrame.api.js'
import { getMapAlarmTemp, getLayoutStatus } from 'http/alarm.api.js'
import { getPatrolInfoApi, singleSendMsg } from 'http/map3d.js'

export default {
  namespaced: true,
  state: {
    isShowToolsPanel: false, // 是否显示右侧工具面板
    toolsPanelActive: '', // 右侧当前激活面板
    toolsPanelIsUnread: { // 右侧工具栏未读状态
      AlarmList: false, // 报警
      FireAlarmList: false, // 消防
      AlarmHelpList: false, // 报警求助
      KeepWatchList: false, // 巡更
      SinglePawnList: false // 单兵
    },
    isOpenAlarmPanel: false, // 是否打开了报警的查看弹框
    isShowPTattr: false, // 是否显示点位属性面板
    attrInfo: { // 点位信息
      type: 'AttrAlarm', // 枚举， 'AttrAlarm','AttrAlarmHelp','AttrBuilding', 'AttrModel', 'AttrPatrol', 'AttrSinglePawn', 'AttrVideo'
      name: '',
      vendor: '',
      contacts: '',
      telContacts: 0,
      tempName: '',
      resourceId: ''
    },
    isEmergency: false, // 是否开启应急预案模式
    isRecAlarm: true, // 是否接收报警
    pointSH: { // 各种点位的显隐开关
      isCameraSpear: true, // 点位-枪机
      isHalfBall: true, // 点位-半球
      isFastBall: true, // 点位-快球
      isFullShot: true, // 点位-全景
      isInfrared: true, // 点位-红外枪机
      isAlarm: false, // 点位-普通报警
      isFire: false, // 点位-消防报警
      isAlarmBox: false, // 点位-报警箱
      isAlarmPillar: false, // 点位-报警柱
      isKeepWatch: false, // 点位-巡更
      isSinglePawn: false, // 点位-单兵
      isShowName: false, // 是否显示名称标签
      isShowGrid: false // 是否显示网格
    }
  },
  getters: {
    toolsPanelIsUnread: (state) => (type) => {
      return state.toolsPanelIsUnread[type]
    },
    isShowEmergencyPanel(state) { // 是否显示应急预案面板
      // 打开了应急预案的开关，并且查看报警的弹框打开，则显示应急预案面板
      return state.isOpenAlarmPanel && state.isEmergency
    },
    isShowToolsPanel(state) { // 是否显示右侧工具栏二级面板
      return state.isShowToolsPanel
    },
    isShowPTattr(state) { // 是否显示点位属性面板
      return state.isShowPTattr
    },
    isEmergency(state) { // 是否开启应急预案开关
      return state.isEmergency
    },
    isShowEmergency(state) { // 是否显示应急预案面板
      return state.isShowToolsPanel && state.isEmergency
    },
    isRecAlarm(state) { // 是否接收报警
      return state.isRecAlarm
    },
    isCameraSpear(state) { // 点位-枪机
      return state.pointSH.isCameraSpear
    },
    isHalfBall(state) { // 点位-半球
      return state.pointSH.isHalfBall
    },
    isFastBall(state) { // 点位-快球
      return state.pointSH.isFastBall
    },
    isFullShot(state) { // 点位-全景
      return state.pointSH.isFullShot
    },
    isInfrared(state) { // 点位-红外枪机
      return state.pointSH.isInfrared
    },
    isAlarm(state) { // 点位-普通报警
      return state.pointSH.isAlarm
    },
    isFire(state) { // 点位-消防报警
      return state.pointSH.isFire
    },
    isAlarmBox(state) { // 点位-报警箱
      return state.pointSH.isAlarmBox
    },
    isAlarmPillar(state) { // 点位-报警柱
      return state.pointSH.isAlarmPillar
    },
    isKeepWatch(state) { // 点位-巡更
      return state.pointSH.isKeepWatch
    },
    isSinglePawn(state) { // 点位-单兵
      return state.pointSH.isSinglePawn
    },
    isShowName(state) { // 是否显示名称标签
      return state.pointSH.isShowName
    },
    isShowGrid(state) { // 是否显示网格
      return state.pointSH.isShowGrid
    },
    attrInfo(state) { // 点位属性信息
      return state.attrInfo
    },
    toolsPanelActive(state) { // 右侧当前激活面板
      return state.toolsPanelActive
    },
    videoCheckedList(state) { // 视频点位选中列表
      let list = []
      state.pointSH.isCameraSpear && list.push(0)
      state.pointSH.isInfrared && list.push(1)
      state.pointSH.isHalfBall && list.push(2)
      state.pointSH.isFastBall && list.push(3)
      state.pointSH.isFullShot && list.push(4)
      return list
    }
  },
  mutations: {
    CHANGE_IS_REC_ALARM(state, v) { state.isRecAlarm = v },
    CHANGE_IS_EMERGENCY(state, v) { state.isEmergency = v },
    CHANGE_POINT_SH(state, {type, val}) { state.pointSH[type] = val },
    CHANGE_IS_SHOW_TOOLS_PANEL(state, v) {
      state.isShowToolsPanel = v
    },
    CHANGE_IS_SHOW_PT_ATTR(state, v) {
      state.isShowPTattr = v
    },
    CHANGE_ATTR_INFO(state, infoNative) {
      state.attrInfo = PTParamsAdapter(infoNative)
    },
    CHANGE_TOOLS_PANEL_ACTIVE(state, v) { state.toolsPanelActive = v },
    CHANGE_TOOLS_PANEL_IS_UNREAD(state, {type, value}) {
      state.toolsPanelIsUnread[type] = value
    },
    CHANGE_IS_OPEN_ALARM_PANEL(state, v) {
      state.isOpenAlarmPanel = v
    },
    CLEAN_ATTRINFO(state) {
      state.attrInfo.type = ''
    }
  },
  actions: {
    /**
     * 开启关闭接收报警
     * @param v 是否开启状态Boolean
     */
    switchAlarm({commit}, v) {
      commit('CHANGE_IS_REC_ALARM', v)
    },
    /**
     * 开启关闭应急预案模式
     * @param v 是否开启状态Boolean
     */
    switchEmergency({commit}, v) {
      commit('CHANGE_IS_EMERGENCY', v)
    },
    /**
     * 搜索框checkbox点位元素的状态改变
     * @param {*} type: 点位state中的key, val: 需要改变的状态bool
     */
    changeShow({commit}, {type, val}) {
      commit('CHANGE_POINT_SH', {type, val})
    },
    /**
     * 开/关右侧工具栏二级面板
     * @param v 是否开启Boolean
     */
    switchToolsPanel({commit}, v) {
      commit('CHANGE_IS_SHOW_TOOLS_PANEL', v)
    },
    /**
     * 打开属性点位面板
     * @param {Object} info 对象，字段暂不确定
     */
    openPTattr({commit}, info) {
      // 返回的点位属性有数据则打开属性面板
      if (info.data && Object.keys(info.data).length > 0) {
        commit('CHANGE_IS_SHOW_PT_ATTR', true)
        commit('CHANGE_ATTR_INFO', info)
      }
    },
    closePTattr({commit}) {
      commit('CHANGE_IS_SHOW_PT_ATTR', false)
    },
    /**
     * 打开工具栏面板
     * @param {string} type 打开的面板类型
     */
    openToolsPanel({commit, state, dispatch}, type) {
      // 如果将要打开面板已经打开，直接返回
      if (state.toolsPanelActive === type && state.isShowToolsPanel) { return }
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
      //   dispatch('emergencyAction', { planId }, { root: true }).catch(err => { console.log('action emergencyAction:', err) })
      // }

      if (state.isShowToolsPanel) {
        commit('CHANGE_TOOLS_PANEL_ACTIVE', type)
      } else {
        commit('CHANGE_TOOLS_PANEL_ACTIVE', type)
        commit('CHANGE_IS_SHOW_TOOLS_PANEL', true)
      }
    },
    closeToolsPanel({commit}) {
      commit('CHANGE_TOOLS_PANEL_ACTIVE', '')
      commit('CHANGE_IS_SHOW_TOOLS_PANEL', false)
    },
    chnageToolIsUnread({commit}, {type, value}) {
      commit('CHANGE_TOOLS_PANEL_IS_UNREAD', {type, value})
    },
    // 改变是否打开报警弹框的状态
    changeOpenAlarmPanel({commit}, flag) {
      commit('CHANGE_IS_OPEN_ALARM_PANEL', flag)
    },
    /*
   * 布防
   */
    layoutAlarm({commit}, data) {
      return protectionActionApi(data)
    },
    /**
   *撤防
   */
    removalAlram({commit}, data) {
      return removalActionApi(data)
    },
    getTempName({commit}, data) {
      return getMapAlarmTemp()
    },
    getAlarmLayout({commit}, data) {
      return getLayoutStatus(data)
    },
    /**
     * 获取巡更信息
     * @param {String} data 巡更id
     */
    getPatrolInfo({commit}, data) {
      return getPatrolInfoApi(data)
    },
    singleSendMssage({commit}, obj) {
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
    cleanAttrInfo({commit}) {
      commit('CLEAN_ATTRINFO')
    }
  }
}

// 点位面板参数适配器
function PTParamsAdapter(params) {
  console.log('ponit attribute data:', params)
  switch (params.type) {
    case 0: // 视频
      return {
        type: 'AttrVideo',
        name: params.data.name || '',
        vendor: (params.data.eid && params.data.eid.manufacturer) || '',
        contactsInfo: params.data.point3D ? params.data.point3D.principal.map(v => {
          return {
            contacts: v.name || '',
            telContacts: v.mobile || ''
          }
        }) : [],
        videoInfo: params.data, // 视频组件所需信息
        isOnline: params.data.status // 0：不在线 1：在线
      }
    case 1:
    case 11:
    case 9: // 报警
      return {
        type: 'AttrAlarm',
        name: params.data.name || '',
        level: params.data.level || '',
        contactsInfo: params.data.point3D ? params.data.point3D.principal.map(v => {
          return {
            contacts: v.name || '',
            telContacts: v.mobile || ''
          }
        }) : [],
        resourceId: params.data._id || '',
        alarmtemplate: params.data.alarmtemplate || ''
      }
    case 'alarmBox':
    case 'alarmPillar': // 报警求助
      return {
        type: 'AttrAlarmHelp',
        name: params.data.name || '',
        contactsInfo: params.data.point3D ? params.data.point3D.principal.map(v => {
          return {
            contacts: v.name || '',
            telContacts: v.mobile || ''
          }
        }) : [],
        videoInfo: params.data
      }
    case 'patrol': // 巡更
      return {
        type: 'AttrPatrol',
        id: params.data._id || '',
        name: params.data.devName || '',
        contacts: params.data.charger || '',
        telContacts: params.data.phone || '',
        patrolMan: '',
        telPatrolMan: '',
        patrolNum: '',
        alarmNum: '',
        repairNum: ''
      }
    case 'single': // 单兵
      return {
        type: 'AttrSinglePawn',
        name: params.data.data.username || '',
        org: params.data.data.affiliation || '',
        post: params.data.data.position || '',
        jobNum: params.data.data.id || '',
        telContacts: params.data.data.phone || '',
        percent: 0,
        _id: params.data.data._id || ''
      }
    case 'assist': // 辅助模型
      return {
        type: 'AttrModel',
        name: params.data.name || '',
        number: params.data._id || '',
        contactsInfo: params.data.point3D ? params.data.point3D.principal.map(v => {
          return {
            contacts: v.name || '',
            telContacts: v.mobile || ''
          }
        }) : []
      }
    case 'building': // 楼宇
      return {
        type: 'AttrBuilding',
        name: params.data.name || '',
        contactsInfo: params.data.pid ? params.data.pid.map(v => {
          return {
            contacts: v.name || '',
            telContacts: v.mobile || ''
          }
        }) : [],
        id: params.data._id || '',
        storey: []
      }
    case 'grid': // 网格
      return {
        type: 'AttrGrid',
        name: params.data.name || '',
        number: params.data.code || '',
        contactsInfo: params.data.pids ? params.data.pids.map(v => {
          return {
            contacts: v.name || '',
            telContacts: v.mobile || ''
          }
        }) : [],
        synopsis: params.data.desc || ''
      }
  }
}
