/**
 * 人员布控路由
 * @time:207-6-17
 * @author:hansen
 */
'use strict'

const router = require('koa-router')()
const controller = require('./roster.controller')
const tool = require('../../../common/tools')

router.get('/idNumber', controller.checkIdNumber)
router.get('/:id', controller.get)
router.put('/:id', async (ctx, next) => {
  tool.injectLogToCtx(ctx, 'human.roster.update')
  await next()
}, controller.update)
router.delete('/:id', async (ctx, next) => {
  tool.injectLogToCtx(ctx, 'human.roster.remove')
  await next()
}, controller.remove)
router.post('/', async (ctx, next) => {
  tool.injectLogToCtx(ctx, 'human.roster.create')
  await next()
}, controller.create)
router.get('/', controller.index)

module.exports = router
