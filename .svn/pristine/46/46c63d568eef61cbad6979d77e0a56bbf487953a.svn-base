import {get, post, remove} from '../../../../http/base';

const state = {
  authorityArray: [
    {name: '自定义权限组1', id: '1', _id: '1'},
    {name: '自定义权限组1', id: '2', _id: '2'}
  ],
  resourceTableData: [
    // { _id: '5d35ab4efa431b549aec0397',
    //   name: '武媚娘',
    //   uid:22555658,
    //   sex:'男',
    //   cardNumber:'1232',
    //   orgName:'法学院',
    //   phone:'1585658658',
    //   image:'',
    //   authority:''
    // },
    // { _id: '5d35ab4efa431b549aec0397',
    //   name: 'angue',
    //   uid:22555658,
    //   sex:'男',
    //   cardNumber:'1232',
    //   orgName:'法学院',
    //   phone:'1585658658',
    //   image:'',
    //   authority:''
    // },
  ],
  resourceTableDataAdd: [
    // { _id: '5d35ab4efa431b549aec0397',
    //   name: '武媚娘增加弹窗',
    //   uid:22555658,
    //   sex:'男',
    //   cardNumber:'1232',
    //   orgName:'法学院',
    //   phone:'1585658658',
    //   image:'',
    //   authority:''
    // },
    // { _id: '5d35ab4efa431b549aec0397',
    //   name: 'angue',
    //   uid:22555658,
    //   sex:'男',
    //   cardNumber:'1232',
    //   orgName:'法学院',
    //   phone:'1585658658',
    //   image:'',
    //   authority:''
    // },
  ]
}
const getters = {}
const mutations = {
  GET_PEOPLEAUTHORITY(state, payload) { // 权限组对应下人员列表
    state.resourceTableData = []
    state.resourceTableData = payload.data
  },
  GET_PEOPLEAUTHORITY_ADD(state, payload) { // 增加弹窗未分配权限人员列表
    state.resourceTableDataAdd = []
    state.resourceTableDataAdd = payload.data
  },
  GET_CONTROLAUTHORITY(state, payload) { // 权限组
    state.authorityArray = []
    state.authorityArray = payload.data
  }
}

const actions = {

  // addBottomBankFuc({commit}, payload) {
  //   var param = {
  //     body: payload.param,
  //     url: '/through/users/cloneUser'
  //   };
  //   return new Promise((resolve, reject) => {
  //     post(param).then(res => resolve(res.data)).catch(err => reject(err))
  //   })
  // },

  // 门禁权限组列表获取
  accessControlAuthority({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/doorPermission/getPermissionGroup'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        commit('GET_CONTROLAUTHORITY', res.data)
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },
  // 门禁权限人员列表获取            id-传null -获取尚未绑定权限的人员列表，id-有值获取对应权限组下的人员列表
  getAuthorityPensonList({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/doorPermission/getPermissionUser'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        if (res.data) {
          res.data.data.map(it => {
            it['orgName'] = it.org ? it.org.name : ''
          })
        }
        resolve(res.data)
        if (payload.type === 'have') {
          commit('GET_PEOPLEAUTHORITY', res.data)
        } else {
          commit('GET_PEOPLEAUTHORITY_ADD', res.data)
        }
      }).catch(err => reject(err))
    })
  },

  // 同步
  AuthorityasyncPermission({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/doorPermission/asyncPermission'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },

  // 获取人员组织机构 api/onetree?orgtype=10
  PermissionOrg({commit}, payload) {
    var param = {
      query: payload,
      url: '/onetree'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },

  // 删除门禁权限人员与权限关系（支持批量操作）

  deletePermissionUser({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/doorPermission/deletePermissionUser'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },

  // 移动人员权限

  movePermissionUser({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/doorPermission/movePermissionUser'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 给人员权限

  addPermissionUser({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/doorPermission/addPermissionUser'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },
  // 按机构给用户添加权限组（支持批量操作）

  addPermissionGroup({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/doorPermission/addPermissionGroup'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  },

  deleteAllPermission({commit}, payload) {
    var param = {
      body: payload,
      url: '/through/doorPermission/deleteAllPermission'
    }
    console.log(JSON.stringify(payload))
    return new Promise((resolve, reject) => {
      remove(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  }

}
export default {
  state,
  mutations,
  actions,
  getters
}
