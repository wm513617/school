/*
 * @Author: zhangminbo
 * @Date: 2018-08-15 13:55:12
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-12-20 13:32:49
 */
'use strict'
// 平台互联
const router = require('koa-router')()
const controller = require('./platfrom.controller')

router.get('/server', controller.getServer) // 获取服务器列表数据
router.post('/server', controller.postServer) // 新增服务器器
// router.get('/sharedata/:id/:type', controller.getShareData) // 根据分类获取服务器 已分享的资源
router.put('/server/:id', controller.putServer) // 修改服务器
router.delete('/server/:id', controller.delServer) // 删除服务器

router.get('/sharetree/:shareServer/:type', controller.getShareTree) // 根据资源类型获取树结构
router.get('/server/:id', controller.getServerById) // 根据Id获取服务器列表数据
router.put('/sharetree/:shareServer/:orgId/:shareType', controller.putShareTree) // 国标数据同步到本地数据
router.post('/catalog', controller.catalog) // 目录推送

// postal.subscribe({
//   channel: '',
//   topic: '',
//   callback:
// })

module.exports = router
