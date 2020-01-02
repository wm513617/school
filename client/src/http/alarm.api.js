import {
  post, get, put, remove
} from './base'
/* 地图中报警过滤 */
export const mapAlarmFiltering = (data) => {
  const params = {
    body: data.param,
    url: `/warning/query?type=${data.type}&limit=${data.limit}&roleId=${data.roleId}&map=${data.map}`
  }
  return put(params)
}
/* 地图中所有报警  一次性返回数据 */
export const mapAllAlarmData = data => {
  const param = {
    url: `/warning/query/all?roleId=${data.roleId}&map=${data.map}`
  }
  return get(param)
}
/*  报警过滤 */
export const alarmFiltering = (data) => {
  const params = {
    body: data.param,
    url: '/warning/query?type=' + data.type + '&roleId=' + data.roleId
  }
  return put(params)
}
/*  报警过滤tab数量 */
export const alarmCount = (data) => {
  const params = {
    body: data.param,
    url: '/warning/query/count'
  }
  return put(params)
}
/* 报警确认（普通、消防、报警助） */
export const alarmToBeSureApi = payload => {
  const param = {
    url: '/alarm/alarmaffirm',
    body: payload
  }
  return post(param)
}

/*  获取报警时间模板 */
export const getMapAlarmTemp = (data) => {
  const params = {
    query: data,
    url: 'setting/alarmcfg/timetemplate'
  }
  return get(params)
}

/*  获取布放状态 */
export const getLayoutStatus = (data) => {
  const params = {
    url: 'setting/alarm/' + data.id + '/status'
  }
  return get(params)
}

/*  获取警情处理 */
export const getAlarmDeal = (data) => {
  const params = {
    query: data,
    url: '/setting/alarmcfg/deal'
  }
  return get(params)
}

/*  警情处理添加 */
export const addAlarmDeal = (data) => {
  const params = {
    url: '/setting/alarmcfg/deal',
    body: data
  }
  return post(params)
}

/*  警情处理修改 */
export const reviseAlarmDeal = (data) => {
  const params = {
    body: {
      name: data.name,
      page: data.page
    },
    url: '/setting/alarmcfg/deal/' + data.id
  }
  return put(params)
}

/*  警情处理删除 */
export const deleteAlarmDeal = (data) => {
  const params = {
    url: '/setting/alarmcfg/deal/' + data
  }
  return remove(params)
}

/*  获取警情处理启用状态 */
export const getAlarmDealStatus = (data) => {
  const params = {
    url: '/setting/alarmcfg/param'
  }
  return get(params)
}
/*  获取警情处理启用状态 */
export const reviseAlarmDealStatus = (data) => {
  let params
  if (data.type === 'fire') {
    params = {
      body: {
        fireOpen: data.fireOpen
      },
      url: '/setting/alarmcfg/param/' + data.id
    }
  } else {
    params = {
      body: {
        alarmOpen: data.alarmOpen
      },
      url: '/setting/alarmcfg/param/' + data.id
    }
  }
  return put(params)
}
/* 获取角色下报警资源、设备的报警权限 */
export const getAlarmPower = (data) => {
  const params = {
    query: data,
    url: 'setting/role/assign'
  }
  return get(params)
}
/* 手工报警确认 */
export const manualAlarmSureApi = data => {
  const params = {
    url: '/alarm/manualalarm',
    body: data
  }
  return post(params)
}
/* 获取报警备注信息 */
export const getAlarmRemarksApi = id => {
  const params = {
    url: '/warning/query/alarmRemark/' + id
  }
  return get(params)
}

/* 添加报警备注信息 */
export const putAlarmRemarksApi = data => {
  const params = {
    url: '/warning/query/alarmRemark/' + data.id,
    body: data.body
  }
  return put(params)
}

/* 获取报警联动电视墙信息 */
export const getAlarmWallApi = data => {
  const params = {
    url: '/warning/query/wallConfig?chanId=' + data
  }
  return get(params)
}

/*  报警记录备份接口 */
export const backupAlarmInfo = (data) => {
  const params = {
    url: '/warning/query/backup/' + data.id
  }
  return get(params)
}
/*  报警记录下载接口 */
export const downloadAlarmInfo = (data) => {
  const params = {
    url: '/warning/query/download/' + data.id
  }
  return get(params)
}

/*  报警备份查询接口 */
export const inquireDownloadInfo = (data) => {
  const params = {
    url: '/warning/query/backup/' + data + '/status'
  }
  return get(params)
}
