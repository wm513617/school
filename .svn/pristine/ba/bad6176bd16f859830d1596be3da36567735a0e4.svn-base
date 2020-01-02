import { get, post, put, remove } from './base'

/**
 * 模型机构树
 */
export const getModelOrganizaApi = () => get({
  url: '/setting/model/org'
})
/**
     * 获取三维地图模型列表接口
     */
export const getModelListApi = query => get({
  url: '/setting/model',
  query
})
/**
     * 添加三维地图模型接口
     */
export const postModelAddApi = (body) => post({
  url: '/setting/model',
  body
})
/**
     * 修改三维地图模型接口
     */
export const putModelUpdateApi = (id, body) => put({
  url: '/setting/model/' + id,
  body
})
/**
     * 获取三维地图模型亮度和高度接口
     */
export const getModelBrightnessHeightApi = (id) => get({
  url: '/setting/model/params?oid=' + id
})
/**
     * 修改三维地图模型亮度和高度接口
     */
export const putModelBrightnessHeightApi = (id, body) => put({
  url: '/setting/model?oid=' + id,
  body
})
/**
     * 删除三维地图模型接口
     */
export const removeModelDeleteApi = arrId => {
  let _ids = arrId.join(',')
  // console.log(_ids, arrId)
  return remove({
    url: '/setting/model'
  }, {
    headers: {
      'x-bsc-ids': _ids
    }
  })
}
/**
     * 获取一组模型数据
     */
export const getUpdateModelTypeApi = query => get({
  // url: '/setting/model/group?name=' + encodeURI(encodeURI(query.name))
  url: '/setting/model/group',
  query
})
/**
     * 设置模型默认接口
     */
export const putModelDefaultApi = (id, body) => put({
  url: '/setting/model/' + id + '/default',
  body
})

export const getMapIconListIn3d = (query) => get({
  url: '/setting/icon',
  query
})
