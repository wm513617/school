/**
 * 地图编辑相关状态
 */

const state = {
  pointState: { // 点位状态
    video: { // 视频
      boltipc: true, // 枪机
      redBoltipc: true, // 红外枪机
      halfBallipc: true, // 半球
      fastBallipc: true, // 快球
      allViewipc: true, // 全景
      verface: false, // 人脸抓拍
      traffic: false, // 交通抓拍
      sector: false // 可视域
    },
    alarm: { // 报警
      commonAlarm: false, // 普通报警
      fireAlarm: false, // 消防报警
      alarmBox: false, // 报警箱
      alarmColumn: false // 报警柱
    },
    isPatrol: false, // 巡更
    isDoorControl: false // 门禁
  },
  // 地图编辑模式右侧页面
  FMEditRightPage: {
    page: '',
    detail: 'show'
  }
}

const getters = {
  video(state) { // 视频
    return state.pointState.video
  },
  boltipc(state, getters) { // 枪机
    return getters.video.boltipc
  },
  redBoltipc(state, getters) { // 红外枪机
    return getters.video.redBoltipc
  },
  halfBallipc(state, getters) { // 半球
    return getters.video.halfBallipc
  },
  fastBallipc(state, getters) { // 快球
    return getters.video.fastBallipc
  },
  allViewipc(state, getters) { // 全景
    return getters.video.allViewipc
  },
  verface(state, getters) { // 人脸抓拍
    return getters.video.verface
  },
  traffic(state, getters) { // 交通抓拍
    return getters.video.traffic
  },
  sector(state, getters) { // 可视域
    return getters.video.sector
  },
  alarm(state) { // 报警
    return state.pointState.alarm
  },
  commonAlarm(state, getters) { // 普通报警
    return getters.alarm.commonAlarm
  },
  fireAlarm(state, getters) { // 消防报警
    return getters.alarm.fireAlarm
  },
  alarmBox(state, getters) { // 报警箱
    return getters.alarm.alarmBox
  },
  alarmColumn(state, getters) { // 报警柱
    return getters.alarm.alarmColumn
  },
  isPatrol(state) { // 巡更
    return state.pointState.isPatrol
  },
  isDoorControl(state) { // 门禁
    return state.pointState.isDoorControl
  },
  FMEditRightPage: state => { // 图编辑模式右侧页面
    return state.FMEditRightPage
  }
}

const mutations = {
  CHANGE_POINT_STATE(state, params) { // 改变点位状态
    if (params && params instanceof Array && params.length) { // 参数为有效数组时
      let field1 = params[0]
      if (params.length === 1) {
        state.pointState[field1] = !state.pointState[field1]
      } else if (params.length === 2) {
        let field2 = params[1]
        state.pointState[field1][field2] = !state.pointState[field1][field2]
      }
    }
  },
  // 地图编辑模式右侧页面
  SET_EDIT_FMRIGHT_PAGE_STATE(state, data) {
    if (data.detail === 'show') {
    }
    state.FMEditRightPage = data
  }
}

const actions = {
  changePointState({commit}, params) { // 改变点位状态
    commit('CHANGE_POINT_STATE', params)
  },
  changeFMeditRightPage({commit}, data) {
    commit('SET_EDIT_FMRIGHT_PAGE_STATE', data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
