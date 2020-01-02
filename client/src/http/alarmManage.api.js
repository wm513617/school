import { post, get, put, remove } from './base'
import { read } from '../storage/index'
export const getAlarmOrgTreeApi = data => {
  const param = {
    url: '/setting/org/tree'
  }
  return get(param)
}

export const getAlarmTreeApi = data => {
  const param = {
    url: '/setting/resource/distributiontreeforalarm',
    query: data
  }
  return get(param)
}

export const getAlarmInputApi = data => {
  const param = {
    url: 'setting/resource/alarmlist',
    query: data
  }
  return get(param)
}

export const getFireAlarmApi = data => {
  const param = {
    url: 'setting/resource/firealarm',
    query: data
  }
  return get(param)
}

export const getVideoAlarmApi = data => {
  const param = {
    url: 'setting/resource/alarmlist/dependvideo',
    query: data
  }
  return get(param)
}
export const addNormalAlarmApi = data => {
  const param = {
    url: '/setting/resource/distribute',
    body: data
  }
  return post(param)
}

export const deleteNormalAlarmApi = data => {
  const param = {
    url: 'setting/resource/unbind?type=0'
  }
  return remove(param, {headers: {
    'x-bsc-ids': data
  }})
}

export const editNormalAlarmApi = data => {
  const param = {
    url: '/setting/resource/' + data._id,
    body: data.body
  }
  return put(param)
}

export const editMoreNormalAlarmApi = payload => {
  const param = {
    url: '/setting/resource/patch',
    body: payload.body
  }
  return put(param, {
    headers: {
      'x-bsc-ids': payload.ids
    }
  })
}

export const getDeviceTreeApi = data => {
  const param = {
    url: '/setting/resource/tree/link/alarm',
    query: data
  }
  return get(param)
}

export const getLinkActionApi = data => {
  const param = {
    url: 'setting/alarmcfg/set/' + data
  }
  return get(param)
}

export const saveLinkActionApi = data => {
  const param = {
    url: 'setting/alarmcfg/set/' + data.id,
    body: data.body
  }
  return put(param)
}

export const saveMoreLinkActionApi = data => {
  const param = {
    url: 'setting/alarmcfg/setfirepatch',
    body: data.body
  }
  return put(param, {
    headers: {
      'x-bsc-ids': data.ids
    }
  })
}

export const getAlarmHostApi = data => {
  const param = {
    url: 'setting/resource',
    query: data
  }
  return get(param)
}

export const getAlarmHelpApi = data => {
  const param = {
    url: 'setting/alarmhelp/client',
    query: data
  }
  return get(param)
}

export const editAlarmHelpApi = payload => {
  const param = {
    url: '/setting/alarmhelp/clientPatch',
    body: payload.data
  }
  return put(param, {
    headers: {
      'x-bsc-ids': payload.ids
    }
  })
}

export const getTrafficTreeApi = data => {
  const param = {
    url: 'setting/traffic/server?struct=tree'
  }
  return get(param)
}

export const getTrafficAlarmApi = data => {
  const param = {
    url: 'setting/traffic/lane',
    query: data
  }
  return get(param)
}

export const editTrafficAlarmApi = payload => {
  const param = {
    url: 'setting/traffic/lane',
    body: payload.data
  }
  return put(param, {
    headers: {
      'x-bsc-ids': payload.ids
    }
  })
}

export const getFaceAlarmTreeApi = data => {
  const param = {
    url: 'setting/org/tree/?type=6 '
  }
  return get(param)
}

export const getFaceAlarmApi = data => {
  const param = {
    url: 'veriface/param/faceResource',
    query: data
  }
  return get(param)
}

export const getAlarmDelayApi = data => {
  const param = {
    url: 'setting/alarmcfg/alarmDelay'
  }
  return get(param)
}

export const setAlarmDelayApi = data => {
  const param = {
    url: 'setting/alarmcfg/setAlarmDelay',
    body: data
  }
  return put(param)
}

export const getEquipmentAlarmApi = data => {
  const param = {
    url: 'setting/resource/video/devicealarm/all',
    query: data
  }
  return get(param)
}

export const getEquipmentTreeApi = data => {
  const param = {
    url: '/setting/device/treeNew',
    query: data
  }
  return get(param)
}

export const addEquipmentAlarmApi = data => {
  const param = {
    url: '/setting/resource/video/devicealarm/add',
    body: data
  }
  return post(param)
}

export const editDeviceAlarmApi = data => {
  const param = {
    url: '/setting/resource/video/devicealarm',
    body: data
  }
  return put(param)
}

export const deleteDeviceAlarmApi = data => {
  const param = {
    url: 'setting/resource/video/devicealarm?ids=' + data
  }
  return remove(param)
  // return remove(param, {headers: {
  //   'x-bsc-ids': data
  // }})
}

export const getTvWallListApi = data => {
  const param = {
    url: `tvwall/wall?roleid=${read('roleId')}`
  }
  return get(param)
}

export const getTvWallSceneApi = data => {
  const param = {
    url: `tvwall/wall/${data}/scene`
  }
  return get(param)
}

export const getMonitorTreeApi = data => {
  const param = {
    url: 'setting/device/alarmtree',
    query: data
  }
  return get(param)
}

export const getMonitorAlarmApi = data => {
  const param = {
    url: 'setting/resource/video/monitorypointalarm/all',
    query: data
  }
  return get(param)
}

export const addMonitorAlarmApi = data => {
  const param = {
    url: 'setting/resource/video/monitorypointalarm/add',
    body: data
  }
  return post(param)
}

export const editMonitorAlarmApi = data => {
  const param = {
    url: 'setting/resource/video/monitorypointalarm/' + data.id,
    body: data.body
  }
  return put(param)
}

export const editMoreMonitorAlarmApi = data => {
  const param = {
    url: 'setting/resource/video/monitorypointalarm/patch',
    body: data
  }
  return put(param)
}

export const deleteMonitorAlarmApi = ids => {
  const param = {
    url: 'setting/resource/video/monitorypointalarm?ids=' + ids
  }
  return remove(param)
}

export const getIntelligentAlarmApi = data => {
  const param = {
    url: 'setting/resource/video/intelligentalarm/all',
    query: data
  }
  return get(param)
}

export const addIntelligentAlarmApi = data => {
  const param = {
    url: 'setting/resource/video/intelligentalarm/add',
    body: data
  }
  return post(param)
}

export const deleteIntelligentAlarmApi = ids => {
  const param = {
    url: 'setting/resource/video/intelligentalarm?ids=' + ids
  }
  return remove(param)
}

export const editIntelligentAlarmApi = data => {
  const param = {
    url: 'setting/resource/video/intelligentalarm/' + data.id,
    body: data.body
  }
  return put(param)
}

export const editMoreIntelligentAlarmApi = data => {
  const param = {
    url: 'setting/resource/video/intelligentalarm/patch',
    body: data
  }
  return put(param)
}

export const getFireHostListApi = data => {
  const param = {
    url: 'setting/device',
    query: data
  }
  return get(param)
}

export const addFireAlarmApi = data => {
  const param = {
    url: 'setting/resource',
    body: data
  }
  return post(param)
}

export const addMoreFireAlarmApi = data => {
  const param = {
    url: 'setting/resource/fire/patch',
    body: data
  }
  return post(param)
}

export const deleteFireAlarmApi = data => {
  const param = {
    url: 'setting/resource/patch/fire'
  }
  return remove(param, {headers: {
    'x-bsc-ids': data
  }})
}

export const editFireAlarmApi = data => {
  const param = {
    url: 'setting/resource/' + data.id,
    body: data.body
  }
  return put(param)
}

export const editMoreFireAlarmApi = data => {
  const param = {
    url: 'setting/resource/patch',
    body: data.body
  }
  return put(param, {
    headers: {
      'x-bsc-ids': data.id
    }
  })
}

export const moveFireAlarmApi = data => {
  const param = {
    url: 'setting/resource/org/firealarm',
    body: data.body
  }
  return put(param, {
    headers: {
      'x-bsc-ids': data.id
    }
  })
}

export const getFireHostCountApi = data => {
  const param = {
    url: 'setting/resource/firecount',
    query: data
  }
  return get(param)
}

export const getAllAlarmTabNumberApi = id => {
  const param = {
    url: 'setting/resource/allAlarmCount?oid=' + id
  }
  return get(param)
}

export const syncFireAlarmApi = data => {
  const param = {
    url: 'setting/device/synchronousfire'
  }
  return get(param)
}
