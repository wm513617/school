/*
 * 布局接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:58:21
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-08-31 11:40:52
 */

'use strict'
const mongoose = require('mongoose')
const Layout = mongoose.model('Layout')
const { handleSysException } = require('../../../../common/tools')

// 获取单个电视墙所有布局
exports.get = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-获取所有布局'))
    const layouts = await Layout.find({ wall: ctx.params.wall, sceneid: { $ne: -1 } }).lean().exec()
    ctx.status = 200
    ctx.body = layouts
  } catch (error) {
    handleSysException(error)
  }
}

// 添加一个布局
exports.add = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-添加布局'))
    // const flag = await checkRepeat('add', Layout, { name: ctx.request.body.name })
    // if (flag) ctx.throw(500, { code: 500, message: '布局名称重复' })
    const doc = await Layout.create(ctx.request.body)
    ctx.set('Location', `/layout/${doc._id}`)
    ctx.status = 201
    ctx.body = doc
  } catch (error) {
    handleSysException(error)
  }
}

// 修改一个布局
exports.modify = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-修改布局'))
    // const flag = await checkRepeat('add', Layout, { name: ctx.request.body.name }, ctx.params.id)
    // if (flag) ctx.throw(500, { code: 500, message: '布局名称重复' })
    await Layout.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 删除一个布局
exports.delete = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-删除布局'))
    await Layout.findByIdAndRemove(ctx.params.id).exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
