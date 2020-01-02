/*
* 楼宇路由
* @Author: chenkaibo
* @Date: 2018-06-05 15:27:09
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2019-01-04 09:24:56
*/

'use strict'

const router = require('koa-router')()
const controller = require('./building.controller')
// const auth = require('../../../auth/auth.service')

router.get('/mapid/info', controller.getBuildingInfoByLocation) // 判断楼宇是否在坐标范围内
router.get('/mapid', controller.getBuildingByMapId) // 根据地图id获取所有楼宇
router.get('/checkRepeat', controller.checkRepeat) // 重复检查
router.get('/', controller.getAll) // 获取所有楼宇
router.get('/:id', controller.getOne) // 获取单个
router.get('/:id/storey', controller.getStorey) // 获取楼宇下的楼层
router.get('/:id/statistic', controller.statistic) // 楼宇内统计
router.put('/:id', controller.updateOne) // 楼宇修改
router.delete('/:id', controller.deleteOne) // 楼宇删除
router.post('/', controller.add) // 楼宇添加

module.exports = router
