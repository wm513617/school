'use strict'

var FireArea = require('mongoose').model('FireArea')
var FireConf = require('mongoose').model('FireConf')
var paging = require('../paging')
// 列表
exports.index = async (ctx, next) => {
  const search = ctx.query.search
  const orgId = ctx.params.orgId
  if (search.name) { search.name = /search.name/ }
  search.org = orgId
  const results = await paging.listQuery(FireArea, search, '-doorActions -videoAction', { _id: -1 }, ctx.query.page, { path: 'resource', select: 'name' }, ctx)
  ctx.body = results.results
}

exports.getFireplanConf = async (ctx) => {
  const result = await FireConf.findOne().exec()
  ctx.body = result
}
exports.fireplanConf = async (ctx) => {
  const postData = ctx.request.body
  const fireConf = await FireConf.findOne().exec()
  const result = await FireConf.findByIdAndUpdate(fireConf._id, postData)
  ctx.body = result
}

exports.add = async (ctx) => {
  const postData = ctx.request.body
  const orgId = ctx.params.orgId
  const createArr = []
  postData.forEach(n => {
    createArr.push({ resource: n, org: orgId })
  })
  const result = await FireArea.create(createArr)
  ctx.body = result
}

// 设置
exports.settingUpdate = async (ctx) => {
  const postData = ctx.request.body
  const id = ctx.params.id
  // const createArr = []
  // postData.forEach(n => {
  //   const id = n._id
  //   delete n._id
  //   createArr.push(FireArea.findByIdAndUpdate(id, n))
  // })
  // const result = await FireArea.updateMany(createArr)
  // const result = await FireArea.findByIdAndUpdate(id, postData)
  const result = await FireArea.findOneAndUpdate({ resource: id }, postData, { upsert: true })
  ctx.body = result
}

// 根据id 获取设置详情
exports.getSetting = async (ctx) => {
  const id = ctx.params.id
  const result = await FireArea.findOne({ resource: id }, '-org -resource').populate([{ path: 'videoAction.resource', select: 'name' }, { path: 'videoAction.org', select: 'name' }]).exec()
  ctx.body = result
}

// 批量删除
exports.delBatch = async (ctx) => {
  const ids = ctx.request.header['x-bsc-ids'].split(',') || []
  ctx.body = await FireArea.deleteMany({ _id: { $in: ids } })
}
