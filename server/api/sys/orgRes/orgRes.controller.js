'use strict'

const mongoose = require('mongoose')

const OrgRes = mongoose.model('OrgRes')

const _ = require('lodash')

// 添加完报警输入、输出，再调用此接口（防止已添加的报警输入、输出被再次添加）
exports.add = async ctx => {
  try {
    const reses = ctx.request.body.resource
    const orgReses = []
    if (_.isArray(reses)) {
      reses.forEach(item => {
        orgReses.push({
          insertOne: {
            document: {
              resource: item,
              rootorg: ctx.request.body.rootorg,
              org: ctx.request.body.org,
              islane: false
            }
          }
        })
      })
    }
    await OrgRes.bulkWrite(orgReses)
    ctx.status = 200
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 删除中间表数据
exports.del = async ctx => {
  const { resource, org } = ctx.query
  if (!resource || !org) {
    return ctx.throw(500, { code: 1008, message: '参数不能为空' })
  }
  try {
    const resArr = resource.split(',')
    for (let i = 0; i < resArr.length; i++) {
      await OrgRes.findOneAndRemove({ resource: resArr[i], org: org }).exec()
    }
    ctx.status = 200
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
