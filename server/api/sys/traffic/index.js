/*
 * @Author: chenkaibo
 * @Date: 2018-07-27 11:47:11
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-08-28 17:53:37
 */
'use strict'
const router = require('koa-router')()
const TrafficController = require('./traffic.controller')
const VerificationController = require('./verification.controller')

router.get('/servercfg', TrafficController.getServerCfg) // 获取服务器地址
router.post('/servercfg', TrafficController.editServerCfg) // 配置服务器地址
// router.get('/alarmcfg', TrafficController.getAlarmCfg) // 获取报警配置
// router.post('/alarmcfg/batch', TrafficController.batchAlarmCfg) // 批量配置报警配置
router.get('/lane', TrafficController.getLaneList) // 获取服务器机构下的所有车道信息
router.put('/lane', TrafficController.updateLane) // 修改
router.get('/server', TrafficController.index) // 获取智能交通服务器列表
router.post('/server', TrafficController.create) // 创建智能交通服务器
router.get('/server/:id', TrafficController.get) // 获取智能交通服务器信息
router.put('/server/:id', TrafficController.update) // 修改智能交通服务器
router.delete('/server/:id', TrafficController.remove) // 删除智能交通服务器
router.get('/server/:id/sync', TrafficController.sync) // 同步智能交通服务器组织及设备

router.get('/server/verification/list', VerificationController.show)
router.put('/server/verification/edit/:id', VerificationController.update)

module.exports = router
