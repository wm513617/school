const router = require('koa-router')()
const contriller = require('./permission.controller')
router.get('/asyncPermission', contriller.asyncPermission) // 从中控系统中同步权限组
router.get('/getPermissionGroup', contriller.getPermissionGroup) // 获取所有的门禁的权限组
router.get('/getPermissionUser', contriller.getPermissionUser) // 获取拥有该权限组的用户
router.post('/addPermissionUser', contriller.addPermissionUser) // 按用户添加权限组
router.post('/addPermissionGroup', contriller.addPermissionGroup) // 按机构给用户添加权限组
router.post('/movePermissionUser', contriller.movePermissionUser) // 移动用户权限组
router.post('/deletePermissionUser', contriller.deletePermissionUser) // 删除人员与权限组的关系
router.delete('/deleteAllPermission', contriller.deleteAllPermission) // 删除全部权限
module.exports = router
