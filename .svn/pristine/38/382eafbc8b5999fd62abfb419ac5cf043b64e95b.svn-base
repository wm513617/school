/*
 * @Author: chenkaibo
 * @Date: 2018-08-14 13:51:21
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-09-28 11:56:11
 */
'use strict'
const router = require('koa-router')()
const controller = require('./origin.controller')

router.post('/', controller.add) // 添加解码器通道和源对应关系
router.get('/:wall', controller.getAllByWall) // 获取解码器通道和源对应关系
router.get('/:chan/origin', controller.getOriginByChan) // 根据解码通道获取对应的源
router.put('/:id', controller.update) // 修改解码器通道和源对应关系

module.exports = router
