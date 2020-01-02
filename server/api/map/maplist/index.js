/*
 * 地图列表路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:30:12
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2019-01-04 10:58:42
 */

'use strict'

const router = require('koa-router')()
const controller = require('./map.controller')

router.delete('/:mapid', controller.deleteAllResourceByMapId) // 根据地图id删除所有资源
router.post('/', controller.add) // 添加地图
router.get('/', controller.index) // 获取地图
router.put('/:id', controller.update) // 更新地图

module.exports = router
