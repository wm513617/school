/*
 * @Author: litao
 * @Date: 2019-08-07 11:55:13
 * @Last Modified time: 2019-07-05 13:17:29
 * 该模块主要提供人车同检查数据分析接口
 * -----------------------------README-----------------------------
 * analysis()    人车同检数据统计
 * analysisTop()  人车同检Top5
 */

'use strict'
const moment = require('moment')
const _ = require('lodash')
const Excel = require('exceljs')

const PeopleVehicle = mongoose.model('peoplevehicle')

const { handleSysException } = require('../../../../../common/tools')

const peopleVehicleColums = [
  { header: '日期', key: 'date', width: 30, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } },
  { header: '核验总量', key: 'total', width: 30, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } },
  { header: '核验成功', key: 'success', width: 30, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } },
  { header: '核验失败', key: 'failed', width: 30, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } },
  { header: '提取失败', key: 'pTotal', width: 30, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } }
]

const peopleVehicleTopColums = [
  { header: '车牌号', key: 'plateNo', width: 30, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } },
  { header: '核验失败', key: 'failed', width: 30, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } },
  { header: '核验成功', key: 'success', width: 30, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } },
  { header: '提取失败', key: 'pTotal', width: 30, style: { font: { size: 13 }, alignment: { horizontal: 'center' } } }
]

const analysis = async ctx => {
  try {
    const data = await analysisData(ctx)
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

const analysisTop = async ctx => {
  try {
    const data = await analysisTopData(ctx)
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

const download = async ctx => {
  try {
    const [totals, tops] = await Promise.all([analysisData(ctx), analysisTopData(ctx)])
    const workbook = new Excel.Workbook()
    const totalSheet = workbook.addWorksheet('核验总量统计')
    const topSheet = workbook.addWorksheet('核验失败Top5')
    // 设置列头
    totalSheet.columns = peopleVehicleColums
    topSheet.columns = peopleVehicleTopColums

    totals.forEach(item => {
      const date = Object.keys(item)[0]
      const obj = item[date]
      totalSheet.addRow({ date, total: obj.total, success: obj.success, failed: obj.failed, pTotal: obj.pTotal })
    })

    tops.forEach(item => {
      const plateNo = Object.keys(item)[0]
      const obj = item[plateNo]
      topSheet.addRow({
        plateNo: plateNo,
        total: obj.total,
        failed: obj.failed,
        success: obj.success,
        pTotal: obj.pTotal
      })
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
  analysisTop,
  download
}

const analysisTopData = async ctx => {
  try {
    let { start, end } = ctx.query
    start = moment(start).format('YYYY-MM-DD')
    end = moment(end).format('YYYY-MM-DD')

    const tempResult = await PeopleVehicle.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
          checkResult: 2
        }
      },
      { $sortByCount: '$plateNo' },
      { $limit: 5 }
    ])

    const successArray = []
    const totalArray = []

    tempResult.map(item => {
      successArray.push(PeopleVehicle.count({ plateNo: item._id, checkResult: 1 }))
      totalArray.push(PeopleVehicle.count({ plateNo: item._id, checkResult: 0 }))
    })

    const successTemp = await Promise.all(successArray)
    const totalTemp = await Promise.all(totalArray)

    const resultObj = tempResult.map((item, index) => {
      const obj = {}
      const { _id: plateNo, count: failed } = item
      obj[plateNo] = {
        failed,
        success: successTemp[index],
        pTotal: totalTemp[index]
      }
      return obj
    })

    return resultObj
  } catch (error) {
    return []
  }
}

const analysisData = async ctx => {
  try {
    let { plateNo, start, end } = ctx.query
    start = moment(start).format('YYYY-MM-DD')
    end = moment(end).format('YYYY-MM-DD')
    const day = moment(end).diff(start, 'days')
    const timeLine = []
    for (let i = 0; i <= day; i++) {
      timeLine.push(
        moment(start)
          .add(i, 'days')
          .format('YYYY-MM-DD')
      )
    }
    const condition = { date: { $gte: start, $lte: end }, checkResult: { $in: [0, 1, 2] } }
    plateNo && (condition['plateNo'] = plateNo)

    const datas = await PeopleVehicle.aggregate([
      { $match: condition },
      { $group: { _id: { date: '$date', type: '$checkResult' }, total: { $sum: 1 } } }
    ])

    return timeLine.map(key => {
      const time = {}
      const pTotal = _.find(datas, data => data._id.date === key && data._id.type === 0) || { total: 0 }
      const success = _.find(datas, data => data._id.date === key && data._id.type === 1) || { total: 0 }
      const failed = _.find(datas, data => data._id.date === key && data._id.type === 2) || { total: 0 }
      const total = pTotal.total + success.total + failed.total
      time[key] = { pTotal: pTotal.total, success: success.total, failed: failed.total, total }
      return time
    })
  } catch (error) {
    return []
  }
}
