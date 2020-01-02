/*
 * 楼层接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:33:39
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-10-31 16:06:11
 */

'use strict'
const StoreyModel = require('mongoose').model('Storey')
const BuildingModel = require('mongoose').model('Building')
const ResourceModel = require('mongoose').model('Resource')
const PrincipalModel = require('mongoose').model('Principal')
const postal = require('postal')
const imageSize = require('image-size')
const fs = require('fs')
const _ = require('lodash')
const config = require('../../../../config')
const { handleSysException } = require('../../../common/tools')
const { AddressBookEnum } = require('../../../common/enum')
const Role = require('../../sys/role/role.service')
const role = new Role()

// 删除指定楼层
exports.deleteOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-删除指导楼层'))
    await ResourceModel.updateMany(
      {
        'point.sid': ctx.params.id
      },
      { $unset: { point: '' } },
      { multi: true }
    ).exec()
    postal.publish({
      topic: 'array.delete',
      channel: 'sentry:position',
      data: {
        id: ctx.params.id
      }
    })
    // 同时删除联系人表中的数据
    await PrincipalModel.deleteMany({ storeyId: ctx.params.id }).exec()
    const storey = await StoreyModel.findByIdAndRemove(ctx.params.id).exec()
    if (_.get(storey, 'picture.name', '')) {
      const filePath = `${config.backend.fileDirs.storeyPicDir}/${storey.picture.name}`
      fs.unlink(filePath, err => {
        console.log(err)
      })
    }
    await BuildingModel.findByIdAndUpdate(storey.bid, { $pull: { sids: storey._id } })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 新建楼层
exports.add = async ctx => {
  ctx.set('loginfo', encodeURI('地图管理-新建楼层'))
  delete ctx.request.body._id
  const bid = ctx.request.body.bid // 楼层所属楼宇
  const picture = ctx.request.body.picture || { name: '', path: '' }
  const filePath = `${config.backend.fileDirs.storeyPicDir}/${picture.name}`
  try {
    const picSize = imageSize(fs.readFileSync(filePath))
    ctx.request.body.picture.size = picSize
    const nameArr = await StoreyModel.find({ bid }, 'name')
    let flag = false
    nameArr.forEach(item => {
      if (item.name + '' === ctx.request.body.name + '') {
        flag = true
      }
    })
    if (flag) {
      ctx.throw(500, { code: 4008, message: '楼层名称重复' })
    }
    const { mapId = '', addressBookId = '' } = await BuildingModel.findById(bid, 'mapId addressBookId')
      .lean()
      .exec()
    const pid = ctx.request.body.pid
    delete ctx.request.body.pid
    const storey = new StoreyModel(_.merge(ctx.request.body))
    const newStorey = await StoreyModel.create(storey)
    const { _id: principalId } = await PrincipalModel.create({
      type: AddressBookEnum.STOREY,
      name: pid.name || '',
      mobile: pid.mobile || '',
      mapId: mapId,
      addressBookId: addressBookId,
      storeyId: newStorey._id
    })
    await StoreyModel.findByIdAndUpdate(newStorey._id, { pid: principalId })
      .lean()
      .exec()
    await BuildingModel.findByIdAndUpdate(bid, { $push: { sids: newStorey._id } })
    ctx.body = [newStorey._id]
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}

// 修改楼层
exports.updateOne = async ctx => {
  ctx.set('loginfo', encodeURI('地图管理-删除楼层'))
  try {
    const storey = await StoreyModel.findOne({ name: ctx.request.body.name }, 'name picture')
    if (!_.isEmpty(storey) && ctx.request.body._id !== storey._id && ctx.request.body.name === storey.name) {
      ctx.throw(500, { code: 4008, message: '楼层名称重复' })
    }
    const picture = ctx.request.body.picture || { name: '', path: '' }
    const filePath = `${config.backend.fileDirs.storeyPicDir}/${picture.name}`
    const picSize = imageSize(fs.readFileSync(filePath))
    ctx.request.body.picture.size = picSize
    let pid = ctx.request.body.pid
    const { addressBookId, mapId } = ctx.request.body.bid
    // 联系人 _id 存在
    if (pid._id) {
      await PrincipalModel.findByIdAndUpdate(pid._id, { name: pid.name || '', mobile: pid.mobile || '' })
        .lean()
        .exec()
    } else {
      const principal = await PrincipalModel.create({
        name: pid.name,
        mobile: pid.mobile,
        type: AddressBookEnum.STOREY,
        storeyId: ctx.params.id,
        mapId: mapId,
        addressBookId: addressBookId
      })
      ctx.request.body.pid = principal._id
    }
    await StoreyModel.findByIdAndUpdate(ctx.params.id, _.merge(ctx.request.body)).exec()
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 获取楼层信息
exports.getOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取楼层信息'))
    const storey = await StoreyModel.findById(ctx.params.id)
      .populate([{ path: 'bid' }, { path: 'pid' }])
      .lean()
      .exec()
    storey.pid = storey.pid === null ? { name: '', mobile: '' } : storey.pid
    ctx.body = storey
  } catch (err) {
    handleSysException(err)
  }
}

// 统计
exports.statistic = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-统计'))
    const sid = ctx.params.id // 楼层id
    const roleId = ctx.state.user.role
    const resIds = await role.getResIdsByRoleId(roleId)
    let query = {
      _id: { $in: resIds },
      'point.isouter': false, // 楼层内部设备
      'point.sid': sid // 楼层id
    }
    // 如果是超级管理员，返回空数组，默认拥有所有权限
    if (!(resIds.length > 0)) {
      delete query._id
    }
    // const storey = await StoreyModel.findById(sid).exec()
    // const building = await BuildingModel.findById(storey.bid).exec()
    const resources = await ResourceModel.find(query, 'status point.name').exec()
    let online = 0
    let offline = 0
    resources.forEach(item => {
      parseInt(item.status) === 1 ? online++ : offline++
    })
    ctx.body = {
      camera: {
        online: online,
        offline: offline
      }
    }
  } catch (err) {
    handleSysException(err)
  }
}

// 获取当前楼层下的所有通道
exports.getReses = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取该楼层下的所有通道'))
    const { channelTypes, monitortype, monitoryPointGenera } = ctx.query
    const roleId = ctx.state.user.role
    const resIds = await role.getResIdsByRoleId(roleId)
    let select = {
      _id: { $in: resIds },
      type: { $in: channelTypes.split(',') },
      'point.sid': ctx.params.id,
      'point.isouter': false
    }
    // 如果是超级管理员，返回空数组，默认拥有所有权限
    if (!(resIds.length > 0)) {
      delete select._id
    }
    if (typeof monitoryPointGenera !== 'undefined') {
      // 监控业务类型【0：普通IPC，1：人脸抓拍，2：车辆抓拍】
      if (Number(monitoryPointGenera) === 0) {
        // 普通IPC
        select.$or = [{ monitoryPointGenera, monitortype }, { monitoryPointGenera: { $exists: false }, monitortype }]
      } else {
        // 人脸抓拍 或 车辆抓拍
        select.monitoryPointGenera = monitoryPointGenera
      }
    } else {
      typeof monitortype !== 'undefined' && (select.monitortype = monitortype)
    }
    const reses = await ResourceModel.find(select)
      .populate([{ path: 'eid', select: 'deviceStatus type' }, { path: 'point.mid' }])
      .exec()
    let body
    if (ctx.query.alarm) {
      body = reses.filter(item => item.eid.type === ctx.query.alarm)
    } else {
      body = reses.filter(item => {
        return item.eid.type !== 'alarmBox' && item.eid.type !== 'alarmPillar'
      })
    }
    ctx.body = body
  } catch (err) {
    handleSysException(err)
  }
}
exports.getAllPointByChannelType = async ctx => {
  try {
    const sid = ctx.params.id // 楼层id
    const roleId = ctx.state.user.role
    const resIds = await role.getResIdsByRoleId(roleId)
    let query = {
      _id: { $in: resIds },
      type: { $in: ctx.query.channelTypes.split(',') },
      'point.isouter': false, // 楼层内部设备
      'point.sid': sid // 楼层id
    }
    // 如果是超级管理员，返回空数组，默认拥有所有权限
    if (!(resIds.length > 0)) {
      delete query._id
    }
    const resources = await ResourceModel.find(
      query,
      'chan name monitortype status eid alarmintype alarmtemplate maxdelaytime minintervaltime mapsign alarmaffirm point'
    )
      .populate({ path: 'point.mid' })
      .exec()
    ctx.body = resources
  } catch (err) {
    handleSysException(err)
  }
}
