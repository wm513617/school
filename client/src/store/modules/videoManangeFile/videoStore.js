import {
  get,
  put,
  post
} from '../../../http/base.js'
const state = {
  storesonFlag: true,
  storeServer: [],
  storeServerList: [],
  storePath: [{
    _id: '1',
    path: '1'
  }, {
    _id: '2',
    path: '2'
  }, {
    _id: '3',
    path: '3'
  }, {
    _id: '4',
    path: '4'
  }, {
    _id: '5',
    path: '5'
  }, {
    _id: '6',
    path: '6'
  }, {
    _id: '7',
    path: '7'
  }, {
    _id: '8',
    path: '8'
  }, {
    _id: '9',
    path: '9'
  }, {
    _id: '10',
    path: '10'
  }, {
    _id: '11',
    path: '11'
  }, {
    _id: '12',
    path: '12'
  }, {
    _id: '13',
    path: '13'
  }, {
    _id: '14',
    path: '14'
  }, {
    _id: '15',
    path: '15'
  }, {
    _id: '16',
    path: '16'
  }]
}
const getters = {
  getStoresonFlag(state) {
    return state.storesonFlag
  },
  getStoreServer(state) {
    return state.storeServer
  },
  getStorePath(state) {
    return state.storePath
  },
  getStorage(state) {
    return state.storage
  }
}
const mutations = {
  SET_STORESON_FLAG(state, payLoad) {
    state.storesonFlag = payLoad
  },
  STORE_SERVER_DATA(state, payLoad) {
    // for (let i = 1; i <= 100; i++) {
    //   console.log('1')
    //   payLoad.push('DS:192.168.3.' + i + ':192.168.122.1:192.168.238.1:172.16.182.1:9001:E4060300FFFBEBBF910862')
    // }
    // payLoad.push('DS:192.168.3.7:192.168.122.1:192.168.238.1:172.16.182.1:9001:E4060300FFFBEBBF910862', 'DS:192.168.20.22:192.168.122.1:192.168.238.1:172.16.182.1:9001:E4060300FFFBEBBF910862')
    let arr = []
    payLoad.forEach((item, index) => {
      let val = (item.split(':')[1]).split('.')
      let num = []
      val.forEach((v, n) => {
        num += ('00' + v).substr(-3, 3)
      })
      arr.push({
        _id: num,
        server: item
      })
    })
    let newArr = []
    arr.sort((a, b) => {
      return a._id - b._id
    }).forEach((v, n) => {
      newArr.push({_id: [Number(v._id.substr(0, 3)), Number(v._id.substr(3, 3)), Number(v._id.substr(6, 3)), Number(v._id.substr(9, 3))].join('.'), server: v.server, flagIndex: true})
    })
    console.log(newArr, '11111')
    state.storeServerList = newArr
    // payLoad.split(':')
  }
}

const actions = {
  //  获取所有录像存储配置
  getStorageByTree({
    commit,
    state
  }, obj) {
    const params = {
      query: {
        page: obj.page,
        limit: obj.limit,
        key: obj.key,
        recursion: obj.recursion,
        org: obj.org,
        collection: obj.collection
      },
      url: '/setting/video/conf'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  getStorageExport({
    commit,
    state
  }, obj) {
    const params = {
      query: {
        // page: obj.page,
        // limit: obj.limit,
        key: obj.key,
        recursion: obj.recursion,
        org: obj.org,
        collection: obj.collection
      },
      url: '/setting/video/conf/export'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  // 修改录像存储
  changeStorageByUser({
    commit,
    state
  }, obj) {
    const params = {
      body: obj,
      url: '/setting/storage/'
    }
    return new Promise((resolve, reject) => {
      put(params).then(res => {
        resolve(res)
        // commit('SET_ORGTREE_DATA', res.data)
      }).catch(err => reject(err))
    })
  },
  // 获取服务器列表
  getStorageServer({
    commit,
    state
  }, obj) {
    const params = {
      query: obj,
      url: '/service/list'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res)
        commit('STORE_SERVER_DATA', res.data)
      }).catch(
        err => reject(err))
    })
  },
  // 一键配置
  changeAllConfig({
    state
  }, obj) {
    const params = {
      body: obj,
      url: '/setting/video/conf'
    }
    return new Promise((resolve, reject) => {
      post(params).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
