import {
  get,
  post,
  put,
  remove
} from '../../http/base'
import Vue from 'vue'
import user from './user'
const state = {
  getOrgName: '',
  getUseList: [],
  getRoleList: [],
  // tree
  treeData: [],
  userVideo: [],
  userDecode: [],
  operateVideo: [],
  operateDecode: [],
  operateWall: '',
  operateFace: [],
  operateCar: [],
  // 角色列表
  uVideoTree: [],
  uDecodeTree: [],
  oVideoTree: [],
  oDecodeTree: [],
  oWall: '',
  oFaceTree: [],
  oCarTree: [],
  userMessage: {},
  // jobNum: '',
  queryUsers: [],
  // 首次添加用户直接点击修改，tree不能冒泡的问题
  finishBubble: true,
  // 修改用户禁选
  clickOneUser: false,
  // 有效期
  withoutDead: -1,
  userpageData: {
    count: 0,
    cur: 1,
    limit: 10,
    pages: 0
  },
  isSearch: false,
  pageStartNum: 1
}
const getters = {}
const mutations = {
  // 调用接口
  // 获取用户列表
  USER_GET_LIST(state, payLoad) {
    var loginUserName = user.state.username
    var loginOrgId = user.state.orgId
    var tempArr = payLoad.users.map((val) => {
      return {
        _id: val._id,
        exp: val.exptime,
        level: val.level,
        number: val.number,
        org: val.orgId,
        realName: val.realName,
        roleName: val.role,
        status: val.status,
        name: val.name,
        // usertype: val.userType,
        loading: false
      }
    })
    if (loginUserName !== 'admin' && loginOrgId === payLoad.id) {
      tempArr = tempArr.filter((item) => item.usertype === 'opera')
    }
    state.getUseList = tempArr
  },
  // GET_USER_JOBNUM(state, payLoad) {
  //   state.jobNum = payLoad.avail
  // },
  GET_USER_MESSAGE(state, payLoad) {
    state.userMessage = payLoad
  },
  GET_QUERY_USERLIST(state, payLoad) {
    const searchUsers = payLoad.userList.map((val) => {
      return {
        _id: val._id,
        exp: val.exptime,
        level: val.level,
        number: val.number,
        org: val.orgId,
        realName: val.realName,
        roleName: val.role,
        status: val.status,
        name: val.name,
        // usertype: val.userType,
        loading: false
      }
    })
    state.queryUsers = searchUsers
  },
  GET_ROLE_LIST(state, payLoad) {
    state.getRoleList = payLoad
  },
  // tree
  SET_TREE_DATA(state, payLoad) {
    state.treeData = [payLoad]
  },
  SET_USER_VIDEO(state, payLoad) {
    state.userVideo = state.uVideoTree = [payLoad]
  },
  SET_USER_DCODE(state, payLoad) {
    state.userDecode = state.uDecodeTree = [payLoad]
  },
  SET_OPERATE_VIDEO(state, payLoad) {
    state.operateVideo = state.oVideoTree = [payLoad]
  },
  SET_OPERATE_ALARM(state, payLoad) {
    state.operateDecode = state.oDecodeTree = [payLoad]
  },
  SET_USER_WALL(state, payLoad) {
    state.operateWall = state.oWall = payLoad
  },
  SET_OPERATE_FACE(state, payLoad) {
    state.operateFace = state.oFaceTree = [payLoad]
  },
  SET_OPERATE_CAR(state, payLoad) {
    state.operateCar = state.oCarTree = [payLoad]
  },
  // 数据处理
  HANDAL_TREE_BUBBLE(state, payLoad) {
    state.finishBubble = payLoad
  },
  USER_DATA_DISABLED(state, payLoad) {
    state.clickOneUser = payLoad
  },
  USER_TREE_ORG(state, payLoad) {
    state.getOrgName = payLoad
  },
  USER_GET_PAGES(state, payLoad) {
    state.userpageData.count = payLoad['x-bsc-count']
    state.userpageData.cur = payLoad['x-bsc-cur']
    state.userpageData.limit = payLoad['x-bsc-limit']
    state.userpageData.pages = payLoad['x-bsc-pages']
  },
  IS_CHANGE_SEARCH(state, payload) {
    state.isSearch = payload
  },
  PAGE_FROM_USERLIST(state, payload) {
    state.pageStartNum = payload
  }
}

const actions = {
  // 角色列表
  userGetRoleList({
    state,
    commit
  }, payLoad) {
    const param = {
      // url: '/auth/rolelist'
      url: '/setting/role/list',
      query: payLoad
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_ROLE_LIST', res.data)
      }).catch(err => {
        console.log('userGetRoleList error:' + err)
        reject(err)
      })
    })
  },
  // 获取左边tree
  getOrgsTree({
    state,
    commit
  }) {
    const param = {
      query: {
        type: 0
      },
      url: '/setting/org/tree/'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('SET_TREE_DATA', res.data)
      }).catch(err => {
        console.log('getOrgsTree error' + err)
        reject(err)
      })
    })
  },
  // videoAllInfo({state, commit}, payLoad) {
  //   const param = {
  //     url: '/setting/device/channel',
  //     query: {
  //       bigtype: 0,
  //       channeltype: 0
  //     }
  //   }
  //   return new Promise((resolve, reject) => {
  //     get(param).then(res => {
  //       resolve(res)
  //     }).catch(err => {
  //       console.log('videoAllInfo error:' + err)
  //     })
  //   })
  // },
  // 管理员机构设备树
  userVideoTree({
    state,
    commit
  }, payLoad) {
    const param = {
      query: {
        bigtype: 0
      },
      url: '/setting/device/tree'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('SET_USER_VIDEO', res.data)
      }).catch(err => {
        console.log('userVideoTree error:' + err)
        reject(err)
      })
    })
  },
  // 管理员解码设备树
  userDecodeTree({
    state,
    commit
  }, payLoad) {
    const param = {
      // query: {
      //   bigtype: 5
      // },
      // url: '/setting/device/tree'
      url: '/setting/device/channeltree',
      query: {
        orgtype: 0,
        bigtype: 5,
        channeltype: 5
      }
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('SET_USER_DCODE', res.data)
      }).catch(err => {
        console.log('userDecodeTree error:' + err)
        reject(err)
      })
    })
  },
  // 操作员电视墙
  televiWall({
    state,
    commit
  }) {
    const param = {
      url: '/tvwall/wall'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('SET_USER_WALL', res.data)
      }).catch(err => {
        console.log('televiWall error:' + err)
        reject(err)
      })
    })
  },
  // 操作员机构资源树 --- 视频
  operateVideoTree({
    state,
    commit
  }, payLoad) {
    const param = {
      // query: {
      //   orgtype: 0,
      //   type: 0
      // },
      // url: '/setting/resource/tree'
      url: '/setting/device/channeltree',
      query: {
        orgtype: 0,
        bigtype: 0,
        channeltype: 0
      }
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('SET_OPERATE_VIDEO', res.data)
      }).catch(err => {
        console.log('operateVideoTree error' + err)
        reject(err)
      })
    })
  },
  // ----报警
  operateAlarmTree({
    state,
    commit
  }, payLoad) {
    const param = {
      // query: {
      //   orgtype: 0,
      //   bigtype: 0,
      //   channeltype: 1
      // },
      url: '/setting/resource/tree/alarmlist'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('SET_OPERATE_ALARM', res.data)
      }).catch(err => {
        console.log('operateAlarmTree error:' + err)
        reject(err)
      })
    })
  },
  //  ----人脸
  operateFaceTree({
    state,
    commit
  }) {
    const param = {
      query: {
        orgtype: 2,
        type: 0
      },
      url: '/setting/resource/tree'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('SET_OPERATE_FACE', res.data)
      }).catch(err => {
        console.log('operateFaceTree error:' + err)
        reject(err)
      })
    })
  },
  //  ----车辆
  operateCarTree({
    state,
    commit
  }) {
    const param = {
      query: {
        orgtype: 1,
        type: 0
      },
      url: '/setting/resource/tree'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('SET_OPERATE_CAR', res.data)
      }).catch(err => {
        console.log('operateCarTree error:' + err)
        reject(err)
      })
    })
  },
  // 按用户所属机构获取用户列表
  getUserListForm({
    state,
    commit
  }, payLoad) {
    const param = {
      query: {
        orgId: payLoad.orgId,
        page: payLoad.page,
        limit: payLoad.limit
      },
      // url: '/auth/userlist'
      url: '/setting/user'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        var data = {
          users: res.data.userList,
          id: payLoad
        }
        commit('USER_GET_LIST', data)
        commit('USER_GET_PAGES', res.headers)
      }).catch(err => {
        console.log('getUserListForm error:' + err)
        reject(err)
      })
    })
  },
  // 根据所选的机构id查询用户
  queryUserList({
    state,
    commit
  }, payLoad) {
    // const param = {
    //   url: '/auth/user?value=' + payLoad
    // }
    const param = {
      query: {
        orgId: payLoad.orgId,
        key: payLoad.name,
        page: payLoad.page,
        limit: payLoad.limit
      },
      // url: '/auth/userlist'
      url: '/setting/user'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_QUERY_USERLIST', res.data)
        commit('USER_GET_PAGES', res.headers)
      }).catch(err => {
        console.log('queryUserList error:' + err)
        reject(err)
      })
    })
  },
  // 删除用户
  deleteOldUser({
    commit,
    state
  }, payLoad) {
    const userIds = payLoad.join(',')
    Vue.http.delete('/setting/user', {
      headers: {
        'X-BSC-IDS': userIds
      }
    })
  },
  // 添加新用户
  addNewUserTo({
    state,
    commit
  }, payLoad) {
    const param = {
      body: payLoad,
      // url: '/auth/user'
      url: '/setting/user'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('addNewUserTo error:' + err)
        reject(err)
      })
    })
  },
  // 根据id获取用户信息
  getUserInfor({
    state,
    commit
  }, payLoad) {
    const param = {
      // query: {
      //   id: payLoad
      // },
      url: '/setting/user/' + payLoad
      // url: '/auth/getuser?username=' + payLoad
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_USER_MESSAGE', res.data)
      }).catch(err => {
        console.log('getUserInfor error:' + err)
        reject(err)
      })
    })
  },
  // 根据id获取用户信息加当前用户的权限信息
  getUserInfors({
    state,
    commit
  }, payLoad) {
    const param = {
      // query: {
      //   id: payLoad
      // },
      url: '/setting/user/userAction/' + payLoad
      // url: '/auth/getuser?username=' + payLoad
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_USER_MESSAGE', res.data)
      }).catch(err => {
        console.log('getUserInfor error:' + err)
        reject(err)
      })
    })
  },
  // 根据id修改密码
  setPassword({
    state,
    commit
  }, payLoad) {
    const id = payLoad.id
    delete payLoad.id
    const param = {
      body: payLoad,
      url: `/setting/user/pwd/${id}`
    }
    // console.log('param==>', param)
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('getUserInfor error:' + err)
        reject(err)
      })
    })
  },
  // 设置用户信息
  setUserInfor({
    state,
    commit
  }, payLoad) {
    const param = {
      body: payLoad.body,
      // url: '/auth/user/' + payLoad.id
      url: '/setting/user/' + payLoad.id
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('setUserInfor error:' + err)
        reject(err)
      })
    })
  },
  // 删除机构树
  deleteEquipment({
    state,
    commit
  }, payLoad) {
    const param = {
      query: {
        body: payLoad
      },
      url: '/auth/devs'
    }
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('deleteEquipment error:' + err)
        reject(err)
      })
    })
  },
  // 用户名唯一性验证
  onlyUserName({
    state,
    commit
  }, payLoad) {
    const param = {
      url: '/setting/user/checkName/' + payLoad
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('onlyUserName error:' + err)
        reject(err)
      })
    })
  },
  // 验证工号唯一性
  onlyWorkNum({
    state,
    commit
  }, payLoad) {
    const param = {
      url: '/setting/user/checkNum/' + payLoad
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        // commit('GET_USER_JOBNUM', res.data)
      }).catch(err => {
        console.log('onlyWorkNum error:' + err)
        reject(err)
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
