
import { read, save } from '../init'
import { loginUser, logoutUser, userHeartbeat, passwordEdit } from '../../../../src/http/login'

const state = {
  id: '',
  username: '',
  session: '',
  dataPowerList: [],
  dataPowerListALL: [],
  firstLoginFlag: ''
}
const getters = {
  logined(state) {
    return !(state.session === '' || state.session === 'undefined' || state.session === undefined || state.session === null)
  },
  businessPowerList({ businessPowerList }) {
    return businessPowerList
  },
  dataPowerList(state) {
    return state.dataPowerList
  },
  dataPowerListALL(state) {
    return state.dataPowerListALL
  },
  session(state) {
    return state.session
  },
  username(state) {
    return state.username
  },
  id(state) {
    return state.id
  },
  firstLoginFlag(state) {
    return state.firstLoginFlag
  },
  loginErr(state) {
    return state.loginErr
  }
}
const mutations = {
  SET_SESSION(state, data) {
    if (data) {
      state.username = data.username
      state.session = data.session
      state.firstLoginFlag = data.firstLoginFlag
      state.id = data.id
    }
  },
  SET_PRIVILEGE(state, data) {
    state.dataPowerListALL = data
    state.dataPowerList = []
    for (var opt of data) {
      if (opt.type === 'SYSTEM') {
        if (opt.privilege !== '') {
          state.dataPowerList = []
          for (var i = 0; i <= opt.privilege.length; i++) {
            const list = opt.privilege[i]
            state.dataPowerList.push({
              value: list
            })
          }
        } else {
          state.dataPowerList = []
        }
      }
    }
  }
}

const actions = {
  inintSession({ commit }) {
    const session = read()
    commit('SET_SESSION', session)
  },
  setSession({ commit }, data) {
    save(data)
    commit('SET_SESSION', data)
  },
  // 用户登录
  loginipc({ commit, dispatch, getters }, payload) {
    return new Promise((resolve, reject) => {
      if (getters.logined === true) {
        return
      }
      const userInfo = {
        username: payload.username,
        password: payload.password
      }
      // 登录接口
      return loginUser(userInfo).then(data => {
        resolve(data)
        dispatch('setSession', Object.assign(userInfo, {
          session: data.session,
          firstLoginFlag: data.firstLoginFlag,
          id: data.id || data._id
        }))
      }).catch((loginErr) => {
        console.log(loginErr)
        reject(loginErr)
      })
    })
  },
  // 用户登出
  logout({ dispatch }) {
    logoutUser().then((resp) => {
      dispatch('setSession', {
        username: '',
        session: ''
      })
    }).catch((loginoutErr) => {
    })
  },
  // 用户心跳
  heartbeat({ dispatch }) {
    return new Promise((resolve, reject) => {
      userHeartbeat().then((res) => {
        resolve(res)
      }).catch((err) => {
        dispatch('setSession', {
          username: '',
          session: ''
        })
        reject(err)
      })
    })
  },
  doPasswordEdit({commit}, payload) {
    return new Promise((resolve, reject) => {
      const editInfo = {
        id: payload.id, oldPswd: payload.oldPswd, newPswd: payload.newPswd
      }
      passwordEdit(editInfo).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
