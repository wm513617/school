/*
 * @Author: linhang
 * @Date: 2018-09-10 09:22:30
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-05-13 14:17:37
 */
'use strict'
const router = require('koa-router')()
const controller = require('./log.controller')

// 录像拷贝
router.get('/recode', controller.getRecode) // 获取录像拷贝日志列表
router.post('/recode', controller.createRecode) // 创建录像拷贝日志
router.put('/recode/:id', controller.updateRecode) // 修改录像拷贝日志
router.delete('/recode', controller.deleteRecode) // 删除录像拷贝日志

// 设备巡查
router.get('/devpatrol', controller.getdevPatrol) // 获取设备巡查列表
router.post('/devpatrol', controller.createdevPatrol) // 创建设备巡查
router.put('/devpatrol/:id', controller.updatedevPatrol) // 修改设备巡查
router.delete('/devpatrol', controller.deletedevPatrol) // 删除设备巡查

router.get('/device', controller.getDevice) // 删除设备巡查
router.get('/resource', controller.getResource) // 删除设备巡查

module.exports = router
