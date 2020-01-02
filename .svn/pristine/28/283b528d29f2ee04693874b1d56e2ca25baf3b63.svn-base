/*
 * @Author: hansen.liuhao
 * @Date: 2019-01-02 14:07:46
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-03-15 11:23:53
 */

const { maintainResourceByRole, emitByResPermisson } = require('../../common/socket.permisson')

let socketIo = null
// 保存io对象
const init = (socket, io, user) => {
  if (socketIo === null) {
    socketIo = io
  }
  if (user.role) {
    maintainResourceByRole(socket.id, user.role.toString(), { type: 5, properties: { $exists: true } })
  }
}
/**
 * 人脸SDK识别今日统计
 * @param {object} data 统计数据
 */
const verifaceToday = data => {
  if (socketIo) {
    socketIo.sockets.emit('verifaceToday', data)
  }
}
/**
 * 人脸SDK识别数据
 * @param {object} data 识别数据
 */
const veriFaceData = data => {
  if (socketIo) {
    emitByResPermisson(socketIo, 5, 'veriFaceData', data.res, data)
    // socketIo.sockets.emit('veriFaceData', data)
  }
}
/**
 * 质量优先通知
 * @param {object} data 更新人像图片的id
 */
const veriFaceNotify = data => {
  if (socketIo) {
    emitByResPermisson(socketIo, 5, 'veriFaceNotify', data.res, data)
    // socketIo.sockets.emit('veriFaceNotify', data)
  }
}
/**
 * 路人/报警统计
 * @param {object} data 统计数据
 */
const veriFaceStatics = data => {
  if (socketIo) {
    socketIo.sockets.emit('veriFaceStatics', data)
  }
}
module.exports = {
  init,
  verifaceToday,
  veriFaceData,
  veriFaceNotify,
  veriFaceStatics
}
