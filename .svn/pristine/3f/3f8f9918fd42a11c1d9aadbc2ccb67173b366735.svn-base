/*
 * @Author: linhang
 * @Date: 2018-09-20 16:36:58
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-10-25 15:52:42
 */
'use strict'
const router = require('koa-router')()
const controller = require('./alarmLog.controller')
const BackUpController = require('./backup.controller')

router.get('/all', controller.getAllAlarms) // 地图中获取每种类型（6种）报警，包括2D和3D
router.get('/', controller.getAlarmLog) // 获取报警数据
router.put('/', controller.getAlarms) // 获取7种报警数据2.0
router.put('/count', controller.getAlarmCount) // 获取7种报警数据2.0
router.get('/alarmRemark/:id', controller.getAlarmRemark) // 获取某条报警备注信息
router.put('/alarmRemark/:id', controller.putAlarmRemark) // 添加某条报警备注信息
router.get('/wallConfig', controller.getWallConfig) // 报警处理根据通道id获取电视墙配置

router.get('/backup/:id', BackUpController.backup)
router.get('/download/:id', BackUpController.download)
router.get('/backup/:id/status', BackUpController.status)
module.exports = router
