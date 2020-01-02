/*
 * 地图点位接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:32:20
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-10-31 15:05:49
 */
'use strict'

const Resource = require('mongoose').model('Resource')
const Principal = require('mongoose').model('Principal')
const AddressBook = require('mongoose').model('AddressBook')
const { handleSysException } = require('../../../common/tools')
const command = require('../../../common/command')
const _ = require('lodash')
const moment = require('moment')
const util = require('../../../common/protobuf.util')
const postal = require('postal')
const Model = require('mongoose').model('Model')
const Icon = require('mongoose').model('Icon')
const Device = require('mongoose').model('Device')
const { alarmStatus } = require('../../../api/bstar/dev.interface')
const { AddressBookEnum } = require('../../../common/enum')
const Role = require('../../sys/role/role.service')
const role = new Role()
// 添加点位
exports.updateOne = async ctx => {
  ctx.set('loginfo', encodeURI('地图管理-添加点位'))
  const data = ctx.request.body
  if (_.isEmpty(data)) {
    ctx.throw(500, { code: 4003, message: '参数不能为空' })
  }
  try {
    const res = await Resource.findById(data._id)
      .populate({ path: 'eid', select: 'type' })
      .lean()
      .exec()
    let { type, monitortype, monitoryPointGenera } = res
    let key = type + '' + monitortype
    Number(monitoryPointGenera) === 1 && (key = '05') // 交通抓拍
    Number(monitoryPointGenera) === 2 && (key = '06') // 人脸抓拍
    res.eid.type === 'alarmPillar' && (key = '129')
    res.eid.type === 'alarmBox' && (key = '130')
    // 判断是否添加 3D 地图点位
    if (!res.point3D && data.point3D) {
      // 判断是楼外点位添加模型，因为楼外是 3D 地图
      if (data.point3D.isouter) {
        const model = await Model.findOne({ oid: key, default: true }, '_id')
        if (!model) {
          ctx.throw(500, { code: 4003, message: '请先添加模型' })
        }
        data.point3D.mid = model._id || ''
      } else {
        // 楼内点位添加图标，因为楼内是 2D 地图
        const icon = await Icon.findOne({ oid: key, default: true }, '_id')
        if (!icon) {
          ctx.throw(500, { code: 4003, message: '请先添加图标' })
        }
        data.point3D['iid'] = icon._id || ''
      }
    }
    // 判断是否添加 2D 地图点位
    if (!res.point && data.point) {
      // 获取默认模型
      const icon = await Icon.findOne({ oid: key, default: true }, '_id')
      if (!icon) {
        ctx.throw(500, { code: 4003, message: '请先添加图标！' })
      }
      data.point.mid = icon._id || ''
    }
    // 判断是 2D 点位的
    if (data.point) {
      // 将联系人同步到 Principal 表
      const principalArr = data.point.principal
      let pidArr = []
      const principalIds = await Principal.find({ resourceId: ctx.params.id }, '_id').lean().exec()
      const deletePrincipalIds = _.difference(principalIds.map(item => item._id + ''), principalArr.map(item => item._id + ''))
      if (deletePrincipalIds.length) {
        await Principal.deleteMany({ _id: { $in: deletePrincipalIds } })
      }
      for (let item of principalArr) {
        // 联系人 _id 存在，并且 name、mobile 字段为空，认为是删除联系人
        if (item._id && !item.name && !item.mobile) {
          await Principal.findByIdAndRemove(item._id)
            .lean()
            .exec()
        }
        // 联系人 _id 存在，并且 name、mobile 其中一个不为空，认为是修改联系人
        if (item._id && (item.name || item.mobile)) {
          const { _id: principalId = '' } = await Principal.findByIdAndUpdate(item._id, {
            name: item.name,
            mobile: item.mobile
          })
            .lean()
            .exec()
          pidArr.push(principalId)
        }
        // 联系人 _id 不存在，并且 name、mobile 其中一个不为空，认为是创建联系人
        if (!item._id && (item.name || item.mobile)) {
          const type = getUpdateDataByType(res).type
          const { _id: addressBookId } = await AddressBook.findOne({ mapId: res.point.mapId, type: type })
            .lean()
            .exec()
          const { _id: principalId = '' } = await Principal.create({
            resourceId: ctx.params.id,
            name: item.name,
            mobile: item.mobile,
            mapId: ctx.request.body.point.mapId,
            type: type,
            addressBookId: addressBookId
          })
          pidArr.push(principalId)
        }
      }
      data.point.principal = pidArr
    }
    const update = data.point ? data : _.merge(data, { 'data.point3D.name': data.name })
    await Resource.findByIdAndUpdate(ctx.params.id, update).exec()
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx,
        data: {
          module: 'alarm',
          varyData: [],
          newData: []
        }
      }
    })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 根据 type 类型来获取需要更新的数据
function getUpdateDataByType (res) {
  let pointType
  const alarmHelpTypes = ['alarmPillar', 'alarmBox']
  switch (res.type) {
    case 0:
      if (alarmHelpTypes.includes(res.eid.type)) {
        // 求助点位
        pointType = AddressBookEnum.HELP_POINT
      } else {
        // 视频点位
        pointType = AddressBookEnum.VIDEO_POINT
      }
      break
    case 1:
      // 报警点位
      pointType = AddressBookEnum.ALARM_POINT
      break
    case 11:
      // 消防点位
      pointType = AddressBookEnum.FIRE_POINT
      break
    case 9:
      // 报警点位
      pointType = AddressBookEnum.ALARM_POINT
      break
    case 4:
      // 门禁点位
      pointType = AddressBookEnum.DOOR_POINT
      break
    default:
      break
  }
  return { type: pointType }
}

// 获取点位
exports.getOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取点位'))
    let select
    let populate
    if (ctx.query.mapType === '3D') {
      select =
        'name chan type eid level status stream nodeId shareServer alarmtemplate monitoryPointGenera monitortype alarmstatus maxdelaytime minintervaltime mapsign point3D'
      populate = [
        { path: 'eid', select: '_id ip cport deviceStatus dport name manufacturer type' },
        { path: 'point3D.mid' },
        { path: 'point3D.iid' }
      ]
    } else {
      select =
        'name chan type eid level status stream nodeId  shareServer alarmtemplate monitoryPointGenera monitortype alarmstatus maxdelaytime minintervaltime mapsign point'
      populate = [
        { path: 'eid', select: '_id ip cport deviceStatus dport name manufacturer type' },
        { path: 'point.mid' },
        { path: 'point.principal' }
      ]
    }
    const res = await Resource.findById(ctx.params.id, select)
      .populate(populate)
      .lean()
      .exec()
    const FIRE_RES = 11
    if (_.get(res, 'type', 0) === FIRE_RES) {
      try {
        const alarmHost = await alarmStatus(ctx, { devIp: res.eid.ip, devPort: res.eid.cport })
        alarmHost.channelStatus &&
          alarmHost.channelStatus.forEach(item => {
            if (+item.channel === res.chan) {
              res.alarmStatus = item.status
            }
          })
      } catch (error) {
        console.log(error)
      }
    }
    ctx.body = _.isEmpty(res) ? {} : res
  } catch (err) {
    handleSysException(err)
  }
}
// 删除点位
exports.delOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-删除点位'))
    const data = {}
    ctx.query.mapType === '3D' ? (data.$unset = { point3D: 1 }) : (data.$unset = { point: 1 })
    const { point = {} } = await Resource.findByIdAndUpdate(ctx.params.id, data).lean().exec()
    let principalArr = _.get(point, 'principal', [])
    principalArr = principalArr.map(item => item._id + '')
    await Principal.deleteMany({ _id: { $in: principalArr } }).lean().exec()
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx,
        data: {
          module: 'alarm',
          varyData: [],
          newData: []
        }
      }
    })
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 获取所有资源点位
exports.getAll = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取所有资源点位'))
    const roleId = ctx.state.user.role
    const resIds = await role.getResIdsByRoleId(roleId)
    let query =
      resIds.length > 0
        ? { _id: { $in: resIds }, point: { $nin: [null, undefined] }, 'point.isouter': ctx.query.isouter }
        : { point: { $nin: [null, undefined] }, 'point.isouter': ctx.query.isouter }
    const reses = await Resource.find(query).exec()
    ctx.body = _.isEmpty(reses) ? [] : reses
  } catch (err) {
    handleSysException(err)
  }
}
// 根据地图id获取点位
exports.getPointByMapId = async ctx => {
  try {
    const mapId = ctx.query.mapId
    const roleId = ctx.state.user.role
    // 超级管理员返回空数组，默认有所有权限
    const resIds = await role.getResIdsByRoleId(roleId)
    let query =
      resIds.length > 0
        ? { _id: { $in: resIds }, type: ctx.query.channelType, 'point.mapId': mapId, 'point.isouter': true }
        : { type: ctx.query.channelType, 'point.mapId': mapId, 'point.isouter': true }
    const res = await Resource.find(query, '-point3D')
      .populate([{ path: 'eid', select: 'type ip cport deviceStatus' }, { path: 'point.mid' }])
      .lean()
      .exec()
    // res.forEach(item => {
    //   if (!item.status && +item.alarmstatus === 1) {
    //     item.alarmstatus = 2
    //   } else {
    //     if (item && +item.alarmstatus === 1 && item.alarmtemplate) {
    //       const status = getAlarmStatus(item.alarmtemplate)
    //       item.alarmstatus = status
    //     }
    //   }
    // })
    let body
    if (ctx.query.alarm) {
      body = res.filter(item => item.eid.type === ctx.query.alarm)
    } else {
      body = res.filter(item => {
        return item.eid.type !== 'alarmBox' && item.eid.type !== 'alarmPillar'
      })
    }
    ctx.body = body
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

exports.getPointByType = async ctx => {
  try {
    const roleId = ctx.state.user.role
    // 超级管理员返回空数组，默认有所有权限
    const resIds = await role.getResIdsByRoleId(roleId)
    const { mapId, sId, channelType, monitortype, monitoryPointGenera } = ctx.query
    let select = resIds.length > 0 ? { _id: { $in: resIds }, type: channelType } : { type: channelType }
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
    if (mapId) {
      select['point.mapId'] = mapId
      select['point.isouter'] = true
    } else {
      select['point.sid'] = sId
      select['point.isouter'] = false
    }
    const res = await Resource.find(select, '-point3D')
      .populate([{ path: 'eid', select: 'type ip deviceStatus cport' }, { path: 'point.mid' }])
      .lean()
      .exec()
    let body
    if (ctx.query.alarm) {
      body = res.filter(item => item.eid.type === ctx.query.alarm)
    } else {
      body = res.filter(item => {
        return item.eid.type !== 'alarmBox' && item.eid.type !== 'alarmPillar'
      })
    }
    ctx.body = body
  } catch (err) {
    handleSysException(err)
  }
}

exports.get3DPoint = async ctx => {
  try {
    const tab = ctx.query.tab
    const sid = ctx.query.sid
    const roleId = ctx.state.user.role
    const resIds = await role.getResIdsByRoleId(roleId)
    const query =
      resIds.length > 0
        ? {
          _id: { $in: resIds },
          type: { $in: ctx.query.channelTypes.split(',') },
          point3D: { $nin: [null, undefined] }
        }
        : { type: { $in: ctx.query.channelTypes.split(',') }, point3D: { $nin: [null, undefined] } }
    if (sid) {
      query['point3D.sid'] = sid
    } else {
      query['point3D.isouter'] = true
    }
    const alarmEidArr = (await Device.find({ type: { $in: ['alarmBox', 'alarmPillar'] } }, '_id')
      .lean()
      .exec()).map(item => item._id)
    if (tab === 'video') {
      alarmEidArr.length && (query.eid = { $nin: alarmEidArr })
    } else if (tab === 'alarmHelp') {
      if (alarmEidArr.length) {
        query.eid = { $in: alarmEidArr }
      } else {
        ctx.body = []
        return
      }
    }
    const res = await Resource.find(
      query,
      'ip port name type status alarmtemplate alarmstatus stream chan point3D status monitortype mapsign'
    )
      .populate([
        { path: 'eid', select: '_id ip cport dport type name manufacturer' },
        { path: 'point.mid' },
        { path: 'point3D.mid' },
        { path: 'point3D.iid' }
      ])
      .lean()
      .exec()
    ctx.status = 200
    ctx.body = res
  } catch (err) {
    handleSysException(err)
  }
}
// 设备布撤防
exports.updateAlarmStatus = async ctx => {
  try {
    if (+ctx.request.body.alarmstatus === 1) {
      const res = await Resource.findById(ctx.params.id, 'alarmtemplate')
        .populate('alarmtemplate')
        .exec()
      const status = getAlarmStatus(res.alarmtemplate)
      if (status === 2) {
        ctx.throw(500, { code: 500, message: '该点位未在布防时间内，无法布防！' })
      }
    }
    const base = { cmdBase: { devIp: ctx.request.body.devIp, devPort: ctx.request.body.devPort } }
    const defenseInfo = {
      inputNoCfgPrmArr: [
        {
          inputNo: ctx.request.body.chan,
          deployment: ctx.request.body.alarmstatus ? 1 : 0
        }
      ]
    }
    console.log(JSON.stringify(defenseInfo))
    // 获取DevRecordQueryMA2DA proto
    const basePro = util.baseProto('AlertAlarmInputCfgMA2DA')
    const structProBase = util.getProtoMsg(basePro, 'AlertAlarmInputCfgPrm')
    const buf = util.encode(structProBase, defenseInfo)
    const data = _.merge(base, { cmdContent: buf })
    const structPro = util.getProtoMsg(basePro, 'CommandGeneric')
    const bufReq = util.encode(structPro, data)
    try {
      const result = await util.tcp(bufReq, command.VMR_COMMAND_CLIENT2MA_POINT_DEFRNSE)
      // 请求成功，解析获取解码的buffer数据
      if (result.code === 0) {
      } else {
        ctx.throw(500, result)
      }
    } catch (error) {
      ctx.throw(
        500,
        error.code ? { code: error.code, message: error.message } : { code: 1017, message: '第三方接口异常' }
      )
    }
    await Resource.findByIdAndUpdate(ctx.params.id, { alarmstatus: ctx.request.body.alarmstatus }).exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}
exports.getAllPoint = async ctx => {
  try {
    const roleId = ctx.state.user.role
    // 超级管理员返回空数组，默认有所有权限
    const resIds = await role.getResIdsByRoleId(roleId)
    let query = resIds.length > 0 ? { _id: { $in: resIds }, 'point.isouter': false } : { 'point.isouter': false }
    let select
    let populate
    if (ctx.query.mapType === '3D') {
      query.point3D = { $nin: [null, undefined] }
      select = 'point3D.isouter point3D.loc point3D.sid point3D.bid'
      populate = {
        path: 'point3D.sid',
        select: 'name bid class picture',
        populate: {
          path: 'bid',
          select: 'name center scope code'
        }
      }
    } else {
      query.point = { $nin: [null, undefined] }
      select = 'point.isouter point.class point.loc point.sid point.bid point.mapId'
      populate = {
        path: 'point.sid',
        select: 'name bid class picture mapId',
        populate: {
          path: 'bid',
          select: 'name center scope mapId'
        }
      }
    }
    const reses = await Resource.find(query, select)
      .populate(populate)
      .lean()
      .exec()
    ctx.body = reses
  } catch (error) {
    handleSysException(error)
  }
}

// 若布撤防状态不为手动控制，通过时间模板检测布撤防状态
function getAlarmStatus (template) {
  try {
    let status = 2
    const nowSecond = moment().unix() - moment(moment().format('YYYY-MM-DD')).unix()
    const nowWeek = moment().isoWeekday()
    const elements = template.elements.toObject()
    for (var item in elements) {
      if (item === 'week' + nowWeek) {
        elements[item].forEach(time => {
          if (nowSecond >= time.beginTime && nowSecond <= time.endTime) {
            status = 1
          }
        })
      }
    }
    return status
  } catch (error) {
    console.log(error)
  }
}
// 根据位置获取点位
exports.getPointByLoc = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-获取所有资源点位'))
    const roleId = ctx.state.user.role
    const resIds = await role.getResIdsByRoleId(roleId)
    const query =
      resIds.length > 0
        ? { _id: { $in: resIds }, point: { $nin: [null, undefined] } }
        : { point: { $nin: [null, undefined] } }
    if (ctx.query.mapType === '3D') {
      query['point.loc'] = ctx.query.loc
    } else {
      query['point.loc3d'] = ctx.query.loc
    }
    const reses = await Resource.find(query).exec()
    ctx.body = _.isEmpty(reses) ? [] : reses
  } catch (error) {
    handleSysException(error)
  }
}
