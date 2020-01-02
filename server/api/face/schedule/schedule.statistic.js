/**
 * 人脸信息定时统计
 * @create: 2017-6-24
 * @author: hansen
 * @update: 2017-7-11
 * description: 根据识别基础数据按小时、资源小时、天、资源天统计汇总数据信息
 */
const schedule = require('../../../common/schedule')
const moment = require('moment')
const mongoose = require('mongoose')
const Face = mongoose.model('Face')
const Org = mongoose.model('Org')
const OrgRes = mongoose.model('OrgRes')
const People = mongoose.model('People')
const CONSTANTS = require('../face.constants').FACE
const FaceStatistic = mongoose.model('FaceStatistic')
const _ = require('lodash')

// 人脸识别信息 按照小时统计(0:00 1:00 2:00 3:00 ...)
schedule.addSchedule({
  rule: '0 * * * *',
  operation: async () => {
    try {
      const upper = Number(moment(moment().format('YYYYMMDD HH')).format('X'))
      const lower = Number(moment(moment().subtract(1, 'h').format('YYYYMMDD HH')).format('X'))
      // 员工、访客、vip、黑名单、白名单、布控、陌生人
      const types = CONSTANTS.PEOPLE.TYPES
      const date = moment()
      const label = _.padStart(date.toObject().hours, 2, '0')
      let regTotal = 0
      for (const item of types) {
        let result = 0
        if (_.isEqual(item, CONSTANTS.PEOPLE.STRANGER)) {
          // 抓拍系统的陌生人用户识别对比总数的计算
          result = await Face.countDocuments({ $and: [{ snapshotTime: { $gte: lower } }, { snapshotTime: { $lt: upper } }], type: item, sys: CONSTANTS.SYS.CAPUTRUE })
          regTotal += result
          result = await Face.countDocuments({ $and: [{ snapshotTime: { $gte: lower } }, { snapshotTime: { $lt: upper } }], type: item, sys: CONSTANTS.SYS.PASS })
        } else {
          result = await Face.countDocuments({ $and: [{ snapshotTime: { $gte: lower } }, { snapshotTime: { $lt: upper } }], type: item })
        }
        if (_.includes(CONSTANTS.PEOPLE.UNUSUAL, item)) {
          regTotal += result
        }
        await FaceStatistic.update({
          type: item,
          granularity: CONSTANTS.GRANULARITY.HOUR,
          summary: CONSTANTS.SUMMARY.MUTILPART,
          date: Number(moment(date.format('YYYYMMDD')).format('X')),
          hour: date.toObject().hours,
          label: label
        }, { statistic: result }, { upsert: true })
      }
      // 对比识别总数 7
      await FaceStatistic.update({
        type: CONSTANTS.PEOPLE.COMPARSION,
        granularity: CONSTANTS.GRANULARITY.HOUR,
        summary: CONSTANTS.SUMMARY.MUTILPART,
        date: Number(moment(date.format('YYYYMMDD')).format('X')),
        hour: date.toObject().hours,
        label: label
      }, { statistic: regTotal }, { upsert: true })
    } catch (error) {
      console.log('location: schedule.statistic.js->人脸识别信息 按照小时统计')
      console.log(error)
    }
  }
})

// 人脸识别信息 资源按小时统计(0:00 1:00 2:00 3:00 ...)
schedule.addSchedule({
  rule: '0 * * * *',
  operation: async () => {
    try {
      const upper = moment(moment().format('YYYYMMDD HH')).format('X')
      const lower = moment(moment().subtract(1, 'h').format('YYYYMMDD HH')).format('X')
      const types = CONSTANTS.PEOPLE.TYPES
      const date = moment()
      const label = _.padStart(date.toObject().hours, 2, '0')
      const resources = []
      const unusual = [...CONSTANTS.PEOPLE.UNUSUAL, CONSTANTS.PEOPLE.STRANGER]
      // 获取人脸组织所有节点
      const orgs = await Org.find({ type: CONSTANTS.ORG.FACE }, '_id')
      const orgIds = orgs.map(item => item._id)
      // 获取人脸组织下的所有资源
      const orgRes = await OrgRes.find({ org: { $in: orgIds } }).populate('resource')
      if (!_.isEmpty(orgRes)) {
        resources.push(...orgRes)
      }
      // 统计人脸所有资源1小时内 根据分析类型汇总
      for (const res of resources) {
        let [faceOne, regTotal] = [null, 0]
        // 如果当前资源不存在，则停止计算
        if (_.isNull(res.resource)) {
          continue
        } else {
          // 获取单个资源相关信息 方便后面统计(资源只能属于一种系统。通过这点可以确认统计资源的系统类型)
          faceOne = await Face.findOne({ $and: [{ snapshotTime: { $gte: lower } }, { snapshotTime: { $lt: upper } }], resource: res.resource._id })
          if (_.isNull(faceOne)) { continue }
        }
        for (const item of types) {
          //  抓拍摄像机只统计黑白布控陌生人 通行摄像机只统计员工访客vip陌生人（过滤无用的数据）
          if ((faceOne.sys === CONSTANTS.SYS.PASS && !CONSTANTS.PEOPLE.NORMALSTATIC.includes(item)) || (faceOne.sys === CONSTANTS.SYS.CAPUTRUE && !unusual.includes(item))) {
            continue
          }
          let result = 0
          if (_.isEqual(item, CONSTANTS.PEOPLE.STRANGER)) {
            // 抓拍系统的陌生人用于识别对比总数的计算
            if (_.isEqual(faceOne.sys, CONSTANTS.SYS.CAPUTRUE)) {
              result = await Face.countDocuments({ type: item, $and: [{ snapshotTime: { $gte: lower } }, { snapshotTime: { $lt: upper } }], resource: res.resource._id, sys: faceOne.sys })
              regTotal += result
              continue
            } else {
              result = await Face.countDocuments({ type: item, $and: [{ snapshotTime: { $gte: lower } }, { snapshotTime: { $lt: upper } }], resource: res.resource._id })
            }
          } else {
            result = await Face.countDocuments({ type: item, $and: [{ snapshotTime: { $gte: lower } }, { snapshotTime: { $lt: upper } }], resource: res.resource._id })
          }
          if (CONSTANTS.PEOPLE.UNUSUAL.includes(item)) {
            regTotal += result
          }
          await FaceStatistic.update({
            type: item,
            granularity: CONSTANTS.GRANULARITY.HOUR,
            summary: CONSTANTS.SUMMARY.SINGLE,
            org: res.org,
            resourceName: faceOne.resourcePoint ? faceOne.resourcePoint : '',
            resource: res.resource._id,
            date: Number(moment(date.format('YYYYMMDD')).format('X')),
            hour: date.toObject().hours,
            label: label
          }, { statistic: result }, { upsert: true })
        }
        // 对比识别总数 7
        if (regTotal > 0) {
          await FaceStatistic.update({
            type: CONSTANTS.PEOPLE.COMPARSION,
            granularity: CONSTANTS.GRANULARITY.HOUR,
            summary: CONSTANTS.SUMMARY.SINGLE,
            org: res.org,
            resourceName: faceOne.resourcePoint ? faceOne.resourcePoint : '',
            resource: res.resource._id,
            date: Number(moment(date.format('YYYYMMDD')).format('X')),
            hour: date.toObject().hours,
            label: label
          }, { statistic: regTotal }, { upsert: true })
        }
      }
    } catch (error) {
      console.log('location: schedule.statistic.js->人脸识别信息 资源按小时统计')
      console.log(error)
    }
  }
})

// 人脸识别信息 按照天统计(每天的0:3分进行数据汇总)
schedule.addSchedule({
  rule: '3 0 * * *',
  operation: async () => {
    try {
      const date = moment(moment().subtract(1, 'd').format('YYYYMMDD')).format('X')
      const aggregate = await FaceStatistic.aggregate([
        { $match: { 'date': Number(date), granularity: CONSTANTS.GRANULARITY.HOUR, summary: CONSTANTS.SUMMARY.MUTILPART } },
        { $group: { _id: '$type', total: { $sum: '$statistic' } } }
      ])
      for (const item of aggregate) {
        await FaceStatistic.create({
          type: item._id,
          granularity: CONSTANTS.GRANULARITY.DAY,
          summary: CONSTANTS.SUMMARY.MUTILPART,
          statistic: item.total,
          date: Number(date),
          label: moment.unix(Number(date)).format('YYYY-MM-DD')
        })
      }
    } catch (error) {
      console.log('location: schedule.statistic.js->人脸识别信息 按照天统计')
      console.log(error)
    }
  }
})
// 人脸识别信息 资源按天统计(每天的0:4分进行数据汇总)
schedule.addSchedule({
  rule: '4 0 * * *',
  operation: async () => {
    try {
      const date = Number(moment().format('X'))
      const result = await People.find({ status: { $in: [0, 1] } })
      if (!_.isEmpty(result)) {
        result.map(item => {
          if (Number(item.startTime) <= date && date < Number(item.endTime) && item.status === 0) {
            item.update({ status: 1 }).exec()
          } else if (date >= Number(item.endTime)) {
            item.update({ status: 2 }).exec()
          }
        })
      }
    } catch (error) {
      console.log('location: schedule.statistic.js->布控人员状态监测')
      console.log(error)
    }
  }
})
// 人脸识别信息 资源按天统计(每天的0:5分进行数据汇总)
schedule.addSchedule({
  rule: '5 0 * * *',
  operation: async () => {
    try {
      const date = moment(moment().subtract(1, 'd').format('YYYYMMDD')).format('X')
      const aggregate = await FaceStatistic.aggregate([
        { $match: { 'date': Number(date), granularity: CONSTANTS.GRANULARITY.HOUR, summary: CONSTANTS.SUMMARY.SINGLE } },
        { $group: { _id: { type: '$type', resource: '$resource', resourceName: '$resourceName' }, total: { $sum: '$statistic' } } }
      ])
      for (const item of aggregate) {
        await FaceStatistic.create({
          type: item._id.type,
          resource: item._id.resource,
          resourceName: item._id.resourceName,
          granularity: CONSTANTS.GRANULARITY.DAY,
          summary: CONSTANTS.SUMMARY.SINGLE,
          statistic: item.total,
          date: Number(date),
          label: moment.unix(Number(date)).format('YYYY-MM-DD')
        })
      }
    } catch (error) {
      console.log('location: schedule.statistic.js->人脸识别信息 资源按天统计')
      console.log(error)
    }
  }
})
