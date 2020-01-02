/**
 * 权限验证中间件
 */
const jwt = require('jsonwebtoken')
const User = mongoose.model('User')
const config = require('../../config').backend
const whiteList = require('./whiteList')
const auth = async (ctx, next) => {
  try {
    if (whiteList.indexOf(ctx.originalUrl) !== -1 || whiteList.indexOf(ctx.originalUrl.split('?')[0]) !== -1) {
      await next()
    } else {
      const auth = ctx.headers.authorization.replace(/Bearer /, '')
      const data = jwt.verify(auth, config.secrets.session)
      const user = await User.findById(data._id)
        .lean()
        .exec()
      if (!user) {
        ctx.status = 401
        ctx.body = '无访问权限！'
      }
      ctx.state.user = data
      await next()
    }
  } catch (err) {
    ctx.status = 401
    ctx.body = '无访问权限！'
  }
}

module.exports = auth
