/*
 * 地图楼层路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:33:15
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2019-01-04 11:00:04
 */

'use strict'

const router = require('koa-router')()
const controller = require('./storey.controller')

router.get('/:id/point', controller.getAllPointByChannelType) // 根据地图id获取地图下所有点位
router.get('/:id/statistic', controller.statistic) // 统计某个楼层下包含的点位信息
router.get('/:id', controller.getOne) // 获取单个楼层
router.put('/:id', controller.updateOne) // 更新单个楼层
router.delete('/:id', controller.deleteOne) // 删除单个楼层
router.post('/', controller.add) // 添加楼层
router.get('/:id/reses', controller.getReses) // 获取当前楼层下的所有资源

module.exports = router
