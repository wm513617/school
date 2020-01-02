/*
 * @Description: 视频结构化服务器机构资源 controller
 * @Author: wanglei
 * @Date: 2019-06-26 10:57:41
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-06 10:11:23
 */
'use strict'
const { handleSysException, getChildren, transData2Tree } = require('../../../common/tools')
const mongoose = require('mongoose')
const OrgRes = mongoose.model('OrgRes')
const Org = mongoose.model('Org')
const Resource = mongoose.model('Resource')
const StructureServer = mongoose.model('structureserver')
const paging = require('../../paging')
const _ = require('lodash')
const jsts = require('jsts')
const { AnalysisStatusCodeEnum } = require('../structure.enum')
const { ORG_TYPE } = require('../../../common/constant')
const { sendData, unBindResource } = require('../server/structureServer.service')
const { tranformPromiseAll, CONSTANT } = require('../../../common/tools')

// 获取视频结构化的视频资源
exports.getVideoResource = async ctx => {
  try {
    const { oid, never, seek = '', page } = ctx.query
    if (!oid) {
      return ctx.throw(500, {
        code: 1003,
        message: '该机构不存在'
      })
    }
    const orginfo = await Org.findById(oid).exec()
    if (_.isEmpty(orginfo)) {
      return ctx.throw(500, {
        code: 1003,
        message: '该机构不存在'
      })
    }
    let allChildrenIds = [] // 该机构的所有子机构
    if (parseInt(never) === -1) {
      const orgs = await Org.find(
        {
          type: orginfo.type || ORG_TYPE.VIDEO_STRUCTURE
        },
        '_id name pid order'
      )
        .sort('order')
        .exec()
      allChildrenIds = getChildren(allChildrenIds, orgs, oid)
    }
    allChildrenIds.unshift(oid + '')
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
    const conditions = { _id: { $in: _ids } }
    seek && (conditions.name = { $regex: seek })

    const [resResult, online, offline, analyzing, analyzFail] = await Promise.all([
      paging.listQuery(
        Resource,
        conditions,
        '',
        { createdAt: -1 },
        page,
        [
          { path: 'eid', populate: { path: 'oid', select: 'name' } },
          { path: 'videoStructure.structureServer', select: 'ip port' }
        ],
        ctx
      ),
      Resource.countDocuments(Object.assign({}, conditions, { status: 1 })),
      Resource.countDocuments(Object.assign({}, conditions, { status: 0 })),
      Resource.countDocuments(Object.assign({}, conditions, { 'videoStructure.analysisStatus': 1 })),
      Resource.countDocuments(
        Object.assign({}, conditions, {
          $or: [
            { 'videoStructure.analysisStatus': { $in: [0, 2, 3] } },
            { 'videoStructure.structureServer': { $exists: false } }
          ]
        })
      )
    ])
    result = resResult.results
    result = JSON.parse(JSON.stringify(result))
    ctx.set({
      'X-BSC-ONLINE': online,
      'X-BSC-OFFLINE': offline,
      'X-BSC-ANALYZING': analyzing,
      'X-BSC-ANALYZFAIL': analyzFail
    })
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

// 获取单个视频结构化的视频资源
exports.getOneVideoResource = async ctx => {
  try {
    const id = ctx.params.id
    const videoRootOrg = await Org.find({ type: ORG_TYPE.VIDEO_STRUCTURE, isroot: true })
      .lean()
      .exec()
    const [res, orgRes] = await Promise.all([
      Resource.findById(id)
        .populate([{ path: 'eid', select: '' }, { path: 'videoStructure.structureServer', select: 'ip port' }])
        .lean()
        .exec(),
      OrgRes.findOne({ resource: id, rootorg: videoRootOrg })
        .populate('org')
        .lean()
        .exec()
    ])
    res.orgName = orgRes.org.name
    ctx.body = res
  } catch (error) {
    handleSysException(error)
  }
}

// 框选功能获取视频结构化资源
exports.zoneResource = async ctx => {
  try {
    const { sid, wkt } = ctx.request.body
    const VIDEO_TYPE = 0
    const reader = new jsts.io.WKTReader()
    const geo = reader.read(wkt)
    const conditions = {
      point: { $nin: [null, undefined] },
      type: VIDEO_TYPE,
      'videoStructure.structureServer': { $exists: true }
    }
    if (sid) {
      conditions['point.sid'] = sid
    } else {
      conditions['point.isouter'] = true
    }
    let resources = await Resource.find(conditions)
      .populate([{ path: 'videoStructure.structureServer', select: 'ip port' }, { path: 'eid' }])
      .lean()
      .exec()
    resources = resources.filter(item => !['alarmBox', 'alarmPillar'].includes(item.eid.type))
    const resArr = []
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
      const isExists = geo.contains(point)
      if (isExists) {
        resArr.push(item)
      }
    }
    ctx.body = resArr
  } catch (error) {
    handleSysException(error)
  }
}

// 结构化追踪获取全部视频结构化视频资源
exports.getZoneResourceAll = async ctx => {
  try {
    const { mapId } = ctx.query
    const VIDEO_TYPE = 0
    const conditions = {
      point: { $nin: [null, undefined] },
      'point.mapId': mapId,
      'point.isouter': true,
      type: VIDEO_TYPE,
      'videoStructure.structureServer': { $exists: true }
    }
    let resources = await Resource.find(conditions)
      .populate([{ path: 'videoStructure.structureServer', select: 'ip port' }, { path: 'eid', select: 'type' }, { path: 'point.mid' }])
      .lean()
      .exec()
    resources = resources.filter(item => !['alarmBox', 'alarmPillar'].includes(item.eid.type))
    ctx.body = resources
  } catch (error) {
    handleSysException(error)
  }
}

// 获取机构树，过滤已绑定到其他服务器的资源
exports.getTree = async ctx => {
  const { serverId = '' } = ctx.query
  let conditions
  if (serverId) {
    conditions = [
      { videoStructure: { $exists: false } },
      { 'videoStructure.structureServer': { $exists: false } },
      { 'videoStructure.structureServer': { $eq: serverId } }
    ]
  } else {
    conditions = [{ videoStructure: { $exists: false } }, { 'videoStructure.structureServer': { $exists: false } }]
  }
  const treeField =
    'chan name status monitortype stream point eid pinyin nodeId gbPlaDevIp gbPlaDevPort gbDevId gbParentDevId gbPlaNvrId shareServer videoStructure'
  let allChildrenIds = [] // 该机构的所有子机构
  const [allorg, rootorg] = await Promise.all([
    Org.find(
      {
        type: ORG_TYPE.VIDEO_STRUCTURE || ORG_TYPE.LOCALE
      },
      '_id name pid order'
    )
      .sort({ order: -1 })
      .exec(),
    Org.findOne({
      type: ORG_TYPE.VIDEO_STRUCTURE || ORG_TYPE.LOCALE,
      isroot: true
    }).exec()
  ])
  allChildrenIds = getChildren(allChildrenIds, allorg, rootorg._id + '')
  allChildrenIds.unshift(rootorg._id + '')
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
  reses = await Resource.find({ type: ORG_TYPE.LOCALE }, treeField)
    .or(conditions)
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
  const allResIds = _.map(reses, '_id').toString() // 所有的资源数据（这里是为了做查询过滤）
  reses.forEach(item => (resHash[item._id] = item))
  const temp = orgReses.filter(item => {
    return allResIds.indexOf(item.resource + '') !== -1
  })
  temp.forEach(item => {
    !orgResHash[item.org] && (orgResHash[item.org] = [])
    if (resHash[item.resource]) {
      orgResHash[item.org] = [...orgResHash[item.org], resHash[item.resource]]
    }
  })
  try {
    let mainRes, orgRes
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
        item.children = [...item.children, mainRes]
      }
      return item
    })
    const deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v.children) ? deepFlatten(v.children) : v)))
    const treeData = transData2Tree(resultRes, '_id', 'pid', true).pop()
    const arrTemp = deepFlatten(_.get(treeData, 'children', [])).filter(item => item.isOrg !== true)
    ctx.set({
      'X-TREE-TOTAL': arrTemp.length || 0
    })
    ctx.body = treeData
  } catch (error) {
    handleSysException(error)
  }
}

// 批量删除视频资源，同时从视频架构化服务器中解绑资源通道
exports.batchUnbindResource = async ctx => {
  try {
    if (_.isEmpty(ctx.query.type)) {
      ctx.throw(500, { code: 1015, message: '参数有误' })
    }
    const type = Number(ctx.query.type) // 机构类型
    const rootOrg = await Org.findOne({ type, isroot: true }).exec()
    if (_.isEmpty(rootOrg)) {
      return ctx.throw(500, { code: 1015, message: '参数有误' })
    }
    const ids = ctx.accept.headers['x-bsc-ids'].split(',')
    const resources = await Resource.find({ _id: { $in: ids } })
      .populate({ path: 'videoStructure.structureServer', select: 'ip port' })
      .lean()
      .exec()
    // 下联的资源通道不能删除
    if (ids.length) {
      const res = await Resource.findById(ids[0]).lean()
      if (res.nodeId) {
        ctx.throw(500, { code: 1015, message: '下联资源不能删除' })
      }
    }
    let unbindArr = []
    for (let item of resources) {
      unbindArr.push(_batchUnbind(item, rootOrg))
    }
    await Promise.all(unbindArr)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

const _batchUnbind = async (item, rootOrg) => {
  const videoStructure = _.get(item, 'videoStructure', '')
  if (_.get(videoStructure, 'structureServer', '')) {
    const data = {
      server: {
        ip: _.get(videoStructure, 'structureServer.ip', ''),
        port: _.get(videoStructure, 'structureServer.port', '')
      },
      removeResources: [item._id]
    }
    await unBindResource(data)
    await StructureServer.findByIdAndUpdate(videoStructure._id, { $pull: { res: item._id } })
      .lean()
      .exec()
    await OrgRes.deleteMany({
      rootorg: rootOrg._id,
      resource: item._id + ''
    }).exec()
  } else {
    await OrgRes.deleteMany({
      rootorg: rootOrg._id,
      resource: item._id + ''
    }).exec()
  }
}

// 批量启动视频通道分析
exports.batchStartAnalyz = async ctx => {
  try {
    const videoDatas = ctx.request.body
    if (!Array.isArray(videoDatas)) {
      ctx.throw(500, { code: 2001, message: '参数错误' })
    }
    let resourceArr = []
    const startAnalyzArr = videoDatas.map(item => {
      const { resId, channelId, ip, port } = item
      resourceArr.push(Resource.findById(resId, 'name _id').lean().exec())
      const serverData = {
        server: {
          ip: ip,
          port: port
        }
      }
      return _batchStartAnalyz(serverData, resId, channelId)
    })
    resourceArr = await Promise.all(resourceArr)
    const results = await Promise.all(tranformPromiseAll(startAnalyzArr))
    const response = { success: [], fail: [] }
    resourceArr.forEach((resource, index) => {
      if (results[index].status === CONSTANT.RESOLVE) {
        if (Number(results[index].data.errorCode) === 0) {
          response.success.push({ name: resource.name, message: '启动分析成功' })
        } else {
          response.fail.push({ name: resource.name, message: `启动分析失败: ${results[index].data.message}` })
        }
      } else {
        response.fail.push({ name: resource.name, messgae: `启动分析失败: ${results[index].message}` })
      }
    })
    ctx.status = 200
    ctx.body = response
  } catch (error) {
    handleSysException(error)
  }
}

// 批量关闭视频通道分析
exports.batchStopAnalyz = async ctx => {
  try {
    const videoDatas = ctx.request.body
    if (!Array.isArray(videoDatas)) {
      ctx.throw(500, { code: 2001, message: '参数错误' })
    }
    let resourceArr = []
    const stopAnalyzArr = videoDatas.map(item => {
      const { resId, channelId, ip, port } = item
      resourceArr.push(Resource.findById(resId, 'name _id').lean().exec())
      const serverData = {
        server: {
          ip: ip,
          port: port
        }
      }
      return _batchStopAnalyz(serverData, resId, channelId)
    })
    resourceArr = await Promise.all(resourceArr)
    const results = await Promise.all(tranformPromiseAll(stopAnalyzArr))
    const response = { success: [], fail: [] }
    resourceArr.forEach((resource, index) => {
      if (results[index].status === CONSTANT.RESOLVE) {
        if (Number(results[index].data.errorCode) === 0) {
          response.success.push({ name: resource.name, message: '停止分析成功' })
        } else {
          response.fail.push({ name: resource.name, message: `停止分析失败: ${results[index].data.message}` })
        }
      } else {
        response.fail.push({ name: resource.name, messgae: `停止分析失败: ${results[index].message}` })
      }
    })
    ctx.status = 200
    ctx.body = response
  } catch (error) {
    handleSysException(error)
  }
}

const _batchStartAnalyz = async (serverData, resId, channelId) => {
  const postDatas = {
    type: 'addExecute',
    channelId: channelId
  }
  const result = await sendData(serverData, postDatas)
  if (Number(result.errorCode) !== 0) {
    await Resource.findByIdAndUpdate(resId, { 'videoStructure.analysisStatus': AnalysisStatusCodeEnum.ANALYZFAIL })
      .lean()
      .exec()
  } else {
    await Resource.findByIdAndUpdate(resId, { 'videoStructure.analysisStatus': AnalysisStatusCodeEnum.ANALYZING })
      .lean()
      .exec()
  }
  return result
}

const _batchStopAnalyz = async (serverData, resId, channelId) => {
  const postDatas = {
    type: 'removeExecute',
    channelId: channelId
  }
  const result = await sendData(serverData, postDatas)
  if (Number(result.errorCode) !== 0) {
    await Resource.findByIdAndUpdate(resId, { 'videoStructure.analysisStatus': AnalysisStatusCodeEnum.ANALYZFAIL })
  } else {
    await Resource.findByIdAndUpdate(resId, { 'videoStructure.analysisStatus': AnalysisStatusCodeEnum.STOPED })
  }
  return result
}
