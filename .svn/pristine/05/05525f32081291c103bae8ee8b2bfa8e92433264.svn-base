/*
 * @Description: 视频结构化统计分析
 * @Author: wanglei
 * @Date: 2019-07-04 16:32:15
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-07-24 17:54:26
 */
'use strict'

const router = require('koa-router')()
const controller = require('./statistic.controller')

router.get('/today', controller.statisticToday) // 获取今日统计数据
router.get('/analyz', controller.statisticAnalyz) // 获取统计分析
router.get('/export', controller.export) // 导出统计分析

module.exports = router
