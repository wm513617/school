/**
 * 存储路径控制器
 * @time:207-6-17
 * @author:hansen
 */

const Storage = require('mongoose').model('Storage')
const Resource = require('mongoose').model('Resource')
const paging = require('../../../paging')
const _ = require('lodash')
const notice = require('../../../bstar/video.interface')
const fileds = 'server resource path'
const handleSysException = require('../../../../common/tools').handleSysException

// 获取所有存储路径分页
exports.index = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-获取存储路径配置'))
  const search = ctx.query.search
  const paganation = ctx.query.page
  try {
    const result = await paging.listQuery(Storage, search, fileds, {}, paganation, '', ctx)
    if (_.isNull(result)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 4107)
  }
}
// 批量更新创建
exports.batchUpdate = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-创建|更新存储路径配置'))
  try {
    // 过滤提交数据中不完整的
    const store = ctx.request.body.filter(item => !_.has(item, ['resource', 'server', 'path']))
    // 对数进行分类，新建与变动
    const data = await findDiff(store, Storage)
    for (const entity of ctx.request.body) {
      await Storage.update({ resource: entity.resource }, entity, { upsert: true })
    }
    // 通知存储录像发生变动
    if (!_.isEmpty(data.newData) || !_.isEmpty(data.varyData)) {
      data.module = 'recordcfg'
      notice.info(ctx, data).catch(err => {
        console.log({ code: 4106, message: 'bstar资源配置通知接口异常' }, err.message)
      })
    }
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 4109, '数据验证错误，请检查数据是否正确')
  }
}

const findDiff = async (data, Model) => {
  const [collection, fresh, keep] = [{ newData: [], varyData: [] }, [], []]
  // 过滤数据中已存在与新建的数据
  data.forEach(item => (_.hasIn(item, '_id') ? keep.push(item) : fresh.push(item)))
  // 为新建数据查找对应的资源并生成发送格式
  if (!_.isEmpty(fresh)) {
    const res = await Resource.find({ _id: { $in: _.map(fresh, 'resource') } })
      .populate('eid')
      .lean()
    for (const item of fresh) {
      const target = _.find(res, doc => doc._id.toString() === item.resource)
      collection.newData.push({
        devIp: target.eid.ip,
        channel: target.chan,
        dsServerId: item.server,
        devPort: target.eid.cport,
        path: item.path
      })
    }
  }
  // 如果没有已经在数据，则直接返回
  if (_.isEmpty(keep)) {
    return collection
  }
  // 处理所有已经的数据
  const result = await Model.find({ _id: { $in: _.map(keep, '_id') } })
    .populate({ path: 'resource', populate: { path: 'eid' } })
    .lean()
  for (const item of keep) {
    const target = _.find(result, doc => doc._id.toString() === item._id)
    if (item.path === target.path && item.server === target.server) {
      continue
    }
    collection.varyData.push({
      before: {
        devIp: target.resource.eid.ip,
        channel: target.resource.chan,
        dsServerId: target.server,
        devPort: target.resource.eid.cport,
        path: target.path
      },
      after: {
        devIp: target.resource.eid.ip,
        channel: target.resource.chan,
        dsServerId: item.server,
        devPort: target.resource.eid.cport,
        path: item.path
      }
    })
  }
  return collection
}
