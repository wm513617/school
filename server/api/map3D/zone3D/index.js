/*
 * 区域统计路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:42:40
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2019-01-04 11:02:58
 */

'use strict'

const router = require('koa-router')()
const controller = require('./zone.controller')

router.get('/tree', controller.getTree) // 获取地图应用模式下的左侧区域树
router.post('/statistic', controller.statistic) // 任意区域的统计
router.post('/statistic/resource', controller.statisticResource) // 统计区域内的资源
router.get('/all', controller.getAllResourceNum) // 根据地图id获取地图下所有的资源数量
router.get('/resource', controller.getAllResource) // 根据地图id获取地图下所有的资源数量
module.exports = router
