import { get } from '../../../http/base'
import { getOpsDeviceTreeApi, getChannelTableByTreeApi, getVideoDetailsDataApi, getVideoAnalysisDataApi } from '../../../http/opsManage/video.api'
import moment from 'moment'
// import Vue from 'vue'

const state = {
  deviceTreeData: [],
  channelsTableData: [],
  channelsCounts: 1000,
  // 录像详情
  videoDetailsData: [],
  videoDetailsCounts: 0,
  videoDetailsTitle: [],
  // 分析比对
  videoAnalysisData: [],
  videoAnalysisCounts: 0,
  videoAnalysisTitle: []
}
const mutations = {
  SET_DEVICETREE_DATA(state, data) {
    let tree = {}
    tree._id = 'server root'
    tree.name = '存储服务器'
    tree.isroot = true
    tree.order = 0
    tree.children = []
    data.map(d => {
      tree.children.push({
        _id: d,
        name: d,
        isroot: false,
        pid: 'server root',
        order: 1
      })
    })
    state.deviceTreeData = [tree]
  },
  SET_CHANNELSTABLE_DATA(state, data) {
    state.channelsTableData = data
  },
  SET_CHANNELS_COUNTS(state, payload) {
    state.channelsCounts = Number(payload.headers['x-bsc-count'])
  },
  SET_VIDEODETAILS_DATA(state, payload) {
    state.videoDetailsData = JSON.parse(JSON.stringify(payload))
  },
  SET_VIDEODETAILS_TITLE(state, payload) {
    state.videoDetailsTitle = JSON.parse(JSON.stringify(payload))
  },
  SET_VIDEODETAILS_COUNTS(state, payload) {
    state.videoDetailsCounts = JSON.parse(JSON.stringify(payload))
  },
  SET_VIDEOANALYSIS_DATA(state, payload) {
    state.videoAnalysisData = JSON.parse(JSON.stringify(payload))
  },
  SET_VIDEOANALYSIS_TITLE(state, payload) {
    state.videoAnalysisTitle = JSON.parse(JSON.stringify(payload))
  },
  SET_VIDEOANALYSIS_COUNTS(state, payload) {
    state.videoAnalysisCounts = JSON.parse(JSON.stringify(payload))
  }
}
const actions = {
  // 获取运维服务器列表
  getOpsDeviceTree({commit, state}, type) {
    return new Promise((resolve, reject) => {
      getOpsDeviceTreeApi({ servername: 'ds' }).then(res => {
        resolve(res.data)
        commit('SET_DEVICETREE_DATA', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取录像监测列表
  getChannelTableByTree({state, commit, rootState}, payload) {
    return new Promise((resolve, reject) => {
      getChannelTableByTreeApi(payload).then(res => {
        resolve(res.data)
        commit('SET_CHANNELSTABLE_DATA', res.data)
        commit('SET_CHANNELS_COUNTS', res)
      }).catch(err => {
        reject(err)
      })
    })
    // const params = {
    //   query: payload,
    //   url: '/setting/operation/video'
    // }
    // return new Promise((resolve, reject) => {
    //   get(params).then(res => {
    //     resolve(res)
    //     commit('SET_CHANNELSTABLE_DATA', res.data)
    //     commit('SET_CHANNELS_COUNTS', res)
    //   }).catch(err => reject(err.response.data.message))
    // })
  },
  // 获取通道录像详情
  getVideoDetailsData({commit, state}, payload) {
    const params = {
      page: payload.page,
      limit: payload.limit,
      RateStatus: payload.onlineRate,
      ip: payload.ip,
      channel: payload.channel,
      port: payload.port
    }
    return new Promise((resolve, reject) => {
      getVideoDetailsDataApi(params).then(res => {
        resolve(res.data)
        let counts = Number(res.headers['x-bsc-count'])
        let title = []
        let data = []
        res.data.forEach((e, index) => {
          title.push({ time: moment(e.createTime * 1000).format('YYYY-MM-DD') })
          const arr = e.Log.reverse()
          data[index] = []
          arr.forEach((j, i) => {
            if (i > 0) {
              data[index].push({
                startTime: arr[i - 1].time * 1000,
                endTime: arr[i].time * 1000,
                type: (arr[i - 1].type === 1 ? 1 : 2)
              })
            }
          })
        })
        commit('SET_VIDEODETAILS_DATA', data)
        commit('SET_VIDEODETAILS_TITLE', title)
        commit('SET_VIDEODETAILS_COUNTS', counts)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 获取通道录像详情和设备详情
  getVideoAnalysisData({commit, state}, payload) {
    const params = {
      page: payload.page,
      limit: payload.limit,
      RateStatus: payload.onlineRate,
      ip: payload.ip,
      channel: payload.channel,
      port: payload.port
    }
    return new Promise((resolve, reject) => {
      getVideoAnalysisDataApi(params).then(res => {
        resolve(res.data)
        let counts = Number(res.headers['x-bsc-count'])
        let title = []
        let data = []
        res.data.forEach((e, index) => {
          title.push({ time: moment(e.createTime * 1000).format('YYYY-MM-DD') })
          title.push({ time: '' })
          const devLogs = e.devLog.Log.reverse()
          const recodeLogs = e.recodeLog.Log.reverse()
          data[index * 2] = []
          data[index * 2 + 1] = []
          recodeLogs.forEach((j, i) => {
            if (i > 0) {
              data[index * 2].push({
                startTime: recodeLogs[i - 1].time * 1000,
                endTime: recodeLogs[i].time * 1000,
                type: (recodeLogs[i - 1].type === 1 ? 1 : 2)
              })
            }
          })
          devLogs.forEach((j, i) => {
            if (i > 0) {
              data[index * 2 + 1].push({
                startTime: devLogs[i - 1].time * 1000,
                endTime: devLogs[i].time * 1000,
                type: (devLogs[i - 1].type === 1 ? 1 : 2)
              })
            }
          })
        })
        commit('SET_VIDEOANALYSIS_DATA', data)
        commit('SET_VIDEOANALYSIS_TITLE', title)
        commit('SET_VIDEOANALYSIS_COUNTS', counts)
      })
    })
  }
}
export default {
  state,
  mutations,
  actions
}
