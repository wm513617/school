/**
 * 录像计划控制器
 * @time:207-6-17
 * @author:hansen
 */
const Record = require('mongoose').model('Record')
const paging = require('../../../paging')
const _ = require('lodash')
const notice = require('../../../bstar/video.interface')
const handleSysException = require('../../../../common/tools').handleSysException
const fileds = 'enable takeType streamType planTemplateId resource'

// 获取所有录像计划分页
exports.index = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-获取定时|事件录像计划配置'))
  const search = ctx.query.search
  const paganation = ctx.query.page
  try {
    const result = await paging.listQuery(
      Record,
      search,
      fileds,
      {},
      paganation,
      { path: 'planTemplateId', select: 'name' },
      ctx
    )
    if (_.isNull(result)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 4107)
  }
}

// 批量更新录像计划记录
exports.batchUpdate = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-创建/更新定时|事件录像计划配置'))
  const collection = ctx.request.body
  try {
    // 监控录像文档集合是否发生变化
    const result = await inspectDiff(collection, Record)
    for (const entity of collection) {
      await Record.update({ resource: entity.resource, takeType: entity.takeType }, entity, { upsert: true })
    }
    // 如果录像文档集合发生变化通知存储服务器更新
    if (result) {
      const module = _.get(collection, '[0].takeType') === 'timeVideo' ? 'plantimerecord' : 'planeventrecord'
      notice.info(ctx, { module, newData: [], varyData: [] }).catch(err => {
        console.log({ code: 4106, message: 'bstar资源配置通知接口异常' }, err.message)
      })
    }
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 4109, '数据验证错误，请检查数据是否正确')
  }
}

const inspectDiff = async (data, Model) => {
  const keep = []
  // 过滤数据中已存在与新建的数据
  for (const item of data) {
    if (!_.hasIn(item, '_id')) {
      return true
    }
    keep.push(item)
  }
  // 处理所有已经的数据
  const result = await Model.find({ _id: { $in: _.map(keep, '_id') } }).lean()
  for (const item of keep) {
    const target = _.find(result, doc => doc._id.toString() === item._id)
    if (
      item.enable !== target.enable ||
      item.streamType !== target.streamType ||
      item.planTemplateId !== target.planTemplateId.toString()
    ) {
      return true
    }
  }
  return false
}
