/**
 * 应急管理路由
 * @since:2018-2-22
 * @author:hansen
 */

'use strict'

const router = require('koa-router')()
const controller = require('./emergency.controller')

router.post('/plan', controller.create) // 创建预案
router.get('/plan/', controller.get) // 获取指定预案
router.get('/plan/list', controller.index) // 获取预案列表
router.delete('/plan/:id', controller.remove) // 删除指定预案
router.put('/plan/:id', controller.update) // 修改预案
router.delete('/plan', controller.batchPlan) // 批量预案

module.exports = router
