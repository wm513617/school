/**
 * 在app.use(router)之前调用
 */
const responseFormatter = async (ctx, next) => {
  // 先去执行路由
  await next()
  // 如果有返回数据，将返回数据添加到data中
  if (ctx.body) {
    ctx.body = {
      status: 1,
      data: ctx.body
    }
  } else {
    ctx.body = {
      status: 0,
      data: ''
    }
  }
}

module.exports = responseFormatter
