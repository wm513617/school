/*
 * 回放接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:47:13
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-07-19 09:28:42
 */

'use strict'

const util = require('../../common/protobuf.util')
const command = require('../../common/command')
const _ = require('lodash')
const { handleSysException } = require('../../common/tools')
const mongoose = require('mongoose')
const Storage = mongoose.model('Storage')
/**
 * 根据资源id获取DS server
 */
exports.getDsServer = async ctx => {
  try {
    const result = await Storage.findOne({ resource: ctx.query.resId }, 'server').exec()
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 视频录像查询
 */
exports.queryRecord = async (ctx) => {
  try {
    const base = { cmdBase: { devIp: ctx.request.body.devIp, devPort: ctx.request.body.devPort } }
    const recordTypeEnum = ['timeVideo', 'eventVideo', 'signVideo', 'vehicleVideo', 'faceVideo']
    var devInfo = {
      channel: Number(ctx.request.body.channel),
      recordType: ctx.request.body.recordType === 'timeVideo' ? 1 : ctx.request.body.recordType === 'eventVideo' ? 2 : ctx.request.body.recordType === 'signVideo' ? 3 : ctx.request.body.recordType === 'vehicleVideo' ? 4 : ctx.request.body.recordType === 'faceVideo' ? 5 : 0,
      sTime: Number(ctx.request.body.sTime),
      eTime: Number(ctx.request.body.eTime),
      streamType: ctx.request.body.streamType === 'main' ? 1 : ctx.request.body.streamType === 'sub1' ? 2 : ctx.request.body.streamType === 'sub2' ? 3 : ctx.request.body.streamType === 'pic' ? 4 : 1,
      diskNum: ctx.request.body.diskNum || 'all',
      rowId: Number(ctx.request.body.rowId),
      rowCount: Number(ctx.request.body.rowCount)
    }
    for (var item in devInfo) {
      if (devInfo[item] === '' || devInfo[item] === null || devInfo[item] === undefined) { delete devInfo[item] }
    }
    // 获取DevRecordQueryMA2DA proto
    const basePro = util.baseProto('DevRecordQueryMA2DA')
    const structProBase = util.getProtoMsg(basePro, 'QueryDevRecordReq')
    const buf = util.encode(structProBase, devInfo)
    const data = _.merge(base, { cmdContent: buf })
    const structPro = util.getProtoMsg(basePro, 'CommandGeneric')
    const bufReq = util.encode(structPro, data)
    let result = await util.tcp(bufReq, command.VMR_COMMAND_CLIENT2MA_DEV_RECORD_QUERY)
    // 请求成功，解析获取解码的buffer数据
    if (result.code === 0) {
      const resPro = util.getProtoMsg(basePro, 'QueryDevRecordResp')
      result = util.decode(resPro, result.message)
      result.recordInfo && result.recordInfo.forEach(item => {
        item.devIp = ctx.request.body.devIp
        item.devPort = ctx.request.body.devPort
        item.recordType = recordTypeEnum[Number(item.recordType) - 1]
      })
    } else {
      ctx.throw(500, result)
    }
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 开始中心录像
 */
exports.startRecord = async (ctx) => {
  try {
    var devInfo = {
      devIp: ctx.request.body.devIp,
      devPort: ctx.request.body.devPort,
      channel: Number(ctx.request.body.channel),
      streamType: ctx.request.body.streamType === 'main' ? 1 : ctx.request.body.streamType === 'sub1' ? 2 : ctx.request.body.streamType === 'sub2' ? 3 : ctx.request.body.streamType === 'pic' ? 4 : 1,
      mType: ctx.request.body.mType === 'bstar' ? 1 : ctx.request.body.mType === 'hikvision' ? 2 : ctx.request.body.mType === 'dahua' ? 3 : 1,
      eventType: Number(ctx.request.body.eventType),
      eventSrc: Number(ctx.request.body.eventSrc),
      devName: ctx.request.devName ? Buffer.from(ctx.request.devName) : '',
      devId: ctx.request.body.devId,
      streamConnMode: ctx.request.body.streamConnMode === 'active' ? 1 : 2,
      streamConnPort: ctx.request.body.streamConnPort,
      tsServerId: ctx.request.body.tsServerId,
      dsServerId: ctx.request.body.dsServerId
    }
    for (var item in devInfo) {
      if (devInfo[item] === '' || devInfo[item] === null || devInfo[item] === undefined) { delete devInfo[item] }
    }
    // 获取DevRecordQueryMA2DA proto
    const basePro = util.baseProto('StartRecordClient2MA')
    const structPro = util.getProtoMsg(basePro, 'StartRecordReq')
    const bufReq = util.encode(structPro, devInfo)
    const result = await util.tcp(bufReq, command.VMR_COMMAND_CLIENT2MA_START_RECORD)
    console.log(result)
    if (result.code === 0) {
      ctx.status = 200
      ctx.body = result
    } else {
      ctx.throw(500, result)
    }
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 结束中心录像
 */
exports.stopRecord = async (ctx) => {
  try {
    var devInfo = {
      devIp: ctx.request.body.devIp,
      devPort: ctx.request.body.devPort,
      channel: Number(ctx.request.body.channel),
      eventType: Number(ctx.request.body.eventType),
      streamType: ctx.request.body.streamType === 'main' ? 1 : ctx.request.body.streamType === 'sub1' ? 2 : ctx.request.body.streamType === 'sub2' ? 3 : ctx.request.body.streamType === 'pic' ? 4 : 1,
      eventSrc: Number(ctx.request.body.eventSrc),
      devName: ctx.request.devName ? Buffer.from(ctx.request.devName) : '',
      devId: ctx.request.body.devId
    }
    for (var item in devInfo) {
      if (devInfo[item] === '' || devInfo[item] === null || devInfo[item] === undefined) { delete devInfo[item] }
    }
    // 获取DevRecordQueryMA2DA proto
    const basePro = util.baseProto('StopRecordClient2MA')
    const structPro = util.getProtoMsg(basePro, 'StopRecordReq')
    const bufReq = util.encode(structPro, devInfo)
    const result = await util.tcp(bufReq, command.VMR_COMMAND_CLIENT2MA_STOP_RECORD)
    console.log(result)
    if (result.code === 0) {
      ctx.status = 200
      ctx.body = result
    } else {
      ctx.throw(500, result)
    }
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 打开回放
 */
exports.openRecord = async (ctx) => {
  try {
    var devInfo = {
      devIp: ctx.request.body.devIp,
      devPort: ctx.request.body.devPort,
      channel: Number(ctx.request.body.channel),
      sTime: Number(ctx.request.body.sTime),
      eTime: Number(ctx.request.body.eTime),
      streamType: ctx.request.body.streamType === 'main' ? 1 : ctx.request.body.streamType === 'sub1' ? 2 : ctx.request.body.streamType === 'sub2' ? 3 : ctx.request.body.streamType === 'pic' ? 4 : 1,
      streamConnPort: ctx.request.body.streamConnPort
    }
    console.log(devInfo)
    // 获取DevRecordQueryMA2DA proto
    const basePro = util.baseProto('DevRecordPlaybackClient2MA')
    const structPro = util.getProtoMsg(basePro, 'PlayBackDevReq')
    const bufReq = util.encode(structPro, devInfo)
    let result = await util.tcp(bufReq, command.VMR_COMMAND_CLIENT2MA_DEV_RECORD_PLAYBACK_START)
    console.log(result)
    // 请求成功，解析获取解码的buffer数据
    if (result.code === 0) {
      const resPro = util.getProtoMsg(basePro, 'PlayBackDevRsp')
      result = util.decode(resPro, result.message)
    } else {
      ctx.throw(500, result)
    }
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}
