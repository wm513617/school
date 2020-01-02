#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app')
var debug = require('debug')('demo:server')
var http = require('http')
var config = require('../../config').backend

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(config.port || process.env.PORT || '3000')
// app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app.callback())

// add socket.io here
var socketio = require('socket.io')(server, { path: '/api/socket.io' })
require('../config/socketio')(socketio)
exports.socketio = socketio
// 添加定时任务
require('../config/schedule')()
// 报警权限写入缓存
require('../config/writeRedis')()

/**
 * Listen on provided port, on all network interfaces.
 */

// Start server

server.listen(config.port, config.ip, function () {
  console.log(`Koa server listening on ${config.port}, in ${app.env} mode `)
})

server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

/**
 * init dir
 */
const { mkdirsSync } = require('../common/tools')
Object.keys(config.fileDirs).forEach(key => {
  mkdirsSync(config.fileDirs[key])
})
// /* **********************************日志文件夹创建*********************************** */
// var fs = require('fs')
// var logConfig = require('../config/log.config')

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
// var confirmPath = function (pathStr) {
//   if (!fs.existsSync(pathStr)) {
//     fs.mkdirSync(pathStr)
//   }
// }

// /**
//  * 初始化log相关目录
//  */
// var initLogPath = function () {
//   // 创建log的根目录'logs'
//   if (logConfig.baseLogPath) {
//     confirmPath(logConfig.baseLogPath)
//     // 根据不同的logType创建不同的文件目录
//     for (var i = 0, len = logConfig.appenders.length; i < len; i++) {
//       if (logConfig.appenders[i].path) {
//         confirmPath(logConfig.baseLogPath + logConfig.appenders[i].path)
//       }
//     }
//   }
// }

// initLogPath()
