/*
 * @Author: lushengying
 * @Date: 2019-05-10 11:15:19
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-05-13 14:20:39
 */

'use strict'
// const mongoose = require('mongoose')
const _ = require('lodash')
const { handleSysException } = require('../../../common/tools')
// const moment = require('moment')
// const tool = require('../../../common/tools')
const LogService = require('./log.service')
const logService = new LogService()

// 录像拷贝列表
module.exports.getRecode = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-查询录像拷贝日志'))
    const results = await logService.getReAll(ctx)
    ctx.status = 200
    ctx.body = results.results
  } catch (err) {
    handleSysException(err)
  }
}
// 增加录像拷贝日志
module.exports.createRecode = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-创建录像拷贝日志'))
    const body = ctx.request.body
    const data = await logService.createRe(body)
    ctx.status = 200
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
// 更新录像拷贝日志
module.exports.updateRecode = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-修改录像拷贝日志'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const body = ctx.request.body
    const data = await logService.updateRe(id, body)
    ctx.status = 200
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}

// 删除录像拷贝日志
module.exports.deleteRecode = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-删除录像拷贝日志'))
    const ids = ctx.request.header['x-bsc-ids'].split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    await logService.deleteRe(ids)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 获取设备巡查列表
module.exports.getdevPatrol = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-新增设备巡查日志'))
    const results = await logService.getDeAll(ctx)
    ctx.status = 200
    ctx.body = results.results
  } catch (err) {
    handleSysException(err)
  }
}
// 创建设备巡查
module.exports.createdevPatrol = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-修改设备巡查日志'))
    const body = ctx.request.body
    const data = await logService.createDe(body)
    ctx.status = 200
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
// 修改设备巡查
module.exports.updatedevPatrol = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-更新设备巡查日志'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const body = ctx.request.body
    const data = await logService.updateDe(id, body)
    ctx.status = 200
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}

// 删除设备巡查
module.exports.deletedevPatrol = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-删除设备巡查日志'))
    const ids = ctx.request.header['x-bsc-ids'].split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    await logService.deleteDe(ids)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

module.exports.getDevice = async ctx => {
  try {
    const result = await logService.getDevice()
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
module.exports.getResource = async ctx => {
  try {
    const result = await logService.getResource()
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
