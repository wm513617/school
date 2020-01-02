/**
 * 节假日控制器
 * @time:207-6-17
 * @author:hansen
 */

const Holiday = require('mongoose').model('Holiday')
const _ = require('lodash')
const handleSysException = require('../../../../common/tools').handleSysException

// 根据指定的文档id，获取指定节假日信息
exports.get = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-获取节假日信息'))
  const id = ctx.params.id
  try {
    const result = await Holiday.findById(id, 'holidayName type enable startTime endTime')
    if (_.isNull(result)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 4107)
  }
}
// 获取所有节假日文档
exports.index = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-获取所有节假日信息'))
  try {
    const result = await Holiday.find({}, 'holidayName type enable startTime endTime')
    ctx.body = result
  } catch (err) {
    handleSysException(err, 4107)
  }
}
// 创建一个新的节假日记录
exports.create = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-创建节假日'))
  try {
    const entity = ctx.request.body
    const result = await Holiday.create(entity)
    ctx.status = 201
    ctx.headers['location'] = ctx.url + result._id
    ctx.body = [result._id]
  } catch (err) {
    handleSysException(err, 4109, '数据验证错误，请检查数据是否正确')
  }
}
// 根据文档id修改节假日记录
exports.remove = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-删除节假日'))
  const id = ctx.params.id
  try {
    const result = await Holiday.findByIdAndRemove(id)
    if (_.isNull(result)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = ''
    }
  } catch (err) {
    handleSysException(err, 4107)
  }
}
// 根据文档id更新节假日记录
exports.update = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-更新节假日'))
  const id = ctx.params.id
  const entity = ctx.request.body
  try {
    const result = await Holiday.findByIdAndUpdate(id, entity)
    if (_.isNull(result)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = ''
    }
  } catch (err) {
    handleSysException(err, 4107)
  }
}
