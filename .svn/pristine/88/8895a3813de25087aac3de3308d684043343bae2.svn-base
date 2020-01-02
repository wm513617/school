import axios from 'axios'

// 接力追踪
export const setTracking = obj => { // 创建接力追踪事件
  return axios.post('/business/tracking/', obj)
}

export const getTrackingList = data => { // 获得接力追踪事件列表
  return axios.get(`/business/tracking/`, { params: data })
}

export const delectTracking = ids => { // 批量删除接力追踪事件
  return axios.delete('/business/tracking/', { headers: { 'x-bsc-ids': ids.join(',') } })
}

export const putTracking = (id, obj) => { // 修改一个接力追踪事件
  return axios.put(`/business/tracking/${id}`, obj)
}

export const getTrackingxg = id => { // 获取一个接力追踪事件详情
  return axios.get(`/business/tracking/${id}`)
}

export const getMemory = () => { // 案件管理和接力追踪历史内存大小
  return axios.get('/business/alarm/capacity')
}

export const getTrackingTree = () => { // 获得【接力追踪】机构树
  return axios('/business/tracking/all')
}

export const deleteVideo = id => { // 删除服务器备份事件
  return axios.delete(`/business/tracking/remotedownload/${id}`)
}

export const getRemotedownload = id => { // 备份事件到服务器上
  return axios.get(`/business/tracking/remotedownload/${id}`)
}

export const getExportZip = id => { // 将服务器备份下载到本地
  return axios.get(`/business/tracking/exportZip/${id}`)
}

export const getExportTracking = data => { // 文件导出 data为Array, 里面为id
  return axios.get('/business/tracking/exportTracking/zip', data)
}
