/*
 * 地图模型库路由
 * @Author: chenkaibo
 * @Date: 2018-10-28 17:00:21
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-12-19 09:36:00
 */
'use strict'
const router = require('koa-router')()
const controller = require('./model.controller')
const config = require('../../../../../config').backend
const { cfgUploadDir } = require('../../../../common/tools')

router.get('/org', controller.getModelOrg) // 获取模型机构
router.post('/', controller.add) // 添加模型
router.get('/', controller.getList) // 获取列表
router.put('/', controller.batchUpdate) // 批量修改模型参数
router.get('/params', controller.getParmas) // 获取模型参数
router.get('/group', controller.getGroup) // 获取一组模型
router.post('/upload_gltf', cfgUploadDir(config.fileDirs.modelFileDir), controller.uploadFile) // 文件上传
router.post('/upload_pic', cfgUploadDir(config.fileDirs.modelPictureDir), controller.uploadFile) // 文件上传
router.put('/:id', controller.updateOne) // 模型修改
router.put('/:id/default', controller.updateDefault) // 设置默认
router.delete('/', controller.delete) // 删除模型

module.exports = router
