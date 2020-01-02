/*
 * 机构接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:50:31
 * @Last Modified by: dfk
 * @Last Modified time: 2019-06-05 16:33:56
 */

'use strict'

const mongoose = require('mongoose')
const Org = mongoose.model('Org')
const OrgRes = mongoose.model('OrgRes')
const Device = mongoose.model('Device')
const Resource = mongoose.model('Resource')
const OrgAlarm = mongoose.model('OrgAlarm')
const Key = mongoose.model('Key')

const Security = mongoose.model('Security')
const PatrolPoint = mongoose.model('PatrolPoint')
const _ = require('lodash')
const tool = require('../../../common/tools')
const postal = require('postal')
const Rtsp = require('../../../common/rtsp')
const rtspServer = new Rtsp()
const generateNum = require('../../platform/generateNum')
const { ORG_TYPE, DEV_TYPE, RES_TYPE } = require('../../../common/constant')
const { orgCheckCross } = require('../../vehicle/crossing/crossing.controller')
/**
 * 创建组织机构
 */
exports.create = async (ctx, next) => {
  try {
    ctx.set('loginfo', encodeURI('系统配置-添加机构'))
    const parentOrg = await Org.findById(ctx.request.body.pid, 'gbDevId shareType')
    if (parentOrg.shareType) {
      ctx.throw(500, { code: 1018, message: '下联机构不能添加子机构' })
    }
    const num = await Org.countDocuments({ code: ctx.request.body.code, type: ctx.request.body.type }).exec()
    if (num) {
      ctx.throw(500, { code: 1018, message: '该机构编号已存在' })
    }
    ctx.request.body.pinyin = tool.transferPinyin(ctx.request.body.name)
    // if (res) {
    //   ctx.throw(500, { code: 1002, message: '该机构已存在' })
    // }
    // 组织机构增加国标字段
    if (!ctx.request.body.type) {
      await generateNum.org(ctx.request.body, parentOrg.gbDevId)
    }
    const org = await Org.create(ctx.request.body)
    const key = await Key.getKeyById(`org_${ctx.request.body.type}`)
    org.order = key
    await org.save()
    ctx.status = 201
    ctx.body = [org._id]
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
exports.getList = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('系统配置-获取机构列表'))
    const orgs = await Org.find({ type: ctx.query.type }).exec()
    ctx.body = orgs
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 获取机构树
exports.getTree = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('系统配置-获取机构树'))
    let allChildrenIds = []
    const root = await Org.findOne({ type: ctx.query.type || ORG_TYPE.LOCALE, isroot: true }, '_id')
      .lean()
      .exec()
    let orgs = await Org.find(
      { type: ctx.query.type || ORG_TYPE.LOCALE },
      '_id name pid order isroot code pinyin shareServer'
    )
      .lean()
      .exec() // -devices
    const oid = root._id
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, oid)
    allChildrenIds.unshift(oid + '')
    if (!_.isEmpty(allChildrenIds)) {
      orgs = await Org.find({ _id: { $in: allChildrenIds } }, '_id name pid order isroot code pinyin shareServer')
        .sort({ order: 1 })
        .lean()
        .exec()
    }
    allChildrenIds = null
    const treeDatas = tool.transData2Tree(orgs, '_id', 'pid')
    ctx.body = treeDatas.length ? treeDatas[0] : {}
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 获取单个机构信息（包括该机构下所有子孙机构信息）
exports.getOne = async ctx => {
  ctx.set('loginfo', encodeURI('系统配置-获取单个机构信息'))
  let allChildrenIds = []
  try {
    let orgs = await Org.find({ type: ctx.query.type || ORG_TYPE.LOCALE }, '_id name pid order')
      .sort('name')
      .exec() // -devices
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.params.id)
    allChildrenIds.unshift(ctx.params.id + '')
    if (!_.isEmpty(allChildrenIds)) {
      orgs = await Org.find({ _id: { $in: allChildrenIds } }).exec()
    }
    allChildrenIds = null
    const treeDatas = tool.transData2Tree(JSON.parse(JSON.stringify(orgs)), '_id', 'pid')
    ctx.body = treeDatas.length ? treeDatas[0] : {}
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 修改机构
exports.updateOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('系统配置-修改机构'))
    const org = await Org.findById(ctx.params.id).lean()
    if (org.shareType) {
      ctx.throw(500, { code: 1019, message: '不能修改下联机构' })
    }
    // const res = await Org.find({ name: ctx.request.body.name })
    // let flag = false
    // res.forEach(item => {
    //   if (item.name === ctx.request.body.name && item._id + '' !== ctx.params.id + '') flag = true
    // })
    // if (flag) return ctx.throw(500, { code: 1012, message: '该名称已存在' })
    ctx.request.body.pinyin = tool.transferPinyin(ctx.request.body.name)
    await Org.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
    ctx.status = 200
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 删除机构（机构下存在子机构、设备、资源不允许删除）
exports.deleteOne = async ctx => {
  try {
    const orginfo = await Org.findById(ctx.params.id).exec()
    if (orginfo.shareType) {
      ctx.throw(500, { code: 1019, message: '不能删除下联机构' })
    }
    // 处理当前机构下有下联机构是不能删除
    if (!orginfo.type) {
      const childrens = []
      const orgs = await Org.find({ type: orginfo.type || 0 }).lean()
      tool.getChildren(childrens, orgs, orginfo._id.toString())
      const orgList = await Org.find({ _id: { $in: childrens } }).lean()
      const shareOrg = orgList.find(item => !!item.shareServer)
      if (shareOrg) {
        ctx.throw(500, { code: 1019, message: '该机构下存在下联机构不能删除' })
      }
    }
    if (!orgCheckCross(ctx.params.id)) {
      ctx.throw(500, { code: 500, message: '请先删除该机构下的数据' })
    }
    ctx.set('loginfo', encodeURI('系统配置-删除机构'))
    if (_.isEmpty(orginfo)) {
      return ctx.throw(500, { code: 1003, message: '该机构不存在' })
    }
    if (orginfo.isroot) {
      // 如果是根机构
      return ctx.throw(500, { code: 1004, message: '根机构不允许直接操作' })
    }
    // 获取机构下的所有子机构
    let childs = []
    const childrens = await Org.find({ pid: ctx.params.id }, '_id').exec()
    childs = childrens.map(item => item._id + '')
    childs.push(ctx.params.id)
    // 获取子机构下的所有设备
    const devices = await Device.find({ oid: { $in: childs } }).exec()
    const IPCIds = devices.filter(item => {
      if (item.bigtype === DEV_TYPE.VIDEO) {
        return item._id
      }
    })
    const decoderIds = devices.filter(item => {
      if (item.bigtype === DEV_TYPE.DECODER) {
        return item._id
      }
    })
    devices.forEach(async item => {
      if (_.isEmpty(item)) {
        return ctx.throw(404, { code: 1010, message: '该设备不存在' })
      }
      // 查找设备对应的资源
      const res = await Resource.find({ eid: item._id }).exec()
      // 如果资源中存在智能报警，删除对应的机构报警关系表
      res.forEach(async item => {
        await OrgAlarm.deleteMany({ resource: item._id }).exec()
      })
      // 设备更新通知
      postal.publish({
        channel: 'devices',
        topic: 'item.notice',
        data: {
          ctx: ctx,
          data: {
            module: 'dev',
            varyData: [
              {
                before: {
                  devIp: item.ip + '',
                  devPort: +item.cport
                },
                after: {}
              }
            ],
            newData: []
          }
        }
      })
    })
    const deviceIds = devices.filter(item => item._id)
    // 查找出所有的视频资源
    const resources = await Resource.find({ eid: { $in: IPCIds } })
    postal.publish({
      channel: 'resources',
      topic: 'array.delete',
      data: {
        ctx,
        ids: resources.map(item => item._id)
      }
    })
    const allReses = await Resource.find({ eid: { $in: deviceIds } }, 'rtsp.main')
    postal.publish({
      channel: 'alarm',
      topic: 'alarmCfg',
      data: {
        ids: allReses.map(item => item._id)
      }
    })
    postal.publish({
      channel: 'alarm',
      topic: 'fireAlarmCfg',
      data: {
        ids: allReses.map(item => item._id)
      }
    })
    // 删除所有资源
    await Resource.deleteMany({ eid: { $in: deviceIds } }).exec()
    // 回收rtsp id
    allReses.forEach(res => {
      if (res.rtsp) {
        const rtspId = res.rtsp.main.split('=').pop()
        // 回收当前资源的rtsp id
        rtspServer.setUnusedIds(Number(rtspId))
      }
    })
    // 删除机构资源对应关系表
    await OrgRes.deleteMany({ org: { $in: childs } }).exec()
    // 删除所有设备
    await Device.deleteMany({ oid: { $in: childs } }).exec()
    // 删除所有子机构
    await Org.deleteMany({ pid: ctx.params.id }).exec()
    // 删除机构自身
    await Org.findByIdAndRemove(ctx.params.id).exec()

    // 删除单兵人员机构对应表格
    const SecurityOid = ctx.params.id
    await Security.deleteMany({affiliation: SecurityOid})
    // 删除巡更点位机构对应表格
    const PatrolPointOid = ctx.params.id
    await PatrolPoint.deleteMany({affiliation: PatrolPointOid})

    if (!_.isEmpty(IPCIds)) {
      // 查找对应的资源
      const resources = await Resource.find({ eid: { $in: IPCIds }, type: RES_TYPE.VIDEO }).exec()
      postal.publish({
        channel: 'devices',
        topic: 'item.deleteIPC',
        data: {
          equipment: IPCIds,
          resources
        }
      })
    }
    if (!_.isEmpty(decoderIds)) {
      const resources = await Resource.find({ eid: { $in: decoderIds }, type: RES_TYPE.DECODER }).exec()
      postal.publish({
        channel: 'devices',
        topic: 'item.deleteDecoder',
        data: {
          equipment: decoderIds,
          resources
        }
      })
    }
    postal.publish({
      channel: 'orgs',
      topic: 'item.delete',
      data: {
        id: ctx.params.id,
        ctx: ctx
      }
    })
    ctx.status = 200
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 机构上下移动
exports.updown = async ctx => {
  ctx.set('loginfo', encodeURI('系统配置-机构移动'))
  const previd = ctx.request.body.previd // 移动后的上一个机构id（移动到最顶部时该id为空）
  try {
    const orginfo = await Org.findById(ctx.params.id).exec()
    if (_.isEmpty(orginfo)) {
      return ctx.throw(404, { code: 1003, message: '该机构不存在' })
    }
    if (orginfo.isroot) {
      // 如果是根机构
      return ctx.throw(404, { code: 1004, message: '根机构不允许直接操作' })
    }
    if (previd) {
      const prevorg = await Org.findById(previd).exec() // 上一个机构的信息
      if (_.isEmpty(prevorg)) {
        return ctx.throw(404, { code: 1008, message: '参数不能为空' })
      }
      ;[orginfo.order, prevorg.order] = [prevorg.order, orginfo.order] // 交换两个order字段
      await Promise.all([prevorg.save(), orginfo.save()]) // 同时保存
      ctx.status = 200
    } else {
      return ctx.throw(404, { code: 1008, message: '参数不能为空' })
    }
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 机构升级
exports.upgrading = async ctx => {
  ctx.set('loginfo', encodeURI('系统配置-机构升级'))
  if (!ctx.request.body.pid) {
    return ctx.throw(404, { code: 1008, message: '参数不能为空' })
  }
  const orginfo = await Org.findById(ctx.params.id).exec()
  if (_.isEmpty(orginfo)) {
    return ctx.throw(404, { code: 1003, message: '该机构不存在' })
  }
  if (orginfo.isroot) {
    // 如果是根机构
    return ctx.throw(404, { code: 1004, message: '根机构不允许直接操作' })
  }
  try {
    const preOrder = await Org.findById(orginfo.pid, 'order').exec()
    orginfo.pid = ctx.request.body.pid
    // const key = await Key.getKeyById(`org_${orginfo.type}`)
    const overIds = await Org.find({ order: { $gt: parseInt(preOrder.order) } }, '_id')
    overIds.forEach(async item => {
      await Org.findByIdAndUpdate(item, { $inc: { order: 1 } })
    })
    orginfo.order = preOrder.order + 1
    await orginfo.save()
    ctx.status = 200
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 机构升级
exports.downgrading = async ctx => {
  ctx.set('loginfo', encodeURI('系统配置-机构降级'))
  if (!ctx.request.body.pid) {
    return ctx.throw(404, { code: 1008, message: '参数不能为空' })
  }
  const orginfo = await Org.findById(ctx.params.id).exec()
  if (_.isEmpty(orginfo)) {
    return ctx.throw(404, { code: 1003, message: '该机构不存在' })
  }
  if (orginfo.isroot) {
    // 如果是根机构
    return ctx.throw(404, { code: 1004, message: '根机构不允许直接操作' })
  }
  try {
    orginfo.pid = ctx.request.body.pid
    await orginfo.save()
    ctx.status = 200
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 根据类型获取根机构详情
exports.getRootInfo = async ctx => {
  ctx.set('loginfo', encodeURI('系统配置-获取根机构信息'))
  ctx.body = await Org.findOne({
    isroot: true,
    type: ctx.params.type
  }).exec()
}
