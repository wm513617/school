import Vue from 'vue'
import {
  read
} from '../../storage/index'

import { getSocket } from 'src/socket/socket.js'

import {
  getResList
} from 'http/organization.api.js'
import { getUserListApi, getAssignApi } from 'http/userManage.api'

let userId = read('userId')
let roleId = ''

const state = {
  // 存放开启中心录像的资源id, 用于机构树上中心录像标识显示
  centerVideoIds: [],
  videoOrgData: [],
  favData: [],
  curNode: '',
  activeOrgId: '',
  activeFavId: '',
  playingIds: [],
  pollId: '',
  pollingId: [],
  strFilter: {
    bsr: 'BSR Files (*.bsr,*.dat)|*.bsr;*.dat|All Files (*.*)|*.*||',
    avi: 'AVI Files (*.avi)|*.avi|All Files (*.*)|*.*||',
    jpg: 'JPG Files (*.jpg,*.jpeg)|*.jpg;*.jpeg|All Files (*.*)|*.*||',
    bmp: 'BMP Files (*.bmp)|*.bmp|All Files (*.*)|*.*||'
  },
  speedCtrl: 1,
  devStatus: [],
  userList: [],
  isAdmin: false,
  cameraPowerList: {} // 缓存获取过的镜头权限
}

const getters = {
  pollingIds(state) {
    return state.pollingId
  }
}

const mutations = {
  SET_CENTER_VIDEO_ID(state, data) {
    if (data.isAdd) {
      state.centerVideoIds = [...state.centerVideoIds, data.id]
    } else {
      state.centerVideoIds = state.centerVideoIds.map(item => {
        return item !== data.id
      })
    }
  },
  UP_ORGDATA(state, data) {
    state.videoOrgData = data
  },
  ADD_RESOURCE(state, data) { // 往机构树中插入子机构
    // treeData: 机构树， id: 机构id, val: 获取的机构资源
    let recouse = (treeData, id, val) => {
      if (!val.length) { return }
      if (treeData._id === id) {
        // if (treeData.children) {
        // treeData.children = [...treeData.children, ...val] // 如果有children 就合并数组
        treeData.children = val // 如果有children 就合并数组
        // } else {
        // treeData.children = val // 没有就直接赋值
        // }
      } else {
        if (treeData.children) {
          for (let index = 0; index < treeData.children.length; index++) {
            recouse(treeData.children[index], id, val)
          }
        } else {
          // console.log('没有匹配项', val, '返回的资源数组')
        }
      }
    }
    recouse(state.videoOrgData[0], data.oid, data.data)
  },
  UP_FAVDATA(state, data) {
    var arr = []
    const idCheck = {}
    for (const i in data) {
      var obj = {}
      obj._id = data[i]._id
      obj.name = data[i].name
      obj.ispolling = data[i].ispolling
      obj.pollingtime = data[i].pollingtime
      obj.creator = data[i].creator
      obj.owners = data[i].owners
      obj.children = []
      obj.pid = i
      for (const j in data[i].resources) {
        var chiObj = {}
        chiObj = Vue.lodash.cloneDeep(data[i].resources[j])
        chiObj.pid = data[i]._id
        if (idCheck[chiObj._id]) {
          // 如果id重复加后缀
          chiObj._id += '_' + i + j
        }
        idCheck[chiObj._id] = 1
        obj.children.push(chiObj)
      }
      arr.push(obj)
    }
    state.favData = arr
  },
  ADD_FAVDATA(state, data) {
    state.favData.push(data)
  },
  SET_CURNODE(state, node) {
    state.curNode = node
  },
  SET_ORGID(state, id) {
    state.activeOrgId = id
  },
  SET_FAVID(state, id) {
    state.activeFavId = id
  },
  SET_POLL(state, id) {
    state.pollId = id
  },
  SET_POLLINGID(state, data) {
    state.pollingId.push({
      ...data
    })
  },
  DEL_POLLINGID(state, data) {
    for (let j = 0; j < state.pollingId.length; j++) {
      if (state.pollingId[j].i === data.i) {
        state.pollingId.splice(j, 1)
        return
      }
    }
  },
  ADD_PLAYINGID(state, id) {
    if (id) { id = id.split('_')[0] }
    state.playingIds.push(id)
  },
  EMPTY_PLAYINGID(state) {
    state.playingIds = []
  },
  DEL_PLAYINGID(state, id) {
    for (let i = 0; i < state.playingIds.length; i++) {
      if (state.playingIds[i] === id) {
        state.playingIds.splice(i, 1)
        return
      }
    }
  },
  UP_PLAYINGID(state, data) {
    state.playingIds = data
  },
  SET_SPEEDCTRL(state, data) {
    state.speedCtrl = data
  },
  UP_DEVSTATUS(state, data) {
    let devStatus = {}
    data.forEach(item => {
      devStatus[item._id] = {status: item.status}
    })
    const getNodes = (node) => {
      node.forEach(item => {
        if (item.eid && devStatus[item.eid._id]) {
          item.status = devStatus[item.eid._id].status ? 1 : 0
        }
        if (item.children && item.children.length) {
          getNodes(item.children)
        }
      })
    }
    getNodes(state.videoOrgData)
  },
  UP_USERLIST(state, data) {
    userId = read('userId')
    state.userList = []
    data.children.forEach(role => {
      if (role.children && role.children.length) {
        role.children.forEach(user => {
          if (user._id === userId) {
            roleId = role._id
            if (role.name === '超级管理员') {
              state.isAdmin = true
            }
          }
          state.userList.push({
            name: user.name,
            _id: user._id,
            role: role.name,
            roleId: role._id
          })
        })
      }
    })
  }
}

const actions = {
  async getvideoOrg({
    commit, dispatch
  }, data) {
    roleId || await dispatch('getUserListApi')
    return new Promise((resolve, reject) => {
      Vue.http.get('/setting/resource/tree?type=0', {
        orgtype: 0,
        type: 0
      }).then((res) => {
        if (!data) {
          var arr = []
          arr.push(res.data)
          commit('UP_ORGDATA', arr)
          commit('SET_ORGID', arr[0]._id)
        }
        resolve(res)
      }).catch((err) => {
        console.log('logout error: ' + err)
        reject(err)
      })
    })
  },
  getVideoOrgData(_, data) {
    return Vue.http.get('/setting/resource/tree?type=0', {
      orgtype: 0,
      type: 0
    })
  },
  getFavorites({
    commit,
    dispatch,
    rootState
  }, data) {
    // console.log(rootState.user, 456789)
    return new Promise((resolve, reject) => {
      userId = read('userId')
      Vue.http.get('/setting/user/' + userId + '/favorite').then((res) => {
        commit('UP_FAVDATA', res.data)
        if (res.data.length === 0) {
          dispatch('addFavorites', {
            name: '自定义收藏夹'
          }).catch(() => { })
        }
        resolve(res)
      }).catch((err) => {
        console.log('logout error: ' + err)
        reject(err)
      })
    })
  },
  addFavorites({
    dispatch
  }, data) {
    userId = read('userId')
    const obj = {}
    obj.name = data.name
    obj.creator = userId
    obj.resources = data._id ? [data._id] : []
    obj.owners = [userId]
    obj.ispolling = false
    obj.pollingtime = 10
    if (data.ids) {
      const arr = []
      data.ids.forEach(item => {
        arr.push(item)
      })
      obj.resources = arr
    }
    return new Promise((resolve, reject) => {
      Vue.http.post('/setting/favorite', obj).then((res) => {
        dispatch('getFavorites')
        resolve(res)
      }).catch((err) => {
        console.log('logout error: ' + err)
        reject(err)
      })
    })
  },
  deleteFavorites({
    dispatch
  }, id) {
    return new Promise((resolve, reject) => {
      Vue.http.delete('/setting/user/' + userId + '/favorite/' + id).then((res) => {
        // console.log(res)
        dispatch('getFavorites')
        resolve(res)
      }).catch((err) => {
        console.log('logout error: ' + err)
        reject(err)
      })
    })
  },
  setFavorites({
    dispatch
  }, data) {
    return new Promise((resolve, reject) => {
      userId = read('userId')
      Vue.http.put('/setting/user/' + userId + '/favorite/' + data._id, data).then((res) => {
        // console.log(res)
        dispatch('getFavorites')
        resolve(res)
      }).catch((err) => {
        console.log('logout error: ' + err)
        reject(err)
      })
    })
  },
  shareFavorites({
    dispatch
  }, data) {
    return new Promise((resolve, reject) => {
      userId = read('userId')
      Vue.http.post('/setting/user/' + userId + '/favshare', data).then((res) => {
        // console.log(res)
        resolve(res)
      }).catch((err) => {
        console.log('logout error: ' + err)
        reject(err)
      })
    })
  },
  getUserAll({
    dispatch
  }, data) {
    return new Promise((resolve, reject) => {
      Vue.http.get('/setting/user/all').then((res) => {
        resolve(res)
      }).catch((err) => {
        console.log('logout error: ' + err)
        reject(err)
      })
    })
  },
  setSpeedCtrl({
    commit
  }, data) {
    commit('SET_SPEEDCTRL', data)
  },
  updateDevStatus({
    commit
  }) {
    getSocket().on('server:devStatus', (res) => {
      commit('UP_DEVSTATUS', res)
    })
  },
  getResSearch({ commit }, data) {
    return getResList(data)
  },
  emptyOrgdata({state}) {
    state.videoOrgData = []
  },
  // 获取用户列表
  getUserListApi({ commit }, id) {
    userId = id || userId
    return getUserListApi().then(res => {
      commit('UP_USERLIST', res.data)
      return res.data
    }).catch(err => err)
  },
  // 更新正在播放的视频id
  upPlayindId({ commit }, data) {
    commit('UP_PLAYINGID', data)
  },
  // 获取镜头资源权限
  async getCameraPower({dispatch, state}, resId) {
    roleId || await dispatch('getUserListApi')
    // "preview"、"cloudControl"、"playbackDownload"
    return new Promise((resolve, reject) => {
      if (state.cameraPowerList[resId]) {
        resolve(state.cameraPowerList[resId])
      } else {
        getAssignApi({roleId: roleId, resId, type: 0}).then(res => {
          state.cameraPowerList[resId] = res.data.properties || []
          resolve(res.data.properties || [])
        }).catch(err => {
          console.log('this.getAssign :', err.response.data.message)
          reject(err.response.data)
        })
      }
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
