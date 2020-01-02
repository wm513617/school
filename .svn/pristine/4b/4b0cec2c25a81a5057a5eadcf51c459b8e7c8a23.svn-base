'use strict'

const router = require('koa-router')()
const controller = require('./dict.controller')

router.get('/', controller.index) // 查询所有字典信息
router.get('/type', controller.findByType) // 查询所有字典信息
router.post('/', controller.create) // 创建字典信息
router.delete('/:id', controller.delete) // 删除字典信息
router.put('/:id', controller.update) // 修改字典信息

module.exports = router
