import { get, post, put, remove } from '../base'
export const getRepairUnitApi = payLoad => {
  const params = {
    query: payLoad,
    url: 'setting/operation/config/list'
  }
  return get(params)
}
// 维修单位添加post
export const addRepairUnitApi = payLoad => {
  const params = {
    body: payLoad,
    url: 'setting/operation/config/'
  }
  return post(params)
}
// 维修单位修改put前的get
export const getEditorRepairInfoApi = id => {
  const params = {
    url: 'setting/operation/config/' + id
  }
  return get(params)
}
// 维修单位修改put
export const editorRepairUnitApi = payLoad => {
  const params = {
    body: payLoad.addParams,
    url: 'setting/operation/config/' + payLoad.id
  }
  return put(params)
}
// 维修单位delete
export const delRepairUnitApi = v => {
  return remove({
    url: 'setting/operation/config/' + v
  })
}
// 录像检测间隔get
export const getMonitorIntervalApi = payLoad => {
  const params = {
    query: {
      minute: payLoad
    },
    url: ''
  }
  return get(params)
}
// 录像检测间隔set
export const setMonitorIntervalApi = payLoad => {
  const params = {
    url: '/door/servers/' + payLoad._id,
    body: payLoad
  }
  return put(params)
}
