/*
 * 监视器接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:59:27
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-11-07 20:27:20
 */

'use strict'
const mongoose = require('mongoose')
const Monitor = mongoose.model('Monitor')
const Resource = mongoose.model('Resource')
const Scene = mongoose.model('Scene')
const Wall = mongoose.model('Wall')
const _ = require('lodash')
const { setMonitorCfg, getMonitorCfg } = require('../../../bstar/tvwall.interface')
const { updatePollingMonitorPosition, updateOnePollingMonitorPosition } = require('../polling/polling.controller')
const { updateSenceMonitorPosition, updateOneSenceMonitorPosition } = require('../scene/scene.controller')
const { handleSysException } = require('../../../../common/tools')

exports.getByWall = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-获取监视器'))
    const monitors = await Monitor.find({ wall: ctx.params.id })
      .populate('equipment channel')
      .exec()
    ctx.status = 200
    ctx.body = monitors
  } catch (error) {
    console.log(error)
    return ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}

exports.add = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-添加监视器'))
    const rqbody = ctx.request.body
    const resource = await Resource.findById(rqbody.channel)
      .populate('eid')
      .exec()
    // 判断通道是否被占用
    const channels = await Monitor.find({ wall: rqbody.wall }, 'channel').exec()
    let flag = false
    channels.forEach(item => {
      if (item.channel + '' === rqbody.channel + '') {
        flag = true
      }
    })
    if (flag) {
      ctx.throw(500, { code: 10, message: '解码通道已被占用' })
    }
    if (!resource) {
      return ctx.throw(500, { code: 2, message: '该资源不存在' })
    }
    // 初始化窗格分割为1,
    const body = {
      devInfo: {
        devIp: resource.eid.ip,
        devPort: resource.eid.cport,
        vendor: 1,
        version: '',
        username: resource.eid.username,
        password: resource.eid.password,
        flag: 1
      },
      devCtl: {
        MonitorCfgPrmArr: [
          {
            monitor: resource.chan,
            paneCnt: 4
          }
        ]
      }
    }
    try {
      await setMonitorCfg(ctx, body)
    } catch (error) {
      console.log('set---', error)
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/setdecodercfg'
      })
    }
    // 获取起始编号
    let cfgs = null
    try {
      cfgs = await getMonitorCfg(ctx, {
        devInfo: {
          devIp: resource.eid.ip,
          devPort: resource.eid.cport
        }
      })
    } catch (error) {
      console.log('get---', error)
      return ctx.throw(500, {
        code: error.error,
        message: '操作未成功,请重试一下',
        type: 'sys',
        errInfo: '/api/wall/getdecoderability'
      })
    }
    const cfg = cfgs.MonitorCfgPrmArr.find(item => item.monitor === resource.chan)
    if (!cfg) {
      return ctx.throw(500, { code: 4, message: '资源通道不存在' })
    }
    // 如果是硬解码设备，设置起始窗格为1，原因为硬解码器此参数不稳定。
    if (resource.eid.type === 'hardDecoder') {
      rqbody.startcode = 1
    } else {
      rqbody.startcode = cfg.paneTag
    }
    const monitor = new Monitor(rqbody)
    const doc = await monitor.save()
    let { rtscene } = await Wall.findById(rqbody.wall)
      .populate('rtscene')
      .exec()
    rtscene = rtscene.toObject()
    rtscene.info.push({
      monitor: doc._id,
      type: 0,
      panecount: 4,
      resources: []
    })
    const ssss = await Scene.findByIdAndUpdate(rtscene._id, rtscene).exec()
    console.log('sss---', ssss)
    ctx.set('Location', `/monitor/${doc._id}`)
    ctx.body = [doc._id]
    ctx.status = 201
  } catch (err) {
    // return ctx.throw(500, err.code ? { code: err.code, message: err.message, type: err.type || '' } : { code: 1001, message: '系统内部错误' })
    handleSysException(err)
  }
}

exports.modify = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-修改监视器'))
    // 重新获取起始编号
    const rqbody = ctx.request.body
    // 判断通道是否被占用
    const channels = await Monitor.find({ wall: rqbody.wall }, '_id channel').exec()
    let flag = false
    channels.forEach(item => {
      if (item.channel + '' === rqbody.channel + '' && item._id + '' !== ctx.params.id + '') {
        flag = true
      }
    })
    if (flag) {
      ctx.throw(500, { code: 10, message: '解码通道已被占用' })
    }
    if (rqbody.equipment || rqbody.channel) {
      const resource = await Resource.findById(rqbody.channel)
        .populate('eid')
        .exec()
      let cfgs = null
      try {
        cfgs = await getMonitorCfg(ctx, {
          devInfo: {
            devIp: resource.eid.ip,
            devPort: resource.eid.cport
          }
        })
      } catch (error) {
        return ctx.throw(500, {
          code: error.error,
          message: '操作未成功,请重试一下',
          type: 'sys',
          errInfo: '/api/wall/getdecoderability'
        })
      }
      const cfg = cfgs.MonitorCfgPrmArr.find(item => item.monitor === resource.chan)
      rqbody.startcode = cfg.paneTag
    }
    await Monitor.findByIdAndUpdate(ctx.params.id, rqbody).exec()
    ctx.status = 200
  } catch (err) {
    // return ctx.throw(500, err.code ? { code: err.code, message: err.message, type: err.type || '' } : { code: 1001, message: '系统内部错误' })
    handleSysException(err)
  }
}

exports.delete = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('电视墙-删除监视器'))
    const ids = ctx.request.body.ids
    for (var id of ids) {
      const monitorObj = await Monitor.findByIdAndRemove(id).exec()
      // 删除实时场景中的监视器
      let { rtscene: rtsceneId } = await Wall.findById(monitorObj.wall).exec()
      await Scene.update({'_id': rtsceneId}, {'$pull': {'info': {monitor: id}}})

      // 删除监视器的同时删除轮询和场景里的监视器配置
      // await Promise.all([updateOnePollingMonitorPosition(monitorObj), updateOneSenceMonitorPosition(monitorObj)])
      // let { rtscene } = await Wall.findById(monitorObj.wall)
      //   .populate('rtscene')
      //   .exec()
      // rtscene = rtscene.toObject()
      // await Scene.findByIdAndUpdate(rtscene._id, rtscene).exec()
    }
    ctx.status = 200
  } catch (error) {
    console.log(error, 'errorerrorerror')
    ctx.throw(500, { code: 1, message: '系统内部错误' })
  }
}
exports.updateMonitorChannelAndDevice = async data => {
  try {
    const { equipment } = data
    const monitors = await Monitor.find({ equipment: { $in: equipment } }, '_id').exec()
    if (!_.isEmpty(monitors)) {
      await Promise.all([
        updatePollingMonitorPosition(monitors),
        updateSenceMonitorPosition(monitors),
        Monitor.deleteMany({ equipment: { $in: equipment } })
      ])
    }
  } catch (err) {
    // obj.ctx.throw(500, { code: 1, message: '系统内部错误' })
    console.log(err)
  }
}
// 更新单个监视器
exports.updateOneMonitor = async resource => {
  try {
    const monitor = await Monitor.find({ channel: resource._id }, '_id')
    if (!_.isEmpty(monitor)) {
      await Promise.all([
        updateOnePollingMonitorPosition(monitor[0]),
        updateOneSenceMonitorPosition(monitor[0]),
        Monitor.deleteMany({ channel: resource._id })
      ])
    }
  } catch (error) {
    console.log(error)
  }
}
