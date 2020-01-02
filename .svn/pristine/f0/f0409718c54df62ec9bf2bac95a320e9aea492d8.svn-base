'use strict'
// 消防区
const router = require('koa-router')()
const controller = require('./alarm.controller')
const config = require('../../../../config').backend
const koaBody = require('koa-body')({
  multipart: true,
  formidable: {
    uploadDir: config.fileDirs.tempDir,
    keepExtensions: true
  }
})
router.get('/plan', controller.getPlan) // 获取报警预案
router.post('/plan', controller.addPlan) // 新增报警预案
router.put('/plan/:id', controller.putPlan) // 修改报警预案
router.delete('/plan/:id', controller.delPlan) // 删除报警预案
router.get('/timetemplate', controller.getTimeTemplate) // 获取时间模板
router.post('/timetemplate', controller.addTimeTemplate) // 新增时间模板
router.put('/timetemplate/:id', controller.putTimeTemplate) // 修改时间模板
router.delete('/timetemplate/:id', controller.delTimeTemplate) // 删除时间模板
router.get('/alarmtype', controller.getAlarmType) // 获取报警分类
router.put('/alarmtype/:id', controller.putAlarmType) // 报警份分类修改
router.get('/level', controller.getAllAlarmLevel) // 获取全部报警级别
router.get('/level/:id', controller.getOneAlarmLevel) // 获取单条报警级别修改
router.put('/level/:id', controller.putAlarmLevel) // 报警级别修改
router.put('/set/:id', controller.setUpdateAlarm) // 报警配置
router.get('/set/:id', controller.getSetAlarm) // 获取报警配置信息
router.get('/setfire/info/:id', controller.getSetFireInfo) // 获取消防报警配置详情(界面显示)
router.put('/setfire/:id', controller.setUpdateFire) // 消防报警配置
router.get('/setfire/:id', controller.getSetFire) // 获取消防报警配置
router.put('/setfireconf', controller.setFireConf) // 消防参数设置
router.get('/setfireconf', controller.getFireConf) // 获取消防参数设置
router.get('/audio', controller.getAudio) // 获取警笛音列表
router.post('/audio', controller.addAudio) // 新增警笛音
router.delete('/audio/:id', controller.delAudio) // 删除警笛音
router.put('/audio/:id', controller.putAudio) // 修改警笛音
router.post('/deal', controller.addAlarmDeal) // 添加警情处理
router.get('/deal', controller.getAlarmDeal) // 获取警情处理
router.put('/deal/:id', controller.updateAlarmDeal) // 修改警情处理
router.delete('/deal/:id', controller.deleteAlarmDeal) // 删除警情处理
router.get('/param', controller.getSysParam) // 获取系统参数
router.put('/param/:id', controller.updateSysParam) // 修改系统参数
router.put('/setfirepatch', controller.setFirePatch) // 批量配置消防报警
router.get('/fireExport', controller.fireExport) // 消防报警导出
router.post('/fireImport', koaBody, controller.fireImport) // 消防报警导入
router.get('/alarmDelay', controller.getAlarmDelay) // 获取报警延时
router.put('/setAlarmDelay', controller.setAlarmDelay) // 修改报警延时

module.exports = router
