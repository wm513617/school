/**
 * 人员布控控制器
 * @time:207-6-27
 * @author:hansen
 */

const mongoose = require('mongoose')
const Face = mongoose.model('Face')
const FaceStatistic = mongoose.model('FaceStatistic')
const FaceFeature = mongoose.model('FaceFeaStatic')
const People = mongoose.model('People')
const Org = mongoose.model('Org')
const OrgRes = mongoose.model('OrgRes')
const Resource = mongoose.model('Resource')
const moment = require('moment')
const CONSTANTS = require('../face.constants').FACE
const _ = require('lodash')
const handleSysException = require('../../../common/tools').handleSysException
const Feature = require('mongoose').model('FaceFeaStatic')

const getDb = require('../../../common/logdb')
const PeopleCountLogSchema = new mongoose.Schema({
  insidepeople: Number,
  exitpeople: Number,
  vendor: Number,
  starttime: Number,
  devPort: Number,
  endtime: Number,
  enterpeople: Number,
  devIp: String
})
const AlarmLogSchema = new mongoose.Schema({
  eventType: String,
  time: Number
})

// 统计对比
exports.contrast = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('人脸抓拍-人脸统计对比信息'))
  const search = ctx.query.search
  const statistic = {
    label: null,
    serise: []
  }
  const query = {}
  let times = []
  let resources, continuity
  // 资源设备
  _.isUndefined(search.res)
    ? (resources = [])
    : _.isArray(search.res)
      ? (resources = search.res)
      : (resources = [search.res])
  // 时间颗粒度默认值处理
  _.isUndefined(search.granularity)
    ? (query.granularity = _.first(CONSTANTS.GRANULARITY.RANGE))
    : CONSTANTS.GRANULARITY.RANGE.includes(Number(search.granularity))
      ? (query.granularity = Number(search.granularity))
      : (query.granularity = _.first(CONSTANTS.GRANULARITY.RANGE))
  // 时间是否连续默认值处理
  _.isUndefined(search.continuity)
    ? (continuity = false)
    : CONSTANTS.CONTINUITY.RANGE.includes(Number(search.continuity))
      ? Number(search.continuity) === 0
        ? (continuity = false)
        : (continuity = true)
      : (continuity = false)
  // 通过参数判断输出数据
  _.isUndefined(search.type)
    ? (query.type = _.first(CONSTANTS.PEOPLE.UNUSUALSTATIC))
    : CONSTANTS.PEOPLE.UNUSUALSTATIC.includes(Number(search.type))
      ? (query.type = Number(search.type))
      : (query.type = _.first(CONSTANTS.PEOPLE.UNUSUALSTATIC))
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
        // 如果当日有数据则更新各个时刻的统计数据（如果是当天则截取当前时间点的统计数据）
        if (!_.isEmpty(result)) {
          result.forEach(item => {
            data[Number(item.label)] = item.statistic
          })
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
  if (start === end) {
    return serise
  }
  try {
    while (true && max <= 30) {
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
// 获取统计园区概况
exports.outline = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('首页-获取统计园区概况'))
  try {
    // 获取热点区域统计
    const spot = await hotspot()
    // 获取入园、出园统计
    const garden = await park()
    const date = moment().format('YYYYMMDD')
    // 获取布控总数
    const attentionCout = await People.countDocuments({
      type: CONSTANTS.PEOPLE.ATTENTION,
      status: CONSTANTS.ATTENTION.GOING
    })
    // 获取今天到目前布控人员发现数量
    const attentionFind = await Face.countDocuments({
      snapshotTime: { $gte: Number(moment(date).format('X')) },
      type: CONSTANTS.PEOPLE.ATTENTION
    })
    const time = moment().toObject()
    // 类型列表:员工、访客、陌生人
    const type = [CONSTANTS.PEOPLE.SUBJECT, CONSTANTS.PEOPLE.VISITOR, CONSTANTS.PEOPLE.STRANGER]
    const compareTime = Number(moment(moment().format('YYYYMMDD HH')).format('X'))
    // 获取当前时间整点之前员工、访客、陌生人分类统计 陌生人（按时间统计是通行系统的陌生人）
    const aggregate = await FaceStatistic.aggregate([
      {
        $match: {
          date: Number(moment(date).format('X')),
          type: { $in: type },
          granularity: CONSTANTS.GRANULARITY.HOUR,
          summary: CONSTANTS.SUMMARY.MUTILPART,
          hour: { $lte: time.hours }
        }
      },
      { $group: { _id: '$type', total: { $sum: '$statistic' } } }
    ])
    // 获取当前时间整点到现在的员工、访客、陌生人分类统计
    const face = []
    // for (const t of type) {
    //   let count = 0
    //   if (t === CONSTANTS.PEOPLE.STRANGER) {
    //     // 如果是陌生人只获取通行系统的陌生人
    //     count = await Face.countDocuments({ type: t, snapshotTime: { $gte: compareTime }, sys: CONSTANTS.SYS.PASS })
    //   } else {
    //     count = await Face.countDocuments({ type: t, snapshotTime: { $gte: compareTime } })
    //   }
    //   face.push({ '_id': t, 'total': count })
    // }
    const current = Number(moment().format('X'))
    for (const t of type) {
      let count = 0
      if (t === CONSTANTS.PEOPLE.STRANGER) {
        // 如果是陌生人只获取通行系统的陌生人
        count = await Face.countDocuments({
          type: t,
          $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }],
          sys: CONSTANTS.SYS.PASS
        })
      } else {
        count = await Face.countDocuments({
          type: t,
          $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }]
        })
      }
      face.push({ _id: t, total: count })
    }
    // 获取当前时间的员工、访客、陌生人分类统计汇总
    Object.keys(face).forEach(index => {
      Object.keys(aggregate).forEach(key => {
        if (aggregate[key]._id === face[index]._id) {
          face[index].total += aggregate[key].total
        }
      })
    })
    const statistic = {
      hotspot: spot,
      outline: {
        entry: garden.some(item => item.name === 'entry') ? garden.find(item => item.name === 'entry').total : 0,
        exit: garden.some(item => item.name === 'exit') ? garden.find(item => item.name === 'exit').total : 0,
        attention: attentionCout,
        find: attentionFind
      },
      category: {
        label: ['访客人数', '陌生人数', '员工人数'],
        serise: [
          {
            name: '访客人数',
            data: [
              face.some(item => item._id === CONSTANTS.PEOPLE.VISITOR)
                ? face.find(item => item._id === CONSTANTS.PEOPLE.VISITOR).total
                : 0
            ]
          },
          {
            name: '陌生人数',
            data: [
              face.some(item => item._id === CONSTANTS.PEOPLE.STRANGER)
                ? face.find(item => item._id === CONSTANTS.PEOPLE.STRANGER).total
                : 0
            ]
          },
          {
            name: '员工人数',
            data: [
              face.some(item => item._id === CONSTANTS.PEOPLE.SUBJECT)
                ? face.find(item => item._id === CONSTANTS.PEOPLE.SUBJECT).total
                : 0
            ]
          }
        ]
      }
    }
    ctx.status = 200
    ctx.body = statistic
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取人员流动趋势
exports.trend = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('首页-获取人员流动趋势'))
  try {
    const now = moment()
    const statistic = {
      label: null,
      serise: []
    }
    const date = Number(moment(now.format('YYYYMMDD')).format('X'))
    const hour = now.toObject().hours
    // 获取人脸组织所有节点
    const orgs = await Org.find({ type: CONSTANTS.ORG.FACE }, '_id')
    const orgIds = orgs.map(item => item._id)
    // 获取所有资源中入园、出园的资源
    const orgRes = await OrgRes.find({ org: { $in: orgIds } }).populate('resource', 'passway')
    const collection = {
      entry: [], // 入园
      exit: [] // 出园
    }
    // 过滤资源只查找出口入口资源
    orgRes.forEach(item => {
      if (item.resource) {
        if (item.resource.passway === CONSTANTS.PASSWAY.ENTRY) {
          collection.entry.push(item.resource._id)
        } else if (item.resource.passway === CONSTANTS.PASSWAY.EXIT) {
          collection.exit.push(item.resource._id)
        }
      }
    })
    // 获取统计 摄像机在某个时刻段中拍摄到统计综合
    for (const list of Object.keys(collection)) {
      let interator = 0
      const label = []
      const data = []
      while (interator <= hour) {
        const result = await FaceStatistic.aggregate([
          {
            $match: {
              date: date,
              granularity: CONSTANTS.GRANULARITY.HOUR,
              summary: CONSTANTS.SUMMARY.SINGLE,
              hour: interator,
              resource: { $in: collection[list] }
            }
          },
          { $group: { _id: { hour: '$hour', resourceName: '$resourceName' }, total: { $sum: '$statistic' } } },
          { $limit: 1 }
        ])
        if (_.isEmpty(result)) {
          label.push(interator)
          data.push(0)
        } else {
          label.push(result[0]._id.hour)
          data.push(result[0].total)
        }
        interator += 1
      }
      if (!statistic.label && !_.isEmpty(label)) {
        statistic.label = label
      }
      statistic.serise.push({ name: list, data: data })
    }
    ctx.status = 200
    ctx.body = statistic
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 人员特征分析
exports.feature = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('首页-人员特征分析'))
  try {
    const date = moment().format('YYYYMMDD')
    const result = await FaceFeature.findOne({ date: Number(moment(date).format('X')) })
    const statistic = [
      {
        label: ['男性', '女性'],
        serise: [
          {
            name: '男性',
            data: [_.isNull(result) ? 0 : result.male]
          },
          {
            name: '女性',
            data: [_.isNull(result) ? 0 : result.female]
          }
        ]
      },
      {
        label: ['0-30', '30-50', '50以上'],
        serise: [
          {
            name: '0-30',
            data: [_.isNull(result) ? 0 : result.level0 + result.level1 + result.level2]
          },
          {
            name: '30-50',
            data: [_.isNull(result) ? 0 : result.level3 + result.level4]
          },
          {
            name: '50以上',
            data: [_.isNull(result) ? 0 : result.level5 + result.level6 + result.level7 + result.level8 + result.level9]
          }
        ]
      }
    ]

    ctx.status = 200
    ctx.body = statistic
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 统计园区黑名单、白名单、对比数、布控人员的数量
exports.today = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('首页-统计园区黑名单、白名单、对比数、布控人员的数量'))
  try {
    const date = moment().format('YYYYMMDD')
    const time = moment().toObject()
    const type = CONSTANTS.PEOPLE.UNUSUALSTATIC
    const compareTime = Number(moment(moment().format('YYYYMMDD HH')).format('X'))
    // 获取当前时间前一小时的的统计汇总
    const statistic = await FaceStatistic.aggregate([
      {
        $match: {
          date: Number(moment(date).format('X')),
          type: { $in: type },
          granularity: CONSTANTS.GRANULARITY.HOUR,
          summary: CONSTANTS.SUMMARY.MUTILPART,
          hour: { $lte: time.hours }
        }
      },
      { $group: { _id: '$type', total: { $sum: '$statistic' } } }
    ])
    // 获取当前时间整点到现在的统计汇总(黑名单、白名单、布控人员)
    const face = []
    const current = Number(moment().format('X'))
    for (const t of _.dropRight(type)) {
      // const count = await Face.countDocuments({ type: t, snapshotTime: { $gte: compareTime } })
      const count = await Face.countDocuments({
        type: t,
        $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }]
      })
      face.push({ _id: t, total: count })
    }
    // 获取当前时间整点到现在的统计汇总(抓拍系统下的陌生人)
    // const stranger = await Face.countDocuments({ type: CONSTANTS.PEOPLE.STRANGER, sys: CONSTANTS.SYS.CAPUTRUE, snapshotTime: { $gte: compareTime } })
    const stranger = await Face.countDocuments({
      type: CONSTANTS.PEOPLE.STRANGER,
      sys: CONSTANTS.SYS.CAPUTRUE,
      $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }]
    })
    const amount = face.reduce((sum, item) => sum + item.total, 0)
    face.push({ _id: CONSTANTS.PEOPLE.COMPARSION, total: amount + stranger })
    // 合并统计数量
    Object.keys(face).forEach(index => {
      Object.keys(statistic).forEach(key => {
        if (statistic[key]._id === face[index]._id) {
          face[index].total += statistic[key].total
        }
      })
    })
    const data = { black: 0, white: 0, attention: 0, comparsion: 0 }
    if (!_.isEmpty(face)) {
      face.map(item => {
        switch (item._id) {
          case CONSTANTS.PEOPLE.BLACK:
            data.black = item.total
            return
          case CONSTANTS.PEOPLE.WHITE:
            data.white = item.total
            return
          case CONSTANTS.PEOPLE.ATTENTION:
            data.attention = item.total
            return
          default:
            data.comparsion = item.total
        }
      })
    }
    ctx.status = 200
    ctx.body = data
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 统计园区热点区域
const hotspot = async () => {
  const now = moment()
  const statistic = []
  const date = Number(moment(now.format('YYYYMMDD')).format('X'))
  // 获取0点到现在整点的时间分布
  const hours = Array.apply(null, { length: now.toObject().hours + 1 })
    .fill(0)
    .map((item, index) => index)
  try {
    for (const hour of hours) {
      let result = []
      // 去除 0时的统计
      if (hour !== 0) {
        result = await FaceStatistic.aggregate([
          {
            $match: {
              date: date,
              granularity: CONSTANTS.GRANULARITY.HOUR,
              summary: CONSTANTS.SUMMARY.SINGLE,
              hour: hour,
              $or: [{ type: { $in: [CONSTANTS.PEOPLE.COMPARSION] } }, { type: { $in: CONSTANTS.PEOPLE.NORMALSTATIC } }]
            }
          },
          { $group: { _id: { resource: '$resource', resourceName: '$resourceName' }, total: { $sum: '$statistic' } } },
          { $sort: { total: -1 } },
          { $limit: 1 }
        ])
      }
      if (result.length > 0) {
        const res = _.first(result)
        statistic.push({
          name: hour - 1 + ':00' + '-' + hour + ':00',
          point: res._id.resourceName,
          total: res.total,
          image: ''
        })
      }
    }
    // 获取人流量最大的八个时间段的位置
    const data = _.orderBy(statistic, ['total'], ['desc'])
    if (data.length > 8) {
      data.length = 8
    }
    return data
  } catch (error) {
    console.log(error)
  }
}
// 统计园区入园出园人数
const park = async () => {
  try {
    const now = moment()
    const statistic = []
    const hour = now.toObject().hours
    // 获取人脸组织所有节点
    const orgs = await Org.find({ type: CONSTANTS.ORG.FACE }, '_id')
    const orgIds = orgs.map(item => item._id)
    // 获取所有资源中入园、出园的资源
    const orgRes = await OrgRes.find({ org: { $in: orgIds } }).populate('resource', 'passway')
    const collection = {
      entry: [], // 入园
      exit: [] // 出园
    }
    // 过滤资源只查找出口入口资源
    orgRes.forEach(item => {
      if (item.resource) {
        if (item.resource.passway === CONSTANTS.PASSWAY.ENTRY) {
          collection.entry.push(item.resource._id)
        } else if (item.resource.passway === CONSTANTS.PASSWAY.EXIT) {
          collection.exit.push(item.resource._id)
        }
      }
    })
    const compareTime = Number(moment(moment().format('YYYYMMDD HH')).format('X'))
    const current = Number(moment().format('X'))
    // 获取统计 摄像机在某个时刻段中拍摄到统计综合
    for (const list of Object.keys(collection)) {
      const result = await FaceStatistic.aggregate([
        {
          $match: {
            date: Number(moment(now.format('YYYYMMDD')).format('X')),
            granularity: CONSTANTS.GRANULARITY.HOUR,
            summary: CONSTANTS.SUMMARY.SINGLE,
            hour: { $lte: hour },
            resource: { $in: collection[list] }
          }
        },
        { $group: { _id: '$date', total: { $sum: '$statistic' } } }
      ])
      // const count = await Face.countDocuments({ resource: { $in: collection[list] }, snapshotTime: { $gte: compareTime } })
      const count = await Face.countDocuments({
        resource: { $in: collection[list] },
        $and: [{ snapshotTime: { $gte: compareTime } }, { snapshotTime: { $lte: current } }]
      })
      // 系统初始化 没有统计数据
      if (!_.isEmpty(result)) {
        statistic.push({ name: list, total: _.first(result).total + count })
      } else {
        statistic.push({ name: list, total: count })
      }
    }
    return statistic
  } catch (error) {
    console.log(error)
  }
}

// 双目ipc出入统计
exports.outin = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('首页-双目ipc出入统计'))
  try {
    const db = await getDb()
    const PeopleCountLog = db.model('PeopleCountLog', PeopleCountLogSchema, 'PeopleCountLog')
    const resId = ctx.query.search.res || ''
    const [time, hour] = moment()
      .format('YYYY-M-D HH')
      .split(' ')
    if (_.isEmpty(resId)) {
      ctx.throw(500, { code: 2001, message: '资源参数不存在！' })
    }
    const res = await Resource.findById(resId).lean()
    const count = await PeopleCountLog.find({
      devIp: res.ip,
      devPort: res.port,
      channel: res.chan,
      timeday: time,
      $and: [{ timepoint: { $gte: 6 } }, { timepoint: { $lte: Number(hour) > 21 ? 21 : Number(hour) } }]
    })
      .sort({ timepoint: 1 })
      .lean()
    const label = Array.apply(null, { length: 16 })
      .fill(0)
      .map((item, index) => index + 6 + ':00')
    const result = {}
    result.label = label
    result.serise = [{ name: '进入人数', data: [] }, { name: '离开人数', data: [] }, { name: '内部人数', data: [] }]
    for (const item of count) {
      result.serise[0].data.push(item.enterpeople)
      result.serise[1].data.push(item.exitpeople)
      result.serise[2].data.push(item.insidepeople)
    }
    ctx.body = result
  } catch (err) {
    handleSysException(err)
  }
}

exports.intelligence = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('首页-智能事件统计'))
  try {
    const db = await getDb()
    const AlarmLog = db.model('AlarmLog', AlarmLogSchema, 'AlarmLog')
    const label = []
    const hour = moment().toObject().hours
    const today = Number(moment(moment().format('YYYY-MM-DD')).format('X'))
    const tomorrow = Number(
      moment(
        moment()
          .add(1, 'd')
          .format('YYYY-MM-DD')
      ).format('X')
    )
    const hotspot = { hotspot1: [], hotspot2: [], hotspot3: [] }
    let count = 0
    // 获取当前时间到凌晨的统计数
    while (count <= hour) {
      label.push(_.padStart(count.toString(), 2, '0') + ':00')
      hotspot.hotspot1.push(Number(parseInt(Math.random() * 1000)))
      hotspot.hotspot2.push(Number(parseInt(Math.random() * 1000)))
      hotspot.hotspot3.push(Number(parseInt(Math.random() * 1000)))
      count++
    }
    const [
      tripwire,
      regionalInvasion,
      leftObject,
      rapidMovement,
      ParkingDetection,
      peopleGathering,
      RemoveObject,
      linger
    ] = await Promise.all([
      AlarmLog.countDocuments({
        eventType: 'tripwire',
        $and: [{ time: { $gte: today } }, { time: { $lt: tomorrow } }]
      }).exec(),
      AlarmLog.countDocuments({
        eventType: 'regionalInvasion',
        $and: [{ time: { $gte: today } }, { time: { $lt: tomorrow } }]
      }).exec(),
      AlarmLog.countDocuments({
        eventType: 'leftObject',
        $and: [{ time: { $gte: today } }, { time: { $lt: tomorrow } }]
      }).exec(),
      AlarmLog.countDocuments({
        eventType: 'rapidMovement',
        $and: [{ time: { $gte: today } }, { time: { $lt: tomorrow } }]
      }).exec(),
      AlarmLog.countDocuments({
        eventType: 'ParkingDetection',
        $and: [{ time: { $gte: today } }, { time: { $lt: tomorrow } }]
      }).exec(),
      AlarmLog.countDocuments({
        eventType: 'peopleGathering',
        $and: [{ time: { $gte: today } }, { time: { $lt: tomorrow } }]
      }).exec(),
      AlarmLog.countDocuments({
        eventType: 'RemoveObject',
        $and: [{ time: { $gte: today } }, { time: { $lt: tomorrow } }]
      }).exec(),
      AlarmLog.countDocuments({
        eventType: 'linger',
        $and: [{ time: { $gte: today } }, { time: { $lt: tomorrow } }]
      }).exec()
    ])
    const data = []
    data.push({ label: '拌线入侵', count: tripwire })
    data.push({ label: '区域入侵', count: regionalInvasion })
    data.push({ label: '物品遗留', count: leftObject })
    data.push({ label: '快速移动', count: rapidMovement })
    data.push({ label: '停车检测', count: ParkingDetection })
    data.push({ label: '人员聚集', count: peopleGathering })
    data.push({ label: '物品搬移', count: RemoveObject })
    data.push({ label: '徘徊检测', count: linger })
    ctx.status = 200
    ctx.body = {
      contrast: {
        label: label,
        serise: [
          {
            name: '科技中心',
            data: hotspot.hotspot1
          },
          {
            name: '展馆厅',
            data: hotspot.hotspot2
          },
          {
            name: '学术报告厅',
            data: hotspot.hotspot3
          }
        ]
      },
      statistic: data
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 统计分析下载查询条件下的资源统计详情
exports.contrastExport = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('访客管理-统计分析下载查询条件下的资源统计详情'))
  const search = ctx.query.search
  const summary = []
  const query = {}
  let times = []
  let resources, continuity
  let staticTypes = []
  // 资源设备
  _.isUndefined(search.res)
    ? (resources = [])
    : _.isArray(search.res)
      ? (resources = search.res)
      : (resources = [search.res])
  // 时间颗粒度默认值处理
  _.isUndefined(search.granularity)
    ? (query.granularity = _.first(CONSTANTS.GRANULARITY.RANGE))
    : CONSTANTS.GRANULARITY.RANGE.includes(Number(search.granularity))
      ? (query.granularity = Number(search.granularity))
      : (query.granularity = _.first(CONSTANTS.GRANULARITY.RANGE))
  // 时间是否连续默认值处理
  _.isUndefined(search.continuity)
    ? (continuity = false)
    : CONSTANTS.CONTINUITY.RANGE.includes(Number(search.continuity))
      ? Number(search.continuity) === 0
        ? (continuity = false)
        : (continuity = true)
      : (continuity = false)
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
    // 统计资源条件为该资源当天汇总和
    query.summary = CONSTANTS.SUMMARY.SINGLE
    query.granularity = CONSTANTS.GRANULARITY.DAY
    // 默认查找通行系统下所有资源统计
    if (_.isEmpty(resources)) {
      const orgs = await Org.find({ type: CONSTANTS.ORG.FACE }, '_id')
      resources = await OrgRes.find({ org: { $in: _.map(orgs, '_id') } }).populate('resource')
      // 通行系统的所有资源
      if (search.sys === 'pass') {
        resources = resources
          .filter(res => {
            return !_.isEmpty(res.resource) && res.resource.analysisType === CONSTANTS.SYS.PASS
          })
          .map(item => item.resource.toObject())
      } else {
        // 抓拍系统的所有资源
        resources = resources
          .filter(res => {
            return !_.isEmpty(res.resource) && res.resource.analysisType === CONSTANTS.SYS.CAPUTRUE
          })
          .map(item => item.resource.toObject())
      }
    } else {
      // 用户在组织结构中选择的资源
      resources = await Resource.find({ _id: { $in: resources } })
      resources = resources.map(item => item.toObject())
    }
    // 区分不同系统下人员类型 通行系统员工、访客、vip、陌生人 抓拍系统 黑、白、布控、对比
    if (search.sys === 'pass') {
      staticTypes = CONSTANTS.PEOPLE.NORMALSTATIC
    } else {
      staticTypes = CONSTANTS.PEOPLE.UNUSUALSTATIC
    }
    for (const date of times) {
      query.date = Number(date)
      for (const res of resources) {
        const feature = { resource: res.name }
        query.resource = res._id.toString()
        for (const type of staticTypes) {
          query.type = type
          const result = await FaceStatistic.findOne(query, 'date label statistic', { sort: { date: 1 } })
          switch (type) {
            case CONSTANTS.PEOPLE.SUBJECT:
              feature.subject = _.isEmpty(result) ? 0 : result.statistic
              break
            case CONSTANTS.PEOPLE.VISITOR:
              feature.vistor = _.isEmpty(result) ? 0 : result.statistic
              break
            case CONSTANTS.PEOPLE.VIP:
              feature.vip = _.isEmpty(result) ? 0 : result.statistic
              break
            case CONSTANTS.PEOPLE.BLACK:
              feature.black = _.isEmpty(result) ? 0 : result.statistic
              break
            case CONSTANTS.PEOPLE.WHITE:
              feature.white = _.isEmpty(result) ? 0 : result.statistic
              break
            case CONSTANTS.PEOPLE.ATTENTION:
              feature.attention = _.isEmpty(result) ? 0 : result.statistic
              break
            case CONSTANTS.PEOPLE.STRANGER:
              feature.attention = _.isEmpty(result) ? 0 : result.statistic
              break
            default:
              feature.comparsion = _.isEmpty(result) ? 0 : result.statistic
          }
        }
        summary.push(_.assign({ date: Number(date) }, feature))
      }
    }
    ctx.status = 200
    ctx.body = summary
  } catch (err) {
    handleSysException(err, 2002)
  }
}

exports.data = async (ctx, next) => {
  const params = ctx.query.search
  const picHost = params.pic
  const passCount = Number(params.pass) || 20000 // 参数获取生成通行系统的总数据量
  const captureCount = Number(params.capture) || 5000 // 参数获取生成抓拍系统的总数据量

  const male = Number(params.male) || 23456 // 参数获取生成通行系统的总数据量
  const female = Number(params.female) || 8645 // 参数获取生成抓拍系统的总数据量
  const date = params.date ? moment(params.date) : moment() // 生成指定日期的数据，默认今天
  console.log('start=======================')
  if (!picHost) {
    ctx.body = '人脸服务器参数缺失'
    return
  }
  try {
    const orgs = await Org.find({ type: CONSTANTS.ORG.FACE }, '_id')
    const resources = await OrgRes.find({ org: { $in: _.map(orgs, '_id') } }).populate('resource')
    const collection = {
      capture: [], // 抓拍系统
      pass: [] // 通行系统
    }
    resources.forEach((item, index) => {
      if (item.resource) {
        if (item.resource.analysisType === CONSTANTS.SYS.CAPUTRUE) {
          collection.capture.push({ id: item.resource._id, name: item.resource.name })
        } else if (item.resource.analysisType === CONSTANTS.SYS.PASS) {
          collection.pass.push({ id: item.resource._id, name: item.resource.name })
        }
      }
    })
    // 待插入到人员识别结合中的文档
    const person = []
    if (collection.pass.length === 0 || collection.capture.length === 0) {
      ctx.body = '请配置人脸分析中设备的系统类型，通行系统与抓拍系统'
      return
    }
    const humanLimit = 1000
    const typeCount = {
      stranger: 0,
      vip: 0,
      vistor: 0
    }
    // 生成通行系统的数据
    for (let i = 0; i < passCount; i++) {
      const pic = getPic(picHost)
      const cursor = parseInt(collection.pass.length * Math.random())
      const resource = collection.pass[cursor === collection.pass.length ? collection.pass.length - 1 : cursor]
      const faceType = Math.round(Math.random() * 3)
      switch (faceType) {
        case 0:
        case 1:
        case 2:
          let type = faceType
          if (faceType === 1 && typeCount.vistor > humanLimit) {
            type = 0
          } else if (faceType === 1) {
            typeCount.vistor++
          } else if (faceType === 2 && typeCount.vip > humanLimit) {
            type = 0
          } else if (faceType === 2) {
            typeCount.vip++
          }
          person.push({
            username: getUserName(),
            age: 21 + parseInt(Math.random() * 58),
            gender: Math.random() >= 0.3 ? CONSTANTS.GENDER.MALE : CONSTANTS.GENDER.FEMALE,
            idNumber: randomId(),
            similarity: Number(78 + parseInt(Math.random() * 22)).toFixed(2),
            picture: pic,
            resource: resource.id,
            resourcePoint: resource.name,
            snapshot: pic,
            snapshotTime: getSnapshotTime(date),
            type: type,
            sys: CONSTANTS.SYS.PASS
          })
          break
        default:
          person.push({
            resource: resource.id,
            resourcePoint: resource.name,
            gender: Math.random() >= 0.5 ? CONSTANTS.GENDER.MALE : CONSTANTS.GENDER.FEMALE,
            snapshot: pic,
            snapshotTime: getSnapshotTime(date),
            type: CONSTANTS.PEOPLE.STRANGER,
            sys: CONSTANTS.SYS.PASS
          })
      }
    }
    // 生成抓拍系统的数据
    for (let i = 0; i < captureCount; i++) {
      const pic = getPic(picHost)
      const cursor = parseInt(collection.capture.length * Math.random())
      const resource = collection.capture[cursor === collection.capture.length ? collection.capture.length - 1 : cursor]
      const faceType = Math.round(Math.random() * 3 + 3)
      switch (faceType) {
        case 3:
        case 4:
        case 5:
          person.push({
            username: getUserName(),
            age: 21 + parseInt(Math.random() * 58),
            gender: Math.random() >= 0.3 ? CONSTANTS.GENDER.MALE : CONSTANTS.GENDER.FEMALE,
            idNumber: randomId(),
            similarity: Number(78 + parseInt(Math.random() * 22)).toFixed(2),
            picture: pic,
            resource: resource.id,
            resourcePoint: resource.name,
            snapshot: pic,
            snapshotTime: getSnapshotTime(date),
            type: faceType,
            sys: CONSTANTS.SYS.CAPUTRUE
          })
          break
        default:
          person.push({
            resource: resource.id,
            resourcePoint: resource.name,
            gender: Math.random() >= 0.5 ? CONSTANTS.GENDER.MALE : CONSTANTS.GENDER.FEMALE,
            snapshot: pic,
            snapshotTime: getSnapshotTime(date),
            type: CONSTANTS.PEOPLE.STRANGER,
            sys: CONSTANTS.SYS.CAPUTRUE
          })
      }
    }
    console.log('start----injected')
    await Face.insertMany(person)
    console.log('end----injected')
    // const male = 23063 + parseInt(Math.random() * 3000)
    // const falme = 12063 + parseInt(Math.random() * 3000)
    const total = male + female
    const level3 = parseInt((total / 10) * 4)
    const level6 = parseInt((total / 10) * 2)
    // await Feature.update({ date: Number(moment(moment().format('YYYYMMDD')).format('X')) }, {
    await Feature.update(
      { date: Number(moment(date.format('YYYYMMDD')).format('X')) },
      {
        male: male,
        female: female,
        level0: 0,
        level1: 0,
        level2: total - level3 - level6,
        level3: level3,
        level4: 0,
        level5: 0,
        level6: level6,
        level7: 0,
        level8: 0,
        level9: 0
      },
      { upsert: true }
    )
    ctx.body = '数据注入完成！！'
  } catch (error) {
    console.log(error)
  }
}

const getUserName = () => {
  const family = [
    '赵',
    '钱',
    '孙',
    '李',
    '周',
    '吴',
    '郑',
    '王',
    '冯',
    '陈',
    '褚',
    '卫',
    '蒋',
    '沈',
    '韩',
    '杨',
    '朱',
    '秦',
    '尤',
    '许',
    '何',
    '吕',
    '施',
    '张',
    '孔',
    '曹',
    '严',
    '华',
    '金',
    '魏',
    '陶',
    '姜',
    '戚',
    '谢',
    '邹',
    '喻',
    '柏',
    '水',
    '窦',
    '章',
    '刘',
    '李'
  ]
  const name = [
    '观博',
    '欣竹',
    '欣阳',
    '刚军',
    '扬阳',
    '靖阳',
    '熙阳',
    '嘉萱',
    '铭阳',
    '飞',
    '雨荨',
    '文博',
    '诗含',
    '诗若',
    '辰海',
    '晓雨',
    '展鸣',
    '晓春',
    '洪文',
    '默',
    '轩杰',
    '金海',
    '俊杰',
    '展旭',
    '建烁',
    '婧琪',
    '婧涵',
    '诗晴',
    '传浩',
    '怡萍',
    '诗涵',
    '雅婷',
    '雅涵',
    '萍',
    '晓萍',
    '兴飞',
    '小平',
    '建龙',
    '宇谟',
    '子辰',
    '辰',
    '湍灵',
    '骅株',
    '春莲',
    '娟敏',
    '智涵',
    '欣妍',
    '慧妍',
    '雅静',
    '月婷',
    '雨婷',
    '芸馨',
    '韵涵',
    '涵韵',
    '雨欣',
    '馨蕾',
    '静媛',
    '子涵',
    '雨泽',
    '静蕾',
    '茛淯',
    '珑沧',
    '芮娟',
    '梓萱',
    '轶诚',
    '嘉文',
    '晓朋',
    '一凡',
    '昊楠',
    '浩楠',
    '瑞君',
    '佳宁',
    '雨杨',
    '昊然',
    '浩然',
    '滕浩',
    '雨菡',
    '海一',
    '晨宸',
    '之政',
    '晨菲',
    '修闻',
    '宁夫',
    '轩',
    '春菲',
    '佳涵',
    '耀宇',
    '耀雨',
    '翠',
    '鑫雨',
    '涵熙',
    '继欣',
    '菲',
    '兰月',
    '兰欣',
    '岚欣',
    '懿明',
    '淑菲',
    '荣凯',
    '海瑶',
    '涵雅',
    '晨曦',
    '麟炜',
    '茜',
    '子萱',
    '玥菲',
    '雯菲',
    '云涵',
    '靖雯',
    '馨怡',
    '江',
    '运浩',
    '飞飞',
    '强',
    '国馨',
    '国鑫',
    '雅雯',
    '炳君',
    '海'
  ]
  const assertFamily = parseInt(Math.random() * family.length - 1)
  const assertName = parseInt(Math.random() * name.length - 1)
  return family[assertFamily] + name[assertName]
}
const randomId = () => {
  var coefficientArray = ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'] // 加权因子
  var lastNumberArray = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码
  var address = '420101' // 住址
  var birthday =
    '1981' + _.padStart(parseInt(Math.random() * 11) + 1, 2, '0') + _.padStart(parseInt(Math.random() * 25) + 1, 2, '0') // 生日
  var s =
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString() +
    Math.floor(Math.random() * 10).toString()
  var array = (address + birthday + s).split('')
  var total = 0
  for (var i in array) {
    total = total + parseInt(array[i]) * parseInt(coefficientArray[i])
  }
  var lastNumber = lastNumberArray[parseInt(total % 11)]
  return address + birthday + s + lastNumber
}
const getSnapshotTime = date => {
  // const rangeStart = moment(moment().set({ 'hour': 6, 'minute': 0, 'second': 0 })).format('X')
  // const rangeEnd = moment(moment().set({ 'hour': 19, 'minute': 0, 'second': 0 })).format('X')
  const rangeStart = moment(date.set({ hour: 6, minute: 0, second: 0 })).format('X')
  const rangeEnd = moment(date.set({ hour: 19, minute: 0, second: 0 })).format('X')
  const diff = Number(rangeEnd) - Number(rangeStart)
  return Number(rangeStart) + parseInt(Math.random() * diff)
}
const getPic = host => {
  const picList = [
    '/static/upload/event/2017-10-17/49e442cafe00b53b88892824c8536c5028dd7fe0.jpg',
    '/static/upload/event/2017-10-17/80deb7ecfb9e4d11616910c10de01e6764647491.jpg',
    '/static/upload/event/2017-10-17/df058461cd962b24e40c119cfa2d2bebfe07be5e.jpg',
    '/static/upload/event/2017-10-17/7a196aad845d734e30b453a501257fdbe79f5600.jpg',
    '/static/upload/event/2017-10-17/22e0ae7c882a71495b582c4ee4f5e45280c303ba.jpg',
    '/static/upload/event/2017-10-17/8bb378ecaa89ef3ed42af40c17515a337f7f077c.jpg',
    '/static/upload/event/2017-10-17/113f27e460d65b94a5c97c4e593d0449868bdadb.jpg',
    '/static/upload/event/2017-10-17/241530dd3e61715325bc086d06ab82a13a9b0901.jpg',
    '/static/upload/event/2017-10-17/d0d987039a4b59adcaa3f494210b1f64c33d4497.jpg',
    '/static/upload/event/2017-10-17/47111e89233d7821ce10ae82176987855f942e59.jpg',
    '/static/upload/event/2017-10-17/2d4428be319bf65cb5a7f6600b330905a8691354.jpg',
    '/static/upload/event/2017-10-17/b1bda27acb4a6e3cd933293c4b7e7684b7706d06.jpg',
    '/static/upload/event/2017-10-17/3002f68522943cc5c4e538e17005ecb73684fc80.jpg',
    '/static/upload/event/2017-10-17/fc9498de1765f7ccb5fb7ab501b19591bc74a936.jpg',
    '/static/upload/event/2017-10-16/d6d7c95e428e8a5dc040fd2201defbb0ffda4c23jpg',
    '/static/upload/event/2017-10-16/5800a0bec469f97ce49ff465e68706efbebe33b9.jpg',
    '/static/upload/event/2017-10-16/5800a0bec469f97ce49ff465e68706efbebe33b9.jpg',
    '/static/upload/event/2017-10-16/754b2ffbb006b300625324360e5f30bb0cc96dda.jpg',
    '/static/upload/event/2017-10-16/4ae542ccc0748b85967b9ac27054e68467aafce5.jpg',
    '/static/upload/event/2017-10-16/f3173a75f13e061f4e76404b93256831d8d909f5.jpg',
    '/static/upload/event/2017-10-16/abf31484da028ac7bf1bb85acc4618d779442c4b.jpg',
    '/static/upload/event/2017-10-16/9679891adde7c5ef9f21c4abd30cf25e6c00c360.jpg',
    '/static/upload/event/2017-10-16/b39a04e3f7e9dc8db5d362ffa59154131d6c4779.jpg',
    '/static/upload/event/2017-10-16/2a00b3385d7df70cabe81a230767eadf105c3e2e.jpg'
  ]
  return 'http://' + host + picList[parseInt(Math.random() * picList.length - 1)]
}
