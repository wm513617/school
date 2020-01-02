/*
 * 轮询路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:02:57
 * @Last Modified by:   chenkaibo
 * @Last Modified time: 2018-06-06 15:02:57
 */

'use strict'
const router = require('koa-router')()
const controller = require('./polling.controller')

router.get('/:id', controller.getOne) // 获取轮询
router.post('/', controller.add) // 添加添加轮询
router.put('/:id', controller.modify) // 修改轮询
router.delete('/:id', controller.delete) // 删除轮询
router.post('/exec', controller.exec) // 执行轮询
module.exports = router
