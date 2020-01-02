/**
 * Error responses
 */

'use strict'

const router = require('koa-router')()

async function pageNotFound (ctx, next) {
  const viewFilePath = '404'
  const statusCode = 404
  ctx.status = statusCode
  await ctx.render(viewFilePath)
}

// 404 file
router.get('/*', pageNotFound)

module.exports = router
