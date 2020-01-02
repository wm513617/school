'use strict'
const Dict = require('mongoose').model('Dict')
const paging = require('../../paging')
var _ = require('lodash')

exports.index = async (ctx, next) => {
  const search = ctx.query.search
  try {
    const results = await paging.listQuery(Dict, search, '', {}, ctx.query.page, '', ctx)
    if (_.isEmpty(results)) {
      ctx.status = 408
      return
    }
    ctx.body = results.results
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 新增字典
 */
exports.create = async (ctx, next) => {
  // ctx.request.body = {
  //   code: 5,    // 代码
  //   name: '三轮车',    // 名称
  //   type: 'vehicle'    // 类型
  // }
  const newDict = new Dict(ctx.request.body)
  try {
    ctx.body = await newDict.save()
    ctx.status = 201
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}
/**
 * 更新字典
 */
exports.update = async (ctx, next) => {
  const id = ctx.params.id
  try {
    ctx.body = await Dict.findByIdAndUpdate(id, ctx.request.body)
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 删除字典
 */
exports.delete = async (ctx, next) => {
  const id = ctx.params.id
  try {
    ctx.body = await Dict.findByIdAndRemove(id)
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}

/**
 * 根据分类查询
 */
exports.findByType = async (ctx, next) => {
  const type = ctx.query.type
  try {
    ctx.body = await Dict.find({ type: type }, 'code name').exec()
  } catch (error) {
    return ctx.throw(500, { code: 4101, message: error.message })
  }
}
