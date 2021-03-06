/*
 * @Description: 人员通行数据统计模块
 * @Author: wanglei
 * @Date: 2019-08-20 11:36:19
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-22 15:02:27
 */
'use strict'

const router = require('koa-router')()
const controller = require('./statistic.controller')

router.get('/today', controller.statisticToday) // 获取今日统计数据
router.post('/passData', controller.getPassData) // 获取机构层级的统计数据
router.post('/analyz', controller.statisticAnalyz) // 获取统计分析
router.get('/tree', controller.getTreeDepth) // 获取机构树层级
module.exports = router
