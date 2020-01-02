/*
 * @Author: chenkaibo
 * @Date: 2018-12-07 11:23:48
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-08 19:16:31
 */
'use strict'
const mongoose = require('mongoose')
const FaceServer = mongoose.model('FaceServer')
const Resource = mongoose.model('Resource')
const DefenseTask = mongoose.model('DefenseTask')
const VeriGroup = mongoose.model('VeriGroup')
const VeriUser = mongoose.model('VeriUser')
const paging = require('../../paging')
const rp = require('request-promise').defaults({ json: true })
const singleton = require('../controller/taskController').getSingleton()
// const singleton = require('../sdkV3Server.socket').getSDKSingleton()
const { handleSysException, tranformPromiseAll } = require('../../../common/tools')
const sdkInterface = require('../sdk.interface')
const CONSTANT = {
  RESOLVE: 'resolve',
  REJECT: 'reject'
}
/**
 * 查询服务器列表
 * @param {*} ctx
 */
exports.index = async ctx => {
  try {
    const result = await paging.listQuery(FaceServer, {}, '', { createdAt: -1 }, ctx.query.page, '', ctx)
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}

/**
 * 新增人脸服务器
 */
exports.add = async ctx => {
  try {
    const entity = ctx.request.body
    const doc = await FaceServer.findOne({ ip: entity.ip }).lean()
    if (doc) {
      ctx.throw(500, { code: 0, message: '该IP服务器已经存在' })
    }
    await validResources(entity)
    const params = {
      newResources: entity.res,
      type: 'server',
      server: {
        ip: entity.ip,
        port: entity.port,
        rtspIp: entity.rtspIp
      }
    }
    await activeServerConnectioin(params)
    const server = await FaceServer.create(entity)
    ctx.status = 201
    ctx.headers['location'] = ctx.url + server._id
    ctx.body = server._id.toString()
  } catch (err) {
    handleSysException(err)
  }
}

/**
 * 修改
 */
exports.put = async ctx => {
  const entity = ctx.request.body
  const id = ctx.params.id
  const doc = await FaceServer.findOne({ ip: entity.ip, _id: { $ne: id } }).exec()
  if (doc) {
    ctx.throw(500, { code: 0, message: '该IP服务器已经存在' })
  }
  await validResources(entity, { _id: { $ne: id } })
  const faceServer = await FaceServer.findById(id).lean()
  try {
    const oldRes = faceServer.res.map(item => item.toString())
    const params = { type: 'server', server: { ip: entity.ip, port: entity.port, rtspIp: entity.rtspIp } }
    await FaceServer.findByIdAndUpdate(id, ctx.request.body)
    if (faceServer.ip === entity.ip && faceServer.port === entity.port) {
      let [addRes, delRes] = [[], []]
      addRes = entity.res.filter(item => !oldRes.includes(item))
      delRes = oldRes.filter(item => !entity.res.includes(item))
      // 资源变动发送通知
      if (addRes.length || delRes.length) {
        params.newResources = addRes
        params.removeResources = delRes
        await pingServer(params)
        await noticeChangeWS(params)
      }
    } else {
      // 服务器ip：port发生变化，原有视频通道全部断开
      params.newResources = entity.res
      params.removeResources = oldRes
      await activeServerConnectioin(params)
    }
    ctx.body = ''
  } catch (err) {
    await FaceServer.findByIdAndUpdate(id, faceServer)
    handleSysException(err)
  }
}

/**
 * 单个删除
 */
exports.del = async ctx => {
  try {
    const id = ctx.params.id
    const doc = await FaceServer.findByIdAndRemove(id)
    const resource = doc.res.map(item => item.toString())
    const params = {
      removeResources: resource,
      type: 'server',
      server: {
        ip: doc.ip,
        port: doc.port
      }
    }
    await noticeChangeWS(params)
    await cleanDefenseRes(resource)
    ctx.body = {
      code: 1,
      data: 'ok'
    }
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 人脸服务器与人像抓拍底库、人员同步
 */
exports.sync = async ctx => {
  try {
    const id = ctx.params.id || ''
    const message = []
    if (!id) {
      ctx.throw(500, { message: '参数未指定' })
    }
    const [server, groups, users] = await Promise.all([
      FaceServer.findById(id).lean(),
      VeriGroup.find({}).lean(),
      VeriUser.find({}).lean()
    ])
    const host = { server: { ip: server.ip, port: server.port } }
    await pingServer(host)
    const removeGroup = groups.filter(item => item.name !== '路人库')
    // 删除底库
    let groupPromiseList = []
    for (const group of removeGroup) {
      groupPromiseList.push(sdkInterface.delServerGroup(group._id.toString(), host.server, 20000))
    }
    groupPromiseList = tranformPromiseAll(groupPromiseList)
    const deleteGroup = await Promise.all(groupPromiseList)
    // 底库同步失败状态的原因
    removeGroup.forEach((record, index) => {
      if (deleteGroup[index].status === CONSTANT.REJECT) {
        message.push(getSyncExceptMesage(record.name, deleteGroup[index].message))
      }
    })
    // 底库同步
    groupPromiseList = []
    for (const group of groups) {
      groupPromiseList.push(sdkInterface.addServerGroup(group._id.toString(), host.server))
    }
    groupPromiseList = tranformPromiseAll(groupPromiseList)
    const synGroup = await Promise.all(groupPromiseList)
    // 底库同步失败状态的原因
    groups.forEach((group, index) => {
      if (synGroup[index].status === CONSTANT.REJECT) {
        message.push(getSyncExceptMesage(group.name, synGroup[index].message))
      }
    })
    // 底库人员同步
    let promiseList = []
    for (const user of users) {
      promiseList.push(sdkInterface.uploadServerImage(user.image, user.group.toString(), host.server))
    }
    promiseList = tranformPromiseAll(promiseList)
    const syncUser = await Promise.all(promiseList)
    // 底库人员同步成功失败状态检查
    syncUser.forEach((item, index) => {
      const user = users[index]
      if (item.status === CONSTANT.RESOLVE) {
        const target = user.sdkImgInfos.find(
          item => item.host.ip === host.server.ip && item.host.port === Number(host.server.port)
        )
        if (target) {
          target.id = item.data.id
        } else {
          user.sdkImgInfos.push({ id: item.data.id, host: { ip: server.ip, port: server.port } })
        }
      } else {
        message.push(getSyncExceptMesage(user.name, item.message))
      }
    })
    // 更新底库人员与对应服务的id
    const docUpdate = []
    for (const user of users) {
      docUpdate.push(VeriUser.findByIdAndUpdate(user._id.toString(), user))
    }
    await Promise.all(docUpdate)
    ctx.status = 200
    ctx.body = message
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 批量删除
 * @param {*} ctx
 */
exports.delBatch = async ctx => {
  try {
    const ids = ctx.request.header['x-bsc-ids'].split(',') || []
    const servers = await FaceServer.find({ _id: { $in: ids } }).lean()
    let resource = []
    servers.forEach(srv => {
      resource = resource.concat(srv.res.map(item => item.toString()))
    })
    await noticeChangeWS({ removeResources: resource, type: 'server' })
    await cleanDefenseRes(resource)
    await FaceServer.deleteMany({ _id: { $in: ids } })
    ctx.body = ''
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 删除服务器的时候，同步删除布控任务中属于该服务器的资源通道
 * @param {array} resource 待清理的资源集合
 */
const cleanDefenseRes = async resource => {
  try {
    const allTask = await DefenseTask.find({}).lean()
    const promiseList = []
    for (const task of allTask) {
      let ids = task.points.map(item => item.toString())
      let tmp = _.clone(ids)
      for (const res of resource) {
        const index = ids.indexOf(res)
        if (index >= 0) {
          ids.splice(index, 1)
        }
      }
      if (tmp.length !== ids.length) {
        task.points = ids
        promiseList.push(DefenseTask.findByIdAndUpdate(task._id.toString(), task).exec())
      }
    }
    await Promise.all(promiseList)
  } catch (error) {
    throw error
  }
}

/**
 * 校验资源服务器资源是否唯一使用
 * @param {object} entity 服务器配置
 */
const validResources = async (entity, query = {}) => {
  const sdkServers = await FaceServer.find(query).lean()
  let resIds = []
  sdkServers.forEach(item => {
    resIds = resIds.concat(item.res.map(item => item.toString()))
  })
  const repeatRes = []
  if (!_.isEmpty(entity.res) && !_.isEmpty(resIds)) {
    entity.res.forEach(item => {
      if (resIds.includes(item)) {
        repeatRes.push(item)
      }
    })
  }
  if (!_.isEmpty(repeatRes)) {
    const resources = await Resource.find({ _id: { $in: repeatRes } }).lean()
    const resNames = resources.map(item => item.name)
    throw new Error('重复使用:' + resNames)
  }
}

/**
 * 激活目标服务器的连接。测试目标服务器是否可以用=>同步底库=>建立socket链接
 * @param {object} data
 */
const activeServerConnectioin = async data => {
  try {
    await pingServer(data)
  } catch (error) {
    throw new Error('找不到指定Ip/Port的服务器')
  }
  try {
    await syncBaseRepository(data)
  } catch (error) {
    throw new Error('同步路人路到服务器失败')
  }
  try {
    await noticeChangeWS(data)
  } catch (error) {
    throw new Error('服务器链接失败')
  }
}
/**
 * 测试目标服务器是否可用
 * @param {object} data
 */
const pingServer = async data => {
  try {
    await rp(`http://${data.server.ip}:${data.server.port}/version`)
  } catch (error) {
    throw new Error('找不到指定Ip/Port的服务器')
  }
}
/**
 * 新连接的服务器同步底库
 * @param {object} data
 */
const syncBaseRepository = async data => {
  try {
    await sdkInterface.initVeriFace({ ip: data.server.ip, port: data.server.port })
  } catch (error) {
    throw new Error('同步路人路到服务器失败')
  }
}
/**
 * 服务变动后，更新链接
 * @param {object} data
 */
const noticeChangeWS = async data => {
  try {
    await singleton.dynamicHandleSocket(data)
  } catch (error) {
    throw new Error('服务器链接失败')
  }
}
/**
 * 同步失败信息
 * @param {string} name 失败类型名称
 * @param {string} message 失败的原因
 * @returns {string} 失败信息
 */
const getSyncExceptMesage = (name = '', message = '') => {
  return `${name}同步失败，失败原因：${message}`
}
