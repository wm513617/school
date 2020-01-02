/*
 * @Author: linhang
 * @Date: 2018-10-17 13:36:55
 * @Last Modified by: linhang
 * @Last Modified time: 2018-10-19 16:46:39
 */

const { handleSysException } = require('../../../common/tools')
const Strategy = require('./strategy.service')
const strategy = new Strategy()
/**
 * 查询安全策略信息
 * @param {*} ctx
 */
exports.find = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-查询安全策略数据'))
    const results = await strategy.find()
    ctx.body = results
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 修改安全策略
 * @param {*} ctx 上下文
 */
exports.update = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('用户管理-修改安全策略'))
    await strategy.update(ctx.request.body)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
