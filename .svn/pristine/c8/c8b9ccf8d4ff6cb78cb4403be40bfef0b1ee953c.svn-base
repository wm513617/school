/*
 * @Author: linhang
 * @Date: 2019-07-23 09:52:38
 * @Last Modified by: linhang
 * @Last Modified time: 2019-07-31 09:32:30
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
 * 发送实时过车数据
 */
exports.emitPassVehicleData = data => {
  try {
    socketIo.sockets.emit('passVehicleData', data)
  } catch (error) {
    console.log(error)
  }
}
/**
 * 发送人车同检数据
 * @param {*} statusObj
 */
exports.emitVehicleCheckData = data => {
  try {
    socketIo.sockets.emit('vehicleCheckData', data)
  } catch (error) {
    console.log(error)
  }
}
/**
 * 发送人车同检当日核验失败次数
 * @param {*} statusObj
 */
exports.emitVehicleCheckFailureData = data => {
  try {
    socketIo.sockets.emit('vehicleCheckFailureNo', data)
  } catch (error) {
    console.log(error)
  }
}
