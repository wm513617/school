/*
 * @Author: wanglei
 * @Date: 2019-04-25 16:24:34
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-10-29 16:54:26
 */

'use strict'

const router = require('koa-router')()
const controller = require('./addressbook.controller')

router.get('/', controller.getAddressBook) // 获取全部分组
router.get('/:id', controller.getPrincipal) // 获取该分组下的联系人
router.get('/principal/search', controller.search) // 搜索联系人
router.get('/principal/collect/search', controller.searchCollectPrincipal) // 仅搜索收藏的联系人
router.get('/principal/collect', controller.getCollectPrincipal) // 获取收藏的联系人

router.post('/:id', controller.addPrincipal) // 添加联系人
router.post('/', controller.addGroup) // 添加新分组

router.put('/principal/:id', controller.updatePrincipal) // 修改联系人
router.put('/principal/:id/collect', controller.collectPrincipal) // 收藏联系人
router.put('/order', controller.orderGroup) // 保存前端排序后的结果
router.put('/:id', controller.updateGroup) // 修改新添加分组
router.put('/:id/collect', controller.collectGroup) // 收藏组

router.delete('/:id', controller.deleteGroup) // 删除新添加分组
router.delete('/principal/:id', controller.deletePrincipal) // 删除联系人

module.exports = router
