const rpcCall = require('./rpcapi').rpcCall
/**
 * 获取session信息
 * @param {string} ip
 * @param {number} port
 */
const getSession = async (ip, port) => {
  const url = '/rest/2.0/res/auth_token'
  const method = 'Security.Session.login'
  const params = {
    user: 'admin',
    password: '123456',
    actor: 'web'
  }
  // ip, port, url, method, params, addTokenQuery = false
  const result = await rpcCall(ip, port, url, method, params, false)
  return result
}

/**
 * streamOpen
 * @param {string} ip
 * @param {number} port
 * @param {string} session
 */
const streamOpen = async (ip, port, session) => {
  const url = '/rest/2.0/res/auth_token?session=' + session
  const method = 'Stream.open'
  const params = {
    // 预览参数
    channel: 1,
    ip: 0,
    protocol: 1,
    port: 0,
    coder: 0
  }
  const result = await rpcCall(ip, port, url, method, params, true)
  return result
}

/**
 * 报警接收json格式
 */
const alarmInformation = async (ip, port, session, type) => {
  // type:danger,success,warning
  const url = '/rest/2.0/res/auth_token?session=' + session
  const method = 'Event.Notification.get'
  const params = {
    type
  }
  const result = await rpcCall(ip, port, url, method, params, true)
  return result
}

exports.getSession = getSession
exports.streamOpen = streamOpen
exports.alarmInformation = alarmInformation
