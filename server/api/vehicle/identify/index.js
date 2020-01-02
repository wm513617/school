'use strict'

const router = require('koa-router')()
const controller = require('./vehicleIdentify.controller')

router.post('/', controller.create) // 创建车辆识别信息
router.get('/', controller.index) // 获取车辆识别信息
router.get('/info', controller.info) // 获取车辆识别信息
router.post('/copy2veh', controller.copy2veh) // 识别信息移动到车辆管理

module.exports = router
