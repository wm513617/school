// eslint-disable-next-line standard/object-curly-even-spacing
import { get, put} from '../base.js'
/*
* 获取视频结构化参数高级参数
*/
export const getVideoStructuredParamApi = () => {
  const params = {
    url: '/structure/param'
  }
  return get(params)
}
/*
* 获取视频结构化设备信息
*/
export const getVideoStructuredParamFaceApi = (query) => {
  const params = {
    url: '/structure/video/resource',
    query: { ...query }
  }
  return get(params)
}
/*
* 点击编辑时获取视频结构化单条资源信息
*/
export const getVideoStructuredParamEditApi = (query) => {
  const params = {
    url: `/structure/video/resource/${query.id}`
  }
  return get(params)
}
/*
* 同步视频结构化底库信息
*/
export const syncLibraryApi = (id) => {
  const params = {
    url: `/structure/server/${id}/syncTask`
  }
  return get(params)
}
/*
* 设置视频结构化参数高级参数
*/
export const setVideoStructuredParamApi = (query) => {
  const params = {
    body: {
      ...query
    },
    url: '/structure/param'
  }
  return put(params)
}

