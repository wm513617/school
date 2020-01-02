/**
 * 商汤相关API
 * @time:2019-7-15
 * @author:MeiChen
 */
const router = require('koa-router')()
const controller = require('./senseTime.controller')
router.get('/asyncDevice', controller.asyncDevice) // 同步商汤设备数据
router.post('/editFaceOrg', controller.editFaceOrg) // 编辑人脸识别机绑定的机构信息
router.post('/bindCamera', controller.bindCamera) // 人脸识别机绑定相机
router.get('/getDeviceList', controller.getDeviceList) // 获取人脸识别机列表
router.get('/getLiveCount', controller.getLiveCount) // 获取商汤人脸识别机的在线离线数量
router.post('/setDeviceState', controller.setDeviceState) // 设置人脸识别机进出状态
router.get('/getFaceBase', controller.getFaceBase) // 获取商汤人像库列表
router.post('/createLibrary', controller.createLibrary) // 创建商汤的人像识别库
router.post('/addLibraryUser', controller.addLibraryUser) // 给对应人像库中添加人像信息
module.exports = router
