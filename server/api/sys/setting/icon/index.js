/*
 * 2D地图图标库路由
 * @Author: lushengying
 * @Date: 2019-02-11 10:09:21
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-03-12 16:31:43
 */
'use strict'
const router = require('koa-router')()
const controller = require('./icon.controller')
const config = require('../../../../../config').backend
const { cfgUploadDir } = require('../../../../common/tools')

router.get('/org', controller.getModelOrg) // 获取图标机构
router.post('/', controller.add) // 添加图标
router.get('/', controller.getList) // 获取列表
router.get('/:oid', controller.getOne) // 获取默认模型
router.put('/', controller.batchUpdate) // 批量修改图标参数
// router.get('/params', controller.getParmas) // 获取图标参数
router.get('/group', controller.getGroup) // 获取一组图标
router.post('/upload_pic', cfgUploadDir(config.fileDirs.iconPictureDir), controller.uploadFile) // 文件上传
router.put('/:id', controller.updateOne) // 图标修改
router.put('/:id/default', controller.updateDefault) // 设置默认
router.put('/:oid/rotate', controller.updateRotate) // 设置是否旋转
router.delete('/', controller.delete) // 删除图标

module.exports = router
