import { get, post, put, remove } from 'src/http/base'
import toTreeData from 'src/assets/js/toTreeData'

import { getSocket } from 'src/socket/socket.js'
const state = {
  moreFlag: false,
  faceSocketState: true,
  realtimeList: [
    // { 本地测试数据
    //   time: '111',
    //   plateNo: '000',
    //   vehiclePic: '/static/noImg1.png',
    //   gateName: '555'
    // }
  ],
  contrastList: [
    // { // 本地测试数据
    //   time: ' 秒数时间戳  ，过车时间',
    //   plateNo: 'String, 车牌号码',
    //   vehiclePic: '/static/noImg1.png',
    //   gateName: 'String,位置信息',
    //   recordName: 'String,驾驶员姓名',
    //   recordPlateNo: 'String,备案车牌号码',
    //   recordDriverPic: '/static/noImg1.png',
    //   driverPic: '/static/noImg1.png',
    //   recordContact: '备案驾驶员电话',
    //   similar: 'Number,(如89)',
    //   checkResult: 'Number(0:图片提取失败，1:人车核检成功，2：人车核检失败)'
    // }
  ],
  checkFailNum: 0, // 核验失败次数
  carBase: {
    type: [],
    color: [],
    direction: [],
    brand: [],
    model: []
  },
  level: [
    {
      value: 1,
      label: '1级'
    },
    {
      value: 2,
      label: '2级'
    },
    {
      value: 3,
      label: '3级'
    },
    {
      value: 4,
      label: '4级'
    },
    {
      value: 5,
      label: '5级'
    },
    {
      value: 6,
      label: '6级'
    },
    {
      value: 7,
      label: '7级'
    },
    {
      value: 8,
      label: '8级'
    },
    {
      value: 9,
      label: '9级'
    }
  ],
  // 精准布控
  deployCar: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 10,
    count: 0
  },
  // 黑名单布控
  deployBlack: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 0,
    count: 0
  },
  allBlackCar: [],
  query: {
    carList: [],
    pages: 1,
    curPage: 1,
    limit: 20,
    dataCount: 0
  },
  analyze: {
    carList: [],
    curPage: 1,
    limit: 10,
    dataCount: 0
  },
  // 获取实时过车页面机构树
  videoOrg: [],
  peopleVehicleOrg: [], // 人车同检机构树数据
  socketState: true,
  isDeployCar: false,
  vehicleRealTime: [],
  vehicleDefenseRealTime: [],
  openArr: [],
  videoConnect: true,
  showCar: {},
  curPassCarInfo: {},
  vehicleSocketState: true,
  vehicleSocketDefenseState: true
}
const getters = {
  carBase(state) {
    return state.vehicle
  },
  carType(state) {
    return state.carBase.type
  },
  carColor(state) {
    return state.carBase.color
  },
  carBrand(state) {
    return state.carBase.brand
  }
}
const mutations = {
  UPDATE_CHECK_FAILNUM(state, data) {
    state.checkFailNum = data
  },
  SET_MOREFLAG(state, data) {
    state.moreFlag = data
  },
  CHANGE_VEHICLESOCKETSTATE(state, data) {
    state.vehicleSocketState = false
  },
  CHANGE_VEHICELSOCKETDEFENSSTATE(state, data) {
    state.vehicleSocketState = false
  },
  GETINFO_CURPASSCAR(state, data) {
    state.curPassCarInfo = data
  },
  // 从字典获取车辆类型
  GET_CAR_TYPE(state, payload) {
    state.carBase.type = []
    for (var item of payload) {
      state.carBase.type.push({
        value: Number(item.code),
        label: item.name
      })
    }
  },
  // 从字典获取车辆颜色
  GET_CAR_COLOR(state, payload) {
    state.carBase.color = []
    for (var item of payload) {
      state.carBase.color.push({
        value: Number(item.code),
        label: item.name
      })
    }
  },
  // 获取实时过车页面机构树
  GET_VIDEO_ORG(state, payload) {
    state.videoOrg = toTreeData(payload)
  },
  // 获取人车同检页面机构树
  GET_PEOPLE_ORG(state, payload) {
    state.peopleVehicleOrg = toTreeData(payload)
  },
  GET_ALL_BLACKCAR(state, payload) {
    state.allBlackCar = []
    for (var item of payload.data) {
      state.allBlackCar.push({
        value: item.licence,
        label: item.licence
      })
    }
  },
  EDIT_MANAGE_CAR(state, payload) {
    var tmp = state.manageCar.list.find(item => {
      return item._id === payload._id
    })
    Object.assign(tmp, payload)
  },
  DELETE_MANAGE_CAR(state, payload) {
    if (payload._id) {
      for (let j = 0; j < state.manageCar.list.length; j++) {
        if (payload._id === state.manageCar.list[j]._id) {
          state.manageCar.list.splice(j, 1)
        }
      }
    } else {
      for (let i = 0; i < payload.length; i++) {
        for (let j = 0; j < state.manageCar.list.length; j++) {
          if (payload[i]._id === state.manageCar.list[j]._id) {
            state.manageCar.list.splice(j, 1)
          }
        }
      }
    }
  },
  // 布控页面
  GET_ACCUR_DEPLOY(state, payload) {
    state.deployCar.list = payload.data
    state.deployCar.pages = Number(payload.headers['x-bsc-pages'])
    state.deployCar.curPage = Number(payload.headers['x-bsc-cur'])
    state.deployCar.count = Number(payload.headers['x-bsc-count'])
    state.deployCar.limit = Number(payload.headers['x-bsc-limit'])
  },
  GET_BLACK_DEPLOY(state, payload) {
    state.deployBlack.list = payload.data
    state.deployBlack.pages = Number(payload.headers['x-bsc-pages'])
    state.deployBlack.curPage = Number(payload.headers['x-bsc-cur'])
    state.deployBlack.count = Number(payload.headers['x-bsc-count'])
    state.deployBlack.limit = Number(payload.headers['x-bsc-limit'])
  },
  // 车辆智能分析获取车辆
  GET_VEHICLE_ANALYZE(state, payload) {
    state.analyze.carList = payload.data
    state.analyze.dataCount = Number(payload.headers['x-bsc-count'])
    state.analyze.limit = Number(payload.headers['x-bsc-pages'])
    state.analyze.curPage = Number(payload.headers['x-bsc-cur'])
  },
  // 获取行车方向列表
  GET_DIRECTION(state, payload) {
    state.carBase.direction = []
    for (var i in payload) {
      state.carBase.direction.push({
        value: payload[i],
        label: payload[i]
      })
    }
  },
  // 获取车辆品牌列表
  GET_BRAND(state, payload) {
    state.carBase.brand = []
    for (var i in payload) {
      if (payload[i]) {
        state.carBase.brand.push({
          value: payload[i],
          label: payload[i]
        })
      }
    }
  },
  // 根据车辆品牌获取车辆型号列表
  GET_MODEL(state, payload) {
    state.carBase.model = []
    for (var i in payload) {
      state.carBase.model.push({
        value: payload[i],
        label: payload[i]
      })
    }
  },
  // 获取过车信息
  GET_QUERY_CARLIST(state, payload) {
    state.query.carList = payload.data
    state.query.pages = Number(payload.headers['x-bsc-pages'])
    state.query.curPage = Number(payload.headers['x-bsc-cur'])
    state.query.count = Number(payload.headers['x-bsc-count'])
    state.query.limit = Number(payload.headers['x-bsc-limit'])
  },
  // 实时过车socket
  UPDATA_REALTIME_VEHICLE(state, data) {
    if (state.videoConnect) {
      // if (true) {
      if (state.openArr.indexOf(data.channelid) > -1) {
        if (state.videoConnect) {
          state.vehicleRealTime.unshift(data)
          if (!state.isDeployCar) {
            state.showCar = state.vehicleRealTime[0]
          }
        }
        if (state.vehicleRealTime.length > 10) {
          state.vehicleRealTime.length = 10
        }
      }
    }
  },
  // 实时过车布控车辆socket
  UPDATA_REALTIME_DEFENSEVEHICLE(state, data) {
    if (!state.videoConnect) {
      return
    }

    state.vehicleDefenseRealTime.unshift(data)
    if (!state.isDeployCar) {
      state.showCar = state.vehicleDefenseRealTime[0]
      state.isDeployCar = true
    }
    if (state.vehicleDefenseRealTime.length > 10) {
      state.vehicleDefenseRealTime.length = 10
    }
  },
  CHANGE_VIDEOCONNECT(state, data) {
    state.videoConnect = data
  },
  CHANGE_DEPLOYCAR(state, data) {
    state.isDeployCar = false
  },
  CHANGE_OPENARR(state, data) {
    state.openArr = data
  },
  IMAGE_PERSON_ERROR(state, paloay) {
    paloay.type === 'realtimeList' && (state.realtimeList[paloay.index].vehiclePic = state.realtimeList[paloay.index].vehiclePic.split('?')[0] + '?' + Math.random())
    paloay.type === 'contrastList' && (state.contrastList[paloay.index].recordDriverPic = state.contrastList[paloay.index].recordDriverPic.split('?')[0] + '?' + Math.random())
  },
  GET_REALTIME_PASS(state, data) {
    state.realtimeList = data
  },
  CAHANGE_VERIFACE_SOCKETSTATE(state) {
    state.faceSocketState = false
  },
  PEOPLE_CAR_MATCH(state, data) {
    state.contrastList = data
  },
  UPDATE_VEHICLE_RIGHT(state, formatData) {
    state.contrastList.unshift(formatData)
    if (state.contrastList.length > 64) {
      state.contrastList.length = 64
    }
  },
  UPDATE_VEHICLE_REALTIMEDATA(state, formatData) {
    state.realtimeList.unshift(formatData)
    if (state.realtimeList.length > 64) {
      state.realtimeList.length = 64
    }
  }
}
const actions = {
  // 实时过车socket
  getSocketRealTime({ state, commit }) {
    if (state.vehicleSocketState) {
      commit('CHANGE_VEHICLESOCKETSTATE', false)
      getSocket().on('server:vehicleRealTime', data => {
        if (state.openArr.length) {
          commit('UPDATA_REALTIME_VEHICLE', data)
        }
      })
    }
  },
  getSocketDefenseVehicle({ state, commit }) {
    if (state.vehicleSocketDefenseState) {
      commit('CHANGE_VEHICELSOCKETDEFENSSTATE', false)
      getSocket().on('server:vehicleDefense', data => {
        commit('UPDATA_REALTIME_DEFENSEVEHICLE', data)
      })
    }
  },
  // 获取人车同检实时过车页面下方车辆图片展示
  realTimePass({ commit }, payload) {
    const param = {
      url: '/intelliTraffic/peopleVehicle/pass'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('GET_REALTIME_PASS', res.data)
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取页面右侧报警
  peopleAndCarsMatch({ commit }, payload) {
    const param = {
      url: '/intelliTraffic/peopleVehicle/check'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('PEOPLE_CAR_MATCH', res.data)
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取页面失败次数
  failCountGet({ commit }, payload) {
    const param = {
      url: '/intelliTraffic/peopleVehicle/failCount'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('UPDATE_CHECK_FAILNUM', res.data)
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 人车同检socket接收
  getVehicleRealTimeData({ state, commit }) {
    if (state.faceSocketState) {
      commit('CAHANGE_VERIFACE_SOCKETSTATE', false)
      getSocket().on('passVehicleData', data => {
        if (!data) { return }
        commit('UPDATE_VEHICLE_REALTIMEDATA', data)
      })
      getSocket().on('vehicleCheckData', data => {
        if (!data) { return }
        commit('UPDATE_VEHICLE_RIGHT', data)
      })
      getSocket().on('vehicleCheckFailureNo', data => {
        if (!data) { return }
        commit('UPDATE_CHECK_FAILNUM', data)
      })
    }
    // }
  },
  // 从字典获取车辆类型
  getCarType({ commit, dispatch }) {
    const param = {
      url: '/setting/dict/type?type=vehicle'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('GET_CAR_TYPE', res.data)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 从字典获取车辆颜色
  getCarColor({ commit, dispatch }) {
    const param = {
      url: '/setting/dict/type?type=vehicleColor'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('GET_CAR_COLOR', res.data)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  getAllCarTypeList({ commit }, payload) {
    const param = {
      url: '/setting/dict/type?type=vehicle'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取所有路口列表
  getAllCrossList({ commit }, payload) {
    const param = {
      url: '/vehicle/crossing/list'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取实时过车页面机构树
  getVideoOrg({ commit, dispatch }, payload) {
    const param = {
      url: '/vehicle/organization'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_VIDEO_ORG', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取人车同检机构树
  getPeopleVehicleOrg({ commit, dispatch }, payload) {
    const param = {
      url: '/intelliTraffic/peopleVehicle/tree'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_PEOPLE_ORG', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 添加车辆信息
  addVehicle({ state }, payload) {
    const param = {
      body: payload,
      url: '/vehicle'
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 车辆管理批量修改
  batEditVehicle({ commit }, payload) {
    const param = {
      body: payload,
      url: '/vehicle/batch'
    }
    return new Promise((resolve, reject) => {
      put(param, {
        headers: {
          'x-bsc-ids': payload.ids
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 车辆管理批量删除
  batMoveVehicle({ commit }, payload) {
    const param = {
      query: {
        ids: payload.ids.join(',')
      },
      url: '/vehicle/batch'
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        headers: {
          'x-bsc-ids': payload.ids
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 修改车辆信息
  editVehicle({ commit }, payload) {
    const param = {
      body: payload,
      url: '/vehicle/' + payload._id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 删除车辆信息
  deleteVehicle({ commit, state }, payload) {
    const param = {
      query: payload,
      url: '/vehicle'
    }
    if (payload.id) {
      param.url = '/vehicle/' + payload.id
    }
    return new Promise((resolve, reject) => {
      remove(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取车辆信息
  getVehicle({ commit, dispatch }, payload) {
    const param = {
      query: payload,
      url: '/vehicle'
    }
    if (payload && payload.id) {
      param.url = '/vehicle/' + payload.id
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取所有未布控的黑名单车辆
  getAllBlackVehicle({ commit, dispatch }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/blacklist'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_ALL_BLACKCAR', res)
        })
        .catch(err => reject(err))
    })
  },
  // 智能研判搜索
  searchAnalyze({ commit }, payload) {
    var param = {
      query: payload,
      url: 'vehicle/identify'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          commit('GET_VEHICLE_ANALYZE', res)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 智能研判详细信息
  searchAnalyzeInfo({ commit }, payload) {
    var param = {
      query: payload,
      url: 'vehicle/identify/info',
      headers: {
        'x-bsc-res': payload.scope || ''
      }
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 输入车牌号自动填充车辆信息
  getCarInformation({ commit, dispatch }, payload) {
    const param = {
      url: '/vehicle/one?licence=' + payload
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取精准布控列表
  getAccurateDeploy({ commit, dispatch }, payload) {
    // var brand = payload.brand
    // delete payload.brand
    const param = {
      query: payload,
      url: '/vehicle/defense?type=1'
      // headers: {
      //   'x-bsc-brands': brand
      // }
    }
    param.query.limit = 50
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_ACCUR_DEPLOY', res)
        })
        .catch(err => reject(err))
    })
  },
  // 修改布控
  editDeploy({ commit }, payload) {
    const param = {
      body: payload,
      url: '/vehicle/defense/' + payload._id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 添加布控
  addDeploy({ commit }, payload) {
    const param = {
      body: payload,
      url: '/vehicle/defense'
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 删除布控
  deleteDeploy({ commit }, payload) {
    const param = {
      url: '/vehicle/defense/' + payload
    }
    return new Promise((resolve, reject) => {
      remove(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 批量删除布控
  deleteBatchDeploy({ commit }, payload) {
    const param = {
      url: '/vehicle/defense/batch'
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        headers: {
          'x-bsc-ids': payload.join(',')
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 批量修改 撤控、重启布控
  editBatchDeploy({ commit }, payload) {
    const param = {
      body: payload.body,
      url: '/vehicle/defense/batch'
    }
    return new Promise((resolve, reject) => {
      put(param, {
        headers: {
          'x-bsc-ids': payload.list.join(',')
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取黑名单布控列表
  getBlackDeploy({ commit, dispatch }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/defense?type=2'
    }
    param.query.limit = 50
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_BLACK_DEPLOY', res)
        })
        .catch(err => reject(err))
    })
  },
  // 车行方向列表
  getDirection({ commit, dispatch }, payload) {
    const param = {
      url: '/vehicle/crossing/lane/direction'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_DIRECTION', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 车辆品牌列表
  getBrand({ commit, dispatch }, payload) {
    const param = {
      url: '/vehicle/brand'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_BRAND', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 根据车辆品牌获取车辆型号列表
  getModel({ commit, dispatch }, payload) {
    const param = {
      query: {
        brand: payload
      },
      url: '/vehicle/model'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_MODEL', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 查询过车信息
  queryPassCar({ commit }, payload) {
    const param = {
      query: payload.data || {},
      url: '/vehicle/identify',
      headers: {
        'x-bsc-channels': payload.videoChannels.join(',')
      }
    }
    param.query.limit = 50
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_QUERY_CARLIST', res)
        })
        .catch(err => reject(err))
    })
  },
  // 通过车辆移动为管理车辆
  movePassCar({ commit }, payload) {
    const param = {
      body: payload,
      url: '/vehicle/identify/copy2veh'
    }
    return new Promise((resolve, reject) => {
      post(param, {
        headers: {
          'x-bsc-ids': payload.ids
        }
      })
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 每日统计 车流量
  getStatDayFlow({ commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/statistic/inout'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 每日统计 路口
  getStatDayCross({ commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/statistic/todycrossing'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 每日统计 车辆品牌
  getStatDayBrand({ commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/statistic/todybrand'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 车流量统计
  getStatFlowData({ commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/statistic/flow'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 车辆类型统计
  getStatVehicleType({ commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/statistic/vehicletype'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 路口统计
  getStatCrossData({ commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/statistic/crossing',
      headers: {
        'x-bsc-ids': payload.cross || ''
      }
    }
    console.log(payload, 1173)
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 所有路口时间段统计
  getStatCrossVt({ commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/statistic/crossingvt'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 获取警情类型
  getDictType({ commit }, payload) {
    const param = {
      query: payload,
      url: '/setting/dict/type'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 获取所有警情列表
  getStatDefenseList({ commit }, payload) {
    const param = {
      query: payload,
      url: 'vehicle/statistic/defenselist'
    }
    param.query.limit = 50
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res))
        .catch(err => reject(err))
    })
  },
  // 警情统计
  getStatWarningData({ commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/statistic/defense',
      headers: {
        'x-bsc-ids': payload.cross || ''
      }
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 首页密度较大区域
  homeGetCurMaxZone({ commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/statistic/curmaxzone'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 首页 入园车辆分析
  homeGetEntryVehicleList({ commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/statistic/todyentrychiclelist'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 首页 其他统计，出入园，当前布控等
  homeGetSomeCount({ commit }, payload) {
    var param = {
      query: payload,
      url: '/vehicle/statistic/somecount'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 首页 车辆类型统计
  homeGetVehicleType({ commit }, payload) {
    var param = {
      query: payload,
      url: '/vehicle/statistic/todychicletype'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 首页 车辆品牌统计
  homeGetVehicleBrand({ commit }, payload) {
    var param = {
      query: payload,
      url: '/vehicle/statistic/brand'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => resolve(res.data))
        .catch(err => reject(err))
    })
  },
  // 布控验证车牌号存在？
  licenceNumber({ commit }, payload) {
    return new Promise((resolve, reject) => {
      get({
        query: payload,
        url: '/vehicle/defense/check'
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 车辆管理验证车牌号存在？
  licenceNumberManage({ commit }, payload) {
    return new Promise((resolve, reject) => {
      get({
        query: payload,
        url: '/vehicle/check'
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  getVehicleCarTree({ commit }, payload) {
    return new Promise((resolve, reject) => {
      get({
        url: '/intelliTraffic/record/hikDevice'
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 单条 车辆记录详情
  getVehicleInfo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      get({
        query: payload,
        url: '/intelliTraffic/record/historyRecord'
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
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
