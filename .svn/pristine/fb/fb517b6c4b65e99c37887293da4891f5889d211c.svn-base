/*
 * 网格相关接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:16:27
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-10-30 17:40:25
 */

'use strict'
const GridModel = require('mongoose').model('Grid')
const BuildingModel = require('mongoose').model('Building')
const ResourceModel = require('mongoose').model('Resource')
const SecurityModel = require('mongoose').model('Security')
const PatrolPointModel = require('mongoose').model('PatrolPoint')
const PrincipalModel = require('mongoose').model('Principal')
const AddressBookModel = require('mongoose').model('AddressBook')
const PatrolAlarming = require('mongoose').model('PatrolAlarming')
const jsts = require('jsts')
const _ = require('lodash')
const tools = require('../../../common/tools')
const { AddressBookEnum } = require('../../../common/enum')

// 获取所有网格信息
exports.getAll = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取网格'))
    console.log(ctx.query.page)
    // const grids = await paging.listQuery(GridModel, ctx.query.search, '', '', { page: ctx.query.page, limit: ctx.query.limit }, '', ctx)
    let grids
    let count
    if (ctx.query.gridpage && ctx.query.gridlimit) {
      ;[count, grids] = await Promise.all([
        GridModel.countDocuments(),
        ctx.query.gridname
          ? GridModel.find({
            name: {
              $regex: ctx.query.gridname + '' || ''
            }
          })
            .populate('pids', 'name mobile')
            .skip((+ctx.query.gridpage - 1) * +ctx.query.gridlimit)
            .limit(+ctx.query.gridlimit)
            .exec()
          : GridModel.find()
            .skip((+ctx.query.gridpage - 1) * +ctx.query.gridlimit)
            .limit(+ctx.query.gridlimit)
            .exec()
      ])
    } else {
      ;[count, grids] = await Promise.all([
        GridModel.countDocuments(),
        GridModel.find()
          .populate('pids', 'name mobile')
          .lean()
          .exec()
      ])
    }
    // ctx.body = _.isEmpty(grids.results) ? [] : grids.results
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': ctx.query.gridlimit ? Math.ceil(count / ctx.query.gridlimit) : 0,
      'X-BSC-CUR': ctx.query.gridpage ? parseInt(ctx.query.gridpage) : 0,
      'X-BSC-LIMIT': ctx.query.gridlimit ? parseInt(ctx.query.gridlimit) : 0
    })
    ctx.body = grids
  } catch (err) {
    tools.handleSysException(err, 4001)
  }
}

// 添加网格
exports.add = async ctx => {
  ctx.set('loginfo', encodeURI('地图管理-添加网格'))
  delete ctx.request.body._id
  try {
    const mapId = ctx.request.body.mapId
    const wkt = tools.stringToWkt(ctx.request.body.loc)
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(wkt)
    const bound = geo.getBoundary()
    const point = bound.getCentroid()
    const center = point.getX() + ',' + point.getY()
    const envelope = bound.getEnvelopeInternal()
    const scope = envelope.getMinX() + ',' + envelope.getMinY() + ',' + envelope.getMaxX() + ',' + envelope.getMaxY()
    ctx.request.body.center = center
    ctx.request.body.scope = scope
    const pids = ctx.request.body.pids
    const addressBook = await AddressBookModel.create({
      type: AddressBookEnum.GRID,
      name: ctx.request.body.name,
      mapId: mapId
    })
    ctx.request.body.addressBookId = addressBook._id + ''
    delete ctx.request.body.pids
    const grid = new GridModel(ctx.request.body)
    const newGrid = await grid.save()
    // 将联系人统一保存到 Principal 表
    let pidArr = []
    for (let item of pids) {
      if (item.name === '' && item.mobile === '') {
        continue
      }
      const principal = await PrincipalModel.create({
        type: AddressBookEnum.GRID,
        name: item.name,
        mobile: item.mobile,
        mapId: mapId,
        gridId: newGrid._id,
        addressBookId: addressBook._id
      })
      pidArr.push(principal._id)
    }
    if (pidArr.length) {
      await GridModel.findByIdAndUpdate(newGrid._id, { pids: pidArr })
    }
    ctx.body = [newGrid._id]
    ctx.status = 201
  } catch (err) {
    tools.handleSysException(err, 4001)
  }
}

// 获取指定网格信息
exports.getOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取单个网格'))
    const result = await GridModel.findById(ctx.params.id)
      .populate('pids', 'name mobile collect gridId type _id')
      .exec()
    ctx.body = _.isEmpty(result) ? {} : result
  } catch (err) {
    tools.handleSysException(err, 4001)
  }
}

// 修改指定网格
exports.updateOne = async ctx => {
  ctx.set('loginfo', encodeURI('地图管理-修改单个网格'))
  delete ctx.request.body._id
  const { pids, mapId, addressBookId, name } = ctx.request.body
  try {
    const wkt = tools.stringToWkt(ctx.request.body.loc)
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(wkt)
    const bound = geo.getBoundary()
    const point = bound.getCentroid()
    const center = point.getX() + ',' + point.getY()
    const envelope = bound.getEnvelopeInternal()
    const scope = envelope.getMinX() + ',' + envelope.getMinY() + ',' + envelope.getMaxX() + ',' + envelope.getMaxY()
    ctx.request.body.center = center
    ctx.request.body.scope = scope
    let pidArr = []
    const principalIds = await PrincipalModel.find({ gridId: ctx.params.id }, '_id').lean().exec()
    const deletePrincipalIds = _.difference(principalIds.map(item => item._id + ''), pids.map(item => item._id + ''))
    if (deletePrincipalIds.length) {
      await PrincipalModel.deleteMany({ _id: { $in: deletePrincipalIds } })
    }
    for (let item of pids) {
      // 联系人 _id 存在，并且 name、mobile 字段为空，认为是删除联系人
      if (item._id && !item.name && !item.mobile) {
        await PrincipalModel.findByIdAndRemove(item._id)
          .lean()
          .exec()
      }
      // 联系人 _id 存在，并且 name、mobile 其中一个不为空，认为是修改联系人
      if (item._id && (item.name || item.mobile)) {
        const { _id: principalId = '' } = await PrincipalModel.findByIdAndUpdate(item._id, {
          name: item.name,
          mobile: item.mobile
        })
          .lean()
          .exec()
        pidArr.push(principalId)
      }
      // 联系人 _id 不存在，并且 name、mobile 其中一个不为空，认为是创建联系人
      if (!item._id && (item.name || item.mobile)) {
        const {_id: principalId} = await PrincipalModel.create({
          gridId: ctx.params.id,
          name: item.name,
          mobile: item.mobile,
          mapId: mapId,
          type: AddressBookEnum.GRID,
          addressBookId: ctx.request.body.addressBookId
        })
        pidArr.push(principalId)
      }
    }
    ctx.request.body.pids = pidArr
    await AddressBookModel.findByIdAndUpdate(addressBookId, { name: name })
    await GridModel.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
    ctx.status = 200
  } catch (err) {
    tools.handleSysException(err, 4001)
  }
}

// 删除指定网格
exports.deleteOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-删除单个网格'))
    const grid = await GridModel.findByIdAndRemove(ctx.params.id).exec() // 删除网格
    const buildings = await BuildingModel.find({ gid: ctx.params.id }).exec()
    const docs = buildings.map(item => {
      delete item._doc.gid
      return item._doc
    })
    await BuildingModel.deleteMany({ gid: ctx.params.id })
    // 同时删除该网格下的联系人
    await PrincipalModel.deleteMany({ addressBookId: grid.addressBookId }).exec()
    await AddressBookModel.findByIdAndRemove(grid.addressBookId).exec()
    await BuildingModel.insertMany(docs)
    ctx.status = 200
  } catch (err) {
    tools.handleSysException(err, 4001)
  }
}

// 获取指定网格的所有统计信息（摄像机点位数量、楼宇数量）
// exports.statistic = async ctx => {
//   try {
//     ctx.set('loginfo', encodeURI('地图管理-统计网格信息'))
//     const gid = ctx.params.id // 网格id
//     const buildings = await BuildingModel.find({
//       gid: gid
//     }).exec()
//     const grid = await GridModel.findById(gid).exec()
//     const resources = await ResourceModel.find({
//       'point.loc': {
//         $geoWithin: {
//           $geometry: {
//             type: 'Polygon',
//             coordinates: [grid.loc]
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
//       camera: {
//         online: online,
//         offline: offline
//       },
//       building: buildings.length // 楼宇数量
//     }
//   } catch (err) {
//     return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
//   }
// }
// 获取指定网格的所有统计信息（摄像机点位数量、楼宇数量）
exports.statistic = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-统计网格信息'))
    const grid = await GridModel.findById(ctx.params.id, 'loc')
    const wkt = tools.stringToWkt(grid.loc)
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(wkt)
    const SECURITY_STATUS = 1 // 单兵是否启用
    const query = { point: { $exists: true } }
    const seQuery = { geo: { $exists: true }, status: SECURITY_STATUS }
    const patrolQuery = { geo: { $exists: true } }
    const [builds, securities, resources, patrols] = await Promise.all([
      BuildingModel.find({}, 'center loc')
        .lean()
        .exec(),
      SecurityModel.find(seQuery, 'geo')
        .lean()
        .exec(),
      ResourceModel.find(query, 'point status type')
        .populate('eid', 'type status')
        .lean()
        .exec(),
      PatrolPointModel.find(patrolQuery, 'point')
        .lean()
        .exec()
    ])
    const retObj = {
      buildNum: 0,
      gridNum: 1,
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
    securities.forEach(item => {
      const itemGeo = _.get(item, 'geo', {})
      const pointArr = _.get(itemGeo, 'lon', '') && _.get(itemGeo, 'lat', '') ? [itemGeo.lon, itemGeo.lat] : []
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point = reader.read(`POINT (${pointStr})`)
      const isExists = geo.contains(point)
      if (isExists) {
        retObj.securityNum++
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
  } catch (err) {
    tools.handleSysException(err, 4001)
  }
}

const getDb = require('../../../common/logdb')
const AlarmLogSchema = new mongoose.Schema({
  eventType: String,
  time: Number
})
// 统计网格内的警情数量
exports.statisticAlarm = async ctx => {
  try {
    const db = await getDb()
    const AlarmLog = db.model('AlarmLog', AlarmLogSchema, 'AlarmLog')
    const id = ctx.params.id
    const grid = await GridModel.findById(id, 'loc')
    const wkt = tools.stringToWkt(grid.loc)
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(wkt)
    const query = { point: { $exists: true } }
    const resources = await ResourceModel.find(query)
      .lean()
      .exec()
    let resIds = []
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
        resIds.push(item)
      }
    }
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

    const [logResult, soldierAlarm] = await Promise.all([
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
      PatrolAlarming.aggregate([
        {
          $match: {
            time: {
              $gte: moment()
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:SS')
            }
          }
        },
        {
          $group: {
            _id: '$uid',
            sum: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'patrolrecords',
            let: { patrolalarmings_uid: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $gte: [
                          '$date',
                          parseInt(
                            moment()
                              .startOf('day')
                              .format('X')
                          )
                        ]
                      },
                      { $eq: ['$userId', '$$patrolalarmings_uid'] }
                    ]
                  }
                }
              }
            ],
            as: 'patrolrecord'
          }
        },
        { $project: { _id: 1, sum: 1, patrolrecord: { $slice: ['$patrolrecord', -1, 1] } } },
        { $unwind: '$patrolrecord' },
        { $project: { _id: 1, sum: 1, point: { $slice: ['$patrolrecord.points', -1, 1] } } },
        { $unwind: '$point' },
        { $project: { _id: 1, sum: 1, pointId: '$point.pointId' } },
        {
          $lookup: {
            from: 'patrolpoints',
            localField: 'pointId',
            foreignField: '_id',
            as: 'patrol_point'
          }
        },
        { $match: { 'patrol_point.point.mapid': mongoose.Types.ObjectId(ctx.query.mapId) } },
        { $group: { _id: null, sum: { $sum: '$sum' } } }
      ])
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
    eventType.soldierAlarm.sum += _.get(soldierAlarm, '[0].sum', 0)
    ctx.body = eventType
  } catch (error) {
    tools.handleSysException(error)
  }
}

exports.checkRepeat = async (ctx, next) => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-效验重复'))
    const id = ctx.query._id === undefined ? '' : ctx.query._id
    const name = ctx.query.name === undefined ? '' : ctx.query.name
    const code = ctx.query.code === undefined ? '' : ctx.query.code
    let result
    if (name) {
      result = await GridModel.find({ name: name })
    }
    if (code) {
      result = await GridModel.find({ code: code })
    }
    let flag = false
    if (_.isEmpty(id)) {
      if (!_.isEmpty(result)) {
        ctx.throw(500, name ? { code: 4005, message: '该名称已存在' } : { code: 4006, message: '该编号已存在' })
      }
    } else {
      result.forEach(item => {
        if (name) {
          if (item._id + '' !== id + '' && item.name + '' === name + '') {
            flag = true
          }
        } else {
          if (item._id + '' !== id + '' && item.code + '' === code + '') {
            flag = true
          }
        }
      })
    }
    if (flag) {
      ctx.throw(500, name ? { code: 4005, message: '该名称已存在' } : { code: 4006, message: '该编号已存在' })
    }
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    tools.handleSysException(err, 4001)
  }
}
exports.getGridByMapId = async ctx => {
  try {
    let grids
    let count
    if (ctx.query.gridpage && ctx.query.gridlimit) {
      ;[count, grids] = await Promise.all([
        GridModel.countDocuments({
          mapId: ctx.query.mapId,
          name: {
            $regex: ctx.query.seek + '' || ''
          }
        }),
        GridModel.find({
          mapId: ctx.query.mapId,
          sid: { $exists: false },
          name: {
            $regex: ctx.query.seek + '' || ''
          }
        })
          .skip((+ctx.query.gridpage - 1) * +ctx.query.gridlimit)
          .limit(+ctx.query.gridlimit)
          .exec()
      ])
    } else {
      ;[count, grids] = await Promise.all([
        GridModel.countDocuments({
          mapId: ctx.query.mapId,
          name: {
            $regex: ctx.query.seek ? ctx.query.seek + '' : ''
          }
        }),
        GridModel.find({
          mapId: ctx.query.mapId,
          sid: { $exists: false },
          name: {
            $regex: ctx.query.seek ? ctx.query.seek + '' : ''
          }
        })
      ])
    }
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': ctx.query.gridlimit ? (count ? Math.ceil(count / ctx.query.gridlimit) : 0) : 0,
      'X-BSC-CUR': ctx.query.gridpage ? parseInt(ctx.query.gridpage) : 0,
      'X-BSC-LIMIT': ctx.query.gridlimit ? parseInt(ctx.query.gridlimit) : 0
    })
    ctx.body = grids
  } catch (err) {
    tools.handleSysException(err, 4001)
  }
}
exports.getGridBySid = async ctx => {
  try {
    let grids
    let count
    if (ctx.query.gridpage && ctx.query.gridlimit) {
      ;[count, grids] = await Promise.all([
        GridModel.countDocuments({
          sid: ctx.query.sid,
          name: {
            $regex: ctx.query.seek + '' || ''
          }
        }),
        GridModel.find({
          sid: ctx.query.sid,
          name: {
            $regex: ctx.query.seek + '' || ''
          }
        })
          .populate('pids', 'name mobile')
          .skip((+ctx.query.gridpage - 1) * +ctx.query.gridlimit)
          .limit(+ctx.query.gridlimit)
          .exec()
      ])
    } else {
      ;[count, grids] = await Promise.all([
        GridModel.countDocuments({
          sid: ctx.query.sid,
          name: {
            $regex: ctx.query.seek ? ctx.query.seek + '' : ''
          }
        }),
        GridModel.find({
          sid: ctx.query.sid,
          name: {
            $regex: ctx.query.seek ? ctx.query.seek + '' : ''
          }
        })
          .populate('pids', 'name mobile')
          .lean()
          .exec()
      ])
    }
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': ctx.query.gridlimit ? (count ? Math.ceil(count / ctx.query.gridlimit) : 0) : 0,
      'X-BSC-CUR': ctx.query.gridpage ? parseInt(ctx.query.gridpage) : 0,
      'X-BSC-LIMIT': ctx.query.gridlimit ? parseInt(ctx.query.gridlimit) : 0
    })
    ctx.body = grids
  } catch (err) {
    tools.handleSysException(err, 4001)
  }
}
