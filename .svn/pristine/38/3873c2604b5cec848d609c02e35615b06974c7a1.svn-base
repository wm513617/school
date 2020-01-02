/**
 * 人脸识socket推送接口
 * @time:2017-7-5
 * @author: hansen
*/
let socketIo = null
// 保存io对象
const init = (socket, io) => {
  if (socketIo === null) { socketIo = io }
}
// 人脸识别今日统计
const faceToday = (data) => {
  if (socketIo) { socketIo.sockets.emit('server:face.today', data) }
}
// 人员通行今日统计
const passToday = (data) => {
  if (socketIo) { socketIo.sockets.emit('server:pass.today', data) }
}
// 人脸识别实时推送
const realTime = (data) => {
  if (socketIo) { socketIo.sockets.emit('server:face.realTime', data) }
}

module.exports = {
  init,
  faceToday,
  passToday,
  realTime
}
