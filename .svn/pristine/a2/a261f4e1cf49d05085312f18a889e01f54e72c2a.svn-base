/**
 * 单兵管理路由
 * @since:2018-3-8
 * @author:hansen
 */

'use strict'
const postal = require('postal')
const router = require('koa-router')()
const controller = require('./sentry.controller')

router.get('/setting', controller.uesrPointSetting) // 获取单兵定点报警配置
router.put('/pointSetting', controller.updatePointSetting) // 修改单兵定点报警配置
router.post('/point', controller.createPointer) // 创建巡更点位
router.delete('/point', controller.batchrmPoint) // 批量删除巡更点位
router.get('/point/tree', controller.pointTree) // 获取巡更点位树
router.get('/point/uniqid', controller.getUniqId) // 获取设备唯一信息
router.get('/point/list', controller.pointList) // 获取巡更点位列表
router.get('/point/statistic', controller.statistic) // 统计指定组织下点位的巡更次数
router.get('/point/outer', controller.getOuterPoint) // 获取指定地图上所有底图上的巡更点位
router.get('/point/:id', controller.getPoint) // 获取巡更点位
router.put('/point/:id', controller.updatePoint) // 修改巡更点位
router.delete('/point/:id', controller.removePoint) // 删除巡更点位
router.delete('/point/clean/:id', controller.cleanPoint) // 清除巡更点位地图坐标
router.get('/point/store/:id', controller.pointStore) // 获取指定楼层巡更点位
router.get('/point/building/:id', controller.pointBuilding) // 获取指定楼宇巡更点位
router.get('/point/:id/statistic', controller.signleStatistic) // 统计点位的巡更次数
router.get('/point/map/:id', controller.getMapPointes) // 获取指定地图上的所有巡更点位
router.get('/query', controller.List) // 模糊搜索巡更点位与巡更人员

router.get('/getlogin/:name', controller.getLoginInfo) // 获取用户登陆方式信息
router.post('/upload', controller.uploadBase64) // 存储报班图片
router.get('/user', controller.userInfo) // 获取用户信息
router.post('/user', controller.createUser) // 创建用户
router.delete('/user', controller.batchrmUser) // 批量删除用户
router.get('/user/all', controller.userAll) // 获取全部用户
router.put('/user/password', controller.changePassword) // 修改用户密码
router.put('/user/photo', controller.changePhoto) // 修改用户照片
router.get('/user/valid', controller.validUser) // 检查用户名称是否唯一
router.get('/user/tree', controller.userTree) // 创建用户树
router.get('/user/list', controller.userList) // 获取用户列表
router.get('/user/nearest', controller.computedNearbyUser) // 查询离报警点位最近的巡更人员
router.get('/user/running/task', controller.userExeRrdList) // 获取当日正在执行任务巡更人员列表（电子地图）
router.get('/user/:id', controller.getUser) // 获取用户信息
router.put('/user/:id', controller.updateUser) // 修改用户信息
router.delete('/user/:id', controller.removeUser) // 删除用户信息
router.put('/user/:id/password/reset', controller.resetPassword) // 修改用户密码
router.get('/log', controller.getLog) // 获取单兵操作日志
router.post('/log', controller.createLog) // 添加单兵操作日志
router.get('/export', controller.deviceLog) // 导出单兵操作日志

// 订阅删除所有巡更点位的坐标
postal.subscribe({ channel: 'sentry', topic: 'array.delete', callback: controller.removeAllPoint })
// 订阅删除巡更点位的坐标(楼层楼宇)
postal.subscribe({ channel: 'sentry:position', topic: 'array.delete', callback: controller.removePointByID })

module.exports = router
