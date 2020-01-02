/*
 * @Author: linhang
 * @Date: 2018-12-16 11:15:24
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-07-23 10:02:08
 */
'use strict'
// const sdkSingleton = require('../sdkV3Server.socket').getSDKSingleton()
const router = require('koa-router')()
const controller = require('./server.controller')
// 启动SDK服务
// sdkSingleton.run()
const taskController = require('../controller/taskController').getSingleton()
taskController.start()

router.get('/', controller.index) // 获取服务器信息
router.post('/', controller.add) // 新增服务器
router.delete('/batch', controller.delBatch) // 删除服务器
router.put('/:id', controller.put) // 修改服务器
router.delete('/:id', controller.del) // 删除服务器
router.get('/:id/sync', controller.sync) // 服务器底库、布控人员同步
module.exports = router
