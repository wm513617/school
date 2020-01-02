/**
 * Socket.io configuration
 */

'use strict'
let io = null

const { getUserByToken, removeSocketId } = require('../common/socket.permisson')

function onConnect (socket, user) {
  require('../common/socket.tool.js')(socket, io, user)
}
function disConnect (socket) {
  removeSocketId(socket.id)
}

module.exports = function (socketio) {
  io = socketio
  socketio.on('connection', function (socket) {
    console.log('socket_id==%s', socket.id)
    socket
      .on('disconnect', function () {
        disConnect(socket)
      })
      .on('authenticated', async function (data) {
        const user = await getUserByToken(data.token)
        if (user) {
          onConnect(socket, user)
        } else {
          socket.disconnect(true)
        }
      })
  })
}
