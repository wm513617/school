import {
  get,
  post,
  put,
  remove
} from '../../../http/base'
const state = {
  showOrgOrServer: true,
  serverTableList: [],
  pageShowData: {
    counts: '',
    pages: '',
    current: '',
    limits: ''
  },
  getDoorHead: {},
  treeNode: '',
  tableLists: [],
  entranceGuard: false,
  showPageData: false,
  operateData: true,
  serverListLeft: []
}
const mutations = {
  // 切换右边的模块
  PANEL_SWIFCH(state, payLoad) {
    state.showOrgOrServer = payLoad
  },
  CHANGE_OPERA_ALL(state, payLoad) {
    state.operateData = payLoad
  },
  // // 服务器配置表
  // SERVERS_LIST(state, payLoad) {
  //   payLoad.results.forEach((item, index) => {
  //     item.number = index + 1
  //   })
  //   state.serverTableList = payLoad.results
  // },
  GET_PAGE_DATA(state, payLoad) {
    // 分页数据--后边加
    // 总数
    state.pageShowData.counts = payLoad['x-bsc-count'] // eslint-disable-line
    // 总页数
    state.pageShowData.pages = payLoad['x-bsc-pages'] // eslint-disable-line
    // 当前页
    state.pageShowData.current = payLoad['x-bsc-cur'] // eslint-disable-line
    // 每页限定数据
    state.pageShowData.limits = payLoad['x-bsc-limit'] // eslint-disable-line
  },
  GET_DOOR_HEADER(state, payLoad) {
    state.getDoorHead = state.pageShowData
    state.getDoorHead.counts = payLoad['x-bsc-count'] // eslint-disable-line
    state.getDoorHead.pages = payLoad['x-bsc-pages'] // eslint-disable-line
    state.getDoorHead.current = payLoad['x-bsc-cur'] // eslint-disable-line
    state.getDoorHead.limits = payLoad['x-bsc-limit'] // eslint-disable-line
  },
  GET_CURRENT_SRV(state, payLoad) {
    state.treeNode = payLoad
  },
  ALLOW_ENTRANCE_GUARD(state, payLoad) {
    state.entranceGuard = payLoad
  }
}
const actions = {
  doorServerList({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/servers',
      query: payLoad
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        commit('GET_PAGE_DATA', res.headers)
        resolve(res.data.results || [])
        // commit('SERVERS_LIST', res.data)
      }).catch((err) => {
        console.log('this.doorServerList :' + err)
      })
    })
  },
  addServerData({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/servers',
      body: payLoad
    }
    return post(params)
    // return new Promise((resolve, reject) => {
    //   post(params).then(res => {
    //     resolve(res)
    //   }).catch((err) => {
    //     reject(err)
    //   })
    // })
  },
  getIdServerData({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/servers/' + payLoad
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.getIdServerData :' + err)
      })
    })
  },
  modServerData({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/servers/' + payLoad._id,
      body: payLoad
    }
    // console.log(payLoad)
    return new Promise((resolve, reject) => {
      put(params).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
        console.log('this.modServerData :' + err)
      })
    })
  },
  delServerData({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/servers/' + payLoad
    }
    return new Promise((resolve, reject) => {
      remove(params).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.delServerData :' + err)
      })
    })
  },
  getDoorSyn({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/' + payLoad.id + '/sync',
      query: payLoad.id
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        commit('GET_DOOR_HEADER', res.headers)
        resolve(res.data || [])
      }).catch(err => {
        reject(err)
      })
    })
  },
  getDoorList({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/' + payLoad.id + '/list',
      query: payLoad.data
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        commit('GET_DOOR_HEADER', res.headers)
        resolve(res.data || [])
        if (state.entranceGuard) {
          commit('SERVERS_LIST', res.data)
          commit('ALLOW_ENTRANCE_GUARD', false)
        }
      }).catch(err => {
        console.log('this.getDoorList :' + err)
      })
    })
  },
  queryDoors({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/' + payLoad._id + '/query',
      query: payLoad.data
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        commit('GET_DOOR_HEADER', res.headers)
        resolve(res.data || [])
      }).catch(err => {
        console.log('this.queryDoors :' + err)
      })
    })
  },
  getSources({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/' + payLoad + '/res'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res.data || [])
      }).catch(err => {
        reject(err)
        console.log('this.getSources :' + err)
      })
    })
  },
  postSources({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/' + payLoad.id + '/res',
      body: payLoad.arr
    }
    return new Promise((resolve, reject) => {
      post(params).then(res => {
        resolve(res)
      }).catch(err => {
        console.log('this.postSources :' + err)
      })
    })
  },
  getSrvLabeList({
    state,
    commit
  }) {
    const params = {
      url: '/door/servers/all'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res.data || [])
      }).catch(err => {
        reject(err)
        console.log('this.getSources :' + err)
      })
    })
  },
  // 获取机构资源树
  getDoorTree({
    state,
    commit
  }) {
    const params = {
      url: '/setting/resource/tree?type=0'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res.data || [])
      }).catch(err => {
        reject(err)
        console.log('this.getSources :' + err)
      })
    })
  }
}
const getters = {
  showOrgOrServer(state) {
    return state.showOrgOrServer
  },
  operateData(state) {
    return state.operateData
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
