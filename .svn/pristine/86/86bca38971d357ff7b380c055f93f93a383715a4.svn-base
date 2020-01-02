/*
 * @Author: zhangminbo
 * @Date: 2018-06-05 14:23:51
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-08-19 16:29:06
 */
'use strict'

const router = require('koa-router')()
const controller = require('./user.controller')
const config = require('../../../../config').backend
const { randomString } = require('../../../common/tools')
const koaBody = require('koa-body')({
  multipart: true,
  formidable: {
    uploadDir: config.fileDirs.faceUserPictureDir,
    keepExtensions: true,
    onFileBegin: (name, file) => {
      const extname = path.extname(file.name)
      const newName = randomString(8) + new Date().getTime() + extname
      file.path = `${config.fileDirs.faceUserPictureDir}/${newName}`
      file.origin = file.name
      file.name = newName
    }
  }
})

router.get('/export', controller.exportData) // 导出
router.get('/info/:id', controller.userInfo) // 获取单个用户信息
router.get('/:group', controller.index) // 获取某个分组数据
router.post('/batimg', koaBody, controller.batImg) // 批量导入
router.post('/', controller.add) // 新增用户
router.put('/:id', controller.update) // 修改人员信息
router.delete('/bat', controller.delBat) // 批量删除人员

module.exports = router
