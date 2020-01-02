/*
 * 地图点位路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:31:54
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-10-31 15:30:00
 */

'use strict'

const router = require('koa-router')()
const controller = require('./point.controller')

router.get('/all', controller.getAllPoint) // 获取所有楼层内的点位，以及点位对应的楼层、楼宇
router.get('/mapid', controller.getPointByMapId) // 根据地图id获取点位
router.get('/type', controller.getPointByType) // 根据地图id及设备类型获取点位
router.get('/loc', controller.getPointByLoc) // 根据位置获取点位 // 根据位置获取点位
router.get('/three', controller.get3DPoint) // 获取3D点位
router.put('/:id/defensestatus', controller.updateAlarmStatus) // 布撤防
router.put('/:id', controller.updateOne) // 添加、修改点位
router.get('/:id', controller.getOne) // 获取单个点位
router.get('/', controller.getAll) // 获取所有资源点位
router.delete('/:id', controller.delOne) // 删除点位

module.exports = router
