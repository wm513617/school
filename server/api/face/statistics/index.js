/**
 * 统计查询路由
 * @time:207-6-17
 * @author:hansen
 */
'use strict'

const router = require('koa-router')()
const controller = require('./statistics.controller')
require('../service/face.runtime')()
// require('../../bstar/alarm.websocket')
require('../schedule/schedule.statistic')

router.get('/contrast', controller.contrast)
router.get('/export', controller.contrastExport)
router.get('/trend', controller.trend)
router.get('/outline', controller.outline)
router.get('/feature', controller.feature)
router.get('/today', controller.today)
router.get('/outin', controller.outin)
router.get('/intelligence', controller.intelligence)
router.get('/data', controller.data)
module.exports = router
