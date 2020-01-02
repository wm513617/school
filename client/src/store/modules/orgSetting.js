import {
  get,
  post,
  put,
  remove
} from '../../http/base'
const state = {
  orgTreeData: [{
    _id: 1,
    name: '一级节点',
    pid: null,
    children: [{
      _id: 2,
      name: '二级节点-1',
      pid: 1
    }, {
      name: '二级节点-2',
      _id: 3,
      pid: 1,
      children: [{
        _id: 4,
        pid: 3,
        name: '三级节点-1'
      }, {
        _id: 5,
        name: '三级节点-2',
        pid: 3
      }]
    }, {
      name: '二级节点-3',
      _id: 6,
      pid: 1,
      children: [{
        _id: 7,
        pid: 6,
        name: '三级节点-4'
      }, {
        _id: 8,
        name: '三级节点-5',
        pid: 6
      }]
    }]
  }],
  orgInfo: {
    contact: '张楠', // 联系人
    remark: '创建此机构', // 备注信息
    playbackmax: 12, // 回放路数上限
    pid: 1, // 父机构id
    name: '三级机构2', // 名称
    code: 12580, // 机构编号
    sid: 877, // 流媒体服务器id
    order: 5, // 同级机构的显示顺序（用作机构的上下移，从0开始计数，数字越小越靠前）
    contactway: 18729241692, // 联系方式
    type: 0, // 机构类别（0：视频资源树 1：车辆资源树 2：人脸资源树）
    previewmax: 12 // 预览路数上限
  },
  orgActiveId: '',
  orgActiveName: '',
  isRootOrg: false
}

const mutations = {
  SET_ORGTREE_DATA(state, data) {
    state.orgTreeData = [data]
  },
  SET_ORGACTIVE_ID(state, id) {
    state.orgActiveId = id
  },
  SET_ORG_INFO(state, data) {
    state.orgInfo = data
  },
  SET_ORGACTIVE_NAME(state, name) {
    state.orgActiveName = name
  },
  SET_ISROOT_ORG(state, root) {
    state.isRootOrg = Boolean(root)
  }
}

const actions = {
  setOrgActiveId({
    commit,
    state
  }, id) {
    commit('SET_ORGACTIVE_ID', id)
  },
  setOrgActiveName({
    commit,
    state
  }, name) {
    commit('SET_ORGACTIVE_NAME', name)
  },
  setIsRootOrg({
    commit,
    state
  }, root) {
    commit('SET_ISROOT_ORG', root)
  },
  // 1-获取机构树
  getOrgTree({
    commit,
    state
  }, type) {
    const param = {
      query: {
        type: type
      },
      url: '/setting/org/tree/'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
        commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 2-获取机构信息
  getOrgInfo({
    commit,
    state
  }, type) {
    const param = {
      query: {
        type: type
      },
      url: '/setting/org/' + state.orgActiveId
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        // commit('SET_ORG_INFO', res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  getOrgInfoById({
    commit,
    state
  }, obj) {
    const param = {
      query: {
        type: obj.type
      },
      url: '/setting/org/' + obj.id
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res.data)
        // commit('SET_ORG_INFO', res.data)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 3-添加机构
  addOrg({
    commit,
    state
  }, form) {
    const param = {
      body: form,
      url: '/setting/org/'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        resolve(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  // 4-修改机构
  editOrg({
    commit,
    state
  }, form) {
    const param = {
      body: form,
      url: '/setting/org/' + state.orgActiveId
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
        // console.log(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  moveOrgUpDown({
    commit,
    state
  }, id) {
    const param = {
      body: {
        previd: id
      },
      url: '/setting/org/' + state.orgActiveId + '/updown'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
        // console.log(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  moveOrgLeftRight({
    commit,
    state
  }, obj) {
    const param = {
      body: {
        pid: obj.id
      }
    }
    if (obj.isLeft) {
      param.url = '/setting/org/' + state.orgActiveId + '/upgrading'
    } else {
      param.url = '/setting/org/' + state.orgActiveId + '/downgrading'
    }
    return new Promise((resolve, reject) => {
      put(param).then(res => {
        resolve(res)
        // console.log(res)
      }).catch(err => reject(err.response.data.message))
    })
  },
  deleteOrg({
    commit,
    state
  }, id) {
    const param = {
      url: '/setting/org/' + state.orgActiveId
    }
    return new Promise((resolve, reject) => {
      remove(param).then(res => {
        resolve(res.data)
        // commit('SET_ORG_INFO', res.data)
      }).catch(err => {
        reject(err.response.data.message)
      })
    })
  },
  getDevice({
    commit,
    state
  }, id) {},
  addDevice({
    commit,
    state
  }, id) {},
  editDevice({
    commit,
    state
  }, id) {},
  deleteDevice({
    commit,
    state
  }, id) {},
  copyDevice({
    commit,
    state
  }, id) {}
}

const getters = {
  isRootNode(state) {
    return state.isRootOrg
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
