import { get } from '../base.js'
/**
 *获取视频诊断列表
 */
export const getVideoDiagnosticListApi = (query) => {
  const params = {
    query: query,
    url: '/setting/operation/videoDiagnosis'
  }
  return get(params)
}/**
 *获取视频诊断详情
 */
export const getVideoDiagnosticDetailsApi = (id, diagnid) => {
  const params = {
    url: `/setting/operation/videoDiagnosis/${id}/${diagnid}`
  }
  return get(params)
}
