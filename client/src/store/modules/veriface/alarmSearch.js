import { getbaseraryApi, getAlarmConditionApi, getAlarmExportApi, getAlarmCountApi, addAlarmExportApi, getAlarmExportListApi, deleteAlarmExportApi } from 'src/http/veriface/alarmSearch.api'
const state = {
  defaultSearch: false, // 报警 | 路人检索 是否默认查询当天的记录
  imageToSearch: '', // 以图搜图 跳转后直接以图检索
  trackImgToSer: '', // 轨迹追踪 跳转后直接以图检索
  alarmList: [],
  baserary: [],
  alarmPageinfo: {}
}

const mutations = {
  SET_DEFAULT_SEARCH(state, v) {
    state.defaultSearch = v
  },
  SET_IMAGE_URL(state, v) {
    state.imageToSearch = v
  },
  SET_TRACK_TMG_SER(state, v) {
    state.trackImgToSer = v
  },
  SET_ALARM_LIST(state, list) {
    state.alarmList = list
  },
  SET_BASERARY(state, arr) {
    const list = []
    for (let i = 0; i < arr.length; i++) {
      list.push({
        value: arr[i].name,
        label: arr[i]._id
      })
    }
    state.baserary = list
  },
  SET_ALARM_PAGE_INFO(state, info) {
    if (info) {
      state.alarmPageinfo.count = Number(info['x-bsc-count']) // 总数
      state.alarmPageinfo.pages = Number(info['x-bsc-pages']) // 总页数
      state.alarmPageinfo.current = Number(info['x-bsc-cur']) // 当前页
      state.alarmPageinfo.limit = Number(info['x-bsc-limit']) // 每页限定数据
    } else {
      state.alarmPageinfo.pages = 0
      state.alarmPageinfo.count = 0
      state.alarmPageinfo.current = 1
      state.alarmPageinfo.limit = 20
    }
  }
}
const actions = {
  getbaserary({ state, commit }) {
    return new Promise((resolve, reject) => {
      getbaseraryApi()
        .then(res => {
          commit('SET_BASERARY', res.data)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getAlarmCondition({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      getAlarmConditionApi(payload)
        .then(res => {
          commit('SET_ALARM_LIST', res.data)
          // commit('SET_ALARM_PAGE_INFO', res.headers)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  setDefaultSearch({ state, commit }, payload) {
    commit('SET_DEFAULT_SEARCH', payload)
  },
  setImageUrl({ state, commit }, payload) {
    commit('SET_IMAGE_URL', payload)
  },
  getAlarmExport({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      getAlarmExportApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getAlarmCount({ state }, payload) {
    return new Promise((resolve, reject) => {
      getAlarmCountApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  addAlarmExport({ state }, payload) {
    return new Promise((resolve, reject) => {
      addAlarmExportApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getAlarmExportList({ state }, payload) {
    return new Promise((resolve, reject) => {
      getAlarmExportListApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  deleteAlarmExport({ state }, payload) {
    return new Promise((resolve, reject) => {
      deleteAlarmExportApi(payload)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  }
}
export default {
  state,
  mutations,
  actions
}
