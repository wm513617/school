/*
 * @Author: linhang
 * @Date: 2019-07-23 09:52:38
 * @Last Modified by: linhang
 * @Last Modified time: 2019-09-17 16:33:20
 */
'use strict'
let socketIo = null
// 获取socketIo对象
exports.init = (socket, io) => {
  if (socketIo === null) {
    socketIo = io
  }
}
/**
 * 发送服务器状态
 */
exports.emitServerStatus = statusObj => {
  try {
    if (socketIo) {
      socketIo.sockets.emit('callServerStatus', statusObj)
    }
  } catch (error) {
    console.log(error)
  }
}
/**
 * 发送分机状态
 * @param {*} statusObj
 */
exports.emitExtensionStatus = statusObj => {
  try {
    if (socketIo) {
      socketIo.sockets.emit('extensionStatus', statusObj)
    }
  } catch (error) {
    console.log(error)
  }
}
