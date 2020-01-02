/*
 * @Author: linhang
 * @Date: 2019-07-25 15:39:55
 * @Last Modified by: linhang
 * @Last Modified time: 2019-10-25 11:30:53
 */
'use strict'
const router = require('koa-router')()
const controller = require('./peopleVehicle.controller')

router.post('/realTime', controller.realTime) // 实时过车数据接收
router.get('/pass', controller.historyPassVehicle) // 进入人车同检页面查询最近的16条过车数据
router.get('/check', controller.historyVehicleCheck) // 进入人车同检页面右侧检查结果查询当日最近的16条过车数据
router.get('/location', controller.getLocation) // 获取人车同检所有车道名称
router.get('/failCount', controller.getCheckFailCount) // 获取人车同检当天核验失败次数

module.exports = router
