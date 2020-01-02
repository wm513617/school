/*
 * 杆接口
 * @Author: chenkaibo
 * @Date: 2018-10-28 17:04:13
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-12-20 15:58:29
 */
'use strict'

const { handleSysException } = require('../../../common/tools')
const PoleService = require('./pole.service')
const poleService = new PoleService()
const ModelService = require('../../sys/setting/model/model.service')
const modelService = new ModelService()
// 添加杆
exports.add = async ctx => {
  try {
    const data = ctx.request.body
    // 获取默认模型
    const key = '161'
    const model = await modelService.findOne({ oid: key, default: true }, '_id')
    if (!model) {
      ctx.throw(500, { code: 4003, message: '请先添加模型！' })
    }
    data.mid = model._id
    const pole = await poleService.add(data)
    ctx.body = pole
  } catch (error) {
    handleSysException(error)
  }
}
// 获取全部
exports.getAll = async ctx => {
  try {
    const poles = await poleService.findByQuery({}, 'mid')
    ctx.body = poles
  } catch (error) {
    handleSysException(error)
  }
}
// 获取
exports.getOne = async ctx => {
  try {
    const pole = await poleService.findById(ctx.params.id, 'mid')
    ctx.body = pole
  } catch (error) {
    handleSysException(error)
  }
}
// 修改
exports.updateOne = async ctx => {
  try {
    await poleService.updateById(ctx.params.id, ctx.request.body)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 杆删除
exports.delete = async ctx => {
  try {
    await poleService.deleteOne(ctx.params.id)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
