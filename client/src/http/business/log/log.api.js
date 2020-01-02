import { get, post, put, remove } from '../../base'

// 获取录像拷贝日志列表
export const getVideoCopyLogApi = (query) => get({
  url: '/business/log/recode',
  query
})
// 添加录像拷贝纪录
export const postAddViodeCopyLogApi = (body) => post({
  url: '/business/log/recode',
  body
})
// 批量删除录像拷贝纪录
export const deleteViodeCopyLogApi = arrId => {
  console.log(arrId, 33333)
  let _ids = arrId.join(',')
  return remove(
    {
      url: '/business/log/recode'
    },
    {
      headers: {
        'x-bsc-ids': _ids
      }
    }
  )
}
// 修改录像拷贝纪录
export const updateVideoCopyLogApi = (id, body) => put({
  url: '/business/log/recode/' + id,
  body
})

// 获取设备查询纪录
export const getDevInfoLogApi = (query) => get({
  url: '/business/log/devpatrol',
  query
})
// 添加设备查询纪录
export const postAddDevInfoLogApi = (body) => post({
  url: '/business/log/devpatrol',
  body
})
// 批量删除设备查询纪录
export const deleteDevInfoLogApi = arrId => {
  let _ids = arrId.join(',')
  return remove(
    {
      url: '/business/log/devpatrol'
    },
    {
      headers: {
        'x-bsc-ids': _ids
      }
    }
  )
}
// 修改设备查询纪录
export const updateDevInfoLogApi = (id, body) => put({
  url: '/business/log/devpatrol/' + id,
  body
})
// 获取全部设备
export const getDeviceListApi = () => get({
  url: '/business/log/device'
})
// 获取视频通道
export const getResourceListApi = () => get({
  url: '/business/log/resource'
})
