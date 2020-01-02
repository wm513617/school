import { get, post, put } from './base'
import axios from 'axios'

export const putAddWorkOrderApi = param => put({ // 添加工单接口
  url: '/setting/workmanagement',
  body: param
})

export const getOperationConfigList = () => get({ // 获取维保厂商接口
  url: '/setting/operation/config/list'
})

export const getWorkOrderInfoApi = id => get({ // 获取详情信息接口
  url: `/setting/workmanagement/${id}`
})

export const postEditWorkOrderApi = (id, param) => post({ // 修改工单接口
  url: `/setting/workmanagement/${id}`,
  body: param
})

export const postNotarizeOrderApi = (id, param) => post({ // 维修确认接口
  url: `/setting/workmanagement/confirm/${id}`,
  body: param
})
// export const removeEditWorkOrderApi = ids => remove({ // 批量删除工单接口
//   url: '/setting/workmanagement',
//   body: ids
// })
export const removeEditWorkOrderApi = ids => axios.delete('/setting/workmanagement', {data: {ids}})

export const getWorkOrderListApi = param => get({ // 获取工单列表接口
  url: `/setting/workmanagement?status=${param.status}&startTime=${param.startTime}&endTime=${param.endTime}&seek=${param.seek}&limit=${param.limit}&page=${param.page}&repairsReason=${param.repairsReason}`
})

export const getDevOrgTreeApi = type => get({ // 按设备类型获取机构树接口
  url: `/setting/workmanagement/tree?resType=${type}`
})
