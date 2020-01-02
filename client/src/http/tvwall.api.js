import { AV_STREAM_START } from './video.api'
import { post, put, get, remove } from './base'
import { read } from '../storage/index'
export const TV_WALL_OPEN = async param => {
  const suc = await AV_STREAM_START(param)
  return post({
    url: `wall/open?devid=${param.id}`,
    body: {
      devInfo: {
        devIp: param.devIp,
        devPort: param.devPort
      },
      devCtl: {
        MonitorCfgArr: [
          {
            monitor: param.monitor,
            PaneCfgArr: [
              {
                streamType: param.streamType,
                pane: param.pane,
                tsAddr: suc.data.tsIp,
                tsPort: 6002,
                channel: param.channel,
                devIp: param.ip,
                port: param.port
              }
            ]
          }
        ]
      }
    }
  })
}

export const TV_WALL_CLOSE = param => {
  return post({
    url: `wall/close?devid=${param.id}`,
    body: {
      devInfo: {
        devIp: param.devIp,
        devPort: param.devPort
      },
      devCtl: {
        MonitorCfgArr: [
          {
            monitor: param.monitor,
            PaneCfgArr: [
              {
                pane: param.pane
              }
            ]
          }
        ]
      }
    }
  })
}

export const GET_DECODER_ABILITY = param => {
  return post({
    url: `wall/getdecoderability?devid=${param.id}`,
    body: {
      devInfo: {
        devIp: param.ip,
        devPort: param.port
      }
    }
  })
}

export const getTVListApi = () => {
  return get({
    url: `tvwall/wall?roleid=${read('roleId')}`
  })
}

export const addTVWallApi = param => {
  return post({
    url: 'tvwall/wall',
    body: param
  })
}

export const setTVWallApi = (id, params) => {
  return put({
    url: `/tvwall/wall/${id}`,
    body: params
  })
}

export const addLayoutApi = param => {
  return post({
    url: 'tvwall/layout',
    body: param
  })
}

export const delLayoutApi = id => {
  return remove({
    url: `tvwall/layout/${id}`
  })
}

export const chanLayoutApi = param => {
  return put({
    url: 'tvwall/layout/' + param.id,
    body: {
      name: param.name,
      column: param.column,
      row: param.row
    }
  })
}

export const addControlApi = param => {
  return put({
    url: 'tvwall/wall/jointcfg',
    body: {
      manufacturer: param.manufacturer,
      url: param.url,
      port: param.port
    }
  })
}

export const getControlApi = () => {
  return get({
    url: 'tvwall/wall/jointcfg/'
  })
}

export const getDecoderListApi = () => {
  return get({
    url: '/setting/device/type/5'
  })
}

export const getChannelCfgApi = id => {
  return get({
    url: `/setting/device/${id}/resource/5`
  })
}

export const getAllLayoutListApi = id => {
  return get({
    url: `/tvwall/layout/${id}`
  })
}

export const getPollingApi = id => {
  return get({
    url: `/tvwall/wall/${id}/polling`
  })
}

export const setPollingApi = (id, params) => {
  return put({
    url: '/tvwall/polling/' + params.id,
    body: {
      ...params,
      wall: id
    }
  })
}

export const exePollingApi = id => {
  return post({
    url: '/tvwall/polling/exec',
    body: {
      id
    }
  })
}

export const deletePollingApi = (pollingId, tvwallId) => {
  return remove({
    url: `/tvwall/polling/${pollingId}?wall=${tvwallId}`
  })
}

export const addPollingApi = (params, id) => {
  return post({
    url: '/tvwall/polling',
    body: {
      ...params,
      wall: id
    }
  })
}

export const getScenesApi = id => {
  return get({
    url: `/tvwall/wall/${id}/scene`
  })
}

export const deleteSceneApi = sceneId => {
  return remove({
    url: '/tvwall/scene/' + sceneId
  })
}

export const addSceneApi = (param, id) => {
  return post({
    url: '/tvwall/scene',
    body: {
      ...param,
      wall: id
    }
  })
}

export const renameSceneApi = (id, name) => {
  return put({
    url: `/tvwall/scene/${id}/name`,
    body: {
      name
    }
  })
}

export const getRtsceneApi = id => {
  return get({
    url: `/tvwall/scene/${id}`
  })
}

export const setSceneApi = (params, id) => {
  let para = params.id instanceof Object ? params.id._id : params.id
  return put({
    url: `/tvwall/scene/` + para,
    body: {
      ...params,
      wall: id
    }
  })
}

export const getPlansApi = id => {
  return get({
    url: `/tvwall/wall/${id}/plan`
  })
}

export const setPlanApi = (id, params) => {
  return put({
    url: '/tvwall/plan/' + params._id,
    body: {
      ...params,
      wall: id
    }
  })
}

export const deletePlanApi = (id, planId) => {
  return remove({
    url: '/tvwall/plan/' + planId + '?wall=' + id
  })
}

export const addPlanApi = (id, params) => {
  return post({
    url: '/tvwall/plan',
    body: {
      ...params,
      wall: id
    }
  })
}

export const executePlanApi = id => {
  return get({
    url: `tvwall/plan/${id}/use`
  })
}

export const deleteDecoderApi = ids => {
  return remove(
    {
      url: 'tvwall/monitor/'
    },
    {
      data: {
        ids: ids
      }
    }
  )
}

export const addDecoderApi = (id, params) => {
  return post({
    url: 'tvwall/monitor',
    body: {
      ...params,
      wall: id
    }
  })
}

export const setDecoderApi = params => {
  return put({
    url: 'tvwall/monitor/' + params.id,
    body: params
  })
}

export const getMonitorListApi = id => {
  return get({
    url: `tvwall/wall/${id}/monitor`
  })
}

export const openWallApi = (id, monitor, number, resource, eventList, ds, streamId, ts) => {
  if (ds) {
    return post({
      url: `tvwall/wall/${id}/openvod`,
      body: {
        monitor,
        number,
        resource,
        dsCmdContent: eventList,
        ds
      }
    })
  } else if (ts) {
    return post({
      url: `tvwall/wall/${id}/frontVod`,
      body: {
        monitor,
        number,
        resource,
        streamIdLong: +streamId,
        ts
      }
    })
  }
  return post({
    url: `tvwall/wall/${id}/open`,
    body: {
      monitor,
      number,
      resource
    }
  })
}

export const closeWallApi = (id, monitor, number) => {
  return post({
    url: `tvwall/wall/${id}/close`,
    body: {
      monitor,
      number
    }
  })
}

export const closeAllWallApi = id => {
  return post({
    url: `tvwall/wall/${id}/closeall`
  })
}

export const setScreenSplitApi = (id, monitor, panecount, isMouse) => {
  return post({
    url: `tvwall/wall/${id}/setmonitorcfg`,
    body: {
      monitor,
      panecount,
      isMouse
    }
  })
}

export const toggleShowNum = (monitors, show) => {
  return post({
    url: 'tvwall/wall/showno',
    body: {
      show,
      monitors
    }
  })
}

export const getDeviceInfosApi = () => {
  return get({
    url: `tvwall/wall/device`
  })
}

export const getOriginApi = id => {
  return get({
    url: `tvwall/origin/${id}`
  })
}

export const getChannelApi = () => {
  return get({
    url: 'tvwall/wall/decodechan'
  })
}

export const getOriginToChannelApi = id => {
  return get({
    url: `tvwall/origin/${id}`
  })
}

export const updateOriginApi = param => {
  return put({
    url: `tvwall/origin/${param._id}`,
    body: param
  })
}

export const getJointLayoutApi = reqData => {
  return post({
    url: 'tvwall/wall/jointlayout',
    body: reqData
  })
}

export const setJointLayoutApi = (ip, port, id, tvwall) => {
  return put({
    url: 'tvwall/wall/jointlayout',
    body: {
      ip: ip,
      port: port,
      sceneid: id,
      tvwall: tvwall
    }
  })
}

export const deleteWallApi = wallId => {
  return remove({
    url: `/tvwall/wall/${wallId}`
  })
}

export const updateLayoutApi = params => {
  return post({
    url: 'tvwall/wall/updatejointlayout',
    body: params
  })
}

export const fullDisplayApi = params => {
  return put({
    url: 'tvwall/wall/fulldisplay',
    body: params
  })
}
export const treeLoadingApi = query => {
  return get({
    url: 'onetree/getChildNode',
    query
  })
}
