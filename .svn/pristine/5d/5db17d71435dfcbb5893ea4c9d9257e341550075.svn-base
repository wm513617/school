/*
 * 回放路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:46:45
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2019-01-04 10:16:37
 */

'use strict'
// 视频回放
const router = require('koa-router')()
const controller = require('./playback.controller')

router.get('/ds', controller.getDsServer) // 获取DS Server
router.post('/query', controller.queryRecord) // 查询录像
router.post('/start', controller.startRecord) // 开始中心录像
router.post('/stop', controller.stopRecord) // 停止中心录像
router.post('/open', controller.openRecord) // 打开回放
module.exports = router
