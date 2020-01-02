/**
 * 门禁管理路由
 * @since:2018-2-22
 * @author:hansen
 */

'use strict'

const router = require('koa-router')()
const controller = require('./door.controller')

router.get('/:id/sync', controller.sync) // 同步指定id门禁系统的门禁列表
router.get('/:id/list', controller.list) // 获取指定id门禁系统的门禁列表
router.get('/:id/query', controller.query) // 查询限定条件的门禁
router.get('/:id/res', controller.fetch) // 获取门禁系统下指定门禁的摄像机
router.post('/:id/res', controller.config) // 配置门禁系统下指定门禁的摄像机
router.get('/pass/:devId/res', controller.fetch) // 获取门禁设备的绑定资源
router.get('/:id/pass/list', controller.record) // 获取指定id门禁系统的刷卡记录
router.get('/:id/:device/ctrl', controller.ctrl) // 关闭|打开指定id门禁系统的门禁设备
router.get('/servers', controller.index) // 获取门禁服务器配置列表
router.post('/servers', controller.create) // 新增门禁服务器配置
router.get('/servers/all', controller.getAll) // 获取所有门禁服务器
router.get('/servers/:id', controller.findById) // 获取指定id的门禁服务器配置
router.put('/servers/:id', controller.update) // 修改指定id的门禁服务器配置
router.delete('/servers/:id', controller.remove) // 删除指定id的门禁服务器配置

module.exports = router
