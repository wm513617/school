/*
 * @Author: linhang
 * @Date: 2018-10-18 10:56:01
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-17 15:43:21
 */
'use strict'
const router = require('koa-router')()
const controller = require('./role.controller')
router.get('/passGroup', controller.getPassGroupData) // 通行底库数据模糊搜索
router.get('/wallAuth', controller.getWallAuth) // 根据角色id获取电视墙权限
router.get('/wall', controller.findWalls) // 获取电视墙列表
router.get('/module', controller.getModules) // 角色管理页面获取模块列表
router.get('/', controller.find) // 默认显示超级管理员角色数据
router.get('/auth', controller.findAuth) // 查询权限数据
router.post('/', controller.create) // 增加角色
router.put('/:id', controller.update) // 修改角色
router.delete('/:id', controller.delete) // 删除角色
router.get('/assign', controller.findProperties) // 获取某个资源的属性
router.get('/passManage', controller.getPassManageData) // 获取通行管理机构树
router.get('/:id', controller.findById) // 根据id查询角色数据
router.put('/updown/:id', controller.updown) // 改变位置，上移或者下移
module.exports = router
