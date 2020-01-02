/*
 * @Author: chenkaibo
 * @Date: 2018-06-05 14:24:32
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-07 14:38:39
 */
'use strict'

const mongoose = require('mongoose')
const DefenseTask = mongoose.model('DefenseTask')
const Org = mongoose.model('Org')
const FaceServer = mongoose.model('FaceServer')
const OrgRes = mongoose.model('OrgRes')
const Resource = mongoose.model('Resource')
const { handleSysException, transData2Tree, getChildren } = require('../../../common/tools')
const { ORG_TYPE } = require('../../../common/constant')
const singleton = require('../controller/taskController').getSingleton()
const AlarmTimeTemplate = mongoose.model('alarmTimeTemplate')
const paging = require('../../paging')
const _ = require('lodash')

exports.getList = async ctx => {
  try {
    const results = await paging.listQuery(DefenseTask, {}, '', { _id: 1 }, ctx.query.page, { path: 'groups', select: '_id name' }, ctx)
    ctx.body = results
  } catch (error) {
    handleSysException(error)
  }
}
exports.add = async ctx => {
  try {
    const exist = await DefenseTask.findOne({ name: ctx.request.body.name })
    const entity = ctx.request.body
    if (exist) {
      ctx.throw(500, { code: 500, message: '任务名称已存在' })
    }
    if (!entity.points.length) {
      ctx.throw(500, { code: 500, message: '请选择布控点位' })
    }
    const defense = await DefenseTask.find({}).lean()
    if (isOccupyPoint(entity, defense)) {
      ctx.throw(500, { code: 500, message: '布控任务点位冲突' })
    }
    // 创建新的布控。已选择的点位布控底库参数发生变化。对应选择的点位使用新的布控参数
    const message = { type: 'task', removeResources: entity.points, newResources: entity.points }
    await singleton.dynamicHandleSocket(message)
    const doc = await DefenseTask.create(entity)
    // 某个视频加入布控任务后，添加报警级别level为1，和时间模板alarmTimeTemplate为全天24小时,报警管理中使用
    const alarmTimeTemplate = await AlarmTimeTemplate.findOne({ name: '全天24小时' })
      .lean()
      .exec()
    const updateObj = {
      level: 1,
      alarmtemplate: alarmTimeTemplate._id
    }
    await Resource.updateMany({ _id: { $in: entity.points } }, updateObj)
    ctx.status = 201
    ctx.body = doc._id
  } catch (error) {
    handleSysException(error)
  }
}

exports.del = async ctx => {
  try {
    const ids = ctx.request.body.ids
    let resIds = []
    const tasks = await DefenseTask.find({ _id: { $in: ids } }, 'points').lean()
    tasks.forEach(item => {
      resIds = resIds.concat(item.points.map(point => point.toString()))
    })
    const message = { type: 'task', removeResources: resIds, newResources: resIds }
    await singleton.dynamicHandleSocket(message)
    await DefenseTask.deleteMany({ _id: { $in: ids } })
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.update = async ctx => {
  try {
    const exist = await DefenseTask.findOne({ name: ctx.request.body.name, _id: { $ne: ctx.params.id } })
    const entity = ctx.request.body
    if (exist) {
      ctx.throw(500, { code: 500, message: '任务名称已存在' })
    }
    const defense = await DefenseTask.find({ _id: { $ne: ctx.params.id } }).lean()
    if (isOccupyPoint(entity, defense)) {
      ctx.throw(500, { code: 500, message: '布控任务点位冲突' })
    }
    const message = { type: 'task', removeResources: [], newResources: [] }
    const doc = await DefenseTask.findById(ctx.params.id).lean()
    await DefenseTask.findByIdAndUpdate(ctx.params.id, entity).lean()
    const usedResources = doc.points.map(item => item.toString())
    const newlyResources = entity.points
    message.removeResources = message.newResources = _.union(newlyResources, usedResources)
    // 布控配置布控底库发生变化，断开已使用与已选择的并集资源全部断开[视频流资源链接]，然后重建并集连接。保证不丢失链接
    if (!_.isEqual(doc.groups, entity.groups)) {
      await singleton.dynamicHandleSocket(message)
    } else {
      // 布控配置布控参数发生变化，所有连接断开[视频流资源链接]
      if (!_.isEqual(doc.cameraCfg, entity.cameraCfg)) {
        await singleton.dynamicHandleSocket(message)
      } else {
        // 布控配置资源发生变化，增加新连接，断开去除的连接.
        await singleton.dynamicHandleSocket(message)
      }
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 查找已经布控的点位，如果长期布控或者布控时间有重叠则提示。
const isOccupyPoint = (body, tasks) => {
  const hashPoints = {}
  body.points.forEach(point => (hashPoints[point] = true))
  for (let item of tasks) {
    item.points = item.points.map(point => point.toString())
    for (let point of item.points) {
      if (hashPoints[point]) {
        if (item.always || !(item.startTime > body.endTime || item.endTime < body.startTime)) {
          return true
        }
      }
    }
  }
  return false
}

exports.updatePatch = async ctx => {
  try {
    let resIds = []
    const tasks = await DefenseTask.find({ _id: { $in: ctx.request.body.ids } }, 'points').lean()
    tasks.forEach(item => {
      resIds = [...resIds, ...item.points]
    })
    const message = { type: 'task', removeResources: resIds, newResources: resIds }
    await singleton.dynamicHandleSocket(message)
    await DefenseTask.updateMany({ _id: { $in: ctx.request.body.ids } }, { vaild: ctx.request.body.vaild })
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 机构资源树(已分配)
exports.getTree = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取机构资源树'))
  try {
    const oid = ctx.query.oid
    let allChildrenIds = [] // 该机构的所有子机构
    const [allorg, rootorg] = await Promise.all([
      Org.find(
        {
          type: ctx.query.orgtype || ORG_TYPE.LOCALE
        },
        '_id name pid order'
      )
        .sort({ order: -1 })
        .lean()
        .exec(),
      Org.findOne({
        type: ctx.query.orgtype || ORG_TYPE.LOCALE,
        isroot: true
      })
        .lean()
        .exec()
    ])
    if (!oid) {
      allChildrenIds = getChildren(allChildrenIds, allorg, rootorg._id + '')
      allChildrenIds.unshift(rootorg._id + '')
    } else {
      allChildrenIds = getChildren(allChildrenIds, allorg, oid)
      allChildrenIds.unshift(oid)
    }
    const svrs = await FaceServer.find({}, 'res')
      .populate('res')
      .lean()
      .exec()
    let reses = []
    svrs.forEach(svr => {
      reses = [...reses, ...svr.res]
    })
    const resIds = reses.map(item => item._id + '')
    let orgReses = await OrgRes.find(
      {
        islane: false,
        resource: {
          $in: resIds
        },
        rootorg: rootorg._id
      },
      'resource org'
    )
      .sort('name')
      .lean()
      .exec()
    const [orgResHash, resHash] = [{}, {}]
    reses.forEach(item => (resHash[item._id] = item))
    orgReses.forEach(item => {
      !orgResHash[item.org + ''] && (orgResHash[item.org + ''] = [])
      if (resHash[item.resource + '']) {
        orgResHash[item.org + ''] = [...orgResHash[item.org + ''], resHash[item.resource + '']]
      }
    })
    const resultRes = allorg.map(item => {
      if (!item.children) {
        item.children = []
      }
      item.children = orgResHash[item._id + '']
      return item
    })
    ctx.body = transData2Tree(resultRes, '_id', 'pid', true).pop()
  } catch (err) {
    handleSysException(err)
  }
}
