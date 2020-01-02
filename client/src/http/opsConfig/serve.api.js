import { get, post, remove, put } from '../base'

/**
 * 诊断服务器列表获取接口
 */
export const getServeListDataApi = query =>
  get({
    url: '/setting/operation/videoDiagnosis/server',
    query
  })
/**
 * 添加诊断服务器接口
 */
export const postServeDataAddApi = body =>
  post({
    url: '/setting/operation/videoDiagnosis/server',
    body
  })
/**
 * 修改诊断服务器接口
 */
export const putServeDataUpdateApi = (id, body) =>
  put({
    url: '/setting/operation/videoDiagnosis/server/' + id,
    body
  })
/**
 * 删除诊断服务器接口
 */
export const removeServeDataDeleteApi = (id, body) =>
  remove({
    url: '/setting/operation/videoDiagnosis/server/' + id,
    body
  })
/**
 * 获取诊断服务器详情
 */
export const getServeDetailsApi = (id, query) =>
  get({
    url: '/setting/operation/videoDiagnosis/server/' + id,
    query
  })
