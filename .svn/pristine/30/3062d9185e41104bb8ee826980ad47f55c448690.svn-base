/*
 * @Author: linhang
 * @Date: 2018-12-07 09:58:57
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-07-25 14:34:53
 */
'use strict'
const { handleSysException } = require('../../../common/tools')
const mongoose = require('mongoose')
const paramModel = mongoose.model('FaceParameter')
const OrgRes = mongoose.model('OrgRes')
const Org = mongoose.model('Org')
const tool = require('../../../common/tools')
const Resource = mongoose.model('Resource')
const _ = require('lodash')
const paging = require('../../paging')
const singleton = require('../controller/taskController').getSingleton()
const config = require('../../../../config').backend
const moment = require('moment')
const fs = require('fs')
const VerifaceIdentify = mongoose.model('VerifaceIdentify')
const path = require('path')
const VerifaceStatistics = mongoose.model('VerifaceStatistics')
const rp = require('request-promise').defaults({ json: true })
const VeriGroup = mongoose.model('VeriGroup')
const FaceParameter = mongoose.model('FaceParameter')
const FaceServer = mongoose.model('FaceServer')
const { ORG_TYPE } = require('../../../common/constant')
const DefenseTask = mongoose.model('DefenseTask')
/**
 * 获取抓拍参数
 * @param {*} ctx
 */
exports.get = async ctx => {
  try {
    const data = await paramModel.findOne().lean()
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 修改抓拍参数
 * @param {*} ctx
 */
exports.update = async ctx => {
  try {
    const data = ctx.request.body
    const param = await paramModel.findOne().lean()
    // 修改sdk关键参数后，断开所有服务其的链接，并重新链接
    if (param.passby !== data.passby) {
      singleton.reset()
    }
    await paramModel.updateOne({}, data, { upsert: true })
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
// 获取人脸相机资源列表
exports.getFaceResources = async ctx => {
  try {
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
    ).exec()
    const _ids = _.map(result, 'resource')
    const query = { _id: { $in: _ids } }
    ctx.query.seek && (query.name = { $regex: ctx.query.seek || '' })

    const resResult = await paging.listQuery(
      Resource,
      query,
      '',
      { createdAt: -1 },
      ctx.query.page,
      { path: 'eid', populate: { path: 'oid', select: 'name' } },
      ctx
    )
    result = resResult.results
    result = JSON.parse(JSON.stringify(result))
    const websockets = singleton.getSocketIntance()
    // 判断视频通道的流状态
    for (let item of result) {
      item.state = !!websockets[item._id.toString()]
    }
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 编辑人脸视频通道
 * @param {*} ctx
 */
exports.editFaceResource = async ctx => {
  try {
    const id = ctx.query.id
    const faceRootOrg = await Org.find({ type: 6, isroot: true }).lean()
    const [res, orgRes] = await Promise.all([
      Resource.findById(id)
        .populate('eid')
        .lean(),
      OrgRes.findOne({ resource: id, rootorg: faceRootOrg })
        .populate('org')
        .lean()
    ])
    res.orgName = orgRes.org.name
    ctx.body = res
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 获取使用中的人脸镜头
 */
exports.getUsedFaceResources = async ctx => {
  try {
    const orginfo = await Org.findById(ctx.query.oid).exec()
    if (_.isEmpty(orginfo)) {
      return ctx.throw(500, {
        code: 1003,
        message: '该机构不存在'
      })
    }
    let allChildrenIds = [] // 该机构的所有子机构
    if (Number(ctx.query.never) === -1) {
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
      'resource'
    ).exec()
    // 已分配给人脸机构的资源id
    const _ids = result.map(item => item.resource + '')
    // 筛选出已加入布控任务的人脸资源
    const defenseTasks = await DefenseTask.find()
      .lean()
      .exec()

    let defenseResIds = []
    defenseTasks.forEach(item => {
      defenseResIds = defenseResIds.concat(item.points)
    })
    defenseResIds = defenseResIds.map(item => item + '')
    let filterIds = _.intersection(_ids, defenseResIds)
    //  查询服务器绑定了多少视频资源
    const faceServers = await FaceServer.find().lean()
    let bindResIds = []
    faceServers.forEach(item => {
      bindResIds = bindResIds.concat(item.res)
    })
    for (let i in bindResIds) {
      bindResIds[i] = bindResIds[i] + ''
    }
    filterIds = _.intersection(filterIds, bindResIds)
    const query = { _id: { $in: filterIds } }
    ctx.query.seek && (query.name = { $regex: ctx.query.seek || '' })
    // 是否勾选了只显示未配置联动
    if (Number(ctx.query.config) === 1) {
      query.actionConfig = { $exists: false }
    }
    const resResult = await paging.listQuery(
      Resource,
      query,
      '',
      { createdAt: -1 },
      ctx.query.page,
      { path: 'eid', populate: { path: 'oid', select: 'name' } },
      ctx
    )
    const data = resResult.results
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}

/**
 * 删除路人图片存储文件夹
 */
exports.deleteFacePicture = async () => {
  try {
    const exec = require('child_process').exec
    // 删除数据库路人数据
    const param = await paramModel.findOne({}).lean()
    const days = param.saveTime + 1 // 图片保存天数
    // const days = 10
    const milliTime = moment()
      .subtract(days, 'days')
      .format('x')
    const dateTime = moment(Number(milliTime)).format('YYYY-MM-DD') // dateTime格式2019-01-07
    const secondTime = moment(dateTime).format('X')
    await VerifaceStatistics.deleteMany({ date: { $lte: secondTime } }) // 删除保存天数之前的小时统计数据
    // await VerifaceIdentify.deleteMany({ dateTime: { $lte: dateTime } }) // 删除保存天数之前的路人数据
    // 删除路人图片
    const folderPath = config.fileDirs.facePasserPictureDir // /opt/bstar/pic/face/passer 存储路人的文件夹
    const date = moment(Number(milliTime)).format('YYYY-MM-DD')
    const folder = fs.readdirSync(folderPath)
    if (!_.isEmpty(folder)) {
      for (let i in folder) {
        folder[i] = moment(new Date(folder[i])).format('YYYY-MM-DD') // date格式转换2019-1-2 --> 2019-01-02
      }
      const delFolder = folder.filter(item => item <= date) // 过滤出n天前的文件夹
      if (!_.isEmpty(delFolder)) {
        delFolder.forEach(item => {
          item = moment(new Date(item)).format('YYYY-M-D')
          const delFolder = path.join(folderPath, item)
          console.log('删除人脸文件夹：', delFolder)
          exec(`rm -rf ${delFolder}`)
        })
      }
    }
    console.log(`删除${days}天前的路人数据和路人图片`)
  } catch (err) {
    throw err
  }
}
/**
 * 定时删除sdk服务器路人图片
 */
exports.deleteSdkPicture = async () => {
  try {
    const param = await FaceParameter.findOne()
      .lean()
      .exec()
    const days = param.saveTime + 1 // 图片保存天数
    const milliTime = moment()
      .subtract(days, 'days')
      .format('x')
    const dateTime = moment(Number(milliTime)).format('YYYY-MM-DD') // 日期格式2019-02-03
    const data = await VerifaceIdentify.find({ dateTime: { $lte: dateTime } }, 'idAndTag groupImgId')
      .limit(5000)
      .lean()
      .exec()
    const _ids = []
    if (data.length) {
      const group = await VeriGroup.findOne({ name: '路人库' })
        .lean()
        .exec()
      const groupStr = group._id + ''
      for (let i in data) {
        _ids.push(data[i]._id)
        const id = data[i].groupImgId
        if (id) {
          const host = {
            ip: data[i].idAndTag.split('/')[1],
            port: '8061'
          }
          removeServerImage(groupStr, id, host).catch(err => {})
        }
      }
    }
    // 删除这5K条数据
    await VerifaceIdentify.deleteMany({ _id: { $in: _ids } })
  } catch (err) {
    console.log(err)
  }
}
/**
 * 删除sdk图片，group:路人库id,id:图片id
 */
const removeServerImage = (group, id, host) => {
  try {
    if (!id || !host || !group) {
      return
    }
    const option = { uri: `g/${group}/${id}`, method: 'delete', host }
    return req(option)
  } catch (err) {
    throw err
  }
}
/**
 * 删除sdk图片
 * @param {*} options
 */
const req = async options => {
  try {
    const defaults = { timeout: 3600000 }
    options = Object.assign(defaults, options)
    options.uri = `http://${options.host.ip}:${options.host.port}/${options.uri}`
    delete options.host
    return rp(options)
  } catch (err) {
    throw err
  }
}
