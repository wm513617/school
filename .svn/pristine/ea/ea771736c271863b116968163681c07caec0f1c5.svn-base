'use strict'

const router = require('koa-router')()
const controller = require('./structure.controller')

router.get('/', controller.list) // 获取列表
router.post('/', controller.add) // 添加通道
router.delete('/', controller.del) // 删除通道
router.put('/', controller.update) // 更新通道
router.get('/start', controller.startAction) // 开始执行通道
router.get('/stop', controller.stopAction) // 停止执行通道
router.get('/disable', controller.disableAtion) // 关闭通道开机自启
router.get('/enable', controller.enableAction) // 开启通道开机自启
module.exports = router
