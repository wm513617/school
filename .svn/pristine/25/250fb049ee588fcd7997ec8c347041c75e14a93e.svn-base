'use strict'

const router = require('koa-router')()
const controller = require('./vehicleDefense.controller')

router.get('/', controller.index) // 修改获取车辆布控
router.get('/check', controller.check) // 车辆名称唯一性校验
router.post('/', controller.create) // 创建车辆布控
router.put('/batch', controller.batchUpdate) // 批量修改车辆布控
router.put('/:id', controller.update) // 修改车辆布控
router.delete('/batch', controller.batchDestroy) // 删除车辆布控
router.delete('/:id', controller.destroy) // 删除车辆布控
router.delete('/reset/:type', controller.reset) // 重新布控

module.exports = router
