/**
 * 人员布控控制器
 * @time:207-6-17
 * @author:hansen
 */
const People = require('mongoose').model('People')
const moment = require('moment')
const faceServer = require('../service/face.service')
const gridfs = require('../../../common/gridfs.util')
const CONSTANTS = require('../face.constants').FACE
const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const config = require('../../../../config')
const mkidrsSync = require('../../../common/tools').mkdirsSync
const handleSysException = require('../../../common/tools').handleSysException
const paging = require('../../paging')
const fileds = 'startTime endTime username age gender idNumber reason similarity picture status'

// 根据指定的文档id，获取指定人员布控信息
exports.get = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员布控-获取布控人员信息'))
  const id = ctx.params.id
  try {
    const result = await People.findById(id, fileds + ' remark resources')
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 获取所有人员布控文档
exports.index = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员布控-获取所有布控人员信息'))
  // const search = ctx.query.search
  // const paganation = ctx.query.page
  const condition = ctx.query
  const username = condition.search.username === undefined ? '' : condition.search.username
  const status = condition.search.status === undefined ? '' : condition.search.status
  const paganation = condition.page === undefined ? '' : condition.page
  var result = ''
  try {
    result = await paging.listQuery(People, { type: CONSTANTS.PEOPLE.ATTENTION, status: status || '', username: { $regex: username + '' || '' } }, fileds, { createdAt: -1 }, paganation, '', ctx)
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 创建一个新的人员布控记录
exports.create = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员布控-创建人员信息'))
  try {
    const entity = ctx.request.body
    // 布控人员类型
    entity.type = CONSTANTS.PEOPLE.ATTENTION
    if (_.isUndefined(entity.startTime)) {
      entity.startTime = Number(moment().format('X'))
    }
    if (_.isUndefined(entity.endTime)) {
      entity.endTime = Number(moment(moment().format('YYYYMMDD')).add(1, 'd').format('X'))
    }
    if (entity.startTime === entity.endTime) {
      ctx.throw(500, { code: 2100, message: '布控起始时间不能等于结束时间', type: 'sys' })
    }
    // 上传图片的id
    const id = entity.picture.match(/id=(.*)$/)[1]
    const type = entity.picture.match(/type=(.*?)&/)[1]
    // 获取上传图片上的信息
    const stream = await gridfs.readFileByIdFromGFS({ type, id })
    console.log(type)
    // 校验图片格式，如果不为jpg修改成jpg
    const dir = config.backend.fileDirs.tempDir
    mkidrsSync(dir)
    const filePath = path.join(dir, Math.random().toString(36).replace('.', '') + '.jpg')
    // 根据图片2进制流生成图片
    await new Promise((resolve, reject) => {
      const flow = stream.pipe(fs.createWriteStream(filePath))
      flow.on('finish', () => {
        resolve()
      })
    })
    // 把本地图片上传到旷视系统中
    const response = await faceServer.uploadImage({
      'photo': fs.createReadStream(filePath)
    })
    if (_.isNull(response)) {
      ctx.throw(500, { code: 2006, message: '图片上传失败', type: 'sys' })
    }
    if (response.code !== 0) {
      return ctx.throw(500, { code: 2007, message: response.desc })
    }
    // 删除临时图片
    fs.unlinkSync(filePath)
    const person = await faceServer.createPerson({
      data: {
        'name': entity.username,
        'gender': entity.gender === 0 ? 2 : 1,
        'subject_type': 0,
        'remark': entity.idNumber,
        'title': entity.type,
        'photo_ids': [response.data.id]
      }
    })
    if (_.isNull(person)) {
      ctx.throw(500, { code: 2004, message: '第三方接口异常', type: 'sys' })
    }
    entity.visionId = person.data.id
    const current = Number(moment().format('X'))
    // 布控时间在当前范围内的话布控状态为布控中。布控时间已过状态为已停止 默认未开始
    if (current >= entity.startTime && current <= entity.endTime) {
      entity.status = CONSTANTS.ATTENTION.GOING
    } else if (current >= entity.startTime && current >= entity.endTime) {
      entity.status = CONSTANTS.ATTENTION.STOP
    }
    const result = await People.create(entity)
    ctx.status = 201
    ctx.headers['location'] = ctx.url + result._id
    ctx.body = [result._id]
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 根据文档id修改人员布控记录
exports.remove = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员布控-删除布控人员信息'))
  const id = ctx.params.id
  try {
    const people = await People.findById(id)
    const removeFlag = await faceServer.removePerson({
      id: people.visionId
    })
    if (_.isNull(removeFlag)) {
      return ctx.throw(500, { code: 2004, message: '第三方接口异常', type: 'sys' })
    }
    // 删除旧图片
    const picId = people.picture.match(/id=(.*)$/)[1]
    const picType = people.picture.match(/type=(.*?)&/)[1]
    const rst = await gridfs.getFileInfoByIdFromGFS({ type: picType, id: picId })
    if (!_.isEmpty(rst)) {
      await gridfs.deleteFileByIdFromGFS({ type: picType, id: picId })
    }
    const result = await People.findByIdAndRemove(id)
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = ''
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 根据文档id更新人员布控记录
exports.update = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员布控-更新布控人员信息'))
  const id = ctx.params.id
  const entity = ctx.request.body
  try {
    if (entity.startTime === entity.endTime) {
      ctx.throw(500, { code: 2100, message: '布控起始时间不能等于结束时间', type: 'sys' })
    }
    const people = await People.findById(id)
    const data = {
      'name': entity.username,
      'gender': entity.gender === 0 ? 2 : 1,
      'remark': entity.idNumber,
      'title': entity.type
    }
    if (!_.isEqual(people.picture, entity.picture)) {
      // 上传图片的id
      const id = entity.picture.match(/id=(.*)$/)[1]
      const type = entity.picture.match(/type=(.*?)&/)[1]
      // 删除旧图片
      const picId = people.picture.match(/id=(.*)$/)[1]
      const picType = people.picture.match(/type=(.*?)&/)[1]
      const rst = await gridfs.getFileInfoByIdFromGFS({ type: picType, id: picId })
      if (!_.isEmpty(rst)) {
        await gridfs.deleteFileByIdFromGFS({ type: picType, id: picId })
      }
      // 获取上传图片上的信息
      const stream = await gridfs.readFileByIdFromGFS({ type, id })
      // 校验图片格式，如果不为jpg修改成jpg
      const dir = config.backend.fileDirs.tempDir
      mkidrsSync(dir)
      const filePath = path.join(dir, Math.random().toString(36).replace('.', '') + '.jpg')
      // 根据图片2进制流生成图片
      await new Promise((resolve, reject) => {
        const flow = stream.pipe(fs.createWriteStream(filePath))
        flow.on('finish', () => {
          resolve()
        })
      })
      // 把本地图片上传到旷视系统中
      const response = await faceServer.uploadImage({
        'photo': fs.createReadStream(filePath)
      })
      // 删除临时图片
      fs.unlinkSync(filePath)
      if (_.isNull(response)) {
        ctx.throw(500, { code: 2006, message: '图片上传失败', type: 'sys' })
      }
      if (response.code !== 0) {
        return ctx.throw(500, { code: 2007, message: response.desc })
      }
      data['photo_ids'] = [response.data.id]
    }
    const updateFlag = await faceServer.updatePerson({
      id: people.visionId,
      data: data
    })
    if (_.isNull(updateFlag)) {
      return ctx.throw(500, { code: 2004, message: '第三方接口异常', type: 'sys' })
    }
    const current = Number(moment().format('X'))
    // 布控时间在当前范围内的话布控状态为布控中。布控时间已过状态为已停止 默认未开始
    if (current >= entity.startTime && current <= entity.endTime) {
      entity.status = CONSTANTS.ATTENTION.GOING
    } else if (current >= entity.startTime && current >= entity.endTime) {
      entity.status = CONSTANTS.ATTENTION.STOP
    }
    const result = await People.findByIdAndUpdate(id, entity)
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = ''
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 对布控人员开始布控
exports.start = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员布控-开始布控'))
  const attention = ctx.request.body
  const response = []
  try {
    let status = 0
    const date = Number(moment(moment().format('YYYYMMDD')).format('X'))
    if (Number(attention.startTime) <= date && date <= Number(attention.endTime)) {
      status = 1
    } else if (date >= Number(attention.endTime)) {
      status = 2
    }
    for (const id of attention.ids) {
      const result = await People.findByIdAndUpdate(id, { status: status, startTime: attention.startTime, endTime: attention.endTime })
      if (_.isNull(result)) {
        response.push({ code: 2001, message: '找不到请求的服务资源' })
      } else {
        response.push(result._id)
      }
    }
    ctx.status = 200
    ctx.body = response
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 对布控人员停止布控
exports.stop = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员布控-停止布控'))
  const attention = ctx.request.body
  const response = []
  try {
    for (const id of attention.ids) {
      const result = await People.findById(id)
      if (result && result.status !== 1) {
        response.push({ code: 2001, message: result._id + '不是布控中的人员' })
        continue
      }
      result.update({ status: 2 }).exec()
      response.push(result._id)
    }
    ctx.status = 200
    ctx.body = response
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 同步布控状态
exports.syncAttentionStatus = async () => {
  try {
    const results = await People.find({ type: CONSTANTS.PEOPLE.ATTENTION, status: { $ne: 2 } }, '_id startTime endTime')
    const now = moment().format('X')
    results.forEach(async (item) => {
      if (now > item.endTime) {
        await People.findByIdAndUpdate(item._id, { status: 2 })
      }
      if (now > item.startTime && now < item.endTime) {
        await People.findByIdAndUpdate(item._id, { status: 1 })
      }
    })
  } catch (error) {
    console.log(error)
  }
}
exports.checkIdNumber = async (ctx, next) => {
  try {
    const id = ctx.query._id === undefined ? '' : ctx.query._id
    const idNumber = ctx.query.idNumber === undefined ? '' : ctx.query.idNumber
    const result = await People.find({ idNumber: idNumber, type: CONSTANTS.PEOPLE.ATTENTION })
    let flag = false
    if (_.isEmpty(id)) {
      if (!_.isEmpty(result)) { ctx.throw(500, { code: 2013, message: '身份证号码已存在' }) }
    } else {
      result.forEach(item => {
        if (item._id + '' !== id + '' && item.idNumber + '' === idNumber + '') { flag = true }
      })
    }
    if (flag) { ctx.throw(500, { code: 2013, message: '身份证号码已存在' }) }
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 2002, message: '系统内部错误' })
  }
}
