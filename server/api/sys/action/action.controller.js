const Action = require('mongoose').model('Action')
// var paging = require('../../paging')
const tool = require('../../../common/tools')

exports.index = async (ctx) => {
  // try {
  //   const results = await paging.listQuery(Action, ctx.query.search, '', {_id: -1}, ctx.query.page, '', ctx)
  //   ctx.body = results.results
  // } catch (err) {
  //   return ctx.throw(500, {code: 2101, message: err.message})
  // }
  const datas = await Action.find({}).sort({ order: '-1' }).exec()
  ctx.body = tool.transData2Tree(JSON.parse(JSON.stringify(datas)), '_id', 'pid')
}

exports.add = async (ctx) => {
  const newDatas = ctx.request.body
  const checkOder = await Action.findOne().sort({ 'order': -1 }).exec()
  newDatas.order = checkOder.order + 1
  const result = await Action.create(newDatas)
  ctx.body = result
}

exports.update = async (ctx) => {
  const id = ctx.params.id
  const result = await Action.findByIdAndUpdate(id, ctx.request.body).exec()
  ctx.body = result
}

exports.del = async (ctx) => {
  const id = ctx.params.id
  const result = await Action.findByIdAndRemove(id).exec()
  ctx.body = result
}
