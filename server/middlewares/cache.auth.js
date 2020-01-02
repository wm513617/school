/**
 * 获取用户权限数据，并将数据权限转化为资源-云台权限对象
 */
const userAuthCache = async (ctx, next) => {
  const user = ctx.state.user
  if (user) {
    if (!global.authCache) {
      global.authCache = {}
    }
    if (!global.authCache[user._id]) {
      const PropertyModel = require('mongoose').model('ResProperty')
      const authResArr = await PropertyModel.find({ role: user.role })
        .lean()
        .exec()
      const authDataMap = {}
      authResArr.map(item => {
        authDataMap[item.resource + ''] = item.properties
      })
      global.authCache[user._id] = authDataMap
    }
  }
  await next()
}
module.exports = userAuthCache
