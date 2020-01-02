import {
  post,
  put,
  get
} from './base'
/**
 * 消息回复api
 * @param {Object} data // 消息回复入参
 */
export const msgReplay = data => {
  const param = {
    body: data,
    url: '/patrol/message'
  }
  return post(param)
}
/**
 * 确认报警api
 * @param {Object} data // 确认报警入参
 */
export const confirmAlarm = data => {
  const param = {
    body: data === 'string' ? {} : data,
    url: `/patrol/message/${data.id}`
  }
  return put(param)
}
/**
 * 确认单兵报警api
 * @param {Object} data // 确认报警入参
 */
export const confirmSingleAlarm = id => {
  const param = {
    url: `/patrol/message/${id}`,
    body: {}
  }
  return put(param)
}
/**
 * 地图获取报警点位附近单兵
 * @param {Object} data // 获取单兵入参
 */
export const nearestSingleAlarm = id => {
  const param = {
    url: `setting/sentry/user/nearest?id=${id}&mapType=3D`
  }
  return get(param)
}
