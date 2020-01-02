/*
 * 设备报警接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:52:34
 * @Last Modified by: linhang
 * @Last Modified time: 2019-04-12 11:24:11
 */

'use strict'

const mongoose = require('mongoose')
const DeviceAlarm = mongoose.model('DeviceAlarm')
const tools = require('../../../../../common/tools')
const handleSysException = tools.handleSysException
const Org = mongoose.model('Org')
const paging = require('../../../../paging')
const postal = require('postal')

/**
 * 添加设备报警
 */
exports.add = async ctx => {
  try {
    if (!ctx.request.body.eid) {
      return ctx.throw(500, { code: -1, message: '所属设备id不能为空' })
    }
    const res = await DeviceAlarm.create(ctx.request.body)
    ctx.status = 200
    ctx.body = res._id
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取设备报警
 */
exports.getOne = async ctx => {
  try {
    const res = await DeviceAlarm.findById(ctx.params.id)
    ctx.status = 200
    ctx.body = res
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 修改设备报警
 */
exports.update = async ctx => {
  try {
    await DeviceAlarm.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 删除设备报警
 */
exports.del = async ctx => {
  try {
    await DeviceAlarm.deleteMany({ _id: { $in: ctx.query.ids.split(',') } }).exec()
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx,
        data: {
          module: 'alarm',
          varyData: [],
          newData: []
        }
      }
    })
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 *查询2.0新增
 */
exports.getAll = async ctx => {
  try {
    const oid = ctx.query.oid
    const org = await Org.findById(oid)
      .lean()
      .exec()
    let allChildrenIds = []
    // 是否显示子机构，-1：显示，0：不显示
    if (Number(ctx.query.never) === -1) {
      const orgs = await Org.find(
        {
          type: org.type
        },
        '_id name pid order'
      )
        .sort('order')
        .exec()
      allChildrenIds = tools.getChildren(allChildrenIds, orgs, ctx.query.oid)
    }
    allChildrenIds.unshift(ctx.query.oid)
    let search = { orgId: { $in: allChildrenIds } }
    // 是否进行了模糊查询
    if (ctx.query.seek) {
      search.name = { $regex: ctx.query.seek }
    }
    // 是否勾选了“只显示未配置联动”,1:勾选，0：未勾选
    if (Number(ctx.query.action) === 1) {
      search.actionConfig = { $exists: false }
    }
    const data = await paging.listQuery(DeviceAlarm, search, '', '', ctx.query.page, { path: 'eid', select: 'name' }, ctx)
    ctx.body = data.results
  } catch (error) {
    handleSysException(error)
  }
}
/**
 *批量更新2.0新增
 */
exports.updatePatch = async ctx => {
  try {
    const ids = ctx.request.body.ids
    delete ctx.request.body.ids
    await DeviceAlarm.updateMany({ _id: { $in: ids } }, ctx.request.body)
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx,
        data: {
          module: 'alarm',
          varyData: [],
          newData: []
        }
      }
    })
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 添加设备报警2.0
 */
exports.create = async ctx => {
  try {
    const objs = ctx.request.body.objs
    delete ctx.request.body.objs
    const data = []
    const eids = []
    objs.forEach(item => {
      const objData = _.clone(ctx.request.body)
      objData.eid = item.eid
      objData.name = item.name
      eids.push(item.eid)
      data.push(objData)
    })
    const subtype = ctx.request.body.subtype
    const count = await DeviceAlarm.countDocuments({ eid: { $in: eids }, subtype: subtype })
    if (count) {
      ctx.throw(500, '同一设备不能重复添加相同报警子类型')
    }
    await DeviceAlarm.create(data)
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx,
        data: {
          module: 'alarm',
          varyData: [],
          newData: []
        }
      }
    })
    ctx.status = 201
  } catch (error) {
    handleSysException(error)
  }
}
