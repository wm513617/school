/*
 * @Author: linhang
 * @Date: 2019-07-25 15:39:55
 * @Last Modified by: linhang
 * @Last Modified time: 2019-09-10 11:01:34
 */
'use strict'
const router = require('koa-router')()
const controller = require('./recordSearch.controller')
const singleton = require('./adapter').getHikon9600Singleton()

// 开启平台和ts服务的tcp连接，获取海康9600过车数据
singleton.start()
router.get('/pass', controller.getVehicleRecord) // 获取过车记录
router.get('/overspeed', controller.getOverspeedRecord) // 获取超速记录
router.get('/vioPark', controller.getVioParkRecord) // 获取违停记录
router.get('/check', controller.getPeopleVehicleCheckRecord) // 获取人车同检记录
router.get('/constant', controller.getVehicleConstant) // 获取车辆属性常量
router.get('/passExport', controller.passVehicleExport) // 过车记录导出
router.get('/overspeedExport', controller.overspeedRecordExport) // 超速记录导出
router.get('/vioParkExport', controller.vioParkRecordExport) // 违停记录导出
router.get('/checkExport', controller.vehicleCheckRecordExport) // 人车同检记录导出
router.get('/hkTree', controller.getHkDeviceTree) // 获取海康9600抓拍机树
router.get('/hikDevice', controller.getHik9600Device) // 获取海康9600同步到平台的设备列表
router.get('/historyRecord', controller.getHistoryVehicleRecord) // 电子地图模块根据抓拍机编号和时间获取过车数据绘制地图轨迹

module.exports = router
