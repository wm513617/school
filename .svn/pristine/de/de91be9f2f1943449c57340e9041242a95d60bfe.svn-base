/**
 * 人员通行控制器
 * @time:207-6-27
 * @author:hansen
 */

const mongoose = require('mongoose')
const Face = mongoose.model('Face')
const FaceStatistic = mongoose.model('FaceStatistic')
const KoalaConfig = mongoose.model('KoalaConfig')
const CONSTANTS = require('../face.constants').FACE
const moment = require('moment')
const _ = require('lodash')
const handleSysException = require('../../../common/tools').handleSysException
// 统计对比
exports.contrast = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员通行-获取比对通行记录'))
  const search = ctx.query.search
  const statistic = {
    label: null,
    serise: []
  }
  const query = {}
  let times = []
  let resources, continuity
  // 资源设备
  _.isUndefined(search.res) ? resources = [] : (_.isArray(search.res) ? resources = search.res : resources = [search.res])
  // 时间颗粒度默认值处理
  _.isUndefined(search.granularity)
    ? query.granularity = _.first(CONSTANTS.GRANULARITY.RANGE)
    : _.indexOf(CONSTANTS.GRANULARITY.RANGE, Number(search.granularity)) >= 0 ? query.granularity = Number(search.granularity) : query.granularity = _.first(CONSTANTS.GRANULARITY.RANGE)
  // 时间是否连续默认值处理
  _.isUndefined(search.continuity)
    ? continuity = false
    : _.indexOf(CONSTANTS.CONTINUITY.RANGE, Number(search.continuity)) >= 0
      ? Number(search.continuity) === 0 ? continuity = false : continuity = true
      : continuity = false
  // 通过参数判断输出数据
  _.isUndefined(search.type)
    ? query.type = _.first(CONSTANTS.PEOPLE.NORMALSTATIC)
    : _.indexOf(CONSTANTS.PEOPLE.NORMALSTATIC, Number(search.type)) >= 0 ? query.type = Number(search.type) : query.type = _.first(CONSTANTS.PEOPLE.NORMALSTATIC)
  try {
    // 判断用户传入的时间是否为连续时间.如果为连续时间，需要填充时间节点
    if (continuity) {
      if (_.isArray(search.contrast)) {
        times = getSeriseTime(search.contrast)
      } else {
        if (search.contrast) {
          times.push(search.contrast)
        }
      }
    } else {
      if (_.isArray(search.contrast)) {
        times.push(...search.contrast)
      } else {
        if (search.contrast) {
          times.push(search.contrast)
        }
      }
    }
    if (_.isEmpty(resources) && query.granularity === CONSTANTS.GRANULARITY.HOUR) {
      // 时间类型(某个时间段所有资源)汇总统计查询
      for (const date of times) {
        query.date = Number(date)
        query.summary = CONSTANTS.SUMMARY.MUTILPART
        const result = await FaceStatistic.find(query, 'date hour label statistic', { sort: { hour: 1 } })
        // 初始化数据为空或者查询结果为空
        const data = Array.apply(null, { length: 24 }).fill(0)
        const label = Array.apply(null, { length: 24 }).map((item, index) => index)
        // 如果当日有数据则更新各个时刻的统计数据（如如果是当天则截取当前时间点的统计数据）
        if (!_.isEmpty(result)) {
          result.forEach(item => { data[Number(item.label)] = item.statistic })
          if (result.length !== 24 && _.last(result).date === Number(moment(moment().format('YYYYMMDD')).format('X'))) {
            const curHour = moment().toObject().hours
            label.length = curHour + 1
            data.length = curHour + 1
          }
        }
        statistic.label = statistic.label || label
        statistic.serise.push({ name: date, data: data })
      }
    } else if (_.isEmpty(resources) && query.granularity === CONSTANTS.GRANULARITY.DAY) {
      // 时间类型(某天所有资源)汇总统计查询
      const label = []
      const summary = { name: '', data: [] }
      for (const date of times) {
        query.date = Number(date)
        query.summary = CONSTANTS.SUMMARY.MUTILPART
        const result = await FaceStatistic.findOne(query, 'date label statistic', { sort: { date: 1 } })
        label.push(date)
        if (_.isNull(result) || _.isUndefined(result)) {
          summary.data.push(0)
        } else {
          summary.data.push(result.statistic)
        }
      }
      statistic.label = label
      statistic.serise = summary
    } else {
      const label = []
      const summary = { name: '', data: [] }
      for (const date of times) {
        let total = 0
        for (const res of resources) {
          query.date = Number(date)
          query.summary = CONSTANTS.SUMMARY.SINGLE
          query.resource = res
          const result = await FaceStatistic.findOne(query, 'date label statistic', { sort: { date: 1 } })
          if (!_.isEmpty(result)) {
            total += result.statistic
          }
        }
        label.push(date)
        summary.data.push(total)
      }
      statistic.label = label
      statistic.serise = summary
    }
    ctx.status = 200
    ctx.body = statistic
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 分析传入参数组装时间
const getSeriseTime = ([start, end]) => {
  start = Number(start)
  end = Number(end)
  const serise = [start]
  const lower = moment(start * 1000)
  const upper = moment(end * 1000)
  let max = 0
  try {
    while (true && max < 30) {
      const date = lower.add(1, 'd').format('X')
      if (_.isEqual(date, upper.format('X'))) {
        break
      } else {
        serise.push(Number(date))
      }
      max += 1
    }
    serise.push(end)
    return serise
  } catch (error) {
    console.log(error)
    return [start, end]
  }
}
// 统计园区员工、访客、vip、陌生人的数量
exports.today = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人员通行-获取今日人员统计'))
  try {
    const date = moment().format('YYYYMMDD')
    const time = moment().toObject()
    const compareTime = Number(moment(moment().format('YYYYMMDD HH')).format('X'))
    const type = CONSTANTS.PEOPLE.NORMALSTATIC
    // 获取当前时间前一小时的的统计汇总
    const statistic = await FaceStatistic.aggregate([
      { $match: { date: Number(moment(date).format('X')), granularity: CONSTANTS.GRANULARITY.HOUR, type: { $in: type }, summary: CONSTANTS.SUMMARY.MUTILPART, hour: { $lte: time.hours } } },
      { $group: { _id: '$type', total: { $sum: '$statistic' } } }
    ])
    // 获取当前时间整点到现在的统计汇总(员工、访客、vip)
    const face = []
    const current = Number(moment().format('X'))
    for (const t of _.dropRight(type)) {
      // const count = await Face.countDocuments({ type: t, snapshotTime: { $gte: compareTime } })
      const count = await Face.countDocuments({ type: t, $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }] })
      face.push({ '_id': t, 'total': count })
    }
    // 获取当前时间整点到现在的统计汇总(抓拍系统下的陌生人)
    // const stranger = await Face.countDocuments({ type: CONSTANTS.PEOPLE.STRANGER, sys: CONSTANTS.SYS.PASS, snapshotTime: { $gte: compareTime } })
    const stranger = await Face.countDocuments({ type: CONSTANTS.PEOPLE.STRANGER, sys: CONSTANTS.SYS.PASS, $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }] })

    face.push({ _id: CONSTANTS.PEOPLE.STRANGER, total: stranger })
    // 合并统计数量
    Object.keys(face).forEach((index) => {
      Object.keys(statistic).forEach((key) => {
        if (statistic[key]._id === face[index]._id) {
          face[index].total += statistic[key].total
        }
      })
    })
    const data = { subject: 0, vistor: 0, vip: 0, stranger: 0 }
    if (!_.isEmpty(face)) {
      face.map((item) => {
        switch (item._id) {
          case CONSTANTS.PEOPLE.SUBJECT:
            data.subject = item.total
            return
          case CONSTANTS.PEOPLE.VISITOR:
            data.vistor = item.total
            return
          case CONSTANTS.PEOPLE.VIP:
            data.vip = item.total
            return
          default:
            data.stranger = item.total
        }
      })
    }
    ctx.status = 200
    ctx.body = data
  } catch (err) {
    handleSysException(err, 2002)
  }
}
exports.update = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人脸抓拍-更新人脸服务器配置'))
  try {
    const entity = ctx.request.body
    const result = await KoalaConfig.update({ type: 0 }, entity, { upsert: true })
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      if (!result.nModified) {
        ctx.status = 201
        ctx.headers['location'] = ctx.url + result.upserted[0]._id
        ctx.body = [result.upserted[0]._id]
      } else {
        ctx.status = 200
        ctx.body = ''
      }
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}
exports.get = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人脸抓拍-获取人脸服务器配置'))
  try {
    const result = await KoalaConfig.findOne({ type: 0 })
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}
