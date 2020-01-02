/*
* 电视墙北京接口调用
* @Author: chenkaibo
* @Date: 2018-06-05 15:18:44
 * @Last Modified by: mikey.zhaopengg
 * @Last Modified time: 2019-11-08 17:36:44
 */
const rp = require('./req').req

exports.setMonitorCfg = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/setdecodercfg',
    method: 'POST',
    body
  })
}

exports.getMonitorCfg = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/getdecoderability',
    method: 'POST',
    body
  })
}

exports.openWall = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/open',
    method: 'POST',
    body
  })
}

exports.openVodWall = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/openvod',
    method: 'POST',
    body
  })
}

// 前端回放上墙
exports.frontVodWall = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/opendevvod',
    method: 'POST',
    body
  })
}

// 国标设备上墙
exports.gbopen = (ctx, body) => {
  return rp({
    ctx: ctx,
    url: `/api/wall/gbopen`,
    method: 'post',
    body
  })
}

exports.closeWall = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/close',
    method: 'POST',
    body
  })
}

exports.closeAll = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/closeall',
    method: 'POST',
    body
  })
}

exports.execPolling = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/camerascheduler',
    method: 'POST',
    body
  })
}

exports.switchScene = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/sceneswitch',
    method: 'POST',
    body
  })
}

exports.switchPlan = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/preplanexecute',
    method: 'POST',
    body
  })
}

exports.keepingState = (ctx, data) => {
  return rp({
    ctx,
    url: '/api/wall/keepingstate',
    method: 'POST',
    body: data
  })
}

exports.getState = ctx => {
  return rp({
    ctx,
    url: '/api/wall/currentstate?' + Math.random(),
    method: 'GET'
  })
}

exports.vallDisplay = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/display',
    method: 'POST',
    body
  })
}

exports.getJointLayout = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/ctl/stictchingScenesCfgGet',
    method: 'POST',
    body,
    timeout: 30000
  })
}

exports.setJointLayout = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/ctl/stictchingScenesCall',
    method: 'POST',
    body
  })
}

exports.fullDisplay = (ctx, body) => {
  return rp({
    ctx,
    url: '/api/wall/fullplay',
    method: 'POST',
    body
  })
}
