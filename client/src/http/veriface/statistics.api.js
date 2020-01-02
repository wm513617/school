import { get } from '../base.js'
/*
* 获取今日统计数据
*/
export const getVerifaceStatisticTodayApi = () => {
  const params = {
    url: 'veriface/statistic/today'
  }
  return get(params)
}
export const getVerifaceStatisticAnalysisApi = (payload) => {
  const params = {
    url: '/veriface/statistic/analysis',
    query: { ...payload }
  }
  return get(params)
}
export const getVerifaceStatisticAnalysisExportApi = (payload) => {
  const params = {
    url: '/veriface/statistic/analysis/export',
    query: { ...payload }
  }
  return get(params)
}
