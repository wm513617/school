/*
 * @Author: linhang
 * @Date: 2018-08-17 15:29:48
 * @Last Modified by: linhang
 * @Last Modified time: 2018-09-17 15:30:28
 */
'use strict'
const router = require('koa-router')()
const controller = require('./proof.controller')

router.get('/', controller.get)
router.get('/time', controller.setTime)
router.put('/', controller.update)

module.exports = router
