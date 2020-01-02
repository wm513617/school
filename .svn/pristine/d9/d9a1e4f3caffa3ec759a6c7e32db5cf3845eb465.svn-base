import { get } from '../base'
/**
 * 获取指定设备下未占用的通道号
 */
export const getSpecialDevChannel = (obj) => {
  const param = {
    query: {
      type: obj.type
    },
    url: '/setting/device/' + obj.deviceId + '/unusedchancode'
  }
  return get(param)
}
/**
 * 获取视频通道未被监控点使用的通道
 */
export const getNotDevVideoChannel = (ops) => {
  const param = {
    query: {
      category: ops.category
    },
    url: '/setting/device/' + ops.deviceId + '/unconfigalarm'
  }
  return get(param)
}
