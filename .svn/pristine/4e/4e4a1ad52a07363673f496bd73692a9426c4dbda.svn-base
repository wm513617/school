import { get } from '../base'

/**
 * 运维日志列表
 */
export const getLogDataApi = (payLoad) => get({
  query: payLoad,
  url: 'setting/operation/logs'
})
/**
 * 服务器列表
 */
export const getLogServeApi = () => get({
  url: '/setting/operation/videoDiagnosis/server'
})
/**
 * 日志详情图片状态
 */
export const getLogDetailsApi = (id, diagnid) => get({
  url: `/setting/operation/videoDiagnosis/${id}/${diagnid}`
})
