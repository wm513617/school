/*
 * 飞行漫游路由
 * @Author: wanglei
 * @Date: 2019-04-11 14:41:32
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-04-17 16:16:17
 */

'use strict'

const router = require('koa-router')()
const controller = require('./flight.controller')

router.get('/', controller.getAllFlights) // 获取所有飞行路线
router.get('/:id', controller.getOneFlight) // 获取单个飞行路线
router.put('/:id', controller.updateOneFlight) // 修改飞行路线
router.delete('/:id', controller.deleteOneFilght) // 删除单个飞行路线
router.post('/', controller.addOneFlight) // 添加飞行路线

module.exports = router
