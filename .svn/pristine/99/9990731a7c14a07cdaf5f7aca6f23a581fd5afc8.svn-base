/**
 * 计划模板路由路由
 * @time:207-6-19
 * @author:hansen
 */
'use strict'

const router = require('koa-router')()
const controller = require('./template.controller')

router.post('/', controller.create)
router.get('/', controller.index)
router.get('/name', controller.getSummary)
router.get('/:id', controller.get)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)
module.exports = router
