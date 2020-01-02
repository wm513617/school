import { get, put } from '../base'
/**
 * 获取设备机构树
 */
export const getDeviceTree = (obj) => {
  const param = { url: '/setting/device/tree?oid=' + obj.oid + '&bigtype=' + obj.bigType + '&orgtype=' + obj.orgtype }
  return get(param)
}
/**
 * 选择设备进行移动
 */
export const postDeviceMove = (obj) => {
  obj.url = '/setting/device/move'
  console.log(obj)
  return put(obj)
}
