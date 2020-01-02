/**
 * 人员通用查询控制器
 * @time:207-6-27
 * @author:hansen
 */

const mongoose = require('mongoose')
const Face = mongoose.model('Face')
const Resource = mongoose.model('Resource')
const moment = require('moment')
const paging = require('../../paging')
const CONSTANTS = require('../face.constants').FACE
const _ = require('lodash')
const handleSysException = require('../../../common/tools').handleSysException
// 获取记录查询
exports.inquiry = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员抓拍-获取抓拍记录'))
  const search = ctx.query.search
  let sort
  const query = {}
  const paganation = ctx.query.page
  // const fileds = 'username age gender idNumber mold similarity picture resource resourcePoint snapshot snapshotTime'
  const fileds = ' -__v -updatedAt -createdAt -sys'
  try {
    // 接口数据是否为导出
    search.export = search.export || 0
    // 系统类型为抓拍系统
    if (!_.isUndefined(search.sys) && _.isEqual(Number(search.sys), CONSTANTS.SYS.CAPUTRUE)) {
      _.isUndefined(search.type)
        ? query.type = CONSTANTS.PEOPLE.BLACK
        : search.type === 'all'
          ? query.type = CONSTANTS.PEOPLE.UNUSUAL
          : _.indexOf(CONSTANTS.PEOPLE.UNUSUAL, Number(search.type)) >= 0
            ? query.type = Number(search.type)
            : query.type = CONSTANTS.PEOPLE.BLACK
      query.sys = Number(search.sys)
    } else if (!_.isUndefined(search.sys) && _.isEqual(Number(search.sys), CONSTANTS.SYS.PASS)) {
      // 系统类型为通行系统
      _.isUndefined(search.type)
        ? query.type = CONSTANTS.PEOPLE.SUBJECT
        : search.type === 'all'
          ? query.type = CONSTANTS.PEOPLE.NORMAL
          : _.indexOf(CONSTANTS.PEOPLE.NORMAL, Number(search.type)) >= 0
            ? query.type = Number(search.type)
            : query.type = CONSTANTS.PEOPLE.SUBJECT
      query.sys = Number(search.sys)
    } else {
      // 默认 通行系统下的员工
      query.sys = CONSTANTS.SYS.PASS
      query.type = CONSTANTS.PEOPLE.SUBJECT
    }
    // 判断查询类型，如果为陌生人查询，屏蔽一般查询字段
    if (!_.isUndefined(query.type) && !_.isEqual(query.type, CONSTANTS.PEOPLE.STRANGER)) {
      // 查询的参数 用户名 name 处理
      if (search.name) {
        query.username = { $regex: search.name }
      }
      // 查询的参数 性别 gender 处理
      if (search.gender && [CONSTANTS.GENDER.FEMALE, CONSTANTS.GENDER.MALE].includes(Number(search.gender))) {
        query.gender = Number(search.gender)
      }
      // 查询的参数 相似度 similarity 处理
      if (search.similarity && Number(search.similarity) > 0 && Number(search.similarity) < 100) {
        query.similarity = { '$gte': Number(search.similarity) }
      }
      // 年龄查询参数
      if (!_.isEmpty(search.min) && !_.isEmpty(search.max)) {
        query.age = { $gte: Number(search.min), $lte: Number(search.max) }
      } else if (!_.isUndefined(search.min)) {
        query.age = { $gte: Number(search.min) }
      } else if (!_.isUndefined(search.max)) {
        query.age = { $lte: Number(search.max) }
      }
    }
    // 查询的参数 机构 device 处理
    if (!_.isEmpty(search.device)) {
      query.resource = { '$in': search.device }
    }
    // 查询的参数 时间升降序 sort 处理
    if (search.sort) {
      if (search.sort === '0') {
        sort = { snapshotTime: 1 }
      } else if (search.sort === '1') {
        sort = { snapshotTime: -1 }
      }
    } else {
      sort = { snapshotTime: -1 }
    }
    // 查询的参数 相似度排序 simi 处理
    if (search.simi) {
      if (search.simi === '0') {
        sort = { similarity: 1 }
      } else if (search.simi === '1') {
        sort = { similarity: -1 }
      }
    }
    // 时间查询参数
    if (!_.isUndefined(search.start) && !_.isUndefined(search.end)) {
      query.snapshotTime = { $gte: Number(search.start), $lte: Number(search.end) }
    } else if (!_.isUndefined(search.start)) {
      query.snapshotTime = { $gte: Number(search.start) }
    } else if (!_.isUndefined(search.end)) {
      query.snapshotTime = { $lte: Number(search.end) }
    }
    let result = {}
    // 导出数据
    if (Number(search.export) === 1) {
      result.results = await Face.find(query, fileds).populate('resource').sort(sort)
    } else {
      // 分页数据
      result = await paging.listQuery(Face, query, fileds, sort, paganation, 'resource', ctx)
    }
    const data = result.results.map((item) => {
      item = item.toObject()
      if (!_.isNull(item.resource)) {
        item.passway = item.resource.passway === CONSTANTS.PASSWAY.ENTRY
          ? CONSTANTS.ZHPASSWAY.ZHENTRY : item.resource.passway === CONSTANTS.PASSWAY.EXIT
            ? CONSTANTS.ZHPASSWAY.ZHEXIT : item.resource.passway === CONSTANTS.PASSWAY.NORMAL ? CONSTANTS.ZHPASSWAY.ZHNORMAL : ''
      } else {
        item.passway = ''
      }
      delete item.resource
      switch (item.type) {
        case CONSTANTS.PEOPLE.SUBJECT:
          item.type = '员工'
          break
        case CONSTANTS.PEOPLE.VISITOR:
          item.type = '访客'
          break
        case CONSTANTS.PEOPLE.VIP:
          item.type = 'VIP'
          break
        case CONSTANTS.PEOPLE.BLACK:
          item.type = '黑名单'
          break
        case CONSTANTS.PEOPLE.WHITE:
          item.type = '白名单'
          break
        case CONSTANTS.PEOPLE.ATTENTION:
          item.type = '布控'
          break
        default:
          item.type = '陌生人'
      }
      item.gender = item.gender === 0 ? '女性' : '男性'
      item.similarity = Number(item.similarity).toFixed(2)
      return item
    })
    ctx.status = 200
    ctx.body = data
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 获取陌生人记录查询
exports.stranger = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员抓拍-获取陌生人记录'))
  const search = ctx.query.search
  let sort
  const query = {}
  const paganation = ctx.query.page
  const fileds = { resourcePoint: 1, snapshot: 1, snapshotTime: 1 }
  try {
    // 系统类型为抓拍系统
    if (!_.isUndefined(search.sys) && _.isEqual(Number(search.sys), CONSTANTS.SYS.CAPUTRUE)) {
      query.sys = Number(search.sys)
    } else if (!_.isUndefined(search.sys) && _.isEqual(Number(search.sys), CONSTANTS.SYS.PASS)) {
      query.sys = Number(search.sys)
    } else {
      // 默认 通行系统下的员工
      query.sys = CONSTANTS.SYS.PASS
    }
    // 人员类型为陌生人
    query.type = CONSTANTS.PEOPLE.STRANGER
    // 查询的参数 机构 device 处理
    if (!_.isEmpty(search.device)) {
      query.resource = { '$in': search.device }
    }
    // 查询的参数 时间升降序 sort 处理
    if (search.sort) {
      if (search.sort === '0') {
        sort = { snapshotTime: 1 }
      } else if (search.sort === '1') {
        sort = { snapshotTime: -1 }
      }
    } else {
      sort = { snapshotTime: -1 }
    }
    // 查询的参数 相似度排序 simi 处理
    if (search.simi) {
      if (search.simi === '0') {
        sort = { similarity: 1 }
      } else if (search.simi === '1') {
        sort = { similarity: -1 }
      }
    }
    // 时间查询参数
    if (!_.isUndefined(search.start) && !_.isUndefined(search.end)) {
      query.snapshotTime = { $gte: Number(search.start), $lte: Number(search.end) }
    } else if (!_.isUndefined(search.start)) {
      query.snapshotTime = { $gte: Number(search.start) }
    } else if (!_.isUndefined(search.end)) {
      query.snapshotTime = { $lte: Number(search.end) }
    }
    const result = await paging.listQuery(Face, query, fileds, sort, paganation, '', ctx)
    const data = result.results.map((item) => {
      item = item.toObject()
      item.gender = item.gender === 0 ? '女性' : '男性'
      return item
    })
    ctx.status = 200
    ctx.body = data
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 人员轨迹
exports.trajectory = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员抓拍-获取人员轨迹'))
  try {
    const search = ctx.query.search
    const query = {}
    if (_.isUndefined(search.id)) {
      return ctx.throw(500, { code: 2008, message: '参数id必须传入' })
    }
    // 时间查询参数
    if (!_.isUndefined(search.start) && !_.isUndefined(search.end)) {
      query.snapshotTime = { $gte: Number(search.start), $lte: Number(search.end) }
    } else if (!_.isUndefined(search.start)) {
      query.snapshotTime = { $gte: Number(search.start) }
    } else if (!_.isUndefined(search.end)) {
      query.snapshotTime = { $lte: Number(search.end) }
    } else {
      // 默认查询七天之内的
      query.snapshotTime = { $gte: Number(moment(moment().subtract(7, 'd').format('YYYYMMDD')).format('X')) }
    }
    const person = await Face.findById(search.id).populate('resource')
    if (_.isNull(person)) {
      return ctx.throw(500, { code: 2009, message: '参数id错误或者找不到该人员' })
    }
    query.visionId = person.visionId
    let result = []
    if (Number(person.type) === CONSTANTS.PEOPLE.STRANGER) {
      result.push(await Face.findById(search.id, 'resourcePoint snapshotTime resource').populate('resource', 'point'))
    } else {
      result = await Face.find(query, 'resourcePoint snapshotTime resource').populate('resource', 'point').sort({ createdAt: 1 })
    }
    const trajectory = result.map((item) => {
      item = item.toObject()
      item.snapshotTime = moment.unix(Number(item.snapshotTime)).format('YYYY-MM-DD HH:mm:ss')
      return item
    })
    const resource = await Resource.findById(person.resource._id).populate('eid')
    const data = {
      trajectory: trajectory || [],
      record: {
        time: person.snapshotTime,
        device: resource.eid._id,
        channel: person.resource.chan,
        stream: person.resource.stream,
        ip: resource.eid.ip,
        port: resource.eid.cport
      }
    }
    ctx.status = 200
    ctx.body = data
  } catch (err) {
    handleSysException(err, 2002)
  }
}
