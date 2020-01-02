/**
 * 巡更管理路由
 * @since:2018-CONSTANT.SECURITY-12
 * @author:hansen
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-08-06 11:13:03
 * @Last Modified by: SongXiaoshan
 * @Last Modified time: 2019-10-17 14:03:47
 * @changeLog:
 * 添加单兵实时定位超时次数统计
 * 返回超时统计结果
 */

'use strict'

const mongoose = require('mongoose')
const PatrolGeo = mongoose.model('PatrolGeo')
const PatrolSetting = mongoose.model('PatrolSetting')
const PatrolWarnning = mongoose.model('PatrolWarnning')
const PatrolAlarming = mongoose.model('PatrolAlarming')
const PatrolTask = mongoose.model('PatrolTask')
const PatrolRecord = mongoose.model('PatrolRecord')
const PatorlTimeoutRecord = mongoose.model('PatorlTimeoutRecord')
const PatrolMessage = mongoose.model('PatrolMessage')
const Org = mongoose.model('Org')
const Security = mongoose.model('Security')
const PatrolPoint = mongoose.model('PatrolPoint')
// const PatrolAlarm = mongoose.model('PatrolAlarm')
const paging = require('../paging')
const socket = require('./patrol.socket')
const _ = require('lodash')
const moment = require('moment')
const { handleSysException, getChildren } = require('../../common/tools')
const PatrolService = require('./patrol.service')
const SentryService = require('../sys/sentry/sentry.service')
const USERSERVICE = require('../sys/user/user.service.js')
const UserService = new USERSERVICE()

const Helpers = require('@turf/helpers')
const Distance = require('@turf/distance')
const tool = require('../../common/tools')
const getDb = require('../../common/logdb')
const AlarmLogSchema = new mongoose.Schema({
  orgId: {
    type: Schema.Types.ObjectId,
    ref: 'Org'
  },
  // 报警源
  srcName: String,
  level: Number,
  alarmClassifyId: {
    type: Schema.Types.ObjectId,
    ref: 'alarmType'
  },
  // 单兵一键报警视频id
  recordId: String,
  // 报警类型
  eventType: String,
  time: Number,
  // 报警名称
  name: String,
  // 报警处理状态
  dealState: String,
  // 报警点位
  position: String,
  // 消息内容
  message: Object,
  // 消息ID
  uniqueId: String,
  // 类型
  type: String,
  // 警情处理
  ackContent: String,
  // 是否处理
  deal: {
    type: Boolean,
    default: false
  },
  // 确认时间
  ackTime: Number,
  define: Boolean
})
const patrolService = new PatrolService()
const sentryService = new SentryService()
const filed = '-__v -createdAt -updatedAt -userId -realName -date -warranty -timout -alarm'
const CONSTANT = {
  FIXED: 1, // 固定模式
  FLOAT: 2, // 浮动模式
  ONTIME: 3, // 在线
  TIMEOUT: 4, // 超时
  SECURITY: 3, // 巡更人员组织类型
  MSGTYPE: [1, 2], // 巡更消息类型
  ALARM: 1, // 报警类型
  WARRANTY: 2, // 报修类型
  EMERGENCY: 3,
  PATROL: 3, // 已巡更
  PATROLTIMEOUT: 4, // 已巡更
  TIMEOUTBASE: 5, // 巡更点超时基准值
  NORMALBASE: 7, // 巡更点正常基准值
  DIRECTION: [1, 2], // 巡更任务查询方向
  PREVIOUS: 1, // 前一个
  NEXT: 2, // 后一个
  MSG: [0, 1, 2], // 常规消息|报警消息|保修消息
  ONTIMEALARM: 8,
  ONTIMEWARANTY: 9,
  TIMEOUTALARM: 6,
  TIMEOUTWARANTY: 7,
  UNFINISHED: 5,
  LIVECOMMAND: ['open', 'close'] // app实时视频指令[开，关]
}
// 在线用户坐标有效性
const usrGroup = {}
// 在线用户坐标持有时长
const holdTime = 1
/**
 * 获取alarmlog模型
 */
const getAlarmLogModel = async () => {
  const db = await getDb()
  const AlarmLog = db.model('AlarmLog', AlarmLogSchema, 'AlarmLog')
  return AlarmLog
}
// 单兵实时定位
module.exports.userGeo = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-巡更app实时定位'))
  try {
    let userId = ''
    const point = ctx.request.body.geo.lat || ctx.request.body.geo.lon
    if (ctx.state.user) {
      userId = ctx.state.user._id
    } else {
      ctx.throw(500, { code: 2001, message: '用户身份信息找不到，请重新登陆！' })
    }
    if (!point) {
      return
    }
    const user = await Security.findById(userId)
      .populate({ path: 'affiliation', select: 'name' })
      .lean()
    const data = Object.assign(
      {
        point: ctx.request.body.geo,
        time: moment().format('YYYY-MM-DD HH:mm:ss'),
        timeOut: false,
        move: false
      },
      user
    )
    // 是否开启超时配置  单兵实时定位储存
    const setting = await PatrolSetting.findOne({ start: true })
    // const date = Number(moment(moment().format('YYYYMMDD')).format('X'))
    const time = Date.parse(moment().format('YYYY-MM-DD HH:mm:ss')) / 1000
    // const record = await PatrolRecord.find({ userId: userId, date: date })
    if (setting) {
      const geoData = await PatrolGeo.findOne({ uid: userId })
      if (!geoData) {
        const obj = {
          time: time,
          uid: userId,
          geo: ctx.request.body.geo
        }
        await PatrolGeo.create(obj)
        socket.sentryTimeOut(data)
      } else {
        const from = Helpers.point([Number(geoData.geo.lon), Number(geoData.geo.lat)])
        const to = Helpers.point([Number(data.point.lon), Number(data.point.lat)])
        const distance = Distance.default(from, to) * 1000
        const userGeo = await PatrolGeo.find({ uid: userId })
        const timeDifference = (time - userGeo[0].time) / 60
        // const patrolGeoData = await PatrolGeo.findOneAndUpdate({ uid: userId })
        // const newFrom = Helpers.point([Number(geoData.geo.lon), Number(geoData.geo.lat)])
        // const newto = Helpers.point([Number(patrolGeoData.newGeo.lon), Number(patrolGeoData.newGeo.lat)])
        // const newDistance = Distance.default(newFrom, newto) * 1000
        // 超时报警
        if (setting.duration < timeDifference && distance < setting.meter) {
          data.timeOut = true
          socket.sentryTimeOut(data)
          createOrUpdateUserTimeoutCountRecord(userId)
          await PatrolGeo.findOneAndUpdate({ uid: userId }, { geo: ctx.request.body.geo, time: time, alarm: true })
          // 超出三分钟内
        } else if (timeDifference > 3 && userGeo[0].alarm && distance < setting.meter) {
          data.timeOut = true
          socket.sentryTimeOut(data)
          createOrUpdateUserTimeoutCountRecord(userId)
          await PatrolGeo.findOneAndUpdate({ uid: userId }, { geo: ctx.request.body.geo, time: time, alarm: false })
          // 三分钟内
        } else if (timeDifference < 3 && userGeo[0].alarm && distance < setting.meter) {
          data.timeOut = true
          socket.sentryTimeOut(data)
        } else if (distance > setting.meter || timeDifference > setting.duration) {
          await PatrolGeo.deleteOne({ uid: userId })
        } else {
          socket.sentryTimeOut(data)
        }
      }
    }
    socket.sentryLocation(data)
    await Promise.all([
      Security.findByIdAndUpdate(userId, { geo: ctx.request.body.geo }),
      patrolService.setTrajectory(usrGroup, user, holdTime, ctx.request.body.geo)
    ])
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}

const createOrUpdateUserTimeoutCountRecord = async userId => {
  const result = await PatorlTimeoutRecord.findOneAndUpdate(
    { userId },
    { $inc: { timeoutcount: 1 } },
    { new: true, upsert: true }
  )
  return result
}

// App开启定位
// exports.openUserGeo = async ctx => {
//   try {
//     let userId = ''
//     if (ctx.state.user) {
//       userId = ctx.state.user._id
//     } else {
//       ctx.throw(500, { code: 2001, message: '用户身份信息找不到，请重新登陆！' })
//     }
//     const time = Date.parse(moment().format('YYYY-MM-DD HH:mm:ss')) / 1000
//     await PatrolGeo.findOneAndUpdate({ uid: userId }, { geo: ctx.request.body.geo, time: time, alarm: false }, {upsert: true})
//     ctx.status = 200
//     ctx.body = ''
//   } catch (err) {
//     handleSysException(err)
//   }
// }

// 清空超时 一键报警的统计
exports.clearPatrolTimeOutCount = async ctx => {
  try {
    await PatorlTimeoutRecord.updateMany({ timeoutcount: 0, alarmCount: 0 })
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}

// 单兵报警
module.exports.userAlarm = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-巡更app报警'))
  let userId = ''
  if (ctx.state.user) {
    userId = ctx.state.user._id
  } else {
    ctx.throw(500, { code: 2001, message: '用户身份信息找不到，请重新登陆！' })
  }
  // 查找当前用户今日的所有巡更记录并找到正在执行的巡更任务。
  const [user, record] = await Promise.all([
    Security.findById(userId, 'realname photo phone sn').lean(),
    findSentyCurRrd(userId)
  ])
  const date = Number(moment(moment().format('YYYYMMDD')).format('X'))
  const patrolAlarm = await PatrolAlarming.countDocuments({ uid: userId, date: date })
  const data = Object.assign(
    {
      uniqueId: mongoose.Types.ObjectId().toString(),
      precentage: record ? record.precentage : '',
      point: ctx.request.body.geo,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      date: date,
      alarm: patrolAlarm + 1,
      geo: ctx.request.body.geo
    },
    user
  )
  const AlarmData = {
    time: Date.parse(moment().format('YYYY-MM-DD HH:mm:ss')) / 1000,
    srcName: user.realname,
    name: '',
    eventType: 'individualAlarm',
    dealState: 'unProcess',
    position: JSON.stringify(data.point),
    uniqueId: data.uniqueId,
    message: data,
    define: true
  }
  data.uid = data._id
  delete data._id
  const patrolalarming = new PatrolAlarming(data)
  await patrolalarming.save()
  // await PatrolAlarming.create(AlarmData)
  const AlarmLog = await getAlarmLogModel()
  await AlarmLog.create(AlarmData)
  await PatrolRecord.update({ userId: userId, date: date }, { alarmSentry: patrolAlarm + 1 })
  createOrUpdateUserAlarmRecord(userId)
  socket.sentryAlarm(data)
  ctx.status = 200
  ctx.body = ''
}

const createOrUpdateUserAlarmRecord = async userId => {
  const result = await PatorlTimeoutRecord.findOneAndUpdate(
    { userId },
    { $inc: { alarmCount: 1 } },
    { new: true, upsert: true }
  )
  return result
}

const findSentyCurRrd = async userId => {
  // 查找当前用户今日的所有巡更记录并找到正在执行的巡更任务。
  const now = moment().format('HH:mm')
  const query = { userId }
  query.date = Number(moment(moment().format('YYYYMMDD')).format('X'))
  const records = await PatrolRecord.find(query, filed)
    .lean()
    .sort('startTime')
  let record = null
  for (const item of records) {
    const startTime = convertTimeStrtoNum(item.startTime)
    const enendTimed = convertTimeStrtoNum(item.endTime)
    const downTime = moment(moment.unix(startTime).subtract(item.rangTime, 'm')).format('HH:mm')
    const upperTime = moment(moment.unix(enendTimed).add(item.rangTime, 'm')).format('HH:mm')
    if (downTime <= now && now <= upperTime) {
      record = item
      break
    }
  }
  return record
}

// 单兵报警处理
module.exports.updateAlarm = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-巡更app报警处理'))
  try {
    const ids = ctx.params.id
    const id = ids.split(',')
    const time = Date.parse(moment().format('YYYY-MM-DD HH:mm:ss')) / 1000
    ctx.request.body.deal = true
    ctx.request.body.ackTime = time
    const body = ctx.request.body
    await PatrolAlarming.updateMany({ uniqueId: { $in: id } }, { status: 1, ackContent: body.ackContent })
    const AlarmLog = await getAlarmLogModel()
    await AlarmLog.updateMany({ uniqueId: { $in: id } }, body)
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 删除用户后，同步删除用的任务及今日未执行的任务记录
module.exports.syncRemoveTaskRecord = async ids => {
  try {
    if (_.isEmpty(ids)) {
      console.log('同步删除用户任务及任务记录失败，用户id为空')
      return
    }
    const date = Number(moment(moment().format('YYYYMMDD')).format('X'))
    await Promise.all([
      PatrolTask.remove({ userId: { $in: ids } }),
      PatrolRecord.remove({ userId: { $in: ids }, date, precentage: 0 })
    ])
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 订阅删除巡更点位同步更新任务及未执行的记录
module.exports.updatePointTaskRecord = async ids => {
  try {
    if (_.isEmpty(ids)) {
      console.log('同步删除用户任务及任务记录失败，用户id为空')
      return
    }
    const date = Number(moment(moment().format('YYYYMMDD')).format('X'))
    await Promise.all([
      PatrolTask.update({}, { $pull: { points: { pointId: { $in: ids } } } }, { multi: true }),
      PatrolRecord.update({ date, precentage: 0 }, { $pull: { points: { pointId: { $in: ids } } } }, { multi: true })
    ])
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取巡更记录列表
module.exports.recordList = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取巡更记录列表'))
  try {
    const query = {}
    const paganation = ctx.query.page || ''
    const orgId = ctx.query.search.org || ''
    const orgs = await Org.find({ type: CONSTANT.SECURITY }, 'name pid isroot')
      .sort('order')
      .lean()
    let org = []
    if (_.isEmpty(orgId)) {
      const root = _.find(orgs, { isroot: true })
      org = getChildren(org, orgs, root._id.toString())
      org.push(root._id.toString())
    } else {
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
    }
    const users = await Security.find({ affiliation: { $in: org } }).lean()
    query.userId = { $in: users.map(item => item._id.toString()) }
    const result = await paging.listQuery(
      PatrolRecord,
      query,
      '-__v -updatedAt -createdAt',
      { date: -1, startTime: 1 },
      paganation,
      '',
      ctx
    )
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取指定人员的所有今日巡更记录
module.exports.queryDateRrd = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取指定人员的所有今日巡更记录'))
  try {
    let date = ctx.query.search.date || ''
    if (_.isEmpty(date)) {
      date = Number(moment(moment().format('YYYYMMDD')).format('X'))
    } else {
      date = Number(date)
    }
    const usrId = ctx.params.user
    const result = await PatrolRecord.find({ userId: usrId, date }, 'taskTitle')
      .sort('startTime')
      .lean()
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 查询用户巡更记录
module.exports.recordQuery = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-查询用户巡更记录'))
  try {
    const key = ctx.query.search.key.replace(/\./g, '\\.')
    const query = {}
    const paganation = ctx.query.page || ''
    query.$or = [{ taskTitle: { $regex: key } }, { realName: { $regex: key } }]
    // query.taskTitle = ctx.query.search.taskTitle
    //   ? { $regex: decodeURIComponent(ctx.query.search.taskTitle.replace(/\./g, '\\.')) }
    //   : ''
    // query.realName = ctx.query.search.realName
    //   ? { $regex: decodeURIComponent(ctx.query.search.realName.replace(/\./g, '\\.')) }
    //   : ''
    if (!_.isEmpty(ctx.query.search.startTime) && !_.isEmpty(ctx.query.search.endTime)) {
      query.$and = [
        { date: { $gte: Number(ctx.query.search.startTime) } },
        { date: { $lte: Number(ctx.query.search.endTime) } }
      ]
    } else if (!_.isEmpty(ctx.query.search.startTime)) {
      query.date = { $gte: Number(ctx.query.search.startTime) }
    } else if (!_.isEmpty(ctx.query.search.endTime)) {
      query.date = { $lte: Number(ctx.query.search.endTime) }
    }
    const result = await paging.listQuery(
      PatrolRecord,
      query,
      '-__v -updatedAt -createdAt',
      { date: -1, startTime: 1 },
      paganation,
      '',
      ctx
    )
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 获取当前用户将要或正在执行的巡更任务
module.exports.findCurrent = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-巡更app当前用户将要或正在执行的巡更任务'))
  try {
    const now = moment().format('HH:mm')
    const query = {}
    if (ctx.state.user) {
      query.userId = ctx.state.user._id
    } else {
      ctx.throw(500, { code: 2001, message: '用户身份信息找不到，请重新登陆！' })
    }
    query.$and = [{ startTime: { $gt: now } }, { endTime: { $lt: now } }]
    query.date = Number(moment(moment().format('YYYYMMDD')).format('X'))
    let records = await PatrolRecord.find(query, filed).lean()
    if (_.isEmpty(records)) {
      delete query.$and
      records = await PatrolRecord.find(query, filed).lean()
      if (_.isEmpty(records)) {
        ctx.throw(500, { code: 2001, message: '找不到用户巡更记录' })
      }
      const currentValue = convertTimeStrtoNum(now)
      let index = 0
      records.reduce((accumulator, current, curindex) => {
        const curValue = convertTimeStrtoNum(current.startTime)
        const diff = Math.abs(curValue - currentValue)
        if (accumulator > diff) {
          index = curindex
          accumulator = diff
        }
        return accumulator
      }, 1000000)
      records = records[index]
    }
    ctx.status = 200
    ctx.body = records
  } catch (err) {
    handleSysException(err, 2002)
  }
}

/**
 * 巡更app接口，获取用户所有巡更记录，包括已巡更与未巡更的记录
 */
module.exports.getUserAllRecord = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-巡更app用户获取所有记录'))
  try {
    const query = {}
    const date = ctx.query.search.day || ''
    if (ctx.state.user) {
      query.userId = ctx.state.user._id
    } else {
      ctx.throw(500, { code: 2001, message: '用户身份信息找不到，请重新登陆！' })
    }
    const user = await Security.findById(query.userId, 'realname id position sn').lean()
    if (!user) {
      ctx.throw(500, { code: 2001, message: '用户不存在！' })
    }
    if (date) {
      query.date = Number(moment(date).format('X'))
    } else {
      query.date = Number(moment(moment().format('YYYYMMDD')).format('X'))
    }
    const records = await patrolService.findAllRecords(query, filed)
    ctx.status = 200
    ctx.body = records
  } catch (error) {
    handleSysException(error, 2002)
  }
}
/**
 * 巡更app接口，上传用户离线的巡更点签到
 */
module.exports.offlineSingin = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-巡更app离线上传巡更点签到信息'))
  try {
    let userId = ''
    if (ctx.state.user) {
      userId = ctx.state.user._id
    } else {
      ctx.throw(500, { code: 2001, message: '用户身份信息找不到，请重新登陆！' })
    }
    const user = await Security.findById(userId, 'realname id position photo sn').lean()
    if (!user) {
      ctx.throw(500, { code: 2001, message: '用户不存在！' })
    }
    const body = ctx.request.body
    if (!body.id) {
      ctx.throw(500, { code: 2001, message: '未指定巡更记录' })
    }
    const record = await patrolService.findById(body.id)
    if (_.isEmpty(record)) {
      ctx.throw(500, { code: 2001, message: '找不到用户巡更记录' })
    }
    const points = record.points
    for (const item of body.points) {
      const point = _.find(points, point => point.devId === item.devId && point.pointId.toString() === item.pointId)
      if (_.isEmpty(point)) {
        continue
      }
      const arrivalTime = item.arrivalTime
      point.arrivalTime = arrivalTime
      // 巡更点的固定模式
      if (record.taskType === CONSTANT.FIXED) {
        const patrolTime = convertTimeStrtoNum(point.patrolTime)
        const downTime = moment(moment.unix(patrolTime).subtract(record.rangTime, 'm')).format('HH:mm')
        const upperTime = moment(moment.unix(patrolTime).add(record.rangTime, 'm')).format('HH:mm')
        // 超时与正常单一状态=>3|已巡更, 4|超时
        if (arrivalTime > upperTime || arrivalTime < downTime) {
          point.status = CONSTANT.PATROLTIMEOUT
          record.timout += 1
        } else {
          point.status = CONSTANT.PATROL
        }
        // point.status = arrivalTime > upperTime || arrivalTime < downTime ? CONSTANT.PATROLTIMEOUT : CONSTANT.PATROL
      } else if (record.taskType === CONSTANT.FLOAT) {
        // 巡更点的自由模式
        const endTime = convertTimeStrtoNum(record.endTime)
        const upperTime = moment(moment.unix(endTime).add(record.rangTime, 'm')).format('HH:mm')
        // 超时与正常单一状态=>3|已巡更, 4|超时
        if (arrivalTime > upperTime) {
          point.status = CONSTANT.PATROLTIMEOUT
          record.timout += 1
        } else {
          point.status = CONSTANT.PATROL
        }
        // point.status = arrivalTime > upperTime ? CONSTANT.PATROLTIMEOUT : CONSTANT.PATROL
      } else {
        ctx.throw(500, { code: 2001, message: '任务异常' })
      }
    }
    const unfinished = points.filter(item => _.isEmpty(item.arrivalTime))
    record.precentage = parseInt(((points.length - unfinished.length) * 100) / points.length)
    await PatrolRecord.findByIdAndUpdate(body.id, record)
    const status = Object.assign({}, user)
    status.recordId = body.id
    status.alarm = record.alarm
    status.warranty = record.warranty
    status.timout = record.timout
    status.precentage = record.precentage
    status.curPoint = ''
    status.status = 'online'
    status.nextPoint = ''
    const sortPoint = sortPointByTime(record.points)
    const index = sortPoint.findIndex(item => !item.arrivalTime)
    if (index - 1 >= 0) {
      status.curPoint = sortPointByTime[index - 1].pointName
      status.nextPoint = sortPointByTime[index].pointName
    }
    socket.patrolStatus(status)
    ctx.status = 200
    ctx.body = ''
  } catch (error) {
    handleSysException(error, 2002)
  }
}

// 巡更任务巡更点签到
module.exports.sigin = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-巡更app巡更任务巡更点签到'))
  try {
    let userId = ''
    if (ctx.state.user) {
      userId = ctx.state.user._id
    } else {
      ctx.throw(500, { code: 2001, message: '用户身份信息找不到，请重新登陆！' })
    }
    const user = await Security.findById(userId, 'realname id position photo sn selectedColor').lean()
    if (!user) {
      ctx.throw(500, { code: 2001, message: '用户不存在！' })
    }

    const body = ctx.request.body
    const id = ctx.params.id
    const date = Number(moment(moment().format('YYYYMMDD')).format('X'))
    const arrivalTime = moment().format('HH:mm')

    if (_.isEqual(id, '')) {
      ctx.throw(500, { code: 2001, message: '当前文档id为空' })
    }
    const record = await PatrolRecord.findById(id).lean()
    // const patrolAlarmCount = await PatrolAlarming.countDocuments({uid: userId, date: date})
    if (_.isEmpty(record)) {
      ctx.throw(500, { code: 2001, message: '找不到用户巡更记录' })
    }
    if (record.date !== Number(moment(moment().format('YYYYMMDD')).format('X'))) {
      ctx.throw(500, { code: 2001, message: '此任务已过期' })
    }
    const points = record.points
    const point = _.find(points, point => point.devId === body.devId && point.pointId.toString() === body.pointId)
    if (_.isEmpty(point)) {
      ctx.throw(500, { code: 2001, message: '巡更点位必须为巡更任务规划的点位' })
    }
    const beginTime = convertTimeStrtoNum(record.startTime)
    const downExtremTime = moment(moment.unix(beginTime).subtract(record.rangTime, 'm')).format('HH:mm')
    if (arrivalTime < downExtremTime) {
      ctx.throw(500, { code: 2001, message: '不能执行巡更未开始的任务' })
    }
    point.arrivalTime = arrivalTime
    // 巡更点的固定模式
    if (record.taskType === CONSTANT.FIXED) {
      const patrolTime = convertTimeStrtoNum(point.patrolTime)
      const downTime = moment(moment.unix(patrolTime).subtract(record.rangTime, 'm')).format('HH:mm')
      const upperTime = moment(moment.unix(patrolTime).add(record.rangTime, 'm')).format('HH:mm')
      if (arrivalTime < downTime) {
        ctx.throw(500, { code: 2001, message: '不能执行未到巡更时间的巡更点' })
      }
      handleRrdStatus(body.msgType, record, point, arrivalTime, upperTime)
    } else if (record.taskType === CONSTANT.FLOAT) {
      // 巡更点的自由模式
      const endTime = convertTimeStrtoNum(record.endTime)
      const upperTime = moment(moment.unix(endTime).add(record.rangTime, 'm')).format('HH:mm')
      handleRrdStatus(body.msgType, record, point, arrivalTime, upperTime)
    } else {
      ctx.throw(500, { code: 2001, message: '任务异常' })
    }
    const unfinished = points.filter(item => _.isEmpty(item.arrivalTime))
    record.precentage = parseInt(((points.length - unfinished.length) * 100) / points.length)
    const status = Object.assign({}, user)
    status.recordId = id
    status.alarm = record.alarm
    status.alarmSentry = record.alarmSentry
    status.warranty = record.warranty
    status.timout = record.timout
    status.precentage = record.precentage
    status.currentPoint = point.pointName
    status.status = 'online'
    status.nextPoint = ''
    const sortPoint = sortPointByTime(record.points)
    const index = sortPoint.findIndex(item => !item.arrivalTime)
    if (index - 1 >= 0) {
      status.nextPoint = sortPoint[index].pointName
    }
    // 创建报警/报修消息
    let patrolMsg = null
    if (body.msgType) {
      const message = {
        platform: 'app',
        sender: user.realname,
        senderId: userId,
        date: Number(date),
        moment: arrivalTime,
        task: id
      }
      message.title = body.title || ''
      message.type = Number(body.msgType)
      message.content = body.content || ''
      message.photo = body.photo || ''
      message.video = body.video || ''
      message.position = point.pointName
      message.devId = point.pointId
      message.geo = body.geo
      patrolMsg = await PatrolMessage.create(message)
      // patrolMsg = patrolMsg.toObject()
      // patrolMsg.createdAt = moment(patrolMsg.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
    // 关联巡更点报警/报修消息
    if (patrolMsg) {
      point.message = patrolMsg._id.toString()
    }

    const [pointInfo] = await Promise.all([
      PatrolPoint.findById(point.pointId)
        .populate('point.sid')
        .populate('point3D.sid')
        .populate('point3D.bid')
        .lean(),
      PatrolRecord.findByIdAndUpdate(id, record)
    ])
    socket.patrolStatus(status)
    // 巡更设备在地图上配置后才发送socket
    if ((!_.isEmpty(pointInfo.point) || !_.isEmpty(pointInfo.point3D)) && CONSTANT.MSGTYPE.includes(body.msgType)) {
      // 统计当前点位的巡更次数及报警、保修数量
      const sample = await PatrolRecord.find({ precentage: { $gt: 0 }, date }).lean()
      const statics = { finished: 0, alarm: 0, warranty: 0 }
      sample.map(item => {
        for (const ele of item.points) {
          if (ele.pointId.toString() === point.pointId.toString()) {
            if (ele.status === CONSTANT.UNFINISHED) {
              break
            } else if (ele.status === CONSTANT.TIMEOUTWARANTY || ele.status === CONSTANT.ONTIMEWARANTY) {
              statics.warranty++
            } else if (ele.status === CONSTANT.TIMEOUTALARM || ele.status === CONSTANT.ONTIMEALARM) {
              statics.alarm++
            }
            statics.finished++
            break
          }
        }
      })
      socket.patrolAlarm(
        Object.assign(
          {
            _id: pointInfo._id,
            devName: pointInfo.devName,
            uniqueId: patrolMsg._id,
            charger: pointInfo.charger,
            phone: pointInfo.phone,
            message: patrolMsg,
            msgType: body.msgType,
            selectedColor: user.selectedColor,
            map2D: {
              geo: _.get(pointInfo, 'point.geo', ''),
              isouter: !_.has(pointInfo, 'point.bid'),
              mapId: _.get(pointInfo, 'point.mapid', ''),
              bid: _.get(pointInfo, 'point.bid', ''),
              sid: _.get(pointInfo, 'point.sid._id', ''),
              storeyName: _.get(pointInfo, 'point.sid.name', '')
            },
            map3D: {
              isouter: !_.has(pointInfo, 'point3D.bid'),
              geo: _.get(pointInfo, 'point3D.geo', ''),
              bid: _.get(pointInfo, 'point3D.bid', ''),
              bcode: _.get(pointInfo, 'point3D.bid.code', ''),
              sid: _.get(pointInfo, 'point3D.sid._id', ''),
              storeyName: _.get(pointInfo, 'point3D.sid.name', ''),
              mid: _.get(pointInfo, 'point3D.mid', ''),
              scale: _.get(pointInfo, 'point3D.scale', ''),
              height: _.get(pointInfo, 'point3D.height', ''),
              heading: _.get(pointInfo, 'point3D.heading', ''),
              pitch: _.get(pointInfo, 'point3D.pitch', ''),
              roll: _.get(pointInfo, 'point3D.roll', '')
            }
          },
          statics
        )
      )
    }
    if (body.msgType) {
      const mapDataMessage = {
        point: {
          geo: _.get(pointInfo, 'point.geo', ''),
          isouter: !_.has(pointInfo, 'point.bid'),
          mapId: _.get(pointInfo, 'point.mapid', ''),
          bid: _.get(pointInfo, 'point.bid', ''),
          sid: _.get(pointInfo, 'point.sid._id', ''),
          storeyName: _.get(pointInfo, 'point.sid.name', '')
        },
        point3D: {
          isouter: !_.has(pointInfo, 'point3D.bid'),
          geo: _.get(pointInfo, 'point3D.geo', ''),
          bid: _.get(pointInfo, 'point3D.bid', ''),
          bcode: _.get(pointInfo, 'point3D.bid.code', ''),
          sid: _.get(pointInfo, 'point3D.sid._id', ''),
          storeyName: _.get(pointInfo, 'point3D.sid.name', ''),
          mid: _.get(pointInfo, 'point3D.mid', ''),
          scale: _.get(pointInfo, 'point3D.scale', ''),
          height: _.get(pointInfo, 'point3D.height', ''),
          heading: _.get(pointInfo, 'point3D.heading', ''),
          pitch: _.get(pointInfo, 'point3D.pitch', ''),
          roll: _.get(pointInfo, 'point3D.roll', '')
        }
      }
      const payloadMessage = {
        sender: user.realname,
        title: body.title,
        senderId: userId,
        task: id,
        video: body.video,
        position: point.pointName,
        date: Number(date),
        moment: arrivalTime,
        content: body.content,
        photo: body.photo,
        type: Number(body.msgType)
      }
      const payload = Object.assign(pointInfo, payloadMessage, mapDataMessage)
      const AlarmData = {
        time: Date.parse(moment().format('YYYY-MM-DD HH:mm:ss')) / 1000,
        srcName: user.realname,
        name: '',
        eventType: 'patrolAlarm',
        dealState: 'unProcess',
        position: point.pointName,
        uniqueId: patrolMsg ? patrolMsg._id : '',
        message: payload,
        define: true
      }
      const AlarmLog = await getAlarmLogModel()
      await AlarmLog.create(AlarmData)
    }
    ctx.status = 200
    ctx.set({ 'X-BSC-MOMENT': arrivalTime })
    ctx.body = Object.assign({ status: point.status }, body)
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 处理巡更点位状态及统计记录状态
const handleRrdStatus = (msgType, record, point, arrivalTime, upperTime) => {
  if (msgType) {
    // 超时与正常复合状态=>6|报警超时,7|报修超时,8|报警巡更,9|报修巡更
    if (arrivalTime > upperTime) {
      point.status = CONSTANT.TIMEOUTBASE + (Number(msgType) || 0)
      record.timout++
    } else {
      point.status = CONSTANT.NORMALBASE + (Number(msgType) || 0)
    }
    if (msgType === CONSTANT.ALARM) {
      record.alarm = record.alarm ? record.alarm + 1 : 1
    } else {
      record.warranty = record.warranty ? record.warranty + 1 : 1
    }
    // msgType === CONSTANT.ALARM ? record.alarm++ : record.warranty++
  } else {
    // 超时与正常单一状态=>3|已巡更, 4|超时
    point.status = arrivalTime > upperTime ? CONSTANT.PATROLTIMEOUT : CONSTANT.PATROL
  }
}

// 获取指定id的巡更记录
module.exports.findRecordById = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取指定id的巡更记录'))
  try {
    const id = ctx.params.id
    const result = await PatrolRecord.findById(id, '-__v -updatedAt -createdAt')
      .populate('userId', 'photo')
      .populate('points.pointId')
      .lean()
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      result.photo = result.userId.photo
      delete result.userId
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 删除指定id的巡更记录
module.exports.removeRecord = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-删除指定id的巡更记录'))
  try {
    const id = ctx.params.id
    const result = await PatrolRecord.findByIdAndRemove(id)
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = ''
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 删除指定id的巡更记录
module.exports.batRemoveRecord = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-删除指定id的巡更记录'))
  try {
    let ids = ctx.headers['x-bsc-ids']
    if (_.isNil(ids)) {
      ctx.throw(500, { code: 2001, message: '请传入批量删除的任务ids' })
    }
    ids = ids.split(',')
    const result = await PatrolRecord.remove({ _id: { $in: ids } })
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取当前正在运行的记录的详情(pc某条记录)
module.exports.findRecordDetail = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取当前正在运行的记录的详情'))
  try {
    const id = ctx.params.id
    const record = await PatrolRecord.findById(id, '-v createdAt updatedAt')
      .populate('userId')
      .lean()
    if (_.isEmpty(record)) {
      ctx.throw(500, { code: 2001, message: '找不到指定id的巡更记录' })
    }
    record.photo = record.userId.photo
    delete record.userId
    const message = await PatrolMessage.find({ task: id, date: moment(moment().format('YYYYMMDD')).format('X') }).lean()
    record.message = message
    ctx.status = 200
    ctx.body = record
  } catch (error) { }
}

// 获取当前正在运行的记录(pc多个用户记录)(需求改为在线用户)
module.exports.findRunRecord = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取当前正在运行的记录'))
  try {
    const query = {}
    query.$and = [{ precentage: { $gte: 0 } }, { precentage: { $lte: 100 } }]
    query.date = moment(moment().format('YYYY-MM-DD')).format('X')
    const users = await Security.find({ devStaus: 'online' }, 'photo realname devStaus sn selectedColor').populate('affiliation', 'name').lean()
    const userIds = users.map(item => item._id.toString())
    query.userId = { $in: userIds }
    const recordList = await PatrolRecord.find(query).lean()
    const userTimeoutCountInfos = await PatorlTimeoutRecord.find().lean()
    const userTask = userIds.map(item => {
      const record = recordList.find(v => v.userId.toString() === item)
      const user = users.find(usr => usr._id.toString() === item)
      const userTimeoutCountInfo = userTimeoutCountInfos.find(v => v.userId.toString() === item)
      const data = {
        precentage: 0,
        curPoint: '',
        nextPoint: '',
        recordId: '',
        alarm: 0,
        timout: 0,
        warranty: 0,
        alarmSentry: 0,
        timeout: 0,
        status: 'online'
      }
      if (record) {
        const sortPoint = sortPointByTime(record.points)
        const index = sortPoint.findIndex(item => !item.arrivalTime)
        if (index - 1 >= 0) {
          data.curPoint = sortPoint[index - 1].pointName
          data.nextPoint = sortPoint[index].pointName
        }
        data.precentage = record.precentage
        data.recordId = record._id.toString()
        data.alarm = record.alarm
        data.timout = record.timout
        data.warranty = record.warranty
        data.alarmSentry = record.alarmSentry
      }
      if (userTimeoutCountInfo) {
        user.alarmSentry = userTimeoutCountInfo.alarmCount || 0
      }
      if (userTimeoutCountInfo) {
        user.timeout = userTimeoutCountInfo.timeoutcount || 0
      }
      return Object.assign(data, user)
    })
    ctx.status = 200
    ctx.body = userTask
  } catch (err) {
    handleSysException(err, 2002)
  }
}

/**
 * 巡更点位排序
 * @param {*} points 巡更点位列表
 * @ret
 */
const sortPointByTime = points => {
  const mirror = _.clone(points)
  mirror.sort((a, b) => {
    var aduplicate = a.arrivalTime === '' ? '23:59:59' : a.arrivalTime
    var bduplicate = b.arrivalTime === '' ? '23:59:59' : b.arrivalTime
    if (aduplicate < bduplicate) {
      return -1
    } else if (aduplicate === bduplicate) {
      return 0
    }
    return 1
  })
  return mirror
}

// 查询当前正在运行的记录
module.exports.queryRunningRrd = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-查询当前正在运行的记录'))
  try {
    const query = {}
    const oid = ctx.query.org || ''
    let allChildrenIds = []
    const allorg = await Org.find(
      {
        type: 3
      },
      '_id name pid order'
    )
      .sort('order')
      .exec()
    allChildrenIds = tool.getChildren(allChildrenIds, allorg, oid)
    allChildrenIds.unshift(ctx.query.org + '') // 所有的现场机构
    if (!_.isEmpty(ctx.query.search.key)) {
      query.$or = [
        // { taskTitle: { $regex: decodeURIComponent(ctx.query.search.key) } },
        { realName: { $regex: decodeURIComponent(ctx.query.search.key) } }
      ]
    }
    query.$and = [{ precentage: { $gte: 0 } }, { precentage: { $lte: 100 } }]
    query.date = moment(moment().format('YYYY-MM-DD')).format('X')
    const recordList = await PatrolRecord.find(query).lean()
    const userIds = recordList.map(item => item.userId.toString())
    const userTimeoutCountInfos = await PatorlTimeoutRecord.find().lean()
    let usersMsg = null
    if (oid) { // 机构筛选
      usersMsg = await Security.find(
        { devStaus: 'online', affiliation: { $in: allChildrenIds } },
        'photo realname devStaus sn'
      ).populate('affiliation', 'name').lean()
    } else if (userIds.length > 0) { // 该单兵有巡更任务
      usersMsg = await Security.find({ _id: { $in: userIds }, devStaus: 'online' }, 'photo realname devStaus sn').populate('affiliation', 'name').lean()
    } else { // 该单兵无巡更任务
      usersMsg = await Security.find({ realname: { $regex: decodeURIComponent(ctx.query.search.key) }, devStaus: 'online' }, 'photo realname devStaus sn').populate('affiliation', 'name').lean()
    }
    const userTask = []
    usersMsg.forEach(item => {
      const record = recordList.find(v => v.userId.toString() === item._id.toString())
      const userTimeoutCountInfo = userTimeoutCountInfos.find(v => v.userId.toString() === item._id.toString())
      // const user = usersMsg.find(usr => usr._id.toString() === item)
      // if (!user) {
      //   return
      // }
      const data = {
        precentage: '',
        curPoint: '',
        nextPoint: '',
        recordId: '',
        alarm: 0,
        timout: 0,
        timeout: 0,
        warranty: 0,
        alarmSentry: 0,
        status: 'online',
        realname: '',
        photo: '',
        devStaus: '',
        sn: ''
      }

      if (record) {
        const sortPoint = sortPointByTime(record.points)
        const index = sortPoint.findIndex(item => !item.arrivalTime)
        if (index - 1 >= 0) {
          data.curPoint = record.points[index - 1].pointName
          data.nextPoint = record.points[index].pointName
        }
        data.precentage = record.precentage
        data.recordId = record._id.toString()
        data.alarm = record.alarm
        data.timout = record.timout
        data.timeout = 0
        data.warranty = record.warranty
        data.alarmSentry = record.alarmSentry
        data.realname = record.realName
        data.photo = item.photo
        data.affiliation = item.affiliation
      } else {
        data.precentage = 0
        data.recordId = item._id.toString()
        data.realname = item.realname
        data.photo = item.photo
        data.devStaus = item.devStaus
        data.sn = item.sn
        data.affiliation = item.affiliation
      }
      if (userTimeoutCountInfo) {
        data.alarmSentry = userTimeoutCountInfo.alarmCount || 0
      }
      if (userTimeoutCountInfo) {
        data.timeout = userTimeoutCountInfo.timeoutcount || 0
      }
      // data.status = data
      userTask.push(data)
    })

    ctx.status = 200
    ctx.body = userTask
  } catch (err) {
    handleSysException(err, 2002)
  }
}

const convertTimeStrtoNum = time => {
  const timeArr = moment()
    .format('YYYY-MM-DD hh:mm')
    .split(' ')
  timeArr[1] = time
  return Number(moment(timeArr.join(' ')).format('X'))
}

// 获取巡更任务列表
module.exports.taskList = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取巡更任务列表'))
  try {
    const query = {}
    const paganation = ctx.query.page || ''
    const orgId = ctx.query.search.org || ''
    const orgs = await Org.find({ type: CONSTANT.SECURITY }, 'name pid isroot sn')
      .sort('order')
      .lean()
    let org = []
    if (_.isEmpty(orgId)) {
      const root = _.find(orgs, { isroot: true })
      org = getChildren(org, orgs, root._id.toString())
      org.push(root._id.toString())
    } else {
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
    }
    const users = await Security.find({ affiliation: { $in: org } }).lean()
    query.userId = { $in: users.map(item => item._id.toString()) }
    const result = await paging.listQuery(
      PatrolTask,
      query,
      '-__v -updatedAt -createdAt -points -userId',
      { startTime: 1 },
      paganation,
      { path: 'org' },
      ctx
    )
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      result.results = result.results.map(item => {
        item = item.toObject()
        item.orgName = item.org.name
        item.org = item.org._id
        return item
      })
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取指定id的巡更任务
module.exports.findTaskById = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取指定id的巡更任务'))
  try {
    const id = ctx.params.id
    const result = await PatrolTask.findById(id, '-__v -updatedAt -createdAt')
      .populate('org')
      .populate('points.pointId')
      .lean()
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      result.orgName = result.org.name
      result.org = result.org._id
      result.points.forEach(item => {
        item.pointName = item.pointId.devName
        item.pointId = item.pointId._id
      })
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 修改指定id的巡更任务
module.exports.updateTask = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-修改指定id的巡更任务'))
  try {
    const id = ctx.params.id
    const body = ctx.request.body
    let find = false
    const points = body.points
    if (points.length === 0) {
      ctx.throw(500, { code: 2001, message: '必须选择巡更点位' })
    }
    if (_.isEmpty(body.userId)) {
      ctx.throw(500, { code: 2001, message: '巡更人员必须存在' })
    }
    // 固定模式
    if (Number(body.taskType) === CONSTANT.FIXED) {
      const set = new Set(_.compact(_.map(points, 'patrolTime')))
      if (set.size !== points.length) {
        ctx.throw(500, { code: 2001, message: '巡更点位存在重复的巡更时间请改正' })
      }
      const sortTime = _.sortBy(_.map(points, 'patrolTime'))
      body.startTime = sortTime[0]
      body.endTime = sortTime[sortTime.length - 1]
    } else if (Number(body.taskType) === CONSTANT.FLOAT) {
      // 浮动模式
      if (_.isEmpty(body.startTime) || _.isEmpty(body.endTime)) {
        ctx.throw(500, { code: 2001, message: '自由模式下开始时间|结束时间必须输入' })
      }
    } else {
      ctx.throw(500, { code: 2001, message: '任务类型必须存在' })
    }
    // 多任务不能相交,保证任务时间没有重叠
    const tasks = await PatrolTask.find({ userId: body.userId, _id: { $nin: [id] } }).lean()
    find = checkTime(tasks, body.endTime, body.startTime)
    if (find === true) {
      ctx.throw(500, { code: 2001, message: '巡更人时间有重叠，请重新分配时间' })
    }
    const result = await PatrolTask.findByIdAndUpdate(id, body, { new: true })
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      // 如果更新的任务起始时间大于当前时间则创建巡更记录
      if (moment().format('HH:mm') < body.startTime) {
        syncTaskRecord(result.toObject(), 'update')
      }
      ctx.status = 200
      ctx.body = ''
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 删除指定id的巡更任务
module.exports.removeTask = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-删除指定id的巡更任务'))
  try {
    const id = ctx.params.id
    await Promise.all([
      PatrolTask.findByIdAndRemove(id),
      PatrolRecord.remove({ taskId: id, date: Number(moment(moment().format('YYYYMMDD')).format('X')), precentage: 0 })
    ])
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 删除指定id的巡更任务
module.exports.batRemoveTask = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-批量删除指定id的巡更任务'))
  try {
    let ids = ctx.headers['x-bsc-ids']
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '请传入批量删除的任务ids' })
    }
    ids = ids.split(',')
    const date = Number(moment(moment().format('YYYYMMDD')).format('X'))
    await Promise.all([
      PatrolTask.remove({ _id: { $in: ids } }),
      PatrolRecord.remove({ taskId: { $in: ids }, date, precentage: 0 })
    ])
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 查询任务
module.exports.taskQuery = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-查询任务'))
  try {
    const key = ctx.query.search.key.replace(/\./g, '\\.')
    const query = {}
    const paganation = ctx.query.page || ''
    query.$or = [{ taskTitle: { $regex: key } }, { realName: { $regex: key } }]
    // query.taskTitle = ctx.query.search.taskTitle
    //   ? { $regex: decodeURIComponent(ctx.query.search.taskTitle.replace(/\./g, '\\.')) }
    //   : ''
    // query.realName = ctx.query.search.realName
    //   ? { $regex: decodeURIComponent(ctx.query.search.realName.replace(/\./g, '\\.')) }
    //   : ''
    if (!_.isEmpty(ctx.query.search.startTime) && !_.isEmpty(ctx.query.search.endTime)) {
      query.$and = [
        { startTime: { $gte: ctx.query.search.startTime } },
        { endTime: { $lte: ctx.query.search.endTime } }
      ]
    } else if (!_.isEmpty(ctx.query.search.startTime)) {
      query.startTime = { $gte: ctx.query.search.startTime }
    } else if (!_.isEmpty(ctx.query.search.endTime)) {
      query.endTime = { $lte: ctx.query.search.endTime }
    }
    const result = await paging.listQuery(
      PatrolTask,
      query,
      '-__v -updatedAt -createdAt',
      { startTime: 1 },
      paganation,
      { path: 'org' },
      ctx
    )
    result.results = result.results.map(item => {
      item = item.toObject()
      item.orgName = item.org.name
      item.org = item.org._id
      return item
    })
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 新增巡更任务
module.exports.createTask = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-新增巡更任务'))
  try {
    let find = false
    const body = ctx.request.body
    const points = body.points
    if (points.length === 0) {
      ctx.throw(500, { code: 2001, message: '必须选择巡更点位' })
    }
    if (_.isEmpty(body.userId)) {
      ctx.throw(500, { code: 2001, message: '巡更人员必须存在' })
    }
    // 固定模式
    if (Number(body.taskType) === CONSTANT.FIXED) {
      const set = new Set(_.compact(_.map(points, 'patrolTime')))
      if (set.size !== points.length) {
        ctx.throw(500, { code: 2001, message: '巡更点位存在重复的巡更时间请改正' })
      }
      // 保证任务时间没有重叠
      const sortTime = _.sortBy(_.map(points, 'patrolTime'))
      body.startTime = sortTime[0]
      body.endTime = sortTime[sortTime.length - 1]
    } else if (Number(body.taskType) === CONSTANT.FLOAT) {
      // 浮动模式
      if (_.isEmpty(body.startTime) || _.isEmpty(body.endTime)) {
        ctx.throw(500, { code: 2001, message: '自由模式下开始时间|结束时间必须输入' })
      }
    } else {
      ctx.throw(500, { code: 2001, message: '任务类型必须存在' })
    }
    // 多任务不能相交,保证任务时间没有重叠
    const tasks = await PatrolTask.find({ userId: body.userId }).lean()
    find = checkTime(tasks, body.endTime, body.startTime)
    if (find === true) {
      ctx.throw(500, { code: 2001, message: '巡更人时间有重叠，请重新分配时间' })
    }
    if (find === true) {
      ctx.throw(500, { code: 2001, message: '巡更人时间有重叠，请重新分配时间' })
    }
    const result = await PatrolTask.create(body)
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '请求失败' })
    } else {
      // 如果创建的任务起始时间大于当前时间则创建巡更记录
      if (moment().format('HH:mm') < body.startTime) {
        syncTaskRecord(result.toObject(), 'create')
      }
      ctx.status = 201
      ctx.headers['location'] = ctx.url + result._id
      ctx.body = [result._id]
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

const checkTime = (tasks, max, min) => {
  let find = false
  for (const item of tasks) {
    if (!(max < item.startTime || min > item.endTime)) {
      find = true
      break
    }
  }
  return find
}

// 获取巡更消息列表
module.exports.msgList = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取巡更消息列表'))
  try {
    const query = {}
    const paganation = ctx.query.page || ''
    const orgId = ctx.query.search.org || ''
    const orgs = await Org.find({ type: CONSTANT.SECURITY }, 'name pid isroot sn')
    const type = ctx.query.search.type || ''.sort('order').lean()
    let org = []
    if (_.isEmpty(orgId)) {
      const root = _.find(orgs, { isroot: true })
      org = getChildren(org, orgs, root._id.toString())
      org.push(root._id.toString())
    } else {
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
    }
    if (orgId) {
      const users = await Security.find({ affiliation: { $in: org } }).lean()
      const userId = users.map(item => item._id.toString())
      query.$or = [{ senderId: { $in: userId } }, { 'receiver.userId': { $in: userId } }]
    }
    query.$and = [{ type: { $in: type.split(',') } }]

    const result = await paging.listQuery(
      PatrolMessage,
      query,
      '-__v -updatedAt',
      { createdAt: -1 },
      paganation,
      '',
      ctx
    )
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 查询消息
module.exports.msgQuery = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-查询消息'))
  try {
    const key = ctx.query.search.key.replace(/\./g, '\\.')
    const query = {}
    const paganation = ctx.query.page || ''
    const types = ctx.query.search.type.split(',')
    key && (query.$or = [{ title: { $regex: key } }, { sender: { $regex: key } }])
    // query.title = ctx.query.search.title
    //   ? { $regex: decodeURIComponent(ctx.query.search.title.replace(/\./g, '\\.')) }
    //   : ''
    // query.sender = ctx.query.search.sender
    //   ? { $regex: decodeURIComponent(ctx.query.search.sender.replace(/\./g, '\\.')) }
    //   : ''
    if (_.isEmpty(types)) {
      ctx.throw(500, { code: 2001, message: '查询参数错误' })
    }
    query.$and = [{ type: { $in: types } }]
    if (!_.isEmpty(ctx.query.search.startTime) && !_.isEmpty(ctx.query.search.endTime)) {
      query.$and = [
        { date: { $gte: Number(ctx.query.search.startTime) } },
        { date: { $lte: Number(ctx.query.search.endTime) } }
      ]
    } else if (!_.isEmpty(ctx.query.search.startTime)) {
      query.date = { $gte: Number(ctx.query.search.startTime) }
    } else if (!_.isEmpty(ctx.query.search.endTime)) {
      query.date = { $lte: Number(ctx.query.search.endTime) }
    }

    const result = await paging.listQuery(
      PatrolMessage,
      query,
      '-__v -updatedAt',
      { createdAt: -1 },
      paganation,
      '',
      ctx
    )
    if (_.isEmpty(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取当前用户的消息(app)
module.exports.findUserMsg = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取当前用户的消息'))
  try {
    const paganation = ctx.query.page || ''
    const query = {}
    if (ctx.state.user) {
      query['receiver.userId'] = ctx.state.user._id
    } else {
      ctx.throw(500, { code: 2001, message: '用户身份信息找不到，请重新登陆！' })
    }
    let msges = await paging.listQuery(
      PatrolMessage,
      query,
      'title date moment',
      { createdAt: -1 },
      paganation,
      '',
      ctx
    )
    if (_.isEmpty(msges)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      msges = msges.results.map(item => {
        item = item.toObject()
        item.time = moment.unix(item.date).format('YYYY-MM-DD') + ' ' + item.moment
        delete item.moment
        delete item.date
        return item
      })
      ctx.status = 200
      ctx.body = msges
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}
// 获取指定id的巡更消息
module.exports.findMsgById = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取指定id的巡更消息'))
  try {
    const id = ctx.params.id
    const result = await PatrolMessage.findById(id, '-__v -updatedAt -createdAt')
      .populate('senderId', 'photo')
      .lean()
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取指定任务的消息列表
module.exports.getTaskMsg = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取指定任务的消息列表'))
  try {
    const id = ctx.params.id
    const result = await PatrolMessage.find({ task: id }, '-__v -updatedAt -createdAt').lean()
    ctx.status = 200
    ctx.body = result
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 删除指定id的巡更消息
module.exports.removeMsg = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-删除指定id的巡更消息'))
  try {
    const id = ctx.params.id
    const result = await PatrolMessage.findByIdAndRemove(id)
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = ''
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 批量删除巡更消息
module.exports.batRemoveMsg = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-批量删除巡更消息'))
  try {
    let ids = ctx.headers['x-bsc-ids']
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '请传入批量删除的任务ids' })
    }
    ids = ids.split(',')
    const result = await PatrolMessage.remove({ _id: { $in: ids } })
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = result
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 创建消息
module.exports.createMsg = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-新增巡更消息'))
  try {
    const body = ctx.request.body
    let result
    if (_.has(body, 'sender')) {
      // 页面中心创建消息推送到巡更单兵
      const body = ctx.request.body
      body.platform = 'pc'
      body.date = moment(moment().format('YYYY-MM-DD')).format('X')
      body.moment = moment().format('HH:mm')
      result = await PatrolMessage.create(body)
      socket.patrolMessage({
        sender: body.sender,
        date: body.date,
        receiver: body.receiver,
        title: body.title,
        content: body.content,
        id: result._id
      })
    } else {
      // 巡更人员通过采集信息创建消息并推送到页面单兵消息报警
      let usrid = ''
      if (ctx.state.user) {
        usrid = ctx.state.user._id
      } else {
        ctx.throw(500, { code: 2001, message: '用户身份信息找不到，请重新登陆！' })
      }
      const usr = await Security.findById(usrid).lean()
      if (_.isEmpty(usr)) {
        ctx.throw(500, { code: 2002, message: '用户不存在' })
      }
      body.platform = 'app'
      body.sender = usr.realname
      body.senderId = usrid
      body.date = moment(moment().format('YYYY-MM-DD')).format('X')
      body.moment = moment().format('HH:mm')
      let [message, record] = await Promise.all([PatrolMessage.create(body), findSentyCurRrd(usrid)])
      socket.sentryMessage(
        Object.assign(body, {
          precentage: _.get(record, 'precentage'),
          phone: usr.phone,
          picture: usr.photo,
          uniqueId: message._id
        })
      )
      result = message
      const AlarmData = {
        time: Date.parse(moment().format('YYYY-MM-DD HH:mm:ss')) / 1000,
        srcName: usr.realname,
        name: '',
        eventType: 'patrolAlarm',
        dealState: 'unProcess',
        position: body.position,
        uniqueId: result._id,
        message: result,
        define: true
      }
      if (result.type !== 0) {
        const AlarmLog = await getAlarmLogModel()
        await AlarmLog.create(AlarmData)
      }
    }
    ctx.status = 201
    ctx.headers['location'] = ctx.url + result._id
    ctx.body = [result._id]
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 消息确认
module.exports.confirm = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-报警消息确认'))
  try {
    const ids = ctx.params.id
    const id = ids.split(',')
    const pointId = ctx.request.body.pointId
    const time = Date.parse(moment().format('YYYY-MM-DD HH:mm:ss')) / 1000
    ctx.request.body.deal = true
    ctx.request.body.ackTime = time
    const body = ctx.request.body
    // const { planName, planId } = ctx.request.body
    // if (_.isEmpty(planName) || _.isEmpty(planId)) {
    //   ctx.throw(500, { code: 2001, message: '请求选择预案' })
    // }
    await patrolService.msgFindByIdAndUpdate(id, Object.assign({ status: 1 }, ctx.request.body))
    const AlarmLog = await getAlarmLogModel()
    await AlarmLog.updateMany({ uniqueId: { $in: id } }, body)
    socket.patrolConfirm({ type: 'message', uniqueId: id, pointId })
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 获取单兵报警列表
module.exports.warnningList = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取单兵报警'))
  try {
    const query = {}
    const paganation = ctx.query.page || ''
    let key = ctx.query.search.key || ''
    const orgId = ctx.query.search.org || ''
    if (!_.isEmpty(ctx.query.search.key)) {
      key = decodeURIComponent(key.replace(/\./g, '\\.'))
      query.$or = [{ recipient: { $regex: key } }, { sn: { $regex: key } }]
    }
    if (!_.isEmpty(ctx.query.search.startTime) && !_.isEmpty(ctx.query.search.endTime)) {
      query.$and = [
        { time: { $gte: Number(ctx.query.search.startTime) } },
        { time: { $lte: Number(ctx.query.search.endTime) } }
      ]
    } else if (!_.isEmpty(ctx.query.search.startTime)) {
      query.time = { $gte: Number(ctx.query.search.startTime) }
    } else if (!_.isEmpty(ctx.query.search.endTime)) {
      query.time = { $lte: Number(ctx.query.search.endTime) }
    }
    const orgs = await Org.find({ type: CONSTANT.SECURITY }, 'name pid isroot sn')
      .sort('order')
      .lean()
    let org = []
    if (_.isEmpty(orgId)) {
      const root = _.find(orgs, { isroot: true })
      org = getChildren(org, orgs, root._id.toString())
      org.push(root._id.toString())
    } else {
      org = getChildren(org, orgs, orgId)
      org.push(orgId)
    }
    const users = await Security.find({ affiliation: { $in: org } }).lean()
    const userId = users.map(item => item._id.toString())
    query.recipientId = { $in: userId }
    const result = await patrolService.warnningPageQuery(query, '', { createdAt: -1 }, paganation, '', ctx)
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    handleSysException(error, 2002)
  }
}

// 获取指定id单兵报警
module.exports.findWarnById = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-获取指定id单兵报警'))
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不合法' })
    }
    const result = await patrolService.warnningfindById(id)
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    handleSysException(error, 2002)
  }
}

// 删除指定id的报警消息
module.exports.removeWarnning = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-删除指定id的报警消息'))
  try {
    const id = ctx.params.id
    const result = await PatrolWarnning.findByIdAndRemove(id)
    if (_.isNull(result)) {
      ctx.throw(500, { code: 2001, message: '找不到请求的服务资源' })
    } else {
      ctx.status = 200
      ctx.body = ''
    }
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 批量删除
module.exports.batRemoveWarnning = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-批量删除报警消息'))
  try {
    let ids = ctx.request.headers['x-bsc-ids']
    ids = ids.split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '请选择要删除的数据' })
    }
    await PatrolWarnning.remove({ _id: { $in: ids } })
    ctx.status = 200
    ctx.body = ''
  } catch (err) {
    handleSysException(err, 2002)
  }
}

// 中心请求打开巡更人员摄像机
module.exports.openUserCamera = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-中心请求打开巡更人员摄像机'))
  try {
    const id = ctx.query.search.id || ''
    const command = ctx.query.search.command || ''
    const webName = ctx.query.name
    if (_.isEmpty(id) || !CONSTANT.LIVECOMMAND.includes(command)) {
      ctx.throw(500, { code: 2001, message: '参数不合法' })
    }
    if (_.isEmpty(webName)) {
      ctx.throw(500, { code: 2001, message: '参数不合法' })
    }
    // const security = await sentryService.securityfindById(id)
    const [security, sysParams] = await Promise.all([sentryService.securityFindById(id), patrolService.getSysParams()])
    const res = {}
    if (!_.isEmpty(sysParams) && sysParams.rtmp) {
      if (sysParams.rtmp.lastIndexOf('/') === sysParams.rtmp.length - 1) {
        sysParams.rtmp = sysParams.rtmp.substring(0, sysParams.rtmp.length - 1)
      }
      res.rtmp = `${sysParams.rtmp}/${security.sn}-${security.username}-${webName}`
    }
    // const rtmp = 'rmtp://127.0.0.1:1935/live/patrol/' + security.sn + '-' + security.username
    await patrolService.warnningCreate({
      sender: '中心',
      recipient: security.realname,
      userName: security.username,
      recipientId: security._id,
      time: moment().unix(),
      sn: security.sn,
      storage: sysParams.storage,
      path: sysParams.path,
      webName: webName
    })
    const param = { command, rtmp: res.rtmp, id }
    socket.patrolRtmp(param)
    if (ctx.query.search.uniqueId) {
      socket.patrolConfirm({ uniqueId: ctx.query.search.uniqueId, type: 'alarm' })
    }
    ctx.status = 200
    ctx.body = {
      rtmp: res.rtmp,
      sn: security.sn,
      name: security.username,
      storage: sysParams.storage,
      path: sysParams.path
    }
  } catch (error) {
    handleSysException(error, 2002)
  }
}

// 储存一键报警中心请求巡更人员摄像头的视频录像
module.exports.createUserCameraVideo = async ctx => {
  ctx.set('loginfo', encodeURI('电子巡更-中心请求打开巡更人员摄像机'))
  try {
    const id = ctx.request.body.id || ''
    const command = ctx.request.body.command || ''
    const webName = ctx.request.body.webName
    const uniqueId = ctx.request.body.uniqueId
    if (_.isEmpty(id) || !CONSTANT.LIVECOMMAND.includes(command)) {
      ctx.throw(500, { code: 2001, message: '参数不合法' })
    }
    if (_.isEmpty(webName)) {
      ctx.throw(500, { code: 2001, message: '参数不合法' })
    }
    const [security, sysParams] = await Promise.all([sentryService.securityFindById(id), patrolService.getSysParams()])
    await patrolService.warnningCreate({
      sender: '中心',
      recipient: security.realname,
      userName: security.username,
      recipientId: security._id,
      time: moment().unix(),
      sn: security.sn,
      storage: sysParams.storage,
      path: sysParams.path,
      webName: webName,
      uniqueId: uniqueId
    })
    const AlarmLog = await getAlarmLogModel()
    const alarmId = await PatrolWarnning.find({uniqueId: uniqueId})
    await AlarmLog.findOneAndUpdate({uniqueId: uniqueId}, {recordId: alarmId[0]._id}).lean()
    ctx.status = 200
    ctx.body = ''
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.getPatrolTrajectory = async ctx => {
  try {
    const id = ctx.query.search.id || ''
    const date = ctx.query.search.date || ''
    const start = ctx.query.search.start || ''
    const end = ctx.query.search.end || ''
    const query = {}
    if (_.isEmpty(id) || _.isEmpty(date) || _.isEmpty(start) || _.isEmpty(end)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    query.usrId = id
    query.date = moment(date).format('X')
    const trajectory = await patrolService.findTrajectory(query, { start, end })
    ctx.status = 200
    ctx.body = trajectory
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.instantMessage = async ctx => {
  try {
    const body = ctx.request.body
    body.time = moment().format('YYYY-MM-DD HH:mm:ss')
    socket.instantMessage(body)
    ctx.status = 200
    ctx.body = ''
  } catch (error) {
    handleSysException(error, 2002)
  }
}

const syncTaskRecord = async (task, action) => {
  try {
    const date = Number(moment(moment().format('YYYYMMDD')).format('X'))
    // 获取所有巡更点位
    const pointCol = await PatrolPoint.find({}).lean()
    // 如果是创建任务则同步创建任务记录
    if (action === 'create') {
      task = createTaskRrd(task, pointCol)
      await PatrolRecord.create(task)
    } else {
      task = createTaskRrd(task, pointCol)
      // 如果是更新任务并且任务没有执行前则更新任务记录
      await PatrolRecord.update(
        { taskId: task.taskId, startTime: { $gte: moment().format('HH:mm') }, date: Number(date), precentage: 0 },
        task,
        {
          multi: true
        }
      )
    }
  } catch (err) {
    console.log(err)
  }
}

// 每日创建巡更记录
module.exports.scheduleRecord = async () => {
  try {
    // 获取所有任务模板与巡更点位
    const taskCol = await PatrolTask.find({}, '-__v -createdAt -updatedAt').lean()
    const pointCol = await PatrolPoint.find({}).lean()
    const records = []
    for (const task of taskCol) {
      const record = createTaskRrd(task, pointCol)
      records.push(record)
    }
    // 创建今日所有任务记录副本
    await PatrolRecord.create(_.compact(records))
  } catch (err) {
    console.log('location: patrol.controller.js->巡更任务记录 定时创建')
    console.log(err)
  }
}
// 创建任务的记录副本
const createTaskRrd = (task, pointCol) => {
  task.date = Number(moment(moment().format('YYYYMMDD')).format('X'))
  task.taskId = task._id.toString()
  const except = []
  // 获取巡更任务下所有点位的地理坐标及设备编号
  for (const item of task.points) {
    const target = _.find(pointCol, point => point._id.toString() === item.pointId.toString())
    if (!_.isEmpty(target)) {
      item.pointName = target.devName
      // item.geo = target.point ? target.point.geo : ''
      item.devId = target.devCode
    } else {
      except.push(item)
    }
  }
  // 任务记录去除找不到的巡更点位，如果所有点位找不到返回空的任务记录
  _.pullAllWith(task.points, except, _.isEqual)
  if (task.points.length === 0) {
    return null
  }
  if (task.taskType === CONSTANT.FIXED) {
    task.startTime = task.points[0].patrolTime
    task.endTime = task.points[task.points.length - 1].patrolTime
  }
  task.undone = task.points.length
  if (task._id) {
    delete task._id
  }
  return task
}

// 记录人员手持设备状态
module.exports.updDevStatus = (data, status) => {
  try {
    Security.update({ _id: data.usrid }, { devStaus: status }).exec()
  } catch (err) {
    console.log(err)
  }
}
module.exports.checkUserOnLine = async () => {
  try {
    const user = await Security.find({ devStaus: 'online' }, 'realname phone photo geo sn').lean()
    const mapUsr = []
    for (const item of user) {
      mapUsr.push(item)
    }
    !_.isEmpty(mapUsr) && socket.patrolUser(mapUsr)
  } catch (error) {
    handleSysException(error, 2002)
  }
}
module.exports.trajectory = async ctx => {
  try {
    const id = ctx.query.search.id || ''
    const start = parseInt(ctx.query.search.start) || ''
    const end = parseInt(ctx.query.search.end) || ''
    const query = {}
    if (_.isEmpty(id) || !_.isInteger(start) || !_.isInteger(end)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    query.usrId = id
    query.date = {
      $gte: parseInt(
        moment(start)
          .startOf('day')
          .format('X')
      ),
      $lte: parseInt(
        moment(end)
          .startOf('day')
          .format('X')
      )
    }
    const trajectory = await patrolService.findTrajectorySelect(query, { start, end })
    ctx.status = 200
    ctx.body = trajectory
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.speech = async ctx => {
  try {
    const body = ctx.request.body
    const time = moment().format('X') // 秒级时间戳
    Object.assign(body, { time: time })
    const result = await socket.intercom(body)
    if (result) {
      ctx.throw(500, result)
    }
    ctx.status = 201
    ctx.body = body
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.getSpeechUrl = async ctx => {
  try {
    const { pcid, appid } = ctx.request.body
    const res = {}
    const [security, sysParams, WebUser] = await Promise.all([
      sentryService.securityFindById(appid), // 通过指定的id获取巡更单兵人员信息
      patrolService.getSysParams(), // 获取系统参数
      UserService.findById(pcid) // 根据id查找账户
    ])
    if (WebUser) {
      res.rtmp = `${sysParams.rtmp}/${security.sn}-${security.username}-${WebUser.name}`
    } else {
      ctx.throw(500, { code: 2001, message: 'PC用户不存在' })
    }
    ctx.status = 200
    ctx.body = { url: res.rtmp, dsId: sysParams.storage, dir: sysParams.path }
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.speechDisconnet = async ctx => {
  try {
    await socket.speechDisconnet(ctx.request.body)
    ctx.status = 200
    ctx.body = ''
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.broadcast = async ctx => {
  try {
    const body = ctx.request.body
    // const id = new mongoose.Types.ObjectId()
    // const time = Date.now()
    // Object.assign(body, { time: time, tag: id })
    const usrid = await socket.broadcast(body)
    ctx.status = 200
    ctx.body = { usrid }
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.getBroadcastUrl = async ctx => {
  try {
    const { name } = ctx.request.body
    const res = {}
    const sysParams = await patrolService.getSysParams()
    if (name) {
      res.rtmp = `${sysParams.rtmp}/${name}`
    } else {
      ctx.throw(500, { code: 2001, message: 'PC用户不存在' })
    }
    if (!sysParams.storage && !sysParams.path) {
      ctx.throw(500, { code: 2001, message: '未配置录像设置' })
    }
    ctx.status = 201
    ctx.body = { url: res.rtmp, dsId: sysParams.storage, dir: sysParams.path }
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.broadcastJoin = async ctx => {
  try {
    const usrid = await socket.broadcastJoin(ctx.request.body)
    ctx.status = 200
    ctx.body = { usrid }
  } catch (error) {
    handleSysException(error, 2002)
  }
}
module.exports.broadcastDisconnet = async ctx => {
  try {
    socket.broadcastDisconnet(ctx.request.body)
    ctx.status = 201
    ctx.body = ''
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.getWebUser = async ctx => {
  try {
    let query = {}
    if (!ctx.query.all) {
      const time = moment().format('X') * 1
      query = {
        $or: [{ exptime: { $gte: time } }, { exptime: -1 }]
      }
    }
    const userList = await UserService.getAll('_id name realName', query)
    ctx.body = userList
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.addRecord = async ctx => {
  try {
    const userList = await UserService.getAll('_id name realName')
    ctx.body = userList
  } catch (error) {
    handleSysException(error, 2002)
  }
}

/**
 * 查询对讲历史记录
 * @param  {String} name
 * @param  {Number} starttime
 * @param  {Number} endtime
 * @param  {Number} page
 * @param  {Number} limit
 */
module.exports.historyList = async ctx => {
  try {
    const orgId = ctx.query.oid
    if (_.isEmpty(orgId)) {
      ctx.throw(500, {
        code: 2004,
        message: '必须指定获取组织机构id'
      })
    }
    const orgs = await Org.find({ type: 3 }, 'name pid isroot')
      .sort('order')
      .lean()
    let refOrg = []
    if (_.isEmpty(orgId)) {
      const root = _.find(orgs, {
        isroot: true
      })
      refOrg = getChildren(refOrg, orgs, root._id.toString())
      refOrg.push(root._id.toString())
    } else {
      refOrg = getChildren(refOrg, orgs, orgId)
      refOrg.push(orgId)
    }
    const userName = await Security.distinct('username', {
      affiliation: {
        $in: refOrg
      }
    })
    const query = {
      appName: {
        $in: userName
      }
    }
    if (ctx.query.starttime) {
      query.startTime = {
        '$gte': parseInt(ctx.query.starttime)
      }
    }
    if (ctx.query.endtime) {
      if (query.startTime) {
        query.startTime['$lte'] = parseInt(ctx.query.endtime)
      } else {
        query.startTime = {
          '$lte': parseInt(ctx.query.endtime)
        }
      }
    }
    if (ctx.query.name) {
      query.webName = {
        $regex: ctx.query.name + '' || ''
      }
    }
    const { results } = await patrolService.getSpeechHistoryList(query, ctx)
    ctx.status = 200
    ctx.body = results
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.addHistory = async ctx => {
  try {
    ctx.body = await patrolService.addSpeechHistory(ctx.request.body)
    ctx.status = 201
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.updateHistory = async ctx => {
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, {
        code: 2004,
        message: '非法id'
      })
    }
    ctx.body = await patrolService.updateSpeechHistory(id, ctx.request.body)
    ctx.status = 201
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.delHistory = async ctx => {
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, {
        code: 2004,
        message: '非法id'
      })
    }
    await patrolService.deleteSpeechHistory(id)
    ctx.status = 200
    ctx.body = ''
  } catch (error) {
    handleSysException(error, 2002)
  }
}

/**
 * 查询广播历史记录
 * @param  {String} name
 * @param  {Number} starttime
 * @param  {Number} endtime
 * @param  {Number} page
 * @param  {Number} limit
 */
module.exports.addRadioHistory = async ctx => {
  try {
    ctx.body = await patrolService.addRadioHistory(ctx.request.body)
    ctx.status = 201
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.getRadioHistoryList = async ctx => {
  try {
    const orgId = ctx.query.oid
    if (_.isEmpty(orgId)) {
      ctx.throw(500, {
        code: 2004,
        message: '必须指定获取组织机构id'
      })
    }
    const orgs = await Org.find({ type: 3 }, 'name pid isroot').sort('order').lean()
    let refOrg = []
    if (_.isEmpty(orgId)) {
      const root = _.find(orgs, { isroot: true })
      refOrg = getChildren(refOrg, orgs, root._id.toString())
      refOrg.push(root._id.toString())
    } else {
      refOrg = getChildren(refOrg, orgs, orgId)
      refOrg.push(orgId)
    }
    const query = {}
    if (ctx.query.startTime && parseInt(ctx.query.startTime) !== 0) {
      query.startTime = { '$gte': parseInt(ctx.query.startTime) }
    }
    if (ctx.query.endTime && parseInt(ctx.query.endTime) !== 0) {
      if (query.startTime) {
        query.startTime['$lte'] = parseInt(ctx.query.endTime)
      } else {
        query.startTime = { '$lte': parseInt(ctx.query.endTime) }
      }
    }
    if (ctx.query.webName) {
      query.webName = { $regex: ctx.query.webName + '' || '' }
    }
    const { results } = await patrolService.getRadioHistoryList(query, ctx)
    ctx.status = 200
    ctx.body = results
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.updateRadioHistory = async ctx => {
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, {
        code: 2004,
        message: '非法id'
      })
    }
    ctx.body = await patrolService.updateRadioHistory(id, ctx.request.body)
    ctx.status = 201
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.deleteRadioHistory = async ctx => {
  try {
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, {
        code: 2004,
        message: '非法id'
      })
    }
    await patrolService.deleteRadioHistory(id)
    ctx.status = 200
    ctx.body = ''
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.getDsId = async ctx => {
  try {
    const { storage = '' } = await patrolService.getSysParams()
    ctx.body = {
      dsId: storage
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error, 2002)
  }
}

module.exports.sentryPullFlow = async ctx => {
  try {
    ctx.body = await socket.sentryPullFlow(ctx.request.body)
    ctx.status = 200
  } catch (error) {
    handleSysException(error, 2002)
  }
}
