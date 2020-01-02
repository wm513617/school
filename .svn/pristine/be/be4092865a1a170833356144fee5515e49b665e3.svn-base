/*
 * 运维管理路由
 * @Author: lushengying
 * @Date: 2018-08-29 10:54:45
 * @Last Modified by: dfk
 * @Last Modified time: 2019-06-19 09:06:17
 */

'use strict'

const router = require('koa-router')()
const controller = require('./operation.controller')
const configController = require('./config/opeconfig.controller')
router.get('/opsIp', controller.getOpsIp) // 获取新运维ip
router.get('/device', controller.getAll) // 查询设备监测列表
router.get('/device/details', controller.getDetails) //  查询设备详情
router.get('/counts', controller.counts) // 获取设备列表
// router.get('/video', controller.video) // 获取录像列表
router.get('/video', controller.videoFeke) // 获取录像列表 虚拟接口
// router.get('/video/details', controller.videoDetails) // 获取录像列表
router.get('/video/details', controller.videoDetailsFeke) // 获取录像列表 虚拟接口
// router.get('/video/analysis', controller.videoAnalysis) // 获取录像分析列表
router.get('/video/analysis', controller.videoAnalysisFeke) // 获取录像分析列表 虚拟接口
// router.get('/videoExport', controller.videoExport) // 获取视频导出
router.get('/videoExport', controller.videoExportFeke) // 获取视频导出 虚拟接口
router.get('/statistics', controller.statistics) // 获取资产统计图标
router.get('/deviceExport', controller.deviceExport) // 获取设备导出
router.get('/logs', controller.logs) // 获取日志列表
router.get('/logExport', controller.logExport) // 获取日志导出
router.get('/logInfo/:id/:diagnid', controller.videoInfo) // 获取日志详情
router.get('/assets', controller.assets) //  资产列表
router.get('/assetsExport', controller.assetsExport) //  资产列表导出
router.get('/config/list', configController.getAll) //  运维单位列表
router.post('/config', configController.createMaint) //  添加运维配置
router.get('/config/:id', configController.getInfo) //  运维单位详情
router.delete('/config/:id', configController.delete) //  删除运维配置
router.put('/config/:id', configController.update) //  编辑运维配置
router.get('/assets/:id/:numtype', controller.assetsInfo) //  资产详情
router.put('/assets/:id', controller.assetsUpdate) //  资产更新
router.post('/maintenance', controller.maintenance) //  批量更新维保单位

module.exports = router
