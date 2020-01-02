/*
 * @Description: 视频结构化布控任务
 * @Author: wanglei
 * @Date: 2019-07-02 13:36:06
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-14 10:11:05
 */
'use strict'

const router = require('koa-router')()
const controller = require('./defenseTask.controller')

// 布控任务路由
router.get('/', controller.getAllTasks) // 获取所有布控任务
router.get('/:id', controller.getTask) // 获取单个布控任务
router.post('/', controller.addTask) // 添加布控任务
router.put('/:id', controller.updateTask) // 修改布控任务
router.delete('/:id', controller.deleteTask) // 删除布控任务

// 布控报警记录路由
router.post('/alarm', controller.receiveAlarmData) // 接收布控报警推送过来的数据
router.get('/alarm/todayCount', controller.getTodayAlarmCount) // 获取当日布控报警记录数量
router.get('/alarm/init', controller.getInitAlarmData) // 默认获取最近的 64 条布控报警记录

module.exports = router
