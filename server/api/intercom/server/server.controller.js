/*
 * @Author: hansen.liuhao
 * @Date: 2019-07-26 11:27:16
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-08-15 10:34:50
 * @description: 对讲服务配置控制器
 */

const mongoose = require('mongoose')
const IntercomServerConf = mongoose.model('IntercomServerConf')
const Device = mongoose.model('Device')
const IntercomTerminal = mongoose.model('IntercomTerminal')
const { handleSysException, validateBody } = require('../../../common/tools')
const httpRequst = require('../../bstar/dev.interface')
const paging = require('../../paging')

/**
 *  获取对讲服务器配置
 */
exports.getServerConf = async ctx => {
  try {
    const doc = await IntercomServerConf.findOne({}, '-__v -createdAt -updatedAt').lean()
    ctx.body = doc || {}
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 创建/修改服务器配置
 */
exports.upsertServerConf = async ctx => {
  try {
    const body = ctx.request.body
    const device = JSON.parse(JSON.stringify(body))
    validateBody(body, IntercomServerConf)
    if (body.device) {
      delete device._id
      await Device.findByIdAndUpdate(body.device, device)
    } else {
      // 创建对讲服务器的影子设备 [北京需要设备做自动登录或其他用途]
      device.bigtype = 11
      device.type = 'talkServer'
      device.manufacturer = 'shibang'
      device.__v = 2
      const result = await Device.create(device)
      body.device = result._id
    }
    await IntercomServerConf.update({}, body, { upsert: true })
    try {
      if (device.device) {
        await httpRequst.devLogout({ device, ctx })
      }
      await httpRequst.deviceLogin({ device, ctx })
    } catch (error) {
      console.log('intercom login: ', error)
    }
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 获取台麦配置列表
 */
exports.getMicrophoneList = async ctx => {
  try {
    const query = { type: 'microphone' }
    const paganation = ctx.query.page
    if (ctx.query.search.name) {
      query.name = { $regex: ctx.query.name.replace(/\./g, '\\.') }
    }
    const result = await paging.listQuery(
      IntercomTerminal,
      query,
      '-createdAt -updatedAt -__v',
      { _id: -1 },
      paganation,
      {
        path: 'camera.resource',
        select: 'name'
      },
      ctx
    )

    ctx.body = result.results.map(doc => {
      doc = doc.toObject()
      return assertDoc(doc)
    })
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 创建台麦配置
 */
exports.createMicrophone = async ctx => {
  try {
    const body = ctx.request.body
    body.type = 'microphone'
    adjustParams(body)
    validateBody(body, IntercomTerminal)
    const isOccupy = await IntercomTerminal.countDocuments({
      $or: [{ serise: body.serise }, { name: body.name }, { ip: body.ip }]
    })
    if (isOccupy) {
      ctx.throw(500, { message: '台麦名称|对讲ID号|ip地址不能重复' })
    }
    const doc = await IntercomTerminal.create(body)
    ctx.headers['location'] = `${ctx.url}/${doc._id}`
    ctx.body = doc._id
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 更新台麦配置
 */
exports.updateMicrophone = async ctx => {
  try {
    const body = ctx.request.body
    const id = ctx.params.id
    adjustParams(body)
    validateBody(body, IntercomTerminal)
    const isOccupy = await IntercomTerminal.countDocuments({
      _id: { $ne: id },
      $and: [{ $or: [{ serise: body.serise }, { name: body.name }, { ip: body.ip }] }]
    })
    if (isOccupy) {
      ctx.throw(500, { message: '台麦名称|对讲ID号|ip地址不能重复' })
    }
    await IntercomTerminal.findByIdAndUpdate(id, body)
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 批量删除多个台麦配置
 */
exports.removeMicrophone = async ctx => {
  try {
    const body = ctx.request.body
    await IntercomTerminal.deleteMany({ _id: { $in: body.ids } })
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取终端配置列表
 */
exports.getTerminalList = async ctx => {
  try {
    const query = { type: 'terminal' }
    const paganation = ctx.query.page
    if (ctx.query.search.name) {
      query.name = { $regex: ctx.query.name.replace(/\./g, '\\.') }
    }
    const result = await paging.listQuery(
      IntercomTerminal,
      query,
      '-createdAt -updatedAt -__v',
      { _id: -1 },
      paganation,
      {
        path: 'camera.resource',
        select: 'name'
      },
      ctx
    )
    ctx.body = result.results.map(doc => {
      doc = doc.toObject()
      return assertDoc(doc)
    })
  } catch (error) {
    handleSysException(error)
  }
}

const assertDoc = doc => {
  const list = new Array(doc.length).fill('')
  const description = []
  doc.camera.forEach(item => {
    if (item.resource) {
      list[item.index] = item.resource._id
      description.push(item.resource.name)
    }
  })
  delete doc.length
  doc.cameraDesciption = description.join(',')
  doc.camera = list
  return doc
}

/**
 * 创建终端配置
 */
exports.createTerminal = async ctx => {
  try {
    const body = ctx.request.body
    body.type = 'terminal'
    adjustParams(body)
    validateBody(body, IntercomTerminal)
    const isOccupy = await IntercomTerminal.countDocuments({
      $or: [{ serise: body.serise }, { name: body.name }, { ip: body.ip }]
    })
    if (isOccupy) {
      ctx.throw(500, { message: '终端名称|对讲ID号|ip地址不能重复' })
    }
    const doc = await IntercomTerminal.create(body)
    ctx.headers['location'] = `${ctx.url}/${doc._id}`
    ctx.body = doc._id
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 更新终端配置
 */
exports.updateTerminal = async ctx => {
  try {
    const body = ctx.request.body
    const id = ctx.params.id
    adjustParams(body)
    validateBody(body, IntercomTerminal)
    const isOccupy = await IntercomTerminal.countDocuments({
      _id: { $ne: id },
      $and: [{ $or: [{ serise: body.serise }, { name: body.name }, { ip: body.ip }] }]
    })
    if (isOccupy) {
      ctx.throw(500, { message: '终端名称|对讲ID号|ip地址不能重复' })
    }
    await IntercomTerminal.findByIdAndUpdate(id, body)
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}

const adjustParams = doc => {
  const list = []
  doc.camera.forEach((res, index) => {
    if (res) {
      list.push({ index, resource: res })
    }
  })
  doc.length = doc.camera.length
  doc.camera = list
  return doc
}

/**
 * 批量删除多个终端配置
 */
exports.removeTerminal = async ctx => {
  try {
    const body = ctx.request.body
    await IntercomTerminal.deleteMany({ _id: { $in: body.ids } })
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}
