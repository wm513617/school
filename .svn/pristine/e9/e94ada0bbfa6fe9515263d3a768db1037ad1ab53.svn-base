import {
  post, get, put, remove
} from './base'
/* 添加机动车信息 */
export const addMotorVehicleApi = data => {
  const param = {
    url: '/MotorVehicle/new',
    body: data
  }
  return post(param)
}
/* 修改机动车信息 */
export const editMotorVehicleApi = data => {
  const param = {
    url: '/MotorVehicle/edit/' + data.id,
    body: data.body
  }
  return put(param)
}
/* 查询机动车信息 */
export const getMotorVehicleApi = data => {
  const param = {
    url: '/MotorVehicle/list',
    query: data
  }
  return get(param)
}
/* 删除机动车信息 */
export const deleteMotorVehicleApi = ids => {
  const param = {
    url: '/MotorVehicle/destroy/' + ids
  }
  return remove(param)
}
/* 机动车管理 导出 */
export const exportMotorVehicleApi = data => {
  console.log('-----datadata--------', data)
  const param = {
    url: '/MotorVehicle/download/',
    query: data
  }
  return get(param)
}
/* 机动车管理 导入 */
export const ImportMotorVehicleApi = data => {
  const param = {
    url: '/MotorVehicle/import/' + data.orgId + '/' + data.excelName
  }
  return get(param)
}
/* 删除机动车机构下所有设备 */
export const deleteMotorVehicleOrgApi = id => {
  const param = {
    url: '/MotorVehicle/org/' + id
  }
  return remove(param)
}
