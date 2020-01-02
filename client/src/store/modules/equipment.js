import {
  get,
  post,
  put
} from '../../http/base'
import axios from 'axios'
import { getSocket } from 'src/socket/socket.js'
const state = {
  deviceTableData: [],
  // 所属大类(0：视频设备 1：报警主机 2：门禁设备 3：ip对讲 4：巡更设备) 5：解码器
  // 设备状态
  pageInfo: {
    pages: 0,
    curPage: 1,
    count: 1
  }
}

const mutations = {
  SET_DEVICETABLE_DATA(state, data) {
    state.deviceTableData = []
    state.deviceTableData = data
  },
  SET_DEVICETABLE_PAGE(state, payload) {
    state.pageInfo.pages = Number(payload.headers['x-bsc-pages'])
    state.pageInfo.curPage = Number(payload.headers['x-bsc-cur'])
    state.pageInfo.count = Number(payload.headers['x-bsc-count'])
  },
  SET_ORG_INFO(state, data) {
    state.orgInfo = data
  },
  SET_ISUPDATE(state, data) {
    for (var i = 0; i < state.deviceTableData.length; i++) {
      for (var r = 0; r < data.length; r++) {
        if (state.deviceTableData[i]._id === data[r]._id) {
          state.deviceTableData[i].status = data[r].status
        }
      }
    }
  }
}

const actions = {
  // 设备启用停用
  setDeviceStatus({commit}, data) {
    const param = {
      body: data,
      url: '/setting/device/settingstatus'
    }
    return post(param)
  },
  // 获取接入服务器
  getaccessServerList({ commit, state }) {
    // return get({ url: '/service/list?servername=ds' })
    return get({ url: '/setting/device/servicelist' })
  },
  // 获取所有类型的数据信息
  getDevicesByType({
    commit,
    state,
    rootState
  }, obj) {
    // var arr = [0, 1, 2, 3, 4, 5]
    // Promise.all(arr.map(i => {
    //   const params = {
    //     query: {
    //       page: obj.page,
    //       limit: obj.limit,
    //       oid: rootState.orgSetting.orgActiveId,
    //       bigtype: i,
    //       never: obj.never,
    //       seek: obj.seek
    //     },
    //     url: '/setting/device'
    //   }
    //   return get(params)
    // })).then(suc => {
    //   commit('SET_DEVICETABLE_DATA', suc)
    // }).catch(err => {
    //   console.log(err)
    // })
    const param = {
      query: {
        page: obj.page,
        limit: obj.limit,
        oid: rootState.orgSetting.orgActiveId,
        bigtype: obj.bigtype,
        never: obj.never,
        seek: obj.seek
      },
      url: '/setting/device'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('SET_DEVICETABLE_DATA', res.data.devList) // on 20171124 with ckb alert
        commit('SET_DEVICETABLE_PAGE', res)
        resolve(res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取不同设备类型的信息
  getDeviceInfor({
    commit,
    state,
    rootState
  }, never) {
    const param = {
      query: {},
      url: '/setting/device/counts/index'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取不同设备类型的总数量
  getDeviceCounts({
    commit,
    state,
    rootState
  }, never) {
    const param = {
      query: {
        id: rootState.orgSetting.orgActiveId,
        never: never
      },
      url: '/setting/device/counts/'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 添加一个新设备
  addSingleDevice({
    commit,
    state,
    rootState
  }, form) {
    form.oid = rootState.orgSetting.orgActiveId
    const param = {
      body: form,
      url: '/setting/device'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 添加多个新设备
  addMoreDevice({
    commit,
    state,
    rootState
  }, data) {
    for (var i = 0; i < data.length; i++) {
      data[i].oid = rootState.orgSetting.orgActiveId
    }
    const param = {
      body: data,
      url: '/setting/device/insertpatch'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取设备信息
  getDeviceInfo({
    commit,
    state
  }, id) {
    const param = {
      url: '/setting/device/' + id
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 修改设备信息
  editDeviceInfo({
    commit,
    state
  }, data) {
    const param = {
      body: data.form,
      url: '/setting/device/' + data.id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 删除设备
  deleteDevice({
    commit,
    state
  }, arrId) {
    // return Promise.all(arrId.map(id => {
    //   // console.log(id)
    //   const param = {
    //     url: '/setting/device/' + id
    //   }
    //   return remove(param)
    // }))
    const ids = arrId.join(',')
    return new Promise((resolve, reject) => {
      axios({
        method: 'delete',
        url: '/setting/device/',
        headers: {
          'x-bsc-ids': ids
        }
      }).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 获取设备下的资源列表
  // /setting/device/{_id}/resource
  getResOfDeviceById({
    commit,
    state
  }, id) {
    const param = {
      url: '/setting/device/' + id + '/resource'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  // 视频通道刷新获取设备IP(即通道IP)
  getResIp({
    commit,
    state
  }, id) {
    const param = {
      url: '/setting/device/' + id + '/refresh/resource'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },
  // 设备重启
  restartDevice({
    commit,
    state,
    rootState
  }, data) {
    const param = {
      body: data,
      url: '/setting/device/restart'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // getDeviceInfoClickBtn
  getDeviceInfoClickBtn({
    commit,
    state
  }, obj) {
    console.log(obj)
    const param = {
      url: '/setting/device/devinfo?ip=' + obj.ip + '&port=' + obj.port + '&type=' + obj.type + '&username=' + obj.username + '&password=' + obj.password
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  setDeviceIsUpdate({
    commit,
    state
  }) {
    getSocket().on('server:devStatus', (res) => {
      commit('SET_ISUPDATE', res)
    })
  },
  // 视频设备导出功能
  exportList({
    commit,
    state,
    rootState
  }) {
    const param = {
      query: {
        oid: rootState.orgSetting.orgActiveId,
        bigtype: 0
      },
      url: '/setting/device/export'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  }
}

const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}
