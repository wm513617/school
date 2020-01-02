/*
 * @Author: hansen.liuhao
 * @Date: 2019-07-26 11:28:45
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-09-05 14:51:21
 * @description: 对讲应用控制器
 *
 */
const mongoose = require('mongoose')
const IntercomServerConf = mongoose.model('IntercomServerConf')
const IntercomTerminal = mongoose.model('IntercomTerminal')
const { handleSysException } = require('../../../common/tools')
const protocol = require('../../bstar/intercom.interface')
// const moment = require('moment')
const pag = require('../../paging')
const getDb = require('../../../common/logdb')
const IntercomRecordSchema = new mongoose.Schema({
  askName: String,
  askIp: String,
  askId: Number,
  askCamera: {
    lsRecord: Boolean,
    devIp: String,
    devPort: Number,
    streamType: String,
    channel: Number
  },
  ackName: String,
  ackIp: String,
  ackId: Number,
  ackCamera: {
    lsRecord: Boolean,
    devIp: String,
    devPort: Number,
    streamType: String,
    channel: Number
  }
})

/**
 * 呼叫请求
 */
exports.callRequest = async ctx => {
  try {
    const body = ctx.request.body
    const [senderTerminal, receiverTerminal] = await Promise.all([
      IntercomTerminal.findOne({ serise: body.initiator })
        .populate({ path: 'camera.resource', select: ' ip port chan stream' })
        .lean(),
      IntercomTerminal.findOne({ serise: body.receiver })
        .populate({ path: 'camera.resource', select: ' ip port chan stream' })
        .lean()
    ])
    let params
    if (senderTerminal.type === 'microphone') {
      params = await shibangServerParams(senderTerminal, receiverTerminal)
    } else {
      params = await shibangServerParams(receiverTerminal, senderTerminal)
    }
    await protocol.shibangopentalk(ctx, params)
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 回应终端呼叫
 */
exports.answer = async ctx => {
  const body = ctx.request.body
  const [senderTerminal, receiverTerminal] = await Promise.all([
    IntercomTerminal.findOne({ serise: body.initiator })
      .populate({ path: 'camera.resource', select: ' ip port chan stream' })
      .lean(),
    IntercomTerminal.findOne({ serise: body.receiver })
      .populate({ path: 'camera.resource', select: ' ip port chan stream' })
      .lean()
  ])
  let params
  if (senderTerminal.type === 'microphone') {
    params = await shibangServerParams(senderTerminal, receiverTerminal)
  } else {
    params = await shibangServerParams(receiverTerminal, senderTerminal)
  }
  await protocol.shibanganswertalk(ctx, params)
  ctx.body = ''
}

/**
 * 呼叫挂断
 */
exports.hangUp = async ctx => {
  try {
    const body = ctx.request.body
    const [senderTerminal, receiverTerminal] = await Promise.all([
      IntercomTerminal.findOne({ serise: body.initiator })
        .populate({ path: 'camera.resource', select: ' ip port chan stream' })
        .lean(),
      IntercomTerminal.findOne({ serise: body.receiver })
        .populate({ path: 'camera.resource', select: ' ip port chan stream' })
        .lean()
    ])
    let params
    if (senderTerminal.type === 'microphone') {
      params = await shibangServerParams(senderTerminal, receiverTerminal)
    } else {
      params = await shibangServerParams(receiverTerminal, senderTerminal)
    }
    await protocol.shibangclosetalk(ctx, params)
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取通话历史记录
 */
exports.history = async ctx => {
  try {
    const search = ctx.query.search
    const pagination = ctx.query.page
    const query = {}
    if (search.time) {
      query.stime = { $gte: Number(search.time) }
    }
    if (search.name) {
      query.$or = [
        { sender: { $regex: search.name.replace(/\./g, '\\.') } },
        { receiver: { $regex: search.name.replace(/\./g, '\\.') } }
      ]
    }
    const db = await getDb()
    const IntercomRecord = db.model('noticeLog', IntercomRecordSchema, 'noticeLog')
    const result = await pag.listQuery(
      IntercomRecord,
      query,
      '-createdAt -updatedAt -__v',
      { _id: -1 },
      pagination,
      '',
      ctx
    )
    ctx.body = result.results
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 删除历史记录
 */
exports.removeHistory = async ctx => {
  try {
    const ids = ctx.request.body.ids
    const db = await getDb()
    const IntercomRecord = db.model('noticeLog', IntercomRecordSchema, 'noticeLog')
    await IntercomRecord.deleteMany({ _id: { $in: ids } })
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 世邦对镜接口参数组装
 * @param {*} microPhone 台麦
 * @param {*} terminal 终端
 */
const shibangServerParams = async (microPhone, terminal) => {
  const server = await IntercomServerConf.findOne({}).lean()
  const microPhoneResouce = microPhone.camera.find(res => res.index === 0)
  const terminalResouce = terminal.camera.find(res => res.index === 0)
  const linkResource =
    microPhoneResouce && microPhoneResouce.resource
      ? [
        {
          devIp: microPhoneResouce.resource.ip,
          devPort: microPhoneResouce.resource.port,
          devChannel: microPhoneResouce.resource.chan,
          streamType: microPhoneResouce.resource.stream
        }
      ]
      : []
  const linkTerminalResource =
    terminalResouce && terminalResouce.resource
      ? [
        {
          devIp: terminalResouce.resource.ip,
          devPort: terminalResouce.resource.port,
          devChannel: terminalResouce.resource.chan,
          streamType: terminalResouce.resource.stream
        }
      ]
      : []
  return {
    serverInfo: {
      devIp: server.ip,
      devPort: server.port
    },
    makId: microPhone.serise,
    makCamInfo: linkResource,
    terInfo: [
      {
        terId: terminal.serise,
        terCamList: linkTerminalResource
      }
    ]
  }
}
