/*
 * @Author: lushengying
 * @Date: 2019-07-17 11:17:54
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-05 16:03:41
 */

'use strict'
const router = require('koa-router')()
const controller = require('./tracking.controller')

router.post('/', controller.createTracking) // 创建追踪
router.get('/', controller.trackingList) // 获取列表
router.get('/remotedownload/:id', controller.remoteDownload) // 远程下载
router.delete('/remotedownload/:id', controller.removeFile) // 删除下载
router.get('/export/:id', controller.export) // 获取列表
router.get('/all', controller.trackingAll) // 获取列表
router.put('/:id', controller.trackingUpdateOne) // 单个更新
router.get('/:id', controller.trackingInfo) // 单个详情
router.delete('/', controller.trackingDelete) // 批量删除
router.get('/exportZip/:name', controller.exportZip) // 下载zip包
router.get('/exportTracking/zip', controller.exportExeclAndPdfZip)
module.exports = router
