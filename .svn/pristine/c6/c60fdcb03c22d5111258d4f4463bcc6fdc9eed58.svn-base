/*
 * 地图配置110呼叫中心服务器配置
 * @Author: linhang
 * @Date: 2019-07-15 16:26:09
 * @Last Modified by: linhang
 * @Last Modified time: 2019-08-13 18:19:30
 */

'use strict'

const router = require('koa-router')()
const controller = require('./serverConfig.controller')

router.get('/', controller.getServer) // 获取服务器信息
router.post('/', controller.createOrUpdateServer) // 增加/修改服务器
router.get('/phone', controller.getTelephones) // 获取坐席列表
router.post('/phone', controller.createTelephone) // 新增坐席
router.put('/phone/:id', controller.updateTelephone) // 修改坐席
router.delete('/phone/:id', controller.deleteTelephone) // 删除坐席
router.post('/dial', controller.dial) // 拨打电话
router.post('/hangup', controller.hangup) // 挂断电话
router.get('/queue', controller.getQueueNames) // 获取坐席组名列表

module.exports = router
