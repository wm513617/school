'use strict'

var Org = require('mongoose').model('Org')
var OrgRes = require('mongoose').model('OrgRes')
var Crossing = require('mongoose').model('Crossing')
var Lane = require('mongoose').model('Lane')
const tool = require('../../../common/tools')
var paging = require('../../paging')
var _ = require('lodash')

/**
 * 查询完成树形结构
 */
exports.index = async (ctx, next) => {
  try {
    const resourceDatas = await getResourceTreeDatas(1) // 原始结构挂载的资源
    const corssingDatas = await Crossing.find().exec()
    const laneDatas = await Lane.find().populate({ path: 'resource', populate: { path: 'eid', select: '_id name ip cport manufacturer' } }).exec()
    const laneResourceDatas = [] // 车道资源数组 添加PId 属性
    const laneDatasArr = [] // 去除资源的的车道数据
    _(laneDatas).forEach(n => {
      n = n.toObject()
      if (n.resource && n.resource.hasserver) { // 若hasserver 为true 则进行添加
        n.resource['pid'] = n._id
        laneResourceDatas.push(n.resource)
      }
      n['tag'] = true // 添加tag标签 前台显示用
      delete n.resource
      laneDatasArr.push(n)
    })
    const orgDatas = [...resourceDatas, ...corssingDatas, ...laneDatasArr, ...laneResourceDatas] // 将所有平面的机构数据进行合并

    // const orgDatas = [...resourceDatas] // 将所有平面的机构数据进行合并
    const treeDatas = tool.transData2TreeNew(JSON.parse(JSON.stringify(orgDatas)), '_id', 'pid', ctx.query.pid) // 统一转换为数型结构
    ctx.body = treeDatas
  } catch (err) {
    return ctx.throw(500, { code: 2101, message: err.message })
  }
}

/**
 * 获取路口树
 */
exports.getCrossTree = async (ctx, next) => {
  try {
    const orgs = await Org.find({ type: 1 }, '_id name pid order isroot').sort('order').exec()
    const corssingDatas = await Crossing.find().exec()
    const orgDatas = [...orgs, ...corssingDatas] // 将所有平面的机构数据进行合并
    const treeDatas = tool.transData2TreeNew(JSON.parse(JSON.stringify(orgDatas)), '_id', 'pid', ctx.query.pid) // 统一转换为数型结构
    ctx.body = treeDatas
  } catch (err) {
    return ctx.throw(500, { code: 2101, message: err.message })
  }
}

// /**
//  * 根据机构id查询该机构下路口和设备（不含子机构）
//  */

// exports.orgOne = async (ctx, next) => {
//   const id = ctx.query.id
//   try {
//     const resourceArr = []
//     const resources = await OrgRes.find({org: id}, 'resource')
//     .populate({path: 'resource', select: ['name', '_id', 'eid', 'channelid'], populate: [{ path: 'eid', select: ['ip', 'name']}, {path: 'server', select: 'name'}]}).exec()
//     const crossings = await Crossing.find({pid: id}).exec()
//     _(resources).forEach(n => { // 去除设备对象和服务器对象，放在一个同级对象里  并重命名
//       if (n.resource) { // 资源可能为空
//         n = n.resource.toObject()
//         const tempObj = {eidName: n.eid['name'], eip: n.eid['ip']}
//         delete n.eid
//         if (n.server) {
//           tempObj['serverName'] = n.server['name']
//           tempObj['serverId'] = n.server['_id']
//           delete n.server
//         }
//         const assingObj = _.assign(n, tempObj)
//         resourceArr.push(assingObj)
//       }
//     }
//     )
//     ctx.body = {resources: resourceArr, crossings: crossings}
//   } catch (err) {
//     return ctx.throw(500, {code: -1, message: err.message})
//   }
// }

/**
 * 根据机构id获取资源数据(单层)
 */
exports.getResource = async (ctx, next) => {
  const id = ctx.query.id
  try {
    const resourceArr = []
    const resources = await paging.listQuery(OrgRes, { org: id }, 'resource', {}, ctx.query.page, { path: 'resource', select: ['name', '_id', 'eid', 'channelid'], populate: [{ path: 'eid', select: ['ip', 'name'] }, { path: 'server', select: 'name' }] }, ctx)
    _(resources.results).forEach(n => { // 去除设备对象和服务器对象，放在一个同级对象里  并重命名
      if (n.resource) { // 资源可能为空
        n = n.resource.toObject()
        const tempObj = { eidName: n.eid['name'], eip: n.eid['ip'] }
        delete n.eid
        if (n.server) {
          tempObj['serverName'] = n.server['name']
          tempObj['serverId'] = n.server['_id']
          delete n.server
        }
        const assingObj = _.assign(n, tempObj)
        resourceArr.push(assingObj)
      }
    }
    )
    ctx.status = 200
    ctx.body = resourceArr
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 根据机构id获取路口数据（单层）
 */
exports.getCrossing = async (ctx, next) => {
  const id = ctx.query.id
  try {
    const result = await paging.listQuery(Crossing, { pid: id }, '', { _id: -1 }, ctx.query.page, '', ctx)
    ctx.status = 200
    ctx.body = result.results
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

const getResourceTreeDatas = async (type) => {
  const orgs = await Org.find({ type: type }, '_id name pid order isroot').sort('order').exec()
  const orgids = []
  _(orgs).forEach(n => orgids.push(n._id))

  // const orgresDatasTrue = await OrgRes.find({org: {$in: orgids}, islane: true}).populate('resource').exec() // 仅有智能设备
  const rootOrg = orgs.filter(n => n.isroot)
  const orgresDatas = await OrgRes.find({ rootorg: rootOrg[0]._id }).populate({ path: 'resource', populate: { path: 'eid', select: '_id name ip cport manufacturer' } }).exec() // 全部设备
  const resTrues = []
  _(orgresDatas).forEach(n => { // 获取所有已经绑定资源
    if (n.islane) {
      resTrues.push(n.resource)
    }
  })

  // 去掉所有绑定资源相关数据（islane为true和false 的删除），去掉之后的资源在车道显示（去除重复使用）
  const uniqueOrgData = _.reject(orgresDatas, n => {
    return resTrues.indexOf(n.resource) > -1
  })

  const tempArr = [] // 机构绑定的资源集合
  const orids = []// 绑定机构的ID集合（后面添加tag标签属性用）
  for (const od of uniqueOrgData) {
    if (!_.isEmpty(od.resource)) {
      orids.push(od.org.toString())
      const tempObj = od.resource.toObject()
      tempObj['pid'] = od.org
      tempArr.push(tempObj)
    }
  }
  const tempOrgs = [] // 机构数据集合
  _(orgs).forEach(n => { // 添加tag标签 前台显示用
    const temp = n.toObject()
    if (orids.indexOf(n._id.toString()) > -1) {
      temp['tag'] = true
    }
    tempOrgs.push(temp)
  })
  return [...tempArr, ...tempOrgs]
}
