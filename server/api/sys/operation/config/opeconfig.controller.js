/*
 * 运维配置
 * @Author: lushengying
 * @Date: 2018-09-06 14:48:21
 * @Last Modified by: lushengying
 * @Last Modified time: 2018-10-18 20:02:36
 */
'use strict'

const mongoose = require('mongoose')

const MaintenanceUnit = mongoose.model('MaintenanceUnit')
const paging = require('../../../paging')
const { handleSysException } = require('../../../../common/tools')
const _ = require('lodash')

// 获取维护机构列表
exports.getAll = async ctx => {
  const resultObj = await paging.listQuery(MaintenanceUnit, {}, '', '', ctx.query.page, '', ctx)
  ctx.body = {
    devList: resultObj.results
  }
}
//  创建维护机构
exports.createMaint = async ctx => {
  try {
    const config = ctx.request.body
    await MaintenanceUnit.create(config)
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
//  删除维护机构
exports.delete = async ctx => {
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    MaintenanceUnit.findOneAndDelete({ _id: id }).exec()
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
//  对维护机构进行更新
exports.update = async ctx => {
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const config = ctx.request.body
    await MaintenanceUnit.findByIdAndUpdate(id, config)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
//  获取维护机构详情
exports.getInfo = async ctx => {
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    ctx.body = await MaintenanceUnit.findById(id, { maintenanceVendor: 1, contacts: 1 })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
