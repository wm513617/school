'use strict'

// const Device = require('mongoose').model('Device')
// const Org = require('mongoose').model('Org')
const Resource = require('mongoose').model('Resource')
const _ = require('lodash')
// const tool = require('../../../common/tools')
// const paging = require('../../paging')

exports.getDeviceInfoByRtsp = async ctx => {
  const rtspUrl = 'rtsp://ip:port' + ctx.query.rtspurl
  if (_.isEmpty(rtspUrl)) {
    return ctx.throw(500, { code: 1008, message: '参数不能为空' })
  }
  try {
    const res = await Resource.findOne({
      'rtsp.main': rtspUrl
    }, '-_id eid chan stream').populate({
      path: 'eid',
      select: '-_id ip cport manufacturer dport'
    }).exec()
    if (_.isEmpty(res)) {
      ctx.body = {}
      return
    }
    ctx.body = {
      devIp: res.eid.ip,
      devPort: res.eid.cport,
      vendor: res.eid.manufacturer,
      channel: res.chan,
      streamType: res.stream,
      streamPort: res.eid.dport
    }
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
