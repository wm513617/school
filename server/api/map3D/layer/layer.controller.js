/*
 * @Author: hansen.liuhao
 * @Date: 2018-12-17 16:22:12
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-12-20 13:31:14
 */
const mongoose = require('mongoose')
const Layer3D = mongoose.model('Layer3D')
const { handleSysException } = require('../../../common/tools')

// 获取所有图层配置信息
module.exports.index = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电子地图-获取图层配置'))
    const result = await Layer3D.find({}, '-createdAt -updatedAt -__v').lean()
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    handleSysException(error, 500)
  }
}

// 新增图层配置信息
module.exports.add = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电子地图-增加图层配置'))
    if (ctx.request.body.isGround) {
      await Layer3D.updateMany({}, { isGround: false })
    }
    const result = await Layer3D.create(ctx.request.body)
    ctx.status = 201
    ctx.headers['location'] = ctx.url + result._id
    ctx.body = result._id
  } catch (error) {
    handleSysException(error, 500)
  }
}

// 修改图层配置信息
module.exports.update = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电子地图-更新图层配置'))
    const id = ctx.params.id || ''
    if (!id) {
      ctx.throw(500, { message: '缺失参数' })
    }
    if (ctx.request.body.isGround) {
      await Layer3D.updateMany({}, { isGround: false })
    }
    await Layer3D.findByIdAndUpdate(id, ctx.request.body)
    ctx.status = 200
    ctx.body = ''
  } catch (error) {
    handleSysException(error, 500)
  }
}

// 删除图层配置信息
module.exports.remove = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电子地图-删除图层配置'))
    const id = ctx.params.id || ''
    if (!id) {
      ctx.throw(500, { message: '缺失参数' })
    }
    await Layer3D.findByIdAndRemove(id)
    ctx.status = 200
    ctx.body = ''
  } catch (error) {
    handleSysException(error, 500)
  }
}
// 获取当前设为地面的图层
module.exports.getGround = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电子地图-获取当前地面图层'))
    const result = (await Layer3D.findOne({ isGround: true })) || 'null'
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    handleSysException(error, 500)
  }
}
