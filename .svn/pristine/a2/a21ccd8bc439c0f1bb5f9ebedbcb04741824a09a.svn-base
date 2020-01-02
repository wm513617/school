/*
 * 辅助杆路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:42:40
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2019-01-04 11:01:18
 */

'use strict'

const router = require('koa-router')()
const controller = require('./pole.controller')

router.post('/', controller.add) // 添加杆
router.get('/', controller.getAll) // 获取杆
router.get('/:id', controller.getOne) // 获取单个杆
router.put('/:id', controller.updateOne) // 更新杆
router.delete('/:id', controller.delete) // 删除杆
module.exports = router
