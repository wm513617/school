/*
 * @Author: zhangminbo
 * @Date: 2018-06-05 14:24:24
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-01-23 13:45:01
 */
'use strict'

const router = require('koa-router')()
const controller = require('./group.controller')

router.get('/', controller.index)
router.get('/audio', controller.getAudio)
router.post('/', controller.add)
router.delete('/:id', controller.del)
router.put('/:id', controller.put)

module.exports = router
