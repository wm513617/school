/**
 * 通用查询控制器
 * @time:207-6-17
 * @author:hansen
 */

const mongoose = require('mongoose')
const Org = mongoose.model('Org')
const OrgRes = mongoose.model('OrgRes')
const Resource = mongoose.model('Resource')
const Storage = mongoose.model('Storage')
const Record = mongoose.model('Record')
const Snapshot = mongoose.model('Snapshot')
const paging = require('../../../paging')
const notice = require('../../../bstar/video.interface')
const _ = require('lodash')
const { handleSysException, getChildren } = require('../../../../common/tools')

// 获取所有录像计划分页
exports.inquiry = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-获取录像配置'))
  const search = ctx.query.search
  const paganation = ctx.query.page
  const resIds = []
  let result = []
  let resouces, model, selection
  try {
    // 判断当前查询文档集合类型，如果没有则抛出错误
    switch (search.collection) {
      case 'storage':
        model = Storage
        selection = 'server path resource'
        break
      case 'time':
      case 'event':
        model = Record
        selection = 'enable streamType planTemplateId resource'
        break
      case 'snapshot':
        model = Snapshot
        selection = 'enable timePlanTemplateId eventPlanTemplateId resource'
        break
      default:
        model = null
    }
    if (model === null) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    }
    // 获取视频类型通道
    let query = { type: 0 }
    if (!_.isEmpty(search.key)) {
      search.key = search.key.replace(/\./g, '\\.')
      query = { $or: [{ name: { $regex: search.key } }, { ip: { $regex: search.key } }] }
    }
    const orgId = search.org
    const orgs = await Org.find({ type: 0 }, 'name pid isroot')
      .sort('order')
      .lean()
    let org = []
    // 查找设备 (recursion=1查找当前节点及子节点|recursion=0查找当前节点)
    // if (search.recursion === '1') {
    //   org = getChildren(org, orgs, orgId)
    //   org.push(orgId)
    //   const orgRes = await OrgRes.find({ org: { $in: org } })
    //   orgRes.forEach((item) => {
    //     if (item.resource) {
    //       resIds.push(item.resource)
    //     }
    //   })
    // } else {
    //   const orgRes = await OrgRes.find({ org: orgId })
    //   orgRes.forEach((item) => {
    //     if (item.resource) {
    //       resIds.push(item.resource)
    //     }
    //   })
    // }
    // 过滤平台互联下联共享的其他平台资源。
    if (search.recursion === '1') {
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
      const orgRes = await OrgRes.find({ org: { $in: org }, shareServer: { $exists: false } })
      orgRes.forEach(item => {
        if (item.resource) {
          resIds.push(item.resource)
        }
      })
    } else {
      const orgRes = await OrgRes.find({ org: orgId, shareServer: { $exists: false } })
      orgRes.forEach(item => {
        if (item.resource) {
          resIds.push(item.resource)
        }
      })
    }

    // 视频通道资源
    query.type = 0
    resouces = await paging.listQuery(
      Resource,
      _.assign({ _id: { $in: resIds } }, query),
      '',
      { name: 1 },
      paganation,
      '',
      ctx
    )
    if (_.isNull(resouces.results)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      // 判断录像计划的 定时录像|事件录像
      const query = {}
      if (search.collection === 'time') {
        query.takeType = 'timeVideo'
      } else if (search.collection === 'event') {
        query.takeType = 'eventVideo'
      }
      // 查找当前页里资源对应的配置信息
      const resids = resouces.results.map(item => item._id.toString())
      const docs = await model.find(_.assign(query, { resource: { $in: resids } }), selection)
      result = resouces.results.map(item => {
        const conf = {
          name: item.name,
          status: item.status,
          ip: item.ip || '',
          resouceId: item._id.toString(),
          conf: {}
        }
        const doc = _.find(docs, doc => doc.resource.toString() === item._id.toString())
        conf.conf = doc || {}
        return conf
      })
      ctx.body = { result }
    }
  } catch (err) {
    handleSysException(err, 4107)
  }
}

exports.batchConfig = async (ctx, next) => {
  try {
    const body = ctx.request.body
    const params = { newData: [], varyData: [] }
    const data = []
    let [docs, docRes, nwres, resIds, org] = [[], [], [], [], []]
    if (_.isNil(body.recursion) || _.isNil(body.collection)) {
      ctx.throw(500, { code: 4201, message: '接口参数不完整' })
    }
    const orgId = body.org
    const orgs = await Org.find({ type: 0 }, 'name pid isroot')
      .sort('order')
      .lean()
    if (body.recursion === 1) {
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
      const orgRes = await OrgRes.find({ org: { $in: org }, shareServer: { $exists: false } })
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    } else {
      const orgRes = await OrgRes.find({ org: orgId, shareServer: { $exists: false } })
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    }
    const resouces = await Resource.find({ _id: { $in: resIds }, type: 0 }).lean()
    resIds = resouces.map(item => item._id.toString())
    if (body.collection === 'storage') {
      docs = await Storage.find({ resource: { $in: resIds } })
        .populate({ path: 'resource', populate: { path: 'eid' } })
        .lean()
      docRes = docs.map(item => item.resource._id.toString())
      nwres = _.difference(resIds, docRes)
      if (!_.isEmpty(nwres)) {
        const res = await Resource.find({ _id: nwres })
          .populate('eid')
          .lean()
        for (const rs of nwres) {
          data.push({ server: body.server, path: body.path, resource: rs })
          const target = _.find(res, doc => doc._id.toString() === rs)
          if (!_.isEmpty(target)) {
            params.newData.push({
              devIp: target.ip,
              channel: target.chan,
              dsServerId: body.server,
              devPort: target.eid.cport,
              path: body.path
            })
          }
        }
      }
      for (const doc of docs) {
        if (doc.path === body.path && doc.server === body.server) {
          continue
        }
        params.varyData.push({
          before: {
            devIp: doc.resource.ip,
            channel: doc.resource.chan,
            dsServerId: doc.server,
            devPort: doc.resource.eid.cport,
            path: doc.path
          },
          after: {
            devIp: doc.resource.ip,
            channel: doc.resource.chan,
            dsServerId: body.server,
            devPort: doc.resource.eid.cport,
            path: body.path
          }
        })
      }
      await Promise.all([
        Storage.update({ resource: { $in: docRes } }, { server: body.server, path: body.path }, { multi: true }),
        Storage.create(data)
      ])
      if (!_.isEmpty(params.newData) || !_.isEmpty(params.varyData)) {
        notice.info(ctx, _.merge({ module: 'recordcfg' }, params)).catch(err => {
          console.log({ code: 4106, message: 'bstar资源配置通知接口异常' }, err)
        })
      }
    } else if (body.collection === 'time' || body.collection === 'event') {
      docs = await Record.find({ resource: { $in: resIds }, takeType: body.takeType }).lean()
      docRes = docs.map(item => item.resource.toString())
      nwres = _.difference(resIds, docRes)
      for (const rs of nwres) {
        data.push({
          enable: body.enable,
          takeType: body.takeType,
          planTemplateId: body.planTemplateId,
          streamType: body.streamType,
          resource: rs
        })
      }
      await Promise.all([
        Record.update(
          {
            resource: { $in: docRes },
            takeType: body.takeType
          },
          {
            enable: body.enable,
            planTemplateId: body.planTemplateId,
            streamType: body.streamType
          },
          { multi: true }
        ),
        Record.create(data)
      ])
      const module = body.takeType === 'eventVideo' ? 'planeventrecord' : 'plantimerecord'
      notice.info(ctx, { module, newData: [], varyData: [] }).catch(err => {
        console.log({ code: 4106, message: 'bstar资源配置通知接口异常' }, err)
      })
    } else if (body.collection === 'snapshot') {
      docs = await Snapshot.find({ resource: { $in: resIds } }).lean()
      docRes = docs.map(item => item.resource.toString())
      nwres = _.difference(resIds, docRes)
      for (const rs of nwres) {
        data.push({
          enable: body.enable,
          timePlanTemplateId: body.timePlanTemplateId,
          eventPlanTemplateId: body.eventPlanTemplateId,
          resource: rs
        })
      }
      await Promise.all([
        Snapshot.update(
          { resource: { $in: docRes } },
          {
            enable: body.enable,
            timePlanTemplateId: body.timePlanTemplateId,
            eventPlanTemplateId: body.eventPlanTemplateId
          },
          { multi: true }
        ),
        Snapshot.create(data)
      ])
    }
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 4107)
  }
}

// 获取所有录像计划
exports.exportInquiry = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-获取录像配置'))
  const search = ctx.query.search
  const resIds = []
  let result = []
  let resouces, model, selection
  try {
    // 判断当前查询文档集合类型，如果没有则抛出错误
    switch (search.collection) {
      case 'storage':
        model = Storage
        selection = 'server path resource'
        break
      case 'time':
      case 'event':
        model = Record
        selection = 'enable streamType planTemplateId resource'
        break
      case 'snapshot':
        model = Snapshot
        selection = 'enable timePlanTemplateId eventPlanTemplateId resource'
        break
      default:
        model = null
    }
    if (model === null) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    }
    // 获取视频类型通道
    let query = { type: 0 }
    if (!_.isEmpty(search.key)) {
      search.key = search.key.replace(/\./g, '\\.')
      query = { $or: [{ name: { $regex: search.key } }, { ip: { $regex: search.key } }] }
    }
    const orgId = search.org
    const orgs = await Org.find({ type: 0 }, 'name pid isroot')
      .sort('order')
      .lean()
    let org = []
    // 查找设备 (recursion=1查找当前节点及子节点|recursion=0查找当前节点)
    // if (search.recursion === '1') {
    //   org = getChildren(org, orgs, orgId)
    //   org.push(orgId)
    //   const orgRes = await OrgRes.find({ org: { $in: org } })
    //   orgRes.forEach((item) => {
    //     if (item.resource) {
    //       resIds.push(item.resource)
    //     }
    //   })
    // } else {
    //   const orgRes = await OrgRes.find({ org: orgId })
    //   orgRes.forEach((item) => {
    //     if (item.resource) {
    //       resIds.push(item.resource)
    //     }
    //   })
    // }
    // 过滤平台互联下联共享的其他平台资源。
    if (search.recursion === '1') {
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
      const orgRes = await OrgRes.find({ org: { $in: org }, shareServer: { $exists: false } })
      orgRes.forEach(item => {
        if (item.resource) {
          resIds.push(item.resource)
        }
      })
    } else {
      const orgRes = await OrgRes.find({ org: orgId, shareServer: { $exists: false } })
      orgRes.forEach(item => {
        if (item.resource) {
          resIds.push(item.resource)
        }
      })
    }

    // 视频通道资源
    query.type = 0
    resouces = await Resource.find(_.assign({ _id: { $in: resIds } }, query), '_id name status ip')
      .sort({ name: 1 })
      .exec()
    if (_.isNull(resouces)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      // 判断录像计划的 定时录像|事件录像
      const query = {}
      if (search.collection === 'time') {
        query.takeType = 'timeVideo'
      } else if (search.collection === 'event') {
        query.takeType = 'eventVideo'
      }
      // 查找当前页里资源对应的配置信息
      const resids = resouces.map(item => item._id.toString())
      const docs = await model.find(_.assign(query, { resource: { $in: resids } }), selection)
      result = resouces.map(item => {
        const conf = {
          name: item.name,
          status: item.status,
          ip: item.ip || '',
          resouceId: item._id.toString(),
          conf: {}
        }
        const doc = _.find(docs, doc => doc.resource.toString() === item._id.toString())
        conf.conf = doc || {}
        return conf
      })
      ctx.body = { result }
    }
  } catch (err) {
    handleSysException(err, 4107)
  }
}
