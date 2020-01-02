import {
  get
} from 'http/base'
const state = {
  // 是否绘制区域
  isDrawArea: false,
  // 区域位置信息
  areaLoc: '',
  // 是否在楼层外
  isOuter: true,
  // 应用模式
  isAppOuter: true,
  appPageDetail: '',
  editPageDetail: '',
  isCloseAllGrid: true,
  isCloseAllBuild: true,
  // 网格分页列表
  gridPagingList: [],
  // 网格分页参数
  gridPaging: {
    // 总条数
    count: 0,
    // 当前页
    cur: 0,
    // 页大小
    limit: 0,
    // 总页数
    pages: 0
  },
  // 楼宇分页列表
  buildPagingList: {},
  // 楼宇分页参数
  buildPaging: {
    // 总条数
    count: 0,
    // 当前页
    cur: 0,
    // 页大小
    limit: 0,
    // 总页数
    pages: 0
  },
  areaDrawColor: 'rgba(255, 0, 0, 0.5)',
  areaStyle: {},
  appBuildList: [], // 应用模式地图上所有的网格,
  activeMapScope: {
    extent: '',
    center: ''
  },
  allZone: { // 应用模式，地图概要统计的默认数据
    grid: 0,
    building: 0,
    ipc: {
      ipcOnline: 0,
      ipcOffline: 0
    },
    fireAlarm: {
      fireOnline: 0,
      fireOffline: 0
    }
  },
  allZoneList: [],
  sendMessageModel: false
}
const getters = {

}
const mutations = {
  // 应用模式地图上所有的网格
  SET_APPBUILD_LIST(state, data) {
    state.appBuildList = data
  },
  // 触发是否绘制区域
  SET_AREA_ADD(state, data) {
    state.isDrawArea = data
    state.areaLoc = ''
  },
  // 设置网格位置信息
  SET_AREA_LOC(state, data) {
    state.areaLoc = data
  },
  // 设置是否进入楼层
  SET_ISOUTER_STATE(state, data) {
    state.isOuter = data
  },
  // 设置是否进入应用模式楼层
  SET_ISAPPOUTER_STATE(state, data) {
    state.isAppOuter = data
  },
  // 地图应用模式弹框控制
  SET_APPDETAIL_STATE(state, data) {
    state.appPageDetail = data
  },
  // 地图编辑模式弹框控制
  SET_EDITDETAIL_STATE(state, data) {
    state.editPageDetail = data
  },
  // 关闭所有网格
  SET_CLOSEALLGRID_STATE(state, data) {
    state.isCloseAllGrid = data
  },
  // 关闭所有楼宇
  SET_CLOSEALLBUILD_STATE(state, data) {
    state.isCloseAllBuild = data
  },
  // 获取网格分页
  SET_GRIDPADING_LIST(state, data) {
    state.gridPagingList = data.data
    // 总条数
    state.gridPaging.count = parseInt(data.headers['x-bsc-count'])
    // 当前页
    state.gridPaging.cur = parseInt(data.headers['x-bsc-cur'])
    // 页大小
    state.gridPaging.limit = parseInt(data.headers['x-bsc-limit'])
    // 总页数
    state.gridPaging.pages = parseInt(data.headers['x-bsc-pages'])
  },
  // 获取楼宇分页
  SET_BUILDPADING_LIST(state, data) {
    state.buildPagingList = data.data
    // 总条数
    state.buildPaging.count = parseInt(data.headers['x-bsc-count'])
    // 当前页
    state.buildPaging.cur = parseInt(data.headers['x-bsc-cur'])
    // 页大小
    state.buildPaging.limit = parseInt(data.headers['x-bsc-limit'])
    // 总页数
    state.buildPaging.pages = parseInt(data.headers['x-bsc-pages'])
  },
  // 设置绘制区域颜色
  SET_AREA_FILLCOLOR(state, data) {
    state.areaDrawColor = data
  },
  // 设置区域样式
  SET_AREASTYLE_DATA(state, data) {
    state.areaStyle = data
  },
  // 动态中心点和范围
  SET_ACTIVEEXTENT_DATA(state, data) {
    state.activeMapScope = data
  },
  // 所有区块
  GET_ALLZONE_LIST(state, data) {
    state.allZone = data
  },
  // 快速定位所有区块
  GET_ALLMAPZONE_LIST(state, data) {
    state.allZoneList = data
  },
  // 单兵消息发送
  SET_SENDMESSAGE_STATE(state, data) {
    state.sendMessageModel = data
  }
}

const actions = {
  // 提交editdetail状态
  setEditDetail({
    commit
  }, data) {
    commit('SET_EDITDETAIL_STATE', data)
  },
  // 获取网格列表
  getGridPaging({
    commit
  }, playod) {
    const param = {
      url: '/map/grid/mapid?mapId=' + playod.id + '&gridpage=' + playod.page + '&gridlimit=' + playod.limit + '&seek=' + encodeURIComponent(playod.name.toString())
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('SET_GRIDPADING_LIST', res)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  getBuildPaging({
    commit
  }, playod) {
    const param = {
      url: '/map/building/mapid?mapId=' + playod.id + '&buildpage=' + playod.page + '&buildlimit=' + playod.limit + '&seek=' + encodeURIComponent(playod.name.toString())
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('SET_BUILDPADING_LIST', res)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 地图概要的统计数据
  getAllZone({
    commit
  }, playod) {
    const param = {
      url: '/map/zone/all?mapId=' + playod
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('GET_ALLZONE_LIST', res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  // 快速定位
  getAllMaPZone({
    commit
  }, playod) {
    const param = {
      url: '/map/zone/resource?mapId=' + playod + '&limit=4'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('GET_ALLMAPZONE_LIST', res.data)
      }).catch(err => {
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
