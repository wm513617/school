/*
 * 设备路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:48:38
 * @Last Modified by: dfk
 * @Last Modified time: 2019-09-05 19:27:02
 */

'use strict'

const router = require('koa-router')()
const controller = require('./device.controller')
const config = require('../../../../config').backend
const koaBody = require('koa-body')({
  multipart: true,
  formidable: {
    uploadDir: config.fileDirs.tempDir,
    keepExtensions: true
  }
})
router.post('/import', koaBody, controller.deviceImport) // 设备导入
router.get('/export', controller.deviceExport) // 设备导出
router.get('/devinfo', controller.getDeviceinfo) // 在线获取设备信息
router.post('/restart', controller.restartDev) // 设备重启
router.post('/login', controller.login) // 设备登录
router.post('/logout', controller.logout) // 设备登出
router.get('/onlinelist', controller.getDevOnline) // 获取所有在线设备（待实现，暂时不调试）
// router.post('/remotecfg', controller.remoteCfg)      // 远程配置设备信息（待实现，直接浏览器谈框访问）

router.get('/', controller.getAll) // 查询设备列表
// router.get('/', controller.getAuthAll)   // 查询设备列表
router.post('/', controller.add) // 添加设备
router.get('/servicelist', controller.serviceList) // 获取解码器 接入服务器地址
router.post('/settingstatus', controller.setDeviceStatus) // 设置 设备启用/停用状态
router.get('/synchronousfire', controller.synchronousFire) // 同步国创设备接口

// const koaBody = require('koa-body')({
//     multipart: true
// })
router.get('/byseries', controller.getDeviceBySeries) // 根据设备型号获取设备信息
router.post('/insertpatch', controller.insertPatch) // 批量添加设备
router.get('/counts', controller.counts) // 获取各类设备的设备总数
router.get('/counts/index', controller.countIndex) // 获取首页各类设备的设备总数

router.post('/:id/alarm', controller.addAlarm) // 新增设备报警
router.put('/:id/alarm/:aid', controller.updateAlarm) // 修改设备报警
router.delete('/:id/alarm', controller.delAlarmPatch) // 删除某条设备报警
router.delete('/:id/alarm/:aid', controller.delAlarm) // 删除某条设备报警

router.get('/names', controller.names) // 获取所有的设备名称
router.get('/tree', controller.getDeviceTree) // 获取设备树
router.get('/treeNew', controller.getDeviceTreeNew) // 获取设备树2.0
router.put('/move', controller.moveDevice) // 设备移动
router.get('/channeltree', controller.getChannelTree) // 获取通道树
router.get('/alarmtree', controller.getChannelTreeForAlarm) // 获取通道树,报警管理模块使用，2.0
router.get('/authchanneltree', controller.getAuthChannelTree) // 获取通道树
router.get('/type/:type', controller.getTypeDevice) // 获取指定设备类型下的设备列表
router.put('/:id', controller.updateOne) // 更新某个设备
router.get('/:id', controller.getOne) // 获取单个设备
router.delete('/', controller.delete) // 删除某个设备(支持批量)

router.get('/:id/resource', controller.getResource) // 获取指定设备下的所有资源
router.get('/:id/refresh/resource', controller.refreshResource) // 刷新资源ip
router.get('/:id/resource/:type', controller.getResinfo) // 获取指定设备下的指定类型的所有资源
router.get('/:id/unusedchancode', controller.getUnusedChanCode) // 获取指定设备下未使用的通道数
router.get('/:id/unconfigalarm', controller.getUnConfigAlarm) // 获取指定设备下未配置监控点报警/智能报警的通道信息
// 相关的订阅
require('./substribe.js')

module.exports = router
