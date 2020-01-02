import { get, post, remove } from '../base.js'
export const getbaseraryApi = () => {
  const param = {
    url: 'veriface/group'
  }
  return get(param)
}
export const getAlarmConditionApi = payload => {
  const param = {
    url: 'veriface/statistic/alarm',
    query: payload || {}
  }
  return get(param)
}
export const getAlarmCountApi = payload => {
  const param = {
    url: 'veriface/statistic/alarm/count',
    query: payload || {}
  }
  return get(param)
}
export const getAlarmExportApi = payload => {
  const param = {
    url: `/veriface/statistic/alarm/export?${payload}`
  }
  return get(param)
}
export const addAlarmExportApi = payload => {
  const param = {
    url: `/veriface/statistic/excel/export?${payload}`
  }
  return post(param)
}
export const getAlarmExportListApi = type => {
  const param = {
    url: `/veriface/statistic/excel/list/${type}`
  }
  return get(param)
}

export const deleteAlarmExportApi = payload => {
  const param = {
    url: `/veriface/statistic/excel/${payload.type}/${payload.id}`
  }
  return remove(param)
}
