/*
 * @Author: chenkaibo
 * @Date: 2018-07-11 10:39:24
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-04-24 15:16:34
 */
'use strict'
const mongoose = require('mongoose')
const Building = mongoose.model('Building3D')
const Storey = mongoose.model('Storey3D')
const Resource = mongoose.model('Resource')
const postal = require('postal')
const { handleSysException } = require('../../../common/tools')

/**
 * 获取3D楼宇(全部)
 */
exports.getAll = async (ctx) => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取所有楼宇信息'))
    let builds
    let count
    const conditions = {
      name: {
        $regex: ctx.query.buildname + '' || ''
      }
    }
    if (ctx.query.buildpage && ctx.query.buildlimit) {
      [count, builds] = await Promise.all([
        Building.countDocuments(conditions),
        ctx.query.buildname ? Building.find(conditions).skip((+ctx.query.buildpage - 1) * (+ctx.query.buildlimit))
          .limit(+ctx.query.buildlimit).exec() : Building.find().skip((+ctx.query.buildpage - 1) * (+ctx.query.buildlimit)).limit(+ctx.query.buildlimit).exec()
      ])
    } else {
      [count, builds] = await Promise.all([
        Building.countDocuments().exec(),
        Building.find({}).exec()
      ])
    }
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': ctx.query.buildlimit ? Math.ceil(count / ctx.query.buildlimit) : 0,
      'X-BSC-CUR': ctx.query.buildpage ? parseInt(ctx.query.buildpage) : 0,
      'X-BSC-LIMIT': ctx.query.buildlimit ? parseInt(ctx.query.buildlimit) : 0
    })
    ctx.body = builds
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取3D楼宇
 */
exports.getOne = async (ctx) => {
  try {
    const build = await Building.findOne({ code: String(ctx.params.id) }).exec()
    if (!build) {
      ctx.body = {}
      return
    }
    const storeys = await Storey.find({ bid: build._id + '' }).lean().exec()
    build.storeys = storeys
    ctx.body = build
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 添加3D楼宇
 */
exports.add = async (ctx) => {
  try {
    await Building.create(ctx.request.body)
    ctx.body = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 修改3D楼宇
 */
exports.update = async (ctx) => {
  try {
    await Building.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
    ctx.body = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 删除楼宇
 */
exports.del = async (ctx) => {
  try {
    // 删除该楼宇内楼层下的所有点位
    const storeyIds = await Storey.find({
      bid: ctx.params.id
    }, '_id').exec()
    await Resource.updateMany({
      'point3D': {
        $nin: [null, undefined]
      },
      'point3D.sid': {
        $in: storeyIds
      }
    }, { $unset: { point3D: 1 } }, { multi: true }).exec()
    // 保存网格
    await Building.findByIdAndRemove(ctx.params.id).exec() // 删除楼宇
    await Storey.remove({ bid: ctx.params.id }).exec() // 删除所有楼层
    postal.publish({
      topic: 'array.delete',
      channel: 'sentry:position',
      data: {
        id: ctx.params.id,
        mapType: '3D'
      }
    })
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
// 获取指定楼宇下的所有楼层
exports.getStorey = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取所有楼层'))
    const building = await Building.findOne({ code: String(ctx.params.id) }).exec()
    const storeys = await Storey.find({ bid: ctx.params.id }).exec()
    ctx.body = {
      building,
      storey: storeys
    }
  } catch (err) {
    handleSysException(err)
  }
}

// 搜索楼宇下楼层的名称
exports.storeySearch = async ctx => {
  ctx.set('loginfo', encodeURI('地图管理-搜索楼层名称'))
  try {
    const conditions = {
      name: {
        $regex: ctx.query.name + '' || ''
      },
      bid: ctx.params.id
    }
    const storeys = await Storey.find(conditions).exec()
    ctx.body = {
      storey: storeys
    }
  } catch (error) {

  }
}
