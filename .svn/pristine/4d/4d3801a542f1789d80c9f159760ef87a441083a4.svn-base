/*
 * @Author: chenkaibo
 * @Date: 2018-07-11 10:39:24
 * @Last Modified by: wanglei
 * @Last Modified time: 2018-09-28 14:04:12
 * @Last Modified time: 2019-07-02 11:23:51
 */
'use strict'
const mongoose = require('mongoose')
const Storey = mongoose.model('Storey3D')
const BuildingModel = mongoose.model('Building3D')
const ResourceModel = mongoose.model('Resource')
const postal = require('postal')
const imageSize = require('image-size')
const fs = require('fs')
const gfs = require('../../../common/gridfs.util')
const path = require('path')
const _ = require('lodash')
const config = require('../../../../config')
const { handleSysException, mkdirsSync } = require('../../../common/tools')

/**
 * 获取3D楼层(全部)
 */
exports.getAll = async ctx => {
  try {
    const stroeys = await Storey.find({}).exec()
    ctx.body = stroeys
  } catch (error) {
    handleSysException(error)
  }
}

// 获取楼层的所有点位
exports.getPoints = async ctx => {
  try {
    const id = ctx.params.id
    if (!id) {
      ctx.throw(500, {
        message: '参数id为必须'
      })
    }
    const result = await ResourceModel.find(
      {
        type: { $in: ctx.query.channelTypes.split(',') },
        point3D: {
          $nin: [undefined, null]
        },
        'point3D.sid': id
      },
      'ip port type name stream chan point3D status monitortype mapsign'
    )
      .populate({
        path: 'eid',
        select: '_id ip cport name manufacturer'
      })
      .lean()
      .exec()
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 获取3D楼层
 */
exports.getOne = async ctx => {
  try {
    const stroey = await Storey.findById(ctx.params.id)
      .populate('bid')
      .exec()
    ctx.body = stroey
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 添加3D楼层
 */
exports.add = async ctx => {
  ctx.set('loginfo', encodeURI('地图管理-新建楼层'))
  delete ctx.request.body._id
  const bid = ctx.request.body.bid // 楼层所属楼宇
  try {
    const picture = ctx.request.body.picture || { name: '', path: '' }
    const filePath = `${config.backend.fileDirs.storeyPicDir}/${picture.name}`
    const picSize = imageSize(fs.readFileSync(filePath))
    ctx.request.body.picture.size = picSize
    const building = await BuildingModel.findById(bid).exec()
    const nameArr = await Storey.find({ bid: building._id }, 'name')
    let flag = false
    nameArr.forEach(item => {
      if (item.name + '' === ctx.request.body.name + '') {
        flag = true
      }
    })
    if (flag) {
      ctx.throw(500, { code: 4008, message: '楼层名称重复' })
    }
    const newStorey = await Storey.create(ctx.request.body)
    ctx.body = [newStorey._id]
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 修改楼层
 */
exports.update = async ctx => {
  try {
    const storey = await Storey.findOne({ name: ctx.request.body.name }, 'name picture')
    if (!_.isEmpty(storey) && ctx.request.body._id !== storey._id && ctx.request.body.name === storey.name) {
      ctx.throw(500, { code: 4008, message: '楼层名称重复' })
    }
    const picture = ctx.request.body.picture || { name: '', path: '' }
    const filePath = `${config.backend.fileDirs.storeyPicDir}/${picture.name}`
    const picSize = imageSize(fs.readFileSync(filePath))
    ctx.request.body.picture.size = picSize
    await Storey.findByIdAndUpdate(ctx.params.id, _.merge(ctx.request.body)).exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 删除楼层
 */
exports.del = async ctx => {
  try {
    await ResourceModel.updateMany(
      {
        'point3D.sid': ctx.params.id
      },
      { $unset: { point3D: '' } },
      { multi: true }
    ).exec()
    postal.publish({
      topic: 'array.delete',
      channel: 'sentry:position',
      data: {
        id: ctx.params.id,
        mapType: '3D'
      }
    })
    const storey = await Storey.findByIdAndRemove(ctx.params.id).exec()
    if (_.get(storey, 'picture.name', '')) {
      const filePath = `${config.backend.fileDirs.storeyPicDir}/${storey.picture.name}`
      fs.unlink(filePath, err => {
        console.log(err)
      })
    }
    ctx.body = 200
  } catch (error) {
    handleSysException(error)
  }
}
