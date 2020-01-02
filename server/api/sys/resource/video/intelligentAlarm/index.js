/*
 * 智能报警路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:52:53
 * @Last Modified by: linhang
 * @Last Modified time: 2019-03-21 16:28:40
 */

'use strict'

const router = require('koa-router')()
const controller = require('./intelligentAlarm.controller')

router.post('/add', controller.create) // 添加
router.post('/', controller.add) // 添加
router.get('/all', controller.getAll) // 查询所有智能报警2.0
router.get('/:id', controller.getOne) // 获取
router.put('/patch', controller.updatePatch) // 批量修改2.0
router.put('/:id', controller.update) // 修改
router.delete('/', controller.del) // 删除
module.exports = router
