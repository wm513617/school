module.exports = async (ctx, next) => {
  if (ctx.method === 'GET') {
    ctx.set('Cache-Control', 'no-store')
  }
  await next()
}
