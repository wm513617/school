/*
 * @Description: 视频结构化服务器配置 controller
 * @Author: wanglei
 * @Date: 2019-06-26 15:15:11
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-09-09 14:22:51
 */
'use strict'

const { handleSysException, tranformPromiseAll, CONSTANT } = require('../../../common/tools')
const mongoose = require('mongoose')
const Resource = mongoose.model('Resource')
const StructureServer = mongoose.model('structureserver')
const StructureDefenseTask = mongoose.model('structuredefensetask')
const paging = require('../../paging')
const rp = require('request-promise')
const postal = require('postal')
const {
  activeServerConnection,
  sendData,
  startWeb,
  stopWeb,
  setIdentifyPushAddress,
  setDefenseAlarmPushAddress,
  getServerData
} = require('./structureServer.service')
const {
  setPushDefenseTaskToStruct,
  setDeleteDefenseTaskToStruct,
  getDefenseTaskListsFromStruct
} = require('../defenseTask/defenseTask.service')
const { ServerStatusCodeEnum } = require('../structure.enum')

/**
 * 获取服务器列表
 */
exports.getAllServers = async ctx => {
  try {
    const { page } = ctx.query
    const servers = await paging.listQuery(StructureServer, {}, { structServerId: 0 }, { createdAt: -1 }, page, '', ctx)
    ctx.status = 200
    ctx.body = servers
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 获取单个服务器的信息
 */
exports.getServer = async ctx => {
  try {
    const id = ctx.params.id
    const server = await StructureServer.findById(id, { structServerId: 0 })
      .lean()
      .exec()
    ctx.status = 200
    ctx.body = server
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 添加视频结构化服务器，在线支持添加，离线不支持添加
 * 并绑定资源，即新增通道
 */
exports.addServer = async ctx => {
  try {
    const entity = ctx.request.body
    const doc = await StructureServer.findOne({ ip: entity.ip })
      .lean()
      .exec()
    if (doc) {
      ctx.throw(500, { code: 0, message: '该IP服务器已经存在' })
    }
    if (Array.isArray(entity.res) && entity.res.length > entity.authNum) {
      ctx.throw(500, { code: 0, message: '绑定的资源已超过视频结构化授权路数' })
    }
    const params = {
      server: {
        ip: entity.ip,
        port: entity.port,
        rtspIp: entity.rtspIp,
        userAccount: entity.username,
        userPassword: entity.password
      },
      addResources: entity.res || []
    }
    await activeServerConnection(params)
    const server = await StructureServer.create(entity)
    await Resource.updateMany(
      { _id: { $in: params.addResources } },
      { 'videoStructure.structureServer': server._id }
    ).exec()
    // 设置该视频结构化服务器推送数据
    const status = 1
    await Promise.all([setIdentifyPushAddress(params, status), setDefenseAlarmPushAddress(params, status)])
    ctx.status = 201
    ctx.body = server._id + ''
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 更新服务器，同时更新绑定资源
 */
exports.updateServer = async ctx => {
  try {
    const entity = ctx.request.body
    const id = ctx.params.id
    const doc = await StructureServer.findOne({ ip: entity.ip, _id: { $ne: id } }).exec()
    if (doc) {
      ctx.throw(500, { code: 0, message: '该IP服务器已经存在' })
    }
    const server = await StructureServer.findById(id)
      .lean()
      .exec()
    if (Array.isArray(entity.res) && entity.res.length > server.authNum) {
      ctx.throw(500, { code: 0, message: '绑定的资源已超过视频结构化授权路数' })
    }
    const oldRes = server.res.map(item => item + '')
    const params = {
      server: {
        id: id,
        ip: entity.ip,
        port: entity.port,
        rtspIp: entity.rtspIp,
        userAcount: entity.username,
        userPassword: entity.password
      },
      addResources: [],
      removeResources: []
    }
    if (server.ip === entity.ip && server.port === entity.port) {
      let [addRes, delRes] = [[], []]
      addRes = entity.res.filter(item => !oldRes.includes(item))
      delRes = oldRes.filter(item => !entity.res.includes(item))
      // 资源变动需要更新视频结构化服务器中的通道信息，新增资源添加通道，删除资源删除通道
      if (addRes.length || delRes.length) {
        params.addResources = addRes
        params.removeResources = delRes
        await activeServerConnection(params)
      }
    } else {
      // 服务器ip：port发生变化，原有视频通道全部断开,向新服务器中添加视频通道
      params.addResources = entity.res
      params.removeResources = oldRes
      await activeServerConnection(params)
    }
    await StructureServer.findByIdAndUpdate(id, entity)
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 删除服务器，存在绑定的资源不能删除
 */
exports.deleteServer = async ctx => {
  try {
    const id = ctx.params.id
    await _deleteServer(id)
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}

// 批量删除服务器
exports.batchDeleteServers = async ctx => {
  try {
    const resArr = ctx.request.body || []
    if (resArr.length === 0) {
      ctx.throw(500, { code: 500, message: '请先选中需要删除的服务器' })
    }
    for (let item of resArr) {
      await _deleteServer(item)
    }
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}

// 删除结构化服务器
const _deleteServer = async serverId => {
  const status = 0 // 不推送
  const structServer = await StructureServer.findById(serverId)
    .lean()
    .exec()
  const serverData = {
    server: {
      ip: structServer.ip,
      port: structServer.port
    }
  }
  if (_.get(structServer, 'res', []).length) {
    throw Error('该服务器下存在绑定的资源，不能删除')
  } else {
    // 取消该视频结构化服务器推送数据
    await Promise.all(tranformPromiseAll([setIdentifyPushAddress(serverData, status), setDefenseAlarmPushAddress(serverData, status)]))
    // 同步删除改结构化服务器中的布控任务
    postal.publish({
      channel: 'videoStructure',
      topic: 'defenseTask.delete',
      data: { serverData: serverData, serverId: serverId }
    })
    await StructureDefenseTask.updateMany(
      { structServer: { $elemMatch: { serverId: serverId } } },
      { $pull: { structServer: { serverId: serverId } } }
    )
      .lean()
      .exec()
    await StructureServer.findByIdAndRemove(serverId).exec()
    return ''
  }
}

// 批量启动分析服务
exports.batchStartWeb = async ctx => {
  try {
    const serverArr = ctx.request.body || []
    if (serverArr.length === 0) {
      ctx.throw(500, { code: 500, message: '请先选中需要启动的服务器' })
    }
    const serverList = await StructureServer.find({ _id: { $in: serverArr } }, 'ip port name')
      .lean()
      .exec()
    const startWebPromisList = serverList.map(item => {
      const serverData = {
        server: {
          ip: item.ip,
          port: item.port
        },
        serverId: item._id + '',
        serverName: item.name
      }
      return startWeb(serverData)
    })
    const results = await Promise.all(tranformPromiseAll(startWebPromisList))
    const response = { success: [], fail: [] }
    for (let [index, server] of serverList.entries()) {
      if (results[index].status === CONSTANT.RESOLVE) {
        if (Number(results[index].data.errorCode) === 0) {
          await StructureServer.findByIdAndUpdate(results[index].data.serverId, { serverStatus: ServerStatusCodeEnum.START })
          response.success.push({ serverName: server.name, message: '启动服务成功' })
        } else {
          response.fail.push({ serverName: server.name, message: `启动服务失败: ${results[index].data.message}` })
        }
      } else {
        response.fail.push({ serverName: server.name, message: `启动服务失败: ${results[index].message}` })
      }
    }
    ctx.status = 200
    ctx.body = response
  } catch (error) {
    handleSysException(error)
  }
}

// 批量停止分析服务
exports.batchStopWeb = async ctx => {
  try {
    const serverArr = ctx.request.body || []
    if (serverArr.length && serverArr.length === 0) {
      ctx.throw(500, { code: 500, message: '请先选中需要停止的服务器' })
    }
    const serverList = await StructureServer.find({ _id: { $in: serverArr } }, 'ip port name')
      .lean()
      .exec()
    const stopWebPromiseList = serverList.map(item => {
      const serverData = {
        server: {
          ip: item.ip,
          port: item.port
        },
        serverId: item._id + '',
        serverName: item.name
      }
      return stopWeb(serverData)
    })
    const results = await Promise.all(tranformPromiseAll(stopWebPromiseList))
    const response = { success: [], fail: [] }
    for (let [index, server] of serverList.entries()) {
      if (results[index].status === CONSTANT.RESOLVE) {
        if (Number(results[index].data.errorCode) === 0) {
          await StructureServer.findByIdAndUpdate(results[index].data.serverId, { serverStatus: ServerStatusCodeEnum.STOP })
          response.success.push({ serverName: server.name, message: '停止服务成功' })
        } else {
          response.fail.push({ serverName: server.name, message: `停止服务失败: ${results[index].data.message}` })
        }
      } else {
        response.fail.push({ serverName: server.name, message: `停止服务失败: ${results[index].message}` })
      }
    }
    ctx.body = response
  } catch (error) {
    handleSysException(error)
  }
}

// 导出授权文件
exports.export = async ctx => {
  try {
    const id = ctx.params.id
    const serverData = await getServerData(id)
    const postDatas = {
      type: 'getHdInfo'
    }
    const result = await sendData(serverData, postDatas, 'GET', '/business/licence.php')
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

// 导入授权文件
exports.import = async ctx => {
  try {
    const file = ctx.request.body.files.file
    const id = ctx.params.id
    const serverData = await getServerData(id)
    const postDatas = {
      type: 'uploadLicence',
      licence: file
    }
    const result = await sendData(serverData, postDatas, 'GET', '/business/licence.php')
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

// 向结构化服务器同步布控任务
exports.syncTask = async ctx => {
  try {
    const id = ctx.params.id
    const serverData = await getServerData(id)
    const neTasks = await StructureDefenseTask.find({ 'structServer.serverId': { $ne: id } })
      .lean()
      .exec()
    const eqTasks = await StructureDefenseTask.find({ 'structServer.serverId': id })
      .lean()
      .exec()
    if (neTasks.length !== 0) {
      await _syncDiffStructTasks(serverData, neTasks, id)
    }
    if (eqTasks.length !== 0) {
      await _syncSameStructTasks(serverData, eqTasks, id)
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 向新添加的结构化服务器同步平台现有的布控任务
// 也就是在新的结构化服务器添加布控任务
const _syncDiffStructTasks = async (serverData, tasks, id) => {
  for (let item of tasks) {
    await setDeleteDefenseTaskToStruct(serverData, item.taskId, 'delete')
    const result = await setPushDefenseTaskToStruct(serverData, item, 'add')
    if (Number(result.errorCode) !== 0) {
      await StructureDefenseTask.findByIdAndUpdate(item._id, {
        $push: { structServer: { serverId: id, taskId: result.data, status: 1 } }
      })
        .lean()
        .exec()
    } else {
      await StructureDefenseTask.findByIdAndUpdate(item._id, {
        $push: { structServer: { serverId: id, taskId: result.data, status: 0 } }
      })
        .lean()
        .exec()
    }
  }
}

// 同步在已添加结构化服务器中删除布控任务而没有再平台删除
// 同步平台有而结构化服务器没有的布控任务
const _syncSameStructTasks = async (serverData, tasks, id) => {
  const result = await getDefenseTaskListsFromStruct(serverData)
  if (Number(result.errorCode) !== 0) {
    return '请求结构化服务器失败'
  }
  const data = _.get(result, 'data', [])
  const taskIdArr = data.map(item => item.taskId)
  for (let item of tasks) {
    let structServer = item.structServer
    structServer = structServer.filter(o => o.serverId + '' === id && !taskIdArr.includes(o.taskId))
    if (structServer.length === 0) {
      continue
    } else {
      const res = await setPushDefenseTaskToStruct(serverData, item, 'add')
      if (Number(res.errorCode) !== 0) {
        await StructureDefenseTask.findOneAndUpdate(
          { _id: item._id, 'structServer.serverId': id },
          {
            'structServer.$.taskId': res.data,
            'structServer.$.status': 1
          }
        )
          .lean()
          .exec()
      } else {
        await StructureDefenseTask.findOneAndUpdate(
          { _id: item._id, 'structServer.serverId': id },
          {
            'structServer.$.taskId': res.data,
            'structServer.$.status': 0
          }
        )
          .lean()
          .exec()
      }
    }
  }
}

exports.getMonitorData = async ctx => {
  try {
    const servers = await StructureServer.find({}, 'name ip port')
      .lean()
      .exec()
    if (Array.isArray(servers) && servers.length === 0) {
      ctx.body = []
    }
    const serversData = servers.map(item => {
      return {
        name: item.name,
        server: {
          ip: item.ip,
          port: item.port
        }
      }
    })
    const monitorData = []
    for (let item of serversData) {
      const options = {
        method: 'GET',
        uri: `http://${item.server.ip}:${item.server.port}/business/channelconfig.php`,
        body: { type: 'getResStatus' },
        json: true
      }
      const result = await rp(options)
      if (Number(result.errorCode) !== 0) {
        continue
      }
      monitorData.push({ name: item.name, data: result })
    }
    ctx.body = monitorData
  } catch (error) {
    handleSysException(error)
  }
}
