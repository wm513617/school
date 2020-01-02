import { post, get } from '../base'

// 查询台麦列表
export const getMicroPhoneListApi = (query) => get({
  url: '/intercom/conf/microphone',
  query
})
// 查询终端列表
export const getTerminalListApi = (query) => get({
  url: '/intercom/conf/terminal',
  query
})
// 台麦呼叫终端/台麦接听终端
export const postTalkbackAnswerApi = (body) => post({
  url: '/intercom/scense/call',
  body
})
// 台麦挂断终端
export const postTalkbackHangupApi = (body) => post({
  url: '/intercom/scense/hangup',
  body
})
export const postMicrophoneAnswerApi = (body) => post({
  url: '/intercom/scense/answer',
  body
})
