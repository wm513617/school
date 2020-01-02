/**
 * 监控&通行记录相关API
 * @time:2019-8-9
 * @author:MeiChen
 */
const router = require('koa-router')()
const controller = require('./passage.controller')

router.post('/currentNewList', controller.currentNewList) // 获取当前最新的通行N条记录数据，及今日报警数量
router.post('/getPassgeList', controller.getPassgeList) // 获取通行历史记录
router.post('/exportPassage', controller.exportPassage) // 获取导出的数据
router.post('/findVieoMessage', controller.findVieoMessage) // 根据相机ID查询对应的视频信息
router.post('/senseguardPassage', controller.senseguardPassage) // 商汤调用推送通行数据
router.get('/refreshToken', controller.refreshToken) // 刷新商汤服务的token
router.post('/getAllDevice', controller.getAllDevice) // 获取所有读头和人脸识别机
router.get('/getPeopleCard', controller.getPeopleCard) // 获取人证核验机通行记录
router.get('/exportPeopleCard', controller.exportPeopleCard) // 获取导出人证核验机通行记录数据
module.exports = router
