/*
 * @Description: 视频化结构服务器高级参数设置
 * @Author: wanglei
 * @Date: 2019-06-28 13:42:10
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-06-28 16:21:35
 */
'use strict'

const router = require('koa-router')()
const controller = require('./param.controller')

router.get('/', controller.getParam) // 获取结构化服务器参数
router.put('/', controller.updateParam) // 修改结构化服务器参数
router.post('/default', controller.setDefault) // 恢复默认设置

module.exports = router
