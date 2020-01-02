'use strict'

/**
 * 系统参数设置
 */
const router = require('koa-router')()
const controller = require('./setting.controller')

router.use('/model', require('./model').routes(), require('./model').allowedMethods())
router.use('/icon', require('./icon').routes(), require('./icon').allowedMethods())
router.get('/sysparamters', controller.sysparamters) // 获取系统参数信息
router.put('/sysparamters', controller.sysparamtersUpdate) // 修改系统参数信息
router.get('/server', controller.serverIndex) // 获取智能服务器信息
router.get('/loginimgs', controller.getLoginImgs) // 获取登录页logo和登陆图片
router.post('/server', controller.serverAdd) // 新增智能服务器
router.put('/server/:id', controller.serverUpdate) // 修改智能服务器
router.delete('/server/batch', controller.serverBatchDelete) // 批量删除智能服务器
router.delete('/server/:id', controller.serverDelete) // 删除智能服务器
router.get('/maptype', controller.getMapType) // 获取地图类型
router.put('/maptype', controller.updateMapType) // 修改系统参数信息
router.post('/auth', controller.serverAuth) // 邮件服务器测试

module.exports = router
