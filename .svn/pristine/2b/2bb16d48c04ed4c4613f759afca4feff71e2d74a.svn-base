import { get, post, put, remove } from './base'

// 根据地图标识加载网格数据
export const loadMapConfigArrApi = () => {
  const param = {
    url: '/map/maplist'
  }
  return get(param)
}

// 根据地图标识加载网格数据
export const loadGridsByMapIdApi = mapId => {
  const param = {
    url: '/map/grid/mapid?mapId=' + mapId
  }
  return get(param)
}
// 根据楼宇标识加载网格数据
export const loadGridsByFloorIdApi = floorId => {
  const param = {
    url: '/map/grid/sid?sid=' + floorId
  }
  return get(param)
}
// 获取分页楼宇信息
export const getBuildPagingApi = playod => {
  const param = {
    url: '/map/building/mapid?mapId=' + playod.id + '&buildpage=' + playod.page + '&buildlimit=' + playod.limit + '&seek=' + encodeURIComponent(playod.name.toString())
  }
  return get(param)
}
// 获取分页显示的网格数据
export const getGridPagingApi = playod => {
  const param = {
    url: '/map/grid/mapid?mapId=' + playod.id + '&gridpage=' + playod.page + '&gridlimit=' + playod.limit + '&seek=' + encodeURIComponent(playod.name.toString())
  }
  return get(param)
}
// 根据楼宇标识加载网格数据
export const getGridPagingByFloorIdApi = payload => {
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
// 修改指定网格
export const editOneBuildApi = playod => {
  const param = {
    body: playod,
    url: '/map/building/' + playod._id
  }
  return put(param)
}
// 删除指定网格
export const deleteOneBuildApi = playod => {
  const param = {
    query: playod,
    url: '/map/building/' + playod
  }
  return remove(param)
}
// 添加楼宇
export const addOneBuildApi = playod => {
  const param = {
    body: playod.body,
    mapId: playod.mapId,
    url: '/map/building'
  }
  return post(param)
}
// 添加楼层
export const addOneLevelApi = playod => {
  const param = {
    body: playod,
    url: '/map/storey'
  }
  return post(param)
}
// 编辑楼层
export const editOneLevelApi = playod => {
  const param = {
    body: playod,
    url: '/map/storey/' + playod._id
  }
  return put(param)
}
// 获取报警助树方法
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
// 获取2d资源树
export const getResourceTreeApi = playod => {
  const param = {
    url: '/setting/resource/tree/map/multiresource',
    query: {
      orgtype: 0,
      channelTypes: '0',
      mapType: '2D'
    }
  }
  if (playod) {
    // param.query.storeyId = playod
    for (const key in playod) {
      param.query[key] = playod[key]
    }
  }
  return get(param)
}
// 获取2d报警资源树
export const getAlarmOrgApi = playod => {
  const param = {
    url: '/setting/resource/tree/map/firealarmin',
    query: {
      orgtype: 0,
      channelTypes: '11,9,1'
    }
  }
  if (playod) {
    param.query.storeyId = playod
  }
  return get(param)
}
// 获取2d巡更点位资源树
export const getPatrolPointApi = playod => {
  const param = {
    url: '/setting/sentry/point/tree',
    query: {}
  }
  if (playod) {
    param.query.storeyId = playod
  }
  return get(param)
}
// 根据地图标识加载楼宇数据
export const loadBuildingsByMapIdApi = mapId => {
  const param = {
    url: '/map/building/mapid?mapId=' + mapId
  }
  return get(param)
}

// 根据地图标识加载视频数据
export const loadVideosByMapIdApi = mapId => {
  const param = {
    url: '/map/point/mapid?mapId=' + mapId + '&channelType=0'
  }
  return get(param)
}

// 根据地图标识加载视频数据
export const loadVideosByFloorIdApi = floorId => {
  const param = {
    url: '/map/storey/' + floorId + '/reses?channelTypes=0'
  }
  return get(param)
}

// 根据地图标识、监控类型加载视频数据
export const loadSubVideosByMapIdApi = query => {
  let queryParam = {channelType: 0}
  query.mapId && (queryParam.mapId = query.mapId)
  typeof query.monitortype !== 'undefined' && (queryParam.monitortype = query.monitortype)
  typeof query.monitoryPointGenera !== 'undefined' && (queryParam.monitoryPointGenera = query.monitoryPointGenera)
  const param = {
    url: '/map/point/type',
    query: queryParam
  }
  return get(param)
}

// 根据地图标识加载巡更数据
export const loadPatrolsByMapIdApi = mapId => {
  const param = {
    url: '/setting/sentry/point/map/' + mapId
  }
  return get(param)
}

// 根据地图标识加载普通报警数据
export const loadCommonAlarmsByMapIdApi = mapId => {
  const param = {
    url: '/map/point/mapid?mapId=' + mapId + '&channelType=1'
  }
  return get(param)
}

// 根据地图标识加载消防报警数据
export const loadFireAlarmsByMapIdApi = mapId => {
  const param = {
    // url: '/map/point/mapid?mapId=' + mapId + '&channelType=11'
    url: '/setting/resource/list/map/firealarmin?orgtype=0&maptype=2d&channelTypes=11&mapId=' + mapId
  }
  return get(param)
}

// 根据地图标识加载报警主机数据
export const loadAlarmHostsByMapIdApi = mapId => {
  const param = {
    url: '/map/point/mapid?mapId=' + mapId + '&channelType=9'
  }
  return get(param)
}
/* 获取巡更信息 */
export const get2DPatrolInfoApi = playod => {
  return get({
    url: '/setting/sentry/point/statistic'
  })
}
/* 获取巡更点位巡更次数信息 */
export const get2DPatrolCountInfoApi = patrolId => {
  // http://localhost:9009/api/setting/sentry/point/5be7d6d3d741d94a01fcfb70/statistic
  return get({
    url: '/setting/sentry/point/' + patrolId + '/statistic'
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
// 根据id获取网格数据
export const getGridDataByIdApi = id => {
  const param = {
    url: '/map/grid/' + id
  }
  return get(param)
}
// 根据id修改网格数据
export const editOneGridApi = playod => {
  const param = {
    body: playod,
    url: '/map/grid/' + playod._id
  }
  return put(param)
}
// 根据id删除网格数据
export const deleteOneGridApi = playod => {
  const param = {
    query: playod,
    url: '/map/grid/' + playod
  }
  return remove(param)
}
// 添加网格数据
export const addOneGridApi = playod => {
  const param = {
    body: playod.body,
    mapId: playod.mapId,
    url: '/map/grid'
  }
  return post(param)
}
// 校验网格名称
export const isGridNameApi = playod => {
  const param = {
    query: playod,
    url: '/map/grid/checkRepeat'
  }
  return get(param)
}

// 根据id获取楼宇数据
export const getBuildingDataByIdApi = id => {
  const param = {
    url: '/map/building/' + id
  }
  return get(param)
}

// 根据id获取普通资源数据（视频、普通报警、消防报警）
export const getCommonResourceByIdApi = id => {
  const param = {
    url: '/map/point/' + id
  }
  return get(param)
}
// 删除点位资源数据（视频、普通报警、消防报警）
export const delOnePointApi = playod => {
  const param = {
    body: playod,
    url: '/map/point/' + playod
  }
  return remove(param)
}

// 根据id获取巡更数据
export const getPatrolDataByIdApi = id => {
  const param = {
    url: '/setting/sentry/point/' + id
  }
  return get(param)
}

// 根据id获取单兵数据
export const getSingleDataByIdApi = id => {
  const param = {
    url: '/setting/sentry/user/' + id
  }
  return get(param)
}

// 获取地图结构树
export const getMapOrgTreeApi = id => {
  const param = {
    url: '/map/zone/tree?mapId=' + id
  }
  return get(param)
}

// 根据标识获取楼层数据
export const getFoorByIdApi = id => {
  const param = {
    url: '/map/storey/' + id
  }
  return get(param)
}
// 删除楼层
export const deleteOneLevelApi = playod => {
  const param = {
    query: playod,
    url: '/map/storey/' + playod
  }
  return remove(param)
}
// 校验楼宇名称
export const isBuildNameApi = playod => {
  const param = {
    query: playod,
    url: '/map/building/checkRepeat'
  }
  return get(param)
}
// 获取所有楼层列表
export const getLevelApi = id => {
  const param = {
    url: '/map/building/' + id + '/storey'
  }
  return get(param)
}

// 根据楼层标识、监控类型加载视频数据
export const loadSubVideosByFloorIdApi = query => {
  let queryParam = {channelTypes: 0}
  typeof query.monitortype !== 'undefined' && (queryParam.monitortype = query.monitortype)
  typeof query.monitoryPointGenera !== 'undefined' && (queryParam.monitoryPointGenera = query.monitoryPointGenera)
  const param = {
    url: '/map/storey/' + query.floorId + '/reses',
    query: queryParam
  }
  return get(param)
}

// 根据楼层标识、资源类型加载资源数据(视频、普通报警、消防报警)
export const loadResourceByFloorIdApi = query => {
  const param = {
    url: '/map/storey/' + query.floorId + '/point?channelTypes=' + query.channelTypes
  }
  return get(param)
}

// 根据楼层标识加载巡更数据
export const loadPatrolByFloorIdApi = floorId => {
  const param = {
    url: '/setting/sentry/point/store/' + floorId
  }
  return get(param)
}

// 根据2d地图框选资源
export const get2DSelectBoxDataApi = playod => {
  const param = {
    url: '/map/zone/statistic/resource',
    body: {
      wkt: playod.wkt,
      sid: playod.sid,
      mapProjection: playod.mapProjection
    }
  }
  return post(param)
}
// 设置2D中心点位置
export const setMapCenterApi = playod => {
  const param = {
    body: {
      center: playod.center
    },
    url: '/map/maplist/' + playod.mapId
  }
  return put(param)
}
// 设置地图列表
export const setMapServerListApi = playod => {
  const param = {
    body: playod,
    url: '/map/maplist'
  }
  return post(param)
}
// 更新地图列表数据
export const updateMapServerListApi = playod => {
  const param = {
    body: playod,
    url: '/map/maplist/' + playod._id
  }
  return put(param)
}
// 设置地图列表
export const deleteMapDataApi = playod => {
  const param = {
    url: '/map/maplist/' + playod
  }
  return remove(param)
}

// 获取实时单兵列表（当天有任务且在线）
export const getRealSingleListApi = query => {
  const param = {
    url: '/setting/sentry/user/all',
    query: query
  }
  return get(param)
}

// 查询单兵轨迹
export const querySingleTrackApi = query => {
  const param = {
    url: '/patrol/trajectory?id=' + query.userId + '&start=' + query.start + '&end=' + query.end
  }
  return get(param)
}

// 根据oid查询点位默认图标
export const queryDefaultIconByOidApi = oid => {
  const param = {
    url: '/setting/icon/' + oid + '?default=true'
  }
  return get(param)
}

// 保存点位资源数据
export const saveCommonPointResApi = playod => {
  const param = {
    url: '/map/point/' + playod._id,
    body: playod.body
  }
  return put(param)
}

// 保存巡更点位资源数据
export const savePatrolPointResApi = playod => {
  const param = {
    url: '/setting/sentry/point/' + playod._id + '?mapType=2D',
    body: playod
  }
  return put(param)
}

// 删除巡更点位资源
export const deletePatrolPointResApi = playod => {
  const param = {
    url: '/setting/sentry/point/clean/' + playod
  }
  return remove(param)
}

// 查询报警求助资源
export const queryAlarmHelpResApi = playod => {
  let query = { channelType: 0 }
  if (playod.mapId) {
    query.mapId = playod.mapId
  }
  if (playod.sId) {
    query.sId = playod.sId
  }
  if (playod.alarm) {
    query.alarm = playod.alarm
  }
  const param = {
    url: '/map/point/type',
    query: query
  }
  return get(param)
}

// 获取地图2D统计警情接口
export const getMapAlarmStatistic = (mapId) => get({
  url: 'map/zone/statistics/alarm?mapId=' + mapId
})

// 获取地图2D统计资源接口
export const getMapResourcesStatistic = (mapId) => get({
  url: 'map/zone/statistics/allresource?mapId=' + mapId
})

// 2D获取框选区域内资源统计数据
export const getAllResourceByBoxApi = playod => {
  const param = {
    body: playod.param,
    url: `/map/zone/statistic/resource/area/count?mapId=` + playod.mapId
  }
  return post(param)
}

// 网格内的警情数量统计
export const getAllAlarmByGridApi = id => {
  const param = {
    url: `map/grid/` + id + `/statistic/alarm`
  }
  return get(param)
}

// 网格内统计元素数量
export const getAllResourceByGridApi = id => {
  const param = {
    url: `map/grid/` + id + `/statistic`
  }
  return get(param)
}

// 根据单兵机构标识获取该机构下的所有单兵
export const getSingleListByOrgIdApi = orgId => {
  const param = {
    url: `/setting/sentry/user/list?orgid=` + orgId
  }
  return get(param)
}

// 2d地图配置-获取通讯录人员信息
export const getAddressbookApi = mapId => {
  const param = {
    url: '/map/addressbook?mapId=' + mapId
  }
  return get(param)
}
// 2d地图配置-获取通讯录人员信息
export const getPrincipalApi = payload => {
  const param = {
    url: `/map/addressbook/${payload._id}?mapId=${payload.mapId}`
  }
  return get(param)
}
// 2d地图配置-搜索通讯录联系人
export const searchAddressbookApi = payload => {
  const param = {
    url: '/map/addressbook/principal/search?keyword=' + payload.keyword + '&mapId=' + payload.mapId
  }
  return get(param)
}
// 2d地图配置-添加新分组
export const addAddressbookGroupApi = playod => {
  const param = {
    body: playod,
    url: '/map/addressbook'
  }
  return post(param)
}

// 2d地图配置-添加通讯录人员信息

export const addAddressbookOneApi = playod => {
  const param = {
    body: {
      name: playod.name,
      mobile: playod.mobile,
      mobile2: playod.mobile2,
      telephone: playod.telephone,
      extension: playod.extension
    },
    url: `/map/addressbook/${playod.id}`
  }
  return post(param)
}

export const addAddressbookOneForPointApi = playod => {
  const param = {
    body: {
      name: playod.name,
      mobile: playod.mobile,
      mapId: playod.mapId,
      mobile2: playod.mobile2,
      telephone: playod.telephone,
      extension: playod.extension
    },
    url: '/map/addressbook/principal?type=' + playod.type
  }
  return post(param)
}
// 2d地图配置-修改通讯录人员信息 ——————————————————————
export const editAddressbookApi = playod => {
  const param = {
    body: {
      name: playod.name,
      mobile: playod.mobile,
      mobile2: playod.mobile2,
      telephone: playod.telephone,
      extension: playod.extension
    },
    url: '/map/addressbook/principal/' + playod._id
  }
  return put(param)
}
// 2d地图配置-收藏通讯录人员 ——————————————————————————
export const collectAddressbookApi = playod => {
  const param = {
    body: {
      collect: playod.collect
    },
    url: '/map/addressbook/principal/' + playod._id + '/collect'
  }
  return put(param)
}
// 2d地图配置-收藏分组
export const collectAddressbookGroupApi = playod => {
  const param = {
    body: {
      collect: playod.collect
    },
    url: `/map/addressbook/${playod.id}/collect`
  }
  return put(param)
}
// 2d地图配置-删除通讯录人员信息 ————————————————————————
export const deleteAddressbookApi = playod => {
  const param = {
    url: '/map/addressbook/principal/' + playod._id
  }
  return remove(param)
}
// 2d地图配置-保存通讯录排序
export const sortAddressbookApi = body => {
  const param = {
    body,
    url: '/map/addressbook/order'
  }
  return put(param)
}
// 2d地图配置-新分组删除
export const deleteAddressbookNewGroupApi = id => {
  const param = {
    url: '/map/addressbook/' + id
  }
  return remove(param)
}
// 2d地图配置-新分组修改
export const editAddressbookNewGroupApi = playod => {
  const param = {
    body: {
      name: playod.name
    },
    url: '/map/addressbook/' + playod.id
  }
  return put(param)
}
// 2d地图应用-获取已收藏的列表
export const getCollectAddressbookApi = id => {
  const param = {
    url: '/map/addressbook/principal/collect?mapId=' + id
  }
  return get(param)
}

// 2d地图配置-修改同步收藏参数
export const setEditCollectSettingApi = playod => {
  const param = {
    body: {
      isShowCollect: playod.isShowCollect
    },
    url: '/setting/sysparamters'
  }
  return put(param)
}
// 2d地图应用-获取同步收藏参数
export const getEditCollectSettingApi = () => {
  const param = {
    url: '/setting/sysparamters'
  }
  return get(param)
}
// 搜索已收藏列表
export const searchCollectAddressbookApi = playod => {
  const param = {
    url: '/map/addressbook/principal/collect/search?keyword=' + playod.keyword + '&mapId=' + playod.mapId
  }
  return get(param)
}
