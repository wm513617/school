/**
 * 抓图计划控制器
 * @time:207-6-17
 * @author:hansen
 */
const Snapshot = require('mongoose').model('Snapshot')
const paging = require('../../../paging')
const _ = require('lodash')
const handleSysException = require('../../../../common/tools').handleSysException
const fileds = 'enable  timePlanTemplateId  eventPlanTemplateId resource'

// 获取所有抓图计划分页 { path: 'timePlanTemplateId timePlanTemplateId', select: 'name' }
exports.index = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-获取抓图计划配置'))
  const search = ctx.query.search
  const paganation = ctx.query.page
  try {
    const result = await paging.listQuery(Snapshot, search, fileds, {}, paganation, { path: 'timePlanTemplateId eventPlanTemplateId', select: 'name' }, ctx)
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 4101, message: '找不到请求的服务资源' })
    } else {
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 4107)
  }
}

// 批量更新抓图计划记录
exports.batchUpdate = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('录像管理-创建/更新抓图计划配置'))
  const collection = ctx.request.body
  try {
    for (const entity of collection) {
      await Snapshot.update({ resource: entity.resource }, entity, { upsert: true })
    }
    ctx.status = 200
    ctx.body = []
  } catch (err) {
    handleSysException(err, 4109, '数据验证错误，请检查数据是否正确')
  }
}
