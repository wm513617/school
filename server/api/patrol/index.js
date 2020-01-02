/**
 * 巡更管理路由
 * @since:2018-3-12
 * @author:hansen
 */

'use strict'

const router = require('koa-router')()
const postal = require('postal')
const controller = require('./patrol.controller')

router.post('/location', controller.userGeo) // 单兵实时定位
router.post('/alarm', controller.userAlarm) // 单兵报警
router.put('/alarm/:id', controller.updateAlarm) // 单兵报警处理
router.get('/trajectory', controller.trajectory) // 获取巡更记录列表
router.get('/record', controller.recordList) // 获取巡更记录列表
router.get('/record/query', controller.recordQuery) // 查询用户记录
router.delete('/record', controller.batRemoveRecord) // 批量删除巡更记录
router.get('/record/current', controller.findCurrent) // 获取当前正在运行的记录(app单个用户记录)
router.get('/record/date', controller.getUserAllRecord) // 获取用户某一天所有巡更任务
router.get('/record/running', controller.findRunRecord) // 获取当前正在运行的记录(pc多个用户记录)
router.get('/record/:id', controller.findRecordById) // 获取指定id的巡更记录
router.delete('/record/:id', controller.removeRecord) // 删除指定id的巡更记录
router.get('/record/:id/detail', controller.findRecordDetail) // 获取当前正在运行的记录的详情(pc某条记录)
router.post('/record/:id/sigin', controller.sigin) // 巡更任务巡更点签到(app)
router.get('/record/running/query', controller.queryRunningRrd) // 查询当前正在运行的记录
router.get('/record/:user/date', controller.queryDateRrd) // 获取指定人员的所有今日巡更记录
router.post('/record/offline/upload', controller.offlineSingin) // 巡更app上传离线巡更任务

router.get('/message', controller.msgList) // 获取巡更消息列表
router.post('/message', controller.createMsg) // 新增巡更消息
router.delete('/message', controller.batRemoveMsg) // 批量删除巡更消息
router.get('/message/query', controller.msgQuery) // 查询用户消息
router.get('/message/list', controller.findUserMsg) // 获取当前用户的消息(app)
router.get('/message/:id', controller.findMsgById) // 获取指定id的巡更消息
router.put('/message/:id', controller.confirm) // 报警消息确认
router.delete('/message/:id', controller.removeMsg) // 删除指定id的巡更消息
router.get('/message/task/:id', controller.getTaskMsg) // 获取指定任务的消息列表

router.get('/task', controller.taskList) // 获取巡更任务列表
router.post('/task', controller.createTask) // 新增巡更任务
router.delete('/task', controller.batRemoveTask) // 批量删除巡更任务
router.get('/task/query', controller.taskQuery) // 查询任务
router.get('/task/:id', controller.findTaskById) // 获取指定id的巡更任务
router.put('/task/:id', controller.updateTask) // 修改指定id的巡更任务
router.delete('/task/:id', controller.removeTask) // 删除指定id的巡更任务

router.get('/warnning', controller.warnningList) // 获取单兵报警列表
router.get('/warnning/:id', controller.findWarnById) // 获取指定id的巡更任务
router.delete('/warnning/:id', controller.removeWarnning) // 删除指定id的报警信息
router.delete('/warnning', controller.batRemoveWarnning) // 批量删除单兵报警信息
router.get('/user/camera', controller.openUserCamera) // 中心请求打开巡更人员摄像机
router.get('/user/trajectory', controller.getPatrolTrajectory) // 中心请求打开巡更人员摄像机
router.post('/user/create', controller.createUserCameraVideo) // 创建储存一键报警中心请求打开巡更人员摄像机的视频录像
router.post('/instant/message', controller.instantMessage) // 即时通讯消息

router.get('/webuser', controller.getWebUser) // 获取当前所有的PC用户
router.post('/speech', controller.speech) // 发起对讲
router.post('/speech/url', controller.getSpeechUrl) // 获取对讲地址
router.post('/speech/disconnet', controller.speechDisconnet) // 发起关闭对讲请求
router.put('/speech/history/:id', controller.updateHistory) // 修改记录
router.get('/speech/history', controller.historyList) // 获取记录
router.post('/speech/history', controller.addHistory) // 对讲记录
router.delete('/speech/history/:id', controller.delHistory) // 删除记录
router.get('/speech/dsid', controller.getDsId) // 获取dsId
router.post('/speech/appPull', controller.sentryPullFlow) // 通知app拉流
// 广播记录
router.post('/radio/history', controller.addRadioHistory) // 创建广播记录
router.get('/radio/history', controller.getRadioHistoryList) // 获取广播记录
router.put('/radio/history/:id', controller.updateRadioHistory) // 修改广播记录
router.delete('/radio/history/:id', controller.deleteRadioHistory) // 删除广播记录

// router.post('/upload', controller.upload) // 上传base64图片

router.post('/broadcast', controller.broadcast) // 发起广播
router.post('/broadcast/url', controller.getBroadcastUrl) // 获取对讲地址
router.post('/broadcast/join', controller.broadcastJoin) // 广播添加用户
router.post('/broadcast/disconnet', controller.broadcastDisconnet) // 停止广播

// 订阅删除用户巡更任务及任务记录
postal.subscribe({ channel: 'patrol', topic: 'array.delete', callback: controller.syncRemoveTaskRecord })
// 订阅删除巡更点位同步更新任务及未执行的记录
postal.subscribe({ channel: 'patrol', topic: 'array.update', callback: controller.updatePointTaskRecord })

module.exports = router
