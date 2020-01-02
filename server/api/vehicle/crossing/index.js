'use strict'

const router = require('koa-router')()
const controller = require('./crossing.controller')

router.get('/', controller.index) // 查询路口
router.get('/list', controller.list) // 获取路口下拉框数据
router.post('/', controller.create) // 创建路口
router.put('/:id', controller.update) // 修改路口
router.delete('/batch', controller.destroyBatch) // 删除路口
router.delete('/:id', controller.destroy) // 删除路口
router.get('/lane/direction', controller.getDirection) // 获取路口车行方向列表
router.get('/lane/:id', controller.findlanes) // 根据路口获取车道
router.put('/lane/:id', controller.updateLane) // 修改车道数据
router.get('/channelIds', controller.getChannelIds) // 获取频道号
router.get('/channelIdsAll', controller.getAllChannelIds) // 获取频道号字典对象（用于页面列表展示）
router.get('/checkcross', controller.checkcross) // 检查路口名称编号唯一性
router.get('/checklane', controller.checklane) // 检查车道名称编号唯一性

module.exports = router
