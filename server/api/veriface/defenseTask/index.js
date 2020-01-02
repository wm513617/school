/*
 * 布控任务
 * @Author: chenkaibo
 * @Date: 2018-12-07 09:58:59
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2019-01-03 11:32:52
 */

'use strict'

const router = require('koa-router')()
const controller = require('./defenseTask.controller')

router.get('/tree', controller.getTree) // 获取点位树
router.get('/', controller.getList) // 获取布控任务列表
router.post('/', controller.add) // 添加布控任务
router.delete('/', controller.del) // 删除
router.put('/patch', controller.updatePatch) // 批量撤控,布控
router.put('/:id', controller.update) // 修改，撤控

module.exports = router
