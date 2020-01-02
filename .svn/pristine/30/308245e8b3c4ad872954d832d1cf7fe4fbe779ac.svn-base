/**
 * websocket 信息转发
 */
const faceSocket = require('../api/face/service/face.socket')
const vehiclesocket = require('../api/vehicle/identify/vehiclesocket')
const patrolSocket = require('../api/patrol/patrol.socket')
const sdkV3Socket = require('../api/veriface/sdkV3.socket')
const videoStructureSocket = require('../api/structure/structure.socket')
const callCenterSocket = require('../api/map/call/socketio')
const vehicleCheckSocket = require('../api/sys/intelligentTraffic/peopleVehicle/socketio')
const passageSocket = require('../api/through/passage/socketio')
// const devOnline = require('../api/map/point/point.socket')

module.exports = async (socket, io, user) => {
  faceSocket.init(socket, io)
  vehiclesocket.init(socket, io)
  patrolSocket.init(socket, io, user)
  sdkV3Socket.init(socket, io, user)
  videoStructureSocket.init(socket, io)
  callCenterSocket.init(socket, io)
  vehicleCheckSocket.init(socket, io) // 人车同检socket数据推送
  passageSocket.init(socket, io) // 人员通行模块-实时监控推送
}
