/**
 * 存储路径路由
 * @time:207-6-19
 * @author:hansen
 */
'use strict'

const router = require('koa-router')()
const controller = require('./storage.controller')
require('../meditor.subscribe')

router.get('/', controller.index)
router.put('/', controller.batchUpdate)

module.exports = router
