import {
  getRoleListApi,
  addRoleApi,
  getRoleInfoApi,
  editRoleInfoApi,
  delRoleApi,
  getModuleApi,
  getChannelApi,
  searchChannelApi,
  getAssignApi,
  moveNodeApi,
  getAlarmDeviceApi,
  getHelpDeviceApi,
  getTvWallApi,
  getFaceDeviceTreeApi,
  getPassStockTreeApi,
  searchPassGroupApi,
  getFireDeviceTreeApi
} from '../../../http/userManage.api'

const state = {
  roleArr: '',
  roleInfo: '',
  funTreeData: '',
  sysTreeData: '',
  channelData: '',
  alarmDeviceData: '',
  fireDeviceData: '',
  helpDeviceData: '',
  tvWallData: ''
}

const mutations = {
  /**
   * 角色列表
   * @method GET_ROLE_LIST
   */
  GET_ROLE_LIST(state, payload) {
    state.roleArr = payload
  },
  /**
   * 角色详情
   * @method GET_ROLE_INFO
   */
  GET_ROLE_INFO(state, payload) {
    state.roleInfo = payload
    state.roleInfo.loginType = String(state.roleInfo.loginType)
  },
  /**
   * 功能业务模块及系统配置模块树
   * @method GET_MODULE
   */
  GET_MODULE(state, payload) {
    state.funTreeData = payload.funcModules[0]
    state.sysTreeData = payload.sysModules[0]
  },
  /**
   * 获取资源权限树
   * @method GET_CHANNEL
   */
  GET_CHANNEL(state, payload) {
    state.channelData = payload
  },
  /**
   * 获取报警设备机构树
   * @method GET_ALARM_DEVICE
   */
  GET_ALARM_DEVICE(state, payload) {
    state.alarmDeviceData = payload
  },
  /**
   * 获取消防设备机构树
   * @method GET_FIRE_DEVICE
   */
  GET_FIRE_DEVICE(state, payload) {
    state.fireDeviceData = payload
  },
  /**
   * 获取报警求助设备机构树
   * @method GET_HELP_DEVICE
   */
  GET_HELP_DEVICE(state, payload) {
    state.helpDeviceData = payload
  },
  /**
   * 获取电视墙列表
   * @method GET_TV_WALL
   */
  GET_TV_WALL(state, payload) {
    state.tvWallData = payload
  }
}

const actions = {
  /**
   * 获取角色列表
   * @method getRoleList
   */
  getRoleList({ commit }) {
    return new Promise((resolve, reject) => {
      getRoleListApi().then(res => {
        commit('GET_ROLE_LIST', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getRoleList :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 增加角色
   * @method addRole
   * @param {Object} param 角色参数
   */
  addRole({ commit }, param) {
    return new Promise((resolve, reject) => {
      addRoleApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.addRole :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 根据id获取角色详情
   * @method getRoleInfo
   * @param {String} param 角色ID
   */
  getRoleInfo({commit}, param) {
    return new Promise((resolve, reject) => {
      getRoleInfoApi(param).then(res => {
        commit('GET_ROLE_INFO', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getRoleInfo :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 修改角色
   * @method editRoleInfo
   * @param {Object} param 角色参数
   */
  editRoleInfo({commit}, param) {
    return new Promise((resolve, reject) => {
      editRoleInfoApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.editRoleInfo :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 删除角色
   * @method delRole
   * @param {String} param 角色ID
   */
  delRole({commit}, param) {
    return new Promise((resolve, reject) => {
      delRoleApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.delRole :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 获取功能业务模块及系统配置模块树
   * @method getModule
   */
  getModule({commit}) {
    return new Promise((resolve, reject) => {
      getModuleApi().then(res => {
        commit('GET_MODULE', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getModule :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 获取资源权限树
   * @method getVideoChannel
   */
  getVideoChannel({commit}) {
    return new Promise((resolve, reject) => {
      getChannelApi().then(res => {
        commit('GET_CHANNEL', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getResource :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 资源树查找
   * @method searchChannel
   */
  searchChannel({commit}, param) {
    return new Promise((resolve, reject) => {
      searchChannelApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.searchChannel :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 获取视频资源属性
   * @method getAssign
   */
  getAssign({commit}, param) {
    return new Promise((resolve, reject) => {
      getAssignApi(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.getAssign :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 角色上下移
   * @method moveRoleNode
   */
  moveRoleNode({ commit }, param) {
    return moveNodeApi(param)
  },
  /**
   * 获取报警设备机构树
   * @method getAlarmDevice
   */
  getAlarmDevice({commit}) {
    return new Promise((resolve, reject) => {
      getAlarmDeviceApi({
        orgtype: 0,
        bigTypes: '0,1',
        channelTypes: '1,9',
        isUserManage: 'yes'
      }).then(res => {
        commit('GET_ALARM_DEVICE', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getAlarmDevice :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 获取消防设备机构树
   * @method getFireDevice
   */
  // getFireDevice({commit}) {
  //   return new Promise((resolve, reject) => {
  //     getAlarmDeviceApi({
  //       channelTypes: 11,
  //       orgtype: 0,
  //       bigTypes: 7,
  //       isUserManage: 'yes'
  //     }).then(res => {
  //       commit('GET_FIRE_DEVICE', res.data)
  //       resolve(res)
  //     }).catch(err => {
  //       console.log('this.getFireDevice :', err.response.data.message)
  //       reject(err.response.data)
  //     })
  //   })
  // },
  getFireDevice({commit}) {
    return new Promise((resolve, reject) => {
      getFireDeviceTreeApi().then(res => {
        commit('GET_FIRE_DEVICE', res.data)
        resolve(res)
      }).catch(err => {
        reject(err.response.data)
      })
    })
  },
  /**
   * 获取报警求助设备机构树
   * @method getHelpDevice
   */
  getHelpDevice({commit}) {
    return new Promise((resolve, reject) => {
      getHelpDeviceApi().then(res => {
        commit('GET_HELP_DEVICE', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getHelpDevice :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  /**
   * 获取电视墙列表
   * @method getTvWall
   */
  getTvWall({commit}) {
    return new Promise((resolve, reject) => {
      getTvWallApi().then(res => {
        commit('GET_TV_WALL', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getTvWallApi :', err.response.data.message)
        reject(err.response.data)
      })
    })
  },
  getFaceDeviceTreeData() {
    return getFaceDeviceTreeApi()
  },
  /* 获取通行地库树 */
  getPassStockTree() {
    return getPassStockTreeApi()
  },
  searchPassGroup({commit}, payload) {
    return searchPassGroupApi(payload)
  }
}

export default {
  state,
  mutations,
  actions
}
