import { get, post } from '../base.js'
/**
 * 以图搜图的检索
 * * */
export const getImagesConditionSearchApi = payload => {
  const param = {
    url: 'structure/identify/picsearchLogic',
    body: payload || {}
  }
  return post(param)
}
/**
 * 获取通道数据
 * * */
export const getPassagewayDataApi = payload => {
  const param = {
    url: '/setting/resource/tree',
    query: {
      orgtype: 8,
      type: 0
    }
  }
  return get(param)
}
/**
 * 创建导出任务
 * * */
export const creatExportTaskApi = payload => {
  const param = {
    url: 'structure/identify/exportExcel?type=' + payload.type,
    body: payload.param || {}
  }
  return post(param)
}
/**
 * 获取导出列表
 * * */
export const getExportTaskListApi = payload => {
  const param = {
    url: 'structure/identify/listExcel',
    query: payload
  }
  return get(param)
}
/**
 * 删除导出任务
 * * */
export const removeExportTaskApi = payload => {
  const param = {
    url: 'structure/identify/removeExcel',
    query: payload
  }
  return get(param)
}
