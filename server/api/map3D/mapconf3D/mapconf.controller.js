/*
 * @Author: chenkaibo
 * @Date: 2018-07-11 10:39:24
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-05-28 10:17:14
 */
'use strict'
const mongoose = require('mongoose')
const MapConf = mongoose.model('MapConf3D')
const { handleSysException } = require('../../../common/tools')

/**
 * 获取3D地图配置
 */
exports.getMapConf = async (ctx) => {
  try {
    const mapConf = await MapConf.findOne({}).exec()
    ctx.body = mapConf
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 获取3D地图配置
 */
exports.getOne = async (ctx) => {
  try {
    const mapConf = await MapConf.findById(ctx.params.id)
    ctx.body = mapConf
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 修改3D地图配置
 */
exports.update = async (ctx) => {
  try {
    const mapConf = await MapConf.findOne().lean().exec()
    const body = ctx.request.body
    if (!mapConf) {
      await MapConf.create(body)
    } else if (mapConf.dataUrl !== body.dataUrl || mapConf.mapUrl !== body.mapUrl) {
      await MapConf.findByIdAndUpdate(mapConf._id, _.merge(body, { perspective: {} })).exec()
    } else {
      await MapConf.findByIdAndUpdate(mapConf._id, body).exec()
    }
    ctx.body = 200
  } catch (error) {
    handleSysException(error)
  }
}
exports.getConfig = async (ctx) => {
  try {
    ctx.body = require('fs').readFileSync(require('path').join(process.cwd(), 'config.3Dmap.json'))
  } catch (error) {
    handleSysException(error)
  }
}
