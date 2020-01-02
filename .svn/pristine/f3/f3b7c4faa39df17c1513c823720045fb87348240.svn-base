/*
 * 布局路由
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:57:55
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-08-28 15:15:12
 */

'use strict'

const router = require('koa-router')()
const controller = require('./layout.controller')

router.get('/:wall', controller.get) // 获取所有电视墙布局
router.post('/', controller.add) // 添加电视墙布局
router.put('/:id', controller.modify) // 修改电视墙布局
router.delete('/:id', controller.delete) // 删除电视墙布局
module.exports = router
