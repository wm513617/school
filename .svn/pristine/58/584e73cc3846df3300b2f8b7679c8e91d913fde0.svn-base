import { get, put, post } from '../base.js'
/*
* 获取资产管理厂商列表
*/
export const getOperateListApi = () => {
  const params = {
    query: {
      page: 1,
      limit: 100
    },
    url: 'setting/operation/config/list'
  }
  return get(params)
}
/*
* 获取资产统计详情
*/
export const getAssetsListApi = (query) => {
  const params = {
    query: query,
    url: '/setting/operation/assets'
  }
  return get(params)
}
/*
* 获取详情信息
*/
export const getEquipmentDetailsApi = (query) => {
  const params = {
    url: `/setting/operation/assets/${query.id}/${query.type}`
  }
  return get(params)
}
// 修改详情信息
export const setEquipmentDetailsApi = (query) => {
  const params = {
    body: query.body,
    url: `/setting/operation/assets/${query.id}`
  }
  return put(params)
}
/**
 *设置维保信息
*/
export const setMaintenanceApi = (query) => {
  const params = {
    body: query,
    url: '/setting/operation/maintenance'
  }
  return post(params)
}
/**
  *获取图表数据
  */
export const getChartApi = (query) => {
  const params = {
    url: `/setting/operation/statistics?oid=${query.orgActiveId}&never=${query.never}`
  }
  return get(params)
}
