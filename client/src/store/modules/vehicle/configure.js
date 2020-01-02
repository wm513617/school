import { get, post, put, remove } from 'src/http/base'
import toTreeData from 'src/assets/js/toTreeData'

const state = {
  // 配置页面
  activeOrgId: '',
  // 增加禁用
  isResAdd: true,
  crossingList: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 5,
    count: 0
  },
  organTreeData: [],
  resourceList: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 10,
    count: 0
  },
  editResource: {},
  // 车道数据
  laneList: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 5,
    count: 0
  },
  // resourceTreeRoot: '',
  resourceTreeData: [],
  serverList: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 10,
    count: 0
  },
  resourceServerArr: [],
  cameraTreeData: [],
  // 频道号
  channelIds: []
}
const getters = {}
const mutations = {
  // 配置页面
  TREE_ACTIVE_ID(state, payload) {
    state.activeOrgId = payload
    if (state.activeOrgId === state.organTreeData[0]._id) {
      state.isResAdd = true
      return
    }
    state.isResAdd = false
  },
  ORGAN_TREE_GET(state, payload) {
    state.organTreeData = toTreeData([payload])
  },
  CROSSING_GET(state, payload) {
    state.crossingList.list = payload.data
    state.crossingList.pages = Number(payload.headers['x-bsc-pages'])
    state.crossingList.curPage = Number(payload.headers['x-bsc-cur'])
    state.crossingList.count = Number(payload.headers['x-bsc-count'])
    state.crossingList.limit = Number(payload.headers['x-bsc-limit'])
  },
  // 获取资源列表
  RESOURCE_GET(state, payload) {
    state.resourceList.pages = Number(payload.headers['x-bsc-pages'])
    state.resourceList.curPage = Number(payload.headers['x-bsc-cur'])
    state.resourceList.count = Number(payload.headers['x-bsc-count'])
    state.resourceList.limit = Number(payload.headers['x-bsc-limit'])
    state.resourceList.list = []
    for (const item of payload.data) {
      const resourceListItem = {
        _id: item._id,
        name: item.name,
        channelid: item.channelid,
        eidName: item.eid.name,
        eidIp: item.eid.ip,
        server: '',
        hasserver: item.hasserver
      }
      if (item.server) {
        resourceListItem.server = item.server
      }
      state.resourceList.list.push(resourceListItem)
    }
  },
  // 修改资源列表
  RESOURCE_EDIT(state, payload) {
    state.editResource = {
      _id: payload._id,
      name: payload.name,
      channelid: payload.channelid,
      server: payload.server,
      hasserver: payload.hasserver
    }
    if (state.editResource.server === '') {
      delete state.editResource.server
    }
  },
  LANE_GET(state, payload) {
    state.laneList.list = payload.data
    state.laneList.pages = Number(payload.headers['x-bsc-pages'])
    state.laneList.curPage = Number(payload.headers['x-bsc-cur'])
    state.laneList.count = Number(payload.headers['x-bsc-count'])
    state.laneList.limit = Number(payload.headers['x-bsc-limit'])
  },
  // 车道清空
  LANE_CLEAR(state) {
    state.laneList = {
      list: [],
      pages: 0,
      curPage: 1,
      limit: 5,
      count: 0
    }
  },
  // 主摄像机树
  CAMERA_TREE(state, payload) {
    state.cameraTreeData = toTreeData([payload])
  },
  // RESOURCE_TREE_ROOT_GET(state, payload) {
  //   state.resourceTreeRoot = payload._id
  // },
  RESOURCE_TREE_DATA_GET(state, payload) {
    state.resourceTreeData = toTreeData([payload])
  },
  SERVER_GET(state, payload) {
    state.serverList.list = payload.data
    state.serverList.pages = Number(payload.headers['x-bsc-pages'])
    state.serverList.curPage = Number(payload.headers['x-bsc-cur'])
    state.serverList.count = Number(payload.headers['x-bsc-count'])
    state.serverList.limit = Number(payload.headers['x-bsc-limit'])
  },
  ALLSERVER_GET(state, payload) {
    state.resourceServerArr = []
    for (const item of payload.data) {
      state.resourceServerArr.push({
        value: item._id,
        label: item.name
      })
    }
  },
  // 资源频道号
  CHANNEL_ID(state, payload) {
    state.channelIds = []
    payload.forEach(n => {
      state.channelIds.push({
        value: n.value,
        label: n.label
      })
    })
  }
}
const actions = {
  // 获取配置页面机构树
  getOrganTree({ commit }, payload) {
    const param = {
      query: {
        type: 1
      },
      url: '/setting/org/tree'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('ORGAN_TREE_GET', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 添加机构
  organAdd({ state, commit }, obj) {
    const param = {
      body: {
        pid: state.activeOrgId,
        name: obj.name,
        code: obj.code,
        type: 1
      },
      url: '/setting/org'
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  // 修改机构
  organEdit({ state, commit }, name) {
    const param = {
      body: {
        name: name
      },
      url: '/setting/org/' + state.activeOrgId
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  // 删除机构
  organDelete({ state, commit }) {
    const param = {
      url: '/setting/org/' + state.activeOrgId
    }
    return new Promise((resolve, reject) => {
      remove(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  // 上下移动
  organUpDown({ state, commit }, id) {
    const param = {
      body: {
        previd: id
      },
      url: '/setting/org/' + state.activeOrgId + '/updown'
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  // 左右移动
  organLeftRight({ state, commit }, obj) {
    const param = {
      body: {
        pid: obj.id
      }
    }
    if (obj.isLeft) {
      param.url = '/setting/org/' + state.activeOrgId + '/upgrading'
    } else {
      param.url = '/setting/org/' + state.activeOrgId + '/downgrading'
    }
    // url: '/setting/org/' + state.activeOrgId + '/updowngrading'
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  // 获取路口列表
  getCrossList({ state, commit }, payload) {
    const param = {
      url: '/vehicle/organization/crossing?id=' + state.activeOrgId + '&page=' + payload + '&limit=5'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('CROSSING_GET', res)
        })
        .catch(err => reject(err))
    })
  },
  // 增加路口
  crossingAdd({ commit }, payload) {
    const param = {
      body: payload,
      url: '/vehicle/crossing'
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 修改路口
  crossingEdit({ commit }, payload) {
    const param = {
      body: payload,
      url: '/vehicle/crossing/' + payload._id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 删除路口
  crossingDelete({ commit }, payload) {
    const param = {
      url: '/vehicle/crossing/' + payload
    }
    return new Promise((resolve, reject) => {
      remove(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 批量删除路口
  crossBatchDelete({ commit }, payload) {
    const param = {
      url: '/vehicle/crossing/batch'
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
  // 获取车道列表
  getLaneList({ state, commit }, payload) {
    const param = {
      url: '/vehicle/crossing/lane/' + payload.list + '?page=' + payload.page + '&limit=5'
    }

    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('LANE_GET', res)
        })
        .catch(err => reject(err))
    })
  },
  // 修改车道
  laneEdit({ state, commit }, payload) {
    const param = {
      body: payload,
      url: '/vehicle/crossing/lane/' + payload._id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 主摄像机树
  getCameraTree({ state, commit }, payload) {
    const param = {
      query: {
        orgtype: 1,
        type: 0,
        hasserver: true,
        rid: payload
      },
      url: '/setting/resource/tree'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('CAMERA_TREE', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取资源分配树
  getResourceTreeData({ state, commit }, payload) {
    const param = {
      query: {
        // oid: state.resourceTreeRoot,
        type: 0,
        orgtype: 1,
        bigtype: 0
      },
      url: '/setting/resource/distributiontree'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('RESOURCE_TREE_DATA_GET', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取资源列表
  getResourceList({ state, commit }, payload) {
    const param = {
      query: {
        oid: state.activeOrgId,
        page: payload.page || 1,
        limit: payload.limit || 50,
        type: 0,
        never: -1
      },
      url: '/setting/resource'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('RESOURCE_GET', res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取资源详情
  getResourceInfo({ commit }, playod) {
    const param = {
      query: '',
      url: '/setting/resource/'
    }
    if (playod.id) {
      param.url = '/setting/resource/' + playod.id
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res)
          commit('GET_ONERESOURCE_DATA', res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 添加资源分配
  resourceAdd({ state, commit }, payload) {
    const param = {
      body: {
        oid: state.activeOrgId,
        rids: payload
      },
      url: '/setting/resource/distribute'
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 修改资源分配
  resourceEdit({ state, commit }) {
    const param = {
      body: state.editResource,
      url: '/setting/resource/' + state.editResource._id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },
  // 删除资源分配   解除资源与机构的关系
  resourceDelete({ state, commit }, payload) {
    const param = {
      url: '/setting/resource/unbind/vehicle?type=1'
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        headers: {
          'x-bsc-ids': payload
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 批量解绑资源
  resourceBatchDelete({ commit }, payload) {
    const param = {
      url: '/setting/resource/unbind/vehicle?type=1'
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
  // 获取某一服务器下的通道号
  getChannelIdList({ state, commit }, payload) {
    const param = {
      query: payload,
      url: '/vehicle/crossing/channelIds'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('CHANNEL_ID', res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 所有通道号列表获取
  channelIdsAll({ commit, dispatch }, payload) {
    const param = {
      url: '/vehicle/crossing/channelIdsAll'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取人脸服务器列表
  getFaceServerList({ state, commit }, payload) {
    const param = {
      query: {
        type: 0
      },
      url: '/setting/server?page=' + payload
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('SERVER_GET', res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取车辆服务器列表
  getServerList({ state, commit }, payload) {
    const param = {
      query: {
        type: 1
      },
      url: '/setting/server?page=' + payload
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('SERVER_GET', res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取服务器所有数据
  getAllServerList({ state, commit }, payload) {
    const param = {
      query: {
        type: 1
      },
      url: '/setting/server?limit=1000'
    }
    return new Promise((resolve, reject) => {
      get(param)
        .then(res => {
          resolve(res.data)
          commit('ALLSERVER_GET', res)
        })
        .catch(err => reject(err))
    })
  },
  // 增加服务器
  serverAdd({ state, commit }, payload) {
    const param = {
      body: payload,
      url: '/setting/server'
    }
    return new Promise((resolve, reject) => {
      post(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 修改服务器
  serverEdit({ state, commit }, payload) {
    const param = {
      body: payload,
      url: '/setting/server/' + payload._id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 删除服务器
  serverDelete({ state, commit }, payload) {
    const param = {
      url: '/setting/server/' + payload._id + '?type=' + payload.type
    }
    return new Promise((resolve, reject) => {
      remove(param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 批量删除服务器
  serverBatchDelete({ commit }, payload) {
    const param = {
      url: '/setting/server/batch?type=' + payload.type
    }
    return new Promise((resolve, reject) => {
      remove(param, {
        headers: {
          'x-bsc-ids': payload.idList.join(',')
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 验证此路口在同一机构下是否已存在？
  checkCross({ commit }, payload) {
    return new Promise((resolve, reject) => {
      get({
        query: payload,
        url: '/vehicle/crossing/checkcross'
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 验证此车道在同一路口下是否已存在？
  checkLane({ commit }, payload) {
    return new Promise((resolve, reject) => {
      get({
        query: payload,
        url: '/vehicle/crossing/checklane'
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
