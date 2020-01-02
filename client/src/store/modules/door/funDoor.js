import {get
} from '../../../http/base'
const state = {
  getTreeNode: '',
  searchList: [],
  pageSortData: {
    counts: '',
    pages: '',
    current: '',
    limits: '',
    videoPlayBlack: []
  }
  // clickLeftTree: false
}
const mutations = {
  GET_CURRENT_SRV(state, payLoad) {
    state.getTreeNode = payLoad
  },
  GET_SEARCH_LIST(state, payLoad) {
    state.searchList = payLoad
  },
  GET_RESOURCE(state, payLoad) {
    console.log(payLoad)
  },
  GET_VIDEO_LISTS(state, payLoad) {
    state.searchList = payLoad
  },
  GET_PAGE_SORT(state, payLoad) {
    // 总数
    state.pageSortData.counts = payLoad['x-bsc-count'] // eslint-disable-line
    // 总页数
    state.pageSortData.pages = payLoad['x-bsc-pages'] // eslint-disable-line
    // 当前页
    state.pageSortData.current = payLoad['x-bsc-cur'] // eslint-disable-line
    // 每页限定数据
    state.pageSortData.limits = payLoad['x-bsc-limit'] // eslint-disable-line
  },
  GET_ALL_RESOURCE(state, payLoad) {
    state.videoPlayBlack = payLoad
  }
  // CHANGE_CLICK_TREENODE (state, payLoad) {
  //   state.clickLeftTree = payLoad
  // }
}
const actions = {
  openOrCloseDoor({
    state,
    commit
  }, payLoad) {
    const param = {
      url: '/door/' + payLoad._id + '/' + payLoad.number + '/' + 'ctrl',
      query: {
        op: payLoad.opera
      }
    }
    return new Promise((resolve, reject) => {
      get(param).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
        console.log('this.openOrCloseDoor :' + err)
      })
    })
  },
  cardRecode({
    state,
    commit
  }, payLoad) {
    const param = {
      url: '/door/' + payLoad.id + '/pass/list',
      query: payLoad.data
    }
    return new Promise((resolve, reject) => {
      get(param).then((res) => {
        resolve(res)
        commit('GET_VIDEO_LISTS', res.data)
        commit('GET_PAGE_SORT', res.headers)
      }).catch((err) => {
        console.log('this.cardRecode :' + err)
      })
    })
  },
  getVideoResource({
    state,
    commit
  }, payLoad) {
    const params = {
      url: '/door/pass/' + payLoad + '/res'
    }
    return new Promise((resolve, reject) => {
      get(params).then(res => {
        resolve(res)
        commit('GET_ALL_RESOURCE', res.data)
      }).catch(err => {
        reject(err)
        console.log('this.getVideoResource :' + err)
      })
    })
  }
}
export default {
  state,
  mutations,
  actions
}
