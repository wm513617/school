/*
 * 楼宇接口
 * @Author: chenkaibo
 * @Date: 2018-06-05 15:23:31
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-09 16:00:13
 */

'use strict'
const BuildingModel = require('mongoose').model('Building')
const StoreyModel = require('mongoose').model('Storey')
const ResourceModel = require('mongoose').model('Resource')
const PrincipalModel = require('mongoose').model('Principal')
const AddressBookModel = require('mongoose').model('AddressBook')
const tools = require('../../../common/tools')
const jsts = require('jsts')
const postal = require('postal')
const config = require('../../../../config')
const fs = require('fs')
// const paging = require('../../paging')
const _ = require('lodash')
const { AddressBookEnum } = require('../../../common/enum')

// 删除指定楼宇（同时删除该楼宇下所有楼层）
exports.deleteOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-删除楼宇'))
    // 删除该楼宇内楼层下的所有点位
    const storeyIds = await StoreyModel.find(
      {
        bid: ctx.params.id
      },
      '_id'
    ).exec()
    await ResourceModel.updateMany(
      {
        point: {
          $nin: [null, undefined]
        },
        'point.sid': {
          $in: storeyIds
        }
      },
      { $unset: { point: 1 } },
      { multi: true }
    ).exec()
    // 保存网格
    const building = await BuildingModel.findByIdAndRemove(ctx.params.id).exec() // 删除楼宇
    if (_.get(building, 'picture.name', '')) {
      const filePath = `${config.backend.fileDirs.buildingPicDir}/${_.get(building, 'picture.name')}`
      fs.unlink(filePath, err => {
        console.log(err)
      })
    }
    await AddressBookModel.findByIdAndRemove(building.addressBookId).lean().exec()
    await PrincipalModel.deleteMany({ addressBookId: building.addressBookId }).exec()
    await StoreyModel.deleteMany({ bid: ctx.params.id }).exec() // 删除所有楼层
    // TODO 删除该楼层下的联系人
    postal.publish({
      topic: 'array.delete',
      channel: 'sentry:position',
      data: {
        id: ctx.params.id
      }
    })
    ctx.status = 200
  } catch (err) {
    console.log(err.message)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
  }
}

// 新建楼宇
exports.add = async ctx => {
  ctx.set('loginfo', encodeURI('地图管理-新建楼宇'))
  try {
    const mapId = ctx.request.body.mapId
    if (!mapId) {
      ctx.throw(500, { code: 4001, message: '缺少地图参数' })
    }
    // 将坐标转化为wkt格式
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
    const pid = ctx.request.body.pid
    const addressBook = await AddressBookModel.create({
      type: AddressBookEnum.BUILDING,
      name: ctx.request.body.name,
      mapId: mapId
    })
    delete ctx.request.body.pid
    const newBuilding = await BuildingModel.create(Object.assign(ctx.request.body, { addressBookId: addressBook._id }))
    // 联系人统一保存到 Principal 表
    let pidArr = []
    for (let item of pid) {
      if (item.name === '' && item.mobile === '') {
        continue
      }
      const principal = await PrincipalModel.create({
        type: AddressBookEnum.BUILDING,
        name: item.name,
        mobile: item.mobile,
        mapId: mapId,
        buildId: newBuilding._id,
        addressBookId: addressBook._id
      })
      pidArr.push(principal._id)
    }
    if (pidArr.length) {
      await BuildingModel.findByIdAndUpdate(newBuilding._id, { pid: pidArr })
    }
    ctx.body = [newBuilding._id]
    ctx.status = 201
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
  }
}

// 修改楼宇
exports.updateOne = async ctx => {
  ctx.set('loginfo', encodeURI('地图管理-修改楼宇'))
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
    const { pid, addressBookId, name } = ctx.request.body
    let pidArr = []
    const principalIds = await PrincipalModel.find({ buildId: ctx.params.id }, '_id').lean().exec()
    const deletePrincipalIds = _.difference(principalIds.map(item => item._id + ''), pid.map(item => item._id + ''))
    if (deletePrincipalIds.length) {
      await PrincipalModel.deleteMany({ _id: { $in: deletePrincipalIds } })
    }
    for (let item of pid) {
      // 联系人 _id 存在，并且 name、mobile 字段为空，认为是删除联系人
      if (item._id && !item.name && !item.mobile) {
        await PrincipalModel.findByIdAndRemove(item._id)
          .lean()
          .exec()
      }
      // 联系人 _id 存在，并且 name、mobile 其中一个不为空，认为是修改联系人
      if (item._id && (item.name || item.mobile)) {
        const { _id: principalId = '' } = await PrincipalModel.findByIdAndUpdate(item._id, { name: item.name, mobile: item.mobile })
          .lean()
          .exec()
        pidArr.push(principalId)
      }
      // 联系人 _id 不存在，并且 name、mobile 其中一个不为空，认为是创建联系人
      if (!item._id && (item.name || item.mobile)) {
        const { _id: principalId = '' } = await PrincipalModel.create({
          buildId: ctx.params.id,
          name: item.name,
          mobile: item.mobile,
          mapId: ctx.request.body.mapId,
          type: AddressBookEnum.BUILDING,
          addressBookId: addressBookId
        })
        pidArr.push(principalId)
      }
    }
    ctx.request.body.pid = pidArr
    await AddressBookModel.findByIdAndUpdate(addressBookId, { name: name })
    const updateData = ctx.request.body
    if (!updateData.gid) {
      Object.assign(updateData, { $unset: { gid: 1 } })
    }
    await BuildingModel.findByIdAndUpdate(ctx.params.id, updateData)
      .lean()
      .exec()
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
  }
}

// 获取楼宇信息
exports.getOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取楼宇信息'))
    const result = await BuildingModel.findById(ctx.params.id)
      .populate([
        {
          path: 'gid',
          select: 'name loc'
        },
        {
          path: 'pid',
          select: 'name mobile collect buildId type _id'
        }
      ])
      .lean()
      .exec()
    const storeys = await StoreyModel.find({ bid: ctx.params.id }).exec()
    result.sids = storeys
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 4001, message: '没有请求的资源' })
    }
    ctx.body = result
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
  }
}

// 获取指定楼宇下的所有楼层
exports.getStorey = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取所有楼层'))
    // const resultObj = await paging.listQuery(StoreyModel, _.merge({}, ctx.query.search, {
    //   bid: ctx.params.id
    // }), '_id name', '', ctx.query.page, '', ctx)
    // ctx.body = _.isEmpty(resultObj.results) ? [] : resultObj.results
    let floors
    let count
    if (ctx.query.floorpage && ctx.query.floorlimit) {
      ;[count, floors] = await Promise.all([
        StoreyModel.countDocuments({
          bid: ctx.params.id
        }),
        StoreyModel.find({
          bid: ctx.params.id
        })
          .skip((+ctx.query.floorpage - 1) * +ctx.query.floorlimit)
          .limit(+ctx.query.floorlimit)
          .exec()
      ])
    } else {
      ;[count, floors] = await Promise.all([
        StoreyModel.countDocuments({
          bid: ctx.params.id
        }),
        StoreyModel.find({
          bid: ctx.params.id
        })
      ])
    }
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': ctx.query.floorlimit ? Math.ceil(count / ctx.query.floorlimit) : 0,
      'X-BSC-CUR': ctx.query.floorpage ? parseInt(ctx.query.floorpage) : 0,
      'X-BSC-LIMIT': ctx.query.floorlimit ? parseInt(ctx.query.floorlimit) : 0
    })
    ctx.body = floors
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
  }
}
// 获取指定楼宇的所有统计信息（摄像机点位数量）
exports.statistic = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-统计网格信息'))
    const building = await BuildingModel.findById(ctx.params.id, 'loc')
    const wkt = tools.stringToWkt(building.loc)
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(wkt)
    const resources = await ResourceModel.find({ point: { $nin: [null, undefined] }, type: 0 }).exec()
    // const buildings = await BuildingModel.find('loc').exec()
    let online = 0
    let offline = 0
    // let buildLength = 0
    for (var item of resources) {
      if (_.isEmpty(item.point)) {
        continue
      }
      const pointArr = item.point.loc.split(',')
      let pointStr
      if (pointArr && pointArr.length) {
        pointStr = pointArr[0] + ' ' + pointArr[1]
      }
      const point = reader.read(`POINT(${pointStr})`)
      const geometry = geo.contains(point)
      if (geometry) {
        parseInt(item.status) === 1 ? online++ : offline++
      }
    }
    // buildings.forEach(item => {
    //   const pointArr = item.center.split(',')
    //   let pointStr
    //   if (pointArr && pointArr.length) pointStr = pointArr[0] + ' ' + pointArr[1]
    //   const point = reader.read(`POINT (${pointStr})`)
    //   const geometry = geo.contains(point)
    //   if (geometry) {
    //     buildLength++
    //   }
    // })
    ctx.body = {
      camera: {
        // 资源点位树
        online: online,
        offline: offline
      }
      // building: buildLength     // 楼宇数量
    }
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
  }
}
// 获取所有楼宇信息
exports.getAll = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取所有楼宇信息'))
    let builds
    let count
    if (ctx.query.buildpage && ctx.query.buildlimit) {
      ;[count, builds] = await Promise.all([
        BuildingModel.countDocuments(),
        ctx.query.buildname
          ? BuildingModel.find({
            name: {
              $regex: ctx.query.buildname + '' || ''
            }
          })
            .skip((+ctx.query.buildpage - 1) * +ctx.query.buildlimit)
            .limit(+ctx.query.buildlimit)
            .exec()
          : BuildingModel.find()
            .skip((+ctx.query.buildpage - 1) * +ctx.query.buildlimit)
            .limit(+ctx.query.buildlimit)
            .exec()
      ])
    } else {
      ;[count, builds] = await Promise.all([BuildingModel.countDocuments().exec(), BuildingModel.find({}).exec()])
    }
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': ctx.query.buildlimit ? Math.ceil(count / ctx.query.buildlimit) : 0,
      'X-BSC-CUR': ctx.query.buildpage ? parseInt(ctx.query.buildpage) : 0,
      'X-BSC-LIMIT': ctx.query.buildlimit ? parseInt(ctx.query.buildlimit) : 0
    })
    ctx.body = builds
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
  }
}
// 查重
exports.checkRepeat = async (ctx, next) => {
  try {
    const id = ctx.query._id || ''
    const name = ctx.query.name || ''
    const code = ctx.query.code || ''
    let result
    if (name) {
      result = await BuildingModel.find({ name: name })
    }
    if (code) {
      result = await BuildingModel.find({ code: code })
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
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
  }
}
// 根据位置获取楼宇信息
exports.getBuildingInfoByLocation = async ctx => {
  try {
    const buildings = await BuildingModel.find({ mapId: ctx.query.mapId }).exec()
    const reader = new jsts.io.WKTReader()
    const result = {
      flag: false,
      info: null
    }
    for (var item of buildings) {
      const wkt = tools.stringToWkt(item.loc)
      const geo = reader.read(wkt)
      const pointStr = `POINT(${ctx.query.loc.split(',')[0]} ${ctx.query.loc.split(',')[1]})`
      const geoPoint = reader.read(pointStr)
      const flag = geo.contains(geoPoint)
      if (flag) {
        result.flag = true
        result.info = item
      }
    }
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    console.log(error)
    return ctx.throw(
      500,
      error.code ? { code: error.code, message: error.message } : { code: 4001, message: '系统内部错误' }
    )
  }
}
// 根据地图id获取楼宇信息
exports.getBuildingByMapId = async ctx => {
  try {
    let buildings
    let count
    if (ctx.query.buildpage && ctx.query.buildlimit) {
      ;[count, buildings] = await Promise.all([
        BuildingModel.countDocuments({
          mapId: ctx.query.mapId,
          name: {
            $regex: ctx.query.seek + '' || ''
          }
        }),
        BuildingModel.find({
          mapId: ctx.query.mapId,
          name: {
            $regex: ctx.query.seek + '' || ''
          }
        })
          .skip((+ctx.query.buildpage - 1) * +ctx.query.buildlimit)
          .limit(+ctx.query.buildlimit)
          .exec()
      ])
    } else {
      ;[count, buildings] = await Promise.all([
        BuildingModel.countDocuments({
          mapId: ctx.query.mapId,
          name: {
            $regex: ctx.query.seek ? ctx.query.seek + '' : ''
          }
        }),
        BuildingModel.find({
          mapId: ctx.query.mapId,
          name: {
            $regex: ctx.query.seek ? ctx.query.seek + '' : ''
          }
        })
      ])
    }
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': ctx.query.buildlimit ? Math.ceil(count / ctx.query.buildlimit) : 0,
      'X-BSC-CUR': ctx.query.buildpage ? parseInt(ctx.query.buildpage) : 0,
      'X-BSC-LIMIT': ctx.query.buildlimit ? parseInt(ctx.query.buildlimit) : 0
    })
    ctx.status = 200
    ctx.body = buildings
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
  }
}
