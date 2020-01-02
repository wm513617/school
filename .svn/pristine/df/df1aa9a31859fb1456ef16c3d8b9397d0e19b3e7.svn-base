// let tempSocket = null
let io = null

// 初始化socket
exports.init = (socket, Io) => {
  if (io === null) { io = Io }
}

// setInterval(function () {
//   if (tempSocket) {
//     console.log('time : ' + new Date().getSeconds())
//     data.eventType = Math.ceil(Math.random() * 42)
//     io.emit('alarm_fire', data)
//   }
// }, 2000)

// 实时过车数据
exports.setRealTimeData = (data) => {
  if (io) { io.sockets.emit('server:vehicleRealTime', data) }
}

// 实时自行车或摩托车数据数据
exports.setBikesRealTimeData = (data) => {
  if (io) { io.sockets.emit('server:bikesRealTime', data) }
}

// 实时行人数据
exports.setPedestrainsRealTimeData = (data) => {
  if (io) { io.sockets.emit('server:pedestrainsRealTime', data) }
}

// 布控车辆数据
exports.setDefense = (data) => {
  if (io) { io.sockets.emit('server:vehicleDefense', data) }
}

// const data = {
//   'alarmId': '报警ID,用于确认报警',
//   'devIp': '设备IP',
//   'devId': '设备ID',
//   'devPort': 44,
//   'manufacturer': '厂商',
//   'channel': 3, // 如果是消防代表的是防区号'channelId': '通道ID',
//   'classifyName': '报警分类名称', // 消防不用'classifyId': '报警分类ID',
//   // 消防不用
//   'time': '1488779574',
//   // 级别
//   'level': '2',
//   'organization': '蓝色星际/总部/14层/总裁楼道',
//   'name': '烟感探头',
//   'eventType': '事件类型',
//   'slot': 8, // 代表槽号(也是设备回路)如果是消防的才会有'level': '1',
//   'actionList': [
//     {
//       'devIp': '设备ip',
//       'devPort': 33,
//       'streamType': '流类型',
//       'channel': 55,
//       'channelId': '通道id',
//       'devId': '设备id',
//       'map': true,
//       'client': true,
//       'wall': true,
//       'main': true
//     }
//   ], 'point': {
//     'loc': '119.18163212440479,34.12228238677427',
//     'mapId': '5acd9b8fe9fe0f25383659b4',
//     '_id': '5acddcf75164aa3d4457e424',
//     'principal': [
//       {
//         '_id': '5acddcf75164aa3d4457e425',
//         'name': '',
//         'mobile': ''
//       }
//     ],
//     'isouter': true
//   }
// }
