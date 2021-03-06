/*
 * @Description: 人员通行数据统计模块
 * @Author: wanglei
 * @Date: 2019-08-20 11:36:34
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-22 17:11:27
 */
'use strict'

const mongoose = require('mongoose')
const PeoplePassage = mongoose.model('peoplePassage')
const EquipmentDoor = mongoose.model('equipmentDoor')
const senseTimeFace = mongoose.model('senseTimeFace')
const Org = mongoose.model('Org')
const Students = mongoose.model('students')
const moment = require('moment')
const { handleSysException, getChildren, transData2Tree } = require('../../../common/tools')

exports.statisticToday = async ctx => {
  try {
    const startTodayTime = moment()
      .startOf('day')
      .valueOf()
    const currentTime = Date.now()
    const [passageTotal, alarmTotal, studentsTotal, authCardTotal, authFaceTotal, alarmData] = await Promise.all([
      PeoplePassage.countDocuments({ createdTimeMs: { $gte: startTodayTime, $lte: currentTime } }),
      PeoplePassage.countDocuments({
        createdTimeMs: {
          $gte: startTodayTime,
          $lte: currentTime
        },
        type: {
          $in: [0, 1]
        }
      }),
      Students.countDocuments(),
      Students.countDocuments({
        guard: {
          $in: [2, 4]
        }
      }),
      Students.countDocuments({
        guard: {
          $in: [3, 4]
        }
      }),
      PeoplePassage.aggregate([
        {
          $match: {
            createdTimeMs: {
              $gte: startTodayTime,
              $lte: currentTime
            },
            type: {
              $in: [0, 1]
            }
          }
        },
        { $group: { _id: { $hour: { $add: ['$eventTime', 1000 * 60 * 60 * 8] } }, total: { $sum: 1 } } },
        { $project: { hour: '$_id', total: 1, _id: 0 } }
      ])
    ])
    ctx.body = {
      passageTotal, // 通行数量
      alarmTotal, // 报警数量
      studentsTotal, // 人员总数
      authCardTotal, // 已授权卡号
      authFaceTotal, // 已授权人脸
      alarmData // 报警数据
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 获取层级机构的人员进入和出去数量
exports.getPassData = async ctx => {
  try {
    const orgArr = ctx.request.body
    const startTodayTime = moment()
      .startOf('day')
      .valueOf()
    const currentTime = Date.now()
    const conditions = { createdTimeMs: { $gte: startTodayTime, $lte: currentTime } }
    let result = []
    for (let item of orgArr) {
      // 第一个元素是父机构id，剩下的元素是该父机构的子机构id
      const parentOrg = await Org.findById(item[0], '_id name').lean().exec()
      const doors = await EquipmentDoor.find({ org: { $in: item } }, '_id').lean().exec()
      const face = await senseTimeFace.find({
        org: {
          $in: item
        }
      }, '_id').lean().exec()
      doors.map(item => item._id)
      face.map(item => item._id)
      // const [entryPass, outPass] = await Promise.all([
      //   PeoplePassage.countDocuments(Object.assign({ address: { $in: doors }, readerState: 0 }, conditions)),
      //   PeoplePassage.countDocuments(Object.assign({ address: { $in: doors }, readerState: 1 }, conditions))
      // ])
      const [doorEntryPass, doorOutPass] = await Promise.all([
        PeoplePassage.countDocuments(Object.assign({ address: { $in: doors }, readerState: 0 }, conditions)),
        PeoplePassage.countDocuments(Object.assign({ address: { $in: doors }, readerState: 1 }, conditions))
      ])
      const [faceEntryPass, faceOutPass] = await Promise.all([
        PeoplePassage.countDocuments(Object.assign({
          faceAddress: {
            $in: face
          },
          readerState: 0
        }, conditions)),
        PeoplePassage.countDocuments(Object.assign({
          faceAddress: {
            $in: face
          },
          readerState: 1
        }, conditions))
      ])
      // result.push({ orgName: parentOrg.name, entryPass: entryPass, outPass: outPass })
      result.push({
        orgName: parentOrg.name,
        entryPass: doorEntryPass + faceEntryPass,
        outPass: doorOutPass + faceOutPass
      })
    }
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

exports.statisticAnalyz = async ctx => {
  try {
    // const result = await analysisData(ctx)
    // ctx.body = result
    const { startTime, endTime } = ctx.request.body
    let findData = {
      createdTimeMs: {
          $gte: Number(startTime),
          $lte: Number(endTime)
      }
    }
    if (ctx.request.body.address.type === 'door') { // 如果是门
      findData.address = {
        $in: ctx.request.body.address.arr
      }
    } else { // 如果是人脸识别机
      findData.faceAddress = {
        $in: ctx.request.body.address.arr
      }
    }
    let data = await PeoplePassage.find(findData).sort({ '_id': -1}).lean(true)
    ctx.body = {
      code: 200,
      data: data
    }
  } catch (error) {
    console.log('err', error)
    handleSysException(error)
  }
}

const analysisData = async ctx => {
  const { startTime, endTime, address = [] } = ctx.query
  let conditions = { createdTimeMs: { $gte: Number(startTime), $lte: Number(endTime) }, date: { $exists: true } }
  if (address.length) {
    conditions.address = { $in: address }
  }
  const [passData, alarmData] = await Promise.all([
    PeoplePassage.aggregate([
      { $match: conditions },
      { $project: { address: 1, readerState: 1, eventTime: 1, date: 1 } },
      {
        $group: {
          _id: {
            date: '$date',
            readerState: '$readerState'
          },
          total: { $sum: 1 }
        }
      },
      { $project: { total: 1, date: '$_id.date', readerState: '$_id.readerState', _id: 0 } },
      { $sort: { date: -1 } }
    ]),
    PeoplePassage.aggregate([
      { $match: Object.assign({ type: 0 }, conditions) },
      { $group: { _id: { date: '$date' }, total: { $sum: 1 } } },
      { $project: { date: '$_id.date', total: 1, _id: 0 } },
      { $sort: { date: -1 } }
    ])
  ])
  return {
    passData,
    alarmData
  }
}

exports.getTreeDepth = async ctx => {
  try {
    let allChildrenIds = []
    const [allOrg, rootOrg] = await Promise.all([
      Org.find({ type: 11 }, '_id name pid order')
        .lean()
        .exec(),
      Org.findOne({ type: 11, isroot: true })
        .lean()
        .exec()
    ])
    allChildrenIds = getChildren(allChildrenIds, allOrg, rootOrg._id + '')
    allChildrenIds.push(rootOrg._id + '')
    const orgres = await Org.find({ _id: { $in: allChildrenIds } }, '_id pid name order')
      .lean()
      .exec()
    const treeData = transData2Tree(orgres, '_id', 'pid', true)
    const result = getSameClassValue(treeData)
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

const getSameClassValue = treeData => {
  let obj = {}
  dealTreeDepth(treeData, obj, 1)
  return obj
}

// 递归处理机构树，将相同层级的机构放在一起
const dealTreeDepth = (treeData, obj, depth) => {
  treeData.map(item => {
    if (!obj[depth + 'a']) {
      obj[depth + 'a'] = []
    }
    obj[depth + 'a'].push(item)
    if (item.children && item.children.length > 0) {
      dealTreeDepth(item.children, obj, depth + 1)
    }
  })
}
