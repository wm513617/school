import { get, post } from 'src/http/base'

// 根据2d地图框选资源
export const getStructuredVideosInAreaApi = query => {
  const param = {
    url: '/structure/video/resource/zone',
    body: {
      wkt: query.wkt,
      sid: query.sid
    }
  }
  return post(param)
}
// 根据2d地图框选资源
export const getStructuredVideosApi = query => {
  const param = {
    url: '/structure/video/resource/zone/all',
    query: query
  }
  return get(param)
}
