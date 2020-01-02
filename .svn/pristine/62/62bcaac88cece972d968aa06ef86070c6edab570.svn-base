import { get, put } from '../base.js'
/*
* 获取抓拍参数高级参数
*/
export const getVerifaceParamApi = () => {
  const params = {
    url: '/veriface/param'
  }
  return get(params)
}
/*
* 获取抓拍设备信息
*/
export const getVerifaceParamFaceApi = (query) => {
  const params = {
    url: 'veriface/param/face',
    query: { ...query }
  }
  return get(params)
}
/*
* 获取单条资源信息（修改）
*/
export const getVerifaceParamEditApi = (query) => {
  const params = {
    url: `/veriface/param/edit?id=${query.id}&rootOrg=${query.rootOrg}`
  }
  return get(params)
}
/*
* 同步底库信息
*/
export const syncLibraryApi = (id) => {
  const params = {
    url: `/veriface/server/${id}/sync`
  }
  return get(params)
}
/*
* 设置抓拍参数高级参数
*/
export const setVerifaceParamApi = (query) => {
  console.log(query, 'setVerifaceParamApi')
  const params = {
    body: {
      ...query
    },
    url: '/veriface/param'
  }
  return put(params)
}
