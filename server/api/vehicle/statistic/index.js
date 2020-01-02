'use strict'

const router = require('koa-router')()
const controller = require('./statistics.controller')

router.get('/', controller.index) // 查询统计信息
router.get('/inout', controller.getInOut) // 获取出入口统计--------------------------------------(今日数据)
router.get('/todycrossing', controller.getTodyCrossing) // 获取今日路口统计-----------------------(今日数据)
router.get('/todybrand', controller.getTodyBrand) // 获取今日品牌统计-----------------------------(今日数据)
router.get('/flow', controller.getFlow) // 获取路口流量统计---------------------------------------(车流量统计)
router.get('/vehicletype', controller.getVehicleType) // 获取车辆类型数据-------------------------(车流量统计)
router.get('/crossing', controller.getCrossing) // 路口流量统计-----------------------------------(路口统计)
router.get('/crossingvt', controller.getCrossVechileType) // 路口流量统计-------------------------(路口车辆类型)
router.get('/defense', controller.getDefense) // 获取布防数据（上面图表）---------------------------(警情统计)
router.get('/defenselist', controller.getDefenselist) // 获取布防列表（下面表格）-------------------(警情统计)
router.get('/curmaxzone', controller.getCurMaxZone) // 获取当前车流密度较大区域---------------------(首页)
router.get('/todyentrychiclelist', controller.getEntryVehicleList) // 今日车辆分类（入园黑白名单）---(首页)
router.get('/somecount', controller.getSomeCount) // 其他数量统计方法（出入院、布控、发现布控）--------(首页)
router.get('/todychicletype', controller.getTodyVehicleType) // 今日车辆类型分析 ------------------(首页)
router.get('/brand', controller.getBrand) // 获取品牌统计
module.exports = router
