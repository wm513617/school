/*
 * @Description: 视频结构化服务器机构资源
 * @Author: wanglei
 * @Date: 2019-06-26 10:54:58
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-01 10:53:33
 */
'use strict'

const router = require('koa-router')()
const controller = require('./structure.controller')

router.get('/resource', controller.getVideoResource) // 获取视频结构化的视频资源
router.get('/resource/:id', controller.getOneVideoResource) // 获取单个视频结构化的视频资源

router.post('/resource/zone', controller.zoneResource) // 框选功能获取结构化的视频资源
router.get('/resource/zone/all', controller.getZoneResourceAll) // 结构化追踪获取全部视频资源

router.get('/tree', controller.getTree) // 获取机构资源树

router.delete('/resource/unbind', controller.batchUnbindResource) // 批量解绑资源
router.post('/resource/batch/startanalyz', controller.batchStartAnalyz) // 批量启动视频通道分析
router.post('/resource/batch/stopanalyz', controller.batchStopAnalyz) // 批量关闭视频通道分析

module.exports = router
