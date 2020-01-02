/*
 * @Author: linhang
 * @Date: 2018-10-19 16:31:25
 * @Last Modified by: linhang
 * @Last Modified time: 2018-11-30 14:39:52
 */
'use strict'
const router = require('koa-router')()
const controller = require('./user.controller')

router.get('/ukeys', controller.findByKeys) // 根据ukey查找用户
router.get('/userLog', controller.getUserLog) // 获取用户详细日志
router.get('/detail', controller.getUserLogDetail) // 获取用户详细日志,按条件查询
router.get('/duty/list', controller.dutyUser) // 获取值班用户列表
router.get('/log', controller.getLog) // 获取系统操作日志
router.get('/export', controller.logExport) // 系统日志导出
router.get('/', controller.index) // 用户管理首页
router.post('/', controller.create) // 添加账户
router.get('/duty', controller.duty) // 用户管理首页
router.get('/changeLog', controller.getChangeLog) // 交接班日志查询
router.post('/test', controller.test) // 用户账户测试
router.post('/login', controller.login) // 用户登录
router.post('/logout', controller.logout) // 用户退出
router.get('/:id', controller.findById) // 根据id查找账户
router.put('/:id', controller.update) // 修改用户
router.delete('/:id', controller.delete) // 删除用户
router.post('/log', controller.createLog) // 增加操作日志
router.put('/pwd/:id', controller.updatePwd) // 修改密码
module.exports = router
