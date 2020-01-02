/*
 * 监视器路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:58:46
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-08-23 11:07:57
 */
'use strict'
const router = require('koa-router')()
const controller = require('./monitor.controller')

router.post('/', controller.add)
router.put('/:id', controller.modify)
router.delete('/', controller.delete) // 监视器删除(支持批量)

module.exports = router
