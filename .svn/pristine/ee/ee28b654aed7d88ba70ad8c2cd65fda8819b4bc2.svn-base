import axios from 'axios'

export const getCaseProcessing = () => { // 通过案件id获取指定案件树结构
  return axios('business/alarm/tree')
}

export const getSearchList = data => { // 搜索案件列表
  return axios(`business/alarm/`, {
    params: data
  })
}

export const getSearchhistory = data => { // 获取历史案件列表
  return axios(`business/alarm/history/`, {
    params: data
  })
}

export const getAllResCaseList = () => { // 获取当前全部案件所属资源
  return axios(`business/alarm/resource`)
}

export const delecthistoryList = data => { // 删除历史事件
  return axios.delete('/business/alarm', {
    headers: {
      'x-bsc-ids': data.join(',')
    }
  })
}

export const getCaseAlarmDetails = id => { // 获取单个案件详情
  return axios(`business/alarm/${id}`)
}

export const setCaseAlarmDetails = (id, obj) => { // 修改接警事件
  return axios.put(`business/alarm/${id}`, obj)
}

export const postAddCaseManage = (obj) => { // 新建接警事件
  return axios.post('business/alarm', obj)
}

export const deleteCaseManage = ids => { // 删除接警事件
  return axios.delete('business/alarm', {
    headers: {
      'x-bsc-ids': ids.join(',')
    }
  })
}

/**
 * id：案件的id
 * rid：资源的id
 * ogj：数据tagTime
 */
export const setVideoTime = (id, rid, obj) => { // 修改接警事件
  return axios.put(`business/alarm/resource/${id}/${rid}`, obj)
}

export const getCaseParticulars = id => { // 获取当前全部案件名称
  return axios(`business/alarm/tree/${id}`)
}

/**
 * 案件处理-案件列表 接口
 */
export const getRemotedownload = id => { // 备份事件到服务器上
  return axios.get(`business/alarm/remotedownload/${id}`)
}

export const deleteVideo = ids => { // 删除服务器备份事件
  return axios.delete(`business/alarm/remotedownload/${ids}`)
}

export const gudgingDown = () => { // 判断录像能否下载
  return axios.get('business/alarm/remotedownload/status')
}

export const getExport = id => { // 将服务器备份下载到本地
  return axios.get(`business/alarm/export/${id}`)
}

export const getExportAlarm = data => { // 文件导出 data为Array, 里面为id
  return axios.get('business/alarm/exportAlarm/zip', data)
}
