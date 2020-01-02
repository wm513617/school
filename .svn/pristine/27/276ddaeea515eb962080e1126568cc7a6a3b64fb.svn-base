/**
 * 黑白名单控制器
 * @time:207-6-17
 * @author:hansen
 */

const People = require('mongoose').model('People')
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
const fileds = 'username age gender idNumber type reason similarity picture'

// 根据指定的文档id，获取指定人员布控信息
exports.get = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人脸抓拍-获取黑白名信息'))
  const id = ctx.params.id
  try {
    const result = await People.findById(id, fileds + '  remark')
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
  ctx.set('loginfo', encodeURI('人脸抓拍-获取黑白名信息列表'))
  // const search = ctx.query.search
  const condition = ctx.query
  const username = condition.search.username === undefined ? '' : condition.search.username
  const type = condition.search.type === undefined ? '' : condition.search.type
  const paganation = condition.page === undefined ? '' : condition.page
  var result = ''
  try {
    result = await paging.listQuery(People, { type: type || { $in: [CONSTANTS.PEOPLE.BLACK, CONSTANTS.PEOPLE.WHITE] }, username: { $regex: (username + '') || '' } }, fileds + '  remark', { createdAt: -1 }, paganation, '', ctx)
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
  ctx.set('loginfo', encodeURI('人脸抓拍-创建黑白名信息'))
  try {
    const entity = ctx.request.body
    // 上传图片的id
    const id = entity.picture.match(/id=(.*)$/)[1]
    const type = entity.picture.match(/type=(.*?)&/)[1]
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
      return ctx.throw(500, { code: response.code, message: response.desc })
    }
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
  ctx.set('loginfo', encodeURI('人脸抓拍-删除黑白名信息'))
  const id = ctx.params.id
  try {
    const people = await People.findById(id)
    const removeFlag = await faceServer.removePerson({
      id: people.visionId
    })
    if (_.isNull(removeFlag)) {
      return ctx.throw(500, { code: 2004, message: '第三方接口异常', type: 'sys' })
    }
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
// 根据文档id更新人员信息
exports.update = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人脸抓拍-更新黑白名信息'))
  const id = ctx.params.id
  const entity = ctx.request.body
  try {
    const people = await People.findById(id)
    const data = {
      'name': entity.username,
      'gender': entity.gender === 0 ? 2 : 1,
      'remark': entity.idNumber,
      'title': entity.type
    }
    if (!_.isEqual(people.picture, entity.picture)) {
      // 上传图片的id
      // const fileId = entity.picture.match(/fs\/(.*)$/)[1]
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
exports.checkIdNumber = async (ctx, next) => {
  try {
    const id = ctx.query._id === undefined ? '' : ctx.query._id
    const idNumber = ctx.query.idNumber === undefined ? '' : ctx.query.idNumber
    const result = await People.find({ idNumber: idNumber, type: { $in: [CONSTANTS.PEOPLE.BLACK, CONSTANTS.PEOPLE.WHITE] } })
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
    handleSysException(err, 2002)
  }
}
