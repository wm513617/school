/**
 * 解析北京token中的payload
 */
const _ = require('lodash')

const tokenResolve = async (ctx, next) => {
  // white list directly pass
  // if (config.whiteList.indexOf(ctx.path) !== -1 || /^\/api\/auth.*/.test(ctx.path)) {
  //   await next()
  // } else {
  if (ctx.headers.authorization) {
    ctx.headers.authorization = ctx.headers.authorization.replace(/Bearer /, '')
  }
  try {
    if (
      (ctx.headers.authorization && ctx.headers.authorization + '' !== 'undefined') ||
      (ctx.query.access_token && ctx.query.access_token + '' !== 'undefined')
    ) {
      const decodedstr = Buffer.from((ctx.headers.authorization || ctx.query.access_token).split('.')[1], 'base64')
      const payload = JSON.parse(decodedstr.toString())
      ctx.state.user = _.merge({}, payload)
    } else {
      // ctx.throw(500, { code: 500, message: '无访问权限' })
    }
  } catch (err) {
    console.log(err)
    throw err
  }
  await next()
}
// }

module.exports = tokenResolve
