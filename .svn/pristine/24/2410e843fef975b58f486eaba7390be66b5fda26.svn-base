/*
 * 监控点报警路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:55:32
 * @Last Modified by: linhang
 * @Last Modified time: 2019-03-21 14:23:12
 */

'use strict'

const router = require('koa-router')()
const controller = require('./monitoryPointAlarm.controller')
router.get('/all', controller.getAll) // 查询所有监控点报警2.0
router.post('/add', controller.create) // 添加2.0
router.post('/', controller.add) // 添加
router.get('/:id', controller.getOne) // 获取
router.put('/patch', controller.updatePatch) // 批量修改
router.put('/:id', controller.update) // 修改
router.delete('/', controller.del) // 删除

module.exports = router
