'use strict'

const router = require('koa-router')()
const controller = require('./upload.controller')
const koaBody = require('koa-body')({
  multipart: true
})

/**
 * 请求query携带参数说明
 * type 上传数据表名 默认是file+时间戳（车辆图片存储用户分表）,携带则表明新建分件表(固定表名)
 * tag 文件标签 用户查询某种分类中文件的数据（多用于固定表名)
 */
router.post('/file', controller.uploadFile) // 新版本的文件上传接口，可以配置上传文件保存到系统目录
router.post('/', koaBody, controller.upload) // 图片上传 ?type=xxx,xxx为文件表分类
router.delete('/', controller.del) // 图片删除
router.get('/tag', controller.getFilesByTag) // 根据文件标签获取文件数据集合
router.get('/', controller.getImg) // 查看图片
module.exports = router
