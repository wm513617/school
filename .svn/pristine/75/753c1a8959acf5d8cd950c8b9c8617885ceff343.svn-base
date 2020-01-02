/*
 * @Author: chenkaibo
 * @Date: 2018-07-11 10:26:50
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-10-31 10:15:49
 */
'use strict'
const router = require('koa-router')()
const controller = require('./mapconf.controller')

router.get('/', controller.getMapConf)
router.get('/mapconf', controller.getConfig)
router.put('/', controller.update)

module.exports = router
