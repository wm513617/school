/*
 * @Author: hansen.liuhao
 * @Date: 2018-10-18 11:43:38
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-11 16:35:55
 */
const mongoose = require('mongoose')
// const paging = require('../paging')
const moment = require('moment')
const _ = require('lodash')
const Tracking = mongoose.model('tracking')
const Resource = mongoose.model('Resource')
const AlarmEvent = mongoose.model('AlarmEvent')
const paging = require('../../paging')
const Excel = require('exceljs')

class TrackingService {
  // 列表
  async getList (ctx) {
    try {
      let query = {
      }

      if (ctx.query.seek) {
        const [alarmOrder, resName] = await Promise.all([
          AlarmEvent.find({ eventCode: { $regex: ctx.query.seek + '' || '' } }, '_id').lean().exec(),
          Resource.find({ name: { $regex: ctx.query.seek + '' || '' } }, '_id').lean().exec()
        ])
        query = {
          $or: [{
            resourceList: { '$elemMatch': { resource: { $in: resName.map(item => item._id + '') } } }
          },
          {
            eventId: {
              $in: alarmOrder.map(item => item._id + '')
            }
          }, {
            name: { $regex: ctx.query.seek + '' || '' }
          }]
        }
      }
      if (ctx.query.close === '1') {
        query.close = false
      } else {
        query.close = true
      }
      if (ctx.query.startTime && ctx.query.endTime) {
        query.mapList = {
          '$elemMatch': {
            'startTime': {
              '$gte': Number(ctx.query.startTime)
            },
            'endTime': {
              '$lte': Number(ctx.query.endTime)
            }
          }
        }
      }
      let results = await paging.listQuery(
        Tracking,
        query,
        'name mark resourceList close eventId mapList isSave',
        { createdAt: -1 },
        ctx.query.page,
        [
          { path: 'mapList.resource', select: 'name' },
          { path: 'resourceList.resource', select: 'name' },
          { path: 'eventId', select: 'eventCode' }
        ],
        ctx
      )
      results = JSON.parse(JSON.stringify(results))
      results.results.forEach(e => {
        let str = 0
        let end = 0
        e.mapList.map(f => {
          if (end < (f.endTime || f.startTime)) {
            end = f.endTime || f.startTime + 10
          }
          if (str < f.startTime) {
            str = f.startTime
          }
        })
        e.startTime = str
        e.endTime = end
        _.remove(e.mapList, item => !item.resource)
        _.remove(e.resourceList, item => !item.resource)
      })
      return results
    } catch (error) {
      throw error
    }
  }

  // tree 常规事件
  async getAlarmTree (ctx, close = false) {
    try {
      let _data = await AlarmEvent.find({ close }, '_id eventName person phone department address startTime endTime mark images resourceList._id resourceList.resource resourceList.tagTime resourceList.tagTime.startTime resourceList.tagTime.endTime resourceList.tagTime.tagName structuredTrack.startTime structuredTrack.endTime structuredTrack.resource')
        .sort({ 'createdAt': -1 })
        .populate([
          { path: 'resourceList.resource', select: 'name' },
          { path: 'structuredTrack.resource', select: 'name' }
          // { path: 'resourceList.resource', select: 'name eid monitortype', populate: { path: 'eid', select: 'ip' } },
          // { path: 'structuredTrack.resource', select: 'name eid monitortype', populate: { path: 'eid', select: 'ip' } }
        ])
        .lean()
      _data.forEach(e => {
        _.remove(e.resourceList, f => !f.resource)
        _.remove(e.structuredTrack, f => !f.resource)
        let resourceList = _.cloneDeep(e.resourceList)
        let structuredTrack = _.cloneDeep(e.structuredTrack)
        e.resource = []
        if (resourceList.length) {
          e.resource.push({
            eventName: '案件标记',
            type: 'alarm',
            resource: resourceList
          })
        }
        if (structuredTrack.length) {
          e.resource.push({
            eventName: '结构化标记',
            type: 'structuredTrack',
            resource: structuredTrack
          })
        }
        delete e.resourceList
        delete e.structuredTrack
      })
      return _data
    } catch (error) {
      throw error
    }
  }
  // tree 追踪事件
  async getTrackTree (ctx, close = false) {
    try {
      let _data = await Tracking.find({ close }, '_id name mark eventId mapList.resource mapList.startTime mapList.endTime')
        .sort({ 'createdAt': -1 })
        .populate([
          // { path: 'mapList.resource', select: 'name eid monitortype', populate: { path: 'eid', select: 'ip' } },
          { path: 'mapList.resource', select: 'name' },
          { path: 'eventId', select: '_id eventName person phone department address startTime endTime mark images resourceList._id resourceList.resource resourceList.tagTime resourceList.tagTime.startTime resourceList.tagTime.endTime resourceList.tagTime.tagName structuredTrack.startTime structuredTrack.endTime structuredTrack.resource', populate: [{ path: 'resourceList.resource', select: 'name eid monitortype', populate: { path: 'eid', select: 'ip' } }, { path: 'structuredTrack.resource', select: 'name eid monitortype', populate: { path: 'eid', select: 'ip' } }] }
        ])
        .lean()
      _data.forEach(e => {
        _.remove(e.mapList, f => !f.resource)
        let mapList = _.cloneDeep(e.mapList)
        e.resource = []
        if (mapList && mapList.length) {
          e.resource.push({
            eventName: '追踪标记',
            type: 'track',
            resource: mapList
          })
        }
        delete e.mapList
        if (e.eventId) {
          _.remove(e.eventId.resourceList, f => !f.resource)
          _.remove(e.eventId.structuredTrack, f => !f.resource)
          let resourceList = _.cloneDeep(e.eventId.resourceList)
          let structuredTrack = _.cloneDeep(e.eventId.structuredTrack)
          if (resourceList && resourceList.length) {
            e.resource.push({
              eventName: '案件标记',
              type: 'alarm',
              resource: resourceList
            })
          }
          if (structuredTrack && structuredTrack.length) {
            e.resource.push({
              eventName: '结构化标记',
              type: 'structuredTrack',
              resource: structuredTrack
            })
          }
          delete e.eventId.resourceList
          delete e.eventId.structuredTrack
        }
      })
      return _data
    } catch (error) {
      throw error
    }
  }

  // 创建录像拷贝记录
  async createRe (body) {
    try {
      const tracking = new Tracking(body)
      const results = await tracking.save()
      return results
    } catch (error) {
      throw error
    }
  }
  // 更新录像拷贝记录
  async updateOne (id, body) {
    try {
      const results = await Tracking.findByIdAndUpdate(id, body).exec()
      return results
    } catch (error) {
      throw error
    }
  }

  // 删除
  async delete (id) {
    try {
      const results = await Tracking.deleteMany({ _id: { $in: id } }).exec()
      return results
    } catch (error) {
      throw error
    }
  }

  // 详情
  async getOne (id) {
    try {
      const results = await Tracking.findOne({ _id: id })
        .populate([
          {
            path: 'resourceList.resource',
            select: 'name eid chan status',
            populate: {
              path: 'eid',
              select: 'name ip cport deviceStatus'
            }
          },
          {
            path: 'mapList.resource',
            select: 'name eid chan status',
            populate: {
              path: 'eid',
              select: 'name ip cport deviceStatus'
            }
          },
          {
            path: 'eventId',
            populate: [
              {
                path: 'resourceList.resource',
                select: 'name eid chan status',
                populate: {
                  path: 'eid',
                  select: 'name ip cport deviceStatus'
                }
              },
              {
                path: 'structuredTrack.resource',
                select: 'name eid chan status',
                populate: {
                  path: 'eid',
                  select: 'name ip cport deviceStatus'
                }
              }
            ]
          }]).exec()
      return results
    } catch (error) {
      throw error
    }
  }

  async exPort (info) {
    const workbook = new Excel.Workbook()
    workbook.creator = 'bst'
    workbook.lastModifiedBy = 'bst'
    workbook.created = new Date()
    workbook.modified = new Date()
    let sheet = workbook.addWorksheet(`${info.name}`)
    sheet.columns = [
      { header: `${info.name}`, width: 18 },
      { width: 54 }
    ]
    sheet.addRows([
      ['追踪事件信息'],
      ['追踪事件名称', info.name],
      ['备注', info.mark]
    ])
    // sheet.setColumnKey.font = {}
    sheet.getCell('A1').font = {
      // 字体名
      name: '宋体',
      // Font family for fallback. An integer value.
      family: 4,
      // 字体大小
      size: 16,
      // 加粗
      bold: true
    }
    sheet.mergeCells('A1:B1')
    sheet.getCell('A1').alignment = {
      vertical: 'middle',
      horizontal: 'center'
    }
    sheet.mergeCells('A2:B2')
    sheet.getCell('A2').font = {
      // 加粗
      bold: true
    }
    sheet.getCell('A2').alignment = {
      vertical: 'middle',
      horizontal: 'left'
    }
    sheet.getCell('B4').alignment = { wrapText: true }
    let notEvent = true
    if (info.eventId) {
      const evenData = [
        ['案件信息'],
        ['关联事件编号', _.get(info, 'eventId.eventCode', '')],
        ['事件名称', _.get(info, 'eventId.eventName', '')],
        ['报警人', _.get(info, 'eventId.person', '')],
        ['联系电话', _.get(info, 'eventId.phone', '')],
        ['事发地点', _.get(info, 'eventId.incidentAddress', '')],
        ['事件特征', _.get(info, 'eventId.description', '')]
      ]
      sheet.addRows(evenData)
      sheet.mergeCells('A5:B5')
      sheet.getCell('A5').font = {
        // 加粗
        bold: true
      }
      sheet.getCell('A5:B5').alignment = {
        vertical: 'middle',
        horizontal: 'left'
      }
      notEvent = false
    }
    let nameStartTime = 0 // 最早的开始时间
    let nameEndTime = 0 // 最晚的结束时间
    if (_.get(info, 'resourceList.length', 0) > 0) {
      sheet.addRows([['录像文件名称']])
      sheet.mergeCells(notEvent ? 'A5:B5' : 'A12:B12')
      const position = notEvent ? 'A5' : 'A12'
      sheet.getCell(position).font = {
        // 加粗
        bold: true
      }
      sheet.getCell(position).alignment = {
        vertical: 'middle',
        horizontal: 'left'
      }
      let i = 0

      for (let item of info.resourceList) {
        i += 1
        const stimeNumber = moment(_.get(item, 'startTime', 0) * 1000)
        const etimeNumber = moment(_.get(item, 'endTime', 0) * 1000)
        let sTime = moment(stimeNumber).format('YYYY-MM-DD HH:mm:ss')
        let eTime = moment(etimeNumber).format('YYYY-MM-DD HH:mm:ss')
        if (nameStartTime === 0 || nameEndTime === 0) {
          nameStartTime = stimeNumber
          nameEndTime = etimeNumber
        } else {
          nameStartTime = sTime < stimeNumber ? sTime : stimeNumber
          nameEndTime = eTime > etimeNumber ? eTime : etimeNumber
        }

        sheet.addRows([[`${info.name}-${item.resource.name}-${sTime}-${eTime}-${i}`]])
        sheet.mergeCells(`A${(notEvent ? 5 : 12) + i}: B${(notEvent ? 5 : 12) + i} `)
      }
    }
    const buff = await workbook.xlsx.writeBuffer()
    return {
      name: `${info.name}-${moment(nameStartTime).format('YYYY-MM-DD HH:mm:ss')}-${moment(nameEndTime).format('YYYY-MM-DD HH:mm:ss')}`,
      buff: buff
    }
  }

  async findOneAndUpdate (select, update) {
    console.log('asdasdasdasd', select, update)
    const results = await Tracking.findByIdAndUpdate(select, update)
      .populate([
        {
          path: 'mapList.resource',
          select: 'name eid chan portstatus',
          populate: {
            path: 'eid',
            select: 'name ip cport deviceStatus'
          }
        }]).lean().exec()
    console.log('asdasdasd=======1111111111111', JSON.stringify(results))
    results.resourceList = results.mapList.map(item => {
      const tag = [
        {
          startTime: item.startTime,
          endTime: item.endTime
        }
      ]
      item.tagTime = tag
      return item
    })
    results.eventName = results.name
    results.backupType = 2
    return results
  }

  /**
   * 获取接力追踪的导出数据
   * @param {Array} trackingIds 接力追踪 _id 数组
   */
  async getExportData (trackingIds) {
    try {
      const trackings = await Tracking.find({ _id: { $in: trackingIds } }, 'name close eventId mapList mark')
        .populate({ path: 'eventId', select: 'eventCode eventName' })
        .lean()
        .exec()
      trackings.forEach(item => {
        let startTime = 0
        let endTime = 0
        item.mapList.map(e => {
          if (endTime < (e.endTime || e.startTime)) {
            endTime = e.endTime || e.startTime + 10
          }
          if (startTime < e.startTime) {
            startTime = e.startTime
          }
          item.startTime = startTime
          item.endTime = endTime
        })
        item.close = item.close === true ? '已结束' : '追踪中'
      })
      return trackings
    } catch (error) {
      throw Error(error)
    }
  }
}

module.exports = TrackingService
