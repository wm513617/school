/*
 * @Author: dfk 
 * @Date: 2019-05-08 17:49:12 
 * @Last Modified by: dfk
 * @Last Modified time: 2019-05-11 20:09:57
 */

'use strict'

const router = require('koa-router')()
const controller = require('./workmanagment.controller')
router.put('/', controller.addWorkManagement) //  添加工单
router.post('/:id', controller.updateWorkManagement) //  修改工单
router.post('/confirm/:id', controller.maintenanceConfirm) //  修改工单
router.get('/tree', controller.getTree) //  按设备类型获取资源机构数
router.get('/export', controller.exportParticulars) //  获取工单详情
router.get('/', controller.getList) //  获取工单列表
router.get('/:id', controller.getParticulars) //  获取工单详情
router.delete('/', controller.deleteWork) //  获取工单详情
module.exports = router
// /api/setting/workmanagement