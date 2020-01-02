/*
 * 电视墙路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:05:51
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-11-29 15:43:47
 */

'use strict'

const router = require('koa-router')()
const controller = require('./wall.controller')

router.put('/fulldisplay', controller.fullDisplay) // 全屏
router.put('/jointlayout', controller.setJointLayout) // 设置拼控布局
router.post('/jointlayout', controller.getJointLayout) // 获取当前拼控布局
router.post('/updatejointlayout', controller.updateAllJointLayout) // 获取并更新所有拼控布局
router.get('/device', controller.getJointController) // 获取拼接控制器
router.get('/decodechan', controller.getDecodeChan) // 获取解码通道
router.put('/jointcfg', controller.jointConfig) // 拼控配置
router.get('/jointcfg', controller.getJointConfig) // 获取拼控配置
router.get('/', controller.getList) // 获取所有电视墙
router.post('/', controller.add) // 新增电视墙
router.put('/:id', controller.modify) // 修改电视墙
router.delete('/:id', controller.delete) // 删除电视墙
router.post('/:id/open', controller.open) // 上墙
router.post('/:id/openvod', controller.openVod) // 回放上墙
router.post('/:id/frontVod', controller.frontVod) // 前端回放上墙
router.post('/:id/close', controller.close) // 关闭电视墙
router.post('/:id/setmonitorcfg', controller.setMonitorCfg) // 窗口分割
router.post('/:id/closeall', controller.closeAll)
router.get('/:id/monitor', controller.getMonitorByWall) // 获取某一电视墙下的所有监视器
router.get('/:id/plan', controller.getPlanByWall) // 获取某一电视墙下的所有预案
router.get('/:id/scene', controller.getSceneByWall) // 获取某一电视墙下的所有场景
router.get('/:id/polling', controller.getPollingByWall) // 获取某一墙下的所有轮询
router.post('/showno', controller.showNo) // 显示编号

module.exports = router
