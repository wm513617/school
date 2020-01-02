/*
 * 设备接口
 * @Author: lushengying
 * @Date: 2018-08-17 14:48:21
 * @Last Modified by: dfk
 * @Last Modified time: 2019-08-08 13:05:35
 */

'use strict'

const mongoose = require('mongoose')
const Device = mongoose.model('Device')
const Resource = mongoose.model('Resource')
const Record = mongoose.model('Record')
const OrgRes = mongoose.model('OrgRes')
const Storage = mongoose.model('Storage')
const DeviceExtend = mongoose.model('DeviceExtend')
const alarmClient = mongoose.model('alarmClient')
const OperationLog = mongoose.model('OperationLog')
const opsConfig = mongoose.model('opsConfig')
const Org = mongoose.model('Org')
const xlsx = require('node-xlsx')
const moment = require('moment')
const paging = require('../../paging')
const _ = require('lodash')
const tool = require('../../../common/tools')
const Service = require('./videoDiagnosis/videoDiagnosis.service')
const service = new Service()
const { handleSysException, getChildren } = tool
const {
  serverSum,
  devState,
  devStateReal,
  syncOnlineRateList,
  serviceState,
  serviceStateReal,
  syncVideoRateList,
  syncVideoStatus,
  syncVideoStatusFeke,
  syncVideoStatusReal,
  ALLLog,
  ALLLogExport
} = require('./log')
// const { syncOnlineList } = require('../../bstar/dev.interface')
exports.getOpsIp = async ctx => {
  try {
    ctx.body = await opsConfig.find()
  } catch (err) {
    handleSysException(err)
  }
}

// 获取设备列表(是否显示子机构设备: query参数never)
exports.getAll = async ctx => {
  // type: 0 视频设备 对应Device bigtype 0
  // type: 1 消防设备 对应Device bigtype 1
  // type: 2 消防设备 对应Device bigtype 7
  // type: 3 解码器   对应Device bigtype 5
  // 4  平台服务 5 服务器
  const DEVTYPE = [0, 1, 7, 5]
  const CHECKType = [0, 1, 2, 3]
  const type = parseInt(ctx.query.bigtype)
  const SERVERTYPE = 4 // 服务器类型
  if (CHECKType.some(e => e === type)) {
    let allChildrenIds = []
    ctx.query.search.bigtype = DEVTYPE[type]
    if (ctx.query.oid && parseInt(ctx.query.never) === -1) {
      // 如果传入机构：oid
      const orgs = await Org.find(
        {
          type: 0
        },
        '_id name pid'
      )
        .sort('order')
        .exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
      allChildrenIds.unshift(ctx.query.oid + '')
      _.merge(ctx.query.search, {
        oid: {
          $in: allChildrenIds
        }
      })
    }

    if (ctx.query.OnlineRateStatus) {
      //  是否查询离线设备 同步离线设备信息
      // await syncOnlineRateList()
      if (ctx.query.search.OnlineRateStatus === '2') {
        ctx.query.search.OnlineRateStatus = { $in: [2, 3] }
      }
    } else {
      delete ctx.query.search.OnlineRateStatus
    }
    if (_.isEmpty(ctx.query.search.status)) {
      delete ctx.query.search.status
    }
    delete ctx.query.search.never
    delete ctx.query.search.seek
    if (ctx.query.seek.match(/\./)) {
      ctx.query.seek = ctx.query.seek.replace(/\./, '\\.')
    }
    let select = {
      $and: [ctx.query.search],
      $or: [
        {
          ip: {
            $regex: ctx.query.seek + '' || ''
          }
        },
        {
          name: {
            $regex: ctx.query.seek + '' || ''
          }
        }
      ]
    }

    const resultObj = await paging.listQuery(
      Device,
      select,
      'status bigtype type _id manufacturer createdAt name model intranetIp ip cport oid',
      'order',
      ctx.query.page,
      {
        path: 'oid',
        select: '_id name'
      },
      ctx
    )

    let results = await devState(resultObj.results) //  添加设备在线率

    ctx.body = {
      devList: results
    }
  } else if (type === SERVERTYPE) {
    let results = await serviceState(ctx)
    ctx.body = results
  } else {
    ctx.throw(500, { code: 2001, message: '参数非法' })
  }
}

exports.getAllreal = async ctx => {
  // type: 0 视频设备 对应Device bigtype 0
  // type: 1 消防设备 对应Device bigtype 1
  // type: 2 消防设备 对应Device bigtype 7
  // type: 3 解码器   对应Device bigtype 5
  // 4  平台服务 5 服务器
  const DEVTYPE = [0, 1, 7, 5]
  const CHECKType = [0, 1, 2, 3]
  const type = parseInt(ctx.query.bigtype)
  const SERVERTYPE = 4 // 服务器类型
  if (CHECKType.some(e => e === type)) {
    let allChildrenIds = []
    ctx.query.search.bigtype = DEVTYPE[type]
    if (ctx.query.oid && parseInt(ctx.query.never) === -1) {
      // 如果传入机构：oid
      const orgs = await Org.find(
        {
          type: 0
        },
        '_id name pid'
      )
        .sort('order')
        .exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
      allChildrenIds.unshift(ctx.query.oid + '')
      _.merge(ctx.query.search, {
        oid: {
          $in: allChildrenIds
        }
      })
    }

    if (ctx.query.OnlineRateStatus) {
      //  是否查询离线设备 同步离线设备信息
      await syncOnlineRateList()
      if (ctx.query.search.OnlineRateStatus === '2') {
        ctx.query.search.OnlineRateStatus = { $in: [2, 3] }
      }
    } else {
      delete ctx.query.search.OnlineRateStatus
    }
    if (_.isEmpty(ctx.query.search.status)) {
      delete ctx.query.search.status
    }
    delete ctx.query.search.never
    delete ctx.query.search.seek
    if (ctx.query.seek.match(/\./)) {
      ctx.query.seek = ctx.query.seek.replace(/\./, '\\.')
    }
    let select = {
      $and: [ctx.query.search],
      $or: [
        {
          ip: {
            $regex: ctx.query.seek + '' || ''
          }
        },
        {
          name: {
            $regex: ctx.query.seek + '' || ''
          }
        }
      ]
    }
    const resultObj = await paging.listQuery(
      Device,
      select,
      'status bigtype type _id manufacturer createdAt name model intranetIp ip cport oid',
      'order',
      ctx.query.page,
      {
        path: 'oid',
        select: '_id name'
      },
      ctx
    )

    let results = await devStateReal(resultObj.results) //  添加设备在线率

    ctx.body = {
      devList: results
    }
  } else if (type === SERVERTYPE) {
    let results = await serviceStateReal(ctx)
    ctx.body = results
  } else {
    ctx.throw(500, { code: 2001, message: '参数非法' })
  }
}
// 获取设备日志详情
exports.getDetails = async ctx => {
  // OperationLog.find(ctx.query)
  if (ctx.query.search.onlineRate) {
    _.merge(ctx.query.search, {
      'Log.type': ctx.query.search.onlineRate === '1' ? { $ne: 2 } : 2
    })
  }
  delete ctx.query.search.onlineRate
  delete ctx.query.search.seek

  const resultObj = await paging.listQuery(
    OperationLog,
    ctx.query.search,
    '',
    { createTime: -1 },
    ctx.query.page,
    '',
    ctx
  )
  ctx.body = resultObj.results
}

//  获取所有启用定时录像记录的视频资源
exports.video = async ctx => {
  const search = ctx.query.search
  const paganation = ctx.query.page
  const resIds = []
  let result = []
  try {
    // 获取视频类型通道
    let query = { type: 0 }
    if (!_.isEmpty(search.seek)) {
      search.seek = search.seek.replace(/\./g, '\\.')
      query = { $or: [{ name: { $regex: search.seek } }, { ip: { $regex: search.seek } }] }
    }
    if (search.RateStatus) {
      syncVideoRateList()
      if (search.RateStatus === '2') {
        search.RateStatus = {
          $in: [2, 3]
        }
      } else if (search.RateStatus === '1') {
        search.RateStatus = 1
      }
    } else {
      delete search.RateStatus
    }
    const orgId = search.org
    let org = []
    // 通过机构查找设备 (recursion=1查找当前节点及子节点|recursion=0查找当前节点)
    if (search.recursion === '1') {
      const orgs = await Org.find({ type: 0 }, 'name pid isroot')
        .lean()
        .sort('order')
        .exec()
      // org = getChildren(orgs, '_id', 'pid', orgId)
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
      const orgRes = await OrgRes.find({ org: { $in: org } })
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    } else if (search.recursion === '0') {
      const orgRes = await OrgRes.find({ org: orgId })
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    }
    // 视频通道资源
    query.type = 0
    if (search.server) {
      const stoRes = await Storage.find({ server: search.server }, 'resource')
      stoRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    } else {
      delete ctx.query.search.server
    }
    // 是否在线
    if (search.status) {
      query.status = parseInt(ctx.query.status)
    } else {
      delete search.status
    }
    const resIdsData = await Resource.find(_.assign({ _id: { $in: resIds } }, query), '_id')
    let resId = []
    resIdsData.forEach(item => {
      item._id && resId.push(item._id + '')
    })
    delete search.org
    delete search.recursion
    delete search.seek
    delete search.status

    result = await paging.listQuery(
      Record,
      {
        $and: [search],
        resource: { $in: resId },
        takeType: 'timeVideo',
        enable: 'enable'
      },
      '_id takeType enable streamType planTemplateId resource',
      {},
      paganation,
      [
        {
          path: 'resource',
          select: '_id name chan ip port status'
        },
        {
          path: 'planTemplateId',
          select: '_id name elements'
        }
      ],
      ctx
    )
    // ctx.body = result.results
    ctx.body = await syncVideoStatusFeke(JSON.parse(JSON.stringify(result.results)))
  } catch (err) {
    handleSysException(err, 4107)
  }
}

// 定时录像假数据接口
exports.videoFeke = async ctx => {
  const search = ctx.query.search
  const paganation = ctx.query.page
  const resIds = []
  let result = []
  try {
    // 获取视频类型通道
    let query = { type: 0 }
    if (!_.isEmpty(search.seek)) {
      search.seek = search.seek.replace(/\./g, '\\.')
      query = { $or: [{ name: { $regex: search.seek } }, { ip: { $regex: search.seek } }] }
    }
    if (search.RateStatus) {
      syncVideoRateList()
      if (search.RateStatus === '2') {
        search.RateStatus = {
          $in: [2, 3]
        }
      } else if (search.RateStatus === '1') {
        search.RateStatus = 1
      }
    } else {
      delete search.RateStatus
    }
    const orgId = search.org
    let org = []
    // 通过机构查找设备 (recursion=1查找当前节点及子节点|recursion=0查找当前节点)
    if (search.recursion === '1') {
      const orgs = await Org.find({ type: 0 }, 'name pid isroot')
        .lean()
        .sort('order')
        .exec()
      // org = getChildren(orgs, '_id', 'pid', orgId)
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
      const orgRes = await OrgRes.find({ org: { $in: org } })
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    } else if (search.recursion === '0') {
      const orgRes = await OrgRes.find({ org: orgId })
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    }
    // 视频通道资源
    query.type = 0
    if (search.server) {
      const stoRes = await Storage.find({ server: search.server }, 'resource')
      stoRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    } else {
      delete ctx.query.search.server
    }
    // 是否在线
    if (search.status) {
      query.status = parseInt(ctx.query.status)
    } else {
      delete search.status
    }
    const resIdsData = await Resource.find(_.assign({ _id: { $in: resIds } }, query), '_id')
    let resId = []
    resIdsData.forEach(item => {
      item._id && resId.push(item._id + '')
    })
    delete search.org
    delete search.recursion
    delete search.seek
    delete search.status

    result = await paging.listQuery(
      Record,
      {
        $and: [search],
        resource: { $in: resId },
        takeType: 'timeVideo',
        enable: 'enable'
      },
      '_id takeType enable streamType planTemplateId resource',
      {},
      paganation,
      [
        {
          path: 'resource',
          select: '_id name chan ip port status'
        },
        {
          path: 'planTemplateId',
          select: '_id name elements'
        }
      ],
      ctx
    )
    // ctx.body = result.results
    ctx.body = await syncVideoStatusFeke(JSON.parse(JSON.stringify(result.results)))
  } catch (err) {
    handleSysException(err, 4107)
  }
}
exports.videoFekeReal = async ctx => {
  const search = ctx.query.search
  const paganation = ctx.query.page
  const resIds = []
  let result = []
  try {
    // 获取视频类型通道
    let query = { type: 0 }
    if (!_.isEmpty(search.seek)) {
      search.seek = search.seek.replace(/\./g, '\\.')
      query = { $or: [{ name: { $regex: search.seek } }, { ip: { $regex: search.seek } }] }
    }
    if (search.RateStatus) {
      syncVideoRateList()
      if (search.RateStatus === '2') {
        search.RateStatus = {
          $in: [2, 3]
        }
      } else if (search.RateStatus === '1') {
        search.RateStatus = 1
      }
    } else {
      delete search.RateStatus
    }
    const orgId = search.org
    let org = []
    // 通过机构查找设备 (recursion=1查找当前节点及子节点|recursion=0查找当前节点)
    if (search.recursion === '1') {
      const orgs = await Org.find({ type: 0 }, 'name pid isroot')
        .lean()
        .sort('order')
        .exec()
      // org = getChildren(orgs, '_id', 'pid', orgId)
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
      const orgRes = await OrgRes.find({ org: { $in: org } })
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    } else if (search.recursion === '0') {
      const orgRes = await OrgRes.find({ org: orgId })
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    }
    // 视频通道资源
    query.type = 0
    if (search.server) {
      const stoRes = await Storage.find({ server: search.server }, 'resource')
      stoRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    } else {
      delete ctx.query.search.server
    }
    // 是否在线
    if (search.status) {
      query.status = parseInt(ctx.query.status)
    } else {
      delete search.status
    }
    const resIdsData = await Resource.find(_.assign({ _id: { $in: resIds } }, query), '_id')
    let resId = []
    resIdsData.forEach(item => {
      item._id && resId.push(item._id + '')
    })
    delete search.org
    delete search.recursion
    delete search.seek
    delete search.status

    result = await paging.listQuery(
      Record,
      {
        $and: [search],
        resource: { $in: resId },
        takeType: 'timeVideo',
        enable: 'enable'
      },
      '_id takeType enable streamType planTemplateId resource',
      {},
      paganation,
      [
        {
          path: 'resource',
          select: '_id name chan ip port status'
        },
        {
          path: 'planTemplateId',
          select: '_id name elements'
        }
      ],
      ctx
    )
    // ctx.body = result.results
    ctx.body = await syncVideoStatusReal(JSON.parse(JSON.stringify(result.results)))
  } catch (err) {
    handleSysException(err, 4107)
  }
}
// 获取定时录像计划通道详情
exports.videoDetails = async ctx => {
  // OperationLog.find(ctx.query)

  if (ctx.query.search.onlineRate) {
    _.merge(ctx.query.search, {
      RateStatus: ctx.query.search.RateStatus === '1' ? 1 : { $in: [2, 3] }
    })
  } else {
    delete ctx.query.search.onlineRate
  }

  const resultObj = await paging.listQuery(
    OperationLog,
    _.merge(ctx.query.search, {
      LogType: 2
    }),
    '',
    { createTime: -1 },
    ctx.query.page,
    '',
    ctx
  )
  ctx.body = resultObj.results
}

// 获取定时录像计划通道详情 虚拟
exports.videoDetailsFeke = async ctx => {
  if (ctx.query.search.onlineRate) {
    _.merge(ctx.query.search, {
      RateStatus: ctx.query.search.RateStatus === '1' ? 1 : { $in: [2, 3] }
    })
  } else {
    delete ctx.query.search.onlineRate
  }
  delete ctx.query.search.channel

  const resultObj = await paging.listQuery(
    OperationLog,
    _.merge(ctx.query.search, {
      LogType: 1
    }),
    '',
    { createTime: -1 },
    ctx.query.page,
    '',
    ctx
  )
  ctx.body = resultObj.results
}
// 获取定时录像计划通道详情对比
exports.videoAnalysis = async ctx => {
  if (ctx.query.search.onlineRate) {
    _.merge(ctx.query.search, {
      RateStatus: ctx.query.search.RateStatus === '1' ? 1 : { $in: [2, 3] }
    })
  } else {
    delete ctx.query.search.onlineRate
  }
  // 获取定时录像计划日志
  const resultObj = await paging.listQuery(
    OperationLog,
    _.merge(ctx.query.search, {
      LogType: 2
    }),
    '',
    { createTime: -1 },
    ctx.query.page,
    '',
    ctx
  )
  //  查找对应设备日志
  const devLog = await Promise.all(
    resultObj.results.map(item => {
      return OperationLog.findOne({ createTime: item.createTime, ip: item.ip, LogType: 1 })
        .lean()
        .exec()
    })
  )
  const list = []
  resultObj.results.forEach(rlog => {
    list.push({
      recodeLog: rlog,
      devLog: {},
      createTime: rlog.createTime
    })
    devLog.forEach(dlog => {
      if (rlog.createTime === dlog.createTime) {
        list[list.length - 1].devLog = dlog
      }
    })
  })
  ctx.body = list
}

// 获取定时录像计划通道详情对比
exports.videoAnalysisFeke = async ctx => {
  if (ctx.query.search.onlineRate) {
    _.merge(ctx.query.search, {
      RateStatus: ctx.query.search.RateStatus === '1' ? 1 : { $in: [2, 3] }
    })
  } else {
    delete ctx.query.search.onlineRate
  }
  delete ctx.query.search.channel
  // 获取定时录像计划日志
  const resultObj = await paging.listQuery(
    OperationLog,
    _.merge(ctx.query.search, {
      LogType: 1
    }),
    '',
    { createTime: -1 },
    ctx.query.page,
    '',
    ctx
  )

  const list = []
  resultObj.results.forEach(rlog => {
    list.push({
      recodeLog: rlog,
      devLog: {},
      createTime: rlog.createTime
    })
    list[list.length - 1].devLog = rlog
  })
  ctx.body = list
}
// 录像日志导出
exports.videoExport = async ctx => {
  const search = ctx.query.search
  const resIds = []
  let result = []
  let tableName = ''
  try {
    // 获取视频类型通道
    let query = { type: 0 }
    if (!_.isEmpty(search.seek)) {
      search.seek = search.seek.replace(/\./g, '\\.')
      query = { $or: [{ name: { $regex: search.seek } }, { ip: { $regex: search.seek } }] }
    }
    if (search.RateStatus) {
      syncVideoRateList()
      if (search.RateStatus === '2') {
        search.RateStatus = {
          $in: [2, 3]
        }
      } else if (search.RateStatus === '1') {
        search.RateStatus = 1
      }
    } else {
      delete search.RateStatus
    }
    const orgId = search.org
    let org = []
    // 通过机构查找设备 (recursion=1查找当前节点及子节点|recursion=0查找当前节点)
    if (search.recursion === '1') {
      const orgs = await Org.find({ type: 0 }, 'name pid isroot')
        .lean()
        .sort('order')
        .exec()
      if (orgs[0].name) {
        tableName = orgs[0].name
      }
      // org = getChildren(orgs, '_id', 'pid', orgId)
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
      const orgRes = await OrgRes.find({ org: { $in: org } })
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    } else if (search.recursion === '0') {
      const orgRes = await OrgRes.find({ org: orgId }).populate({
        path: 'org',
        select: 'name'
      })
      if (orgRes[0] && orgRes[0].org && orgRes[0].org.name) {
        tableName = orgRes[0].org.name
      }
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    }
    // 视频通道资源
    query.type = 0
    if (search.server) {
      const stoRes = await Storage.find({ server: search.server }, 'resource')
      stoRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
      tableName = search.server
    } else {
      delete ctx.query.search.server
    }
    // 是否在线
    if (search.status) {
      query.status = parseInt(ctx.query.status)
    } else {
      delete search.status
    }
    const resIdsData = await Resource.find(_.assign({ _id: { $in: resIds } }, query), '_id')
    let resId = []
    resIdsData.forEach(item => {
      item._id && resId.push(item._id + '')
    })
    delete search.org
    delete search.recursion
    delete search.seek
    delete search.status
    //  获取录像资源
    result = await Record.find(
      {
        $and: [search],
        resource: { $in: resId },
        takeType: 'timeVideo',
        enable: 'enable'
      },
      '_id takeType enable streamType planTemplateId resource'
    )
      .populate([
        {
          path: 'resource',
          select: '_id name chan ip port status'
        },
        {
          path: 'planTemplateId',
          select: '_id name elements'
        }
      ])
      .exec()
    //  获取录像资源日志
    const videoData = await syncVideoStatus(JSON.parse(JSON.stringify(result)))
    // 添加
    const data = [['通道名称', '设备IP', '在线状态', '正在录像', '已录时长', '录像完整率', '最后检测时间']]
    videoData.forEach(item => {
      const arr = [
        item.name,
        item.ip,
        item.status === 1 ? '在线' : '离线',
        item.isVideo === 1 ? '正在录像' : '未在录像',
        hourTime(item.videoTime),
        item.videoRate,
        moment(item.lastTime * 1000).format('YYYY-MM-DD HH:mm:ss')
      ]
      data.push(arr)
    })
    const ColInfos = [{}, {}, {}, {}, {}, {}, {}]
    const option = { '!cols': ColInfos }
    const buffer = xlsx.build([{ name: '录像信息', data }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
    ctx.attachment(`${tableName}-录像监测日志-` + timeStr + '.xlsx'.toString('utf8'))
    ctx.body = buffer
  } catch (err) {
    handleSysException(err, 4107)
  }
}

// 录像日志导出 虚拟
exports.videoExportFeke = async ctx => {
  const search = ctx.query.search
  const resIds = []
  let result = []
  let tableName = ''
  try {
    // 获取视频类型通道
    let query = { type: 0 }
    if (!_.isEmpty(search.seek)) {
      search.seek = search.seek.replace(/\./g, '\\.')
      query = { $or: [{ name: { $regex: search.seek } }, { ip: { $regex: search.seek } }] }
    }
    if (search.RateStatus) {
      syncVideoRateList()
      if (search.RateStatus === '2') {
        search.RateStatus = {
          $in: [2, 3]
        }
      } else if (search.RateStatus === '1') {
        search.RateStatus = 1
      }
    } else {
      delete search.RateStatus
    }
    const orgId = search.org
    let org = []
    // 通过机构查找设备 (recursion=1查找当前节点及子节点|recursion=0查找当前节点)
    if (search.recursion === '1') {
      const orgs = await Org.find({ type: 0 }, 'name pid isroot')
        .lean()
        .sort('order')
        .exec()
      if (orgs[0].name) {
        tableName = orgs[0].name
      }
      // org = getChildren(orgs, '_id', 'pid', orgId)
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
      const orgRes = await OrgRes.find({ org: { $in: org } })
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    } else if (search.recursion === '0') {
      const orgRes = await OrgRes.find({ org: orgId }).populate({
        path: 'org',
        select: 'name'
      })
      if (orgRes[0] && orgRes[0].org && orgRes[0].org.name) {
        tableName = orgRes[0].org.name
      }
      orgRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
    }
    // 视频通道资源
    query.type = 0
    if (search.server) {
      const stoRes = await Storage.find({ server: search.server }, 'resource')
      stoRes.forEach(item => {
        item.resource && resIds.push(item.resource)
      })
      tableName = search.server
    } else {
      delete ctx.query.search.server
    }
    // 是否在线
    if (search.status) {
      query.status = parseInt(ctx.query.status)
    } else {
      delete search.status
    }
    const resIdsData = await Resource.find(_.assign({ _id: { $in: resIds } }, query), '_id')
    let resId = []
    resIdsData.forEach(item => {
      item._id && resId.push(item._id + '')
    })
    delete search.org
    delete search.recursion
    delete search.seek
    delete search.status
    //  获取录像资源
    result = await Record.find(
      {
        $and: [search],
        resource: { $in: resId },
        takeType: 'timeVideo',
        enable: 'enable'
      },
      '_id takeType enable streamType planTemplateId resource'
    )
      .populate([
        {
          path: 'resource',
          select: '_id name chan ip port status'
        },
        {
          path: 'planTemplateId',
          select: '_id name elements'
        }
      ])
      .exec()
    //  获取录像资源日志
    const videoData = await syncVideoStatusFeke(JSON.parse(JSON.stringify(result)))
    // 添加
    const data = [['通道名称', '设备IP', '在线状态', '正在录像', '已录时长', '录像完整率', '最后检测时间']]
    videoData.forEach(item => {
      let time = '--'
      if (typeof item.videoTime === 'number') {
        time = `${Math.trunc(item.videoTime / (3600 * 24))}天${Math.trunc((item.videoTime % (3600 * 24)) / 3600)}小时`
      } else {
        time = '--'
      }
      let lastTimeStr = '--'
      if (item.lastTime) {
        lastTimeStr = moment(item.lastTime * 1000).format('YYYY-MM-DD HH:mm:ss')
      }
      const arr = [
        item.name,
        item.ip,
        item.status === 1 ? '在线' : '离线',
        item.videoing === 1 ? '正在录像' : '未在录像',
        time,
        item.videoRate,
        lastTimeStr
      ]
      data.push(arr)
    })
    const ColInfos = [{ width: 22 }, { width: 15 }, {}, {}, { width: 15 }, { width: 18 }, { width: 20 }]
    const option = { '!cols': ColInfos }
    const buffer = xlsx.build([{ name: '录像信息', data }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
    ctx.attachment(`${tableName}-录像监测日志-` + timeStr + '.xlsx'.toString('utf8'))
    ctx.body = buffer
  } catch (err) {
    handleSysException(err, 4107)
  }
}

// 获取各类设备的设备总数
exports.counts = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('运维管理-获取各类设备总数'))
    let allChildrenIds = []
    if (parseInt(ctx.query.never) === -1) {
      if (_.isEmpty(ctx.query.id)) {
        ctx.throw(500, { code: 2001, message: '参数不能为空' })
      }
      // 统计所有子孙机构
      const orginfo = await Org.findById(ctx.query.id).exec()

      const orgs = await Org.find({ type: orginfo.type || 0 }, '_id pid').exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.id)
    }
    allChildrenIds.unshift(ctx.query.id + '')
    // orgs = await Org.find({_id: {$in: allChildrenIds}}, '_id pid').exec()
    const types = [0, 1, 7, 5]
    const data = await Promise.all(
      types.map(item => {
        return Device.countDocuments({
          oid: {
            $in: allChildrenIds
          },
          bigtype: item
        }).exec()
      })
    )
    data.push(await serverSum())
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
// 设备列表导出
exports.deviceExport = async ctx => {
  try {
    const orgName = await Org.findById(ctx.query.oid, 'name').exec()
    const type = parseInt(ctx.query.bigtype)
    let devData = []
    // type: 0 视频设备 对应Device bigtype 0
    // type: 1 消防设备 对应Device bigtype 1
    // type: 2 消防设备 对应Device bigtype 7
    // type: 3 解码器   对应Device bigtype 5
    // 4 服务器 5 平台服务
    const DEVTYPE = [0, 1, 7, 5]
    const CHECKType = [0, 1, 2, 3]
    const SERVERTYPE = 4 // 服务器类型
    if (CHECKType.some(e => e === type)) {
      let allChildrenIds = []
      ctx.query.search.bigtype = DEVTYPE[type]
      if (ctx.query.oid && parseInt(ctx.query.never) === -1) {
        const orgs = await Org.find(
          {
            type: 0
          },
          '_id name pid'
        )
          .sort('order')
          .exec() // -devices
        allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
        allChildrenIds.unshift(ctx.query.oid + '')
        _.merge(ctx.query.search, {
          oid: {
            $in: allChildrenIds
          }
        })
      }

      let select = {
        $and: [ctx.query.search]
      }
      delete ctx.query.search.never
      const resultObj = await Device.find(
        select,
        'status bigtype type _id manufacturer createdAt name model intranetIp ip cport oid'
      )
        .populate({
          path: 'oid',
          select: '_id name'
        })
        .exec()
      devData = await devState(resultObj) //  添加设备在线率
      // 定义表头
      const data = [['设备名称', '所属机构', 'IP地址', '在线状态', '在线率', '厂商', '设备类型', '离线时长']]
      // 将设备信息Push到sheet
      devData.forEach(item => {
        const arr = [
          item.name,
          item.oid.name,
          item.ip,
          item.status ? '在线' : '离线',
          typeof item.onlineRate === 'number' ? `${item.onlineRate * 100}%` : item.onlineRate,
          item.manufacturer,
          type === DEVTYPE[0] ? item.type : item.model,
          typeof item.OffLine === 'number' ? hourTime(item.OffLine) : item.OffLine
        ]
        data.push(arr)
      })
      const ColInfos = [{ width: 15 }, { width: 15 }, { width: 18 }, {}, {}, {}, {}, { width: 15 }]
      const option = { '!cols': ColInfos }
      const buffer = xlsx.build([{ name: '设备信息', data }], option)
      ctx.type = 'application/vnd.openxmlformats'
      const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
      const xlsxName = ['设备检测', '视频设备', '报警设备', '消防设备', '解码设备', '服务器', '平台服务']
      ctx.attachment(orgName.name + `-${xlsxName[type]}-` + timeStr + '.xlsx'.toString('utf8'))
      ctx.body = buffer
    } else if (type === SERVERTYPE) {
      let results = await serviceState(ctx)
      devData = results
      // 定义表头
      const data = [['服务名称', '所属服务器', '在线状态', '在线率', '离线时长']]
      // 将设备信息Push到sheet
      devData.forEach(item => {
        const arr = [
          item.name,
          item.ip,
          item.status === 1 ? '在线' : '离线',
          item.onlineRate,
          typeof item.OffLine === 'number' ? hourTime(item.OffLine) : item.OffLine
        ]
        data.push(arr)
      })
      const ColInfos = [{ width: 15 }, { width: 15 }, { width: 18 }, { width: 15 }]
      const option = { '!cols': ColInfos }
      const buffer = xlsx.build([{ name: '设备信息', data }], option)
      ctx.type = 'application/vnd.openxmlformats'
      const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
      const xlsxName = ['设备检测', '视频设备', '报警设备', '消防设备', '解码设备', '服务器', '平台服务']
      ctx.attachment(orgName.name + `-${xlsxName[type]}-` + timeStr + '.xlsx'.toString('utf8'))
      ctx.body = buffer
    } else {
      ctx.throw(500, { code: 2001, message: '参数非法' })
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 获取日志列表
const VIDEOTYPE = '7' // 视频诊断日志
const EXPORT = 1
const NOTEXPORT = 0
exports.logs = async ctx => {
  try {
    if (ctx.query.search.type === VIDEOTYPE) {
      const data = await service.getVideoDiagnosisLog(ctx, NOTEXPORT)
      const resIds = _.map(data, item => {
        return item && item.channel
      })
      const resData = await service.resourceAll({ _id: { $in: resIds } }, '_id name ip status eid', {
        path: 'eid',
        select: '_id name oid model type manufacturer',
        populate: { path: 'oid', select: 'name' }
      })
      const reData = []
      data.map(log => {
        const resInfo = resData.filter(res => {
          return res._id + '' === log.channel
        })
        let obj = {
          _id: log.channel,
          diagnosis: log.diagnosis,
          diagnid: log.diagnid || '',
          time: log.time,
          ip: log.devip || '',
          status: '视频诊断',
          orgs: '',
          manufactuer: '',
          type: '',
          name: ''
        }
        if (!_.isEmpty(resInfo)) {
          obj.orgs = _.get(resInfo[0], 'eid.oid.name', '')
          obj.manufactuer = _.get(resInfo[0], 'eid.manufacturer', '')
          obj.name = _.get(resInfo[0], 'name', '')
          obj.type = _.get(resInfo[0], 'eid.type', '')
          obj.ip = _.get(resInfo[0], 'ip', '')
        }
        reData.push(obj)
      })
      ctx.body = reData || []
    } else {
      ctx.body = await ALLLog(ctx)
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 日志列表导出
exports.logExport = async ctx => {
  try {
    if (ctx.query.search.type === VIDEOTYPE) {
      const reqLog = await service.getVideoDiagnosisLog(ctx, EXPORT)
      const resIds = _.map(reqLog, item => {
        return item && item.channel
      })
      const resData = await service.resourceAll({ _id: { $in: resIds } }, '_id name ip port status eid', {
        path: 'eid',
        select: '_id name oid model type manufacturer',
        populate: { path: 'oid', select: 'name' }
      })
      const reData = []
      reqLog.map(log => {
        const resInfo = resData.filter(res => {
          return res._id + '' === log.channel
        })
        const obj = {
          name: '',
          diagnosis: log.diagnosis,
          time: log.time,
          ip: log.devip || '',
          status: '视频诊断',
          orgs: '',
          manufactuer: '',
          type: ''
        }
        if (!_.isEmpty(resInfo)) {
          obj.orgs = _.get(resInfo[0], 'eid.oid.name', '')
          obj.manufactuer = _.get(resInfo[0], 'eid.manufacturer', '')
          obj.type = _.get(resInfo[0], 'eid.type', '')
          obj.name = _.get(resInfo[0], 'name', '')
          obj.ip = _.get(resInfo[0], 'ip', '')
        }
        reData.push(obj)
      })
      const data = [['时间', '名称', '设备IP', '设备类型', '所属机构', '日志类型']]
      // 将设备信息Push到sheet
      reData.forEach(item => {
        const arr = [item.time, item.name, item.ip, item.type, item.orgs, item.status]
        data.push(arr)
      })
      const ColInfos = [{}, {}, {}, {}, {}, {}, {}]
      const option = { '!cols': ColInfos }
      const buffer = xlsx.build([{ name: '设备信息', data }], option)
      ctx.type = 'application/vnd.openxmlformats'
      const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')

      ctx.attachment(`视频诊断日志-` + timeStr + '.xlsx'.toString('utf8'))
      ctx.body = buffer
    } else {
      // 获取日志数据
      const logData = await ALLLogExport(ctx)
      const typeNum = parseInt(ctx.query.search.type)
      const data = [['设备名称', 'IP地址', '端口号', '所属机构', '设备类型', '日志类型', '时间']]
      const LogTypeString = [
        '设备上线',
        '设备离线',
        // '开始录像',
        // '停止录像',
        '录像缺失',
        '视频流中断',
        '存储写入失败',
        '服务上线',
        '服务离线'
      ] // 表名
      // 将设备信息Push到sheet
      logData.forEach(item => {
        const arr = [item.name, item.ip, item.port, item.orgs, item.type, item.status, item.createTime]
        data.push(arr)
      })
      const ColInfos = [{}, {}, {}, {}, {}, {}, {}]
      const option = { '!cols': ColInfos }
      const buffer = xlsx.build([{ name: '设备信息', data }], option)
      ctx.type = 'application/vnd.openxmlformats'
      const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')

      ctx.attachment(`${LogTypeString[typeNum]}日志-` + timeStr + '.xlsx'.toString('utf8'))
      ctx.body = buffer
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 日志详情
exports.videoInfo = async ctx => {
  try {
    const id = ctx.params.id
    const diagnid = ctx.params.diagnid
    if (_.isEmpty(id) || _.isEmpty(diagnid)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    ctx.body = await service.getVideoDiagnosisLogInfo(id, diagnid)
  } catch (error) {
    handleSysException(error)
  }
}

// 资产管理，资产数量详情
exports.statistics = async ctx => {
  // 0 :摄像机  1 :录像机  2 :报警主机  3 :消防主机  4 :报警探头  5 :消防探头  6 :报警柱   7 : 报警箱 8 : 闸机 9 : 解码器   10 : 网络键盘   11 :拼接控制器
  if (_.isEmpty(ctx.query.oid)) {
    ctx.throw(500, { code: 2001, message: '参数不能为空' })
  }
  const TIME =
    moment()
      .startOf('day')
      .format('X') * 1 // 今天开始时间
  let allChildrenIds = [] // 该机构的所有子机构
  let devFind = {
    oid: ctx.query.oid
  } // 设备查询条件
  // let resFind = {} // 资源查询条件
  let resIds = [] // 资源的id

  // 是否查询子机构 -1 查询子机构 否则只查询当前机构
  if (parseInt(ctx.query.never) === -1) {
    // 获取机构树
    const orgs = await Org.find({ type: 0 }, '_id name pid order')
      .sort('order')
      .exec() // -devices
    allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
    allChildrenIds.unshift(ctx.query.oid)
    // 设备的机构id
    devFind.oid = {
      $in: allChildrenIds
    }
    // 资源id
    const orgRes = await OrgRes.find({ org: { $in: allChildrenIds } })
    orgRes.forEach(item => {
      item.resource && resIds.push(item.resource)
    })
  } else {
    // 通过机构id获取资源id
    let result = await OrgRes.find({ org: ctx.query.oid })
    result.forEach(item => {
      item.resource && resIds.push(item.resource)
    })
  }

  // 通过机构id获取设备id
  const devData = await Device.find(devFind, '_id').exec()
  const devId = devData.map(item => {
    return item._id
  })
  // 获取录像机的rid
  // const resId = await Resource.find({ type: 0, eid: { $in: devId } }, '_id').exec()
  // resId.map(item => {
  //   resIds.push(item._id)
  // })
  // 定义所有资产的查询条件
  const types = [
    { SCHAMA: Resource, find: { type: 0, _id: { $in: resIds } } }, // 0 摄像机 资源中的IPC type = 0
    { SCHAMA: Device, find: { type: 'nvr', _id: { $in: devId }, bigtype: 0 } }, // 1 录像机 设备中的 type = nvr bigtype = 0
    { SCHAMA: Device, find: { bigtype: 1, _id: { $in: devId } } }, // 2 报警主机 设备中 bigtype 1
    { SCHAMA: Device, find: { bigtype: 7, _id: { $in: devId } } }, // 3 消防主机 设备中 bigtype 7
    { SCHAMA: Resource, find: { type: { $in: [1, 9] }, _id: { $in: resIds } } }, // 4 报警探头 资产中 type  1：视频报警输入 9：报警主机报警输入
    { SCHAMA: Resource, find: { type: 11, _id: { $in: resIds } } }, // 5 消防探头 资产中 type  11：消防输入防区
    { SCHAMA: Resource, find: { type: 13 } }, // 6 报警柱  无组织机构 alarmClient  actionVideo[0].resource 关联的Resource的Type = 13 报警柱,
    { SCHAMA: Resource, find: { type: 14 } }, // 7 报警箱  无组织机构 alarmClient  actionVideo[0].resource 关联的Resource的Type = 14 报警箱
    { SCHAMA: Device, find: { bigtype: 2, _id: { $in: devId } } }, // 8 闸机     设备中 bigtype 2
    { SCHAMA: Device, find: { bigtype: 5, _id: { $in: devId } } }, // 9 解码器   设备中 bigtype 5
    { SCHAMA: Device, find: { bigtype: 6, _id: { $in: devId } } }, // 10 网络键盘 设备中 bigtype 6
    { SCHAMA: Device, find: { bigtype: 9, _id: { $in: devId } } } // 11 拼接控制器 设备中 bigtype 9
  ]

  // const data = await Promise.all(
  //   types.map(async(item, index) => {
  //     const count = await item.SCHAMA.find(item.find, '_id').exec()
  //     // const id = _.map(count, item => { return item._id + '' })
  //     const id = _.map(count, item => { return item._id })
  //     let action = [...actions()].filter(([key, value]) => key.test(`${index}`) // 寻找对应action键
  //     )
  //     action.forEach(([key, value]) => value(id)) // 执行对应方法
  //     return count.length
  //   })
  // )
  const data = await Promise.all(
    types.map(item => {
      return item.SCHAMA.find(item.find, '_id').exec()
    })
  )
  // 存放当前所有资产信息
  let resultRes = []
  let resultDev = []
  let resultAla = []
  // 通过map正则匹配对应types下标,进行统计存储所属类型_id
  const actions = () => {
    return new Map([
      [
        /^[045]{1}$/,
        ids => {
          resultRes = resultRes.concat(ids)
        }
      ], // 匹配0 4 5 三个下标
      [
        /^[67]{1}$/,
        ids => {
          resultAla = resultAla.concat(ids)
        }
      ], // 匹配 6 7 两个下表
      [
        /[12389]/,
        ids => {
          resultDev = resultDev.concat(ids)
        }
      ] // 匹配 1 2 3 8 9 10 11 7个下标
    ])
  }
  data.map((items, index) => {
    const idList = _.map(items, item => {
      return item._id
    })
    let action = [...actions()].filter(([key, value]) => key.test(`${index}`)) // 寻找对应action键
    action.forEach(([key, value]) => value(idList))
  })
  // 当前机构在保资产
  const extendData = await DeviceExtend.aggregate([
    {
      $match: {
        $or: [{ rid: { $in: resultRes } }, { aid: { $in: resultAla } }, { eid: { $in: resultDev } }],
        endTime: { $gt: TIME }
      }
    },
    {
      $group: { _id: '$type', sum: { $sum: 1 } }
    }
  ]).exec()
  const redata = []
  // 整合设备在保信息
  data.map((item, index) => {
    // 找到当前类型在保设备数量
    const itemLength = item.length
    let check = extendData.filter(exten => {
      return exten._id === index
    })
    if (_.isEmpty(check)) {
      redata.push({
        insurance: 0,
        noInsurance: itemLength,
        sum: itemLength,
        type: index
      })
    } else {
      redata.push({
        insurance: check[0].sum,
        noInsurance: itemLength - check[0].sum,
        sum: itemLength,
        type: index
      })
    }
  })
  ctx.body = redata
}

// 资产管理列表
exports.assets = async ctx => {
  // 0  摄像机 资源中的IPC type = 0
  // 1  录像机 设备中的 type = nvr
  // 2  报警主机 设备中 bigtype 1
  // 3  消防主机 设备中 bigtype 7
  // 4  报警探头 资产中 type  1：视频报警输入 9：报警主机报警输入
  // 5  消防探头 资产中 type  11：消防输入防区
  // 6  报警柱   alarmClient  actionVideo[0].resource 关联的Resource的Type = 13 报警柱,
  // 7  报警箱   alarmClient  actionVideo[0].resource 关联的Resource的Type = 14 报警箱
  // 8  闸机     设备中 bigtype 2
  // 9  解码器   设备中 bigtype 5
  // 10 网络键盘 设备中 bigtype 6
  // 11 拼接控制器 设备中 bigtype 9
  // 12  服务器   serverList
  const numType = parseInt(ctx.query.numtype)
  delete ctx.query.search.numtype
  const TIME = moment().format('X') * 1 // 当前时间
  let SCHAMA // 使用到的Schama
  let idType // 扩展表中所使用id
  function fun1 () {
    // 资源处理方式
    SCHAMA = Resource
    idType = 'rid'
  }
  function fun2 () {
    // 设备处理方式
    SCHAMA = Device
    idType = 'eid'
  }
  function fun3 () {
    // 报警处理方式
    SCHAMA = alarmClient
    idType = 'aid'
  }
  caseDevType(numType, fun1, fun2, fun3, ctx)
  const orgData = await Org.findById(ctx.query.oid, '_id name pid isroot').exec()
  if (_.at(orgData, ['isroot'])[0] === false) {
    switch (numType) {
      case 6:
      case 7:
      case 8:
        ctx.body = []
        return
    }
  }
  let allChildrenIds = [] // 该机构的所有子机构
  let populate = '' // 关联条件
  let find = {} // 查询条件
  // 设备查询
  if (SCHAMA === Device) {
    if (_.isEmpty(ctx.query.oid)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    // 如果传入机构：oid
    if (parseInt(ctx.query.never) === -1) {
      const orgs = await Org.find({ type: 0 }, '_id name pid')
        .sort('order')
        .exec() // -devices
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
      allChildrenIds.unshift(ctx.query.oid + '')
      _.merge(ctx.query.search, {
        oid: {
          $in: allChildrenIds
        }
      })
    }
    if (ctx.query.seek.match(/\./)) {
      ctx.query.seek = ctx.query.seek.replace(/\./, '\\.')
    }
    // 是否查询是否在保
    if (ctx.query.insurance) {
      // 在保资产
      let result = await DeviceExtend.find({
        type: numType,
        endTime: { $gt: TIME }
      }).exec()
      let eids = _.map(result, 'eid') // 设备 id
      if (ctx.query.insurance === '2') {
        _.merge(ctx.query.search, {
          _id: {
            $nin: eids
          }
        })
      } else {
        _.merge(ctx.query.search, {
          _id: {
            $in: eids
          }
        })
      }
    }
    find = {
      $and: [ctx.query.search],
      $or: [
        {
          ip: { $regex: ctx.query.seek + '' || '' }
        },
        { name: { $regex: ctx.query.seek + '' || '' } }
      ]
    }
    populate = {
      path: 'oid',
      select: '_id name'
    }
  }
  // 资源查询
  if (SCHAMA === Resource) {
    if (_.isEmpty(ctx.query.oid)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const _ids = [] // 资源id
    // 获取摄像机的 id
    if (numType === 0) {
      if (parseInt(ctx.query.never) === -1) {
        // 获取机构树
        const orgs = await Org.find({ type: 0 }, '_id name pid order')
          .sort('order')
          .exec() // -devices
        allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
        allChildrenIds.unshift(ctx.query.oid + '')
        // 设备的机构id
        // 资源id
        const orgRes = await OrgRes.find({ org: { $in: allChildrenIds } })
        orgRes.forEach(item => {
          item.resource && _ids.push(item.resource + '')
        })
      } else {
        let result = await OrgRes.find({ org: ctx.query.oid })
        result.forEach(item => {
          item.resource && _ids.push(item.resource + '')
        })
      }
      // 通过设备id获取对应的摄像头资源
      const resId = await Resource.find({ type: 0, _id: { $in: _ids } }, '_id').exec()
      resId.map(item => {
        _ids.push(item._id + '')
      })
    } else {
      // 获取 非摄像机的其他资源 id
      const AFLE = 4 // 报警探头类型
      if (numType === AFLE) {
        const ALFETYPE = [1, 9] // 报警输入类型
        ctx.query.search.type = ALFETYPE
      }
      const orginfo = await Org.findById(ctx.query.oid).exec()
      if (parseInt(ctx.query.never) === -1) {
        const orgs = await Org.find(
          {
            type: orginfo.type || 0
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
      )
        .lean()
        .exec()
      result.map(item => {
        _ids.push(item.resource + '')
      })
    }
    delete ctx.query.search.oid
    // 当前机构下所属设备id

    let mergeSt = {
      _id: {
        $in: _ids
      }
    }
    // 是否查询是否过保 1:  在保 (有记录且在时间范围内) ; 2 : 过保 (1:无记录 2:记录过期的资源 )
    if (ctx.query.insurance) {
      // 在保资源
      let devData = await DeviceExtend.find({
        rid: { $in: _ids },
        endTime: { $gt: TIME }
      })
        .lean()
        .exec()
      let rids = devData.map(item => {
        return item.rid + ''
      })
      if (ctx.query.insurance === '2') {
        let ids = _.difference(_ids, rids) // 求未在保
        _.merge(ctx.query.search, {
          _id: {
            $in: ids
          }
        })
      } else {
        _.merge(ctx.query.search, {
          _id: {
            $in: rids
          }
        })
      }
    } else {
      // 无搜索情况
      _.merge(ctx.query.search, mergeSt)
    }
    find = {
      $and: [ctx.query.search],
      $or: [
        {
          ip: { $regex: ctx.query.seek + '' || '' }
        },
        { name: { $regex: ctx.query.seek + '' || '' } }
      ]
    }
    populate = {
      path: 'eid',
      select: '_id name oid model type manufacturer',
      populate: { path: 'oid', select: 'name' }
    }
  }
  // 报警设备查询
  if (SCHAMA === alarmClient) {
    const resour = await Resource.find({ type: { $in: [13, 14] } }, 'eid').exec()
    _.merge(ctx.query.search, {
      camerDevId: { $in: _.map(resour, 'eid') }
    })
    if (ctx.query.insurance) {
      let result = await DeviceExtend.find({
        type: numType,
        endTime: { $gt: TIME }
      }).exec()
      let aids = _.map(result, 'aid')
      if (ctx.query.insurance === '2') {
        _.merge(ctx.query.search, {
          _id: {
            $nin: aids
          }
        })
      } else {
        _.merge(ctx.query.search, {
          _id: {
            $in: aids
          }
        })
      }
    }
    find = {
      $and: [
        ctx.query.search,
        {
          name: {
            $regex: ctx.query.seek || ''
          }
        }
      ]
    }
    populate = {
      path: 'camerDevId',
      select: '_id name  model type manufacturer'
    }
  }
  delete ctx.query.search.insurance
  delete ctx.query.search.never
  delete ctx.query.search.seek

  const result = await paging.listQuery(SCHAMA, find, '', '', ctx.query.page, populate, ctx)

  let Ids = _.map(result.results, '_id')
  let select = {}
  select[idType] = {
    $in: Ids
  }
  // 扩展信息
  const extenData = await DeviceExtend.find(select)
    .lean()
    .exec()
  result.results.map(item => {
    const ex = extenData.filter(exObj => {
      return exObj[idType] + '' === item._id + ''
    })
    if (_.isEmpty(ex) || _.get(ex[0], 'endTime') <= TIME) {
      _.merge(item._doc, {
        insurance: 2,
        maintenanceVendor: _.get(ex[0], 'maintenanceVendor', '')
      })
    } else if (ex[0].endTime && ex[0].endTime >= TIME) {
      _.merge(item._doc, {
        insurance: 1,
        maintenanceVendor: _.get(ex[0], 'maintenanceVendor', '')
      })
    }
  })
  ctx.body = result.results
}

exports.assetsExport = async ctx => {
  // 0  摄像机     资源中的IPC type = 0
  // 1  录像机     设备中的 type = nvr
  // 2  报警主机   设备中 bigtype 1
  // 3  消防主机   设备中 bigtype 7
  // 4  报警探头   资产中 type  1：视频报警输入 9：报警主机报警输入
  // 5  消防探头   资产中 type  11：消防输入防区
  // 6  报警柱     alarmClient  actionVideo[0].resource 关联的Resource的Type = 13 报警柱,
  // 7  报警箱     alarmClient  actionVideo[0].resource 关联的Resource的Type = 14 报警箱
  // 8  闸机       设备中 bigtype 2
  // 9  解码器     设备中 bigtype 5
  // 10 网络键盘   设备中 bigtype 6
  // 11 拼接控制器 设备中 bigtype 9
  // 12  服务器   serverList
  const numType = parseInt(ctx.query.numtype)
  delete ctx.query.search.numtype
  const TIME = moment().format('X') * 1 // 当前时间
  let SCHAMA // 使用到的Schama
  let idType // 扩展表中所使用id
  let valueType
  const orgData = await Org.findById(ctx.query.oid, '_id name pid isroot').exec()
  const orgName = orgData.name
  const tableName = [
    '摄像机',
    '录像机',
    '报警主机',
    '消防主机',
    '报警探头',
    '消防探头',
    '报警柱',
    '报警箱',
    '闸机',
    '解码器',
    '网络键盘',
    '拼接控制器'
  ]
  function fun1 () {
    // 资源处理方式
    SCHAMA = Resource
    idType = 'rid'
    valueType = 0
  }
  function fun2 () {
    // 设备处理方式
    SCHAMA = Device
    idType = 'eid'
    valueType = 1
  }
  function fun3 () {
    // 报警处理方式
    SCHAMA = alarmClient
    idType = 'aid'
    valueType = 2
  }
  // 非根机构请求时屏蔽结果
  if (_.at(orgData, ['isroot'])[0] === false) {
    switch (numType) {
      case 6:
      case 7:
      case 8:
        const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
        ctx.attachment(`${orgName}-${tableName[numType]}日志-${timeStr}.xlsx`.toString('utf8'))
        let data = []
        ctx.body = await assetsXlsx(data, valueType, tableName)
        break
    }
    return
  }
  caseDevType(numType, fun1, fun2, fun3, ctx)
  let allChildrenIds = [] // 该机构的所有子机构
  let populate = '' // 关联条件
  let find = {} // 查询条件
  // 设备查询
  if (SCHAMA === Device) {
    if (_.isEmpty(ctx.query.oid)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    // 如果传入机构：oid
    if (parseInt(ctx.query.never) === -1) {
      const orgs = await Org.find({ type: 0 }, '_id name pid')
        .sort('order')
        .exec() // -devices
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
      allChildrenIds.unshift(ctx.query.oid + '')
      _.merge(ctx.query.search, {
        oid: {
          $in: allChildrenIds
        }
      })
    }
    if (ctx.query.seek.match(/\./)) {
      ctx.query.seek = ctx.query.seek.replace(/\./, '\\.')
    }
    // 是否查询是否在保
    if (ctx.query.insurance) {
      // 在保资产
      let result = await DeviceExtend.find({
        type: numType,
        endTime: { $gt: TIME }
      }).exec()
      let eids = _.map(result, 'eid') // 设备 id
      if (ctx.query.insurance === '2') {
        _.merge(ctx.query.search, {
          _id: {
            $nin: eids
          }
        })
      } else {
        _.merge(ctx.query.search, {
          _id: {
            $in: eids
          }
        })
      }
    }
    find = {
      $and: [ctx.query.search],
      $or: [
        {
          ip: { $regex: ctx.query.seek + '' || '' }
        },
        { name: { $regex: ctx.query.seek + '' || '' } }
      ]
    }
    populate = {
      path: 'oid',
      select: '_id name'
    }
  }
  // 资源查询
  if (SCHAMA === Resource) {
    if (_.isEmpty(ctx.query.oid)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const _ids = [] // 资源id
    // 获取摄像机的 id
    if (numType === 0) {
      let devFind = {
        oid: ctx.query.oid,
        bigtype: 0
      } // 设备查询条件
      if (parseInt(ctx.query.never) === -1) {
        // 获取机构树
        const orgs = await Org.find({ type: 0 }, '_id name pid order')
          .sort('order')
          .exec() // -devices
        allChildrenIds = tool.getChildren(allChildrenIds, orgs, ctx.query.oid)
        allChildrenIds.unshift(ctx.query.oid + '')
        // 设备的机构id
        devFind.oid = {
          $in: allChildrenIds
        }
        // 资源id
        const orgRes = await OrgRes.find({ org: { $in: allChildrenIds } })
        orgRes.forEach(item => {
          item.resource && _ids.push(item.resource + '')
        })
      } else {
        let result = await OrgRes.find({ org: ctx.query.oid })
        result.forEach(item => {
          item.resource && _ids.push(item.resource + '')
        })
      }
      // 通过设备id获取对应的摄像头资源
      const resId = await Resource.find({ type: 0, _id: { $in: _ids } }, '_id').exec()
      resId.map(item => {
        _ids.push(item._id + '')
      })
    } else {
      // 火气 非摄像机的其他资源 id
      const AFLE = 4 // 报警探头类型
      if (numType === AFLE) {
        const ALFETYPE = [1, 9] // 报警输入类型
        ctx.query.search.type = ALFETYPE
      }
      const orginfo = await Org.findById(ctx.query.oid).exec()
      if (parseInt(ctx.query.never) === -1) {
        const orgs = await Org.find(
          {
            type: orginfo.type || 0
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
      )
        .lean()
        .exec()
      result.map(item => {
        _ids.push(item.resource + '')
      })
    }
    delete ctx.query.search.oid
    // 当前机构下所属设备id

    let mergeSt = {
      _id: {
        $in: _ids
      }
    }
    // 是否查询是否过保 1:  在保 (有记录且在时间范围内) ; 2 : 过保 (1:无记录 2:记录过期的资源 )
    if (ctx.query.insurance) {
      // 在保资源
      let devData = await DeviceExtend.find({
        rid: { $in: _ids },
        endTime: { $gt: TIME }
      })
        .lean()
        .exec()
      let rids = devData.map(item => {
        return item.rid + ''
      })
      if (ctx.query.insurance === '2') {
        let ids = _.difference(_ids, rids) // 求未在保
        _.merge(ctx.query.search, {
          _id: {
            $in: ids
          }
        })
      } else {
        _.merge(ctx.query.search, {
          _id: {
            $in: rids
          }
        })
      }
    } else {
      // 无搜索情况
      _.merge(ctx.query.search, mergeSt)
    }
    find = {
      $and: [ctx.query.search],
      $or: [
        {
          ip: { $regex: ctx.query.seek + '' || '' }
        },
        { name: { $regex: ctx.query.seek + '' || '' } }
      ]
    }
    populate = {
      path: 'eid',
      select: '_id name oid model type manufacturer',
      populate: { path: 'oid', select: 'name' }
    }
  }
  // 报警设备查询
  if (SCHAMA === alarmClient) {
    const resour = await Resource.find({ type: { $in: [13, 14] } }, 'eid').exec()
    _.merge(ctx.query.search, {
      camerDevId: { $in: _.map(resour, 'eid') }
    })
    if (ctx.query.insurance) {
      let result = await DeviceExtend.find({
        type: numType,
        endTime: { $gt: TIME }
      }).exec()
      let aids = _.map(result, 'aid')
      if (ctx.query.insurance === '2') {
        _.merge(ctx.query.search, {
          _id: {
            $nin: aids
          }
        })
      } else {
        _.merge(ctx.query.search, {
          _id: {
            $in: aids
          }
        })
      }
    }
    find = {
      $and: [
        ctx.query.search,
        {
          name: {
            $regex: ctx.query.seek || ''
          }
        }
      ]
    }
    populate = {
      path: 'camerDevId',
      select: '_id name  model type manufacturer'
    }
    delete ctx.query.search.oid
    delete ctx.query.search.type
  }
  delete ctx.query.search.insurance
  delete ctx.query.search.never
  delete ctx.query.search.seek
  const result = await SCHAMA.find(find)
    .lean()
    .populate(populate)
    .exec()
  let Ids = _.map(result, '_id')
  let select = {}
  select[idType] = {
    $in: Ids
  }
  // 扩展信息
  const extenData = await DeviceExtend.find(select)
    .lean()
    .exec()
  result.map(item => {
    const ex = extenData.filter(exObj => {
      return exObj[idType] + '' === item._id + ''
    })
    if (_.isEmpty(ex) || (ex[0].endTime && ex[0].endTime <= TIME)) {
      _.merge(item, {
        insurance: 2,
        maintenanceVendor: (ex[0] && ex[0].maintenanceVendor) || ''
      })
    } else if (ex[0].endTime && ex[0].endTime >= TIME) {
      _.merge(item, {
        insurance: 1,
        maintenanceVendor: ex[0].maintenanceVendor
      })
    }
  })
  ctx.type = 'application/vnd.openxmlformats'
  const timeStr = new Date().toLocaleString().replace(/[-: ]/g, '')
  ctx.attachment(`${orgName}-${tableName[numType]}日志-${timeStr}.xlsx`.toString('utf8'))
  ctx.body = assetsXlsx(result, valueType, tableName[numType])
}

// 资产维保信息详情
exports.assetsInfo = async ctx => {
  // 0  摄像机 资源中的IPC type = 0
  // 1  录像机 设备中的 type = nvr
  // 2  报警主机 设备中 bittype 1
  // 3  消防主机 设备中 bittype 7
  // 4  报警探头 资产中 type  1：视频报警输入 9：报警主机报警输入
  // 5  消防探头 资产中 type  11：消防输入防区
  // 6  报警柱   alarmClient  actionVideo[0].resource 关联的Resource的Type = 13 报警柱,
  // 7  报警箱   alarmClient  actionVideo[0].resource 关联的Resource的Type = 14 报警箱
  // 8  闸机     设备中 bittype 2
  // 9  解码器   设备中 bittype 5
  // 10 网络键盘 设备中 bittype 6
  // 11 拼接控制器 设备中 bittype 9
  // 12  服务器   serverList
  const numType = parseInt(ctx.params.numtype)
  delete ctx.query.search.numtype
  const id = ctx.params.id
  if (_.isEmpty(id)) {
    ctx.throw(500, { code: 2001, message: '参数不能为空' })
  }
  let select
  function fun1 () {
    // 资源处理方式
    select = {
      rid: id
    }
  }
  function fun2 () {
    // 设备处理方式
    select = {
      eid: id
    }
  }
  function fun3 () {
    // 报警处理方式
    select = {
      aid: id
    }
  }
  caseDevType(numType, fun1, fun2, fun3, ctx)
  ctx.body = await DeviceExtend.findOne(select).exec()
}

// 更新维保信息
exports.assetsUpdate = async ctx => {
  const type = parseInt(ctx.request.body.type)
  const id = ctx.params.id
  const config = ctx.request.body
  if (_.isEmpty(id) || !_.isNumber(type)) {
    ctx.throw(500, { code: 2001, message: '参数不能为空' })
  }
  // 使用到的Schama
  let select
  function fun1 () {
    // 资源处理方式
    select = {
      rid: id
    }
    _.merge(config, {
      rid: id
    })
  }
  function fun2 () {
    // 设备处理方式
    select = {
      eid: id
    }
    _.merge(config, {
      eid: id
    })
  }
  function fun3 () {
    // 报警处理方式
    select = {
      aid: id
    }
    _.merge(config, {
      aid: id
    })
  }
  caseDevType(type, fun1, fun2, fun3, ctx)
  await DeviceExtend.findOneAndUpdate(select, config, { upsert: true })
  ctx.status = 200
}

// 批量添加维保信息
exports.maintenance = async ctx => {
  try {
    if (!_.isInteger(ctx.request.body.config.type)) {
      ctx.throw(500, { code: 2001, message: '参数非法' })
    }
    const type = parseInt(ctx.request.body.config.type)
    const { ids, config } = ctx.request.body
    if (!_.isArray(ids)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    // 使用到的Schama
    await Promise.all(
      ids.map(async item => {
        let select
        function fun1 () {
          // 资源处理方式
          select = {
            rid: item
          }
          _.merge(config, {
            rid: item
          })
        }
        function fun2 () {
          // 设备处理方式
          select = {
            eid: item
          }
          _.merge(config, {
            eid: item
          })
        }
        function fun3 () {
          // 报警处理方式
          select = {
            aid: item
          }
          _.merge(config, {
            aid: item
          })
        }
        caseDevType(type, fun1, fun2, fun3, ctx)
        await DeviceExtend.findOneAndUpdate(select, config, { upsert: true })
      })
    )
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}

// 时间转换
function hourTime (time) {
  const hour = parseInt(time / 3600) % 24
  // const day = parseInt(time / 3600 / 24)
  const minute = parseInt((time - hour * 3600) / 60)
  // const second = time - hour * 3600 - minute * 60
  return hour + '小时' + minute + '分'
}

// 判断设备类型,取不同处理 0,4,5对应资源。1,2,3,8,9,10,11对应设备。6,7对应报警终端
function caseDevType (type, fun1, fun2, fun3, ctx) {
  switch (type) {
    case 0:
    case 4:
    case 5:
      fun1()
      break
    case 1:
    case 2:
    case 3:
    case 8:
    case 9:
    case 10:
    case 11:
      fun2()
      break
    case 6:
    case 7:
      fun3()
      break
    default:
      ctx.throw(500, { code: 2001, message: '参数非法' })
  }
}

// 设备管理表格导出
function assetsXlsx (redata, valueType, tableName) {
  const data = [['设备名称', '所属机构', 'IP地址', '厂商', '设备类型', '建设时间', '维保厂商', '维保状态']]
  const value = [
    ['name', 'eid.oid.name', 'ip', 'eid.manufacturer', 'eid.type', 'createdAt', 'maintenanceVendor', 'insurance'],
    ['name', 'oid.name', 'ip', 'manufacturer', 'type', 'createdAt', 'maintenanceVendor', 'insurance'],
    [
      'name',
      'camerDevId.name',
      'talkIp',
      'camerDevId.manufacturer',
      'camerDevId.type',
      'createdAt',
      'maintenanceVendor',
      'insurance'
    ]
  ]
  // 将设备信息Push到sheet
  redata.forEach(item => {
    let time = _.at(item, [value[valueType][5]])[0] || item._id.getTimestamp()
    const arr = [
      _.at(item, [value[valueType][0]])[0],
      _.at(item, [value[valueType][1]])[0] || '--',
      _.at(item, [value[valueType][2]])[0],
      manufacturer(_.at(item, [value[valueType][3]])[0]),
      tableName,
      moment(time).format('YYYY-MM-DD HH:mm:ss'),
      _.at(item, [value[valueType][6]])[0] || '--',
      _.at(item, [value[valueType][7]])[0] === 1 ? '在保' : '过保'
    ]
    data.push(arr)
  })
  const ColInfos = [{}, {}, {}, {}, {}, {}, {}]
  const option = { '!cols': ColInfos }
  const buffer = xlsx.build([{ name: '资产管理', data }], option)
  return buffer
}

// 匹配厂商名称
function manufacturer (name) {
  let reName
  switch (name) {
    case 'dahua':
      reName = '大华'
      break
    case 'bstar':
      reName = '蓝色星际'
      break
    case 'hikvision':
      reName = '海康'
      break
    case 'onvif':
      reName = 'onvif'
      break
    case 'custom':
      reName = '自定义'
      break
    case 'lida':
      reName = '利达'
      break
    case 'juanxin':
      reName = '巨安信'
      break
    default:
      reName = name
  }
  return reName
}
