/*
 * 防区资源路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:49:16
 * @Last Modified by:   chenkaibo
 * @Last Modified time: 2018-06-06 14:49:16
 */

'use strict'

const router = require('koa-router')()
const controller = require('./fire.controller')

router.post('/', controller.addFireAlarmIn) // 添加输入防区
router.delete('/', controller.delFireAlarmIn) // 删除输入防区

module.exports = router
