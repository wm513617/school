/**
 * 录像计划路由
 * @time:207-6-19
* @author:hansen
 */
'use strict'

const router = require('koa-router')()
const controller = require('./inquiry.controller')

router.get('/conf', controller.inquiry)
router.get('/conf/export', controller.exportInquiry)
router.post('/conf', controller.batchConfig)
module.exports = router
