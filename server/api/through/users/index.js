/**
 * 用户操作相关API
 * @time:2019-7-16
 * @author:MeiChen
 */
const controller = require('./users.controller')
const router = require('koa-router')()
const config = require('../../../../config').backend
const koaBody = require('koa-body')
const koaBodyFile = koaBody({
  multipart: true,
  formidable: {
    uploadDir: config.fileDirs.peopleDir,
    keepExtensions: true
  }
})
router.post('/getOneCard', controller.getOneCard) // 从一卡通获取数据
router.get('/getList', controller.getList) // 获取用户列表，包含类型筛选 搜索等
router.post('/create', controller.created) // 创建用户
router.post('/delete', controller.deleteUser) // 删除用户
router.post('/deleteOrgUser', controller.deleteOrgUser) // 删除相关机构下的人员
router.delete('/deleteAllUser', controller.deleteAllUser) // 删除全部用户
router.post('/edit', controller.edit) // 编辑用户
router.post('/orgModify', controller.orgModify) // 修改用户机构
router.post('/importExcel', koaBodyFile, controller.importExcel) // 通过excel导入用户数据
router.post('/batchImportUser', controller.batchImportUser) // 解析图片之后批量添加用户
router.delete('/deleteFileImage', controller.deleteFileImage) // 删除通过图片导入用户数据失败的的图片
router.post('/setUserVeriFace', controller.setUserVeriFace) // 设置人像管理中对应用户的_id
router.post('/zipUser', controller.zipUser) // 将对应的用户图片打成ZIP包
router.get('/downZip/:name', controller.downZip) // 根据文件名，下载ZIP包
router.get('/zipList', controller.zipList) // 获取导出用户的记录
router.post('/deleteZip', controller.deleteZip) // 删除对应zip文件
router.post('/exportExcelUser', controller.exportExcelUser) // 用户导出为Excel
router.post('/downTemplete', controller.downTemplate) // 下载导入人员模版
router.post('/setImage', controller.setImage) // 设置人员图片
module.exports = router
