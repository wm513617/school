import { get } from '../base.js'
/*
* 获取运维服务器列表
*/
export const getOpsDeviceTreeApi = (servername) => {
  const url = '/service/list'
  const query = servername
  return get({url, query})
}
/*
* 获取录像监测列表
*/
export const getChannelTableByTreeApi = (params) => {
  const url = '/setting/operation/video'
  const query = params
  return get({url, query})
}
/*
* 获取通道录像详情
*/
export const getVideoDetailsDataApi = (params) => {
  const url = '/setting/operation/video/details'
  const query = {
    page: params.page,
    limit: params.limit,
    RateStatus: params.onlineRate,
    ip: params.ip,
    channel: params.channel,
    port: params.port
  }
  return get({url, query})
}
/*
* 获取通道录像详情和设备详情
*/
export const getVideoAnalysisDataApi = (params) => {
  const url = '/setting/operation/video/analysis'
  const query = {
    page: params.page,
    limit: params.limit,
    RateStatus: params.onlineRate,
    ip: params.ip,
    channel: params.channel,
    port: params.port
  }
  return get({url, query})
}
