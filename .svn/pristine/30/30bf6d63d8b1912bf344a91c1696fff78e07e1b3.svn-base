/*
 * @Author: linhang
 * @Date: 2018-12-07 09:45:19
 * @Last Modified by: linhang
 * @Last Modified time: 2019-04-25 18:47:18
 */
'use strict'

const router = require('koa-router')()
const controller = require('./param.controller')

router.get('/face', controller.getFaceResources) // 获取人脸的资源
router.get('/faceResource', controller.getUsedFaceResources) // 获取人脸的资源
router.get('/edit', controller.editFaceResource) // 编辑视频通道参数
router.get('/', controller.get) // 获取抓拍参数
router.put('/', controller.update) // 更新参数
// router.get('/test', controller.deleteFacePicture) //  测试定时删除人脸图片
// router.get('/testDeleteSdkPicture', controller.deleteSdkPicture) //  测试删除sdk图片

module.exports = router
