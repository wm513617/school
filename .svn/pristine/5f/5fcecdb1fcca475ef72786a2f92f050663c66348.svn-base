/*
 * 机构路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:49:59
 * @Last Modified by:   chenkaibo
 * @Last Modified time: 2018-06-06 14:49:59
 */

'use strict'

const router = require('koa-router')()
const controller = require('./org.controller')

router.post('/', controller.create) // 创建组织
router.get('/list', controller.getList) // 获取机构列表
router.get('/tree', controller.getTree) // 获取机构树
router.get('/root/:type', controller.getRootInfo) // 获取指定类型根机构信息
router.get('/:id', controller.getOne) // 查询单个机构详情及其下所有子孙机构信息
router.put('/:id', controller.updateOne) // 修改机构信息
router.delete('/:id', controller.deleteOne) // 删除某个组
router.put('/:id/updown', controller.updown) // 机构上下移动
router.put('/:id/upgrading', controller.upgrading) // 机构升级
router.put('/:id/downgrading', controller.downgrading) // 机构将级
// 相关的订阅
require('./substribe.js')

module.exports = router
