import {
  get,
  put,
  post,
  remove
} from '../../http/base'
import {
  read
} from '../../storage'
const state = {
  // 权限数据
  mainMenu: [],
  // 表格数据
  roleList: [],
  getRoleByRoleName: [],
  roleMessage: {},
  getRoleFun: {},
  getTree: {},
  // roleType: '',
  choose: false,
  powerData: [],
  pageData: {
    count: 0,
    cur: 1,
    limit: 10,
    pages: 0
  }
}
const getters = {
  mainMenu() {
    return read('mainMenu')
  }
}
const mutations = {
  // 获取角色列表
  ROLE_GET_LIST(state, payLoad) {
    // console.log(payLoad, '----++')
    // state.roleList = payLoad.roleList
    state.roleList = payLoad
  },
  // 搜索角色
  SEARCH_ONE_ROLE(state, payLoad) {
    state.getRoleByRoleName = payLoad.roleList
  },
  // 获取角色信息
  GET_ROLE_MESSAGE(state, payLoad) {
    state.roleMessage = payLoad
  },
  // 获取tree
  ROLE_CHANGE_TREE(state, payLoad) {
    // console.log(payLoad)
    state.getTree = payLoad
  },
  // GET_ROLE_TYPE(state, payLoad) {
  //   state.roleType = payLoad
  // },
  // 权限是否设置
  SET_ROLE_POWER(state, payLoad) {
    // console.log(payLoad)
    state.choose = payLoad
  },
  GET_ALL_POWER(state, payLoad) {
    state.powerData = payLoad
  },
  ROLE_GET_PAGES(state, payLoad) {
    state.pageData.count = payLoad['x-bsc-count']
    state.pageData.cur = payLoad['x-bsc-cur']
    state.pageData.limit = payLoad['x-bsc-limit']
    state.pageData.pages = payLoad['x-bsc-pages']
  }
}

const actions = {
  // 获取角色列表
  getRoleList({
    state,
    commit
  }, payLoad) {
    const param = {
      // url: '/auth/rolelist'
      url: '/setting/role',
      query: payLoad
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('ROLE_GET_LIST', res.data)
        commit('ROLE_GET_PAGES', res.headers)
      }).catch(err => {
        console.log('getRoleList error:' + err)
        reject(err)
      })
    })
  },
  // 查询角色名称
  // queryRoleList({state, commit}, payLoad) {
  //   const param = {
  //     url: '/auth/role?rolename=' + payLoad
  //   }
  //   return new Promise((resolve, reject) => {
  //     get(param).then(res => {
  //       resolve(res)
  //       commit('SEARCH_ONE_ROLE', res.data)
  //     }).catch(err => {
  //       console.log('queryRoleList error:' + err)
  //       reject(err)
  //     })
  //   })
  // },
  // 获取角色信息 ---------- 权限数据
  getRoleInfor({
    state,
    commit
  }, payLoad) {
    const param = {
      // url: '/auth/role?id=' + payLoad
      url: '/setting/role/assign/' + payLoad
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('GET_ROLE_MESSAGE', res.data)
      }).catch(err => {
        console.log('getRoleInfor error:' + err)
        reject(err)
      })
    })
  },
  // 修改角色信息 ---------- 权限数据
  // modRoleInfor({state, commit}, payLoad) {
  //   const param = {
  //     // url: '/auth/role?id=' + payLoad
  //     url: '/setting/assign/' + payLoad.id,
  //     body: payLoad.body
  //   }
  //   return new Promise((resolve, reject) => {
  //     put(param).then(res => {
  //       resolve(res)
  //       commit('GET_ROLE_MESSAGE', res.data)
  //     }).catch(err => {
  //       console.log('getRoleInfor error:' + err)
  //       reject(err)
  //     })
  //   })
  // },
  // 修改角色
  reviseOneRevise({
    state,
    commit
  }, payLoad) {
    const param = {
      body: payLoad.sendObj,
      // url: '/auth/role/' + payLoad.sendId
      url: '/setting/role/assign/' + payLoad.sendId
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('reviseOneRevise error:' + err)
        reject(err)
      })
    })
  },
  // 角色唯一性验证
  onlyRoleName({
    state,
    commit
  }, payLoad) {
    const param = {
      url: '/setting/role/checkName/' + payLoad
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('onlyRoleName error:' + err)
        reject(err)
      })
    })
  },
  // 增加角色
  addNewRoleFun({
    state,
    commit
  }, payLoad) {
    const param = {
      body: payLoad,
      // url: '/auth/role'
      url: '/setting/role'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('addNewRoleFun error:' + err)
        reject(err)
      })
    })
  },
  // 删除角色
  deleteOneRole({
    state,
    commit
  }, payLoad) {
    const param = {
      // url: '/auth/role?rolename=' + payLoad
      url: '/setting/role/' + payLoad
    }
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('deleteOneRole error:' + err)
        reject(err)
      })
    })
  },
  //  获取角色功能权限
  getAction({
    commit
  }) {
    const param = {
      url: '/setting/action'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('GET_ALL_POWER', res.data)
        resolve(res)
      }).catch(err => {
        console.log('this.getAction :' + err)
        reject(err)
      })
    })
  },
  addAction({
    commit
  }, payLoad) {
    const param = {
      url: '/setting/action',
      body: payLoad
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
        console.log('this.addAction :' + err)
      })
    })
  },
  delAction({
    state
  }, payLoad) {
    console.log(payLoad)
    const param = {
      url: '/setting/action/' + payLoad
    }
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
        console.log('this.delAction :' + err)
      })
    })
  },
  modifyAction({
    state
  }, payLoad) {
    const param = {
      url: '/setting/action/' + payLoad.id,
      body: payLoad.body
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
        console.log('this.delAction :' + err)
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
