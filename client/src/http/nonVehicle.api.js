import {
  post, get, put, remove
} from './base'
/* 添加非机动车信息 */
export const addNonVehicleApi = data => {
  const param = {
    url: '/nonVehicle/new',
    body: data
  }
  return post(param)
}
/* 修改非机动车信息 */
export const editNonVehicleApi = data => {
  const param = {
    url: '/nonVehicle/edit/' + data.id,
    body: data.body
  }
  return put(param)
}
/* 查询非机动车信息 */
export const getNonVehicleApi = data => {
  const param = {
    url: '/nonVehicle/list',
    query: data
  }
  return get(param)
}
/* 删除非机动车信息 */
export const deleteNonVehicleApi = ids => {
  const param = {
    url: '/nonVehicle/destroy/' + ids
  }
  return remove(param)
}
/* 删除子机构时，相应删除子机构下的电动车资源 */
export const deleteNodeNonVehicleApi = id => {
  const param = {
    url: '/nonVehicle/org/' + id
  }
  return remove(param)
}
/* 获取某条详细信息 */
export const getOneNonVehicleApi = id => {
  const param = {
    url: '/nonVehicle/show/' + id
  }
  return get(param)
}
/* 导出 */
export const exportNonVehicleApi = data => {
  const param = {
    url: '/nonVehicle/download',
    body: data
  }
  return post(param)
}
/* 统计查询-备案电动车及今日备案数量 */
export const getNonVehicleCountApi = data => {
  const param = {
    url: '/nonVehicle/total'
  }
  return get(param)
}
/* 统计查询-查询次数 */
export const getNonVehicleCheckApi = data => {
  const param = {
    url: '/nonVehicle/analysis',
    query: data
  }
  return get(param)
}
/* 电动车管理 导入 */
export const ImportNonVehicleApi = data => {
  const param = {
    url: '/nonVehicle/import/' + data.orgId + '/' + data.excelName
  }
  return get(param)
}

/* 统计查询-人车同检统计 核验总量统计 */
export const getCheckTotalApi = data => {
  const param = {
    url: '/MotorVehicle/peopleVehicle/analysis',
    query: data
  }
  return get(param)
}

/* 统计查询-人车同检统计 核验总量统计 */
export const getCheckFailedApi = data => {
  const param = {
    url: '/MotorVehicle/peopleVehicle/analysisTop',
    query: data
  }
  return get(param)
}

/* 统计查询-车流量统计 车辆统计 */
export const getVehicleTotalApi = data => {
  const param = {
    url: '/MotorVehicle/passVehicle/analysis',
    query: data
  }
  return get(param)
}

/* 统计查询-车流量统计 车辆统计 */
export const getBreakRuleVehicleApi = data => {
  const param = {
    url: '/MotorVehicle/passVehicle/total',
    query: data
  }
  return get(param)
}

/* 获取电动车违规记录 */
export const getBreakRulesRecordApi = data => {
  const param = {
    url: 'nonVehicle/violation?' + data
  }
  return get(param)
}
