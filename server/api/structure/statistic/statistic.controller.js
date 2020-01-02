/*
 * @Description: 视频结构化统计分析
 * @Author: wanglei
 * @Date: 2019-07-04 16:32:34
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-09-21 12:21:41
 */
'use strict'

const moment = require('moment')
const xl = require('excel4node')
const { influxdb } = require('../identify/influxdb/influxdb')
const { handleSysException } = require('../../../common/tools')
const {
  todayData,
  statisticPedestrianFlowTop10,
  statisticVehicleFlowTop10,
  statisticNoVehicleFlowTop10,
  statisticDefenseAlarmTimeSlotCount
} = require('./statistic.service')

// 获取今日统计数据
exports.statisticToday = async ctx => {
  try {
    const [todayCount, pedTop10, vehTop10, nonVehTop10, defenseAlarms] = await Promise.all([
      todayData(),
      statisticPedestrianFlowTop10(),
      statisticVehicleFlowTop10(),
      statisticNoVehicleFlowTop10(),
      statisticDefenseAlarmTimeSlotCount()
    ])
    ctx.body = {
      todayCount: todayCount,
      pedTop10: pedTop10,
      vehTop10: vehTop10,
      nonVehTop10: nonVehTop10,
      defenseAlarms: defenseAlarms
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 统计分析页面统计行人、机动车、非机动车、时段布控报警数据
exports.statisticAnalyz = async ctx => {
  try {
    const result = await analysisData(ctx)
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

exports.export = async ctx => {
  try {
    const data = await analysisData(ctx)
    const wb = new xl.Workbook()
    const ws = wb.addWorksheet('结构化统计数据')
    const myStyle = wb.createStyle({
      font: {
        bold: true
      },
      alignment: {
        wrapText: true,
        horizontal: 'center'
      }
    })
    ws.cell(1, 1)
      .string('日期')
      .style(myStyle)
    ws.cell(1, 2)
      .string('报警数')
      .style(myStyle)
    ws.cell(1, 3)
      .string('行人')
      .style(myStyle)
    ws.cell(1, 4)
      .string('机动车')
      .style(myStyle)
    ws.cell(1, 5)
      .string('非机动车')
      .style(myStyle)
    for (let i = 0; i < data.defenseAlarms.length; i++) {
      ws.cell(i + 2, 1)
        .string(moment(data.defenseAlarms[i].time).format('YYYY-MM-DD'))
        .style(myStyle)
      ws.cell(i + 2, 2)
        .number(data.defenseAlarms[i].count)
        .style(myStyle)
    }
    for (let i = 0; i < data.pedTop10.length; i++) {
      ws.cell(i + 2, 3)
        .number(data.pedTop10[i].count)
        .style(myStyle)
    }
    for (let i = 0; i < data.vehTop10.length; i++) {
      ws.cell(i + 2, 4)
        .number(data.vehTop10[i].count)
        .style(myStyle)
    }
    for (let i = 0; i < data.nonVehTop10.length; i++) {
      ws.cell(i + 2, 5)
        .number(data.nonVehTop10[i].count)
        .style(myStyle)
    }
    const buffer = await wb.writeToBuffer()
    const fileName = `统计分析导出${moment().format('YYYY-MM-DD')}.xlsx`.toString('utf-8')
    ctx.type = 'application/vnd-openxmlformats'
    ctx.attachment(fileName)
    ctx.body = buffer
  } catch (error) {
    handleSysException(error)
  }
}

const analysisData = async ctx => {
  try {
    let { startTime, endTime, videoChannels } = ctx.query
    let videoChannelsSql = ''
    if (videoChannels) {
      videoChannels = videoChannels.split(',')
      videoChannels.forEach(item => {
        videoChannelsSql += `videoChannel = '${item}' OR `
      })
      videoChannelsSql = `AND ${videoChannelsSql.substring(0, videoChannelsSql.length - 4)}`
    }
    const timeCondition = `time >= ${startTime}ms AND time <= ${endTime}ms`
    const sqlPed = `SELECT count(captureTime) FROM "pedestrains" WHERE ${timeCondition} ${videoChannelsSql} GROUP BY time(1d) tz('Asia/Shanghai')`
    const sqlVeh = `SELECT count(captureTime) FROM "vehicles" WHERE ${timeCondition} ${videoChannelsSql} GROUP BY time(1d) tz('Asia/Shanghai')`
    const sqlNoVeh = `SELECT count(captureTime) FROM "nonVehicles" WHERE ${timeCondition} ${videoChannelsSql} GROUP BY time(1d) tz('Asia/Shanghai')`
    const sqlDefes = `SELECT count(captureTime) FROM "defenseAlarms" WHERE ${timeCondition} ${videoChannelsSql} GROUP BY time(1d) tz('Asia/Shanghai')`
    const [pedestrains, vehicles, nonVehicles, defenseAlarms] = await Promise.all([
      influxdb.query(sqlPed),
      influxdb.query(sqlVeh),
      influxdb.query(sqlNoVeh),
      influxdb.query(sqlDefes)
    ])
    pedestrains.sort((a, b) => b.count - a.count)
    vehicles.sort((a, b) => b.count - a.count)
    nonVehicles.sort((a, b) => b.count - a.count)
    return {
      pedTop10: pedestrains,
      vehTop10: vehicles,
      nonVehTop10: nonVehicles,
      defenseAlarms: defenseAlarms
    }
  } catch (error) {
    throw error
  }
}
