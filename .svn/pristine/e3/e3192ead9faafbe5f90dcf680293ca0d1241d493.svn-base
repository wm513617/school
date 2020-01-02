/*
 * @Description: 视频结构化统计分析
 * @Author: wanglei
 * @Date: 2019-07-11 19:50:07
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-09-29 13:31:16
 */
'use strict'
const mongoose = require('mongoose')
const StructureDefenseTask = mongoose.model('structuredefensetask')
const Resource = mongoose.model('Resource')
const OrgRes = mongoose.model('OrgRes')
const Org = mongoose.model('Org')
const { influxdb } = require('../identify/influxdb/influxdb')

const { AnalysisStatusCodeEnum } = require('../structure.enum')
const { ORG_TYPE } = require('../../../common/constant')
const socket = require('../structure.socket')
const moment = require('moment')

/**
 * 向前端推送今日统计数据
 * 今日结构化目标总数、今日布控报警数量、布控任务总数、结构化相机在线情况
 */
const todayData = async () => {
  try {
    const offlineStatusArr = [
      AnalysisStatusCodeEnum.NOTSTART,
      AnalysisStatusCodeEnum.STOPED,
      AnalysisStatusCodeEnum.ANALYZFAIL
    ]
    const todayZeroTime = moment()
      .startOf('day')
      .valueOf()
    const currentTime = Date.now()
    const rootOrg = await Org.findOne({ type: ORG_TYPE.VIDEO_STRUCTURE, isroot: true }, '_id')
      .lean()
      .exec()
    let resIds = await OrgRes.find({ rootorg: rootOrg._id }, 'resource')
      .lean()
      .exec()
    resIds = resIds.map(item => item.resource)
    const sqlDefenseAlarms = `SELECT sum(count) as count FROM "defenseAlarmTimeSlot" WHERE time >= ${todayZeroTime}ms and time <= ${currentTime}ms`
    const [response, alarmCount, taskCount, onlineCount, offlineCount] = await Promise.all([
      totalStructureCount(),
      influxdb.query(sqlDefenseAlarms),
      StructureDefenseTask.countDocuments(),
      Resource.countDocuments({ 'videoStructure.analysisStatus': AnalysisStatusCodeEnum.ANALYZING }),
      Resource.countDocuments({ _id: { $in: resIds }, 'videoStructure.analysisStatus': { $in: offlineStatusArr } })
    ])
    const result = {
      structCount: response.reduce((sum, item) => sum + (item && item[0] && item[0].count) || 0, 0) || 0,
      alarmCount: (alarmCount.length && alarmCount[0].count) || 0,
      taskCount: taskCount,
      onlineCount: onlineCount,
      offlineCount: offlineCount
    }
    return result
  } catch (error) {
    console.log(`前端推送今日统计数据出错 - ${error.message}`)
  }
}

const totalStructureCount = async () => {
  const todayZeroTime = moment()
    .startOf('day')
    .valueOf()
  const result = await influxdb.query([
    `SELECT sum(count) as count FROM "pedFlowTop10" where time > ${todayZeroTime}ms`,
    `SELECT sum(count) as count FROM "vehFlowTop10" where time > ${todayZeroTime}ms`,
    `SELECT sum(count) as count FROM "nonVehFlowTop10" where time > ${todayZeroTime}ms`
  ])
  return result
}

// 统计今日各个通道的行人通行最多的前 10 位
const statisticPedestrianFlowTop10 = async () => {
  const todayZeroTime = moment()
    .startOf('day')
    .valueOf()
  const sql = `SELECT sum(count) as count FROM "pedFlowTop10" WHERE time > ${todayZeroTime}ms GROUP BY videoChannel`
  let dataArr = await influxdb.query(sql)
  dataArr.sort((a, b) => b.count - a.count)
  dataArr = dataArr.slice(0, 10)
  for (let item of dataArr) {
    const { name } = await Resource.findById(item.videoChannel, 'name').lean().exec()
    item['channelName'] = name
  }
  return dataArr
}

// 统计今日各个通道的机动车通行最多的前 10 位
const statisticVehicleFlowTop10 = async () => {
  const todayZeroTime = moment()
    .startOf('day')
    .valueOf()
  const sql = `SELECT sum(count) as count FROM "vehFlowTop10" WHERE time > ${todayZeroTime}ms GROUP BY videoChannel`
  let dataArr = await influxdb.query(sql)
  dataArr.sort((a, b) => b.count - a.count)
  dataArr = dataArr.slice(0, 10)
  for (let item of dataArr) {
    const { name } = await Resource.findById(item.videoChannel, 'name').lean().exec()
    item['channelName'] = name
  }
  return dataArr
}

// 统计今日各个通道的非机动车通行最多的前 10 位
const statisticNoVehicleFlowTop10 = async () => {
  const todayZeroTime = moment()
    .startOf('day')
    .valueOf()
  const sql = `SELECT sum(count) as count FROM "nonVehFlowTop10" WHERE time > ${todayZeroTime}ms GROUP BY videoChannel`
  let dataArr = await influxdb.query(sql)
  dataArr.sort((a, b) => b.count - a.count)
  dataArr = dataArr.slice(0, 10)
  for (let item of dataArr) {
    const { name } = await Resource.findById(item.videoChannel, 'name').lean().exec()
    item['channelName'] = name
  }
  return dataArr
}

// 向前端推送今日时段布控报警数量
const statisticDefenseAlarmTimeSlotCount = async () => {
  const todayZeroTime = moment()
    .startOf('day')
    .valueOf()
  const sql = `SELECT * FROM "defenseAlarmTimeSlot"  WHERE time > ${todayZeroTime}ms`
  const data = await influxdb.query(sql)
  return data
}

const pushTodayDataCount = async () => {
  try {
    const data = await todayData()
    socket.pushTodayDataCount(data)
  } catch (error) {
    console.log(`前端推送今日统计数据出错 - ${error.message}`)
  }
}

const pushPedestrianFlowTop10 = async () => {
  try {
    const data = await statisticPedestrianFlowTop10()
    socket.pushPedestrianFlowTop10(data)
  } catch (error) {
    console.log(`向前端推送今日行人流量 Top10 出错 - ${error.message}`)
  }
}

const pushVehicleFlowTop10 = async () => {
  try {
    const data = await statisticVehicleFlowTop10()
    socket.pushVehicleFlowTop10(data)
  } catch (error) {
    console.log(`向前端推送今日机动车流量 Top10 出错 - ${error.message}`)
  }
}

const pushNoVehicleFlowTop10 = async () => {
  try {
    const data = await statisticNoVehicleFlowTop10()
    socket.pushNoVehicleFlowTop10(data)
  } catch (error) {
    console.log(`向前端推送今日非机动车流量 Top10 出错 - ${error.message}`)
  }
}

const pushDefenseAlarmTimeSlotCount = async () => {
  try {
    const data = await statisticDefenseAlarmTimeSlotCount()
    socket.pushDefenseAlarmTimeSlotCount(data)
  } catch (error) {
    console.log(`向前端推送今日非机动车流量 Top10 出错 - ${error.message}`)
  }
}

module.exports = {
  todayData,
  statisticPedestrianFlowTop10,
  statisticVehicleFlowTop10,
  statisticNoVehicleFlowTop10,
  statisticDefenseAlarmTimeSlotCount,
  pushTodayDataCount,
  pushPedestrianFlowTop10,
  pushVehicleFlowTop10,
  pushNoVehicleFlowTop10,
  pushDefenseAlarmTimeSlotCount
}
