/*
 * @Author: linhang
 * @Date: 2018-09-10 09:23:10
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-05 16:00:30
 */

'use strict'
const router = require('koa-router')()
const controller = require('./alarm.controller')

router.get('/remotedownload/status', controller.remoteStatus) // 当前服务器备份状态
router.get('/remotedownload/:id', controller.remoteDownload) // 开始服务器备份
router.delete('/remotedownload/:id', controller.removeFile) // 删除服务器备份
router.get('/capacity', controller.getCapacity) // 获取当前存储情况(磁盘大小)
router.get('/resource', controller.getAlarmResource) // 获取当前全部案件所属资源
router.get('/tree/:id', controller.getAlarmTree) // 获取当前全部案件名称
router.get('/tree', controller.getAlarmTreeName) // 通过案件id获取指定案件树结构
router.get('/export/:name', controller.exportZip) // 下载案件
router.get('/', controller.getAlarmEvent) // 获取接警事件列表
router.post('/', controller.create) // 新建接警事件
router.post('/handle/:id', controller.handleAlarm) // 处理接警事件
router.get('/history', controller.getAlarmHistory) // 获取历史接警事件
router.put('/:id', controller.update) // 修改接警事件
router.get('/:id', controller.getAlarmInfo) // 获取单个案件详情
router.delete('/', controller.delete) // 删除接警事件
router.get('/exportAlarm/zip', controller.exportExeclAndPdf) // 导出案件的 execl 和 pdf

router.put('/resource/:id/:rid', controller.updateRecodeTime) // 修改案件处理 标记段

module.exports = router
