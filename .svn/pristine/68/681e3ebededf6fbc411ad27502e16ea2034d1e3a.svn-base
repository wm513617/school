/**
 * 应急指挥控制器
 * @since:2018-2-22
 * @author:hansen
 */

'use strict'

const mongoose = require('mongoose')
const EmergencyPlan = mongoose.model('EmergencyPlan')
const paging = require('../paging')
const _ = require('lodash')
const handleSysException = require('../../common/tools').handleSysException

// 获取指定预案
module.exports.get = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('应急预案-获取预案'))
  try {
    const orgid = ctx.query.search.orgid
    const result = await EmergencyPlan.find({ orgid })
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取预案列表
module.exports.index = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('应急预案-获取预案列表'))
  try {
    // const planId = ctx.query.search.planId || '' // ?planId=1,2
    const planIds = ctx.query.search.planId.split(',') // [1,2]
    let search = ctx.query.search.key || ''
    if (_.isEmpty(planIds)) {
      ctx.throw(500, { code: 2001, message: '参数为空' })
    }
    const results = await paging.listQuery(
      EmergencyPlan,
      {
        // planId: planId,
        planId: {$in: planIds},
        $or: [
          { name: { $regex: search } },
          { 'group.name': { $regex: search } }
        ]
      },
      '',
      '',
      ctx.query.page,
      '',
      ctx
    )
    ctx.body = results
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 删除指定预案
module.exports.remove = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('应急预案-删除预案'))
  try {
    const id = ctx.params.id
    const result = await EmergencyPlan.findByIdAndRemove(id)
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

// 创建预案
module.exports.create = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('应急预案-创建预案'))
  try {
    const body = ctx.request.body
    const name = body.group[0].name
    if (name !== '') {
      const data = await EmergencyPlan.countDocuments({'group.name': body.group.map(item => item.name).toString(), $and: [{planId: body.planId}]})
      if (data) {
        throw new Error('管理执行人员已存在')
      }
    }
    await EmergencyPlan.create(body)
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 修改预案
exports.update = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('应急预案-修改预案'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const body = ctx.request.body
    const name = body.group[0].name
    if (name !== '') {
      const data = await EmergencyPlan.find({_id: {$ne: id}, 'group.name': body.group.map(item => item.name).toString(), $and: [{planId: body.planId}]})
      if (!_.isEmpty(data)) {
        throw new Error('管理执行人员已存在')
      }
    }
    await EmergencyPlan.findByIdAndUpdate(id, body)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 批量删除
module.exports.batchPlan = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('业务管理-批量删除预案'))
  try {
    let ids = ctx.request.headers['x-bsc-ids']
    ids = ids.split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '请选择要删除的数据' })
    }
    await EmergencyPlan.remove({ _id: { $in: ids } })
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}
