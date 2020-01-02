/*
 * @Description: 视频结构化服务器配置
 * @Author: wanglei
 * @Date: 2019-06-26 14:33:59
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-26 11:02:48
 */
'use strict'
const koaBody = require('koa-body')({
  multipart: true
})

const router = require('koa-router')()
const controller = require('./structureServer.controller')

router.get('/', controller.getAllServers) // 获取所有结构化服务器
router.get('/:id', controller.getServer) // 获取单个结构化服务器
router.post('/', controller.addServer) // 添加结构化服务器
router.put('/:id', controller.updateServer) // 修改单个结构化服务器
router.delete('/:id', controller.deleteServer) // 删除单个结构化服务器
router.post('/batchDelete', controller.batchDeleteServers) // 批量删除结构化服务器
router.post('/batchStartWeb', controller.batchStartWeb) // 批量启动视频结构化分析服务
router.post('/batchStopWeb', controller.batchStopWeb) // 批量停止视频结构化分析服务

router.get('/:id/export', controller.export) // 导出授权文件
router.post('/:id/import', koaBody, controller.import) // 导入授权文件

router.get('/:id/syncTask', controller.syncTask) // 同步布控任务

router.get('/status/monitor', controller.getMonitorData) // 获取结构化服务器的计算状态数据

module.exports = router
