/*
 * @Author: zhangminbo
 * @Date: 2018-06-05 14:23:18
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-11-05 10:19:57
 */
'use strict'
const mongoose = require('mongoose')
const VerifaceIdentify = mongoose.model('VerifaceIdentify')
const VeriGroup = mongoose.model('VeriGroup')
const Org = mongoose.model('Org')
const OrgRes = mongoose.model('OrgRes')
const { handleSysException } = require('../../../common/tools')
const moment = require('moment')
const sdkInterface = require('../sdk.interface')
const socket = require('../sdkV3.socket')

// 获取识别数据列表
exports.getInitData = async ctx => {
  try {
    const date = moment().format('YYYY-MM-DD')
    const [passers, defenseAlarms, passerNumber, defenseAlarmNumber] = await Promise.all([
      VerifaceIdentify.find({ dateTime: date })
        .sort({ time: -1 })
        .limit(64)
        .lean(),
      VerifaceIdentify.find({ isdefense: true, dateTime: date })
        .sort({ time: -1 })
        .limit(64)
        .lean(),
      VerifaceIdentify.countDocuments({ dateTime: date }).exec(),
      VerifaceIdentify.countDocuments({ isdefense: true, dateTime: date }).exec()
    ])
    ctx.body = { passers, defenseAlarms, passerNumber, defenseAlarmNumber }
  } catch (error) {
    handleSysException(error)
  }
}
exports.getUserTrack = async ctx => {
  try {
    const beginTime = ctx.query.beginTime || moment(moment().format('YYYY-MM-DD')).unix()
    const endTime = ctx.query.endTime || moment().unix()
    const similar = +ctx.query.similar || 75
    const image = ctx.query.image
    const resStr = ctx.query.resStr
    const query = {}
    let results
    const isdefense = ctx.query.isdefense === 'true'
    query.time = { $gte: Number(beginTime), $lte: Number(endTime) }
    if (resStr !== '') {
      query.res = { $in: resStr.split(',') }
    }
    if (isdefense) {
      query.isdefense = true
      query.similar = { $gte: Number(similar) }
      query.userImage = image
      results = await VerifaceIdentify.find(query)
        .populate({ path: 'res', select: 'point', populate: { path: 'point.bid', select: 'loc center' } })
        .sort({ _id: -1 })
        .lean()
    } else {
      const groupIdStrs = await VeriGroup.findOne({ name: '路人库' }).lean()
      const data = await sdkInterface.searchMultiSvrImage(groupIdStrs._id.toString(), image, ctx.query.target, similar)
      const scores = []
      const idIp = []
      data &&
        data.length &&
        data.forEach(obj => {
          obj.groups &&
            obj.groups.forEach(g => {
              g.photos.forEach(m => {
                if (m.score >= similar) {
                  idIp.push(`${m.id}/${obj.host.ip}/${m.tag.split('/').pop()}`)
                  scores.push(m.score.toFixed(0))
                }
              })
            })
        })
      query.idAndTag = { $in: idIp }
      results = await VerifaceIdentify.find(query)
        .populate({ path: 'res', select: 'point', populate: { path: 'point.bid', select: 'loc center' } })
        .sort({ _id: -1 })
        .lean()
      for (let n of results) {
        const i = idIp.indexOf(n.idAndTag)
        n.similar = scores[i]
      }
    }
    ctx.body = results
  } catch (error) {
    handleSysException(error)
  }
}

exports.getUserTrackByUser = async ctx => {
  try {
    const beginTime = ctx.query.beginTime || moment(moment().format('YYYY-MM-DD')).unix()
    const isdefense = ctx.query.isdefense
    const userId = ctx.query.userId
    const query = {
      userId,
      time: { $gte: beginTime }
    }
    isdefense && (query.isdefense = isdefense)
    let results = await VerifaceIdentify.find(query, '', { _id: 1 })
      .populate({ path: 'res', select: 'point', populate: { path: 'point.bid', select: 'loc center' } })
      .lean()
    results = results.filter(record => {
      return record.res.point
    })
    ctx.body = results
  } catch (error) {
    handleSysException(error)
  }
}

exports.update = async ctx => {
  try {
    const id = ctx.params.id
    await VerifaceIdentify.findByIdAndUpdate(id, ctx.request.body)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.alarmInfo = async ctx => {
  try {
    const id = ctx.params.id
    let result = await VerifaceIdentify.findById(id)
      .populate('alarmPlan')
      .exec()
    result = JSON.parse(JSON.stringify(result))
    result.orgStr = await makeOrgStrByRes(result.res)
    result.deal = !!result.alarmPlan
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

/**
 *获取机构名称列表
 * @param {*} resId 当前资源id
 * @param {*} type 机构大类
 * @param {*} s 分隔符
 */
const makeOrgStrByRes = async (resId, type = 6, s = '/') => {
  const orgs = await Org.find({ type: type }).exec()
  const rootOrg = orgs.find(x => x.isroot)
  const data = await OrgRes.findOne({ resource: resId, rootorg: rootOrg._id }).exec()
  return getOrgName(orgs, data.org, s)
}
/**
 *
 * @param {Array} x 机构资源
 * @param {String} orgId 当前机构id
 * @param {String} s 分隔符
 * @param {*} t 临时数据
 */
const getOrgName = (x, orgId, s = '/', t = []) => {
  const co = x.find(x => x._id + '' === orgId + '')
  t.unshift(co.name)
  x.map(n => {
    if (n._id + '' === co.pid + '') {
      if (n.pid) {
        getOrgName(x, n.pid, s, t)
      } else {
        t.unshift(n.name)
      }
    }
  })
  return t.join(s)
}

/**
 * 统计通行人员与布控报警人员的数量并添加到识别数据里
 *
 */
module.exports.staticsPeopleAmount = async () => {
  try {
    // 陌生人通行与布控报警数目统计，随识别人脸信息推送到前端
    const dateTime = moment().format('YYYY-MM-DD')
    const [passerNumber, defenseAlarmNumber] = await Promise.all([VerifaceIdentify.countDocuments({ dateTime }), VerifaceIdentify.countDocuments({ isdefense: true, dateTime })])
    socket.veriFaceStatics({ passerNumber, defenseAlarmNumber })
  } catch (error) {
    throw error
  }
}
