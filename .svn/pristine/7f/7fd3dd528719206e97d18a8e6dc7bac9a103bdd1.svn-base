/*
 * 区域统计路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:42:40
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-09 16:11:28
 */

'use strict'

const router = require('koa-router')()
const controller = require('./zone.controller')
// const auth = require('../../../auth/auth.service')

router.get('/tree', controller.getNewTree)
// router.get('/statistic', controller.statistic)      // 任意区域的统计
router.post('/statistic', controller.statistic) // 任意区域的统计
router.post('/statistic/resource', controller.statisticResource) // 统计区域内的资源
router.post('/statistic/resource/area/count', controller.statisticResourceCount) // 统计区域内各资源类型的数量
router.get('/all', controller.getAllResourceNum) // 根据地图id获取地图下所有的资源数量
router.get('/resource', controller.getAllResource) // 根据地图id获取地图下所有的资源数量
router.get('/statistics/allresource', controller.getAllResources) // 根据地图id获取地图下所有的资源及单兵等数量
router.get('/statistics/alarm', controller.getAllAlarm) // 根据地图id获取地图下所有的报警数量
module.exports = router
