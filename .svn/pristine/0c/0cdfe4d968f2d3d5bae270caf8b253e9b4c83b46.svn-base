import _ from 'lodash'
import {
  getHistoryIntercomListApi,
  exportHistoryIntercomDetailApi,
  deleteHistoryIntercomDetailApi
} from 'src/http/intercom/historyIntercom.api'
const state = {
  dataListBlock: [], // 列表数据
  seletedData: [], // 选中的数据
  detailData: [], // 详情数据
  currentPlayVideo: '',
  hisPlayVideo: '',
  backParam: [], // 查询完资源数据后组装的数组
  downloadNum: 10
}

const mutations = {
  SET_INTERCOM_LIST(state, list) {
    state.dataListBlock = list
  },
  SET_SELECTED_LIST(state, list) {
    state.seletedData = list
  },
  SET_DETAIL_DATA(state, list) {
    state.detailData = list
  },
  SET_CURRENT_PLAY_VIDEO(state, palyod) {
    state.currentPlayVideo = palyod
  },
  SET_HIS_PLAY_VIDEO(state, palyod) {
    state.hisPlayVideo = palyod
  },
  SET_BACK_PARAM(state, list) {
    state.backParam = list
  },
  SET_QUERY_PARAM(state, data) {
    const row = data.row
    const cur = data.cur
    // row[cur] = {
    //   devIp: '192.168.20.44',
    //   devPort: 80,
    //   channel: 1
    // }
    const param = {
      devIp: row[cur] ? row[cur].devIp : (cur === 'askCamera' ? row.askIp : row.ackIp),
      devPort: row[cur] ? Number(row[cur].devPort) : cur === 'askCamera' ? Number(row.askPort) : Number(row.ackPort),
      name: row.askName || row.ackName || cur,
      channel: row[cur] ? Number(row[cur].channel) : 1,
      eventType: ['all'],
      streamType: row[cur] ? (row[cur].streamType || 'all') : 'main',
      dsServerId: !row[cur] ? row.dsServerId : '',
      startTime: row.startTime,
      endTime: row.endTime || (row.startTime + 1800),
      serverId: true
      // startTime: parseInt((new Date() - 1) / 1000) - 1800,
      // endTime: parseInt((new Date() - 1) / 1000)
    }
    let backParam = _.cloneDeep(state.backParam)
    backParam.push(param)
    state.backParam = backParam
  }
}

const actions = {
  setIntercomList({ commit }, data) { // 存储历史对讲列表数据
    commit('SET_INTERCOM_LIST', data)
  },
  setSeletedData({ commit }, data) { // 存储历史对讲选中的列表数据
    commit('SET_SELECTED_LIST', data)
  },
  setDetailData({ commit }, data) { // 存储当前选中的详情数据
    commit('SET_DETAIL_DATA', data)
  },
  setCurrentPlayVideo({ commit }, data) {
    commit('SET_CURRENT_PLAY_VIDEO', data)
  },
  setHisPlayVideo({ commit }, data) {
    commit('SET_HIS_PLAY_VIDEO', data)
  },
  setBackParam({ commit }, data) {
    commit('SET_BACK_PARAM', data)
  },
  getHistoryIntercomList({ commit }, data) { // 获取历史对讲列表数据
    return getHistoryIntercomListApi(data)
  },
  exportHistoryIntercomDetail({ commit }, data) {
    return exportHistoryIntercomDetailApi(data)
  },
  deleteHistoryIntercomDetail({ commit }, data) { // 删除历史对讲列表数据
    return deleteHistoryIntercomDetailApi(data)
  },
  getIntercomResource({ state, commit }, data) { // 请求资源数据前的参数整理
    const type = data.type
    const cur = data.cur
    commit('SET_BACK_PARAM', [])
    let selectedList = []
    if (type === 'detail') {
      selectedList.push(state.detailData)
      commit('SET_CURRENT_PLAY_VIDEO', cur)
      commit('SET_HIS_PLAY_VIDEO', cur)
    } else {
      if (cur) {
        selectedList.push(cur)
      } else {
        selectedList = _.cloneDeep(state.seletedData)
      }
    }
    for (let sel = 0; sel < selectedList.length; sel++) {
      if (type === 'detail') {
        commit('SET_QUERY_PARAM', {row: selectedList[sel], cur: cur})
      } else if (type === 'download') {
        commit('SET_QUERY_PARAM', {row: selectedList[sel], cur: 'askCamera'})
        commit('SET_QUERY_PARAM', {row: selectedList[sel], cur: 'ackCamera'})
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
