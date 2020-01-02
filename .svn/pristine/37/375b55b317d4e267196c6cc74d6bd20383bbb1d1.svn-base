/**
 * 由于项目历史原因既使用原生websocket也使用socket.io
 * 此文件目前旨在创建两种socket的单例及统一的hook处理
 */
import io from 'socket.io-client'
import { read } from '../storage'

const SOCKETIO_HOST = window.location.host
// const SOCKETIO_HOST = '192.168.78.101'
const SOCKETIO_PATH = '/api/socket.io'
const WEBSOCKET_URL = `ws://${window.location.host}/api/ws/alarm`
const NOTICEWEBSOCKET_URL = `ws://${window.location.host}/api/ws/notice`
// const WEBSOCKET_URL = `ws://192.168.14.124/api/ws/alarm`
// const NOTICEWEBSOCKET_URL = `ws://192.168.14.124/api/ws/notice`

// socketio
let socket = null

export function getSocket() {
  if (!socket || !socket.connected) {
    return openSocket()
  }
  return socket
}

// 连接socket
function openSocket() {
  socket = io(SOCKETIO_HOST, {
    path: SOCKETIO_PATH
  })
  // 错误发生，并且无法被其他事件类型所处理
  socket.on('error', msg => {
    console.log('error socket', msg, new Date())
  })
  // 断开连接
  socket.on('disconnect', msg => {
    console.log('disconnect socket', msg, new Date())
  })
  // 正在重连
  socket.on('reconnecting', msg => {
    console.log('reconnecting socket', msg, new Date())
  })
  // 成功重连
  socket.on('reconnect', msg => {
    console.log('reconnect socket', msg, new Date())
  })
  // 连接成功
  socket.on('connect', msg => {
    console.log('connect socket', msg, new Date())
    socket.emit('authenticated', { token: read('user.access_token') })
  })

  return socket
}

// 原生接收报警websocket
let websocket = null

export function getWebSocket() {
  if (!websocket || websocket.readyState !== 1) {
    return openWebSocket()
  }
  return websocket
}

function openWebSocket() {
  const params = {
    name: read('user.username')
  }
  websocket = new WebSocket(WEBSOCKET_URL)
  websocket.onopen = () => {
    websocket.send(JSON.stringify(params))
  }
  websocket.onerror = err => {
    console.log('websocket error:', err)
  }
  return websocket
}

// 通知类websocket
let noticeWebsocket = null

export function getNoticeWebSocket() {
  if (!noticeWebsocket || noticeWebsocket.readyState !== 1) {
    return openNoticeWebSocket()
  }
  return noticeWebsocket
}

function openNoticeWebSocket() {
  const params = {
    name: read('user.username')
  }
  noticeWebsocket = new WebSocket(NOTICEWEBSOCKET_URL)
  noticeWebsocket.onopen = () => {
    noticeWebsocket.send(JSON.stringify(params))
  }
  noticeWebsocket.onerror = err => {
    console.log('noticeWebsocket error:', err)
  }
  return noticeWebsocket
}
