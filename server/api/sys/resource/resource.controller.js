/*
 * @Author: linhang
 * @Date: 2019-06-06 16:44:02
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-27 15:59:12
 */
/*
 * 资源接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:56:51
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-07-26 11:19:11
 */

'use strict'
const mongoose = require('mongoose')
const OrgRes = mongoose.model('OrgRes')
const Org = mongoose.model('Org')
const Resource = mongoose.model('Resource')
const Device = mongoose.model('Device')
const Origin = mongoose.model('Origin')
const RtspServer = mongoose.model('RtspServer')
const paging = require('../../paging')
const _ = require('lodash')
const tool = require('../../../common/tools')
const { updateOneFavoriteResource } = require('../favorite/favorite.controller')
const { updateOneMonitor } = require('../tvWall/monitor/monitor.controller')
const { updateOnePollingResource } = require('../tvWall/polling/polling.controller')
const { updateOneSenceResource } = require('../tvWall/scene/scene.controller')
const AlarmCfg = mongoose.model('alarmCfg')
const FireCfg = mongoose.model('fireAlarmCfg')
const MonitoryPointAlarm = mongoose.model('MonitoryPointAlarm')
const IntelligentAlarm = mongoose.model('IntelligentAlarm')
const DeviceAlarm = mongoose.model('DeviceAlarm')
const AlarmClient = mongoose.model('alarmClient')
const TrafficLane = mongoose.model('TrafficLane')
const DefenseTask = mongoose.model('DefenseTask')
const AlarmTimeTemplate = mongoose.model('alarmTimeTemplate')
const xlsx = require('node-xlsx')
const fs = require('fs')
const postal = require('postal')
const Rtsp = require('../../../common/rtsp')
const ObjectId = mongoose.Types.ObjectId
const rtspServer = new Rtsp()
const { ORG_TYPE, RES_TYPE, ROLE_ID, DEV_TYPE } = require('../../../common/constant')
const { getDevConf, updateDevConf, fireAlarmChange } = require('../../bstar/dev.interface')
const generateNum = require('../../platform/generateNum')
const treeField =
  'chan name status monitortype stream point eid pinyin nodeId gbPlaDevIp gbPlaDevPort gbDevId gbParentDevId gbPlaNvrId shareServer videoStructure'
const Role = mongoose.model('Role')
const ResProperty = mongoose.model('ResProperty')
const Wall = mongoose.model('Wall')
const FaceServer = mongoose.model('FaceServer')
const IconService = require('../setting/icon/icon.service')
const iconService = new IconService()
// 用户管理右侧机构树类型
const CONSTANT = {
  VIDEO: 0,
  ALARM_INPUT: 1,
  FIRE_ALARM: 2,
  ALARM_HELP: 3,
  WALL_TYPE: 4,
  FACE_TYPE: 5
}
// 资源分配
exports.distribute = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('资源管理-资源分配'))
  const { oid, rids } = ctx.request.body
  const org = await Org.findById(oid).lean()
  if (org.shareType) {
    ctx.throw(500, { code: 1010, message: '下联机构不能添加资源' })
  }
  // 查找该机构下已分配的资源数
  // 2.0版本 需求 去掉不能超过200条限制
  // const orgReses = await OrgRes.find({ org: oid })
  //   .lean()
  //   .exec()
  // const videoCount = await Resource.countDocuments({
  //   _id: { $in: orgReses.map(item => item.resource) },
  //   type: RES_TYPE.VIDEO
  // }).exec()
  // if (videoCount + (rids.length || 0) > 200) {
  //   ctx.throw(500, { code: 1010, message: '机构下的视频资源数量不能超过200!' })
  // }
  try {
    const patchArr = []
    let patchRes = {}
    const org = await Org.findById(oid).exec()
    // if (org.isroot) {
    //   return ctx.throw(500, {
    //     code: 1004,
    //     message: '根机构不允许直接操作'
    //   })
    // }
    if (_.isEmpty(org)) {
      return ctx.throw(500, { code: 1003, message: '该机构不存在' })
    }
    const rootorg = await Org.findOne({ type: org.type || ORG_TYPE.LOCALE, isroot: true }).exec()
    let existed
    const distributedRes = []
    const ids = []
    for (let i = 0, len = rids.length; i < len; i++) {
      // 判断该资源id是否已经被分配过
      existed = await Resource.isDistributed(rids[i], rootorg)
      if (existed) {
        continue
      }
      patchRes['rootorg'] = rootorg._id
      ids.push(rids[i])
      patchRes['resource'] = rids[i]
      patchRes['org'] = oid
      patchRes['type'] = org.type
      patchArr.push(patchRes)
      distributedRes.push(rids[i])
      patchRes = {}
    }
    await Promise.all([
      OrgRes.insertMany(patchArr),
      Resource.updateMany({ _id: { $in: ids } }, { gbParentDevId: org.gbDevId }) // 资源分配到其他组织之后国标的原有的所属关系修改
    ])
    // 2.0新增，更新报警设置
    if (ctx.request.body.body) {
      await Resource.updateMany({ _id: { $in: ids } }, ctx.request.body.body)
    }
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx,
        data: {
          module: 'resource'
        }
      }
    })
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

    postal.publish({
      channel: 'resource',
      topic: 'org.update',
      data: {
        roleId: ctx.state.user.role
      }
    })
    ctx.status = 201
    ctx.body = distributedRes // 返回已分配成功的所有资源id集合
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 获取资源列表
exports.getAll = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取资源列表'))
  if (!ctx.query.oid) {
    return ctx.throw(500, {
      code: 1003,
      message: '该机构不存在'
    })
  }
  const orginfo = await Org.findById(ctx.query.oid).exec()
  if (_.isEmpty(orginfo)) {
    return ctx.throw(500, {
      code: 1003,
      message: '该机构不存在'
    })
  }
  let allChildrenIds = [] // 该机构的所有子机构
  try {
    if (parseInt(ctx.query.never) === -1) {
      const orgs = await Org.find(
        {
          type: orginfo.type || ORG_TYPE.LOCALE
        },
        '_id name pid order'
      )
        .sort('order')
        .exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    }
    allChildrenIds.unshift(ctx.query.oid + '')

    // 根据当前角色拥有的资源权限过滤资源

    const roleId = ctx.state.user.role
    let selectMatch = { islane: false, org: { $in: allChildrenIds } }
    if (roleId !== '5be27279e74ee9376c681111') {
      let resIds = await ResProperty.distinct('resource', { role: roleId, 'properties.0': { $exists: true } })
      selectMatch.resource = { $in: resIds }
    }
    let result = await OrgRes.find(selectMatch, 'resource')
    let _ids = _.map(result, 'resource')

    const query = { _id: { $in: _ids } }
    // 过滤报警求助的针孔摄像头
    const devs = await Device.find({ type: { $in: ['alarmBox', 'alarmPillar'] } }, '_id')
      .lean()
      .exec()
    if (ctx.query.tab === 'alarmHelp') {
      if (devs && devs.length) {
        query.eid = { $in: devs.map(dev => dev._id) }
      } else {
        query._id = new ObjectId()
      }
    } else {
      query.type = ctx.query.type
      devs && devs.length && (query.eid = { $nin: devs.map(dev => dev._id) })
    }
    ctx.query.seek && (query.name = { $regex: ctx.query.seek || '' })
    const count = await Resource.countDocuments(query).exec()
    // 2.0是否只显示未配置联动
    if (Number(ctx.query.config) === 1) {
      query.actionConfig = { $exists: false }
    }
    result = await Resource.find(query)
      .populate('eid')
      .skip((+ctx.query.page.page - 1) * +ctx.query.page.limit)
      .limit(+ctx.query.page.limit)
      .lean()
      .exec()
    // 集成数据权限
    // const reses = tool.integrationAuthData(global.authCache[ctx.state.user._id], result)
    ctx.set({
      'X-BSC-COUNT': count,
      'X-BSC-PAGES': Math.ceil(count / ctx.query.page.limit),
      'X-BSC-CUR': parseInt(ctx.query.page.page),
      'X-BSC-LIMIT': parseInt(ctx.query.page.limit)
    })
    ctx.body = result
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 资源搜索
exports.searchResource = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-资源搜索'))
  try {
    let allChildrenIds = [] // 该机构的所有子机构
    const orgs = await Org.find(
      {
        type: ctx.query.orgtype
      },
      '_id name pid order'
    )
      .sort('order')
      .exec()
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    allChildrenIds.unshift(ctx.query.oid + '')
    const result = await OrgRes.find(
      {
        islane: false,
        org: {
          $in: allChildrenIds
        }
      },
      'resource -_id'
    ).exec()
    const _ids = _.map(result, 'resource')
    const query = {
      _id: { $in: _ids },
      type: { $in: ctx.query.types.split(',') },
      $or: [{ name: { $regex: decodeURIComponent(ctx.query.seek) } }, { ip: { $regex: ctx.query.seek } }]
    }
    let select =
      'chan type name stream ip port eid status alarmintype alarmtemplate maxdelaytime monitortype minintervaltime'

    if (ctx.query.mapType === '3D') {
      select =
        'chan type name stream eid status alarmintype alarmtemplate maxdelaytime monitortype minintervaltime point3D'
    } else {
      select =
        'chan type name stream eid status alarmintype alarmtemplate maxdelaytime monitortype minintervaltime point'
    }
    if (ctx.query.storeyId) {
      if (ctx.query.mapType === '3D') {
        query['point3D.sid'] = ctx.query.storeyId
      } else {
        query['point.sid'] = ctx.query.storeyId
      }
    } else {
      if (ctx.query.mapType === '3D') {
        query['point3D.isouter'] = true
      } else {
        query['point.isouter'] = true
      }
    }
    // 过滤报警求助的针孔摄像头
    const devs = await Device.find({ type: { $in: ['alarmBox', 'alarmPillar'] } }, '_id')
      .lean()
      .exec()
    devs && devs.length && (query.eid = { $nin: devs.map(dev => dev._id + '') })

    const reses = await Resource.find(query, select)
      .populate('eid')
      .exec()
    if (_.get(ctx, 'state.user.name', '') === 'admin') {
      ctx.body = reses
      return
    }
    // 集成数据权限
    const PropertyModel = require('mongoose').model('ResProperty')
    const authResArr = await PropertyModel.find({ role: ctx.state.user.role })
      .lean()
      .exec()
    const authDataMap = {}
    authResArr.map(item => {
      authDataMap[item.resource + ''] = item.properties
    })
    ctx.body = tool.integrationAuthData(authDataMap, reses)
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 统计已分配的资源和已配置的rtsp流的数量
exports.countRtsp = async ctx => {
  try {
    let allChildrenIds = [] // 该机构的所有子机构
    if (parseInt(ctx.query.never) === -1) {
      const orgs = await Org.find({ type: ORG_TYPE.LOCALE }, '_id name pid order')
        .sort('order')
        .exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    }
    allChildrenIds.unshift(ctx.query.oid + '')
    const query = { oid: { $in: allChildrenIds }, type: ctx.query.type }
    const rtspCount = await Resource.countDocuments(query).exec()
    ctx.set({ 'X-BSC-COUNT': rtspCount })
    ctx.body = rtspCount || 0
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 统计资源管理tab头资源数量
exports.count = async ctx => {
  try {
    let allChildrenIds = [] // 该机构的所有子机构
    const orgs = await Org.find({ type: ORG_TYPE.LOCALE }, '_id name pid order')
      .sort('order')
      .exec()
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    allChildrenIds.unshift(ctx.query.oid + '')

    const roleId = ctx.state.user.role
    let selectMatch = {
      islane: false,
      org: {
        $in: allChildrenIds
      }
    }
    if (roleId !== '5be27279e74ee9376c681111') {
      let resIds = await ResProperty.distinct('resource', { role: roleId, 'properties.0': { $exists: true } })
      selectMatch.resource = { $in: resIds }
    }
    let result = await OrgRes.find(selectMatch, 'resource -_id').exec()
    const _ids = _.map(result, 'resource')
    const query = { _id: { $in: _ids }, type: RES_TYPE.VIDEO }
    const devs = await Device.find({ type: { $in: ['alarmBox', 'alarmPillar'] } }, '_id')
      .lean()
      .exec()
    const [videoCount, alarmHelpCount] = await Promise.all([
      Resource.countDocuments(
        devs && devs.length ? _.assign(query, { eid: { $nin: devs.map(dev => dev._id) } }) : query
      ),
      devs && devs.length ? Resource.countDocuments(_.assign(query, { eid: { $in: devs.map(dev => dev._id) } })) : 0
    ])
    ctx.body = { videoCount, alarmHelpCount }
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 获取已配置rtsp流的资源列表
exports.getRtspRes = async ctx => {
  try {
    let allChildrenIds = [] // 该机构的所有子机构
    if (parseInt(ctx.query.never) === -1) {
      const orgs = await Org.find({ type: ORG_TYPE.LOCALE }, '_id name pid order')
        .sort('order')
        .exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    }
    allChildrenIds.unshift(ctx.query.oid + '')
    const query = { oid: { $in: allChildrenIds }, rtsp: { $exists: { $nin: [null, undefined] } } }
    ctx.query.seek && (query.name = { $regex: ctx.query.seek + '' || '' })
    const rtspRes = await paging.listQuery(Resource, query, '', '', ctx.query.page, { path: 'eid' }, ctx)
    ctx.body = rtspRes.results
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 获取可用的rtsp流配置
exports.getUnusedRtspId = async ctx => {
  try {
    const rtspServer = await RtspServer.findOne({})
      .lean()
      .exec()
    if (_.isEmpty(rtspServer)) {
      ctx.throw(500, { code: 500, message: '请先配置流服务器' })
    }
    const urlStr = `rtsp://${rtspServer.username}:${rtspServer.password}@${rtspServer.url}:${rtspServer.port}/main/id=`
    const rtspData = []
    const rids = ctx.accept.headers['x-bsc-ids'].split(',')
    rids.forEach(rid => {
      const obj = {}
      obj[rid] = { rtsp: { main: urlStr + rtspServer.getUnusedIds() } }
      rtspData.push(obj)
    })
    ctx.body = rtspData
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 获取流服务器
exports.getRtspSever = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-获取流服务器'))
    const rtspServer = await RtspServer.findOne({}).exec()
    ctx.status = 200
    ctx.body = rtspServer
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 编辑流服务器
exports.editRtspSever = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-编辑流服务器'))
    const rtspServer = await RtspServer.findOne({}).exec()
    if (rtspServer) {
      await RtspServer.findByIdAndUpdate(rtspServer._id, ctx.request.body).exec()
    } else {
      await RtspServer.create(ctx.request.body)
    }
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
exports.addRtspPatch = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-配置rtsp流'))
    const reqData = ctx.request.body
    await Promise.all(
      reqData.map(data => {
        const key = Object.keys(data)[0]
        const value = data[key]
        return Resource.findByIdAndUpdate(key, value)
      })
    )
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
exports.updateResourceRtsp = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-配置rtsp流'))
    const rtspId = ctx.request.body.rtsp.main.split('=').pop()
    const flag = rtspServer.unusedIds.includes(Number(rtspId))
    if (!flag) {
      ctx.throw(500, { code: 500, message: '该rtsp id已被占用' })
    }
    await Resource.findByIdAndUpdate(ctx.params.id, ctx.request.body).exec()
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 删除资源的rtsp流
exports.deleteResourceRtsp = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-删除资源'))
    const ids = ctx.accept.headers['x-bsc-ids'].split(',')
    const resources = await Resource.find({ _id: { $in: ids } }, 'rtsp.main')
      .lean()
      .exec()
    await Resource.updateMany({ _id: { $in: ids } }, { rtsp: { $unset: 1 } }, { multi: true }).exec()
    // 回收rtsp流
    resources.forEach(res => {
      let id
      if (res.rtsp.main) {
        id = res.rtsp.main.split('=').pop()
        rtspServer.setUnusedIds(Number(id))
      }
    })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
exports.deleteResource = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-删除资源'))
    const ids = ctx.request.body.ids
    const resources = await Resource.find({ _id: { $in: ids } }).exec()
    Origin.deleteMany({ $or: [{ decodechan: { $in: ids } }, { jointorigin: { $in: ids } }] })
    postal.publish({
      channel: 'resources',
      topic: 'array.delete',
      data: {
        ctx,
        ids: resources.map(item => {
          if (item.type === RES_TYPE.VIDEO) {
            return item._id
          }
        })
      }
    })
    postal.publish({
      channel: 'alarm',
      topic: 'alarmCfg',
      data: {
        ids: resources.map(item => item._id)
      }
    })
    postal.publish({
      channel: 'alarm',
      topic: 'fireAlarmCfg',
      data: {
        ids: resources.map(item => item._id)
      }
    })
    for (var item of ids) {
      const res = await Resource.findById(item).exec()
      if (_.isEmpty(res)) {
        return ctx.throw(500, {
          code: 1014,
          message: '该资源不存在'
        })
      }
      await Promise.all([
        Resource.findByIdAndRemove(item).exec(),
        OrgRes.deleteMany({
          resource: item
        }).exec() // 删除资源机构分配中间表数据
      ])
      if (res.type === 0) {
        await Promise.all([updateOneFavoriteResource(res), updateOnePollingResource(res), updateOneSenceResource(res)])
      }
      if (res.type === 5) {
        await updateOneMonitor(res)
      }
      postal.publish({
        channel: 'resources',
        topic: 'item.delete',
        data: {
          id: item,
          isreal: true,
          ctx: ctx
        }
      })
      if (res.rtsp && /=/g.test(res.rtsp.main)) {
        const rtspId = res.rtsp.main.split('=').pop()
        // 回收当前资源的rtsp id
        rtspServer.setUnusedIds(Number(rtspId))
      }
    }
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx
      }
    })

    postal.publish({
      channel: 'resource',
      topic: 'org.update',
      data: {
        roleId: ctx.state.user.role
      }
    })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

exports.deleteFireResource = async ctx => {
  try {
    const ids = ctx.headers['x-bsc-ids'].split(',')
    // 删除输入防区向北京发送通知
    const resources = await Resource.find({ _id: { $in: ids } })
      .populate('eid')
      .lean()
      .exec()
    const devices = resources.map(item => item.eid)
    let newData = []
    let varyData = []
    devices.forEach(item => {
      let obj = {
        devIp: item.ip,
        devPort: item.cport,
        vendor: item.manufacturer,
        type: 'delete'
      }
      newData.push(obj)
    })
    resources.forEach(item => {
      let obj = {
        before: {
          slotNo: Number(item.devloop),
          zoneNo: item.chan
        }
      }
      varyData.push(obj)
    })
    const data = {
      module: 'firealarm',
      newData: newData.splice(0, 1),
      varyData: varyData
    }
    try {
      await fireAlarmChange({ ctx, data })
    } catch (err) {
      return ctx.throw(500, {
        code: 500,
        message: `请求第三方接口'/api/notice/info'异常`,
        type: 'sys'
      })
    }
    // 同时删除配置表和orgres表
    await Promise.all([
      Resource.deleteMany({ _id: { $in: ids } }),
      AlarmCfg.deleteMany({ resource: { $in: ids } }),
      OrgRes.deleteMany({ resource: { $in: ids } })
    ])
    ctx.status = 200

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
  } catch (error) {
    tool.handleSysException(error)
  }
}
// 获取单个资源
exports.getOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-获取单个资源'))
    const res = await Resource.findById(ctx.params.id)
      .populate('eid')
      .exec()
    ctx.body = _.isEmpty(res) ? {} : res
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 修改通道资源所属的机构（资源移动）
exports.upOrg = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-资源移动'))
    const oid = ctx.request.body.oid
    const ids = ctx.accept.headers['x-bsc-ids'].split(',')
    const neworg = await Org.findById(oid).exec()
    if (neworg.shareType) {
      ctx.throw(500, { code: 1010, message: '下联机构不能添加资源' })
    }
    const rootorg = await Org.findOne({
      isroot: true,
      type: neworg.type
    }).exec()
    for (var item of ids) {
      const orgres = await OrgRes.findOne({
        rootorg: rootorg._id,
        resource: item,
        islane: false
      }).exec()
      orgres.org = neworg
      await orgres.save()
    }
    // 机构移动后发送通知
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
    postal.publish({
      channel: 'resource',
      topic: 'org.update',
      data: {
        roleId: ctx.state.user.role
      }
    })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
/**
 * 消防资源移动
 */
exports.moveFireAlarm = async ctx => {
  try {
    const ids = ctx.headers['x-bsc-ids'].split(',') // 要移动的消防资源的id
    const oid = ctx.request.body.oid // 要移动到的机构的id
    await Resource.updateMany({ _id: { $in: ids } }, { orgId: oid })
    await OrgRes.updateMany({ resource: { $in: ids } }, { org: oid })
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
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 资源编辑
exports.updateOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-资源更新'))
    ctx.request.body.name && (ctx.request.body.pinyin = tool.transferPinyin(ctx.request.body.name))
    const old = await Resource.findById(ctx.params.id).exec()
    if (old.shareServer) {
      ctx.throw(500, { code: 1012, message: `下联通道不能修改` })
    }
    /**
     * 对 设备管理-拼接控制器-输入源-项目-修改
     * 点击保存后，由于ctx.request.body.devloop为undefined
     * 所以count有值，throw抛出报错
     * 不清楚该代码的作用，暂时注释掉
     */
    const body = ctx.request.body
    // 如果修改消防报警报警防区资源，body里有fireAlarmUpdate字段，需要做此判断
    if (body.fireAlarmUpdate) {
      const count = await Resource.countDocuments({
        devloop: body.devloop,
        chan: body.chan,
        _id: { $ne: ctx.params.id },
        eid: body.eid._id
      })
      if (count) {
        ctx.throw(500, '该设备回路下防区编号已存在')
      }
    }
    // 如果修改了消防主机输入防区,向北京发送通知
    if (ctx.request.body.type === 11) {
      const [device, oldResource] = await Promise.all([
        Device.findById(ctx.request.body.eid._id)
          .lean()
          .exec(),
        Resource.findById(ctx.params.id)
          .lean()
          .exec()
      ])
      const data = {
        module: 'firealarm',
        newData: [
          {
            devIp: device.ip,
            devPort: device.cport,
            vendor: device.manufacturer,
            type: 'modify'
          }
        ],
        varyData: [
          {
            before: {
              slotNo: Number(oldResource.devloop),
              zoneNo: oldResource.chan
            },
            after: {
              slotNo: Number(ctx.request.body.devloop),
              zoneNo: ctx.request.body.chan
            }
          }
        ]
      }
      try {
        await fireAlarmChange({ ctx, data })
      } catch (err) {
        return ctx.throw(500, {
          code: 500,
          message: `请求第三方接口'/api/notice/info'异常`,
          type: 'sys'
        })
      }
    }
    // 如果在设备管理修改了设备类型，相应的地图点位也要修改为相应类型的默认图标
    if (_.get(body, 'point', '')) {
      if (body.monitortype !== old.monitortype || body.monitoryPointGenera !== old.monitoryPointGenera) {
        switch (body.monitortype) {
          case 0: // 枪机
            if (body.monitoryPointGenera === 1) {
              const { _id: faceIconId } = await iconService.findOne({ oid: '05', default: true }, '_id')
              body.point.mid = faceIconId
            } else if (body.monitoryPointGenera === 2) {
              const { _id: vehicleIconId } = await iconService.findOne({ oid: '06', default: true }, '_id')
              body.point.mid = vehicleIconId
            } else {
              const { _id: gunIconId } = await iconService.findOne({ oid: '00', default: true }, '_id')
              body.point.mid = gunIconId
            }
            break
          case 1: // 红外枪机
            const { _id: redGunIconId } = await iconService.findOne({ oid: '01', default: true }, '_id')
            body.point.mid = redGunIconId
            break
          case 2: // 半球
            const { _id: halfBallIconId } = await iconService.findOne({ oid: '02', default: true }, '_id')
            body.point.mid = halfBallIconId
            break
          case 3: // 快球
            const { _id: fastBallIconId } = await iconService.findOne({ oid: '03', default: true }, '_id')
            body.point.mid = fastBallIconId
            break
          case 4: // 全景
            const { _id: panoramicIconId } = await iconService.findOne({ oid: '04', default: true }, '_id')
            body.point.mid = panoramicIconId
            break
          default:
            break
        }
      }
    }
    await Resource.findByIdAndUpdate(ctx.params.id, body).exec()
    if (ctx.request.body.type !== 11) {
      postal.publish({
        channel: 'devices',
        topic: 'item.notice',
        data: {
          ctx: ctx,
          data: {
            module: 'resource',
            varyData: [
              {
                resourceId: ctx.params.id,
                before: {
                  channelName: old.name,
                  devType: +old.type,
                  streamType: old.stream,
                  keyboardNum: old.keycode,
                  isDelayRecord: old.isdelayrecord,
                  isPreRecord: old.isprerecord,
                  delayTime: old.delayrecord || 0,
                  preTime: old.precord || 0
                },
                after: {
                  channelName: body.name,
                  devType: +body.type,
                  streamType: body.stream,
                  keyboardNum: body.keycode,
                  isDelayRecord: body.isdelayrecord,
                  isPreRecord: body.isprerecord,
                  delayTime: body.delayrecord || 0,
                  preTime: body.precord || 0
                }
              }
            ],
            newData: []
          }
        }
      })
    }

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
    // }
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(
      500,
      err.code
        ? { code: err.code, message: err.message, type: err.type || '' }
        : { code: 1001, message: '系统内部错误' }
    )
  }
}
// 资源批量编辑
exports.updatePatch = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-资源批量更新'))
    const ids = ctx.accept.headers['x-bsc-ids'].split(',')
    const body = ctx.request.body
    await Promise.all(
      ids.map(id => {
        return Resource.findByIdAndUpdate(id, body).exec()
      })
    )
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
    console.log(err)
    return ctx.throw(
      500,
      err.code
        ? { code: err.code, message: err.message, type: err.type || '' }
        : { code: 1001, message: '系统内部错误' }
    )
  }
}
// 资源分配:机构设备资源树
exports.getDistributionTree = async ctx => {
  try {
    let allChildrenIds = [] // 该机构的所有子机构
    const { _id: rootId } = await Org.findOne({ type: ORG_TYPE.LOCALE, isroot: true }, '_id')
      .lean()
      .exec()
    if (!ctx.query.oid && !ctx.query.tab) {
      // 用户不传oid。则按照当前用户的权限下的机构id去处理
      ctx.query.oid = rootId
    } else if (ctx.query.tab === 'alarmHelp') {
      ctx.query.oid = rootId
    }
    const allorg = await Org.find(
      {
        type: 0
      },
      '_id name pid order isroot'
    )
      .sort({ order: -1 })
      .lean()
      .exec()
    const rootorg = await Org.findOne({
      type: ctx.query.orgtype,
      isroot: true
    }).exec()
    allChildrenIds = tool.getChildren(allChildrenIds, allorg, ctx.query.oid)
    allChildrenIds.unshift(ctx.query.oid + '') // 所有的现场机构
    let orgs = allorg.filter(item => allChildrenIds.includes(item._id + ''))
    const query = {}
    // 过滤报警求助的针孔摄像头
    const devs = await Device.find({ type: { $in: ['alarmBox', 'alarmPillar'] } }, '_id')
      .lean()
      .exec()
    if (ctx.query.tab === 'alarmHelp') {
      devs && devs.length && (query.eid = { $in: devs.map(dev => dev._id + '') })
    } else {
      query.type = ctx.query.type
      devs && devs.length && (query.eid = { $nin: devs.map(dev => dev._id + '') })
    }
    const reses = await Resource.find(query, '_id name type eid status')
      .lean()
      .exec()
    // 在这里进行资源过滤（已分配的资源不展示）
    const orgreses = await OrgRes.find({
      // 选出所有已分配到机构下的资源
      rootorg: rootorg._id,
      resource: {
        $in: _.map(reses, '_id')
      }
    }).exec()
    const orgResMap = {}
    orgreses.forEach(item => {
      orgResMap[item.resource + ''] = 1
    })
    const orgids = orgs.map(org => org._id)
    const devQuery = {}
    // 过滤报警求助的针孔摄像头设备
    if (ctx.query.tab === 'alarmHelp') {
      if (devs && devs.length) {
        devQuery._id = { $in: devs.map(dev => dev._id + '') }
      } else {
        ctx.body = []
        return
      }
    } else {
      devQuery.oid = { $in: orgids }
      devQuery.bigtype = ctx.query.bigtype
      devs && devs.length && (devQuery._id = { $nin: devs.map(dev => dev._id + '') })
    }
    const devices = await Device.find(devQuery, 'name oid status')
      .lean()
      .exec()
    let resources
    const devids = []
    const arr = []
    devices.forEach(item => {
      item.equip = true
      devids.push(item._id)
      arr.push(Object.assign(item, { equip: true }))
    })
    query.eid = { $in: devids }
    if (Number(ctx.query.rtsp) === 1) {
      query.resp = { $exists: false }
      resources = await Resource.find(query, 'name type eid monitortype status')
        .lean()
        .exec()
    } else {
      resources = await Resource.find(query, 'name type eid monitortype status')
        .lean()
        .exec()
      // 如果是用户管理模块调用，不需要过滤已经分配的资源
      if (!ctx.query.isUserManage) {
        resources = resources.filter(resource => {
          if (!orgResMap[resource._id + '']) {
            return resource
          }
        })
      }
    }
    const resMapping = {}
    resources.forEach(res => {
      !resMapping[res.eid + ''] && (resMapping[res.eid + ''] = [])
      resMapping[res.eid + ''].push(res)
    })
    const devMapping = {}
    devices.forEach(dev => {
      !devMapping[dev.oid + ''] && (devMapping[dev.oid + ''] = [])
      devMapping[dev.oid + ''].push(dev)
    })
    orgs.forEach(org => {
      devMapping[org._id + ''] &&
        devMapping[org._id + ''].forEach(dev => {
          if (resMapping[dev._id + '']) {
            dev.children = resMapping[dev._id + '']
            // 节点过滤
          } else {
            devMapping[org._id + ''] = devMapping[org._id + ''].filter(item => item._id + '' !== dev._id + '')
          }
        })
      org.children = devMapping[org._id + ''] || []
    })
    // 节点过滤
    // 获取所有的机构pid
    const orgPids = orgs.map(item => item.pid + '').filter(item => item !== undefined)
    // 机构集合数据转化以及过滤掉没有设备的机构(不包括当期传入机构)
    // 报警求助添加资源数过滤
    if (ctx.query.tab === 'alarmHelp') {
      orgs = orgs.filter(org => {
        if (org.isroot) {
          org.name = '报警终端'
          return org
        }
      })
    } else {
      // 视频通道添加树过滤
      orgs = orgs.filter(org => {
        if (org.isroot) {
          return org
        } else if (org._id + '' === ctx.query.oid) {
          return org
        }
        if (org.children && org.children.length) {
          return org
        } else if (orgPids.includes(org._id + '')) {
          return org
        }
      })
    }
    ctx.body = tool.transData2Tree(orgs, '_id', 'pid', true).pop()
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
/**
 * 报警求助机构设备资源树，用户管理模块使用
 */
exports.getAlarmHelpTree = async ctx => {
  try {
    const rootOrg = await Org.findOne(
      {
        type: ORG_TYPE.LOCALE
      },
      'name'
    )
      .lean()
      .exec()
    const devices = await Device.find({ type: { $in: ['alarmBox', 'alarmPillar'] } }, 'name')
      .lean()
      .exec()
    if (!devices.length) {
      ctx.body = []
      return
    }
    const deviceIds = []
    devices.forEach(item => {
      deviceIds.push(item._id)
      item.equip = true
    })
    const query = { eid: { $in: deviceIds } }
    const resources = await Resource.find(query, 'name eid')
      .lean()
      .exec()
    const resMapping = {}
    resources.forEach(res => {
      !resMapping[res.eid] && (resMapping[res.eid] = [])
      resMapping[res.eid].push(res)
    })
    devices.forEach(dev => {
      if (resMapping[dev._id]) {
        dev.children = resMapping[dev._id]
      } else {
        devices.shift(dev) // 过滤掉设备下没有资源的设备
      }
    })
    rootOrg.children = devices
    rootOrg.name = '报警终端'
    ctx.body = rootOrg
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 报警管理列表获取(报警输入、报警输出)
exports.getAlarmList = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取资源列表'))
  try {
    if (!ctx.query.oid) {
      return ctx.throw(500, {
        code: 1003,
        message: '该机构不存在'
      })
    }
    const orginfo = await Org.findById(ctx.query.oid).exec()
    if (_.isEmpty(orginfo)) {
      return ctx.throw(500, {
        code: 1003,
        message: '该机构不存在'
      })
    }
    let allChildrenIds = [] // 该机构的所有子机构
    if (parseInt(ctx.query.never) === -1) {
      const orgs = await Org.find(
        {
          type: orginfo.type || ORG_TYPE.LOCALE
        },
        '_id name pid order'
      )
        .sort('order')
        .exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    }
    allChildrenIds.unshift(ctx.query.oid + '')
    let result = await OrgRes.find(
      {
        islane: false,
        org: {
          $in: allChildrenIds
        }
      },
      'resource -_id'
    ).exec()
    const search = {
      type: {
        $in: ctx.query.channelTypes.split(',')
      }
    }
    // 如果勾选了只显示未配置
    if (ctx.query.config === '1') {
      search.actionConfig = { $exists: false }
    }
    let _ids = _.map(result, 'resource')
    // 根据当前角色拥有的资源权限过滤资源
    const roleId = ctx.state.user.role
    if (roleId !== ROLE_ID) {
      const roleId = ctx.state.user.role // 当前用户所属角色id
      let resIds = await ResProperty.distinct('resource', {
        role: roleId,
        type: CONSTANT.ALARM_INPUT,
        'properties.0': { $exists: true }
      })
      resIds = resIds.map(item => item + '')
      _ids = _ids.map(item => item + '')
      _ids = _.intersection(_ids, resIds)
    }
    _.merge(search, {
      _id: {
        $in: _ids
      }
    })
    result = await paging.listQuery(
      Resource,
      {
        $and: [
          search,
          {
            name: {
              $regex: ctx.query.seek || ''
            }
          }
        ]
      },
      '',
      '',
      ctx.query.page,
      { path: 'eid' },
      ctx
    )
    ctx.body = _.isEmpty(result.results) ? [] : result.results
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 智能报警、监控点报警列表获取
exports.getDependVideoAlarmList = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取资源列表'))
  try {
    if (!ctx.query.oid) {
      return ctx.throw(500, {
        code: 1003,
        message: '该机构不存在'
      })
    }
    const orginfo = await Org.findById(ctx.query.oid).exec()
    if (_.isEmpty(orginfo)) {
      return ctx.throw(500, {
        code: 1003,
        message: '该机构不存在'
      })
    }
    let allChildrenIds = [] // 该机构的所有子机构
    if (parseInt(ctx.query.never) === -1) {
      const orgs = await Org.find(
        {
          type: orginfo.type || ORG_TYPE.LOCALE
        },
        '_id name pid order'
      )
        .sort('order')
        .exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    }
    allChildrenIds.unshift(ctx.query.oid + '')
    const result = await OrgRes.find(
      {
        islane: false,
        org: {
          $in: allChildrenIds
        }
      },
      'resource -_id'
    ).exec()
    const _ids = _.map(result, 'resource')
    // 找出视频资源
    const resources = await Resource.find({ type: RES_TYPE.VIDEO, _id: { $in: _ids } }).exec()
    const resIds = resources.map(item => item._id + '')
    // schema mapping
    const mapping = {
      intelligentAlarm: IntelligentAlarm,
      monitoryPointAlarm: MonitoryPointAlarm
    }
    // 分页查询
    const res = await paging.listQuery(
      mapping[ctx.query.category],
      { rid: { $in: resIds } },
      '',
      '',
      ctx.query.page,
      { path: 'rid', select: 'eid', populate: { path: 'eid', select: 'name' } },
      ctx
    )
    let resultRes = []
    if (ctx.query.seek) {
      if (!_.isEmpty(res.results)) {
        res.results.forEach(item => {
          if (new RegExp(ctx.query.seek).test(item.rid.eid.name)) {
            resultRes.push(item)
          }
        })
      }
    } else {
      resultRes = [...res.results]
    }
    ctx.body = resultRes
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 资源分配:报警主机报警、普通视频报警：机构资源树,消防报警
exports.getDistributionTreeForAlarmAndIpcAlarm = async ctx => {
  try {
    let allChildrenIds = [] // 该机构的所有子机构
    const allorg = await Org.find(
      {
        type: 0
      },
      '_id name pid order isroot'
    )
      .lean()
      .exec()
    const rootorg = _.find(allorg, { isroot: true })
    allChildrenIds = tool.getChildren(allChildrenIds, allorg, ctx.query.oid || rootorg._id + '')
    allChildrenIds.unshift(ctx.query.oid || rootorg._id + '') // 所有的现场机构
    let orgs = allorg.filter(item => allChildrenIds.includes(item._id + ''))
    const reses = await Resource.find({ type: { $in: ctx.query.channelTypes.split(',') } }, '_id name type eid')
      .lean()
      .exec()
    const orgids = []
    orgs.forEach(item => {
      orgids.push(item._id)
    })
    const devices = await Device.find(
      { oid: { $in: orgids }, bigtype: { $in: ctx.query.bigTypes.split(',') } },
      'name oid bigtype'
    )
      .sort({ _id: -1 })
      .lean()
      .exec()
    const [devids, arr] = [[], []]
    devices.forEach(item => {
      devids.push(item._id)
      arr.push(Object.assign(item, { equip: true }))
    })
    let resources = await Resource.find(
      {
        eid: { $in: devids },
        type: { $in: ctx.query.channelTypes.split(',') }
      },
      'name ip port eid type'
    )
      .lean()
      .exec()
    // 在这里进行资源过滤（已分配的资源不展示）
    const orgreses = await OrgRes.find({
      rootorg: rootorg._id,
      resource: {
        $in: _.map(reses, '_id')
      }
    })
      .lean()
      .exec()
    resources = resources.filter(resource => {
      if (!orgreses.map(res => res.resource + '').includes(resource._id + '')) {
        return resource
      }
    })
    // 如果是报警管理-报警输出tab,不过滤报警主机和解码器的报警输出资源
    if (ctx.query.alarmOutput === '1') {
      const reses = await Resource.find({ type: { $in: [8, 10] } })
        .lean()
        .exec()
      _.unionWith(resources, reses, _.isEqual)
    }
    const resMapping = {}
    resources.forEach(res => {
      !resMapping[res.eid + ''] && (resMapping[res.eid + ''] = [])
      resMapping[res.eid + ''].push(res)
    })
    const devMapping = {}
    devices.forEach(dev => {
      !devMapping[dev.oid + ''] && (devMapping[dev.oid + ''] = [])
      devMapping[dev.oid + ''].push(dev)
    })
    orgs.forEach(org => {
      devMapping[org._id + ''] &&
        devMapping[org._id + ''].forEach(dev => {
          if (resMapping[dev._id + '']) {
            dev.children = resMapping[dev._id + '']
          } else {
            // 过滤没有资源的设备
            devMapping[org._id + ''] = devMapping[org._id + ''].filter(item => item._id + '' !== dev._id + '')
          }
        })
      org.children = devMapping[org._id + ''] || []
    })
    // 过滤没有设备的机构
    orgs = tool.deleteNoChildrenOrgs(orgs)
    const data = tool.transData2Tree(orgs, '_id', 'pid', true)
    ctx.body = data.pop()
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 消防报警树，用户管理模块调用
exports.getFireAlarmTree = async ctx => {
  try {
    let orgs = await Org.find(
      {
        type: ORG_TYPE.LOCALE
      },
      '_id name pid order isroot'
    )
      .lean()
      .exec()

    const devices = await Device.find({ bigtype: DEV_TYPE.FIREHOST }, 'name oid bigtype')
      .sort({ _id: -1 })
      .lean()
      .exec()
    const devids = []
    devices.forEach(item => {
      devids.push(item._id)
      Object.assign(item, { equip: true })
    })
    let resources = await Resource.find(
      {
        eid: { $in: devids },
        type: 11
      },
      'name ip port eid type'
    )
      .lean()
      .exec()
    const resMapping = {}
    resources.forEach(res => {
      !resMapping[res.eid] && (resMapping[res.eid] = [])
      resMapping[res.eid].push(res)
    })
    // 过滤没有资源的设备
    const filterDevices = devices.filter(dev => resMapping[dev._id])
    const devMapping = {}
    filterDevices.forEach(dev => {
      !devMapping[dev.oid] && (devMapping[dev.oid] = [])
      devMapping[dev.oid].push(dev)
    })
    orgs.forEach(org => {
      if (devMapping[org._id]) {
        devMapping[org._id].forEach(dev => {
          dev.children = resMapping[dev._id]
        })
      }
      org.children = devMapping[org._id] || []
    })
    orgs = tool.deleteNoChildrenOrgs(orgs)
    const data = tool.transData2Tree(orgs, '_id', 'pid', true).pop()
    ctx.body = data
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 机构资源树(已分配)
exports.getTree = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取机构资源树'))
  const oid = ctx.query.oid
  const rid = ctx.query.rid
  delete ctx.query.rid
  let allChildrenIds = [] // 该机构的所有子机构
  const [allorg, rootorg] = await Promise.all([
    Org.find(
      {
        type: ctx.query.orgtype || ORG_TYPE.LOCALE
      },
      '_id name pid order'
    )
      .sort({ order: -1 })
      .exec(),
    Org.findOne({
      type: ctx.query.orgtype || ORG_TYPE.LOCALE,
      isroot: true
    }).exec()
  ])
  if (!oid) {
    allChildrenIds = tool.getChildren(allChildrenIds, allorg, rootorg._id + '')
    allChildrenIds.unshift(rootorg._id + '')
  } else {
    allChildrenIds = tool.getChildren(allChildrenIds, allorg, oid)
    allChildrenIds.unshift(oid)
  }
  let orgReses = await OrgRes.find(
    {
      islane: false,
      org: {
        $in: allChildrenIds
      }
    },
    'resource org'
  )
    .sort('name')
    .exec()
  const againOrgReses = await OrgRes.find(
    {
      islane: true,
      rootorg: rootorg._id
    },
    'resource org'
  ).exec()
  const newOrgReses = []
  let flag
  for (let i = 0; i < orgReses.length; i++) {
    flag = true
    for (let j = 0; j < againOrgReses.length; j++) {
      if (orgReses[i].resource + '' === '' + againOrgReses[j].resource) {
        flag = false
        break
      }
    }
    if (flag) {
      // 说明没有重复的resource（既islane true|false）, 即重复的数据不添加
      newOrgReses.push(orgReses[i])
    }
  }
  orgReses = newOrgReses
  const [orgResHash, resHash] = [{}, {}]
  let reses = []
  if (ctx.query.devicetype !== undefined) {
    reses = await Resource.find({}, treeField)
      .populate([
        {
          path: 'eid',
          select: 'name type ip cport dport manufacturer',
          match: {
            bigtype: ctx.query.devicetype
          }
        },
        {
          path: 'videoStructure.structureServer',
          select: 'ip port'
        }
      ])
      .sort('name')
      .lean()
      .exec()
  } else {
    reses = await Resource.find({ type: ctx.query.type }, treeField)
      .populate([
        {
          path: 'eid',
          select: 'name type ip cport dport manufacturer'
        },
        {
          path: 'videoStructure.structureServer',
          select: 'ip port'
        }
      ])
      .sort('name')
      .lean()
      .exec()
  }
  // 若是获取rtsp分配的树
  // if (Number(ctx.query.rtsp) === 0) {
  //   // 过滤已经存在rtsp的资源
  //   reses = reses.filter(res => !res.toObject().rtsp)
  // }
  // 集成数据权限
  if (ctx.state.user.role + '' !== '5be27279e74ee9376c681111') {
    const PropertyModel = require('mongoose').model('ResProperty')
    const authResArr = await PropertyModel.find({
      role: ctx.state.user.role,
      'properties.0': { $exists: true }
    })
      .lean()
      .exec()
    const authDataMap = {}
    authResArr.map(item => {
      authDataMap[item.resource + ''] = item.properties
    })
    reses = tool.integrationAuthData(authDataMap, reses)
  }
  const allResIds = _.map(reses, '_id').toString() // 所有的资源数据（这里是为了做查询过滤）
  reses.forEach(item => (resHash[item._id] = item))
  const temp = orgReses.filter(item => {
    return allResIds.indexOf(item.resource + '') !== -1
  })
  temp.forEach(item => {
    !orgResHash[item.org] && (orgResHash[item.org] = [])
    if (resHash[item.resource]) {
      orgResHash[item.org].push(resHash[item.resource])
    }
  })
  try {
    let mainRes, orgRes
    if (rid) {
      mainRes = await Resource.findById(rid).exec()
      orgRes = await OrgRes.findOne({
        resource: rid,
        islane: true
      }).exec()
    }
    const allOrgs = await Org.find(
      {
        _id: {
          $in: allChildrenIds
        }
      },
      '_id pid name'
    )
      .sort({ order: -1 })
      .exec()
    const tempArr = new Array(allOrgs.length)
    _.fill(tempArr, { _doc: { isOrg: true } })
    _.merge(allOrgs, tempArr)
    const resultRes = allOrgs.map(item => {
      item = item.toObject()
      item.children = orgResHash[item._id]
      // 剔除所有非allResIds的资源id
      if (orgRes && item._id + '' === '' + orgRes.org) {
        if (!item.children) {
          item.children = []
        }
        item.children.push(mainRes)
      }
      return item
    })
    ctx.body = tool.transData2Tree(resultRes, '_id', 'pid', true).pop()
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
/**
 * 获取抓拍管理机构资源树
 */
exports.getFaceTree = async ctx => {
  try {
    // 查询所有人像识别机构
    const orgs = await Org.find({ type: ORG_TYPE.FACE_CAPTURE }, 'name isroot pid').lean()
    const allOrgIds = orgs.map(item => item._id)
    const orgReses = await OrgRes.find({ islane: false, org: { $in: allOrgIds } }, 'org resource').lean()
    const allResIds = orgReses.map(item => item.resource + '') // 所有资源id
    const reses = await Resource.find({ _id: { $in: allResIds } }, 'name eid').lean()
    const resMap = {}
    reses.forEach(item => {
      resMap[item._id] = item
    })
    const orgResMap = {}
    orgReses.forEach(item => {
      !orgResMap[item.org] && (orgResMap[item.org] = [])
      if (resMap[item.resource]) {
        orgResMap[item.org].push(resMap[item.resource])
      }
    })
    const allOrgs = orgs.map(item => {
      item.isOrg = true
      item.children = orgResMap[item._id] || []
      return item
    })
    const tree = tool.transData2Tree(allOrgs, '_id', 'pid', true).pop()
    ctx.body = tree
  } catch (error) {
    tool.handleSysException(error)
  }
}
exports.getMultiTree = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取机构资源树'))
  try {
    const oid = ctx.query.oid
    let allChildrenIds = [] // 该机构的所有子机构
    const [allorg, rootorg] = await Promise.all([
      Org.find(
        {
          type: ctx.query.orgtype || ORG_TYPE.LOCALE
        },
        '_id name pid order'
      )
        .sort({ order: -1 })
        .exec(),
      Org.findOne({
        type: ctx.query.orgtype || ORG_TYPE.LOCALE,
        isroot: true
      }).exec()
    ])
    if (!oid) {
      allChildrenIds = tool.getChildren(allChildrenIds, allorg, rootorg._id)
      allChildrenIds.unshift(rootorg._id + '')
    } else {
      allChildrenIds = tool.getChildren(allChildrenIds, allorg, oid)
      allChildrenIds.unshift(oid)
    }
    let orgReses = await OrgRes.find(
      {
        islane: false,
        org: {
          $in: allChildrenIds
        }
      },
      'resource org'
    )
      .sort('name')
      .exec()
    const againOrgReses = await OrgRes.find(
      {
        islane: true,
        rootorg: rootorg._id
      },
      'resource org'
    ).exec()
    const newOrgReses = []
    let flag
    for (let i = 0; i < orgReses.length; i++) {
      flag = true
      for (let j = 0; j < againOrgReses.length; j++) {
        if (orgReses[i].resource + '' === '' + againOrgReses[j].resource) {
          flag = false
          break
        }
      }
      if (flag) {
        // 说明没有重复的resource（既islane true|false）, 即重复的数据不添加
        newOrgReses.push(orgReses[i])
      }
    }
    orgReses = newOrgReses
    const [orgResHash, resHash] = [{}, {}]
    const reses = await Resource.find({ type: { $in: ctx.query.types.split(',') } }, treeField)
      .populate({
        path: 'eid',
        select: 'name type ip cport dport manufacturer'
      })
      .sort('name')
      .exec()
    const allResIds = _.map(reses, '_id').toString() // 所有的资源数据（这里是为了做查询过滤）
    reses.forEach(item => (resHash[item._id] = item))
    const temp = orgReses.filter(item => {
      return allResIds.indexOf(item.resource + '') !== -1
    })
    temp.forEach(item => {
      !orgResHash[item.org] && (orgResHash[item.org] = [])
      if (resHash[item.resource]) {
        orgResHash[item.org].push(resHash[item.resource])
      }
    })
    const allOrgs = await Org.find(
      {
        _id: {
          $in: allChildrenIds
        }
      },
      '_id pid name'
    )
      .sort({ order: -1 })
      .exec()
    const tempArr = new Array(allOrgs.length)
    _.fill(tempArr, { _doc: { isOrg: true } })
    _.merge(allOrgs, tempArr)
    const resultRes = allOrgs.map(item => {
      item = item.toObject()
      item.children = orgResHash[item._id]
      return item
    })
    ctx.body = tool.transData2Tree(resultRes, '_id', 'pid', true).pop()
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 获取配置联动视频的树
exports.getResTreeOfAlarmLink = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取配置联动视频的树(联动模块使用)'))
  try {
    const oid = ctx.query.oid
    const orgType = ctx.query.orgtype || ORG_TYPE.LOCALE
    const resourceType = ctx.query.channelTypes.split(',')

    const resourceId = ctx.query.resId
    const orgResHash = {}
    const resHash = {}
    let linkResIds = []

    let allChildrenIds = [] // 该机构的所有子机构

    const [orgs, { _id: rootId }, reses, alarmCfg] = await Promise.all([
      Org.find({ type: orgType }, '_id name isroot pid order')
        .sort({ order: -1 })
        .lean()
        .exec(),
      Org.findOne({ type: ORG_TYPE.LOCALE, isroot: true }, '_id')
        .lean()
        .exec(),
      Resource.find({ type: { $in: resourceType } }, 'chan name monitortype status stream point eid type')
        .populate({ path: 'eid', select: 'name ip cport dport manufacturer' })
        .sort('name')
        .lean()
        .exec(),
      AlarmCfg.findOne({ resource: resourceId }, 'actionVideo actionOutCtl')
        .lean()
        .exec()
    ])
    if (ctx.query.never === '-1') {
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, oid || rootId)
    }
    allChildrenIds.unshift(oid || rootId)
    const orgReses = await OrgRes.find(
      {
        islane: false,
        org: {
          $in: allChildrenIds
        }
      },
      'resource org'
    )
      .lean()
      .exec()
    const allResIdsStr = _.map(reses, '_id').toString() // 所有的资源数据（这里是为了做查询过滤）
    reses.forEach(item => (resHash[item._id] = item))
    const temp = orgReses.filter(item => {
      // 过滤资源和资源机构关系的集合
      return allResIdsStr.indexOf(item.resource.toString()) !== -1
    })
    // 如果配置过联动视频或者是联动报警输出
    if (alarmCfg) {
      if (alarmCfg.actionVideo.length) {
        const arr = alarmCfg.actionVideo.map(item => item.resource.toString())
        linkResIds = linkResIds.concat(arr)
      }
      if (alarmCfg.actionOutCtl.length) {
        const arr = alarmCfg.actionOutCtl.map(item => item.resource.toString())
        linkResIds = linkResIds.concat(arr)
      }
    }
    // 过滤联动资源和资源机构关系的集合(二次过滤)
    const temp2 = temp.filter(item => !linkResIds.includes(item.resource.toString()))
    temp2.forEach(item => {
      !orgResHash[item.org] && (orgResHash[item.org] = [])
      if (resHash[item.resource]) {
        orgResHash[item.org].push(resHash[item.resource])
      }
    })
    const allOrgs = orgs.filter(org => allChildrenIds.includes(org._id.toString()))
    allOrgs.forEach(org => {
      org = Object.assign(org, { isOrg: true })
    })
    let resultRes = allOrgs.map(item => {
      item.children = orgResHash[item._id]
      return item
    })
    resultRes = tool.deleteNoChildrenOrgs(resultRes)
    const data = tool.transData2Tree(resultRes, '_id', 'pid', true).pop()
    ctx.body = data
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

exports.getResTreeOfFireLink = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取配置联动视频的树(联动模块使用)'))
  try {
    const oid = ctx.query.oid
    let allChildrenIds = [] // 该机构的所有子机构
    const allorg = await Org.find({ type: ctx.query.orgtype || ORG_TYPE.LOCALE }, '_id name pid order')
      .sort('order')
      .exec()
    const { _id: rootId } = await Org.findOne({ type: ORG_TYPE.LOCALE, isroot: true }, '_id')
      .lean()
      .exec()
    if (ctx.query.never === '-1') {
      allChildrenIds = tool.getChildren(allChildrenIds, allorg, oid || rootId)
    }
    allChildrenIds.unshift(oid || rootId)
    const orgReses = await OrgRes.find(
      {
        islane: false,
        org: {
          $in: allChildrenIds
        }
      },
      'resource org'
    )
      .sort('name')
      .exec()
    const [orgResHash, resHash] = [{}, {}]
    const reses = await Resource.find(
      { type: { $in: ctx.query.channelTypes.split(',') } },
      'chan name monitortype status stream point eid'
    )
      .populate({ path: 'eid', select: 'name ip cport dport manufacturer' })
      .sort('name')
      .exec()
    const allResIdsStr = _.map(reses, '_id').toString() // 所有的资源数据（这里是为了做查询过滤）
    reses.forEach(item => (resHash[item._id] = item))
    const temp = orgReses.filter(item => {
      // 过滤资源和资源机构关系的集合
      return allResIdsStr.indexOf(item.resource + '') !== -1
    })
    // const fireCfgs = await FireCfg.find({}, 'actionVideo actionOutCtl').exec()
    // // 获取已配置联动资源的id字符串，用于过滤
    // const linkResStr = fireCfgs && fireCfgs.map(fireCfg => {
    //   if (fireCfg.actionVideo.length) {
    //     // 返回单个监控点配置的不重复的资源id字符串
    //     return [...new Set(fireCfg.actionVideo.map(item => item.resource + ''))].toString() // 返回资源数组后进行连接，再过滤
    //   }
    // }).join(',')
    const fireCfg = await FireCfg.findOne({ resource: ctx.query.resId }, 'actionVideo')
      .lean()
      .exec()
    let linkResStr
    if (fireCfg) {
      linkResStr = fireCfg.actionVideo.length
        ? [...new Set(fireCfg.actionVideo.map(item => item.resource + ''))].join(',')
        : ''
    } else {
      linkResStr = ''
    }
    const temp2 = temp.filter(item => {
      // 过滤联动资源和资源机构关系的集合(二次过滤)
      return linkResStr.indexOf(item.resource + '') === -1
    })
    temp2.forEach(item => {
      !orgResHash[item.org] && (orgResHash[item.org] = [])
      if (resHash[item.resource]) {
        orgResHash[item.org].push(resHash[item.resource])
      }
    })
    const allOrgs = await Org.find(
      {
        _id: {
          $in: allChildrenIds
        }
      },
      '_id pid name'
    )
      .sort({ order: -1 })
      .lean()
      .exec()
    const orgArr = new Array(allOrgs.length)
    _.fill(orgArr, { isOrg: true })
    _.merge(allOrgs, orgArr)
    const resultRes = allOrgs.map(item => {
      item.children = orgResHash[item._id]
      return item
    })
    ctx.body = tool.transData2Tree(resultRes, '_id', 'pid', true).pop()
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 获取地图报警树
exports.getMapAlarmHelpTree = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取地图报警求助'))
  try {
    const storeyId = ctx.query.storeyId
    const query = {}
    const alarmBoxs = await Device.find({ type: { $in: 'alarmBox' } }, '_id')
      .lean()
      .exec()
    const alarmPillars = await Device.find({ type: { $in: 'alarmPillar' } }, '_id')
      .lean()
      .exec()
    query.eid = { $in: [...alarmBoxs.map(item => item._id), ...alarmPillars.map(item => item._id)] }
    let select
    if (ctx.query.mapType === '3D') {
      select = 'chan type name eid status alarmintype alarmtemplate maxdelaytime monitortype minintervaltime point3D'
    } else {
      select = 'chan type name eid status alarmintype alarmtemplate maxdelaytime monitortype minintervaltime point'
    }
    if (storeyId) {
      if (ctx.query.mapType === '3D') {
        query.$or = [{ 'point3D.sid': storeyId }, { point3D: { $exists: false } }]
      } else {
        query.$or = [{ 'point.sid': storeyId }, { point: { $exists: false } }]
      }
    } else {
      if (ctx.query.mapType === '3D') {
        query.$or = [{ 'point3D.isouter': true }, { point3D: { $exists: false } }]
      } else {
        query.$or = [{ 'point.isouter': true }, { point: { $exists: false } }]
      }
    }
    const reses = await Resource.find(query, select)
      .populate({
        path: 'eid',
        select: 'name ip cport type dport manufacturer'
      })
      .lean()
      .exec()
    const root = await Org.findOne({ isroot: true, type: ORG_TYPE.LOCALE }).exec()
    const result = {
      _id: root._id || '1',
      name: root.name || '根节点',
      isOrg: true,
      children: [
        {
          _id: 2,
          name: '报警柱',
          isOrg: true,
          pid: root._id,
          children: reses.filter(res => alarmPillars.map(item => item._id + '').includes(res.eid._id + ''))
        },
        {
          _id: 3,
          name: '报警箱',
          isOrg: true,
          pid: root._id,
          children: reses.filter(res => alarmBoxs.map(item => item._id + '').includes(res.eid._id + ''))
        }
      ]
    }
    ctx.body = result
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 机构>视频资源，视频报警资源树，地图模块树使用(用于获取多种类型资源)(已分配)
exports.getMapMultiResourceTree = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-视频资源，视频报警资源树'))
  try {
    const oid = ctx.query.oid
    const storeyId = ctx.query.storeyId
    const channelTypes = ctx.query.channelTypes
    const mapType = ctx.query.mapType
    const mapId = ctx.query.mapId // 地图标识
    let allChildrenIds = [] // 该机构的所有子机构
    const [allorg, rootorg] = await Promise.all([
      Org.find(
        {
          type: ctx.query.orgtype || ORG_TYPE.LOCALE
        },
        '_id name pid order'
      ).exec(),
      Org.findOne({
        type: ctx.query.orgtype || ORG_TYPE.LOCALE,
        isroot: true
      }).exec()
    ])
    if (!oid) {
      allChildrenIds = tool.getChildren(allChildrenIds, allorg, rootorg._id)
      allChildrenIds.unshift(rootorg._id + '')
    } else {
      allChildrenIds = tool.getChildren(allChildrenIds, allorg, oid)
      allChildrenIds.unshift(oid)
    }
    let orgReses = await OrgRes.find(
      {
        islane: false,
        org: {
          $in: allChildrenIds
        }
      },
      'resource org'
    )
      .sort('name')
      .exec()
    const againOrgReses = await OrgRes.find(
      {
        islane: true,
        rootorg: rootorg._id
      },
      'resource org'
    ).exec()
    const newOrgReses = []
    let flag
    for (let i = 0; i < orgReses.length; i++) {
      flag = true
      for (let j = 0; j < againOrgReses.length; j++) {
        if (orgReses[i].resource + '' === '' + againOrgReses[j].resource) {
          flag = false
          break
        }
      }
      if (flag) {
        // 说明没有重复的resource（既islane true|false）, 即重复的数据不添加
        newOrgReses.push(orgReses[i])
      }
    }
    orgReses = newOrgReses
    const [orgResHash, resHash] = [{}, {}]
    let query = { type: { $in: channelTypes.split(',') } }
    let select
    if (mapType === '3D') {
      select =
        'chan type name stream eid status alarmintype alarmtemplate maxdelaytime monitoryPointGenera monitortype minintervaltime point3D nodeId gbPlaDevIp gbPlaDevPort gbDevId gbParentDevId gbPlaNvrId shareServer'
    } else {
      select =
        'chan type name stream eid status alarmintype alarmtemplate maxdelaytime monitoryPointGenera monitortype minintervaltime point nodeId gbPlaDevIp gbPlaDevPort gbDevId gbParentDevId gbPlaNvrId shareServer'
    }
    if (mapType === '2D' && mapId) {
      // 查询2D指定地图标识的资源
      query = Object.assign(query, { point: { $exists: true }, 'point.mapId': mapId })
    } else {
      if (storeyId) {
        if (mapType === '3D') {
          query.$or = [{ 'point3D.sid': storeyId }, { point3D: { $exists: false } }]
        } else {
          query.$or = [{ 'point.sid': storeyId }, { point: { $exists: false } }]
        }
      } else {
        if (mapType === '3D') {
          query.$or = [{ 'point3D.isouter': true }, { point3D: { $exists: false } }]
        } else {
          query.$or = [{ 'point.isouter': true }, { point: { $exists: false } }]
        }
      }
    }
    // 过滤报警求助的针孔摄像头
    const devs = await Device.find({ type: { $nin: ['alarmBox', 'alarmPillar'] } }, '_id')
      .lean()
      .exec()
    devs && devs.length && (query.eid = { $in: devs.map(dev => dev._id) })
    let reses = await Resource.find(query, select)
      .populate({
        path: 'eid',
        select: 'name ip cport type dport manufacturer'
      })
      .exec()
    // 根据当前登录的角色所拥有的资源权限过滤资源
    const roleId = ctx.state.user.role
    if (roleId !== '5be27279e74ee9376c681111') {
      const role = await Role.findById(roleId, 'resources')
        .lean()
        .exec()
      if (role && role.resources.length) {
        const resourceIds = role.resources.map(item => item + '')
        reses = reses.filter(item => resourceIds.includes(item._id + ''))
      }
    }
    const allResIds = _.map(reses, '_id').toString() // 所有的资源数据（这里是为了做查询过滤）
    reses.forEach(item => (resHash[item._id] = item))
    const temp = orgReses.filter(item => {
      return allResIds.indexOf(item.resource + '') !== -1
    })
    temp.forEach(item => {
      !orgResHash[item.org] && (orgResHash[item.org] = [])
      if (resHash[item.resource]) {
        orgResHash[item.org].push(resHash[item.resource])
      }
    })
    const allOrgs = await Org.find(
      {
        _id: {
          $in: allChildrenIds
        }
      },
      '_id pid name'
    )
      .sort({ order: -1 })
      .lean()
      .exec()
    const tempArr = new Array(allOrgs.length)
    _.fill(tempArr, { isOrg: true })
    _.merge(allOrgs, tempArr)
    const resultRes = allOrgs.map(item => {
      item.children = orgResHash[item._id] // 剔除所有非allResIds的资源id
      return item
    })
    ctx.body = tool.transData2Tree(resultRes, '_id', 'pid', true).pop()
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 获取地图输入防区树
exports.getMapFireAlarmInTree = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取地图输入防区树'))
  try {
    const oid = ctx.query.oid
    const rid = ctx.query.rid
    const storeyId = ctx.query.storeyId
    delete ctx.query.rid
    let allChildrenIds = [] // 该机构的所有子机构
    const [allorg, rootorg] = await Promise.all([
      Org.find(
        {
          type: ctx.query.orgtype || ORG_TYPE.LOCALE
        },
        '_id name pid order'
      ).exec(),
      Org.findOne({
        type: ctx.query.orgtype || ORG_TYPE.LOCALE,
        isroot: true
      }).exec()
    ])
    if (!oid) {
      allChildrenIds = tool.getChildren(allChildrenIds, allorg, rootorg._id + '')
      allChildrenIds.unshift(rootorg._id + '')
    } else {
      allChildrenIds = tool.getChildren(allChildrenIds, allorg, oid)
      allChildrenIds.unshift(oid)
    }
    let orgReses = await OrgRes.find(
      {
        islane: false,
        org: {
          $in: allChildrenIds
        }
      },
      'resource org'
    )
      .sort('name')
      .exec()
    const againOrgReses = await OrgRes.find(
      {
        islane: true,
        rootorg: rootorg._id
      },
      'resource org'
    ).exec()
    const newOrgReses = []
    let flag
    for (let i = 0; i < orgReses.length; i++) {
      flag = true
      for (let j = 0; j < againOrgReses.length; j++) {
        if (orgReses[i].resource + '' === '' + againOrgReses[j].resource) {
          flag = false
          break
        }
      }
      if (flag) {
        // 说明没有重复的resource（既islane true|false）, 即重复的数据不添加
        newOrgReses.push(orgReses[i])
      }
    }
    orgReses = newOrgReses
    const [orgResHash, resHash] = [{}, {}]
    const query = { type: { $in: ctx.query.channelTypes.split(',') } }
    let select
    if (ctx.query.mapType === '3D') {
      select = 'chan type name eid status alarmintype mapsign alarmtemplate maxdelaytime minintervaltime point3D'
    } else {
      select = 'chan type name eid status alarmintype mapsign alarmtemplate maxdelaytime minintervaltime point'
    }
    if (storeyId) {
      if (ctx.query.mapType === '3D') {
        query.$or = [{ 'point3D.sid': storeyId }, { point3D: { $exists: false } }]
      } else {
        query.$or = [{ 'point.sid': storeyId }, { point: { $exists: false } }]
      }
    } else {
      if (ctx.query.mapType === '3D') {
        query.$or = [{ 'point3D.isouter': true }, { point3D: { $exists: false } }]
      } else {
        query.$or = [{ 'point.isouter': true }, { point: { $exists: false } }]
      }
    }
    const res = await Resource.find(query, select)
      .populate({
        path: 'eid',
        select: 'name ip cport type dport manufacturer'
      })
      .exec()
    const reses = res.filter(item => {
      return _.get(item, 'eid') === null || (item.eid.type !== 'alarmBox' && item.eid.type !== 'alarmPillar')
    })
    const allResIds = _.map(reses, '_id').toString() // 所有的资源数据（这里是为了做查询过滤）
    reses.forEach(item => (resHash[item._id] = item))
    const temp = orgReses.filter(item => {
      return allResIds.indexOf(item.resource + '') !== -1
    })
    temp.forEach(item => {
      !orgResHash[item.org] && (orgResHash[item.org] = [])
      if (resHash[item.resource]) {
        orgResHash[item.org].push(resHash[item.resource])
      }
    })
    let mainRes, orgRes
    if (rid) {
      mainRes = await Resource.findById(rid).exec()
      orgRes = await OrgRes.findOne({
        resource: rid,
        islane: true
      }).exec()
    }
    const allOrgs = await Org.find(
      {
        _id: {
          $in: allChildrenIds
        }
      },
      '_id pid name'
    )
      .sort({ order: -1 })
      .exec()
    const tempArr = new Array(allOrgs.length)
    _.fill(tempArr, { _doc: { isOrg: true } })
    _.merge(allOrgs, tempArr)
    const resultRes = allOrgs.map(item => {
      item = item.toObject()
      item.children = orgResHash[item._id] // 剔除所有非allResIds的资源id
      if (orgRes && item._id + '' === '' + orgRes.org) {
        if (!item.children) {
          item.children = []
        }
        item.children.push(mainRes)
      }
      return item
    })
    ctx.body = tool.transData2Tree(resultRes, '_id', 'pid', true).pop()
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
/**
 * 获取防区资源列表
 */
exports.getMapFireAlarmListByMapId = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-获取地图输入防区列表'))
  try {
    const mapId = ctx.query.mapId
    const query = { type: { $in: ctx.query.channelTypes.split(',') } }
    let select
    if (ctx.query.mapType === '3D') {
      query.map3d = { $nin: [null, undefined] }
      select =
        'chan name monitortype status eid alarmintype alarmtemplate maxdelaytime minintervaltime mapsign alarmaffirm point3D'
    } else {
      query['point.mapId'] = mapId
      query['point.bid'] = null
      query['point.sid'] = null
      select =
        'chan name monitortype status eid alarmintype alarmtemplate maxdelaytime minintervaltime mapsign alarmaffirm point'
    }
    const reses = await Resource.find(query, select)
      .populate([
        {
          path: 'eid',
          select: 'name ip cport manufacturer'
        },
        {
          path: 'point.mid'
        }
      ])
      .exec()
    ctx.body = reses
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 新增资源
exports.addOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-添加资源'))
    const device = await Device.findById(ctx.request.body.eid, 'ip status cport manufacturer')
      .populate({ path: 'oid' })
      .lean()
    if (ctx.request.body.devloop === 0) {
      const count = await Resource.countDocuments({
        eid: ctx.request.body.eid,
        devloop: ctx.request.body.devloop,
        chan: ctx.request.body.chan
      })
      if (count !== 0) {
        return ctx.throw(500, { code: 1012, message: '该设备回路下防区编号已存在' })
      }
    } else if (ctx.request.body.devloop) {
      const count = await Resource.countDocuments({
        eid: ctx.request.body.eid,
        devloop: ctx.request.body.devloop,
        chan: ctx.request.body.chan
      })
      if (count !== 0) {
        return ctx.throw(500, { code: 1012, message: '该设备回路下防区编号已存在' })
      }
    }
    if (Number(ctx.request.body.type) === RES_TYPE.VIDEO) {
      const id = rtspServer.getUnusedIds()
      ctx.request.body.rtsp = {
        main: `rtsp://ip:port/main/id=${id}`,
        sub: `rtsp://ip:port/sub/id=${id}`
      }
      // 视频通道增加国标字段
      await generateNum.res([ctx.request.body], device.oid.gbDevId)
    }
    ctx.request.body.pinyin = tool.transferPinyin(ctx.request.body.name)
    ctx.request.body.ip = device.ip
    ctx.request.body.port = device.cport
    ctx.request.body.status = device.status ? 1 : 0
    const res = await Resource.create(ctx.request.body)
    if (ctx.request.body.type !== 11) {
      postal.publish({
        channel: 'devices',
        topic: 'item.notice',
        data: {
          ctx: ctx
        }
      })
    }
    // 如果增加消防主机输入防区，向北京发送通知,向orgres表里添加数据
    if (ctx.request.body.type === 11) {
      // 向orgres表里添加数据
      const orgresObj = {
        org: ctx.request.body.orgId,
        resource: res._id,
        rootorg: ctx.request.body.rootOrg
      }
      await OrgRes.create(orgresObj)
      const data = {
        module: 'firealarm',
        newData: [
          {
            devIp: device.ip,
            devPort: device.cport,
            vendor: device.manufacturer,
            type: 'add'
          }
        ],
        varyData: [
          {
            after: {
              slotNo: Number(ctx.request.body.devloop),
              zoneNo: ctx.request.body.chan
            }
          }
        ]
      }
      try {
        await fireAlarmChange({ ctx, data })
      } catch (err) {
        return ctx.throw(500, {
          code: 500,
          message: `请求第三方接口'/api/notice/info'异常`,
          type: 'sys'
        })
      }
    }

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
    ctx.status = 201
    ctx.body = [res._id]
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 资源机构解绑(实际资源不会删除，只删除机构和资源的关系)
exports.unbind = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-资源机构解绑'))
  if (_.isEmpty(ctx.query.type)) {
    ctx.throw(500, { code: 1015, message: '参数有误' })
  }
  const type = Number(ctx.query.type) // 机构类型
  try {
    const rootOrg = await Org.findOne({ type, isroot: true }).exec()
    if (_.isEmpty(rootOrg)) {
      return ctx.throw(500, { code: 1015, message: '参数有误' })
    }
    const ids = ctx.accept.headers['x-bsc-ids'].split(',')
    // 下联的资源通道不能删除
    if (ids.length) {
      const res = await Resource.findById(ids[0]).lean()
      if (res.nodeId) {
        ctx.throw(500, { code: 1015, message: '下联资源不能删除' })
      }
    }
    for (var item of ids) {
      if (_.isEmpty(item)) {
        return ctx.throw(500, { code: 1008, message: '参数不能为空' })
      }
      await OrgRes.deleteMany({
        rootorg: rootOrg._id,
        resource: item
      }).exec()
    }
    // 删除对应资源的actionConfig字段
    await Resource.updateMany({ _id: { $in: ids } }, { $unset: { actionConfig: 1 } })
    // if (rootOrg.type === 0) {
    //   // 删除国标数据
    //   await Resource.updateMany({ _id: { $in: ids } }, { $unset: { gbDevId: 1, gbParentDevId: 1 } })
    // }
    const resources = await Resource.find({ _id: { $in: ids } }).exec()
    if (type === ORG_TYPE.LOCALE) {
      postal.publish({
        channel: 'resources',
        topic: 'array.delete',
        data: {
          ctx,
          ids: resources.map(item => {
            if (item.type === RES_TYPE.VIDEO) {
              return item._id
            }
          })
        }
      })
    }
    postal.publish({
      channel: 'resources',
      topic: 'resource.unbind',
      data: {
        ids: resources.map(item => item._id),
        type
      }
    })

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
    await Resource.updateMany({ _id: { $in: ids } }, { $unset: { point: 1, point3D: 1 } })
    postal.publish({
      channel: 'resource',
      topic: 'org.update',
      data: {
        roleId: ctx.state.user.role
      }
    })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 资源机构解绑(实际资源不会删除，只删除机构和资源的关系,用于车辆)
exports.unbindVehicle = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-资源机构解绑'))
  const type = ctx.query.type // 机构类型
  try {
    const rootOrg = await Org.findOne({
      type: type || ORG_TYPE.LOCALE,
      isroot: true
    }).exec()
    if (_.isEmpty(rootOrg)) {
      return ctx.throw(500, { code: 1015, message: '参数有误' })
    }
    const ids = ctx.accept.headers['x-bsc-ids'].split(',')
    for (var item of ids) {
      if (_.isEmpty(item)) {
        return ctx.throw(500, { code: 1008, message: '参数不能为空' })
      }
      await OrgRes.deleteMany({
        rootorg: rootOrg._id,
        resource: item
      }).exec()
    }
    // const resources = await Resource.find({ _id: { $in: ids } }).exec()
    // postal.publish({
    //   channel: 'resources',
    //   topic: 'array.delete',
    //   data: {
    //     ctx,
    //     ids: resources.map(item => { if (item.type === 0) return item._id })
    //   }
    // })
    Resource.updateMany(
      { _id: { $in: ids } },
      { $unset: { channelid: 1, hasserver: 1, server: 1 } },
      { multi: true }
    ).then()
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 批量解绑
exports.unbindPatch = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-批量解绑'))
  const type = ctx.query.type // 机构类型
  try {
    const rootOrg = await Org.findOne({
      type: type,
      isroot: true
    }).exec()
    if (_.isEmpty(rootOrg)) {
      return ctx.throw(500, {
        code: 1015,
        message: '参数有误'
      })
    }
    const resIds = ctx.request.header['x-bsc-ids'].split(',') || []
    for (let i = 0; i < resIds.length; i++) {
      await OrgRes.deleteMany({
        rootorg: rootOrg._id,
        resource: resIds[i]
      }).exec()
    }
    postal.publish({
      channel: 'resources',
      topic: 'array.delete',
      data: {
        ids: resIds,
        isreal: false,
        ctx: ctx
      }
    })
    const resources = await Resource.find({ id: { $in: resIds } }).exec()
    // 删除视频资源的通知
    postal.publish({
      channel: 'devices',
      topic: 'item.deleteIPC',
      data: {
        resources
      }
    })
    postal.publish({
      channel: 'resource',
      topic: 'org.update',
      data: {
        roleId: ctx.state.user.role
      }
    })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 删除某个视频通道下的某个报警
exports.delAlarm = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-删除报警'))
    const id = ctx.params.id // 资源id、报警id
    const alarmType = ctx.query.alarmType // 报警类型(监控点报警：monitoryPointAlarm、智能报警：intelligentAlarm)
    const alarmIds = ctx.request.header['x-bsc-ids'].split(',') || [] // 报警ids
    if (!alarmType || !id) {
      return ctx.throw(500, {
        code: 1008,
        message: '参数不能为空'
      })
    }
    const res = await Resource.findById(id).exec()
    if (_.isEmpty(res)) {
      return ctx.throw(500, {
        code: 1014,
        message: '该资源不存在'
      })
    }
    const newAlarms = []
    if (res.alarm && res.alarm[alarmType]) {
      for (let i = 0; i < res.alarm[alarmType].length; i++) {
        if (alarmIds.indexOf(res.alarm[alarmType][i]._id + '') === -1) {
          newAlarms.push(res.alarm[alarmType][i])
        }
      }
      res.alarm[alarmType] = newAlarms
    }
    await res.save()
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx
      }
    })
    postal.publish({
      channel: 'resources',
      topic: 'intelligencealarm.delete',
      data: {
        ids: alarmIds,
        ctx: ctx
      }
    })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 修改报警
exports.updateAlarm = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-修改报警'))
  const { id, aid } = ctx.params // 资源id、报警id
  const alarmType = ctx.query.alarmType // 报警类型(监控点报警：monitoryPointAlarm、智能报警：intelligentAlarm)
  if (!alarmType || !id || !aid) {
    return ctx.throw(500, {
      code: 1015,
      message: '参数有误'
    })
  }
  try {
    const res = await Resource.findById(id).exec()
    if (_.isEmpty(res)) {
      return ctx.throw(500, {
        code: 1014,
        message: '该资源不存在'
      })
    }
    let matchedIndex = -1
    // let matchedAlarmIndex = -1
    let typeFlag = false
    let nameFlag = false
    if (_.isEmpty(res.alarm)) {
      ctx.status = 200
      return
    }
    for (let i = 0; i < res.alarm[alarmType].length; i++) {
      if ('' + res.alarm[alarmType][i]._id === '' + aid) {
        matchedIndex = i
      }
      if (
        '' + res.alarm[alarmType][i]._id !== '' + aid &&
        res.alarm[alarmType][i].type + '' === '' + ctx.request.body.type
      ) {
        typeFlag = true
      }
      if (
        '' + res.alarm[alarmType][i]._id !== '' + aid &&
        res.alarm[alarmType][i].name + '' === '' + ctx.request.body.name
      ) {
        nameFlag = true
      }
    }
    if (nameFlag) {
      return ctx.throw(500, { code: 1012, message: '该名称已存在' })
    }
    if (typeFlag) {
      return ctx.throw(500, {
        code: 1013,
        message: '该报警类型已存在'
      })
    }
    if (parseInt(matchedIndex) !== -1) {
      res.alarm[alarmType][matchedIndex] = _.merge(res.alarm[alarmType][matchedIndex], ctx.request.body)
    }
    await res.save()
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx
      }
    })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 给指定视频通道下添加某个报警
exports.addAlarm = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-添加报警'))
  const chan = ctx.params.chan // 资源id、报警id
  const alarmType = ctx.query.alarmType // 报警类型(监控点报警：monitoryPointAlarm、智能报警：intelligentAlarm)
  const eid = ctx.query.eid
  if (!alarmType || !chan) {
    return ctx.throw(500, {
      code: 1015,
      message: '参数有误'
    })
  }
  try {
    const res = await Resource.findOne({
      eid: eid,
      chan: chan,
      type: 0
    }).exec()
    if (_.isEmpty(res)) {
      return ctx.throw(500, {
        code: 1016,
        message: `资源通道不存在`
      })
    }
    if (_.isEmpty(res.alarm)) {
      res.alarm = []
      if (!res.alarm[alarmType]) {
        res.alarm[alarmType] = []
      }
    }
    let existedAlarm = ''
    let existedName = ''
    res.alarm[alarmType].forEach(item => {
      if (item.type + '' === ctx.request.body.type + '') {
        existedAlarm = ctx.request.body.type
      }
      if (item.name + '' === ctx.request.body.name + '') {
        existedName = ctx.request.body.name
      }
    })
    if (existedName) {
      return ctx.throw(500, {
        code: 1012,
        message: `该名称已存在`
      })
    }
    if (existedAlarm) {
      return ctx.throw(500, {
        code: 1013,
        message: `该报警类型已存在`
      })
    }
    res.alarm[alarmType].push(ctx.request.body)
    await res.save()
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx
      }
    })
    ctx.status = 201
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 通道名称同步（同步到中心）
exports.syncToCenter = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-同步到中心'))
    const ids = ctx.accept.headers['x-bsc-ids'].split(',')
    for (var item of ids) {
      if (!item) {
        return ctx.throw(500, {
          code: 1008,
          message: '参数不能为空'
        })
      }
      const resource = await Resource.findById(item, 'chan name eid')
        .populate({
          path: 'eid',
          select: 'cport ip'
        })
        .exec()
      if (!resource) {
        return ctx.throw(500, {
          code: -1,
          message: '该资源不存在'
        })
      }
      const data = {}
      if (resource.nodeId && resource.gbDevId) {
        data.devInfo = {
          devIp: resource.gbPlaDevIp,
          devPort: +resource.gbPlaDevPort
        }
      } else {
        data.devInfo = {
          devIp: resource.eid.ip,
          devPort: resource.eid.cport
        }
      }
      let result
      try {
        result = await getDevConf({ data, ctx })
      } catch (error) {
        return ctx.throw(500, { code: error.error, message: '请求第三方接口异常', type: 'sys' })
      }
      const ChanCfgPrmArr = result.ChanCfgPrmArr || []
      console.log(JSON.stringify(ChanCfgPrmArr))
      let resName = ''
      ChanCfgPrmArr.forEach(item => {
        if (item.channel && resource.chan && item.channel === resource.chan) {
          resName = item.name
        }
      })
      if (resName) {
        resource.name = resName // 本地化同步通道名
      }
      await resource.save()
    }
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx
      }
    })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 通道名称同步（同步到设备）
exports.syncToDevice = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('资源管理-同步到设备'))
    const ids = ctx.accept.headers['x-bsc-ids'].split(',')
    for (var item of ids) {
      if (!item) {
        return ctx.throw(500, {
          code: 1008,
          message: '参数不能为空'
        })
      }
      const resource = await Resource.findById(item, 'chan name eid')
        .populate({
          path: 'eid',
          select: 'cport ip name'
        })
        .exec()
      if (!resource) {
        return ctx.throw(500, {
          code: 1014,
          message: '该资源不存在'
        })
      }
      const data = {
        devCtl: {
          ChanCfgPrmArr: [
            {
              channel: resource.chan,
              name: resource.name.toString('utf8')
            }
          ],
          name: resource.eid.name
        }
      }
      if (resource.nodeId && resource.gbDevId) {
        data.devInfo = {
          devIp: resource.gbPlaDevIp,
          devPort: +resource.gbPlaDevPort
        }
      } else {
        data.devInfo = {
          devIp: resource.eid.ip,
          devPort: resource.eid.cport
        }
      }
      try {
        await updateDevConf({ data, ctx })
      } catch (error) {
        return ctx.throw(500, { code: error.error, message: '同步失败', type: 'sys' })
      }
    }
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 批量修改操作（现在主要用于批量修改实时码流字段）
exports.patchUpdate = async ctx => {
  ctx.set('loginfo', encodeURI('资源管理-批量修改资源某个属性'))
  const ids = ctx.request.header['x-bsc-ids'].split(',') || []
  const patchBody = ctx.request.body
  try {
    for (let i = 0; i < ids.length; i++) {
      await Resource.where({
        _id: ids[i]
      })
        .update(patchBody)
        .exec()
    }
    postal.publish({
      channel: 'devices',
      topic: 'item.notice',
      data: {
        ctx: ctx
      }
    })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
exports.addPatchFire = async ctx => {
  try {
    const fireInputNum = ctx.request.body.fireInputNum
    // const fireOutputNum = ctx.request.body.fireOutputNum
    const docs = []
    const count = ctx.request.body.chan
    if (fireInputNum) {
      delete ctx.request.body.fireInputNum
      for (var i = 1; i <= fireInputNum; i++) {
        const device = await Device.findById(ctx.request.body.eid).exec()
        docs.push({
          name: device.name + '_消防报警_' + ctx.request.body.devloop + '_' + (+count + i - 1),
          ip: device.ip,
          port: device.cport,
          chan: +count + i - 1,
          devloop: ctx.request.body.devloop,
          eid: ctx.request.body.eid,
          level: ctx.request.body.level,
          alarmtemplate: ctx.request.body.alarmtemplate,
          minintervaltime: ctx.request.body.minintervaltime,
          alarmaffirm: ctx.request.body.alarmaffirm,
          orgId: ctx.request.body.orgId,
          subtype: ctx.request.body.subtype,
          type: ctx.request.body.type
        })
      }
    }
    // if (fireOutputNum) {
    //   delete ctx.request.body.fireOutputNum
    //   for (var j = 1; j <= fireOutputNum; j++) {
    //     const device = await Device.findById(ctx.request.body.eid).exec()
    //     docs.push({
    //       name: device.name + '_输出防区_' + ctx.request.body.devloop + '_' + (+count + i - 1),
    //       ip: device.ip,
    //       port: device.port,
    //       chan: +count + j - 1,
    //       type: ctx.request.body.type,
    //       eid: ctx.request.body.eid,
    //       devloop: ctx.request.body.devloop,
    //       level: ctx.request.body.level,
    //       maxdelaytime: ctx.request.body.maxdelaytime,
    //       alarmtemplate: ctx.request.body.alarmtemplate,
    //       minintervaltime: ctx.request.body.minintervaltime,
    //       mapsign: ctx.request.body.mapsign,
    //       alarmaffirm: ctx.request.body.alarmaffirm
    //     })
    //   }
    // }
    for (var item of docs) {
      if (item.devloop === 0) {
        const count = await Resource.countDocuments({
          eid: item.eid,
          devloop: item.devloop,
          chan: item.chan
        })
        if (count !== 0) {
          return ctx.throw(500, {
            code: 1012,
            message: `设备回路${item.devloop}下防区编号${item.chan}已存在`
          })
        }
      } else if (item.devloop) {
        const count = await Resource.countDocuments({
          eid: item.eid,
          devloop: item.devloop,
          chan: item.chan
        })
        if (count !== 0) {
          return ctx.throw(500, {
            code: 1012,
            message: `设备回路${item.devloop}下防区编号${item.chan}已存在`
          })
        }
      }
    }
    const reses = await Resource.insertMany(docs)
    // 向orgres表里添加数据
    const orgresArr = []
    reses.forEach(item => {
      const obj = {
        resource: item._id,
        org: item.orgId,
        rootorg: ctx.request.body.rootOrg
      }
      orgresArr.push(obj)
    })
    await OrgRes.create(orgresArr)
    // 批量添加消防资源向北京发送通知
    const device = await Device.findById(docs[0].eid)
      .lean()
      .exec()
    const varyData = []
    reses.forEach(item => {
      const obj = {
        after: {
          slotNo: Number(item.devloop),
          zoneNo: item.chan
        }
      }
      varyData.push(obj)
    })
    const data = {
      module: 'firealarm',
      newData: [
        {
          devIp: device.ip,
          devPort: device.cport,
          vendor: device.manufacturer,
          type: 'create'
        }
      ],
      varyData: varyData
    }
    try {
      await fireAlarmChange({ ctx, data })
    } catch (err) {
      return ctx.throw(500, {
        code: 500,
        message: `请求第三方接口'/api/notice/info'异常`,
        type: 'sys'
      })
    }

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
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
// 资源信息导入
exports.resourceImport = async ctx => {
  try {
    const alarmTemplates = await AlarmTimeTemplate.find({}).lean()
    const tmpMap = {}
    alarmTemplates.forEach(item => {
      tmpMap[item.name] = item._id
    })
    const existRes = await Resource.find({ eid: ctx.query.eid, type: ctx.query.type }).lean()
    const existResMap = {}
    existRes.forEach(item => {
      existResMap[item.devloop + '_' + item.chan] = 1
    })
    const dev = await Device.findById(ctx.query.eid).lean()
    // 解析文件
    const resInfos = xlsx.parse(ctx.request.body.files.file.path)
    const docs = []
    // 获取资源信息的doc
    resInfos.forEach(item => {
      item.data.shift()
      item.data.forEach(item => {
        const res = {
          eid: ctx.query.eid,
          name: item[0],
          devloop: item[1],
          type: ctx.query.type,
          chan: item[2],
          level: item[3],
          alarmtemplate: tmpMap[item[4]],
          ip: dev.ip,
          port: dev.cport,
          maxdelaytime: item[5],
          minintervaltime: item[6]
        }
        if (!existResMap[res.devloop + '_' + res.chan]) {
          docs.push(res)
        }
      })
    })
    // 批量生产资源
    const createResource = await Resource.create(docs)
    if (createResource === undefined) {
      ctx.throw(500, { code: 1019, message: '重复数据' })
      return
    }
    fs.unlinkSync(ctx.request.body.files.file.path)
    if (Number(ctx.query.type) === 11) {
      const varyData = []
      docs.forEach(item => {
        const afterObj = {
          after: {
            slotNo: Number(item.devloop),
            zoneNo: item.chan
          }
        }
        varyData.push(afterObj)
      })
      const data = {
        module: 'firealarm',
        newData: [
          {
            devIp: dev.ip,
            devPort: dev.cport,
            vendor: dev.manufacturer,
            type: 'create'
          }
        ],
        varyData: varyData
      }
      try {
        await fireAlarmChange({ ctx, data })
      } catch (err) {
        return ctx.throw(500, {
          code: 500,
          message: `请求第三方接口'/api/notice/info'异常`,
          type: 'sys'
        })
      }
    }
    ctx.status = 200
  } catch (error) {
    tool.handleSysException(error)
  }
}

// 设备信息导出
exports.resourceExport = async ctx => {
  try {
    const alarmTemplates = await AlarmTimeTemplate.find({}).lean()
    const device = await Device.findById(ctx.query.eid, 'name').lean()
    const tmpMap = {}
    alarmTemplates.forEach(item => {
      tmpMap[item._id + ''] = item.name
    })
    const resMaping = {
      0: '视频通道',
      1: '视频报警输入',
      2: '视频报警输出通道',
      3: '对讲通道',
      4: '门禁通道',
      5: '解码通道',
      6: '音频通道',
      7: '解码报警输入',
      8: '解码报警输出',
      9: '报警主机报警输入',
      10: '报警主机报警输出',
      11: '消防输入防区',
      12: '消防输出防区',
      15: ' 拼接输入通道'
    }
    const reses = await Resource.find(
      { eid: ctx.query.eid, type: ctx.query.type },
      'name devloop chan level alarmtemplate maxdelaytime minintervaltime'
    ).exec()
    // 定义表头
    const data = [['输入防区名称', '设备回路', '通道号', '级别', '时间模板', '最大延时', '最小间隔']]
    reses.forEach(item => {
      const arr = [
        item.name,
        item.devloop,
        item.chan,
        item.level,
        tmpMap[item.alarmtemplate],
        item.maxdelaytime,
        item.minintervaltime
      ]
      data.push(arr)
    })
    // 设置列样式
    const ColInfos = [{ width: 15 }, {}, {}, {}, { width: 15 }, {}, {}]
    const option = { '!cols': ColInfos }
    const buffer = xlsx.build([{ name: resMaping[ctx.query.type], data }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
    ctx.attachment(device.name + '-' + resMaping[ctx.query.type] + '-' + timeStr + '.xlsx')
    ctx.body = buffer
  } catch (error) {
    tool.handleSysException(error)
  }
}
/**
 * 获取消防报警2.0
 */
exports.getFireAlarmList = async ctx => {
  try {
    const orginfo = await Org.findById(ctx.query.oid).exec()
    let allChildrenIds = [] // 该机构的所有子机构
    if (parseInt(ctx.query.never) === -1) {
      const orgs = await Org.find(
        {
          type: orginfo.type || ORG_TYPE.LOCALE
        },
        '_id name pid order'
      )
        .sort('order')
        .exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    }
    allChildrenIds.unshift(ctx.query.oid + '')
    let result = await OrgRes.find(
      {
        islane: false,
        org: {
          $in: allChildrenIds
        }
      },
      'resource -_id'
    ).exec()
    const _ids = _.map(result, 'resource')
    const query = { _id: { $in: _ids } }
    ctx.query.seek && (query.name = { $regex: ctx.query.seek || '' })
    if (ctx.query.config === '1') {
      query.actionConfig = { $exists: false }
    }
    query.type = { $in: [11, 12] }
    const datas = await paging.listQuery(
      Resource,
      query,
      '',
      '',
      ctx.query.page,
      { path: 'eid', select: 'name ip cport manufacturer' },
      ctx
    )
    ctx.body = datas.results
    // 刷新列表的时候向北京发送通知
    if (ctx.query.action === 'button') {
      const data = datas.results
      const varyData = []
      const newData = []
      const dids = []
      data.forEach(item => {
        const obj = {
          before: {
            slotNo: Number(item.devloop),
            zoneNo: item.chan
          },
          after: {
            slotNo: Number(item.devloop),
            zoneNo: item.chan
          }
        }
        varyData.push(obj)
        if (!dids.includes(item.eid._id)) {
          const obj = {
            devIp: item.eid.ip,
            devPort: item.eid.cport,
            vendor: item.eid.manufacturer,
            type: 'update'
          }
          dids.push(item.eid._id)
          newData.push(obj)
        }
      })
      const sendData = {
        module: 'firealarm',
        newData: newData,
        varyData: varyData
      }
      await fireAlarmChange({ ctx, sendData })
    }
  } catch (err) {
    tool.handleSysException(err)
  }
}
/**
 * 获取剩余报警输入数量
 */
exports.getFireAlarmCount = async ctx => {
  try {
    const id = ctx.query.did
    const fireHost = await Device.findById(id).lean()
    // 报警最大数量
    const maxCount = fireHost.alarmMaximumQuantity
    // 已经添加的报警输入的数量
    const count = await Resource.countDocuments({ eid: id, type: RES_TYPE.FIRE_ALARM_IN || 11 })
    ctx.body = maxCount - count
  } catch (err) {
    tool.handleSysException(err)
  }
}
/**
 * 报警管理页面获取所有报警数量
 */
exports.getAllAlarmCount = async ctx => {
  try {
    const oid = ctx.query.oid
    const [orgs, alarmInputs, alarmHosts, fireAlarms, alarmOutputs] = await Promise.all([
      Org.find({ type: ORG_TYPE.LOCALE }, 'name pid order')
        .lean()
        .exec(),
      Resource.find({ type: RES_TYPE.VIDEO_ALARM_IN }, '_id')
        .lean()
        .exec(),
      Resource.find({ type: RES_TYPE.ALARMHOST_ALARM_IN }, '_id')
        .lean()
        .exec(),
      Resource.find({ type: { $in: [RES_TYPE.FIRE_ALARM_IN, RES_TYPE.FIRE_ALARM_OUT] } }, '_id')
        .lean()
        .exec(),
      Resource.find({ type: { $in: [RES_TYPE.VIDEO_ALARM_OUT, RES_TYPE.ALARMHOST_ALARM_OUT] } }, '_id')
        .lean()
        .exec()
    ])
    // 获取该机构下所有子机构
    let allChildrenIds = []
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, oid)
    allChildrenIds.unshift(oid)
    // 查询智能交通数量
    const trafficServer = await Device.findOne({ bigtype: 8 })
      .lean()
      .exec()
    let ids = []
    const trafficServerId = trafficServer ? trafficServer._id : null
    const lane = await TrafficLane.find({ sid: trafficServerId }).lean()
    const org = []
    lane.map(item => {
      const deptIds = org.map(node => node._id)
      if (!deptIds.includes(item.deptId)) {
        if (item.deptParent === item.deptId) {
          org.push({ name: item.deptName, _id: item.deptId, pid: trafficServerId })
        } else {
          org.push({ name: item.deptName, _id: item.deptId, pid: item.deptParent })
        }
      }
    })
    ids = tool.getChildren(ids, org, trafficServerId)
    ids.unshift(trafficServerId)
    // 人像布控
    const faceOrgs = await Org.find({ type: 6 })
      .lean()
      .exec()
    const faceOrgIds = faceOrgs.map(item => item._id + '')
    const [faceResources, defenseTasks] = await Promise.all([
      OrgRes.find(
        {
          islane: false,
          org: {
            $in: faceOrgIds
          }
        },
        'resource'
      )
        .lean()
        .exec(),
      DefenseTask.find()
        .lean()
        .exec()
    ])
    // 已分配给人脸机构的资源id
    const _ids = faceResources.map(item => item.resource + '')
    let defenseResIds = []
    defenseTasks.forEach(item => {
      defenseResIds = defenseResIds.concat(item.points)
    })
    defenseResIds = defenseResIds.map(item => item + '')
    let faceFilterIds = _.intersection(_ids, defenseResIds)
    //  查询服务器绑定了多少视频资源
    const faceServers = await FaceServer.find().lean()
    let bindResIds = []
    faceServers.forEach(item => {
      bindResIds = bindResIds.concat(item.res)
    })
    for (let i in bindResIds) {
      bindResIds[i] = bindResIds[i] + ''
    }
    faceFilterIds = _.intersection(faceFilterIds, bindResIds)
    // 根据角色资源权限过滤数据
    const roleId = ctx.state.user.role
    let alarmHelpQuery = {}
    if (roleId !== ROLE_ID) {
      const resIds = await ResProperty.distinct('resource', {
        type: CONSTANT.ALARM_HELP,
        role: roleId,
        'properties.0': { $exists: true }
      })
      const resources = await Resource.find({ _id: { $in: resIds } }, 'eid')
        .lean()
        .exec()
      const devIds = resources.map(item => item.eid)
      alarmHelpQuery.camerDevId = { $in: devIds }
    }
    const [
      faceAlarmNo,
      trafficLaneNo,
      alarmClientNo,
      monitoryPointAlarmNo,
      intelligentAlarmNo,
      deviceAlarmNo
    ] = await Promise.all([
      Resource.countDocuments({ _id: { $in: faceFilterIds } }), // 人像布控
      TrafficLane.countDocuments({ deptId: { $in: ids } }), // 智能交通
      AlarmClient.countDocuments(alarmHelpQuery), // 查询报警求助数量
      MonitoryPointAlarm.countDocuments({ orgId: { $in: allChildrenIds } }), // 查询监控点报警数量
      IntelligentAlarm.countDocuments({ orgId: { $in: allChildrenIds } }), // 查询智能报警数量
      DeviceAlarm.countDocuments({ orgId: { $in: allChildrenIds } }) // 查询设备报警数量
    ])
    // 报警输入资源id
    let alarmInputIds = alarmInputs.map(item => item._id + '')
    // 根据当前角色拥有的资源权限过滤资源
    if (roleId !== ROLE_ID) {
      const roleId = ctx.state.user.role // 当前用户所属角色id
      let resIds = await ResProperty.distinct('resource', {
        role: roleId,
        type: CONSTANT.ALARM_INPUT,
        'properties.0': { $exists: true }
      })
      resIds = resIds.map(item => item + '')
      alarmInputIds = _.intersection(alarmInputIds, resIds)
    }
    // 报警主机资源id
    const alarmHostIds = alarmHosts.map(item => item._id + '')
    // 消防主机id
    const fireAlarmIds = fireAlarms.map(item => item._id + '')
    // 报警输出id
    const alarmOutputIds = alarmOutputs.map(item => item._id + '')
    const [alarmInputNo, alarmHostNo, fireAlarmNo, alarmOutputNo] = await Promise.all([
      OrgRes.countDocuments({ resource: { $in: alarmInputIds }, org: { $in: allChildrenIds } }), // 报警输入
      OrgRes.countDocuments({ resource: { $in: alarmHostIds }, org: { $in: allChildrenIds } }), // 报警主机
      OrgRes.countDocuments({ resource: { $in: fireAlarmIds }, org: { $in: allChildrenIds } }), // 消防防区
      // Resource.countDocuments({ orgId: { $in: allChildrenIds }, type: 11 }), // 消防主机
      OrgRes.countDocuments({ resource: { $in: alarmOutputIds }, org: { $in: allChildrenIds } }) // 报警输出
    ])
    const data = {
      faceAlarmNo,
      trafficLaneNo,
      alarmClientNo,
      monitoryPointAlarmNo,
      intelligentAlarmNo,
      deviceAlarmNo,
      alarmInputNo,
      alarmHostNo,
      fireAlarmNo,
      alarmOutputNo
    }
    ctx.body = data
  } catch (err) {
    tool.handleSysException(err)
  }
}
/**
 * 关键字搜索资源，用户管理-角色管理模块使用
 */
exports.searchResourceInUserManage = async ctx => {
  try {
    let devices
    let deviceIds
    const query = {}
    if (ctx.query.resType) {
      const typeArr = ctx.query.resType.split(',')
      for (let i in typeArr) {
        typeArr[i] = Number(typeArr[i])
      }
      query.type = { $in: typeArr }
    } else if (ctx.query.faceType === '1') {
      // 如果搜索的是人脸设备树
      // 查询所有人像识别机构
      const orgs = await Org.find({ type: ORG_TYPE.FACE_CAPTURE }, '_id').lean()
      const allOrgIds = orgs.map(item => item._id)
      const orgReses = await OrgRes.find({ islane: false, org: { $in: allOrgIds } }).lean()
      const allResIds = orgReses.map(item => item.resource) // 所有人脸资源id
      query._id = { $in: allResIds }
    } else {
      // 如果没有resType代表是搜索电视墙
      query.name = { $regex: ctx.query.seek }
      const walls = await Wall.find(query, 'name')
        .lean()
        .exec()
      ctx.body = walls
      return
    }
    query.name = { $regex: ctx.query.seek }
    // 如果是报警设备的树搜索，只搜索属于报警箱和报警柱的资源
    if (ctx.query.deviceType) {
      devices = await Device.find({ type: { $in: ['alarmBox', 'alarmPillar'] } }, '_id')
        .lean()
        .exec()
      deviceIds = devices.map(item => item._id + '')
      query.eid = { $in: deviceIds }
    }
    const resources = await Resource.find(query, 'name type eid')
      .lean()
      .exec()
    ctx.body = resources
  } catch (err) {
    tool.handleSysException(err)
  }
}

/**
 * 资源管理（视频通道&&报警求助设备）
 */
exports.resourceVideoExport = async ctx => {
  try {
    // 查找机构下的所有子机构
    const orginfo = await Org.findById(ctx.query.oid).exec()
    if (_.isEmpty(orginfo)) {
      return ctx.throw(500, {
        code: 1003,
        message: '该机构不存在'
      })
    }
    let allChildrenIds = []
    const orgs = await Org.find({ type: 0 }, '_id name pid order')
      .sort('order')
      .exec()
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    allChildrenIds.unshift(ctx.query.oid + '')
    // 根据当前角色拥有的资源权限过滤资源
    const roleId = ctx.state.user.role
    let selectMatch = { islane: false, org: { $in: allChildrenIds } }
    if (roleId !== '5be27279e74ee9376c681111') {
      let resIds = await ResProperty.distinct('resource', { role: roleId, 'properties.0': { $exists: true } })
      selectMatch.resource = { $in: resIds }
    }
    let result = await OrgRes.find(selectMatch, 'resource')
    let resourceIds = _.map(result, 'resource')
    let data
    let fieldNames = []
    let tableHeaderXlsx
    let devices
    let Reses
    // 设备大类：视频设备
    if (ctx.query.bigtype === '0') {
      // type 0:视频通道 2：报警求助设备
      if (ctx.query.type === '0') {
        // 查找机构下的所有设备
        devices = await Device.find({ bigtype: ctx.query.bigtype, type: { $nin: ['alarmBox', 'alarmPillar'] } }).exec()
        let devIds = devices.map(dev => dev._id)
        data = [
          ['通道名称', '所属设备', '设备IP', '通道号', '监控点类型', '实时码流', '预录', '延录', 'rtsp流地址', '状态']
        ]
        fieldNames = [
          'name',
          'eid',
          'ip',
          'chan',
          'monitortype',
          'stream',
          'isprerecord',
          'isdelayrecord',
          'rtsp',
          'status',
          'precord',
          'delayrecord'
        ]
        tableHeaderXlsx = '视频通道'
        // 查找所有视频设备下的资源
        Reses = await Resource.find(
          { eid: { $in: devIds }, _id: { $in: resourceIds }, type: ctx.query.type },
          fieldNames.join(' ')
        )
          .populate({ path: 'eid', select: 'name' })
          .exec()
      } else if (ctx.query.type === '2') {
        // 查找机构下的所有报警求助设备ip
        devices = await Device.find({ bigtype: ctx.query.bigtype, type: { $in: ['alarmBox', 'alarmPillar'] } }).exec()
        let devIds = devices.map(dev => dev._id)
        data = [['设备名称', '设备IP', '实时码流']]
        fieldNames = ['name', 'ip', 'stream']
        tableHeaderXlsx = '报警求助设备'
        // 查找报警求助设备下的资源
        Reses = await Resource.find({ eid: { $in: devIds }, _id: { $in: resourceIds } }, fieldNames.join(' ')).exec()
      }
      // 将资源Push到sheet
      Reses.forEach(item => {
        let arr = []
        fieldNames.forEach(val => {
          if (val === 'monitortype') {
            // 导出监控类型格式
            let monitortypeData
            if (item[val] === 0) {
              monitortypeData = '枪机'
            } else if (item[val] === 1) {
              monitortypeData = '红外枪机'
            } else if (item[val] === 2) {
              monitortypeData = '半球'
            } else if (item[val] === 3) {
              monitortypeData = '快球'
            } else if (item[val] === 4) {
              monitortypeData = '全景'
            }
            arr.push(monitortypeData)
          } else if (val === 'stream') {
            // 导出实时码流格式
            let streamData
            if (item[val] === 'main') {
              streamData = '主码流'
            } else if (item[val] === 'sub1') {
              streamData = '子码流'
            } else if (item[val] === 'sub2') {
              streamData = '第三码流'
            }
            arr.push(streamData)
          } else if (val === 'isprerecord') {
            // 导出预录格式
            let isprerecordData
            if (!item[val]) {
              isprerecordData = '未开启'
            } else {
              isprerecordData = item['precord']
            }
            arr.push(isprerecordData)
          } else if (val === 'isdelayrecord') {
            // 导出延录格式
            let isdelayrecordData
            if (!item[val]) {
              isdelayrecordData = '未开启'
            } else {
              isdelayrecordData = item['delayrecord']
            }
            arr.push(isdelayrecordData)
          } else if (val === 'rtsp') {
            // 导出rtsp流地址格式
            arr.push(item[val] ? item[val].main : '')
          } else if (val === 'status') {
            // 导出状态格式
            let statusData
            if (item[val] === 0) {
              statusData = '离线'
            } else {
              statusData = '在线'
            }
            arr.push(statusData)
          } else if (val === 'eid') {
            arr.push(item[val].name ? item[val].name : '')
          } else if (val !== 'precord' && val !== 'delayrecord') {
            arr.push(item[val])
          }
        })
        data.push(arr)
      })
    }
    // 设置列样式
    const ColInfos = [{ width: 25 }, { width: 30 }, { width: 15 }, {}, {}, {}, {}, {}, { width: 25 }, {}]
    const option = { '!cols': ColInfos }
    const buffer = xlsx.build([{ name: tableHeaderXlsx, data }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
    ctx.attachment(tableHeaderXlsx + '-' + timeStr + '.xlsx'.toString('utf8'))
    ctx.body = buffer
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}

// 修改所有资源的状态--测试，要删除
exports.modifystatus = async ctx => {
  try {
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
    console.time('test')
    await Resource.updateMany({ type: 0 }, { status: 0 }, { multi: false }).exec()
    await Device.updateMany({ bigtype: 0 }, { status: false }, { multi: false }).exec()
    console.timeEnd('test')
    console.log('11111111111111111111111111111111111')
    ctx.body = 'ok'
  } catch (err) {
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 1001, message: '系统内部错误' })
  }
}
