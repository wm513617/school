/*
* 网格路由
* @Author: chenkaibo
* @Date: 2018-06-05 15:29:20
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-05-07 14:28:29
*/

'use strict'

const router = require('koa-router')()
const controller = require('./grid.controller')

router.get('/mapid', controller.getGridByMapId) // 根据地图id获取网格
router.get('/sid', controller.getGridBySid) // 根据楼层id获取网格
router.get('/checkRepeat', controller.checkRepeat) // 查重
router.get('/', controller.getAll) // 获取所有网格
router.get('/:id/statistic', controller.statistic) // 网格内统计
router.get('/:id/statistic/alarm', controller.statisticAlarm) // 统计网格内的警情数量
router.get('/:id', controller.getOne) // 获取单个
router.put('/:id', controller.updateOne) // 更新
router.delete('/:id', controller.deleteOne) // 删除
router.post('/', controller.add) // 添加

module.exports = router
