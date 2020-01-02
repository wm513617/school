/*
 * @Description: 视频结构化布控任务管理
 * @Author: wanglei
 * @Date: 2019-07-02 13:36:26
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-28 15:10:16
 */
'use strict'

const mongoose = require('mongoose')
const StructureServer = mongoose.model('structureserver')
const StructureDefenseTask = mongoose.model('structuredefensetask')
const paging = require('../../paging')
const socket = require('../structure.socket')
const moment = require('moment')
const { influxdb } = require('../identify/influxdb/influxdb')
const { setPushDefenseTaskToStruct, setDeleteDefenseTaskToStruct, getStructDefenseAlarmData } = require('./defenseTask.service')
const { getServerData } = require('../server/structureServer.service')
const { handleSysException } = require('../../../common/tools')

// 获取所有布控任务
exports.getAllTasks = async ctx => {
  try {
    const { page } = ctx.query
    const [tasks, total] = await Promise.all([
      paging.listQuery(StructureDefenseTask, {}, '', { createdAt: -1 }, page, '', ctx),
      StructureDefenseTask.countDocuments()
    ])
    ctx.status = 200
    ctx.body = {
      results: tasks.results,
      total
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 获取单个布控任务
exports.getTask = async ctx => {
  try {
    const id = ctx.params.id
    const tasks = await StructureDefenseTask.findById(id)
      .lean()
      .exec()
    ctx.status = 200
    ctx.body = tasks
  } catch (error) {
    handleSysException(error)
  }
}

exports.addTask = async ctx => {
  try {
    const task = ctx.request.body
    const servers = await StructureServer.find()
      .lean()
      .exec()
    let structServers = []
    for (let item of servers) {
      const serverData = {
        server: {
          ip: item.ip,
          port: item.port,
          UserAccount: item.username,
          UserPassword: item.password
        }
      }
      const result = await setPushDefenseTaskToStruct(serverData, task, 'add')
      if (Number(result.errorCode) !== 0) {
        console.log(`向视频结构化服务器 - ${item._id + ''} - ip: ${item.ip} - port: ${item.port} - 布控失败`)
        structServers.push({ serverId: item._id, taskId: result.data, status: 1 })
      } else {
        structServers.push({ serverId: item._id, taskId: result.data, status: 0 })
      }
    }
    task.structServer = structServers
    await StructureDefenseTask.create(task)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 修改布控任务，同时修改视频结构化服务器中的布控任务
// 因为结构化服务器中只能修改未审批的布控任务，咱们系统在添加时默认审批通过
// 所以在修改布控任务时是先删除布控任务，在新建布控任务
// 在咱们自己的数据库只修改
exports.updateTask = async ctx => {
  try {
    const id = ctx.params.id
    const task = ctx.request.body
    const { structServer } = await StructureDefenseTask.findById(id)
      .populate('structServer.serverId', 'ip port username password')
      .lean()
      .exec()
    let structServers = []
    for (let item of structServer) {
      const serverData = await getServerData(item.serverId)
      await setDeleteDefenseTaskToStruct(serverData, item.taskId, 'delete')
      const result = await setPushDefenseTaskToStruct(serverData, task, 'add')
      if (Number(result.errorCode) !== 0) {
        console.log(
          `向视频结构化服务器 - ip: ${serverData.server.ip} - port: ${serverData.server.port} - 修改布控任务失败`
        )
        structServers.push({ serverId: item.serverId, taskId: result.data, status: 1 })
      } else {
        structServers.push({ serverId: item.serverId, taskId: result.data, status: 0 })
      }
    }
    task.structServer = structServers
    await StructureDefenseTask.findByIdAndUpdate(id, task)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 删除布控任务，同时删除视频结构化服务器中的布控任务
exports.deleteTask = async ctx => {
  try {
    const id = ctx.params.id
    const { structServer } = await StructureDefenseTask.findById(id, 'structServer')
      .populate('structServer.serverId', '_id ip port username password')
      .lean()
      .exec()
    for (let item of structServer) {
      const serverData = await getServerData(item.serverId)
      await setDeleteDefenseTaskToStruct(serverData, item.taskId, 'delete')
    }
    await StructureDefenseTask.findByIdAndRemove(id)
      .lean()
      .exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 接收布控报警推送过来的报警数据
exports.receiveAlarmData = async ctx => {
  try {
    const result = await getStructDefenseAlarmData(ctx)
    for (let item of result) {
      socket.pushDefenseAlarmData(item)
    }
    ctx.body = {
      errorCode: '0',
      message: 'success'
    }
  } catch (error) {
    ctx.body = {
      errorCode: '1',
      message: error.message
    }
  }
}

// 获取当日所有布控报警记录数量
exports.getTodayAlarmCount = async ctx => {
  try {
    const todayStartTime = moment()
      .startOf('day')
      .format()
    const sql = `SELECT COUNT(captureTime) FROM "defenseAlarms" WHERE time > '${todayStartTime}'`
    const alarmCount = await influxdb.query(sql)
    ctx.body = (alarmCount.length && alarmCount[0].count) || 0
  } catch (error) {
    handleSysException(error)
  }
}

// 默认获取最近的 64 条布控报警记录
exports.getInitAlarmData = async ctx => {
  try {
    const todayStart = moment()
      .startOf('day')
      .format()
    const todayEnd = moment()
      .endOf('day')
      .format()
    const alarmData = await influxdb.query(
      `SELECT * FROM "defenseAlarms" WHERE time > '${todayStart}' AND time < '${todayEnd}' ORDER BY time DESC LIMIT 64`
    )
    ctx.body = alarmData
  } catch (error) {
    handleSysException(error)
  }
}
