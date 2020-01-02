/*
 * @Description: 视频结构化 socket 推送接口
 * @Author: wanglei
 * @Date: 2019-06-28 10:37:56
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-14 13:58:30
 */
'use strict'

let socketIo = null

// 保存io对象
const init = (socket, io) => {
  if (socketIo === null) {
    socketIo = io
  }
}

// 向前端推送通道识别的数据
const pushIdentifyData = (data) => {
  if (socketIo) {
    socketIo.sockets.emit(`videoStructure:identify`, data)
  }
}

// 向前端推送实时结构化中统计的各种识别数据的个数
const pushIdentifyDataCount = data => {
  if (socketIo) {
    socketIo.sockets.emit('videoStructure:realTime.count', data)
  }
}

// 向前端推送布控报警数据
const pushDefenseAlarmData = data => {
  if (socketIo) {
    socketIo.sockets.emit('structDefenseAlarm:alarm', data)
  }
}

// 向前端推送布控任务总数量
const pushDefenseTaskDataCount = data => {
  if (socketIo) {
    socketIo.sockets.emit('structDefenseTask:total.count', data)
  }
}

// 向前端推送结构化相机在线数量
const pushStructVideoOnlineCount = data => {
  if (socketIo) {
    socketIo.sockets.emit('structVideoChannel:online.count', data)
  }
}

// 向前端推送数据统计中今日统计的实时数据
const pushTodayDataCount = data => {
  if (socketIo) {
    socketIo.sockets.emit('structureStatistic:today.count', data)
  }
}

// 向前端推送今日行人流量 Top10
const pushPedestrianFlowTop10 = data => {
  if (socketIo) {
    socketIo.sockets.emit('pedestrianFlowTop10:today.count', data)
  }
}

// 向前端推送今日机动车流量 Top10
const pushVehicleFlowTop10 = data => {
  if (socketIo) {
    socketIo.sockets.emit('vehicleFlowTop10:today.count', data)
  }
}

// 向前端推送今日非机动车流量 Top10
const pushNoVehicleFlowTop10 = data => {
  if (socketIo) {
    socketIo.sockets.emit('noVehicleFlowTop10:today.count', data)
  }
}

// 向前端推送今日时段布控报警数量
const pushDefenseAlarmTimeSlotCount = data => {
  if (socketIo) {
    socketIo.sockets.emit('defenseAlarmTimeSlot:today.count', data)
  }
}

module.exports = {
  init,
  pushIdentifyData,
  pushIdentifyDataCount,
  pushDefenseAlarmData,
  pushDefenseTaskDataCount,
  pushPedestrianFlowTop10,
  pushVehicleFlowTop10,
  pushNoVehicleFlowTop10,
  pushDefenseAlarmTimeSlotCount,
  pushStructVideoOnlineCount,
  pushTodayDataCount
}
