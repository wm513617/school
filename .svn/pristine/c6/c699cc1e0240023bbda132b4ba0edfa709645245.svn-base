import { get, post, put, remove } from './base'
// 根据楼宇id获取某一楼宇的具体信息---
export const getOneBuildByIdApi = id => {
  const param = {
    url: '/map3d/building/' + id
  }
  return get(param)
}
// 获取全部楼宇信息
export const getAllBuildApi = () => {
  const param = {
    url: '/map3d/building'
  }
  return get(param)
}
// 建筑物信息保存
export const saveOneBuildApi = data => {
  const param = {
    body: data,
    url: '/map3d/building'
  }
  return post(param)
}
// 编辑模式建筑信息修改
export const editOneBuildByIdApi = playod => {
  const param = {
    body: playod.data,
    url: '/map3d/building/' + playod.id
  }
  return put(param)
}
// 根据分页参数获取楼宇列表----
export const getBuildListByPagingApi = playod => {
  const param = {
    url: '/map3d/building',
    query: {
      buildpage: playod.page,
      buildlimit: playod.limit,
      buildname: playod.name.toString()
    }
  }
  return get(param)
}
// 删除楼宇
export const deleteOneBuildByIdApi = id => {
  const param = {
    url: '/map3d/building/' + id
  }
  return remove(param)
}
// 获取一栋楼宇全部楼层信息 获取一栋楼宇全部楼层信息
export const getAllFloorsByIdApi = _id => {
  const param = {
    url: '/map3d/building/' + _id + '/storey'
  }
  return get(param)
}
// 获取单个楼层信息
export const getOneFloorApi = id => {
  const param = {
    url: '/map3d/storey/' + id
  }
  return get(param)
}
// 获取某一楼层的统计数据-----
export const getFloorStaticDataApi = playod => {
  var param = {
    url: '/map/storey/' + playod + '/statistic'
  }
  return get(param)
}
// 新增楼层信息
export const saveFloorToBuildApi = data => {
  const param = {
    body: data,
    url: '/map3d/storey'
  }
  return post(param)
}
// 修改楼层信息
export const editFloorInfoApi = playod => {
  const param = {
    url: '/map3d/storey/' + playod.id,
    body: playod.data
  }
  return put(param)
}
// 删除楼层
export const removeFloorApi = id => {
  const param = {
    url: '/map3d/storey/' + id
  }
  return remove(param)
}
// 查询楼层
export const SearchFloorApi = playod => {
  const param = {
    url: 'map3d/building/' + playod.id + '/storey/search',
    query: {
      name: playod.name.toString()
    }
  }
  return get(param)
}
// 获取单个巡更点位
export const getPatrolPointApi = playod => {
  const param = {
    url: '/setting/sentry/point/' + playod,
    query: {
      mapType: '3D'
    }
  }
  return get(param)
}
// 获取单个报警资源
// export const getAlarmPointApi = playod => {
//   const param = {
//     url: '/map/point/' + playod + '/fire',
//     query: {
//       mapType: '3D'
//     }
//   }
//   return get(param)
// }
// 根据id获取资源 ---胡红勋--2018-09-06
export const getResourceByIdApi = id => {
  const param = {
    url: '/map/point/' + id,
    query: {
      mapType: '3D'
    }
  }
  return get(param)
}
// 获取地图结构树
export const getMapOrgTreeApi = () => {
  const param = {
    url: '/map3d/zone/tree'
  }
  return get(param)
}
// 获取报警助树方法-----胡红勋添加---2018-09-03
export const getAlarmHelpOrgTreeApi = playod => {
  const param = {
    url: 'setting/resource/tree/map/alarmhelp',
    query: {
      mapType: playod.mapType
    }
  }
  if (playod.floorId) {
    param.query.storeyId = playod.floorId
  }
  return get(param)
}
// 获取视频点位树列表
export const getVedioResourceOrgTreeApi = playod => {
  const param = {
    url: '/setting/resource/tree/map/multiresource',
    query: {
      orgtype: 0,
      channelTypes: '0',
      mapType: playod.mapType
    }
  }
  if (playod.floorId) {
    param.query.storeyId = playod.floorId
  }
  return get(param)
}
// 获取报警资源树
export const getAlarmResourceOrgTreeApi = playod => {
  const param = {
    url: '/setting/resource/tree/map/firealarmin',
    query: {
      orgtype: 0,
      channelTypes: '1,11,9',
      mapType: playod.mapType
    }
  }
  if (playod.floorId) {
    param.query.storeyId = playod.floorId
  }
  return get(param)
}
// 获取巡更点位树
export const getPatrolOrgTreeApi = playod => {
  const param = {
    url: '/setting/sentry/point/tree',
    query: {
      mapType: playod.mapType
    }
  }
  if (playod.floorId) {
    param.query.storeyId = playod.floorId
  }
  return get(param)
}
// 获取3d地图的巡更点位 胡红勋添加
export const getAllPatrolPointApi = () => {
  const param = {
    url: 'setting/sentry/point/outer?mapType=3D'
  }
  return get(param)
}
// 在3d地图上获取指定类型的通道资源-----------2018-09-09
export const getResourcePointsByChannelTypeApi = playod => {
  let query = { channelTypes: playod.channelTypes, mapType: '3D' }
  if (playod.tab) { // 设备类型，用于区分视频与报警求助
    query.tab = playod.tab
  }
  if (playod.sid) {
    query.sid = playod.sid
  }
  const param = {
    url: '/map/point/three',
    query: query
  }
  return get(param)
}
// 根据楼层id获取本楼层上指定类型的通道资源---
export const getResourcePointsByFloorIdAndChannelTypeApi = playod => {
  const param = {
    url: 'map3d/storey/' + playod.id + '/point',
    query: playod.query
  }
  return get(param)
}
// 胡红勋添加，保存或者修改报警求助点位----
export const saveOrUpdateAlarmHelpPointApi = playod => {
  const param = {
    body: playod.body,
    url: '/map/point/' + playod._id + '?mapType=3D'
  }
  return put(param)
}
// 修改保存视频点位-
export const saveOrUpdateVedioPointApi = playod => {
  const param = {
    body: playod.body,
    url: '/map/point/' + playod._id + '?mapType=3D'
  }
  return put(param)
}
// 修改添加巡更点位
export const saveOrUPdatePatrolPointApi = playod => {
  const param = {
    body: playod,
    url: '/setting/sentry/point/' + playod._id + '?mapType=3D'
  }
  return put(param)
}
// 修改|添加资源报警点位
export const saveOrUPdateAlarmPointApi = playod => {
  const param = {
    body: playod.body,
    url: '/map/point/' + playod._id + '?mapType=3D'
  }
  return put(param)
}
// 根据地图范围统计资源
export const get3DSelectBoxDataApi = playod => {
  const param = {
    url: '/map3d/zone/statistic/resource',
    body: {
      wkt: playod.wkt,
      sid: playod.sid
    }
  }
  return post(param)
}
// 胡红勋添加 2018 -09 -08
export const deletePatrolPointByIdApi = playod => {
  const param = {
    url: '/setting/sentry/point/clean/' + playod + '?mapType=3D'
  }
  return remove(param)
}
// 胡红勋，删除点位资源--------2018-09-08
export const deleteResourceById = playod => {
  const param = {
    url: '/map/point/' + playod + '?mapType=3D'
  }
  return remove(param)
}
// 校验楼宇名称
export const checkBuildNameIsRepeatApi = playod => {
  const param = {
    query: playod,
    url: '/map/building/checkRepeat'
  }
  return get(param)
}
export const getOneFloorPatrolsApi = playod => {
  const param = {
    url: '/setting/sentry/point/store/' + playod + '?mapType=3D'
  }
  return get(param)
}
/* 获取3D地图参数配置 */
export const getMap3DParamConfig = payload => {
  const param = {
    url: '/map3D/conf'
  }
  return get(param)
}
/* 设置3D地图参数配置 */
export const setMap3DParamConfig = payload => {
  const param = {
    url: '/map3D/conf',
    body: payload
  }
  return put(param)
}
/* 根据楼层ID获取网格列表 */
export const getAllGridList = payload => {
  const param = {
    url: '/map/grid/sid',
    query: {
      sid: payload.id,
      gridpage: payload.page,
      gridlimit: payload.limit,
      seek: payload.name
    }
  }
  return get(param)
}
/* 新增楼层内网格 */
export const addGridInFloor = payload => {
  const param = {
    url: '/map/grid',
    body: payload
  }
  return post(param)
}
/* 获取楼层内单个网格信息 */
export const getGridByGridId = id => {
  const param = {
    url: '/map/grid/' + id
  }
  return get(param)
}
/* 修改楼层内网格 */
export const editGridInFloor = payload => {
  const param = {
    url: '/map/grid/' + payload.id,
    body: payload.body
  }
  return put(param)
}
/* 删除楼层内网格 */
export const deleteGridInFloor = id => {
  const param = {
    url: '/map/grid/' + id
  }
  return remove(param)
}
/* 查询点位模型列表 */
export const getPointModelListApi = query => {
  const param = {
    url: '/setting/model/group',
    query
  }
  return get(param)
}

/* 添加辅助杆 */
export const saveAssistHoleApi = data => {
  const param = {
    url: '/map3D/pole',
    body: data
  }
  return post(param)
}

/* 删除辅助杆 */
export const deleteAssistHoleApi = poleId => {
  let url = '/map3D/pole/' + poleId
  const param = { url: url }
  return remove(param)
}

/* 修改辅助杆 */
export const updateAssistHoleApi = payload => {
  const param = {
    url: '/map3D/pole/' + payload._id,
    body: payload
  }
  return put(param)
}

/* 查询辅助杆 */
export const getAssistHoleApi = poleId => {
  let url = poleId ? '/map3D/pole/' + poleId : '/map3D/pole'
  const param = { url: url }
  return get(param)
}

/* 添加图层设置信息 */
export const saveLayerSettingsApi = data => {
  const param = {
    url: '/map3D/layer',
    body: data
  }
  return post(param)
}

/* 删除图层设置信息 */
export const deleteLayerSettingsApi = layerId => {
  let url = '/map3D/layer/' + layerId
  const param = { url: url }
  return remove(param)
}

/* 修改图层设置信息 */
export const updateLayerSettingsApi = payload => {
  const param = {
    url: '/map3D/layer/' + payload._id,
    body: payload
  }
  return put(param)
}

/* 查询图层设置信息 */
export const getLayerSettingsApi = layerId => {
  let url = layerId ? '/map3D/layer/' + layerId : '/map3D/layer'
  const param = { url: url }
  return get(param)
}

/* 查询地面图层设置信息 */
export const getGroundLayerSettingsApi = () => {
  let url = '/map3D/layer/ground'
  const param = { url: url }
  return get(param)
}

/* 查询历史巡更位置信息 */
export const getHistoryPatrolPositionApi = query => {
  const param = {
    url: '/patrol/user/trajectory',
    query
  }
  return get(param)
}

/* 获取巡更信息 */
export const getPatrolInfoApi = id => {
  return get({
    url: `/setting/sentry/point/statistic?id=${id}`
  })
}
/** 聊天室/**
 *
 *
 * @param {*source:消息来源/sender：发送者/receiver：接收者/payload：消息内容} obj
 * @returns
 */
export const singleSendMsg = obj => {
  return post({
    url: 'patrol/instant/message',
    body: obj
  })
}

/* 获取模型统设置参数 */
export const getModelSettingParamsApi = oid => {
  let url = '/setting/model/params?oid=' + oid
  const param = { url: url }
  return get(param)
}

// 获取实时单兵列表（当天有任务且在线）
export const getRealSingleListApi = query => {
  const param = {
    url: '/setting/sentry/user/all',
    query: query
  }
  return get(param)
}

// 新增飞行路线
export const addOneFlightApi = data => {
  const param = {
    body: data,
    url: '/map3d/flight'
  }
  return post(param)
}
// 获取全部飞行路线
export const getAllFlightsApi = () => {
  const param = {
    url: '/map3d/flight'
  }
  return get(param)
}
// 修改飞行路线
export const updateOneFlightApi = payload => {
  const param = {
    url: '/map3d/flight/' + payload._id,
    body: payload
  }
  return put(param)
}
// 删除飞行路线
export const deleteOneFilghtApi = id => {
  const param = {
    url: '/map3d/flight/' + id
  }
  return remove(param)
}
// 根据oid查询点位默认图标
export const queryDefaultIconByOidApi = oid => {
  const param = {
    url: '/setting/icon/' + oid + '?default=true'
  }
  return get(param)
}
