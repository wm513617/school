const baseUrl = require('../../../../config').backend.serviceUrl
const rp = require('request-promise')

exports.setMonitorCfg = body => {
  return rp({
    uri: baseUrl + '/api/wall/setdecodercfg',
    method: 'POST',
    json: true,
    body
  })
}

exports.getMonitorCfg = body => {
  return rp({
    uri: baseUrl + '/api/wall/getdecoderability',
    method: 'POST',
    json: true,
    body
  })
}

exports.openWall = body => {
  return rp({
    uri: baseUrl + '/api/wall/open',
    method: 'POST',
    json: true,
    body
  })
}

exports.closeWall = body => {
  return rp({
    uri: baseUrl + '/api/wall/close',
    method: 'POST',
    json: true,
    body
  })
}

exports.closeAll = body => {
  return rp({
    uri: baseUrl + '/api/wall/closeall',
    method: 'POST',
    json: true,
    body
  })
}

exports.usePolling = body => {
  return rp({
    uri: baseUrl + '/api/wall/camerascheduler',
    method: 'POST',
    json: true,
    body
  })
}

exports.switchScene = body => {
  return rp({
    uri: baseUrl + '/api/wall/sceneswitch',
    method: 'POST',
    json: true,
    body
  })
}

exports.switchPlan = body => {
  return rp({
    uri: baseUrl + '/api/wall/sceneswitch',
    method: 'POST',
    json: true,
    body
  })
}

exports.keepingState = () => {
  return rp({
    uri: baseUrl + '/api/wall/keepingstate',
    method: 'GET'
  })
}

exports.getState = () => {
  return rp({
    uri: baseUrl + '/api/wall/currentstate',
    method: 'GET'
  })
}
