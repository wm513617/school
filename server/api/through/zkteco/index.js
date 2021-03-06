/**
 * 中控相关API
 * @time:2019-7-15
 * @author:MeiChen
 */
const router = require('koa-router')()
const guardController = require('./guard.controller')
const doorController = require('./door.controller')
const readController = require('./read.controller')
const peopleIdController = require('./peopleId.controller')
router.get('/asyncUser', guardController.asyncUser) // 同步用户到中控系统中
router.get('/asyncGuardList', guardController.asyncGuardList) // 从中控系统中获取门禁设备信息同步到本地数据库
router.get('/guardList', guardController.guardList) // 获取门禁设别列表
router.post('/editGuard/org', guardController.editOrg) // 修改门禁设备机构
router.get('/asyncDoor', doorController.asyncDoor) // 从中控系统中同步门/通道数据
router.get('/doorList', doorController.doorList) // 获取门/通道列表
router.post('/openDoor', doorController.openDoor) // 通过ID远程开门
router.post('/closeDoor', doorController.closeDoor) // 通过ID远程关门
router.post('/openTimeLang', doorController.openTimeLang) // 通过ID远程常开
router.get('/asyncRead', readController.asyncRead) // 同步读头信息到数据库
router.post('/bindCamera', readController.bindCamera) // 绑定读头与相机
router.get('/getReadList', readController.getReadList) // 获取读头信息列表
router.get('/getDoorTree', doorController.getDoorTree) // 获取树状门列表
router.get('/asyncDevicePeople', peopleIdController.asyncDevicePeople) // 从中控获取人证核验机设备
router.get('/getDevicePeopleList', peopleIdController.getDevicePeopleList) // 获取人证核验机设备列表
router.post('/setDeviceStatus', peopleIdController.setDeviceStatus) // 设置人证核验机进出状态
router.post('/deviceBindCamera', peopleIdController.deviceBindCamera) // 人证核验机绑定相机
router.post('/editDeviceOrg', peopleIdController.editDeviceOrg) // 修改人证核验机机构
router.post('/getDevicePeopleAll', peopleIdController.getDevicePeopleAll) // 一次性没有任何条件获取人证核验机设备
module.exports = router
