/*
 * @Description: 识别数据
 * @Author: wanglei
 * @Date: 2019-07-03 16:05:41
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-14 11:42:44
 */
'use strict'
const koaBody = require('koa-body')({
    multipart: true
})

const router = require('koa-router')()
const controller = require('./identify.controller')

router.post('/', controller.receiveStructData) // 接收视频结构化服务器推送过来的数据
router.get('/init', controller.getInitData) // 获取初始化的识别数据
router.get('/init/count', controller.todayStructCount) // 获取当日零点到当前时间每种结构化分类的数量

router.post('/search', controller.integratedQuery) // 综合查询接口
router.post('/alarmQuery', controller.alarmQuery) // 报警检索
router.post('/picsearchLogic', controller.picsearchLogic) // 以图搜图
router.post('/picsearchDiscern', koaBody, controller.picsearchDiscern)// 识图

router.post('/exportExcel', controller.create) // 创建导出任务
router.get('/listExcel', controller.list) // 获取导出文件列表
router.get('/removeExcel', controller.remove) // 移除导出文件
router.get('/downloadExcel', controller.download) // 下载导出文件

router.get('/carStyleDict', controller.getCarDict) // 获取车辆品牌型号字典

module.exports = router
