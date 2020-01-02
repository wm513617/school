import {get, post} from '../../../../http/base'
import {getSocket} from '../../../../socket/socket.js'

const state = {
  whiteCurrentListPeoson: [], // 实时通行的人员
  blackCurrentListPeoson: [], // 黑名单的人员 和 灰名单的人员
  alarmTotalCount: 0, // 今日报警总人数
  ids: [] // 保存开流成功后的相机id;
}
const getters = {}
const mutations = {
  CURRENTNEWLIST(state, payload) { // 实时通行的人员
    state.whiteCurrentListPeoson = payload.white // 白名单
    state.blackCurrentListPeoson = [...payload.black, ...payload.gray] // 黑名单
    state.alarmTotalCount = payload.waring // 总共报警数据
  },

  SOCKETWHITELIST(state, payload) {
    if (state.whiteCurrentListPeoson.length < 65) {
      state.whiteCurrentListPeoson.unshift(...payload)
    } else {
      state.whiteCurrentListPeoson.splice((64 - payload.length), payload.length)
      state.whiteCurrentListPeoson.unshift(...payload)
    }
  },
  SOCKETBLACKLIST(state, payload) {
    state.alarmTotalCount += payload.length
    if (state.blackCurrentListPeoson && state.blackCurrentListPeoson.length < 65) {
      state.blackCurrentListPeoson.unshift(...payload)
    } else {
      state.blackCurrentListPeoson.splice((64 - payload.length - 1), payload.length)
      state.blackCurrentListPeoson.unshift(...payload)
    }
  },
  IDS(state, payload) {
    state.ids = payload
  }
}
const actions = {
  // 实时监控-获取X条当前最新的通行数据
  currentNewList({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/passage/currentNewList'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => {
        if (res && res.data) {
          console.log(res)
          res.data.white.map(it => {
            it['image'] = it.currentUrl ? it.currentUrl : it.url ? it.url : ''
            it['sex'] = it.sex ? it.sex : ''
            it['phone'] = it.user ? it.user.phone : ''
            // it['addressName'] = it.address ? it.address.name : ''
          })

          res.data.black.map(it => {
            it['image'] = it.currentUrl ? it.currentUrl : it.url ? it.url : ''
            it['sex'] = it.sex ? it.sex : ''
            it['phone'] = it.user ? it.user.phone : ''
            it['addressName'] = it.addressName || ''
          })

          if (res.data.gray.length > 0) {
            res.data.gray.map(it => {
              it['image'] = it.currentUrl ? it.currentUrl : it.url ? it.url : ''
              it['sex'] = it.sex ? it.sex : ''
              it['phone'] = it.user ? it.user.phone : ''
              it['addressName'] = it.addressName || ''
            })
          }
        }
        commit('CURRENTNEWLIST', res.data)
        resolve(res.data)
      }).catch(err => reject(err))
    })
  },

  refreshToken({commit}, payload) {
    var param = {
      query: payload,
      url: '/through/passage/refreshToken'
    }
    return new Promise((resolve, reject) => {
      get(param).then(res => {
        resolve(res)
      }).catch(err => reject(err))
    })
  },

  getSocketList({commit, state}, payload) {
    getSocket().on('passageUserData', data => {
      var ids = Array.from(new Set(state.ids))
      var arr = [] // 白名单
      var arrBlack = [] // 黑名单
      data.map(item => {
        item['image'] = item.currentUrl ? item.currentUrl : item.url ? item.url : ''
        item['orgName'] = item.orgName ? item.orgName : item.org ? item.org.orgName : ''
        //  item['addressName'] = item.address ? item.address.name : '';
        if (item.type === 2 || item.type === undefined) {
          ids.forEach(it => {
            if (it === item.camera[0]) {
              arr.push(item)
            }
          })
        }
        if (item.type === 0 || item.type === 1) { //  黑名单人员推送
          arrBlack.push(item)
        }
      })
      if (arr.length > 0) {
        commit('SOCKETWHITELIST', Array.from(new Set(arr)))
      }
      if (arrBlack.length > 0) {
        commit('SOCKETBLACKLIST', arrBlack)
      }
    })
  },
  closeSocket() {
    getSocket().close()
  },

  dataSocket({commit, state}, ids) {
    // console.log(state.ids)
    commit('IDS', JSON.parse(JSON.stringify(ids)))
  },
  findVieoMessage({commit}, payload) {
    var param = {
      body: payload,
      url: 'through/passage/findVieoMessage'
    }
    return new Promise((resolve, reject) => {
      post(param).then(res => resolve(res.data)).catch(err => reject(err))
    })
  }

}

export default {
  state,
  mutations,
  actions,
  getters
}
