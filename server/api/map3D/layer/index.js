/*
 * @Author: hansen.liuhao
 * @Date: 2018-12-17 16:21:38
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-12-17 16:29:09
 */
const router = require('koa-router')()
const controller = require('./layer.controller')

router.get('/', controller.index) // 获取所有图层配置信息
router.get('/ground', controller.getGround) // 获取所有图层配置信息
router.post('/', controller.add) // 新增图层配置信息
router.put('/:id', controller.update) // 修改图层配置信息
router.delete('/:id', controller.remove) // 删除图层配置信息

module.exports = router
