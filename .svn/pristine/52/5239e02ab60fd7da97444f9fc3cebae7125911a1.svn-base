import {get, post, remove, put} from '../../../../http/base'

const state = {
  ServerAddressConfiguration: [
    {name: '门禁服务器', value: 1},
    {name: '人脸服务器', value: 2},
    {name: '一卡通', value: 4}
  ],
  ServerManufacturer: [
    [
      {name: '中控', value: '中控'}
    ],
    [
      {name: '商汤', value: '商汤 '}
      // {name: '旷视', value: '旷视'},
    ]

  ],
  resourceTableData: {
    list: [],
    pages: 0,
    curPage: 1,
    limit: 50,
    count: 0,
    onlinecount: 0
  }
}
const mutations = {
  GET_VERIFACE_RESOURCES(state, payload) { //  视频通道
    this.resourceTableData = {
      list: [],
      pages: 0,
      curPage: 1,
      limit: 50,
      count: 0,
      onlinecount: 0
    }
    state.resourceTableData.list = payload.data
    state.resourceTableData.pages = Number(payload.headers['x-bsc-pages'])
    state.resourceTableData.curPage = Number(payload.headers['x-bsc-cur'])
    state.resourceTableData.count = Number(payload.headers['x-bsc-count'])
    state.resourceTableData.limit = Number(payload.headers['x-bsc-limit'])
    state.resourceTableData.onlinecount = Number(payload.headers['x-bsc-onlinecount'])
  },
  GET_GUARD(state, payload) { //  视频通道
    this.resourceTableData = {
      list: [],
      pages: 0,
      curPage: 1,
      limit: 50,
      count: 0,
      onlinecount: 0
    }
    state.resourceTableData.list = payload.data.data
    // state.resourceTableData.pages = Number(payload.headers['x-bsc-pages'])
    // state.resourceTableData.curPage = Number(payload.headers['x-bsc-cur'])
    state.resourceTableData.count = payload.data.length
    // state.resourceTableData.limit = Number(payload.headers['x-bsc-limit'])
    // state.resourceTableData.onlinecount = Number(payload.headers['x-bsc-onlinecount'])
  },
  GET_READ(state, payload) { // 读头列表
    this.resourceTableData = {
      list: [],
      pages: 0,
      curPage: 1,
      limit: 50,
      count: 0,
      onlinecount: 0
    },
    state.resourceTableData.list = payload.data.data
    // state.resourceTableData.pages = Number(payload.headers['x-bsc-pages'])
    // state.resourceTableData.curPage = Number(payload.headers['x-bsc-cur'])
    state.resourceTableData.count = payload.data.length
    // state.resourceTableData.limit = Number(payload.headers['x-bsc-limit'])
    // state.resourceTableData.onlinecount = Number(payload.headers['x-bsc-onlinecount'])
  },
  GET_PEOPLECARD(state, payload) { // 人证核验机列表
    this.resourceTableData = {
      list: [],
      pages: 0,
      curPage: 1,
      limit: 50,
      count: 0,
      onlinecount: 0
    },
    state.resourceTableData.list = payload.data.data
    // state.resourceTableData.pages = Number(payload.headers['x-bsc-pages'])
    // state.resourceTableData.curPage = Number(payload.headers['x-bsc-cur'])
    state.resourceTableData.count = payload.data.length
    // state.resourceTableData.limit = Number(payload.headers['x-bsc-limit'])
    // state.resourceTableData.onlinecount = Number(payload.headers['x-bsc-onlinecount'])
  },
  GET_FACE(state, payload) { // 人脸识别接口列表
    this.resourceTableData = {
      list: [],
      pages: 0,
      curPage: 1,
      limit: 50,
      count: 0,
      onlinecount: 0
    },
    state.resourceTableData.list = payload.data.data
    // state.resourceTableData.pages = Number(payload.headers['x-bsc-pages'])
    // state.resourceTableData.curPage = Number(payload.headers['x-bsc-cur'])
    // state.resourceTableData.limit = Number(payload.headers['x-bsc-limit'])
    // state.resourceTableData.onlinecount = Number(payload.headers['x-bsc-onlinecount'])
    if (payload.offline) {
      state.resourceTableData.count = payload.offline + payload.online
    }
    if (payload.online) {
      state.resourceTableData.onlinecount = payload.online
    }
  },
  GET_FACE_COUNT(state, payload) { // 人脸识别接口列表
    this.resourceTableData.count = 0
    this.resourceTableData.onlinecount = 0
    if (payload.offline) {
      state.resourceTableData.count = payload.offline + payload.online
    } else {
      state.resourceTableData.count = 0 + payload.online
    }
    if (payload.online) {
      state.resourceTableData.onlinecount = payload.online
    }
  },
  GETDOOR(state, payload) { // 获取门列表接口
    this.resourceTableData = {
      list: [],
      pages: 0,
      curPage: 1,
      limit: 50,
      count: 0,
      onlinecount: 0
    },
    state.resourceTableData.list = payload.data.data
    // state.resourceTableData.pages = Number(payload.headers['x-bsc-pages'])
    // state.resourceTableData.curPage = Number(payload.headers['x-bsc-cur'])
    state.resourceTableData.count = payload.data.length
    // state.resourceTableData.limit = Number(payload.headers['x-bsc-limit'])
    // state.resourceTableData.onlinecount = Number(payload.headers['x-bsc-onlinecount'])
  }
}

const actions = {
  faceSaveDevice({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/senseTime/setDeviceState'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 设置人证核验机状态
  peopleCardSaveDevice({commit}, payload) {
    var param = {
      body: payload,
      url: 'through/zkteco/setDeviceStatus'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  addDeviceServerManagement({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/serviceConfig/addConfig'
    }
    console.log('===vux', param)
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 获取所有人证核验机位置
  getDevicePeopleAll({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/zkteco/getDevicePeopleAll'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 获取所有读头和人证核验机位置
  getAllDevice({commit}, payload) {
    var param = {
      body: payload,
      url: 'through/passage/getAllDevice'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  getLiveCount({commit}, payload) {
    var param = {
      body: payload,
      url: 'through/senseTime/getLiveCount'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        commit('GET_FACE_COUNT', res.data)
      }).catch(err => reject(err))
    })
  },
  getDeviceServerManagementList({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/serviceConfig/getConfig'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  // 获取服务器在线状态
  getServerStatus({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/serviceConfig/getServerStatus'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  deleteDeviceServerManagement({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/serviceConfig/deleteConfig'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },

  getVideoChannelList({commit}, payload) {
    var param = {
      query: {...payload},
      url: 'veriface/param/face'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('GET_VERIFACE_RESOURCES', res)
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  // 获取机构树
  getVerifaceSettingOrgTree11({state, commit}, body) {
    return new Promise((resolve, reject) => {
      get({
        url: '/setting/org/tree',
        query: {
          type: 11
        }
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 同步门禁设备
  asyncGuardList({state, commit}) {
    return new Promise((resolve, reject) => {
      get({
        url: '/through/zkteco/asyncGuardList',
        query: ''
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 同步人证核验设备
  asyncDevicePeople({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      get({
        url: '/through/zkteco/asyncDevicePeople',
        query: ''
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 获取视频通道在线离线数量
  getDeviceStatus({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      var param = {
        query: {...payload},
        url: '/through/serviceConfig/getDeviceStatus'
      }

      return new Promise((resolve, reject) => {
        get(param).then(res => {
          commit('GET_VERIFACE_RESOURCES', res)
          resolve(res.data)
        }).catch(err => reject(err))
      })
    })
  },
  // 导出人证列表
  exportPDPassage({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/passage/exportPeopleCard'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  // 获取门禁设备列表
  guardList({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      get({
        url: '/through/zkteco/guardList',
        query: payload
      })
        .then(res => {
          commit('GET_GUARD', res)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取人证记录信息列表
  getPeopleCardList({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/passage/getPeopleCard'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  // 同步门/通道数据
  asyncDoor({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      get({
        url: '/through/zkteco/asyncDoor',
        query: payload
      })
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 获取门列表
  doorList({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      get({
        url: '/through/zkteco/doorList',
        query: payload
      })
        .then(res => {
          commit('GETDOOR', res)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },

  // 通过门ID远程开门
  openDoor({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      var param = {
        body: payload,
        url: '/through/zkteco/openDoor'
      }

      return new Promise((resolve, reject) => {
        post(param).then(res => resolve(res.data)).catch(err => reject(err))
      })
    })
  },

  // 通过门ID远程关门
  closeDoor({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      var param = {
        body: payload,
        url: '/through/zkteco/closeDoor'
      }

      return new Promise((resolve, reject) => {
        post(param).then(res => resolve(res.data)).catch(err => reject(err))
      })
    })
  },

  // 通过门ID远程常开
  openTimeLang({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      var param = {
        body: payload,
        url: '/through/zkteco/openTimeLang'
      }

      return new Promise((resolve, reject) => {
        post(param).then(res => resolve(res.data)).catch(err => reject(err))
      })
    })
  },
  // 门禁移动组织机构
  grardOrgModify({state, commit}, payload) {
    var param = {
      body: payload,
      url: '/through/zkteco/editGuard/org'
    }

    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 获取人证核验机信息列表
  getPeopleCard({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      get({
        url: 'through/zkteco/getDevicePeopleList',
        query: payload
      })
        .then(res => {
          commit('GET_PEOPLECARD', res)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  //  获取读头信息列表
  getReadList({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      get({
        url: '/through/zkteco/getReadList',
        query: payload
      })
        .then(res => {
          commit('GET_READ', res)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 给读头绑定相机信息

  bindCamera({state, commit}, payload) {
    var param = {
      body: payload,
      url: '/through/zkteco/bindCamera'
    }

    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },

  saveVerifaceResourceInfo({commit, state}, obj) {
    const param = {
      body: obj.form,
      url: '/setting/resource/' + obj.id
    }
    return new Promise((resolve, reject) => {
      put(param)
        .then(res => {
          resolve(res)
        })
        .catch(err => reject(err.response.data.message))
    })
  },

  // 人脸识别机列表获取
  getFaceRecognitionList({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      get({
        url: '/through/senseTime/getDeviceList',
        query: payload
      })
        .then(res => {
          commit('GET_FACE', res)
          resolve(res)
        })
        .catch(err => reject(err))
    })
  },
  // 人脸识别机绑定相机(支持一个人脸识别机绑定多个相机)

  faceBindCamera({state, commit}, payload) {
    var param = {
      body: payload,
      url: '/through/senseTime/bindCamera'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 人证核验机绑定相机
  peopleCardCamera({state, commit}, payload) {
    var param = {
      body: payload,
      url: 'through/zkteco/deviceBindCamera'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 获取人脸识别机，同步到数据库
  faceasyncDevice({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      get({
        url: '/through/senseTime/asyncDevice',
        query: ''
      })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => reject(err))
    })
  },
  // 移动人脸识别机绑定的机构信息(支持批量修改)

  moveFaceOrg({state, commit}, payload) {
    var param = {
      body: payload,
      url: '/through/senseTime/editFaceOrg'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 移动人证核验机绑定的机构信息
  movePeopleDeviceOrg({state, commit}, payload) {
    var param = {
      body: payload,
      url: 'through/zkteco/editDeviceOrg'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  //  获取服务配置高级参数配置
  getLevelConfig({state, commit}, payload) {
    var param = {
      body: payload,
      url: '/through/serviceConfig/getLevelConfig'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },

  // 保存服务配置高级参数配置

  editLevelConfig({state, commit}, payload) {
    var param = {
      body: payload,
      url: '/through/serviceConfig/editLevelConfig'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },

  // 编辑修改服务器配置接口
  editConfig({state, commit}, payload) {
    var param = {
      body: payload,
      url: '/through/serviceConfig/editConfig'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  }
}
export default {
  state,
  mutations,
  actions
}
