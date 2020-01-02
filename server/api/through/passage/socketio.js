/**
 * 监控&通行记录Socket
 * @time:2019-8-14
 * @author:MeiChen
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
 * 发送实时通行人员信息
 */
exports.passageUser = (data) => {
  try {
    socketIo.sockets.emit('passageUserData', data)
  } catch (error) {
    console.log(error)
  }
}
