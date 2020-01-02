'use strict'

var Crossing = require('mongoose').model('Crossing')
var OrgRes = require('mongoose').model('OrgRes')
var Org = require('mongoose').model('Org')
var Lane = require('mongoose').model('Lane')
// var Resource = require('mongoose').model('Resource')
var request = require('request')
var paging = require('../../paging')
var ServerSetting = require('mongoose').model('ServerSetting')
var _ = require('lodash')

/**
 * 查询单个路口信息
 */
exports.findlanes = async (ctx, next) => {
  const id = ctx.params.id
  try {
    const result = await paging.listQuery(Lane, { pid: id }, '', {}, ctx.query.page, { path: 'resource', select: ' name server', populate: { path: 'server' } }, ctx)
    const results = []
    _(result.results).forEach(n => { // 添加出入口定义
      let tempObj = n
      if (n.resource) {
        tempObj = n.toObject()
        // tempObj['passway'] = n.resource.passway
        tempObj['resource'] = n.resource._id
        tempObj.resourceName = n.resource.name
        if (n.resource.server) { // 添加服务器名称
          tempObj.serverName = n.resource.server.name
        }
      }
      results.push(tempObj)
    })
    ctx.status = 200
    ctx.body = results
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 批量路口删除
 */
exports.destroyBatch = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-批量删除路口'))
  const ids = ctx.request.header['x-bsc-ids'].split(',') || []
  try {
    const preRemoveDatas = await Lane.find({ pid: { $in: ids } }, 'resource').exec() // 查处需要删除的车道数据
    const tempArr = []
    const resTempArr = []
    _(preRemoveDatas).forEach(n => {
      tempArr.push(n._id)
      resTempArr.push(n.resource)
    })
    await Lane.deleteMany({ _id: { $in: tempArr } }) // 删除该路口对应的车道
    await OrgRes.deleteMany({ resource: { $in: resTempArr }, islane: true }) // 删除路口对应的机构资源中间数据
    await Crossing.deleteMany({ _id: { $in: ids } }) // 删除路口
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}
/**
 * 路口删除
 */
exports.destroy = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-删除路口'))
  const id = ctx.params.id
  try {
    const preRemoveDatas = await Lane.find({ pid: id }, 'resource').exec() // 查处需要删除的车道数据
    const tempArr = []
    const resTempArr = []
    _(preRemoveDatas).forEach(n => {
      tempArr.push(n._id)
      resTempArr.push(n.resource)
    })
    await Lane.deleteMany({ _id: { $in: tempArr } }) // 删除该路口对应的车道
    await OrgRes.deleteMany({ resource: { $in: resTempArr }, islane: true }) // 删除路口对应的机构资源中间数据
    await Crossing.findByIdAndRemove(id) // 删除路口
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 修改车道信息
 */
exports.updateLane = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-修改车道'))
  const id = ctx.params.id
  const updateObj = ctx.request.body
  try {
    // await Resource.findByIdAndUpdate(updateObj.resource, {passway: updateObj.passway}) // 修改出入口定义
    const oldDatas = await Lane.findByIdAndUpdate({ _id: id }, updateObj) // 车道修改保存
    const orgObj = await Org.findOne({ type: 1, isroot: true }).exec() // 查询顶级父类
    // const crossingObj = await Crossing.findById(updateObj.pid, '_id pid').exec() // 获取组织机构Id
    // 删除旧的
    await OrgRes.deleteMany({ resource: oldDatas.resource, rootorg: orgObj._id, islane: true })
    // 创建新的
    const crossObj = await Crossing.findById(updateObj.pid).exec() // 查询上级路口数据
    await OrgRes.create({ resource: updateObj.resource, rootorg: orgObj._id, org: crossObj.pid, islane: true })

    // ctx.body = result
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

// ---------------------------------------------方案一：新增路口时添加车道数自动生成相应的车道数据-----------------------------------------

/**
 * 获取路口信息列表
 */
exports.index = async (ctx, next) => {
  const search = ctx.query.search
  try {
    const results = await paging.listQuery(Crossing, search, '', { _id: 1 }, ctx.query.page, 'lanes', ctx)
    ctx.body = results.results
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message, type: 3 })
  }
}

/**
 * 获取路口下拉框数据
 */
exports.list = async (ctx, next) => {
  try {
    const results = await Crossing.find({}, '_id name').exec()
    ctx.body = results
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 新增路口信息
 */
exports.create = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-新增路口'))
  const newCrossing = ctx.request.body
  try {
    const crossing = await Crossing.create(newCrossing)
    // 根据输入的车道数量，新增相应数量的默认车道
    const tempArr = []
    for (var i = 1; i <= newCrossing.laneNumber; i++) {
      tempArr.push({ name: '车道' + i, pid: crossing._id, direction: '' })
    }
    await Lane.create(tempArr) // 保存车道数据

    ctx.status = 201
    ctx.body = crossing
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}
/**
 * 路口修改
 */
exports.update = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-修改路口'))
  const id = ctx.params.id

  const updateObj = ctx.request.body
  try {
    const oldObj = await Crossing.findById(id).exec() // 查询旧车道数据
    const caseNumber = updateObj.laneNumber - oldObj.laneNumber // 新老车道数差值
    const tempLanesArr = []

    // 若路口车道数大于之前车道数 则添加车道
    if (caseNumber > 0) {
      for (var i = oldObj.laneNumber + 1; i <= updateObj.laneNumber; i++) {
        tempLanesArr.push({ name: '车道' + i, pid: id })
      }
      await Lane.create(tempLanesArr) // 车道表添加数据
    }

    // 若路口车道数小于之前车道数 则去掉后面的车道
    if (caseNumber < 0) {
      const lanedatas = await Lane.find({ pid: id }, '_id resource').sort({ _id: -1 }).limit(Math.abs(caseNumber)).exec()
      const tempIdArr = []
      const tempResourceArr = []
      _(lanedatas).forEach(n => {
        tempIdArr.push(n._id)
        tempResourceArr.push(n.resource)
      })
      await OrgRes.deleteMany({ resource: { $in: tempResourceArr }, islane: true }) // 删除机构资源中间表
      await Lane.deleteMany({ _id: { $in: tempIdArr } }) // 删除最后几条车道数
    }
    // 保存保存
    await Crossing.findByIdAndUpdate(id, updateObj)
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 获取车型方向列表
 */
exports.getDirection = async (ctx, next) => {
  try {
    const dircttionDatas = await Lane.find({}, 'direction').exec()
    const tempArr = []
    _(dircttionDatas).forEach(n => {
      if (n.direction) {
        tempArr.push(n.direction)
      }
    })
    ctx.body = _.uniq(tempArr)
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 获取车辆视频号下拉数据
 * 若传id 则显示包括本身(修改)，否则新增
 */
exports.getChannelIds = async (ctx, next) => {
  const curChenid = ctx.query.id
  const serid = ctx.query.serid
  try {
    const rootId = (await Org.findOne({ type: 1, isroot: true }).exec())._id
    const orgResData = await OrgRes.find({ rootorg: rootId }).populate({ path: 'resource', select: 'channelid' }).exec()
    // const resourceData = await Resource.find({channelid: {$gt: 0}}, 'channelid').exec()
    const usedChenids = []
    // for (const n of resourceData) {
    //   if (n.channelid !== curChenid * 1) usedChenids.push(n.channelid)
    // }
    for (const n of orgResData) {
      if (n.resource && n.resource.channelid !== curChenid * 1) { usedChenids.push(n.resource.channelid) }
    }
    const serverData = await ServerSetting.findOne({ _id: serid, type: 1 }, 'ip webport').exec() // 读取服务器配置获取ip和端口
    let recResult = []
    if (serverData) {
      recResult = await new Promise((resolve, reject) => {
        request.get('http://' + serverData.ip + ':' + serverData.webport + '/business/channelconfig.php?type=get',
          (errors, response, body) => {
            if (errors) {
              reject(errors.message)
            } else {
              const data = JSON.parse(body).data
              const resultData = []
              data.forEach(n => {
                if (n) {
                  n.children.forEach(x => {
                    if (usedChenids.indexOf(x.channelId) === -1) { resultData.push({ value: x.channelId, label: x.channelName }) }
                  })
                }
              })
              resolve(resultData)
            }
          })
      })
    }
    ctx.body = recResult
  } catch (error) {
    const errorObj = { code: 2101, message: error.message || error }
    if (!error.message) { errorObj.type = 'sys' }
    return ctx.throw(500, errorObj)
  }
}

exports.getAllChannelIds = async (ctx, next) => {
  try {
    const serverData = await ServerSetting.find({ type: 1 }, 'ip webport').exec() // 读取服务器配置获取ip和端口
    const resultObj = {}
    const recResult = await new Promise((resolve, reject) => {
      serverData.forEach(n => {
        request.get('http://' + n.ip + ':' + n.webport + '/business/channelconfig.php?type=get',
          (errors, response, body) => {
            if (errors) {
              reject(errors.message)
            } else {
              const data = JSON.parse(body).data
              data.forEach(n => {
                if (n) {
                  n.children.forEach(x => {
                    resultObj[x.channelId] = x.channelName
                  })
                }
              })
              resolve(resultObj)
            }
          })
      })
    })
    ctx.body = recResult
  } catch (error) {
    const errorObj = { code: 2101, message: error.message || error }
    if (!error.message) { errorObj.type = 'sys' }
    return ctx.throw(500, errorObj)
  }
}

/**
 * 检查路口名称标号唯一性
 */
exports.checkcross = async (ctx, next) => {
  try {
    const searchObj = { pid: ctx.query.pid }
    if (ctx.query.id) { searchObj._id = { $ne: ctx.query.id } }
    const result = {}
    if (ctx.query.name) {
      searchObj.name = decodeURIComponent(ctx.query.name)
      // const reg = new RegExp(decodeURIComponent(ctx.query.name))
      // searchObj.name = reg
      result.name = !!await Crossing.count(searchObj).exec()
    }
    if (ctx.query.code) {
      searchObj.code = ctx.query.code
      result.code = !!await Crossing.count(searchObj).exec()
    }
    ctx.body = result
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 检查车道名称标号唯一性
 */
exports.checklane = async (ctx, next) => {
  try {
    const searchObj = { pid: ctx.query.pid }
    if (ctx.query.id) { searchObj._id = { $ne: ctx.query.id } }
    const result = {}
    if (ctx.query.name) {
      const reg = new RegExp(decodeURIComponent(ctx.query.name))
      searchObj.name = reg
      result.name = !!await Lane.count(searchObj).exec()
    }
    if (ctx.query.code) {
      searchObj.code = ctx.query.code
      result.code = !!await Lane.count(searchObj).exec()
    }
    ctx.body = result
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 机构检查路口是否可删除
 */
exports.orgCheckCross = async (orgId) => {
  return !await Crossing.countDocuments({ pid: orgId }).exec()
}
