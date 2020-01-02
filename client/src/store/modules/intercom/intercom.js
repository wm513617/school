import { getMicroPhoneListApi, getTerminalListApi, postTalkbackAnswerApi, postTalkbackHangupApi, postMicrophoneAnswerApi } from '../../../http/intercom/talkback.api'

const state = {}
const mutations = {}
const actions = {
  // 查询台麦列表
  getMicroPhoneList({commit}, query) {
    return getMicroPhoneListApi(query)
  },
  // 查询终端列表
  getTerminalList({commit}, query) {
    return getTerminalListApi(query)
  },
  // 台麦呼叫终端
  postTalkbackAnswer({commit}, body) {
    return postTalkbackAnswerApi(body)
  },
  // 台麦挂断终端
  postTalkbackHangup({commit}, body) {
    return postTalkbackHangupApi(body)
  },
  // 台麦接听终端
  postMicrophoneAnswer({commit}, body) {
    return postMicrophoneAnswerApi(body)
  }
}
const getter = {}

export default {
  state,
  mutations,
  actions,
  getter
}
