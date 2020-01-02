/*
 * @Author: litao
 * @Date: 2019-08-07 11:55:13
 * @Last Modified time: 2019-07-05 13:17:29
 * 该模块主要提供车流量统计数据分析接口
 * -----------------------------README-----------------------------
 * analysis()    车流量数据统计
 * total()       违章超速统计
 * arrayToObj()  将数组转换为对象(私有方法)
 */

'use strict'
const moment = require('moment')   
const _ = require('lodash')
const Excel = require('exceljs')

const PassVehicle = mongoose.model('passvehicle')
const ThirdPartyOrg = mongoose.model('ThirdPartyOrg')
const TrafficLane = mongoose.model('TrafficLane')

const { handleSysException, getChildrenByKey } = require('../../../../../common/tools')

const DAY = 24 * 60 * 60

const passVehicleColums = [
  { header: '日期', key: 'date', width: 20, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } },
  { header: '车流量', key: 'count', width: 20, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } },
  { header: '违停', key: 'stop', width: 20, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } },
  { header: '超速', key: 'speed', width: 20, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } }
]

const analysis = async ctx => {
  try {
    const data = await analysisData(ctx)
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

const total = async ctx => {
  try {
    const data = await totalData(ctx)
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

const download = async ctx => {
  try {
    const [totals, details] = await Promise.all([analysisData(ctx), totalData(ctx)])
    const workbook = new Excel.Workbook()
    const totalSheet = workbook.addWorksheet('车流量统计')
    // 设置列头
    totalSheet.columns = passVehicleColums

    Object.keys(totals).forEach(key => {
      const obj = details[key]
      totalSheet.addRow({ date: key, count: totals[key], stop: obj.stop, speed: obj.speed })
    })

    const buffer = await workbook.xlsx.writeBuffer()
    const fileName = `${moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`
    ctx.type = 'application/vnd-openxmlformats'
    ctx.attachment(fileName)
    ctx.body = buffer
  } catch (error) {
    handleSysException(error)
  }
}

module.exports = {
  analysis,
  total,
  download
}
/**
 * 获取机构下所有设备的id
 * @param {*} orgId 结构id
 */
const getOrgChildrenDeviceIds = async orgId => {
  let ids = []
  const orgDoc = await ThirdPartyOrg.findById(orgId).lean()
  const orgs = await ThirdPartyOrg.find({ type: orgDoc.type }).lean()
  getChildrenByKey(ids, orgs, orgDoc.id, 'id', 'pid')
  ids.push(orgDoc.id)
  const devChnIds = await TrafficLane.distinct('devChnId', { deptId: { $in: ids } })
  return devChnIds
}

const totalData = async ctx => {
  try {
    const { orgId, start, end, hkDeviceIndexCode } = ctx.query

    const tempStart = moment(start).valueOf() / 1000
    const tempEnd = moment(end).valueOf() / 1000

    const query = {}
    if (orgId) {
      query.cameraIndexCode = await getOrgChildrenDeviceIds(orgId)
    }
    if (hkDeviceIndexCode) {
      query.cameraIndexCode = hkDeviceIndexCode
    }
    const [aggregateSpeed, aggregateStop] = [[], []]
    const visualization = []
    for (let i = tempStart; i <= tempEnd; i += DAY) {
      // 统计超速
      aggregateSpeed.push(
        PassVehicle.countDocuments({
          ...query,
          time: { $gte: i, $lt: i + DAY },
          eventType: '1114625'
        })
      )
      // 统计违停
      aggregateStop.push(
        PassVehicle.countDocuments({
          ...query,
          time: { $gte: i, $lt: i + DAY },
          eventType: '1114642'
        })
      )
      visualization.push(moment(i * 1000).format('YYYY-MM-DD'))
    }
    // const tempArray = await PassVehicle.aggregate().facet(condition)

    let statiscSpeed = await Promise.all(aggregateSpeed)
    let statiscStop = await Promise.all(aggregateStop)
    const data = {}
    visualization.forEach((item, index) => {
      data[item] = {
        speed: statiscSpeed[index],
        stop: statiscStop[index]
      }
    })
    return data
  } catch (error) {
    return {}
  }
}

const analysisData = async ctx => {
  try {
    const { orgId, start, end, hkDeviceIndexCode } = ctx.query

    const tempStart = moment(start).valueOf() / 1000
    const tempEnd = moment(end).valueOf() / 1000

    const query = {}
    if (orgId) {
      query.cameraIndexCode = await getOrgChildrenDeviceIds(orgId)
    }
    if (hkDeviceIndexCode) {
      query.cameraIndexCode = hkDeviceIndexCode
    }
    const aggregate = []
    const visualization = []

    for (let i = tempStart; i <= tempEnd; i += DAY) {
      const inquery = {
        ...query,
        time: { $gte: i, $lt: i + DAY }
      }
      aggregate.push(PassVehicle.countDocuments(inquery))
      visualization.push(moment(i * 1000).format('YYYY-MM-DD'))
    }

    let statisc = await Promise.all(aggregate)
    const data = {}
    visualization.forEach((item, index) => {
      data[item] = statisc[index]
    })
    return data
  } catch (error) {
    handleSysException(error)
  }
}
