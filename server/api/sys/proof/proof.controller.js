/*
 * @Author: linhang
 * @Date: 2018-08-17 15:29:36
 * @Last Modified by: linhang
 * @Last Modified time: 2018-12-18 10:08:44
 */
'use strict'
const mongoose = require('mongoose')
const Proof = mongoose.model('Proof')
const _ = require('lodash')
const moment = require('moment')
const { devManualTime, devNotice } = require('../../bstar/dev.interface')
const { handleSysException } = require('../../../common/tools')

// 获取服务器当前时间和自动校时的数据
exports.get = async ctx => {
  try {
    const result = await Proof.findOne()
      .lean()
      .exec()
    const time = moment().format('X')
    if (_.isEmpty(result)) {
      ctx.body = {
        serverTime: time
      }
    } else {
      result.serverTime = time
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err)
  }
}

// 发送命令给前端设备
exports.setTime = async ctx => {
  try {
    const time = moment().format('YYYY-MM-DD HH:mm:ss')
    const data = {
      devInfo: time
    }
    // 调用北京接口,手动校时
    await devManualTime({ ctx, data })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 增加或者修改系统校时
exports.update = async ctx => {
  try {
    const proof = ctx.request.body
    await Proof.findOneAndUpdate({ deviceSelected: true }, proof, { upsert: true })
    // 调用北京接口，自动校时
    await devNotice({ ctx, data: { module: 'correctdevtime' } })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
