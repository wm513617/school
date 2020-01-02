/*
 * 区域统计接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:46:26
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-12-26 13:48:10
 */

'use strict'
const mongoose = require('mongoose')
const Grid = require('mongoose').model('Grid')
const Org = require('mongoose').model('Org')
const PatrolRecord = require('mongoose').model('PatrolRecord')
const PatrolAlarming = require('mongoose').model('PatrolAlarming')
const Resource = require('mongoose').model('Resource')
const Security = require('mongoose').model('Security')
const Building = require('mongoose').model('Building')
const Storey = require('mongoose').model('Storey')
const { handleSysException } = require('../../../common/tools')
const PatrolPoint = require('mongoose').model('PatrolPoint')
const jsts = require('jsts')
const { stringToWkt } = require('../../../common/tools')
const _ = require('lodash')
const moment = require('moment')
const Device = require('mongoose').model('Device')
const { alarmStatus } = require('../../../api/bstar/dev.interface')
const Role = require('../../sys/role/role.service')
const role = new Role()
const transformCoord = require('../util/transformcoord')
const meta = require('../util/meta')
const Helpers = require('@turf/helpers')
const Projection = require('@turf/projection')

exports.getNewTree = async ctx => {
  try {
    const { mapId } = ctx.query
    let [grids, buildings, resources, root] = await Promise.all([
      Grid.find({ mapId: mapId, sid: { $exists: false } }, '_id name loc bids')
        .lean()
        .exec(),
      Building.find({ mapId: mapId }, '_id code name gid')
        .lean()
        .exec(),
      Resource.find(
        { point: { $nin: [null, undefined] }, 'point.isouter': false, type: 0, eid: { $exists: true } },
        '_id point eid'
      )
        .populate({ path: 'eid', match: { bigtype: 0, type: { $nin: ['alarmBox', 'alarmPillar'] } }, select: 'type bigtype' })
        .lean()
        .exec(),
      Org.findOne({ isroot: true, type: 0 }).lean().exec()
    ])
    const bids = buildings.map(build => build._id)
    // 获取楼层和获取所有楼内网格
    let [storeys, gridsInBuildings] = await Promise.all([
      Storey.find({ bid: { $in: bids } }, '_id name bid')
        .lean()
        .exec(),
      Grid.find({ mapId: ctx.query.mapId, sid: { $exists: true } }, '_id name sid loc')
        .lean()
        .exec()
    ])
    const gridMap = new Map()
    const buildInGridArr = []
    // 网格内楼宇需要将 buildMap 对应的楼删掉
    grids.map(grid => {
      gridMap.set(grid._id + '', {
        _id: grid._id + '',
        name: grid.name,
        type: 'grid',
        videoCount: 0,
        loc: grid.loc,
        children: []
      })
    })
    const buildMap = new Map()
    buildings.map(building => {
      buildMap.set(building._id + '', {
        _id: building._id + '',
        name: building.name,
        code: building.code,
        type: 'building',
        videoCount: 0,
        storeyTotalVideoCount: 0,
        children: []
      })
      if (building && building.gid) {
        buildInGridArr.push({ gid: building.gid + '', bid: building._id + '' })
      }
    })
    const storeyMap = new Map()
    storeys.map(storey => {
      storeyMap.set(storey._id + '', {
        _id: storey._id + '',
        name: storey.name,
        bid: storey.bid + '',
        type: 'storey',
        videoCount: 0,
        children: []
      })
    })
    const gridsInBuildingMap = new Map()
    gridsInBuildings.map(gridInBuild => {
      gridsInBuildingMap.set(gridInBuild.sid + '', {
        _id: gridInBuild._id + '',
        name: gridInBuild.name,
        type: 'grid',
        sid: gridInBuild.sid + '',
        loc: gridInBuild.loc,
        videoCount: 0
      })
    })
    for (const res of resources) {
      if (storeyMap.has(res.point.sid + '')) {
        const storeyValue = storeyMap.get(res.point.sid + '')
        storeyValue.videoCount += 1
        storeyMap.set(res.point.sid + '', storeyValue)
      }
      if (buildMap.has(res.point.bid + '')) {
        const buildValue = buildMap.get(res.point.bid + '')
        buildValue.videoCount += 1
        buildMap.set(res.point.bid + '', buildValue)
      }
      if (gridMap.size === 0 && gridsInBuildings.size === 0) {
        continue
      }
      for (const [gridKey, gridValue] of gridMap) {
        isExistsPoint(res.point.loc, gridValue)
        gridMap.set(gridKey, gridValue)
      }
      if (gridsInBuildingMap.size === 0) {
        continue
      }
      for (const [sid, gridInBuildValue] of gridsInBuildingMap) {
        isExistsPoint(res.point.loc, gridInBuildValue)
        storeyMap.get(sid).children.push(gridInBuildValue)
        gridsInBuildingMap.delete(sid)
      }
    }
    for (const [sid, storeyValue] of storeyMap) {
      buildMap.get(storeyValue.bid).children.push(storeyValue)
    }
    for (const buildInGridValue of buildInGridArr) {
      gridMap.get(buildInGridValue.gid).children.push(buildMap.get(buildInGridValue.bid))
      buildMap.delete(buildInGridValue.bid)
    }
    const result = {
      _id: root._id || '1',
      name: root.name || '根节点',
      children: [...Array.from(gridMap.values()), ...Array.from(buildMap.values())]
    }
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * 判断点位是否在网格范围内
 * @param {String} resPointLoc 点位信息
 * @param {Object} mapValue Map 对象的 value 值
 */
const isExistsPoint = (resPointLoc, mapValue) => {
  const pointArr = _.split(resPointLoc, ',')
  let pointStr = pointArr.length === 0 ? '' : pointArr[0] + ' ' + pointArr[1]
  const wkt = stringToWkt(mapValue.loc)
  const reader = new jsts.io.WKTReader()
  const geo = reader.read(wkt)
  const point = reader.read(`POINT (${pointStr})`)
  const isExists = geo.contains(point)
  if (isExists) {
    mapValue.videoCount++
  }
}

// // 统计
// exports.statistic = async ctx => {
//   try {
//     ctx.set('loginfo', encodeURI('地图管理-统计'))
//     const loc = _.chunk(ctx.query.loc.split(','), 2)
//     const buildings = await Building.find({
//       loc: {
//         $geoIntersects: {
//           $geometry: {
//             type: 'Polygon',
//             coordinates: [loc]
//           }
//         }
//       }
//     }).exec()
//     const resources = await Resource.find({
//       'point.loc': {
//         $geoWithin: {
//           $geometry: {
//             type: 'Polygon',
//             coordinates: [loc]
//           }
//         }
//       },
//       'point.isouter': true
//     }, 'status point.name').exec()
//     let online = 0
//     let offline = 0
//     resources.forEach(item => {
//       parseInt(item.status) === 1 ? online++ : offline++
//     })
//     ctx.body = {
//       camera: {           // 资源点位树
//         online: online,
//         offline: offline
//       },
//       building: buildings.length     // 楼宇数量
//     }
//   } catch (err) {
//     return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
//   }
// }
// 统计
exports.statistic = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-统计'))
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(ctx.request.body.wkt)
    const resources = await Resource.find({ point: { $nin: [null, undefined] } })
      .lean()
      .exec()
    const buildings = await Building.find({}, 'loc center')
      .lean()
      .exec()
    const grids = await Grid.find({}, 'loc center')
      .lean()
      .exec()
    let online = 0
    let offline = 0
    let buildLength = 0
    let gridLength = 0
    for (var item of resources) {
      if (_.isEmpty(item.point)) {
        continue
      }
      const pointArr = item.point.loc.split(',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point = reader.read(`POINT (${pointStr})`)
      const geometry = geo.contains(point)
      if (geometry) {
        parseInt(item.status) === 1 ? online++ : offline++
      }
    }
    buildings.forEach(item => {
      const pointArr = item.center.split(',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point = reader.read(`POINT (${pointStr})`)
      const geometry = geo.contains(point)
      if (geometry) {
        buildLength++
      }
    })
    grids.forEach(item => {
      const pointArr = item.center.split(',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point = reader.read(`POINT (${pointStr})`)
      const geometry = geo.contains(point)
      if (geometry) {
        gridLength++
      }
    })
    ctx.body = {
      camera: {
        // 资源点位树
        online: online,
        offline: offline
      },
      grid: gridLength,
      building: buildLength // 楼宇数量
    }
  } catch (err) {
    handleSysException(err)
  }
}
exports.getAllResourceNum = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-统计'))
    const mapId = ctx.query.mapId
    const resources = await Resource.find({ 'point.mapId': mapId }).exec()
    const buildLength = await Building.countDocuments({ mapId }).exec()
    const gridLength = await Grid.countDocuments({ mapId }).exec()
    let fireOnline = 0
    let fireOffline = 0
    let ipcOnline = 0
    let ipcOffline = 0
    for (var item of resources) {
      if (_.isEmpty(item.point)) {
        continue
      }
      if (parseInt(item.status) === 1 && (parseInt(item.type) === 0 || parseInt(item.type) === 1)) {
        ipcOnline++
      }
      if (parseInt(item.status) === 0 && (parseInt(item.type) === 0 || parseInt(item.type) === 1)) {
        ipcOffline++
      }
      if (parseInt(item.status) === 1 && parseInt(item.type) === 11) {
        fireOnline++
      }
      if (parseInt(item.status) === 0 && parseInt(item.type) === 11) {
        fireOffline++
      }
    }
    ctx.body = {
      ipc: {
        // 视频点位点位
        ipcOnline,
        ipcOffline
      },
      fireAlarm: {
        fireOnline,
        fireOffline
      },
      building: buildLength, // 楼宇数量
      grid: gridLength // 网格数量
    }
  } catch (err) {
    handleSysException(err)
  }
}
exports.getAllResource = async ctx => {
  try {
    const limit = ctx.query.limit || 5
    const mapId = ctx.query.mapId
    const [gridsNum, buildingsNum, ipcsNum, firesNum, patrolNum] = await Promise.all([
      Grid.countDocuments({ mapId }).exec(),
      Building.countDocuments({ mapId }).exec(),
      Resource.countDocuments({ 'point.mapId': mapId, type: { $in: [0, 1] } }).exec(),
      Resource.countDocuments({ 'point.mapId': mapId, type: { $in: 11 } }).exec(),
      PatrolPoint.countDocuments({ 'point.mapid': mapId }).exec()
    ])
    const gridRan = Math.ceil(Math.random() * gridsNum)
    const gridSkip = gridRan >= limit ? gridRan - limit : 0
    const buildingRan = Math.ceil(Math.random() * buildingsNum)
    const buildingSkip = buildingRan >= limit ? buildingRan - limit : 0
    const ipcRan = Math.ceil(Math.random() * ipcsNum)
    const ipcSkip = ipcRan >= limit ? ipcRan - limit : 0
    const fireRan = Math.ceil(Math.random() * firesNum)
    const fireSkip = fireRan >= limit ? fireRan - limit : 0
    const patrolRan = Math.ceil(Math.random() * patrolNum)
    const patrolSkip = patrolRan >= limit ? patrolRan - limit : 0
    const [grids, buildings, ipcs, fires, patrols] = await Promise.all([
      Grid.find({ mapId })
        .skip(+gridSkip)
        .limit(+limit)
        .exec(), // 网格统计
      Building.find({ mapId })
        .skip(+buildingSkip * +limit)
        .limit(+limit)
        .exec(), // 楼宇统计
      Resource.find(
        { 'point.mapId': mapId, type: { $in: [0, 1] } },
        'chan name monitortype status eid alarmintype alarmtemplate maxdelaytime minintervaltime mapsign alarmaffirm point'
      )
        .skip(+ipcSkip * +limit)
        .limit(+limit)
        .exec(), // 视频通道
      Resource.find(
        { 'point.mapId': mapId, type: { $in: 11 } },
        'chan name monitortype status eid alarmintype eid alarmtemplate maxdelaytime minintervaltime mapsign alarmaffirm point'
      )
        .populate({ path: 'eid', select: 'deviceStatus' })
        .skip(+fireSkip * +limit)
        .limit(+limit)
        .exec(), // 消防输入防区
      PatrolPoint.find({ 'point.mapid': mapId })
        .skip(+patrolSkip * +limit)
        .limit(+limit)
        .exec() // 巡更点位
    ])
    ctx.body = {
      grids,
      buildings,
      ipcs,
      fires,
      patrols
    }
  } catch (err) {
    handleSysException(err)
  }
}

// 统计区域内的资源
exports.statisticResource = async ctx => {
  try {
    const roleId = ctx.state.user.role
    const resIds = await role.getResIdsByRoleId(roleId)
    const VIDEO_TYPE = 0
    const SECURITY_STATUS = 1 // 单兵 是否启用
    const sid = ctx.request.body.sid
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(ctx.request.body.wkt)
    const query = { _id: { $in: resIds }, point: { $nin: [null, undefined] }, type: VIDEO_TYPE }
    const mapProjection = ctx.request.body.mapProjection // 地图投影坐标系
    // 如果是超级管理员，返回空数组，默认拥有所有权限
    if (!(resIds.length > 0)) {
      delete query._id
    }
    const seQuery = { geo: { $nin: [null, undefined] }, status: SECURITY_STATUS, devStaus: 'online' }
    if (sid) {
      query['point.sid'] = sid
    } else {
      query['point.isouter'] = true
    }
    let resources = await Resource.find(query)
      .populate('eid', 'type cport dport deviceStatus')
      .lean()
      .exec()
    resources = resources.filter(item => !['alarmBox', 'alarmPillar'].includes(item.eid.type))
    const securitys = await Security.find(seQuery)
      .lean()
      .exec()
    const reses = []
    for (var item of resources) {
      if (_.isEmpty(item.point)) {
        continue
      }
      const pointArr = _.split(item.point.loc, ',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point = reader.read(`POINT (${pointStr})`)
      const geometry = geo.contains(point)
      if (geometry) {
        reses.push(item)
      }
    }
    const secus = [] // 统计单兵资源
    for (var seItem of securitys) {
      if (_.isEmpty(seItem.geo)) {
        continue
      }
      let pointArr = transformCoord.wgs84togcj02(Number(seItem.geo.lon), Number(seItem.geo.lat)) // 坐标转换（wag84 =》gcj02）
      if (mapProjection !== meta.PROJ.EPSG4326) { // 当前地图投影不是经纬度投影坐标系时
        pointArr = Projection.toMercator(Helpers.point(pointArr)).geometry.coordinates // 坐标转换（gcj02 =》墨卡托）
      }
      if (pointArr && pointArr.length && pointArr[0] && pointArr[1]) {
        let pointStr = pointArr[0] + ' ' + pointArr[1]
        const point = reader.read(`POINT (${pointStr})`)
        const geometry = geo.contains(point)
        if (geometry) {
          secus.push(seItem)
        }
      }
    }
    ctx.body = {
      security: secus,
      resource: reses
    }
  } catch (err) {
    handleSysException(err)
  }
}

// 统计区域内各资源类型的数量
exports.statisticResourceCount = async ctx => {
  try {
    if (!ctx.query.mapId) {
      ctx.throw(500, { code: 4001, message: '缺少地图参数' })
    }
    const roleId = ctx.state.user.role
    const resIds = await role.getResIdsByRoleId(roleId)
    const sid = ctx.request.body.sid
    const mapId = mongoose.Types.ObjectId(ctx.query.mapId)
    const SECURITY_STATUS = 1 // 单兵是否启用
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(ctx.request.body.wkt)
    const query = { _id: { $in: resIds }, point: { $exists: true }, 'point.mapId': mapId }
    const mapProjection = ctx.request.body.mapProjection // 地图投影坐标系
    // 如果是超级管理员，返回空数组，默认拥有所有权限
    if (!(resIds.length > 0)) {
      delete query._id
    }
    const seQuery = { geo: { $exists: true }, status: SECURITY_STATUS }
    const patrolQuery = { geo: { $exists: true }, 'point.mapid': mapId }
    if (sid) {
      query['point.sid'] = sid
    } else {
      query['point.isouter'] = true
    }
    const [builds, grids, securities, resources, patrols] = await Promise.all([
      Building.find({ mapId: mapId }, 'center loc')
        .lean()
        .exec(),
      Grid.find({ mapId: mapId }, 'center loc')
        .lean()
        .exec(),
      Security.find(seQuery, 'geo')
        .lean()
        .exec(),
      Resource.find(query, 'point status type')
        .populate('eid', 'type status')
        .lean()
        .exec(),
      PatrolPoint.find(patrolQuery, 'point')
        .lean()
        .exec()
    ])
    const retObj = {
      buildNum: 0,
      gridNum: 0,
      securityNum: 0,
      videoPoint: {
        onlineNum: 0,
        offlineNum: 0
      },
      alarmCommon: {
        onlineNum: 0,
        offlineNum: 0
      },
      alarmBox: {
        onlineNum: 0,
        offlineNum: 0
      },
      alarmPillar: {
        onlineNum: 0,
        offlineNum: 0
      },
      fireAlarm: {
        onlineNum: 0,
        offlineNum: 0
      },
      patrolPoint: 0,
      doorPoint: {
        onlineNum: 0,
        offlineNum: 0
      }
    }
    builds.forEach(item => {
      const pointArr = _.split(item.center, ',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point = reader.read(`POINT (${pointStr})`)
      const isExists = geo.contains(point)
      if (isExists) {
        retObj.buildNum++
      }
    })
    grids.forEach(item => {
      const pointArr = _.split(item.center, ',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point = reader.read(`POINT (${pointStr})`)
      const isExists = geo.contains(point)
      if (isExists) {
        retObj.gridNum++
      }
    })
    securities.forEach(item => {
      if (item.geo) {
        const itemGeo = item.geo
        let pointArr = itemGeo.lon && itemGeo.lat ? transformCoord.wgs84togcj02(Number(itemGeo.lon), Number(itemGeo.lat)) : []
        if (pointArr && pointArr.length && pointArr[0] && pointArr[1]) {
          if (mapProjection !== meta.PROJ.EPSG4326) { // 当前地图投影不是经纬度投影坐标系时
            pointArr = Projection.toMercator(Helpers.point(pointArr)).geometry.coordinates // 坐标转换（gcj02 =》墨卡托）
          }
          let pointStr = pointArr[0] + ' ' + pointArr[1]
          const point = reader.read(`POINT (${pointStr})`)
          const isExists = geo.contains(point)
          if (isExists) {
            retObj.securityNum++
          }
        }
      }
    })
    patrols.forEach(item => {
      const pointArr = _.split(item.point.geo, ',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point = reader.read(`POINT (${pointStr})`)
      const isExists = geo.contains(point)
      if (isExists) {
        retObj.patrolPoint++
      }
    })
    const alarmHelpTypes = ['alarmPillar', 'alarmBox']
    for (let item of resources) {
      if (_.isEmpty(item.point)) {
        continue
      }
      const pointArr = _.split(item.point.loc, ',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point = reader.read(`POINT (${pointStr})`)
      const isExists = geo.contains(point)
      if (isExists) {
        switch (item.type) {
          case 0:
            if (alarmHelpTypes.includes(item.eid.type)) {
              if (item.eid.type === 'alarmPillar') {
                item.status === 1 ? retObj.alarmPillar.onlineNum++ : retObj.alarmPillar.offlineNum++
              } else if (item.eid.type === 'alarmBox') {
                item.status === 1 ? retObj.alarmBox.onlineNum++ : retObj.alarmBox.offlineNum++
              }
            } else {
              item.status === 1 ? retObj.videoPoint.onlineNum++ : retObj.videoPoint.offlineNum++
            }
            break
          case 1:
            // 报警点位
            item.status === 1 ? retObj.alarmCommon.onlineNum++ : retObj.alarmCommon.offlineNum++
            break
          case 11:
            // 消防点位
            item.status === 1 ? retObj.fireAlarm.onlineNum++ : retObj.fireAlarm.offlineNum++
            break
          case 9:
            // 报警点位
            item.status === 1 ? retObj.alarmCommon.onlineNum++ : retObj.alarmCommon.offlineNum++
            break
          case 4:
            // 门禁点位
            item.status === 1 ? retObj.videoPoint.onlineNum++ : retObj.videoPoint.offlineNum++
            break
          default:
            break
        }
      } else {
        continue
      }
    }
    ctx.body = retObj
  } catch (error) {
    handleSysException(error)
  }
}

exports.getAllResources = async ctx => {
  try {
    const getAllIp = 'shike' // 获取全部报警主机参数
    const getAllPort = 2302 // 获取全部报警主机参数
    const mapId = ctx.query.mapId
    const roleId = ctx.state.user.role
    const resIds = await role.getResIdsByRoleId(roleId)
    let resQuery = { _id: { $in: resIds }, 'point.mapId': mongoose.Types.ObjectId(mapId), type: 0 }
    // 如果是超级管理员，返回空数组，默认拥有所有权限
    if (!(resIds.length > 0)) {
      delete resQuery._id
    }
    const [
      gridsNum,
      buildingsNum,
      videoResult,
      alarResult, // 普通报警
      alaStatusResult,
      patrolNum,
      securityResult,
      firesNum,
      alarDev
    ] = await Promise.all([
      Grid.countDocuments({ mapId }).exec(),
      Building.countDocuments({ mapId }).exec(),
      Resource.aggregate([
        { $match: resQuery },
        { $lookup: { from: 'devices', localField: 'eid', foreignField: '_id', as: 'device' } },
        { $match: { 'device.type': { $nin: ['alarmBox', 'alarmPillar'] } } },
        { $group: { _id: '$status', sum: { $sum: 1 } } },
        { $project: { _id: 0, type: '$_id', sum: '$sum' } }
      ]).exec(),
      Resource.find({ 'point.mapId': mapId, type: 1 })
        .populate({ path: 'eid', select: 'cport ip' })
        .exec(),
      alarmStatus(ctx, {
        devIp: getAllIp,
        devPort: getAllPort
      }).catch(() => []),
      PatrolPoint.countDocuments({ 'point.mapid': mapId }).exec(),
      Security.aggregate([{ $group: { _id: '$devStaus', sum: { $sum: 1 } } }]).exec(),
      Resource.countDocuments({ 'point.mapId': mapId, type: { $in: 11 } }).exec(),
      Device.aggregate([
        { $match: { type: { $in: ['alarmBox', 'alarmPillar'] } } },
        { $lookup: { from: 'resources', localField: '_id', foreignField: 'eid', as: 'resource' } },
        { $match: { 'resource.point.mapId': mongoose.Types.ObjectId(mapId) } },
        { $group: { _id: '$type', sum: { $sum: 1 } } },
        { $project: { _id: 0, type: '$_id', sum: '$sum' } }
      ])
    ])
    let resourceNum = [
      {
        type: 0,
        offline: (() => {
          let offline = videoResult.find(item => item.type === 0)
          return _.get(offline, 'sum', 0)
        })(),
        online: (() => {
          let online = videoResult.find(item => item.type === 1)
          return _.get(online, 'sum', 0)
        })()
      },
      {
        type: 1,
        offline: 0,
        online: 0
      },
      {
        type: 9,
        sum: firesNum
      },
      {
        type: 13,
        sum: (() => {
          let sum = alarDev.find(item => item.type === 'alarmPillar')
          return _.get(sum, 'sum', 0)
        })()
      },
      {
        type: 14,
        sum: (() => {
          let sum = alarDev.find(item => item.type === 'alarmBox')
          return _.get(sum, 'sum', 0)
        })()
      }
    ]
    alarResult.map(alar => {
      let resultOne = null
      if (alaStatusResult instanceof Array) {
        resultOne = alaStatusResult.find(result => result.devIp === alar.eid.ip)
      }
      if (!_.isEmpty(resultOne)) {
        alar.armStatus = _.get(resultOne.channelStatus.find(item => item.channel === alar.chan), 'armStatus', 'disarm')
      } else {
        alar.armStatus = 'disarm'
      }
      alar.armStatus === 'disarm' ? (resourceNum[1].offline += 1) : (resourceNum[1].online += 1)
    })

    const securityNum = {
      offline: (() => {
        let off = _.get(securityResult.find(item => item._id === 'offline'), 'sum', 0)
        let nul = _.get(securityResult.find(item => item._id === null), 'sum', 0)
        return off + nul
      })(),
      online: _.get(securityResult.find(item => item._id === 'online'), 'sum', 0)
    }
    ctx.body = {
      resourceNum, // 视频点位 type 0 在线|离线
      // 普通报警点位 布|撤防 type 1
      // 消防报警点位 布|撤防 type 9
      // 报警柱点位  无组织机构 alarmClient  actionVideo[0].resource 关联的Resource的Type = 13 报警柱,
      // 报警箱点位  无组织机构 alarmClient  actionVideo[0].resource 关联的Resource的Type = 14 报警箱
      patrolNum, // 巡更点位
      securityNum, // 在线单兵
      buildingsNum, // 楼宇
      gridsNum // 网格统计
    }
  } catch (err) {
    handleSysException(err)
  }
}
const getDb = require('../../../common/logdb')
const AlarmLogSchema = new mongoose.Schema({
  eventType: String,
  time: Number
})

exports.getAllAlarm = async ctx => {
  try {
    const db = await getDb()
    const AlarmLog = db.model('AlarmLog', AlarmLogSchema, 'AlarmLog')
    const eventType = {
      ordinary: {
        type: ['alarmInput', 'alarmZone'],
        sum: 0
      },
      video: {
        type: [
          'alarmMoveSense',
          'videoMask',
          'sceneSwitch',
          'definitionAbnormal',
          'brightnessAbnormal',
          'noise',
          'colorCast',
          'signalLoss',
          'screenFreeze',
          'focusAttention'
        ],
        sum: 0
      },
      Intelligence: {
        type: [
          'perimeter',
          'tripwire',
          'missingObject',
          'leftObject',
          'loitering',
          'retrogradeDetection',
          'lingerDetection',
          'doubleCordon',
          'blackList',
          'whiteList',
          'dispatch',
          'areaInvade',
          'fastMove',
          'parkDetect',
          'humanAssemble',
          'objectMove',
          'vioRetrograde',
          'vioPark',
          'vioTurnLeft',
          'vioTurnRight',
          'faceDispatch'
        ],
        sum: 0
      },
      alarmHelp: {
        type: ['alarmHelp'],
        sum: 0
      },
      fireAlarm: {
        type: ['fireAlarm'],
        sum: 0
      },
      manualAlarm: {
        type: ['manualAlarm'],
        sum: 0
      },
      soldierAlarm: {
        type: ['soldierAlarm', 'taskAlarm'],
        sum: 0
      }
    }
    const arrar = []
    _.forOwn(eventType, (value, key) => {
      value.type && arrar.push(value.type)
    })

    const roleId = ctx.state.user.role
    const resourceIds = await role.getResIdsByRoleId(roleId)
    let query = { _id: { $in: resourceIds }, 'point.mapId': ctx.query.mapId }
    // 如果是超级管理员，返回空数组，默认拥有所有权限
    if (!(resourceIds.length > 0)) {
      delete query._id
    }
    const resIds = await Resource.find(query).exec()
    const [logResult, soldierAlarmCount] = await Promise.all([
      AlarmLog.aggregate([
        {
          $match: {
            eventType: { $in: _.flattenDeep(arrar) },
            chanId: { $in: resIds.map(item => item._id) },
            time: {
              $gte: parseInt(
                moment()
                  .startOf('day')
                  .format('X')
              )
            }
          }
        },
        { $group: { _id: '$eventType', sum: { $sum: 1 } } },
        { $project: { _id: 0, eventType: '$_id', sum: '$sum' } }
      ]).exec(),
      PatrolAlarming.countDocuments({
        time: {
          $gte: moment()
            .startOf('day')
            .format('YYYY-MM-DD HH:mm:ss')
        }
      })
    ])

    _.forOwn(eventType, alarObj => {
      alarObj.type.map(item => {
        let findOne = logResult.find(res => {
          if (res.eventType === item) {
            return res
          }
        })
        alarObj.sum += _.get(findOne, 'sum', 0)
      })
    })
    eventType.soldierAlarm.sum += soldierAlarmCount || 0
    ctx.body = eventType
  } catch (err) {
    handleSysException(err)
  }
}
