'use strict'

const router = require('koa-router')()
const controller = require('./alarm.controller')

router.get('/dev/status', controller.getDeviceStatus) // 获取单个设备的报警状态
router.get('/', controller.getAlarmTypes) // 获取报警类型
router.put('/arm', controller.arm) // 布防
router.put('/disarm', controller.disarm) // 撤防
router.put('/clean', controller.alarmClean) // 报警清除
router.put('/bypass', controller.bypass) // 旁路
router.put('/pass', controller.pass) // 撤旁
router.get('/:id/status', controller.getResourceStatusByRid) // 获取单个资源的报警状态
router.get('/resource', controller.getResourceByEid) // 获取报警资源
router.get('/action', controller.getActionVideoByRes) // 根据资源获取联动
module.exports = router
