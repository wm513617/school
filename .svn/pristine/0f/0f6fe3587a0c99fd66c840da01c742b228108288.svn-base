/*
 * @Author: chenkaibo
 * @Date: 2018-07-11 10:26:50
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2019-01-04 11:02:42
 */
'use strict'
const router = require('koa-router')()
const controller = require('./storey.controller')

router.get('/', controller.getAll) // 获取3D楼层列表
router.get('/:id', controller.getOne) // 获取单个
router.get('/:id/point', controller.getPoints) // 根据楼层获取所有点位
router.post('/', controller.add) // 提那家3D楼层
router.put('/:id', controller.update) // 更新3D楼层
router.delete('/:id', controller.del) // 删除3D楼层

module.exports = router
