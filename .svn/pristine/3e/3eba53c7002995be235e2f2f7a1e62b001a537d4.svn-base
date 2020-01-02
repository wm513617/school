/*
 * @Description: 视频结构化服务器高级参数设置
 * @Author: wanglei
 * @Date: 2019-06-28 13:42:37
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-05 13:39:05
 */

'use strict'
const mongoose = require('mongoose')
const StructureParam = mongoose.model('structureparam')
const postal = require('postal')
const { handleSysException } = require('../../../common/tools')
const { VideoClassCodeEnum, StartCodeEnum, DrawRectangleCodeEnum } = require('../structure.enum')

// 获取视频结构化高级参数
exports.getParam = async ctx => {
  try {
    const data = await StructureParam.findOne()
      .lean()
      .exec()
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

// 修改视频结构化高级参数
exports.updateParam = async ctx => {
  try {
    const entity = ctx.request.body
    const param = await StructureParam.findOne()
      .lean()
      .exec()
    // 修改数据保存时间时，influxdb 同步修改默认保存策略
    if (entity.saveTime !== param.saveTime) {
      postal.publish({ channel: 'videoStructure', topic: 'param.saveTime', data: entity.saveTime })
    }
    if (entity.startCode !== param.startCode || entity.codeClass !== param.codeClass) {
      const startOrStopType = {
        '0': 'stopEncode',
        '1': 'startEncode'
      }
      postal.publish({
        channel: 'videoStructure',
        topic: 'param.startOrStopCode',
        data: { type: startOrStopType[entity.startCode], encodeLevel: entity.codeClass }
      })
    }
    await StructureParam.findByIdAndUpdate(param._id, entity)
      .lean()
      .exec()
    ctx.body = 200
  } catch (error) {
    handleSysException(error)
  }
}

// 恢复默认设置
exports.setDefault = async ctx => {
  try {
    const param = await StructureParam.findOne()
      .lean()
      .exec()
    const options = { upsert: true, setDefaultsOnInsert: true }
    const update = {
      startCode: StartCodeEnum.START,
      codeClass: VideoClassCodeEnum.SUPERPOSE_ONECLASS_ZH_CODE,
      drawRectangle: DrawRectangleCodeEnum.DRAW,
      saveTime: 30
    }
    postal.publish({ channel: 'videoStructure', topic: 'param.saveTime', data: 30 })
    postal.publish({
      channel: 'videoStructure',
      topic: 'param.startOrStopCode',
      data: { type: 'startEncode', encodeLevel: VideoClassCodeEnum.SUPERPOSE_ONECLASS_ZH_CODE }
    })
    await StructureParam.findByIdAndUpdate(param._id, update, options)
      .lean()
      .exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
