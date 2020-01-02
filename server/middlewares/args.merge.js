/**
 * 将请求的query数据解析到一个ctx.query.search（不包含后面的分页数据）中，将page+limit解析到ctx.query.page中
 */
const _ = require('lodash')

const mergeArgs = async (ctx, next) => {
  _.assign(ctx.query, {
    search: {}
  })
  for (var key in ctx.query) {
    if (key !== 'search' && key !== 'page' && key !== 'limit' && key !== 'access_token' && key !== 'callback') {
      ctx.query.search[key] = ctx.query[key]
    }
  }
  _.merge(ctx.query, {
    page: {
      page: ctx.query.page || 1,
      limit: ctx.query.limit || 10
    }
  })
  if (ctx.query.limit) { delete ctx.query.limit }
  await next()
}

module.exports = mergeArgs
