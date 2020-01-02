/*
 * 场景路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:04:04
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-06-06 15:04:44
 */

'use strict'
const router = require('koa-router')()
const controller = require('./scene.controller')

router.post('/', controller.add) // 添加一个场景
router.get('/:id', controller.get)
router.post('/linkage', controller.modifyLinkage) // 电视墙报警联动修改某一场景
router.put('/:id', controller.modify) // 修改某一场景
router.delete('/:id', controller.delete) // 删除某一场景
router.put('/:id/name', controller.modifyName)

module.exports = router
