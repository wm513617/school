import {
  get,
  post
} from '../../../http/base'
const state = {
  serverId: '',
  departmentId: '',
  trafficDevType: '',
  trafficLane: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 0,
    count: 0
  }
}

const getters = {}

const mutations = {
  SID_DEPTID(state, payload) {
    state.serverId = payload.serverId
    state.departmentId = payload.departmentId
    state.trafficDevType = payload.devType
  },
  GET_TRAFFIC_SER_LANE(state, payload) {
    state.trafficLane.list = payload.data
    state.trafficLane.pages = Number(payload.headers['x-bsc-pages'])
    state.trafficLane.curPage = Number(payload.headers['x-bsc-cur'])
    state.trafficLane.count = Number(payload.headers['x-bsc-count'])
    state.trafficLane.limit = Number(payload.headers['x-bsc-limit'])
  }
}

const actions = {
  // 同步智能交通服务器组织及设备
  syncTrafficServer({
    commit,
    dispatch
  }, id) {
    const param = {
      url: '/setting/traffic/server/' + id + '/sync'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        // console.log(res)
      }).catch(err => reject(err))
    })
  },
  // 获取服务器机构下的所有车道信息
  getTrafficSerLane({
    commit,
    dispatch
  }, payload) {
    const param = {
      // query: {
      //   deptId: '',  // 所属部门id
      //   sid: '',     // 智能交通服务器文档id
      //   recursive: 0, // 是否获取子节点列表
      //   key: ''      // 搜索查询关键字
      // }
      query: payload,
      url: '/setting/traffic/lane'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('GET_TRAFFIC_SER_LANE', res)
        resolve(res)
        // console.log(res)
      }).catch(err => reject(err))
    })
  },
  // 获取指定车道设备报警配置
  getTrafficAlarmcfg({
    commit,
    dispatch
  }, payload) {
    const param = {
      // query: {
      //   id: '',     // 车道设备id
      //   sid: ''   // 智能交通服务器文档id
      // },
      query: payload,
      url: '/setting/traffic/alarmcfg'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        // console.log(res)
      }).catch(err => reject(err))
    })
  },
  // 批量配置车道设备报警配置
  trafficAlarmcfgBatch({
    commit
  }, payload) {
    const param = {
      body: payload,
      url: '/setting/traffic/alarmcfg/batch'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 报警配置弹窗（修改报警分类，自动获取此分类下的配置数据）
  getAlarmSortOne({
    dispatch
  }, id) {
    const param = {
      url: '/setting/alarmcfg/alarmtype' + id
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        // console.log(res)
      }).catch(err => reject(err))
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
