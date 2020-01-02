/*
 * @Author: linhang
 * @Date: 2018-12-11 16:04:05
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-06-28 09:20:06
 */
'use strict'

const router = require('koa-router')()
const controller = require('./statistics.controller')
const excelController = require('./statistics.excel.controller')

router.get('/today', controller.today) // 今日统计数据
router.get('/analysis', controller.analysis) // 统计分析,7/14/30天的路人识别量，布控报警量
router.get('/analysis/export', controller.analysisExport) // 导出统计数据
// router.get('/passby/export', controller.strangerExportData) // 陌生人导出/以图搜图导出
// router.get('/alarm/export', controller.alarmExportData) // 报警检索导出
router.get('/passby', controller.getPassbyList) // 路人按照条件检索
router.get('/passby/count', controller.passbyStatictisCount) // 报警检索
router.get('/alarm', controller.getAlarmList) // 报警检索
router.get('/alarm/count', controller.alarmStatictisCount) // 报警检索统计总数
router.get('/passby/img', controller.getImageByImage) // 路人以图搜图检索
router.get('/passby/img/count', controller.imageStatictisCount) // 路人检索统计总数

router.post('/excel/export', excelController.create)
router.get('/excel/list/:type', excelController.list)
router.delete('/excel/:type/:id', excelController.remove)
router.get('/excel/download/:type/:filename', excelController.download)

module.exports = router
