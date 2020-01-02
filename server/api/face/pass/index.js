/**
 * 人脸查询路由
 * @time:207-6-17
 * @author:hansen
 */
'use strict'

const router = require('koa-router')()
const controller = require('./statistics.controller')
const tool = require('../../../common/tools')
router.get('/statistics/contrast', controller.contrast)
router.get('/statistics/today', controller.today)
router.get('/server', controller.get)
router.put('/server', async (ctx, next) => {
  tool.injectLogToCtx(ctx, 'human.pass.update')
  await next()
}, controller.update)
module.exports = router
