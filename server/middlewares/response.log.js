/**
 * 日志输出中间件
 */
// const logUtil = require('../common/log.util')
// const logs = require('../api/log/log.controller')

const responseLog = async (ctx, next) => {
  // 响应开始时间
  // const start = new Date()
  // 响应间隔时间
  // let ms
  try {
    // 开始进入到下一个中间件
    await next()
    // 设置所有get请求头不缓存
    if (ctx.method === 'GET') {
      ctx.set('Cache-Control', 'no-cache')
    } else if (ctx.originalUrl !== '/api/vehicle/identify') {
      // 若不是get添加正常操作
      // if (ctx.state.user) { await addOperateLog(ctx) }
    }
    delete ctx.loginfo
    // ms = new Date() - start
    // 记录响应日志
    // logUtil.logResponse(ctx, ms)
  } catch (error) {
    // 添加日志表
    // await addErrorLog(ctx, error)
    // ms = new Date() - start
    // 记录异常日志
    // logUtil.logError(ctx, error, ms)
    ctx.status = error.status || 500
    ctx.body = {
      code: error.code,
      message: error.message
    }
  }
}

/**
 * 添加错误日志
 * @param {*} ctx 上下文对象
 * @param {*} error 错误信息
 */
// const addErrorLog = async (ctx, error) => {
//   const modelstr = decodeURI(ctx.response.header.loginfo)
//   if (modelstr) {
//     const modelName = modelstr.split('-')[0]
//     if (error.type) {
//       // 系统日志
//       await logs.addsystem({
//         msg: error.message,
//         ipsource: ctx.ip
//       })
//     }
//     // 操作日志
//     await logs.addOperate({
//       info: error.message,
//       role: ctx.state.user.role,
//       user: ctx.state.user.user,
//       tasktype: modelName,
//       ipSource: ctx.ip
//     })
//   }
//   ctx.remove('loginfo')
// }

/**
 * 添加操作日志
 * @param {*} ctx 上下文对象
 */
/* const addOperateLog = async ctx => {
  const modelstr = decodeURI(ctx.response.header.loginfo)
  if (modelstr) {
    const modelArr = modelstr.split('-')
    const modelName = modelArr[0] || ''
    const FnName = modelArr[1] || '操作'
    await logs.addOperate({
      info: `${FnName}成功`,
      time: parseInt(new Date().getTime() / 1000),
      role: ctx.state.user.role,
      user: ctx.state.user.user,
      tasktype: modelName,
      ipsource: ctx.ip,
      reqBody: JSON.stringify(ctx.request.body),
      method: ctx.method,
      reqUrl: ctx.url
    })
  }
  ctx.remove('loginfo')
} */

module.exports = responseLog
