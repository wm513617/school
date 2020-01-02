/*
 * @Author: hansen.liuhao
 * @Date: 2019-01-02 14:07:46
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-07-26 11:43:10
 */

let socketIo = null
// 保存io对象
const init = (socket, io) => {
  if (socketIo === null) {
    socketIo = io
  }
}
/**
 * 推送终端报警到平台中心
 */
const intercomCall = data => {
  if (socketIo) {
    socketIo.sockets.emit('intercom:call', data)
  }
}
module.exports = {
  init,
  intercomCall
}
