/*
 * @Author: linhang
 * @Date: 2018-10-18 11:09:01
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-24 15:01:46
 */
'use strict'
const { handleSysException, transData2Tree } = require('../../../common/tools')
const Role = require('./role.service')
const role = new Role()
const mongoose = require('mongoose')
const RoleModel = mongoose.model('Role')
const User = mongoose.model('User')
const PropertyModel = mongoose.model('ResProperty')
const TVWall = mongoose.model('Wall')
const Org = mongoose.model('Org')
const DoorPermission = mongoose.model('doorPermission')
/**
 * 查询角色
 * @param {*} ctx
 */
exports.find = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-查询角色'))
    const results = await role.find()
    ctx.body = results
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 查询角色权限
 * @param {*} ctx
 */
exports.findAuth = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-查询角色权限'))
    const results = await role.findAuth()
    ctx.body = results
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 查询单个角色
 * @param {*} ctx
 */
exports.findById = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-查询单个角色'))
    const id = ctx.params.id
    if (!id) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const result = await role.findById(id)
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 新增角色
 * @param {*} ctx
 */
exports.create = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-新增角色'))
    await role.create(ctx.request.body)
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 修改角色
 */
exports.update = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-修改角色'))
    await role.update(ctx.params.id, ctx.request.body)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 删除角色
 */
exports.delete = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-删除角色'))
    const id = ctx.params.id
    if (!id) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    await role.delete(id)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 查询视频资源属性
 */
exports.findProperties = async ctx => {
  try {
    // 视频资源id
    const resId = ctx.query.resId
    // 角色id
    const roleId = ctx.query.roleId
    // 通行底库中的人脸权限数据
    const id = ctx.query.id
    // 是否是用户管理模块调用
    const isUserManage = ctx.query.isUserManage
    const type = ctx.query.type
    const result = await role.findProperties(resId, roleId, isUserManage, type, id)
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 获取模块列表
 */
exports.getModules = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-查询模块列表'))
    const result = await role.getModules()
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 角色列表上下移动
 */
exports.updown = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-移动位置'))
    const type = ctx.request.body.type
    const id = ctx.params.id
    const updateId = ctx.request.body.id
    if (type === 'user') {
      const [user, updateUser] = await Promise.all([User.findById(id), User.findById(updateId)])
      const order = user.order
      user.order = updateUser.order
      updateUser.order = order
      await Promise.all([user.save(), updateUser.save()])
    } else {
      const [role, updateRole] = await Promise.all([RoleModel.findById(id), RoleModel.findById(updateId)])
      const order = role.order
      role.order = updateRole.order
      updateRole.order = order
      await Promise.all([role.save(), updateRole.save()])
    }
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 获取电视墙列表
 */
exports.findWalls = async ctx => {
  try {
    const data = await TVWall.find({}, 'name')
      .sort({ _id: -1 })
      .lean()
      .exec()
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 根据角色id获取电视墙权限
 */
exports.getWallAuth = async roleId => {
  try {
    const data = await PropertyModel.find({ role: roleId, 'properties.0': 'show' }).lean()
    let wallId = []
    if (!_.isEmpty(data)) {
      wallId = data.map(n => n.resource + '')
    }
    return wallId
  } catch (err) {
    handleSysException(err)
  }
}

/**
 * 获取角色管理页面通行底库数据
 */
exports.getPassManageData = async ctx => {
  try {
    // 获取type为10的机构树
    const orgs = await Org.find({ type: 10 }, 'name pid isroot').lean()
    for (let item of orgs) {
      if (item.isroot) {
        item.isPassRoot = true
        break
      }
    }
    const orgTree = transData2Tree(orgs, '_id', 'pid').pop()
    const passerOrg = {
      _id: new mongoose.Types.ObjectId(),
      name: '人员机构',
      children: [orgTree]
    }
    let doorPermissions = await DoorPermission.find({}, 'name').lean()
    for (let item of doorPermissions) {
      item = Object.assign(item, { type: 'door' })
    }
    const doorPermissionObj = {
      _id: new mongoose.Types.ObjectId(),
      name: '门禁卡权限',
      children: doorPermissions
    }
    const facePermissionObj = {
      _id: new mongoose.Types.ObjectId(),
      name: '人脸权限',
      children: []
    }
    const result = {
      _id: new mongoose.Types.ObjectId(),
      name: '根节点',
      isroot: true,
      children: [passerOrg, doorPermissionObj]
    }
    const arr = await role.getFacePermissionList()
    facePermissionObj.children = arr
    result.children.push(facePermissionObj)
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}

/**
 * 通行底库模糊搜素
 */
exports.getPassGroupData = async ctx => {
  try {
    const name = ctx.query.name
    let [orgs, doorPermissions, facePermissions] = await Promise.all([
      Org.find({ name: { $regex: name }, type: 10 }, 'name pid').lean(),
      DoorPermission.find({ name: { $regex: name } }, 'name').lean(),
      role.getFacePermissionList()
    ])
    for (let item of doorPermissions) {
      item = Object.assign(item, { type: 'door' })
    }
    if (facePermissions.length) {
      facePermissions = facePermissions.filter(item => item.name.indexOf(name) !== -1)
    }
    ctx.body = orgs.concat(doorPermissions).concat(facePermissions)
  } catch (err) {
    handleSysException(err)
  }
}
