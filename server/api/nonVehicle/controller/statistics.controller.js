/*
 * @Author: litao
 * @Date: 2019-06-27 11:55:13
 * @Last Modified time: 2019-07-05 13:17:29
 * 该模块主要提供对非机动车的统计分析功能
 * -----------------------------README-----------------------------
 * total()       非机动车信息统计
 * analysis()    根据条件统计非机动车信息
 * arrayToObj()  将数组转换为对象(私有方法)
 * convertObj()  对聚合结果进行转换使前端可直接使用(私有方法)
 */

'use strict'
const moment = require('moment')
const _ = require('lodash')

const UserNonVehicles = mongoose.model('userNonVehicles')
const UserNonVehicleLog = mongoose.model('userNonVehicleLog')

const { handleSysException } = require('../../../common/tools')

const total = async ctx => {
  try {
    const start = moment(moment().format('YYYY/MM/DD'), 'YYYY/MM/DD').valueOf() / 1000
    const end = start + 24 * 60 * 60 - 1

    const basicGroup = {
      _id: '$identityType',
      count: { $sum: 1 }
    }

    const [total, groups] = await Promise.all([
      UserNonVehicles.count(),
      UserNonVehicles.aggregate().facet({
        groupTotal: [
          {
            $group: basicGroup
          }
        ],
        todayTotal: [
          {
            $match: {
              createTime: { $gte: Number(start), $lte: Number(end) }
            }
          },
          {
            $group: basicGroup
          }
        ]
      })
    ])

    const { groupTotal, todayTotal } = groups[0]
    const data = {
      total,
      groupTotal: arrayToObj(groupTotal),
      todayTotal: arrayToObj(todayTotal)
    }

    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

const analysis = async ctx => {
  try {
    const lable = []
    const { orgId, deviceId, start, end } = ctx.query
    const baseTime = moment(moment().format('YYYY/MM/DD'), 'YYYY/MM/DD').valueOf() / 1000
    let j = parseInt(start)
    let k = parseInt(end)

    const opt = {}
    orgId && (opt['orgId'] = orgId)
    deviceId && (opt['deviceId'] = deviceId)

    const condition = {}
    // 创建聚合查询对象
    for (let i = j; i <= k; i++) {
      const startTime = baseTime + i * 60 * 60
      lable.push(`${(j < 10) ? `0${j}` : j}:00`)

      j++
      const endTime = baseTime + j * 60 * 60

      const array = [
        {
          $match: {
            ...opt,
            searchTime: { $gte: Number(startTime), $lte: Number(endTime) }
          }
        },
        {
          $group: {
            _id: '$identityType',
            count: { $sum: 1 }
          }
        }
      ]
      condition[j] = array
    }

    const [total, data] = await Promise.all([
      UserNonVehicleLog.count(),
      await UserNonVehicleLog.aggregate().facet(condition)
    ])

    const serise = convertObj(data[0])

    ctx.body = {
      total,
      data: {
        lable,
        serise
      }
    }
  } catch (error) {
    handleSysException(error)
  }
}

module.exports = {
  total,
  analysis
}

const convertObj = (obj) => {
  const teacherTempData = []
  const studentTempData = []
  const outTeacherTempData = []
  const familyTempData = []
  const otherTempData = []

  Object.keys(obj).map(item => {
    const array = obj[item]

    const teacher = _.find(array, { _id: 0 })
    const student = _.find(array, { _id: 1 })
    const outTeacher = _.find(array, { _id: 2 })
    const family = _.find(array, { _id: 3 })
    const other = _.find(array, { _id: 4 })

    teacherTempData.push((teacher && teacher.count) || 0)
    studentTempData.push((student && student.count) || 0)
    outTeacherTempData.push((outTeacher && outTeacher.count) || 0)
    familyTempData.push((family && family.count) || 0)
    otherTempData.push((other && other.count) || 0)
  })

  const array = [
    { name: 'teacher', data: teacherTempData },
    { name: 'student', data: studentTempData },
    { name: 'outTeacher', data: outTeacherTempData },
    { name: 'family', data: familyTempData },
    { name: 'other', data: otherTempData }
  ]

  return array
}

const arrayToObj = (array) => {
  const obj = {}
  for (let { _id, count } of array) {
    obj[_id] = count
  }
  return obj
}