/*
 * 防区资源接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:49:40
 * @Last Modified by:   chenkaibo
 * @Last Modified time: 2018-06-06 14:49:40
 */

'use strict'

const { addFireAlarmIn, delFireAlarmIn } = require('../../bstar/dev.interface')
const tool = require('../../../common/tools')
const _ = require('lodash')

const OrgRes = require('mongoose').model('OrgRes')
const Org = require('mongoose').model('Org')
// 添加输入防区
exports.addFireAlarmIn = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-添加输入防区'))
    try {
      await addFireAlarmIn({ ctx: ctx })
    } catch (error) {
      return ctx.throw(500, { code: error.error, message: '请求第三方接口异常', type: 'sys' })
    } // 调用北京接口添加输入防区
    // 添加orgRes记录
    const fireAlarmList = ctx.request.body.fireAlarmList
    const orgReses = []
    const rootOrg = await Org.findOne({ isroot: true, type: 0 }).exec()
    if (_.isArray(fireAlarmList)) {
      fireAlarmList.forEach(item => {
        orgReses.push({
          insertOne: {
            document: {
              resource: item.channelId,
              rootorg: rootOrg._id,
              org: item.orgId,
              islane: false
            }
          }
        })
      })
    }
    await OrgRes.bulkWrite(orgReses)
    ctx.status = 200
  } catch (err) {
    tool.handleSysException(err)
  }
}

// 删除输入防区
exports.delFireAlarmIn = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-删除输入防区'))
    const { resource, org } = ctx.query
    if (!resource || !org) {
      return ctx.throw(500, { code: 1008, message: '参数不能为空' })
    }
    try {
      await delFireAlarmIn({ ctx: ctx })
    } catch (error) {
      return ctx.throw(500, { code: error.error, message: '请求第三方接口异常', type: 'sys' })
    }
    // 删除orgRes记录
    const resArr = resource.split(',')
    for (let i = 0; i < resArr.length; i++) {
      await OrgRes.findOneAndRemove({ resource: resArr[i], org: org }).exec()
    }
    ctx.status = 200
  } catch (err) {
    tool.handleSysException(err)
  }
}
