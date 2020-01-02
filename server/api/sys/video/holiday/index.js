/**
 * 节假日路由
 * @time:207-6-17
 * @author:hansen
 */
'use strict'

const router = require('koa-router')()
const controller = require('./holiday.controller')

router.get('/:id', controller.get)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)
router.post('/', controller.create)
router.get('/', controller.index)
module.exports = router
