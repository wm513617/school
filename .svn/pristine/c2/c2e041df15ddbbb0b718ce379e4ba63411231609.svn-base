'use strict'

const router = require('koa-router')()
const koaBody = require('koa-body')({
  multipart: true
})
const controller = require('./vehicle.controller')

router.get('/', controller.index) // 修改获取车辆
router.get('/check', controller.check) // 修改获取车辆
router.post('/', controller.create) // 创建车辆
router.delete('/batch', controller.batchDestroy) // 批量删除车辆
router.delete('/:id', controller.destroy) // 删除车辆
router.put('/batch', controller.batchUpdate) // 批量修改车辆布控
router.put('/:id', controller.update) // 修改车辆
router.post('/recognize', koaBody, controller.recognize) // 车辆识别
router.get('/blacklist', controller.list) // 车辆下拉框列表（去除已经布控的）
router.get('/one', controller.getOne) // 根据车牌获取车辆信息
router.get('/brand', controller.getBrand) // 获取车辆品牌列表
router.get('/model', controller.getModel) // 根据车辆品牌获取车辆型号列表

module.exports = router
