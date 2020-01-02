/**
 * 门禁管理路由
 * @since:2018-2-22
 * @author:hansen
 */

'use strict'

const mongoose = require('mongoose')
const Device = mongoose.model('Device')
const Resource = mongoose.model('Resource')
const paging = require('../paging')
const _ = require('lodash')
const handleSysException = require('../../common/tools').handleSysException
const getDb = require('../../common/logdb')
const AccessLogSchema = new mongoose.Schema({
  idNum: String,
  direction: String,
  devNum: String,
  peopleType: String,
  openStatus: String,
  time: String
})

const util = require('../../common/protobuf.util')
const command = require('../../common/command')
const moment = require('moment')
// 获取指定id门禁系统的门禁列表
module.exports.list = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-获取门禁设备列表'))
  try {
    const paganation = ctx.query.page || ''
    const result = await paging.listQuery(
      Resource,
      { eid: ctx.params.id },
      'chan name type ip res',
      { chan: 1 },
      paganation,
      '',
      ctx
    )
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = result.results.map(item => {
        item = item.toObject()
        item.status = item.res && item.res.length > 0 ? 1 : 0
        delete item.res
        return item
      })
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取指定id门禁系统的门禁列表
module.exports.sync = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-同步门禁设备列表'))
  try {
    const id = ctx.params.id
    const server = await Device.findById(id)
    const paganation = ctx.query.page || ''
    if (_.isEmpty(server)) {
      ctx.throw(500, { code: 200, message: '找不到服务器配置资源' })
    }
    const payload = { cmdBase: { devIp: server.ip, devPort: server.cport } }
    // 获取GetDoorDevInfoMA2DA proto
    const basePro = util.baseProto('GetDoorDevInfoMA2DA')
    const structPro = util.getProtoMsg(basePro, 'CommandGeneric')
    const bufReq = util.encode(structPro, payload)
    const result = await util.tcp(bufReq, command.VMR_COMMAND_MA2DA_DOOR_GET_DEV_LIST)
    // 请求成功，解析获取解码的buffer数据
    if (result.code === 0) {
      const resPro = util.getProtoMsg(basePro, 'GetDoorDevInfoResp')
      result.message = util.decode(resPro, result.message)
      const res = await Resource.find({ eid: id }, 'chan').lean()
      const resIds = res.map(item => item.chan)
      const [exist, resouce] = [[], []]
      // 创建新的门禁设备，保留已经存在的，删除不存在的
      result.message.doorInfo.forEach(item => {
        !resIds.includes(item.devId) ? resouce.push(item) : exist.push(item.devId)
      })
      const rmRes = resIds.filter(item => !exist.includes(item))
      const resChanl = resouce.map(item => {
        return { type: item.devType, name: item.devName, ip: item.devIp, chan: item.devId, eid: id }
      })
      // 清除不存在的门禁设备才能重新查找
      await Promise.all([Resource.remove({ eid: id, chan: { $in: rmRes } }), Resource.insertMany(resChanl)])
      const devs = await paging.listQuery(
        Resource,
        { eid: id },
        'chan name type ip res',
        { chan: 1 },
        paganation,
        '',
        ctx
      )
      ctx.status = 200
      ctx.body = devs.results.map(item => {
        item = item.toObject()
        item.status = item.res && item.res.length > 0 ? 1 : 0
        delete item.res
        return item
      })
    } else {
      ctx.throw(500, result)
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 查询限定条件的门禁【由于通道chan为数字类型不能进行正则匹配，所以采用自由分页进行】
module.exports.query = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-查询门禁设备'))
  try {
    const id = ctx.params.id
    const paganation = ctx.query.page || ''
    const key = decodeURIComponent(ctx.query.key) || ''
    // const reg = `/[0-9]*?${key}[0-9]*?/.test(this.chan)`
    const regexChan = new RegExp(`[0-9]*?${key}[0-9]*?`)
    const regexName = new RegExp(`${key}`)
    const result = {}
    result.results = await Resource.find({ eid: id }, 'chan name type ip res')
      .sort({ chan: 1 })
      .lean()
    result.results = result.results.filter(item => {
      return regexChan.test(item.chan) || regexName.test(item.name)
    })
    const count = result.results.length
    if (parseInt(paganation.page) <= Math.ceil(count / paganation.limit)) {
      const [down, upper] = [(+paganation.page - 1) * +paganation.limit, +paganation.page * +paganation.limit]
      result.results = result.results.filter((item, index) => {
        return down <= index && upper > index
      })
    }
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': Math.ceil(count / paganation.limit),
      'X-BSC-CUR': parseInt(paganation.page),
      'X-BSC-LIMIT': parseInt(paganation.limit)
    })
    ctx.status = 200
    ctx.body = result.results.map(item => {
      item.status = item.res && item.res.length > 0 ? 1 : 0
      delete item.res
      return item
    })
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 配置门禁系统下指定门禁的摄像机
module.exports.config = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-配置门禁设备绑定的资源'))
  try {
    if (!ctx.params.id) {
      ctx.throw(500, { code: 2001, message: '参数不全' })
    }
    const entity = { res: ctx.request.body.res }
    await Resource.findByIdAndUpdate(ctx.params.id, entity)
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取门禁系统下指定门禁的摄像机
module.exports.fetch = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-获取门禁设备绑定的资源'))
  try {
    let result
    const { id, devId } = ctx.params
    if (!_.isNil(id)) {
      result = await Resource.find({ _id: id }, 'res')
    } else if (!_.isNil(devId)) {
      result = await Resource.find({ chan: devId }, 'res')
        .limit(1)
        .lean()
      if (_.isEmpty(result)) {
        ctx.throw(500, { code: 2001, message: '门禁摄像资源为空' })
      }
      result = await Resource.find({ _id: { $in: result[0].res } }, 'chan stream eid')
        .populate('eid', 'ip cport')
        .lean()
      result = result.map(item => {
        return { channel: item.chan, streamType: item.stream, devIp: item.eid.ip, devPort: item.eid.cport }
      })
    }
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '门禁摄像资源获取错误' })
    }
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 打开|关闭指定id门禁系统的门禁设备
module.exports.ctrl = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-打开|关闭门禁设备'))
  try {
    const id = ctx.params.id
    const device = ctx.params.device
    const ctrl = ctx.query.op || ''
    if (_.isEmpty(ctrl) || ![1, 2].includes(Number(ctrl))) {
      ctx.throw(500, { code: 2001, message: '门禁控制参数错误' })
    }
    const server = await Device.findById(id)
    if (_.isEmpty(server)) {
      ctx.throw(500, { code: 2001, message: '找不到门禁服务器配置资源' })
    }
    const params = { devId: Number(device), doorType: Number(ctrl) }
    // 获取GetDoorDevInfoMA2DA proto
    const basePro = util.baseProto('DoorOperateMA2DA')
    // 请求参数编码成字节buffer
    const doorReqMsg = util.getProtoMsg(basePro, 'DoorOperateReq')
    const buff = util.encode(doorReqMsg, params)
    // protobuf协议数据格式
    const payload = { cmdBase: { devIp: server.ip, devPort: Number(server.cport) }, cmdContent: buff }
    // 获取 protobuf协议消息结构
    const structPro = util.getProtoMsg(basePro, 'CommandGeneric')
    // 按照 protobuf协议消息结构编码消息生成字节buffer
    const bufReq = util.encode(structPro, payload)
    // 通过tcp协议发送消息
    const result = await util.tcp(bufReq, command.VMR_COMMAND_MA2DA_DOOR_OPERATE)
    // 请求成功，解析获取解码的buffer数据
    if (!_.isEqual(result.code, 0)) {
      ctx.throw(500, result)
    }
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 取门门禁服务器刷卡记录
module.exports.record = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-获取门禁刷卡记录'))
  const db = await getDb()
  const AccessLog = db.model('AccessLog', AccessLogSchema, 'AccessLog')
  try {
    const query = {}
    const id = ctx.params.id
    const start = ctx.query.search.start || ''
    const end = ctx.query.search.end || ''
    const paganation = ctx.query.page || ''
    const peopleType = ['0', '1', '2']
    query.idNum = { $regex: ctx.query.search.number || '' }
    // 0普通,1黑名单,2重点关注
    query.peopleType = { $in: peopleType }
    if (peopleType.includes(ctx.query.search.type)) {
      query.peopleType = ctx.query.search.type
    }
    if (start && end) {
      query.$and = [
        { time: { $gt: moment.unix(start).format('YYYY-MM-DD HH:mm:ss') } },
        { time: { $lt: moment.unix(end).format('YYYY-MM-DD HH:mm:ss') } }
      ]
    } else if (start) {
      query.time = { $gt: moment.unix(start).format('YYYY-MM-DD HH:mm:ss') }
    } else if (end) {
      query.time = { $lt: moment.unix(end).format('YYYY-MM-DD HH:mm:ss') }
    }
    const [deves, result] = await Promise.all([
      Resource.find({ eid: id }, 'name chan').lean(),
      paging.listQuery(AccessLog, query, '', { time: -1 }, paganation, '', ctx)
    ])
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      const records = result.results.map(item => {
        item = item.toObject()
        item.direction = item.direction === '1' ? '进' : '出'
        item.openStatus = item.openStatus === '1' ? '已开' : '未开'
        item.devName = _.get(_.find(deves, { chan: Number(item.doorNum) }), 'name')
        switch (item.peopleType) {
          case '0':
            item.peopleType = '普通'
            break
          case '1':
            item.peopleType = '黑名单'
            break
          case '2':
            item.peopleType = '重点关注'
        }
        return item
      })
      ctx.status = 200
      ctx.body = records
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取门禁服务器配置列表
module.exports.index = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-获取门禁服务器配置列表'))
  try {
    const paganation = ctx.query.page || ''
    const result = await paging.listQuery(
      Device,
      { bigtype: 2 },
      'name manufacturer model ip deviceid',
      { createdAt: -1 },
      paganation,
      '',
      ctx
    )
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 获取门禁服务器配置列表
module.exports.getAll = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-获取门禁服务器列表'))
  try {
    const result = await Device.find({ bigtype: 2 }, 'name manufacturer model ip deviceid', { name: 1 })
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取指定id的门禁服务器配置
module.exports.findById = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-获取指定id的门禁服务器配置'))
  try {
    const id = ctx.params.id
    const result = await Device.findById(id)
    ctx.status = 200
    ctx.body = result || {}
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 新增门禁服务器配置
module.exports.create = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-创建门禁服务器配置'))
  try {
    const entity = ctx.request.body
    const espect = await Device.find({ bigtype: 2, type: 'doorAccess', ip: entity.ip, cport: entity.cport })
    if (!_.isEmpty(espect)) {
      ctx.throw(500, { code: 2001, message: 'ip|端口地址已存在' })
    }
    entity.bigtype = 2
    entity.type = 'doorAccess'
    const result = await Device.create(entity)
    ctx.status = 201
    ctx.headers['location'] = ctx.url + result._id
    ctx.body = [result._id]
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 修改指定id的门禁服务器配置
module.exports.update = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-更新门禁服务器配置'))
  try {
    await Device.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 删除指定id的门禁服务器配置
module.exports.remove = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('门禁管理-删除门禁服务器配置'))
  try {
    const id = ctx.params.id
    await Promise.all([Device.findByIdAndRemove(id), Resource.remove({ eid: id })])
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}
