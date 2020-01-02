'use strict'
// 消防区
const router = require('koa-router')()
const controller = require('./fire.controller')

router.get('/fireconf', controller.getFireplanConf) // 获取参数配置
router.put('/fireconf', controller.fireplanConf) // 修改参数配置
router.put('/setting/:id', controller.settingUpdate) // 设置输入防区
router.get('/setting/:id', controller.getSetting) // 获取设置输入防区
router.delete('/bat', controller.delBatch) // 批量删除输入防区
// router.get('/:orgId', controller.index) // 查询列表
// router.post('/:orgId', controller.add) // 新增输入防区

module.exports = router
