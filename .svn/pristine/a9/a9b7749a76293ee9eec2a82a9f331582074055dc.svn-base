/*
 * @Author: linhang
 * @Date: 2018-09-20 16:40:25
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-02 13:45:29
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const handleSysException = require('../../../common/tools').handleSysException
const AlarmRemark = require('mongoose').model('AlarmRemark')
const ResProperty = mongoose.model('ResProperty')
const Resource = mongoose.model('Resource')
const Device = mongoose.model('Device')
const AlarmCfg = mongoose.model('alarmCfg')
const tool = require('../../../common/tools')
const Org = mongoose.model('Org')
const constant = require('../../../common/constant')
const getDb = require('../../../common/logdb')
const paging = require('../../paging')
const OrgRes = mongoose.model('OrgRes')
const { ORG_TYPE } = require('../../../common/constant')
const AlarmLogSchema = new mongoose.Schema({
  orgId: {
    type: Schema.Types.ObjectId,
    ref: 'Org'
  },
  srcName: String,
  level: Number,
  alarmClassifyId: {
    type: Schema.Types.ObjectId,
    ref: 'alarmType'
  },
  // 报警类型
  eventType: String,
  time: Number,
  name: String,
  dealState: String,
  ackTime: Number,
  endTime: Number
})
/**
 * 获取bstar库AlarmLog模型
 */
const getAlarmLogModel = async function getAlarmLogModel() {
  const db = await getDb()
  const AlarmLog = db.model('AlarmLog', AlarmLogSchema, 'AlarmLog')
  return AlarmLog
}

exports.getAlarmLogModel = getAlarmLogModel

// 获取报警列表
exports.getAlarmLog = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('报警处理统计分析-获取所有报警列表'))
    const AlarmLog = await getAlarmLogModel()
    const searchObj = ctx.query.search
    const search = {}
    search.$and = []
    // 报警分类
    if (searchObj.alarmClassifyId) {
      search.$and.push({ alarmClassifyId: searchObj.alarmClassifyId })
    }
    // 报警类型
    if (searchObj.alarmType && searchObj.type === 'fire') {
      const alarmType = searchObj.alarmType.split(',')
      search.$and.push({ subtype: { $in: alarmType } })
      // const alarmType = searchObj.alarmType
      // search.$and.push({ subtype: alarmType })
    } else if (searchObj.alarmType) {
      const alarmType = searchObj.alarmType.split(',')
      search.$and.push({ eventType: { $in: alarmType } })
    }
    // 报警确认
    if (searchObj.deal === 'true') {
      search.$and.push({ deal: true })
    } else if (searchObj.deal === 'false') {
      search.$and.push({ deal: { $exists: false } })
    }
    // 机构
    if (searchObj.orgId) {
      let allChildrenIds = [] // 该机构的所有子机构
      const orgs = await Org.find(
        {
          type: constant.ORG_TYPE.LOCALE
        },
        '_id name pid order'
      ).exec()
      allChildrenIds = tool.getChildren(allChildrenIds, orgs, searchObj.orgId)
      allChildrenIds.unshift(searchObj.orgId)
      allChildrenIds = allChildrenIds.map(item => mongoose.Types.ObjectId(item))
      const orgNames = await Org.distinct('name', { _id: { $in: allChildrenIds } })
      search.$and.push({ orgName: { $in: orgNames } })
    }
    // 报警级别
    if (searchObj.level !== '0') {
      search.$and.push({ level: Number(searchObj.level) })
    }
    // 报警名称
    if (searchObj.srcName) {
      search.$and.push({ name: { $regex: searchObj.srcName } })
    }
    // 处理状态
    if (searchObj.dealState) {
      search.$and.push({ dealState: { $regex: searchObj.dealState } })
    }
    // 警情处理
    if (searchObj.alarmDeal) {
      search.$and.push({ ackContent: { $regex: searchObj.alarmDeal } })
    }
    // 警情类型
    if (searchObj.situationType) {
      search.$and.push({ ackContent: { $regex: searchObj.situationType } })
    }
    // 时间
    search.$and.push({ time: { $gte: searchObj.beginTime, $lte: searchObj.endTime } })
    // 确认时间
    if (searchObj.confirmStartTime && searchObj.confirmEndTime) {
      search.$and.push({ ackTime: { $gte: searchObj.confirmStartTime, $lte: searchObj.confirmEndTime } })
    }
    // 接听/停止时间
    if (searchObj.resType !== 'noResTime') {
      search.$and.push({ endTime: { $gte: searchObj.responsStartTime, $lte: searchObj.responsEndTime } })
    }
    // 如果是未定义的报警，则不发送
    search.$and.push({ define: true })
    const page = ctx.query.page
    let results
    if (searchObj.alarmType === 'askHelp,acceptHelp,endHelp') {
      results = await listQuery(AlarmLog, search, '', { time: -1 }, page, '', ctx)
    } else {
      results = await paging.listQuery(AlarmLog, search, '', { time: -1 }, page, '', ctx)
    }
    let resultData = results.results

    resultData = distinctAlarmHelperDataByUUID(resultData)
    ctx.body = resultData
  } catch (err) {
    handleSysException(err)
  }
}
// 获取 某条报警 备注信息
exports.getAlarmRemark = async ctx => {
  try {
    const id = ctx.params.id
    const data = await AlarmRemark.findOne({ alarmId: id })
    ctx.body = data
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

// 添加 报警 备注信息
exports.putAlarmRemark = async ctx => {
  try {
    const id = ctx.params.id
    const body = ctx.request.body
    const data = await AlarmRemark.findOne({ alarmId: id })
    if (!data) {
      await AlarmRemark.create({ alarmId: id, remarks: body })
    } else {
      await AlarmRemark.findOneAndUpdate({ alarmId: id }, { remarks: body })
    }
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 获取7种报警前100/20条数据，可过滤条件
 */
exports.getAlarms = async ctx => {
  try {
    const AlarmLog = await getAlarmLogModel()
    let alarmHelpFlag = false
    let query = {}
    const type = ctx.query.type
    const body = ctx.request.body
    let flag = false
    if (type === 'normal') {
      if (body.flag) {
        query.$or = []
        if (body.alarmInput.flag && body.alarmZone.flag) {
          query.$or.push({ eventType: 'alarmInput', level: { $gte: body.alarmInput.level } })
          query.$or.push({ eventType: { $in: ['alarmZone', 'alarmGT'] }, level: { $gte: body.alarmZone.level } })
        } else if (body.alarmInput.flag && !body.alarmZone.flag) {
          query.$or.push({ eventType: 'alarmInput', level: { $gte: body.alarmInput.level } })
        } else if (!body.alarmInput.flag && body.alarmZone.flag) {
          query.$or.push({ eventType: { $in: ['alarmZone', 'alarmGT'] }, level: { $gte: body.alarmZone.level } })
        }
      } else {
        flag = true
      }
    } else if (type === 'video') {
      const monitorArr = [
        'alarmMoveSense',
        'videoMask',
        'sceneSwitch',
        'definitionAbnormal',
        'brightnessAbnormal',
        'noise',
        'colorCast',
        'signalLoss',
        'screenFreeze'
      ]
      const focusArr = ['focusAttention']
      if (body.flag) {
        query.$or = []
        if (body.monitor.flag && body.focus.flag) {
          query.$or.push({ eventType: { $in: monitorArr }, level: { $gte: body.monitor.level } })
          query.$or.push({ eventType: { $in: focusArr }, level: { $gte: body.focus.level } })
        } else if (body.monitor.flag && !body.focus.flag) {
          query.$or.push({ eventType: { $in: monitorArr }, level: { $gte: body.monitor.level } })
        } else if (!body.monitor.flag && body.focus.flag) {
          query.$or.push({ eventType: { $in: focusArr }, level: { $gte: body.focus.level } })
        }
      } else {
        flag = true
      }
    } else if (type === 'intelligent') {
      const intelligentArr = [
        'perimeter',
        'tripwire',
        'missingObject',
        'leftObject',
        'loitering',
        'retrogradeDetection',
        'lingerDetection',
        'doubleCordon',
        'blackList',
        'whiteList',
        'dispatch',
        'areaInvade',
        'fastMove',
        'parkDetect',
        'humanAssemble',
        'objectMove'
      ]
      const violationArr = ['vioRetrograde', 'vioPark', 'vioTurnLeft', 'vioTurnRight']
      const faceArr = ['faceControl']
      if (body.flag) {
        query.$or = []
        if (body.intelligent.flag && body.violation.flag && body.face.flag) {
          query.$or.push({ eventType: { $in: intelligentArr }, level: { $gte: body.intelligent.level } })
          query.$or.push({ eventType: { $in: violationArr }, level: { $gte: body.violation.level } })
          query.$or.push({ eventType: { $in: faceArr }, level: { $gte: body.face.level } })
        } else if (body.intelligent.flag && body.violation.flag && !body.face.flag) {
          query.$or.push({ eventType: { $in: intelligentArr }, level: { $gte: body.intelligent.level } })
          query.$or.push({ eventType: { $in: violationArr }, level: { $gte: body.violation.level } })
        } else if (body.intelligent.flag && !body.violation.flag && body.face.flag) {
          query.$or.push({ eventType: { $in: intelligentArr }, level: { $gte: body.intelligent.level } })
          query.$or.push({ eventType: { $in: faceArr }, level: { $gte: body.face.level } })
        } else if (!body.intelligent.flag && body.violation.flag && body.face.flag) {
          query.$or.push({ eventType: { $in: violationArr }, level: { $gte: body.violation.level } })
          query.$or.push({ eventType: { $in: faceArr }, level: { $gte: body.face.level } })
        } else if (body.intelligent.flag && !body.violation.flag && !body.face.flag) {
          query.$or.push({ eventType: { $in: intelligentArr }, level: { $gte: body.intelligent.level } })
        } else if (!body.intelligent.flag && body.violation.flag && !body.face.flag) {
          query.$or.push({ eventType: { $in: violationArr }, level: { $gte: body.violation.level } })
        } else if (!body.intelligent.flag && !body.violation.flag && body.face.flag) {
          query.$or.push({ eventType: { $in: faceArr }, level: { $gte: body.face.level } })
        }
      } else {
        flag = true
      }
    } else if (type === 'alarmHelp') {
      const alarmHelpArr = ['askHelp', 'acceptHelp', 'endHelp']
      if (body.flag) {
        alarmHelpFlag = true
        query.$or = []
        query.$or.push({ eventType: { $in: alarmHelpArr }, level: { $gte: body.level } })
      } else {
        flag = true
      }
    } else if (type === 'fireAlarm') {
      const fireAlarmArr = ['fireAlarm', 'fireFailure']
      if (body.flag) {
        query.$or = []
        query.$or.push({ eventType: { $in: fireAlarmArr }, level: { $gte: body.level } })
      } else {
        flag = true
      }
    } else if (type === 'single') {
      if (body.flag) {
        query.$or = []
        if (body.single && body.patrol) {
          query.$or.push({ eventType: 'individualAlarm' })
          query.$or.push({ eventType: 'patrolAlarm' })
        } else if (body.single && !body.patrol) {
          query.$or.push({ eventType: 'individualAlarm' })
        } else if (!body.single && body.patrol) {
          query.$or.push({ eventType: 'patrolAlarm' })
        }
      } else {
        flag = true
      }
    } else if (type === 'exception') {
      query.eventType = 'systemException'
    }
    if (flag) {
      ctx.body = []
      return
    }
    if (body.dealState === 'unProcess' && type !== 'alarmHelp') {
      query.dealState = 'unProcess'
    }
    // 地图调用需要limit为20条数据
    const limit = ctx.query.page.limit === 10 ? 100 : ctx.query.page.limit
    // 地图模块调用需要此条报警对应的资源已经添加到地图点位
    if (limit !== 100 && ctx.query.map === '2D' && type !== 'single') {
      if (alarmHelpFlag) {
        const resIds = await Resource.distinct('_id', {
          point: { $exists: true },
          $or: [{ name: { $regex: '报警箱_' } }, { name: { $regex: '报警柱_' } }]
        })
        if (!_.isEmpty(resIds)) {
          query.chanId = { $in: resIds }
        } else {
          ctx.body = []
          return
        }
      } else {
        const resourceIds = await Resource.distinct('_id', { point: { $exists: true } })
        query.chanId = { $in: resourceIds }
      }
    } else if (limit !== 100 && ctx.query.map === '3D' && type !== 'single') {
      if (alarmHelpFlag) {
        const resIds = await Resource.distinct('_id', {
          point3D: { $exists: true },
          $or: [{ name: { $regex: '报警箱_' } }, { name: { $regex: '报警柱_' } }]
        })
        if (!_.isEmpty(resIds)) {
          query.chanId = { $in: resIds }
        } else {
          ctx.body = []
          return
        }
      } else {
        const resourceIds = await Resource.distinct('_id', { point: { $exists: true } })
        query.chanId = { $in: resourceIds }
      }
    }
    let data = await AlarmLog.find(query)
      .sort({ time: -1 })
      .limit(limit)
      .lean()
    const roleId = ctx.query.roleId
    // 给报警数据添加权限数据
    if (type !== 'single' && !_.isEmpty(data)) {
      data = await addAuth(data, roleId)
    }
    if (type === 'alarmHelp') {
      data = distinctAlarmHelperDataByUUID(data)
      if (body.dealState === 'unProcess') {
        data = _.filter(data, { dealState: 'unProcess' })
      }
    }

    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 给报警数据添加权限数据
 * @param {*} data
 */
const addAuth = async (data, roleId) => {
  try {
    // 如果是管理员，默认拥有所有权限
    if (roleId === '5be27279e74ee9376c681111') {
      const arr = [
        'preview',
        'cloudControl',
        'playback',
        'dDownload',
        'alarmReceive',
        'alarmConfirm',
        'alarmClean',
        'deployment',
        'disarming',
        'clean',
        'bypass',
        'removeBypass'
      ]
      data.forEach(item => {
        const obj = {}
        for (let i = 0; i < arr.length; i++) {
          obj[arr[i]] = arr[i]
        }
        item.alarmPermission = obj
      })
      return data
    } else {
      // 如果资源id是视频通道，默认拥有报警清除、确认、接收权限
      const reses = await Resource.find({ type: 0 }, '_id')
        .lean()
        .exec()
      let allResIds = reses.map(item => item._id + '')
      // 查询人脸资源，排除在外，人脸资源在角色管理里边有配置的地方
      const faceOrg = await Org.find({ type: ORG_TYPE.FACE_CAPTURE }, '_id').lean()
      let faceResIds = await OrgRes.distinct('resource', { rootorg: faceOrg._id, islane: false })
      faceResIds = faceResIds.map(item => item + '')
      allResIds = allResIds.filter(item => !faceResIds.includes(item))
      // 查询所有type为traffic的设备,智能交通报警默认拥有报警清除、确认、接收权限
      const deviceIds = await Device.distinct('_id', { type: 'traffic' })
      const devIds = deviceIds.map(item => item + '')
      allResIds = allResIds.concat(devIds)
      const resProperties = {
        alarmReceive: 'alarmReceive',
        alarmConfirm: 'alarmConfirm',
        alarmClean: 'alarmClean'
      }
      const resIds = data.map(item => item.chanId + '')
      const authData = await ResProperty.find({ role: roleId, resource: { $in: resIds } }).lean()
      if (authData.length) {
        const authMap = {}
        for (let item of authData) {
          authMap[item.resource + ''] = item.properties
        }
        data.forEach(item => {
          const property = authMap[item.chanId + '']
          if (item.chanId && property && property.length) {
            const obj = {}
            for (let i = 0; i < property.length; i++) {
              obj[property[i]] = property[i]
            }
            // 给报警数据添加权限字段
            item.alarmPermission = allResIds.includes(item.chanId + '') ? Object.assign(obj, resProperties) : obj
          } else {
            item.alarmPermission = allResIds.includes(item.chanId + '') ? resProperties : ''
          }
        })
      } else {
        data.forEach(item => {
          item.alarmPermission = allResIds.includes(item.chanId + '') ? resProperties : ''
        })
      }
      return data
    }
  } catch (err) {
    handleSysException(err)
  }
}
exports.getAlarmCount = async ctx => {
  try {
    const AlarmLog = await getAlarmLogModel()
    const obj = ctx.request.body
    const [normalQuery, videoQuery, intelligentQuery, alarmHelpQuery, fireAlarmQuery, singleQuery, exceptionQuery] = [
      {},
      {},
      {},
      {},
      {},
      {},
      {}
    ]
    let [normalFlag, videoFlag, intelligentFlag, alarmHelpFlag, fireAlarmFlag, singleFlag, exceptionFlag] = [
      false,
      false,
      false,
      false,
      false,
      false,
      false
    ]
    const querys = [
      normalQuery,
      videoQuery,
      intelligentQuery,
      alarmHelpQuery,
      fireAlarmQuery,
      singleQuery,
      exceptionQuery
    ]
    // 普通报警
    if (obj.normal.flag) {
      const body = obj.normal
      normalQuery.$or = []
      if (body.alarmInput.flag && body.alarmZone.flag) {
        normalQuery.$or.push({ eventType: 'alarmInput', level: { $gte: body.alarmInput.level } })
        normalQuery.$or.push({ eventType: { $in: ['alarmZone', 'alarmGT'] }, level: { $gte: body.alarmZone.level } })
      } else if (body.alarmInput.flag && !body.alarmZone.flag) {
        normalQuery.$or.push({ eventType: 'alarmInput', level: { $gte: body.alarmInput.level } })
      } else if (!body.alarmInput.flag && body.alarmZone.flag) {
        normalQuery.$or.push({ eventType: { $in: ['alarmZone', 'alarmGT'] }, level: { $gte: body.alarmZone.level } })
      }
    } else {
      normalFlag = true
    }
    // 视频报警
    if (obj.video.flag) {
      const body = obj.video
      videoQuery.$or = []
      const monitorArr = [
        'alarmMoveSense',
        'videoMask',
        'sceneSwitch',
        'definitionAbnormal',
        'brightnessAbnormal',
        'noise',
        'colorCast',
        'signalLoss',
        'screenFreeze'
      ]
      const focusArr = ['focusAttention']
      if (body.monitor.flag && body.focus.flag) {
        videoQuery.$or.push({ eventType: { $in: monitorArr }, level: { $gte: body.monitor.level } })
        videoQuery.$or.push({ eventType: { $in: focusArr }, level: { $gte: body.focus.level } })
      } else if (body.monitor.flag && !body.focus.flag) {
        videoQuery.$or.push({ eventType: { $in: monitorArr }, level: { $gte: body.monitor.level } })
      } else if (!body.monitor.flag && body.focus.flag) {
        videoQuery.$or.push({ eventType: { $in: focusArr }, level: { $gte: body.focus.level } })
      }
    } else {
      videoFlag = true
    }
    // 智能报警
    if (obj.intelligent.flag) {
      const body = obj.intelligent
      intelligentQuery.$or = []
      const intelligentArr = [
        'perimeter',
        'tripwire',
        'missingObject',
        'leftObject',
        'loitering',
        'retrogradeDetection',
        'lingerDetection',
        'doubleCordon',
        'blackList',
        'whiteList',
        'dispatch',
        'areaInvade',
        'fastMove',
        'parkDetect',
        'humanAssemble',
        'objectMove'
      ]
      const violationArr = ['vioRetrograde', 'vioPark', 'vioTurnLeft', 'vioTurnRight']
      const faceArr = ['faceControl']
      if (body.intelligent.flag && body.violation.flag && body.face.flag) {
        intelligentQuery.$or.push({ eventType: { $in: intelligentArr }, level: { $gte: body.intelligent.level } })
        intelligentQuery.$or.push({ eventType: { $in: violationArr }, level: { $gte: body.violation.level } })
        intelligentQuery.$or.push({ eventType: { $in: faceArr }, level: { $gte: body.face.level } })
      } else if (body.intelligent.flag && body.violation.flag && !body.face.flag) {
        intelligentQuery.$or.push({ eventType: { $in: intelligentArr }, level: { $gte: body.intelligent.level } })
        intelligentQuery.$or.push({ eventType: { $in: violationArr }, level: { $gte: body.violation.level } })
      } else if (body.intelligent.flag && !body.violation.flag && body.face.flag) {
        intelligentQuery.$or.push({ eventType: { $in: intelligentArr }, level: { $gte: body.intelligent.level } })
        intelligentQuery.$or.push({ eventType: { $in: faceArr }, level: { $gte: body.face.level } })
      } else if (!body.intelligent.flag && body.violation.flag && body.face.flag) {
        intelligentQuery.$or.push({ eventType: { $in: violationArr }, level: { $gte: body.violation.level } })
        intelligentQuery.$or.push({ eventType: { $in: faceArr }, level: { $gte: body.face.level } })
      } else if (body.intelligent.flag && !body.violation.flag && !body.face.flag) {
        intelligentQuery.$or.push({ eventType: { $in: intelligentArr }, level: { $gte: body.intelligent.level } })
      } else if (!body.intelligent.flag && body.violation.flag && !body.face.flag) {
        intelligentQuery.$or.push({ eventType: { $in: violationArr }, level: { $gte: body.violation.level } })
      } else if (!body.intelligent.flag && !body.violation.flag && body.face.flag) {
        intelligentQuery.$or.push({ eventType: { $in: faceArr }, level: { $gte: body.face.level } })
      }
    } else {
      intelligentFlag = true
    }
    // 报警求助
    if (obj.alarmHelp.flag) {
      const alarmHelpArr = ['askHelp', 'acceptHelp', 'endHelp']
      alarmHelpQuery.$or = [{ eventType: { $in: alarmHelpArr }, level: { $gte: obj.alarmHelp.level } }]
    } else {
      alarmHelpFlag = true
    }
    // 消防报警
    if (obj.fireAlarm.flag) {
      const fireAlarmArr = ['fireAlarm', 'fireFailure']
      fireAlarmQuery.$or = [{ eventType: { $in: fireAlarmArr }, level: { $gte: obj.alarmHelp.level } }]
    } else {
      fireAlarmFlag = true
    }
    // 单兵报警
    if (obj.single.flag) {
      const body = obj.single
      singleQuery.$or = []
      if (body.single && body.patrol) {
        singleQuery.$or.push({ eventType: 'individualAlarm' })
        singleQuery.$or.push({ eventType: 'patrolAlarm' })
      } else if (body.single && !body.patrol) {
        singleQuery.$or.push({ eventType: 'individualAlarm' })
      } else if (!body.single && body.patrol) {
        singleQuery.$or.push({ eventType: 'patrolAlarm' })
      }
    } else {
      singleFlag = true
    }
    // 系统异常
    if (obj.exception.flag) {
      exceptionQuery.eventType = 'systemException'
    } else {
      exceptionFlag = true
    }
    // 数量统计显示的始终是未处理的报警
    querys.map((item, index) => {
      if (index !== 3) {
        item = _.assign(item, { dealState: 'unProcess' })
      }
    })
    const promiseList = []
    promiseList.push(AlarmLog.countDocuments(normalQuery))
    promiseList.push(AlarmLog.countDocuments(videoQuery))
    promiseList.push(AlarmLog.countDocuments(intelligentQuery))
    promiseList.push(AlarmLog.countDocuments(fireAlarmQuery))
    promiseList.push(AlarmLog.countDocuments(singleQuery))
    promiseList.push(AlarmLog.countDocuments(exceptionQuery))
    const [normalCount, videoCount, intelligentCount, fireAlarmCount, singleCount, exceptionCount] = await Promise.all(
      promiseList
    )
    // 如果不查询报警求助类型的报警，不执行if里面的语句，否则数据量大查询速度很慢
    let alarmHelpCount = 0
    if (!alarmHelpFlag) {
      const alarmHelpData = await AlarmLog.find(alarmHelpQuery)
        .lean()
        .exec()
      const newData = distinctAlarmHelperDataByUUID(alarmHelpData)
      alarmHelpCount = _.filter(newData, { dealState: 'unProcess' }).length
    }
    ctx.body = {
      normalCount: normalFlag ? 0 : normalCount,
      videoCount: videoFlag ? 0 : videoCount,
      intelligentCount: intelligentFlag ? 0 : intelligentCount,
      alarmHelpCount: alarmHelpFlag ? 0 : alarmHelpCount,
      fireAlarmCount: fireAlarmFlag ? 0 : fireAlarmCount,
      singleCount: singleFlag ? 0 : singleCount,
      exceptionCount: exceptionFlag ? 0 : exceptionCount
    }
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 地图中获取六中报警前50条记录，是已经加到地图点位中的
 */
exports.getAllAlarms = async ctx => {
  try {
    const AlarmLog = await getAlarmLogModel()
    // 普通报警
    const normalType = ['alarmInput', 'alarmZone', 'alarmGT']
    // 视频报警
    const videoType = [
      'alarmMoveSense',
      'videoMask',
      'sceneSwitch',
      'definitionAbnormal',
      'brightnessAbnormal',
      'noise',
      'colorCast',
      'signalLoss',
      'screenFreeze',
      'focusAttention'
    ]
    // 智能报警
    const intelligentType = [
      'perimeter',
      'tripwire',
      'missingObject',
      'leftObject',
      'loitering',
      'retrogradeDetection',
      'lingerDetection',
      'doubleCordon',
      'blackList',
      'whiteList',
      'dispatch',
      'areaInvade',
      'fastMove',
      'parkDetect',
      'humanAssemble',
      'objectMove',
      'vioRetrograde',
      'vioPark',
      'vioTurnLeft',
      'vioTurnRight',
      'faceControl'
    ]
    // 报警求助报警
    const alarmHelpType = ['askHelp', 'acceptHelp', 'endHelp']
    // 消防报警
    const fireAlarmType = ['fireAlarm', 'fireFailure']
    // 单兵报警
    const singleType = ['individualAlarm', 'patrolAlarm']
    let alarmHelpResIds
    let resIds
    if (ctx.query.map === '2D') {
      // 针对报警求助的报警,需要特殊处理
      ;[alarmHelpResIds, resIds] = await Promise.all([
        Resource.distinct('_id', {
          point: { $exists: true },
          $or: [{ name: { $regex: '报警箱_' } }, { name: { $regex: '报警柱_' } }]
        }),
        Resource.distinct('_id', { point: { $exists: true } })
      ])
    } else if (ctx.query.map === '3D') {
      ;[alarmHelpResIds, resIds] = await Promise.all([
        Resource.distinct('_id', {
          point3D: { $exists: true },
          $or: [{ name: { $regex: '报警箱_' } }, { name: { $regex: '报警柱_' } }]
        }),
        Resource.distinct('_id', { point3D: { $exists: true } })
      ])
    }
    const [normalQuery, videoQuery, intelligentQuery, alarmHelpQuery, fireAlarmQuery, singleQuery] = [
      { chanId: { $in: resIds }, eventType: { $in: normalType }, dealState: 'unProcess' },
      { chanId: { $in: resIds }, eventType: { $in: videoType }, dealState: 'unProcess' },
      { chanId: { $in: resIds }, eventType: { $in: intelligentType }, dealState: 'unProcess' },
      { chanId: { $in: alarmHelpResIds }, eventType: { $in: alarmHelpType }, dealState: 'unProcess' },
      { chanId: { $in: resIds }, eventType: { $in: fireAlarmType }, dealState: 'unProcess' },
      { eventType: { $in: singleType }, dealState: 'unProcess', uniqueId: { $nin: [''] } }
    ]
    const [normalAlarm, videoAlarm, intelligentAlarm, alarmHelp, fireAlarm, singleAlarmList] = await Promise.all([
      AlarmLog.find(normalQuery)
        .sort({ _id: -1 })
        .limit(50)
        .lean()
        .exec(),
      AlarmLog.find(videoQuery)
        .sort({ _id: -1 })
        .limit(50)
        .lean()
        .exec(),
      AlarmLog.find(intelligentQuery)
        .sort({ _id: -1 })
        .limit(50)
        .lean()
        .exec(),
      AlarmLog.find(alarmHelpQuery)
        .limit(50)
        .sort({ _id: -1 })
        .lean()
        .exec(),
      AlarmLog.find(fireAlarmQuery)
        .limit(50)
        .sort({ _id: -1 })
        .lean()
        .exec(),
      AlarmLog.find(singleQuery)
        .limit(50)
        .sort({ _id: -1 })
        .lean()
        .exec()
    ])
    // 添加权限字段
    const roleId = ctx.query.roleId
    const [normalAlarmList, videoAlarmList, intelligentAlarmList, alarmHelpList, fireAlarmList] = await Promise.all([
      addAuth(normalAlarm, roleId),
      addAuth(videoAlarm, roleId),
      addAuth(intelligentAlarm, roleId),
      addAuth(alarmHelp, roleId),
      addAuth(fireAlarm, roleId)
    ])
    const data = {
      normalAlarmList,
      videoAlarmList,
      intelligentAlarmList,
      alarmHelpList,
      fireAlarmList,
      singleAlarmList
    }
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
// 根据通道id获取电视墙配置，报警处理页面用
exports.getWallConfig = async ctx => {
  try {
    const alarmConfig = await AlarmCfg.findOne({ resource: ctx.query.chanId }, 'actionWall').lean()
    const data = alarmConfig ? alarmConfig.actionWall : ''
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
const distinctAlarmHelperDataByUUID = datas => {
  const helperDatas = []
  const convertData = JSON.parse(JSON.stringify(datas))
  const groupDatas = _.groupBy(convertData, 'uuid')
  let alarmData = []
  Object.keys(groupDatas).forEach(key => {
    const value = groupDatas[key]
    if (key !== 'undefined') {
      if (Array.isArray(value)) {
        if (value.length === 3) {
          const askHelpData = _.find(value, { eventType: 'askHelp' })
          const acceptHelpData = _.find(value, { eventType: 'acceptHelp' })
          const endHelpData = _.find(value, { eventType: 'endHelp' })
          if (askHelpData.ackContent) {
            helperDatas.push(Object.assign(endHelpData, { ackContent: askHelpData.ackContent, time: askHelpData.time }))
          } else if (acceptHelpData.ackContent) {
            helperDatas.push(
              Object.assign(endHelpData, { ackContent: acceptHelpData.ackContent, time: askHelpData.time })
            )
          } else {
            helperDatas.push(Object.assign(endHelpData, { time: askHelpData.time }))
          }
        } else if (value.length === 2) {
          const askObj = _.find(value, { eventType: 'askHelp' })
          const endObj = _.find(value, { eventType: 'endHelp' })
          const obj = askObj ? Object.assign(endObj, { time: askObj.time }) : endObj
          helperDatas.push(obj)
        } else {
          helperDatas.push(value[0])
        }
      }
    } else {
      const askHelpData = _.remove(value, { eventType: 'askHelp' })
      const acceptHelpData = _.remove(value, { eventType: 'acceptHelp' })
      if (askHelpData.length && !acceptHelpData.length) {
        helperDatas.push(askHelpData[0])
      } else if (askHelpData.length && acceptHelpData.length) {
        const obj = {
          time: askHelpData[0].time,
          acceptTime: acceptHelpData[0].time
        }
        helperDatas.push(Object.assign(acceptHelpData[0], obj))
      }
      alarmData = value
    }
  })
  return _.sortBy(helperDatas.concat(alarmData), 'time').reverse()
}

const listQuery = async (schema, search, selection, sort, pageObj = { limit: 10, page: 1 }, population, ctx) => {
  for (var key in search) {
    if (search[key] === undefined || search[key] === '' || search[key] === null) {
      delete search[key]
    }
  }
  const timeObj = search['$and'][1]
  const startTime = +timeObj['time']['$gte']
  const endTime = +timeObj['time']['$lte']
  const [alarmHelpData, results] = await Promise.all([
    schema.aggregate([
      {
        $match: {
          time: { $gte: startTime, $lte: endTime },
          eventType: { $in: ['askHelp', 'acceptHelp', 'endHelp'] },
          define: true
        }
      },
      {
        $group: {
          _id: '$uuid'
        }
      }
    ]),
    schema
      .find(search, selection)
      .populate(population)
      .sort(sort)
      .skip((+pageObj.page - 1) * +pageObj.limit)
      .limit(+pageObj.limit)
      .exec()
  ])
  const noUuidCount = await schema.countDocuments(Object.assign(search, { uuid: { $exists: false } }))
  const filterData = _.filter(alarmHelpData, o => {
    return !!o._id
  })
  const finalCount = noUuidCount ? 1 : 0
  const count = filterData.length + finalCount

  ctx.set({
    'X-BSC-COUNT': count,
    'X-BSC-PAGES': Math.ceil(count / pageObj.limit),
    'X-BSC-CUR': parseInt(pageObj.page),
    'X-BSC-LIMIT': parseInt(pageObj.limit)
  })
  return {
    results: _.isEmpty(results) ? [] : results
  }
}
