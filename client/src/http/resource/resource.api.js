import { get, post, put, remove } from '../base'
/**
 * 获取所有类型资源的数据信息
 */
export const getResourceInfo = (obj) => {
  const param = {
    query: obj,
    url: '/setting/resource'
  }
  return get(param)
}
/**
 * 获取资源数量
 */
export const getCountList = (obj) => {
  obj.url = '/setting/resource/count'
  return get(obj)
}
/**
 * 获取资源分配树
 */
export const getResourceTree = (obj) => {
  obj.url = '/setting/resource/distributiontree'
  return get(obj)
}
/**
 * 保存資源分配
 */
export const saveResourceList = (obj) => {
  obj.url = '/setting/resource/distribute'
  return post(obj)
}
/**
 * 获取单一资源信息
 */
export const getSingleList = (id) => {
  const param = {
    url: '/setting/resource/' + id
  }
  return get(param)
}
/**
 * 保存资源信息
 */
export const saveResourcePut = (obj) => {
  const param = {
    body: obj.form,
    url: '/setting/resource/' + obj.id
  }
  return put(param)
}
/**
 * 保存rtsp信息
 */
export const saveRtspPut = (obj) => {
  const param = {
    body: obj.form,
    url: '/setting/resource/' + obj.id + '/updatertsp'
  }
  return put(param)
}
/**
 * 向设备添加通道
 */
export const addDevChannel = (ops) => {
  const param = {
    body: ops,
    url: '/setting/resource'
  }
  return post(param)
}
/**
 * 向设备批量添加资源
 */
export const addDevBatch = (ops) => {
  const param = {
    body: ops,
    url: '/setting/resource/fire/patch'
  }
  return post(param)
}
/**
 * 添加监控点报警
 */
export const addAlarm = (ops) => {
  const param = {
    body: ops.data,
    url: '/setting/resource/video/' + ops.alarmChanType + '/'
  }
  return post(param)
}
/**
 * 修改监控点报警
 */
export const editAlarm = (ops) => {
  const param = {
    body: ops.data,
    url: '/setting/resource/video/' + ops.alarmChanType + '/' + ops.id
  }
  return put(param)
}
/**
 * 删除监控点报警
 */
export const delAlarm = (ops) => {
  const ids = ops.arrId.join(',')
  const param = {
    url: '/setting/resource/video/' + ops.alarmChanType + '/?ids=' + ids
  }
  return remove(param)
}
/**
 * 获取单个监控点报警
 */
export const getAlarmOne = (obj) => {
  const params = {
    url: '/setting/resource/video/' + obj.alarmChanType + '/' + obj.id
  }
  return get(params)
}
/**
 * 获取流服务器配置信息
 */
export const getRtspServer = () => {
  const params = {
    url: '/setting/resource/rtspserver'
  }
  return get(params)
}
/**
 * 修改流服务器配置信息
 */
export const editRtspServer = (obj) => {
  const params = {
    url: '/setting/resource/rtspserver',
    body: obj
  }
  return post(params)
}
/**
 * 获取rtsp机构资源树（已分配资源不显示）
 *
 */
export const getRtspTree = (obj) => {
  const params = {
    url: '/setting/resource/tree',
    query: obj
  }
  return get(params)
}
/**
 * 添加资源rtsp数据
 */
export const addPutRtsp = (obj) => {
  const params = {
    url: '/setting/resource/addrtsppatch',
    body: obj
  }
  return put(params)
}
