/**
 * 服务器配置相关API
 * @time:2019-7-23
 * @author:MeiChen
 */
const router = require('koa-router')()
const controller = require('./serviceConfig.controller')
router.post('/addConfig', controller.addConfig) // 添加配置
router.post('/editConfig', controller.editConfig) // 修改服务配置
router.get('/getConfig', controller.getConfig) // 获取配置列表
router.post('/deleteConfig', controller.deleteConfig) // 删除配置 支持批量删除
router.post('/editLevelConfig', controller.editLevelConfig) // 修改高级参数设置
router.get('/getLevelConfig', controller.getLevelConfig) // 获取高级参数设置
router.get('/getDeviceStatus', controller.getDeviceStatus) // 获取设备管理视频资源设备状态
router.get('/getServerStatus', controller.getServerStatus) // 获取当前第三方服务的状态
module.exports = router
