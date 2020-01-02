/*
 * 预案路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:01:47
 * @Last Modified by:   chenkaibo
 * @Last Modified time: 2018-06-06 15:01:47
 */

'use strict'
const router = require('koa-router')()
const controller = require('./plan.controller')

router.post('/', controller.add) // 新增预案
router.put('/:id', controller.modify) // 修改预案
router.delete('/:id', controller.delete) // 删除预案
router.get('/:id/use', controller.use) // 执行预案
module.exports = router
