'use strict'
// 报警中心
const router = require('koa-router')()
const controller = require('./controller')

router.put('/clientPatch', controller.updateClientPatch) // 获取服务配置2.0
router.get('/server', controller.getServer) // 获取服务配置
router.put('/server', controller.putServer) // 获取修改服务配置
router.get('/receive', controller.getReceive) // 获取接警
router.post('/receive', controller.postReceive) // 新增接警
router.put('/receive/:id', controller.putReceive) // 新增接警
router.del('/receive', controller.delReceive) // 删除接警
router.get('/client', controller.getClient) // 获取报警终端
router.post('/client', controller.postClient) // 新增接警
router.put('/client/:id', controller.putClient) // 修改报警终端
router.del('/client', controller.delClient) // 删除接警
module.exports = router
