/*
 * @Author: linhang
 * @Date: 2018-10-18 11:14:51
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-26 14:17:38
 */
'use strict'
const mongoose = require('mongoose')
const RoleModel = mongoose.model('Role')
const ActionModel = mongoose.model('Action')
const tool = require('../../../common/tools')
const PropertyModel = mongoose.model('ResProperty')
const User = mongoose.model('User')
const _ = require('lodash')
const redis = require('../../../config/redis')
const postal = require('postal')
const Resource = mongoose.model('Resource')
const Device = mongoose.model('Device')
const Wall = mongoose.model('Wall')
const Action = mongoose.model('Action')
const Org = mongoose.model('Org')
const OrgRes = mongoose.model('OrgRes')
const DoorPermission = mongoose.model('doorPermission')
const { ORG_TYPE } = require('../../../common/constant')
const ServiceConfig = mongoose.model('serviceConfig')
const rp = require('request-promise')

// 常量定义
const CONSTANT = {
  ADMIN_NAME: '超级管理员', // 超级管理员默认名称
  RESOUECE_TYPE: 0, // 视频资源type为0
  FUNC_TYPE: '1', // 功能模块类型'1'
  SYS_TYPE: '2' // 系统模块类型'2'
}
/**
 * 角色管理
 */
class Role {
  /**
   * 查询角色数据,默认展示超级管理员数据
   */
  constructor() {
    this.delFuncActions = []
    this.delSysActions = []
  }
  async find() {
    try {
      const roles = await RoleModel.find({}, 'name')
        .sort({ order: 1 })
        .lean()
        .exec()
      return roles
    } catch (err) {
      throw err
    }
  }
  /**
   * 获取权限数据
   */
  async findAuth() {
    // 1|功能模块，2|系统模块
    try {
      let [funcModules, sysModules] = await Promise.all([
        await ActionModel.find({ isapi: false, moduleType: CONSTANT.FUNC_TYPE }, 'name pid')
          .sort({ order: -1 })
          .lean()
          .exec(),
        await ActionModel.find({ isapi: false, moduleType: CONSTANT.SYS_TYPE }, 'name pid')
          .sort({ order: -1 })
          .lean()
          .exec()
      ])
      funcModules = tool.transData2Tree(funcModules, '_id', 'pid')
      const funcTree = this.dealActions(funcModules)
      sysModules = tool.transData2Tree(sysModules, '_id', 'pid')
      const sysTree = this.dealActions(sysModules)
      this.delFuncActions = funcTree.delActions
      this.delSysActions = sysTree.delActions
      return {
        funcModules: funcTree.tree,
        sysModules: sysTree.tree
      }
    } catch (err) {
      throw err
    }
  }
  /**
   * 处理树结构，去掉第三层子
   * @param {*} tree
   */
  dealActions(tree) {
    try {
      let delActions = []
      const root = tree[0]
      if (_.has(root, 'children')) {
        for (let item of root.children) {
          if (_.has(item, 'children')) {
            for (let item1 of item.children) {
              if (_.has(item1, 'children')) {
                delActions = delActions.concat(item1.children)
                delete item1.children
              }
            }
          }
        }
      }
      return {
        tree: tree,
        delActions: delActions
      }
    } catch (err) {
      throw err
    }
  }
  /**
   * 从删除的子里面获取action的id
   * @param {*} arr
   */
  getActionIds(arr, actionIds = []) {
    arr.forEach(item => {
      actionIds.push(item._id + '')
      if (_.has(item, 'children')) {
        this.getActionIds(item.children, actionIds)
      }
    })
    return actionIds
  }
  /**
   *根据id查找角色数据
   * @param {*} id
   */
  async findById(id) {
    try {
      let [role, funcModules, sysModules] = await Promise.all([
        await RoleModel.findById(id, 'name actions resources order loginType')
          .lean()
          .exec(),
        await ActionModel.find({ isapi: false, moduleType: CONSTANT.FUNC_TYPE }, 'muduleType')
          .lean()
          .exec(),
        await ActionModel.find({ isapi: false, moduleType: CONSTANT.SYS_TYPE }, 'muduleType')
          .lean()
          .exec()
      ])
      let funcActions = []
      let sysActions = []
      if (!_.isEmpty(role.actions)) {
        const actions = role.actions.map(item => item + '')
        // 获取功能模块action的id数组
        funcModules = funcModules.filter(item => actions.includes(item._id + ''))
        funcActions = funcModules.map(item => item._id + '')
        // 获取系统模块action的id数组
        sysModules = sysModules.filter(item => actions.includes(item._id + ''))
        sysActions = sysModules.map(item => item._id + '')

        // 过滤actionIds
        const delFuncActionIds = this.getActionIds(this.delFuncActions)
        funcActions = funcActions.filter(item => !delFuncActionIds.includes(item))
        const delSysActionIds = this.getActionIds(this.delSysActions)
        sysActions = sysActions.filter(item => !delSysActionIds.includes(item))
      }
      role.funcActions = funcActions
      role.sysActions = sysActions
      delete role.actions
      // 查询该角色拥有的每一类资源权限
      const [
        videoResIds,
        alarmResIds,
        fireResIds,
        alarmHelpResIds,
        wallIds,
        faceResIds,
        doorGroupIds,
        zkFaceIds
      ] = await Promise.all([
        PropertyModel.distinct('resource', { role: id, type: 0, 'properties.0': { $exists: true } }), // 视频资源id
        PropertyModel.distinct('resource', { role: id, type: 1, 'properties.0': { $exists: true } }), // 报警后资源id
        PropertyModel.distinct('resource', { role: id, type: 2, 'properties.0': { $exists: true } }), // 消防设备id
        PropertyModel.distinct('resource', { role: id, type: 3, 'properties.0': { $exists: true } }), // 报警资源id
        PropertyModel.distinct('resource', { role: id, type: 4, 'properties.0': { $exists: true } }), // 人脸资源id
        PropertyModel.distinct('resource', { role: id, type: 5, 'properties.0': { $exists: true } }), // 电视墙资源id
        PropertyModel.distinct('resource', { role: id, type: 6, 'properties.0': { $exists: true } }), // 获取人员机构和门禁卡权限id
        PropertyModel.distinct('id', { role: id, type: 6, 'properties.0': { $exists: true } }) // 获取中控人脸权限
      ])
      role.resources = {
        0: videoResIds,
        1: alarmResIds,
        2: fireResIds,
        3: alarmHelpResIds,
        4: wallIds,
        5: faceResIds,
        6: doorGroupIds.concat(zkFaceIds)
      }
      return role
    } catch (err) {
      throw err
    }
  }
  /**
   * 创建角色
   * @param {*} obj
   */
  async create(obj) {
    try {
      const [orders, roles] = await Promise.all([
        RoleModel.distinct('order'),
        RoleModel.find({ name: obj.name })
          .lean()
          .exec()
      ])
      orders.sort((a, b) => {
        return b - a
      })
      obj.order = orders[0] + 1
      if (!_.isEmpty(roles)) {
        throw new Error('角色名称重复')
      }
      // 如果有属性_id,则是复制角色，反之是新增
      if (_.has(obj, 'id')) {
        // 如果是复制的超级管理员角色，从数据库中查到所有的资源，分配给新的角色
        // 查询人脸设备
        const orgs = await Org.find({ type: ORG_TYPE.FACE_CAPTURE }, 'name order isroot pid').lean()
        const allOrgIds = orgs.map(item => item._id)
        if (obj.id === '5be27279e74ee9376c681111') {
          const deviceIds = await Device.distinct('_id', { type: { $in: ['alarmBox', 'alarmPillar'] } })
          const [
            videoResIds,
            alarmResIds,
            fireResIds,
            alarmHelpResIds,
            wallIds,
            actions,
            faceResIds,
            facePermissionOrgIds,
            doorPermissionIds
          ] = await Promise.all([
            Resource.distinct('_id', { type: 0, eid: { $nin: deviceIds } }),
            Resource.distinct('_id', { type: { $in: [1, 9] } }),
            Resource.distinct('_id', { type: 11 }),
            Resource.distinct('_id', { eid: { $in: deviceIds } }),
            Wall.distinct('_id'),
            Action.distinct('_id'),
            OrgRes.distinct('resource', { islane: false, org: { $in: allOrgIds } }),
            Org.distinct('_id', { type: 10, isroot: false }),
            DoorPermission.distinct('_id')
          ])
          delete obj.id
          obj.actions = actions
          const roleObj = await RoleModel.create(obj)
          // 添加视频资源权限
          const propArr = []
          for (let item of videoResIds) {
            const obj = {
              role: roleObj._id,
              resource: item,
              properties: ['preview', 'cloudControl', 'playback', 'download'],
              type: 0
            }
            propArr.push(obj)
          }
          // 添加报警设备权限
          for (let item of alarmResIds) {
            const obj = {
              role: roleObj._id,
              resource: item,
              properties: [
                'alarmReceive',
                'alarmConfirm',
                'alarmClean',
                'deployment',
                'disarming',
                'clean',
                'bypass',
                'removeBypass'
              ],
              type: 1
            }
            propArr.push(obj)
          }
          // 添加消防资源权限
          for (let item of fireResIds) {
            const obj = {
              role: roleObj._id,
              resource: item,
              properties: ['alarmReceive', 'alarmConfirm', 'alarmClean'],
              type: 2
            }
            propArr.push(obj)
          }
          // 添加报警求助设备权限
          for (let item of alarmHelpResIds) {
            const obj = {
              role: roleObj._id,
              resource: item,
              properties: ['alarmReceive', 'alarmConfirm', 'alarmClean'],
              type: 3
            }
            propArr.push(obj)
          }
          // 添加电视墙权限
          for (let item of wallIds) {
            const obj = {
              role: roleObj._id,
              resource: item,
              properties: ['show'],
              type: 4
            }
            propArr.push(obj)
          }
          // 添加人脸设备权限
          for (let item of faceResIds) {
            const obj = {
              role: roleObj._id,
              resource: item,
              properties: ['alarmReceive', 'alarmConfirm', 'alarmClean'],
              type: 5
            }
            propArr.push(obj)
          }
          // 添加中控人脸权限
          for (let item of facePermissionOrgIds) {
            const obj = {
              role: roleObj._id,
              resource: item,
              properties: [
                'show',
                'createOrg',
                'delOrg',
                'updateOrg',
                'createUser',
                'delUser',
                'updateUser',
                'moveUser',
                'expireDate',
                'copy',
                'importExport',
                'updatePermission'
              ],
              type: 6
            }
            propArr.push(obj)
          }
          for (let item of doorPermissionIds) {
            const obj = {
              role: roleObj._id,
              resource: item,
              properties: ['show'],
              type: 6
            }
            propArr.push(obj)
          }
          // 第三方获取人脸权限列表
          const facePermissionList = await this.getFacePermissionList()
          if (facePermissionList.length) {
            for (let item of facePermissionList) {
              const obj = {
                role: roleObj._id,
                id: item.id,
                properties: ['show'],
                type: 6
              }
              propArr.push(obj)
            }
          }
          await PropertyModel.collection.insertMany(propArr)
          return
        } else {
          const role = await RoleModel.findById(obj.id)
            .lean()
            .exec()
          obj.actions = role.actions
          delete obj._id
          // 更新角色表
          const [roleObj, props] = await Promise.all([
            RoleModel.create(obj),
            PropertyModel.find({ role: obj.id }).lean()
          ])
          // 新增角色时，更新redis权限缓存
          postal.publish({
            channel: 'role',
            topic: 'role.update',
            data: {
              roleId: roleObj._id + ''
            }
          })
          props.forEach(item => {
            delete item._id
            item.role = roleObj._id
          })
          // 更新属性表
          await PropertyModel.create(props)
          return
        }
      } else {
        // 如果没有属性id，则是新建角色
        const roleObj = await RoleModel.create(obj)
        // 新增角色时，更新redis权限缓存
        postal.publish({
          channel: 'role',
          topic: 'role.update',
          data: {
            roleId: roleObj._id + ''
          }
        })
      }
    } catch (err) {
      throw err
    }
  }
  /**
   * 修改角色
   * @param {*} id
   * @param {*} obj
   */
  async update(id, obj) {
    try {
      const resProp = obj.resource
      if (!_.isEmpty(resProp)) {
        const [videoRes, alarmRes, fireRes, helpRes, wallRes, faceRes, personAndDoorRes, zkFaceRes] = [
          [],
          [],
          [],
          [],
          [],
          [],
          [],
          []
        ]
        resProp.forEach(item => {
          if (item.type === 0) {
            videoRes.push(item.resId)
          }
          if (item.type === 1) {
            alarmRes.push(item.resId)
          }
          if (item.type === 2) {
            fireRes.push(item.resId)
          }
          if (item.type === 3) {
            helpRes.push(item.resId)
          }
          if (item.type === 4) {
            wallRes.push(item.resId)
          }
          if (item.type === 5) {
            faceRes.push(item.resId)
          }
          if (item.type === 6) {
            if (item.resId) {
              personAndDoorRes.push(item.resId)
            } else if (item.id) {
              zkFaceRes.push(item.id)
            }
          }
        })
        await Promise.all([
          PropertyModel.deleteMany({ role: id, type: 0, resource: { $in: videoRes } }),
          PropertyModel.deleteMany({ role: id, type: 1, resource: { $in: alarmRes } }),
          PropertyModel.deleteMany({ role: id, type: 2, resource: { $in: fireRes } }),
          PropertyModel.deleteMany({ role: id, type: 3, resource: { $in: helpRes } }),
          PropertyModel.deleteMany({ role: id, type: 4, resource: { $in: wallRes } }),
          PropertyModel.deleteMany({ role: id, type: 5, resource: { $in: faceRes } }),
          PropertyModel.deleteMany({ role: id, type: 6, resource: { $in: personAndDoorRes } }),
          PropertyModel.deleteMany({ role: id, type: 6, id: { $in: zkFaceRes } })
        ])
        const arr = []
        resProp.forEach(item => {
          const obj = {}
          obj.role = mongoose.Types.ObjectId(id)
          obj.properties = item.prop
          obj.type = item.type
          // 如果有id字段，则是人员底库下面的人脸权限列表数据
          if (item.id) {
            obj.id = item.id
          } else if (item.resId) {
            obj.resource = mongoose.Types.ObjectId(item.resId)
          }
          arr.push(obj)
        })
        await PropertyModel.collection.insertMany(arr)
        // 更新角色表
        delete obj.resource
        await RoleModel.findByIdAndUpdate(id, obj)
        // 修改角色资源权限后更新redis缓存
        postal.publish({
          channel: 'role',
          topic: 'role.update',
          data: {
            roleId: id
          }
        })
      } else {
        delete obj.resource
        await RoleModel.findByIdAndUpdate(id, obj)
      }
    } catch (err) {
      throw err
    }
  }
  /**
   * 删除角色
   * @param {*} id
   */
  async delete(id) {
    try {
      const users = await User.findOne({ role: id }).exec()
      if (users) {
        throw new Error('有用户分配了该角色，不能删除')
      }
      await RoleModel.findByIdAndRemove(id).exec()
    } catch (err) {
      throw err
    }
  }
  /**
   * 查询某个视频资源的属性
   * @param {*} id
   */
  async findProperties(resId, roleId, isUserManage, type, id = null) {
    try {
      if (roleId === '5be27279e74ee9376c681111') {
        return {
          properties: [
            'preview',
            'cloudControl',
            'playback',
            'download',
            'alarmReceive',
            'alarmConfirm',
            'alarmClean',
            'deployment',
            'disarming',
            'clean',
            'bypass',
            'removeBypass',
            'show',
            'createOrg',
            'delOrg',
            'updateOrg',
            'createUser',
            'delUser',
            'updateUser',
            'moveUser',
            'expireDate',
            'copy',
            'importExport',
            'updatePermission'
          ]
        }
      } else {
        // 如果是用户管理模块调用，从数据库中查询，如果是其他模块调用则从缓存中取
        if (isUserManage) {
          if (resId) {
            const result = await PropertyModel.findOne({ resource: resId, role: roleId, type: type }, 'properties')
              .lean()
              .exec()
            return result || {}
            // 如果是商汤的人脸权限数据
          } else if (id) {
            const result = await PropertyModel.findOne({ id: id, role: roleId, type: type }, 'properties')
              .lean()
              .exec()
            return result || {}
          }
        } else {
          const key = roleId + resId + type
          const propertyStr = await redis.get(key)
          const property = JSON.parse(propertyStr)
          return property || {}
        }
      }
    } catch (err) {
      throw err
    }
  }
  async getModules() {
    try {
      const obj = await this.findAuth()
      const modules = []
      const funcModules = obj.funcModules[0].children
      funcModules.forEach(item => {
        modules.push(item.name)
      })
      const sysModules = obj.sysModules[0].children
      sysModules.forEach(item => {
        modules.push('系统-' + item.name)
      })
      return modules
    } catch (err) {
      throw err
    }
  }

  /**
   * @description 根据角色 ID 获取对应资源的 ID
   * @param {*} roleId 角色 ID
   * @returns 资源 ID 数组
   * @memberof Role
   */
  async getResIdsByRoleId(roleId) {
    // 如果是超级管理员，则默认返回空数组，代表拥有所用权限
    if (roleId === '5be27279e74ee9376c681111') {
      return []
    } else {
      const resIds = await PropertyModel.distinct('resource', { role: roleId, 'properties.0': { $exists: true } })
      return resIds
    }
  }
  /**
   * 获取中控人脸权限列表
   * @param {*} timeout
   */
  async getFacePermissionList() {
    try {
      // const serviceConfig = await ServiceConfig.findOne({ type: 2 }).lean()
      // if (!serviceConfig) {
      //   return []
      // }
      // const result = await this.refreshToken(serviceConfig)
      // if (result === -1) {
      //   return []
      // }
      // let data = await rp({
      //   method: 'GET',
      //   timeout: 2000,
      //   url: `http://${serviceConfig.ip}:${serviceConfig.port}/senseguard-watchlist-management/api/v1/libraries`,
      //   headers: {
      //     accessToken: global.senseTimeToken.token
      //   }
      // })
      // 测试数据------
      let data = {
        whitelists: [
          {
            libraryId: '111',
            libraryName: 'aaa',
            type: 'face'
          },
          {
            libraryId: '222',
            libraryName: 'bbb',
            type: 'face'
          }
        ],
        blacklists: [
          {
            libraryId: '333',
            libraryName: 'ccc',
            type: 'face'
          },
          {
            libraryId: '444',
            libraryName: 'ddd',
            type: 'face'
          }
        ]
      }
      data = JSON.stringify(data)
      // 测试数据------
      if (data) {
        data = JSON.parse(data)
        const arr = []
        if (data.whitelists && data.whitelists.length) {
          data.whitelists.forEach(item => {
            const objData = {
              _id: new mongoose.Types.ObjectId(),
              id: item.libraryId + '',
              name: item.libraryName,
              type: 'face'
            }
            arr.push(objData)
          })
        }
        if (data.blacklists && data.blacklists.length) {
          data.blacklists.forEach(item => {
            const objData = {
              _id: new mongoose.Types.ObjectId(),
              id: item.libraryId + '',
              name: item.libraryName,
              type: 'face'
            }
            arr.push(objData)
          })
        }
        return arr
      }
      return []
    } catch (error) {
      console.log(error.message)
      return []
    }
  }
  /**
   * 刷新商汤服务器用户token
   */
  async refreshToken(data) {
    try {
      let userToken = await rp({
        method: 'POST',
        timeout: 2000,
        url: `http://${data.ip}:${data.port}/senseguard-oauth2/api/v1/login`,
        json: true,
        body: {
          username: data.userName,
          password: data.passWord
        }
      })
      global.senseTimeToken = {
        token: userToken.accessToken,
        base64: Buffer.from(userToken.accessToken).toString('base64')
      }
      return 0
    } catch (error) {
      console.log(error.message)
      return -1
    }
  }
}
module.exports = Role
