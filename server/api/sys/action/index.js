'use strict'

const router = require('koa-router')()
const controller = require('./action.controller')

router.get('/', controller.index)
router.post('/', controller.add)
router.put('/:id', controller.update)
router.delete('/:id', controller.del)

module.exports = router
