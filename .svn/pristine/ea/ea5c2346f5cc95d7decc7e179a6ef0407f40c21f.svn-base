/*
 * 运维管理诊断服务器相关路由
 * @Author: lushengying
 * @Date: 2018-08-29 10:54:45
 * @Last Modified by: lushengying
 * @Last Modified time: 2018-11-09 14:44:51
 */

'use strict'

const router = require('koa-router')()
const controller = require('./videoDiagnosis.controller')
router.get('/', controller.getAll) //  视频诊断列表
router.get('/export', controller.export) //  视频诊断列表导出表格
router.get('/server', controller.getServer) //  获取诊断服务器列表
router.get('/server/:id', controller.serverInfo) // 诊断服务器详情
router.post('/server', controller.addServer) //  添加诊断服务器详情
router.put('/server/:id', controller.upServer) // 修改诊断服务器
router.delete('/server/:id', controller.delServer) // 删除诊断服务器
router.get('/:id/:diagnid', controller.videoInfo) //  视频诊断详情
module.exports = router
