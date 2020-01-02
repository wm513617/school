import { getTalkServerApi, editTalkServerApi, getTalkMicroPhoneApi, addTalkMicroPhoneApi, editTalkMicroPhoneApi, deleteTalkMicroPhoneApi, getTalkTerminalApi, addTalkTerminalApi, editTalkTerminalApi, deleteTalkTerminalApi } from 'http/talkConfig.api.js'

const state = {
  talkServer: ''
}

const mutations = {
  GET_TALKSERVER(state, payload) {
    state.talkServer = payload
  }
}

const actions = {
  getTalkServer({commit}, payload) {
    return new Promise((resolve, reject) => {
      getTalkServerApi().then(res => {
        commit('GET_TALKSERVER', res.data)
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  },
  editTalkServer({commit}, payload) {
    return editTalkServerApi(payload)
  },
  getTalkMicroPhone({commit}, payload) {
    return getTalkMicroPhoneApi(payload)
  },
  addTalkMicroPhone({commit}, payload) {
    return addTalkMicroPhoneApi(payload)
  },
  editTalkMicroPhone({commit}, payload) {
    return editTalkMicroPhoneApi(payload)
  },
  deleteTalkMicroPhone({commit}, payload) {
    return deleteTalkMicroPhoneApi(payload)
  },
  getTalkTerminal({commit}, payload) {
    return getTalkTerminalApi(payload)
  },
  addTalkTerminal({commit}, payload) {
    return addTalkTerminalApi(payload)
  },
  editTalkTerminal({commit}, payload) {
    return editTalkTerminalApi(payload)
  },
  deleteTalkTerminal({commit}, payload) {
    return deleteTalkTerminalApi(payload)
  }
}

export default {
  state,
  mutations,
  actions
}
