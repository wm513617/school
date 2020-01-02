/*
 * 监控点报警接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:55:51
 * @Last Modified by: linhang
 * @Last Modified time: 2019-04-17 16:34:41
 */

'use strict'

const mongoose = require('mongoose')
const MonitoryPointAlarm = mongoose.model('MonitoryPointAlarm')
const AlarmCfg = mongoose.model('alarmCfg')
const OrgRes = mongoose.model('OrgRes')
const tools = require('../../../../../common/tools')
const handleSysException = tools.handleSysException
const postal = require('postal')
const Org = mongoose.model('Org')
const paging = require('../../../../paging')
/**
 * 添加监控点报警
 */
exports.add = async ctx => {
  try {
    if (!ctx.request.body.rid) {
      return ctx.throw(500, { code: -1, message: '所属资源id不能为空' })
    }
    const res = await MonitoryPointAlarm.create(ctx.request.body)
    ctx.status = 200
    ctx.body = res._id
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 添加监控点报警2.0
 */
exports.create = async ctx => {
  try {
    const objs = ctx.request.body.objs
    delete ctx.request.body.objs
    const data = []
    const rids = []
    objs.forEach(item => {
      const objData = _.clone(ctx.request.body)
      objData.rid = item.rid
      objData.name = item.name
      objData.chan = item.chan
      rids.push(item.rid)
      data.push(objData)
    })
    const subtype = ctx.request.body.subtype
    const count = await MonitoryPointAlarm.countDocuments({ rid: { $in: rids }, subtype: subtype })
    if (count) {
      ctx.throw(500, '同一设备不能重复添加相同报警子类型')
    }
    const mointoryPointAlarms = await MonitoryPointAlarm.create(data)
    // 给alarmcfg表添加一条数据，默认本机为联动视频
    const cfgData = []
    for (let i in objs) {
      const obj = {}
      obj.resource = mointoryPointAlarms[i]._doc._id
      const orgRes = await OrgRes.findOne({ resource: objs[i].rid })
        .lean()
        .exec()
      const actionVideoObj = {
        resource: objs[i].rid,
        channelName: objs[i].name,
        orgId: orgRes.org,
        mainCamera: true,
        client: true,
        videoWall: true,
        electronicMap: true,
        record: true
      }
      obj.actionVideo = [actionVideoObj]
      cfgData.push(obj)
    }
    await AlarmCfg.create(cfgData)

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
/**
 * 获取监控点报警
 */
exports.getOne = async ctx => {
  try {
    const res = await MonitoryPointAlarm.findById(ctx.params.id)
      .populate({ path: 'rid', select: 'eid', populate: { path: 'eid', select: 'name' } })
      .exec()
    ctx.status = 200
    ctx.body = res
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 修改监控点报警
 */
exports.update = async ctx => {
  try {
    await MonitoryPointAlarm.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx,
        data: {
          module: 'resource',
          varyData: [],
          newData: []
        }
      }
    })

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
 * 删除监控点报警
 */
exports.del = async ctx => {
  try {
    await MonitoryPointAlarm.deleteMany({ _id: { $in: ctx.query.ids.split(',') } }).exec()
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
 *批量更新2.0新增
 */
exports.updatePatch = async ctx => {
  try {
    const ids = ctx.request.body.ids
    delete ctx.request.body.ids
    await MonitoryPointAlarm.updateMany({ _id: { $in: ids } }, ctx.request.body)
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
    if (Number(ctx.query.config) === 1) {
      search.actionConfig = { $exists: false }
    }
    const data = await paging.listQuery(
      MonitoryPointAlarm,
      search,
      '',
      '',
      ctx.query.page,
      { path: 'rid', select: 'eid', populate: { path: 'eid', select: 'name' } },
      ctx
    )
    ctx.body = data.results
  } catch (error) {
    handleSysException(error)
  }
}
