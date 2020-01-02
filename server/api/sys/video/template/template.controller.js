/**
 * 计划模板控制器
 * @time:207-6-17
 * @author:hansen
 */

const PlanTemplate = require('mongoose').model('PlanTemplate')
const Snapshot = require('mongoose').model('Snapshot')
const Record = require('mongoose').model('Record')
const _ = require('lodash')
const notice = require('../../../bstar/video.interface')
const handleSysException = require('../../../../common/tools').handleSysException

// 根据指定的文档id，获取指定计划模板信息
exports.get = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-获取计划模板'))
  const id = ctx.params.id
  try {
    const result = await PlanTemplate.findById(id, 'name elements')
    if (_.isNull(result)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 4107)
  }
}
// 获取所有计划模板文档
exports.index = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-获取所有计划模板'))
  try {
    const result = await PlanTemplate.find({}, 'name elements')
    ctx.body = result
  } catch (err) {
    handleSysException(err, 4107)
  }
}

// 获取所有计划模板摘要信息(_id、name)
exports.getSummary = async (ctx, next) => {
  try {
    const result = await PlanTemplate.find({}, 'name')
    ctx.body = result
  } catch (err) {
    handleSysException(err, 4107)
  }
}
// 创建一个新的计划模板记录
exports.create = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-创建计划模板'))
  try {
    const entity = ctx.request.body
    const result = await PlanTemplate.create(entity)
    // 通知计划模板变动
    notice.info(ctx, { module: 'plantemplate', newData: [], varyData: [] }).catch(err => {
      console.log({ code: 4108, message: 'bstar模板通知接口异常' }, err.message)
    })
    ctx.status = 201
    ctx.headers['location'] = ctx.url + result._id
    ctx.body = [result._id]
  } catch (err) {
    handleSysException(err, 4109, '数据验证错误，请检查数据是否正确')
  }
}
// 根据文档id修改计划模板记录
exports.remove = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-删除计划模板'))
  const id = ctx.params.id
  try {
    const records = await Record.find({ planTemplateId: id })
    if (!_.isEmpty(records)) {
      return ctx.throw(500, { code: 4104, message: '模板已被使用不能删除' })
    }
    const snapshots = await Snapshot.find({ $or: [{ eventPlanTemplateId: id }, { timePlanTemplateId: id }] })
    if (!_.isEmpty(snapshots)) {
      return ctx.throw(500, { code: 4104, message: '模板已被使用不能删除' })
    }
    const result = await PlanTemplate.findByIdAndRemove(id)
    if (_.isNull(result)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      // 通知计划模板变动
      notice.info(ctx, { module: 'plantemplate', newData: [], varyData: [] }).catch(err => {
        console.log({ code: 4108, message: 'bstar模板通知接口异常' }, err.message)
      })
      ctx.status = 200
      ctx.body = ''
    }
  } catch (err) {
    handleSysException(err, 4107)
  }
}
// 根据文档id更新计划模板记录
exports.update = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-更新计划模板'))
  const id = ctx.params.id
  const entity = ctx.request.body
  try {
    let before = await PlanTemplate.findById(id)
    const result = await PlanTemplate.findByIdAndUpdate(id, entity)
    if (_.isNull(result)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      // 格式化更新之前的数据
      before = _.omit(before.toObject(), ['__v', 'createdAt', 'updatedAt'])
      before._id = before._id.toString()
      if (!_.isEqual(before, entity)) {
        // 通知计划模板变动
        notice.info(ctx, { module: 'plantemplate', newData: [], varyData: [] }).catch(err => {
          console.log({ code: 4108, message: 'bstar模板通知接口异常' }, err.message)
        })
      }
      ctx.status = 200
      ctx.body = ''
    }
  } catch (err) {
    handleSysException(err, 4109, '数据验证错误，请检查数据是否正确')
  }
}
