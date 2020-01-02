/*
 * @Author: linhang
 * @Date: 2018-10-19 16:45:51
 * @Last Modified by: linhang
 * @Last Modified time: 2018-12-18 19:10:02
 */

'use strict'
const { handleSysException } = require('../../../common/tools')
const User = require('./user.service')
const moment = require('moment')
const user = new User()
/**
 * 用户管理首页
 * @param {*} ctx
 */
exports.index = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-账户首页'))
    const result = await user.index()
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 修改用户密码
 */
exports.updatePwd = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-修改用户密码'))
    const id = ctx.params.id
    const body = ctx.request.body
    const result = await user.updatePwd(id, body)
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 系统日志查询
 */
exports.getLog = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('系统日志-查询'))
    const result = await user.getLog(ctx)
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 增加系统日志
 */
exports.createLog = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('增加系统日志'))
    const body = ctx.request.body
    body.userName = ctx.state.user.name
    body.time = moment().format('X')
    body.clientIp = ctx.ip
    body.state = '成功'
    await user.createLog(body)
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 值班用户的日志查询
 * @param {*} ctx
 */
exports.duty = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取单兵报警'))
  try {
    const result = await user.queryDutyUserLog(ctx)
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    handleSysException(error, 2002)
  }
}
/**
 * 获取值班用户
 * @param {*} ctx
 */
exports.dutyUser = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('获取值班用户'))
    const time = ctx.state.user.time
    const result = await user.getDutyUsers(Number(time))
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    handleSysException(error, 2002)
  }
}
/**
 * 查询单个用户
 * @param {*} ctx
 */
exports.findById = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-查询'))
    const id = ctx.params.id
    if (!id) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const result = await user.findById(id)
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 新增用户
 * @param {*} ctx
 */
exports.create = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-新增'))
    await user.create(ctx.request.body)
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 更新用户
 * @param {*} ctx
 */
exports.update = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-修改'))
    const id = ctx.params.id
    if (!id) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    await user.update(id, ctx.request.body)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 删除用户
 * @param {*} ctx
 */
exports.delete = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-删除用户'))
    const id = ctx.params.id
    if (!id) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    await user.delete(id)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 用户登录
 * @param {*} ctx
 */
exports.login = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-登录'))
    const device = ctx.request.header['x-bsc-app']
    const postData = ctx.request.body
    postData.ip = ctx.ip
    const result = await user.login(device, postData)
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 用户账户测试[pc端]
 */
exports.test = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-账户测试'))
    const postData = ctx.request.body
    postData.loginTime = ctx.state.user.time
    postData.log = ctx.state.user.log
    const result = await user.test(postData)
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 用户退出
 * @param {*} ctx
 */
exports.logout = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-退出'))
    await user.logout(ctx)
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 交接班日志查询
 */
exports.getChangeLog = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-退出'))
    await user.getChangeLog(ctx)
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 系统日志导出
 */
exports.logExport = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('系统日志-导出'))
    const buffer = await user.logExport(ctx)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = moment().format('YYYY-MM-DD')
    ctx.attachment('系统日志-' + timeStr + '.xlsx'.toString('utf8'))
    ctx.body = buffer
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 查询用户详细日志
 */
exports.getUserLog = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户日志-查询'))
    await user.getUserLog(ctx)
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 查询用户详细日志，按照条件查询
 * @param {*} ctx
 */
exports.getUserLogDetail = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户日志-条件查询'))
    await user.getUserLogDetail(ctx)
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 按照ukey查找用户
 * @param {*} ctx
 */
exports.findByKeys = async ctx => {
  try {
    let keys = ctx.request.headers['x-bsc-keys']
    keys = keys.split(',')
    const users = await user.findByKeys(keys)
    ctx.body = users
  } catch (err) {
    handleSysException(err)
  }
}
