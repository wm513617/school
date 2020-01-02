/*
 * @Author: zhangminbo
 * @Date: 2018-06-05 14:23:23
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-05 10:14:26
 */
'use strict'

const router = require('koa-router')()
const controller = require('./veriface.controller')

router.get('/init', controller.getInitData) // 获取识别数据列表
router.get('/track', controller.getUserTrack) // 检索人员轨迹
router.get('/usertrack', controller.getUserTrackByUser) // 检索人员轨迹
router.put('/alarm/:id', controller.update) // 更新报警参数
router.get('/alarm/:id', controller.alarmInfo) // 获取报警参数

module.exports = router
