/*
 * 区域统计接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:46:26
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-04-18 11:36:25
 */

'use strict'
const mongoose = require('mongoose')
const Org = mongoose.model('Org')
const Resource = mongoose.model('Resource')
const Security = mongoose.model('Security')
const Building = mongoose.model('Building3D')
const Storey = mongoose.model('Storey3D')
const Grid = require('mongoose').model('Grid')
const { handleSysException } = require('../../../common/tools')
const PatrolPoint = require('mongoose').model('PatrolPoint')
const jsts = require('jsts')
const _ = require('lodash')

// 获取地图应用模式下的左侧区域树
exports.getTree = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取地图应用模式下的左侧区域树'))
    // 获取所有楼宇
    let buildings = await Building.find({ gid: { $exists: false }, mapId: ctx.query.mapId }, '_id code name')
      .lean()
      .exec()
    buildings = buildings.map(item => {
      item.type = 'building'
      return item
    })
    const bids = buildings.map(build => build._id)
    // 获取楼层
    let stroeys = await Storey.find({ bid: { $in: bids } })
      .lean()
      .exec()
    stroeys = stroeys.map(storey => {
      storey.type = 'storey'
      return storey
    })
    const sids = stroeys.map(storey => storey._id)
    let grids = await Grid.find({ sid: { $in: sids } }, 'name sid')
      .lean()
      .exec()
    const stroeyMapping = {}
    const gridMapping = {}
    grids.forEach(grid => {
      grid.type = 'grid'
      !gridMapping[grid.sid + ''] && (gridMapping[grid.sid + ''] = [])
      gridMapping[grid.sid + ''] = [...gridMapping[grid.sid + ''], grid]
    })
    stroeys.forEach(storey => {
      storey.type = 'storey'
      storey.children = gridMapping[storey._id + '']
      !stroeyMapping[storey.bid + ''] && (stroeyMapping[storey.bid + ''] = [])
      stroeyMapping[storey.bid + ''] = [...stroeyMapping[storey.bid + ''], storey]
    })
    buildings = buildings.map(building => {
      building.children = stroeyMapping[building._id + '']
      return building
    })
    const root = await Org.findOne({ isroot: true, type: 0 }).exec()
    const result = {
      _id: root._id || '1',
      name: root.name || '根节点',
      children: buildings
    }
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}

// 统计
exports.statistic = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-统计'))
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(ctx.request.body.wkt)
    const resources = await Resource.find({ point3D: { $nin: [null, undefined] } })
      .lean()
      .exec()
    const buildings = await Building.find({}, 'loc center')
      .lean()
      .exec()
    let online = 0
    let offline = 0
    let buildLength = 0
    for (var item of resources) {
      if (_.isEmpty(item.point3D)) {
        continue
      }
      const pointArr = item.point3D.loc.split(',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point3D = reader.read(`POINT (${pointStr})`)
      const geometry = geo.contains(point3D)
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
      const point3D = reader.read(`POINT (${pointStr})`)
      const geometry = geo.contains(point3D)
      if (geometry) {
        buildLength++
      }
    })
    ctx.body = {
      camera: {
        // 资源点位树
        online: online,
        offline: offline
      },
      building: buildLength // 楼宇数量
    }
  } catch (err) {
    handleSysException(err)
  }
}
// 统计区域内的资源
exports.statisticResource = async ctx => {
  try {
    const VIDEO_TYPE = 0
    const SECURITY_STATUS = 1 // 单兵 是否启用
    const sid = ctx.request.body.sid
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(ctx.request.body.wkt)
    const query = { point3D: { $nin: [null, undefined] }, type: VIDEO_TYPE }
    const seQuery = { geo: { $nin: [null, undefined] }, status: SECURITY_STATUS }
    if (sid) {
      query['point3D.sid'] = sid
    } else {
      query['point3D.isouter'] = true
    }
    let resources = await Resource.find(query)
      .populate({ path: 'eid', select: 'cport dport type deviceStatus' })
      .lean()
      .exec()
    resources = resources.filter(item => !['alarmBox', 'alarmPillar'].includes(item.eid.type))
    const reses = []
    for (var item of resources) {
      if (_.isEmpty(item.point3D)) {
        continue
      }
      const pointArr = item.point3D.loc.split(',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point3D = reader.read(`POINT (${pointStr})`)
      const geometry = geo.contains(point3D)
      if (geometry) {
        reses.push(item)
      }
    }
    const securitys = await Security.find(seQuery)
      .lean()
      .exec()
    const secus = []
    for (var seItem of securitys) {
      if (_.isEmpty(seItem.geo)) {
        continue
      }
      const pointArr = [seItem.geo.lon, seItem.geo.lat]
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point3D = reader.read(`POINT (${pointStr})`)
      const geometry = geo.contains(point3D)
      if (geometry) {
        secus.push(seItem)
      }
    }
    reses.map(item => {
      if (_.isEmpty(item.port)) {
        item.port = _.get(item, 'eid.cport')
      }
    })
    ctx.body = {
      security: secus,
      resource: reses
    }
  } catch (err) {
    handleSysException(err)
  }
}
exports.getAllResourceNum = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-统计'))
    const resources = await Resource.find({ point3D: { $nin: [null, undefined] } }).exec()
    const buildLength = await Building.countDocuments({}).exec()
    let fireOnline = 0
    let fireOffline = 0
    let ipcOnline = 0
    let ipcOffline = 0
    for (var item of resources) {
      if (_.isEmpty(item.point3D)) {
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
      building: buildLength // 楼宇数量
    }
  } catch (err) {
    handleSysException(err)
  }
}
exports.getAllResource = async ctx => {
  try {
    const limit = ctx.query.limit || 5
    const [buildingsNum, ipcsNum, firesNum, patrolNum] = await Promise.all([
      Building.countDocuments({}).exec(),
      Resource.countDocuments({ point3D: { $nin: [null, undefined] }, type: { $in: [0, 1] } }).exec(),
      Resource.countDocuments({ point3D: { $nin: [null, undefined] }, type: { $in: 11 } }).exec(),
      PatrolPoint.countDocuments({ point3D: { $nin: [null, undefined] } }).exec()
    ])
    const buildingRan = Math.ceil(Math.random() * buildingsNum)
    const buildingSkip = buildingRan >= limit ? buildingRan - limit : 0
    const ipcRan = Math.ceil(Math.random() * ipcsNum)
    const ipcSkip = ipcRan >= limit ? ipcRan - limit : 0
    const fireRan = Math.ceil(Math.random() * firesNum)
    const fireSkip = fireRan >= limit ? fireRan - limit : 0
    const patrolRan = Math.ceil(Math.random() * patrolNum)
    const patrolSkip = patrolRan >= limit ? patrolRan - limit : 0
    const [buildings, ipcs, fires, patrols] = await Promise.all([
      Building.find({})
        .skip(+buildingSkip * +limit)
        .limit(+limit)
        .exec(),
      Resource.find(
        { point3D: { $nin: [null, undefined] }, type: { $in: [0, 1] } },
        'chan name monitortype status eid alarmintype alarmtemplate maxdelaytime minintervaltime mapsign alarmaffirm point3D'
      )
        .skip(+ipcSkip * +limit)
        .limit(+limit)
        .exec(),
      Resource.find(
        { point3D: { $nin: [null, undefined] }, type: { $in: 11 } },
        'chan name monitortype status eid alarmintype alarmtemplate maxdelaytime minintervaltime mapsign alarmaffirm point3D'
      )
        .skip(+fireSkip * +limit)
        .limit(+limit)
        .exec(),
      PatrolPoint.find({ point3D: { $nin: [null, undefined] } })
        .skip(+patrolSkip * +limit)
        .limit(+limit)
        .exec()
    ])
    ctx.body = {
      buildings,
      ipcs,
      fires,
      patrols
    }
  } catch (err) {
    handleSysException(err)
  }
}
