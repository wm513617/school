import Vue from 'vue'
// import CryptoJS from 'crypto-js'

const Base64 = require('js-base64').Base64
var id = 0
// 打开现场流
/* {
   "channel": "通道号",
   "protocol": "传输协议TCP(1) UDP/RTP(4) ",
   "ip": "IP 地址,被动时为零",
   "port": "端口号,被动时为零",
   “coder”:”主码流(0),第一子码流(1),第二子码流(2),第四子码流标识图片流(3)”
} */
// 获取session信息
// export const getSession = () => {
//   const url = '/rest/2.0/res/auth_token'
//   const method = 'Security.Session.login'
//   const params = {
//     user: 'admin',
//     password: '123456',
//     actor: 'web'
//   }
//   var requestData = {
//     jsonrpc: '2.0',
//     id: ++id,
//     method: 'brest',
//     params: {
//       call: method,
//       args: params
//     }
//   }
//   return Vue.http.post(url, JSON.stringify(requestData), { timeout: 10000 })
// }
// 获取登录后的带token的后半部分url
// export const alarmFnc = () => {
//   alarm()
// }

export const getSession = ({ pramIp, pramPort }) => {
  const url = '/api/ipc/getSession' // /ipc/getSession
  const params = {
    ip: pramIp,
    port: pramPort
  }
  return Vue.http.post(url, JSON.stringify(params), { timeout: 10000 })
}
export const streamOpen = ({ pramIp, pramPort, pramSession }) => {
  const url = '/api/ipc/streamOpen' // /ipc/getSession
  const params = {
    session: pramSession,
    ip: pramIp,
    port: pramPort
  }
  return Vue.http.post(url, JSON.stringify(params), { timeout: 10000 })
}
function getUrlTokenQuery() {
  const key = 'Bluesky-G2-001'
  const timestamp = (Date.parse(new Date()) / 1000).toString()
  const tokenStr = Vue.CryptoJS.HmacSHA1(timestamp, key).toString()
  const token = Base64.encode(tokenStr)
  return `&timestamp=${timestamp}&token=${token}`
}

// 查询现场流状态
export const streamState = ({ session, streamId }) => {
  let url = '/rest/2.0/res/auth_token?session=' + session
  url += getUrlTokenQuery()
  const method = 'Stream.state'
  const params = {
    streamId
  }
  var requestData = {
    jsonrpc: '2.0',
    id: ++id,
    method: 'brest',
    params: {
      call: method,
      args: params
    }
  }
  return Vue.http.post(url, JSON.stringify(requestData), true)
}
// 暂停传输流
export const streamStop = ({ session, streamId }) => {
  let url = '/rest/2.0/res/auth_token?session=' + session
  url += getUrlTokenQuery()
  const method = 'Stream.stop'
  const params = {
    streamId
  }
  var requestData = {
    jsonrpc: '2.0',
    id: ++id,
    method: 'brest',
    params: {
      call: method,
      args: params
    }
  }
  return Vue.http.post(url, JSON.stringify(requestData), true)
}
// 关闭传输流
export const streamClose = ({ session, streamId }) => {
  let url = '/rest/2.0/res/auth_token?session=' + session
  url += getUrlTokenQuery()
  const method = 'Stream.close'
  const params = {
    streamId
  }
  var requestData = {
    jsonrpc: '2.0',
    id: ++id,
    method: 'brest',
    params: {
      call: method,
      args: params
    }
  }
  return Vue.http.post(url, JSON.stringify(requestData), true)
}
// 查询视频设备列表
export const getequipList = ({ streamopenOption }) => {
  const url = '/api/tvbords' // /ipc/getSession
  const params = streamopenOption
  return Vue.http.get(url, params, { timeout: 10000 })
}

export const setTVListOrder = params => {
  const url = '/api/tvbords'
  return Vue.http.put(url, params, { timeout: 10000 })
}
