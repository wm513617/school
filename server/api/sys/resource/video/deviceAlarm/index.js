/*
 * 设备报警路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:51:49
 * @Last Modified by: linhang
 * @Last Modified time: 2019-03-22 09:38:15
 */

'use strict'

const router = require('koa-router')()
const controller = require('./deviceAlarm.controller')

router.post('/', controller.add) // 添加
router.post('/add', controller.create) // 添加2.0
router.get('/all', controller.getAll) // 获取所有设备报警2.0
router.get('/:id', controller.getOne) // 获取
router.put('/:id', controller.update) // 修改
router.delete('/', controller.del) // 删除(支持批量)
router.put('/', controller.updatePatch) // 修改(支持批量)

module.exports = router
