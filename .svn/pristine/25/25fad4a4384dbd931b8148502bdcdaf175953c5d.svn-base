/*
 * @Author: linhang
 * @Date: 2018-09-10 09:23:23
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-11 16:35:37
 */

'use strict'
// const mongoose = require('mongoose')
const _ = require('lodash')

const { handleSysException } = require('../../../common/tools')
const TrackingService = require('./tracking.service')
const trackingService = new TrackingService()
// const Tracking = mongoose.model('tracking')
const config = require('../../../../config').backend
// const zipdir = require('zip-dir')
const sendKoa = require('koa-send')
const { childProcessZip, childProcessExecl } = require('../childprocess/childProcessExcelAndPdf')
const path = require('path')
const fs = require('fs')
const moment = require('moment')

// 新建接力追踪
exports.createTracking = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-新建接力追踪'))
    const body = ctx.request.body

    ctx.body = await trackingService.createRe(body)
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}
exports.export = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-获取接力追踪详情'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const info = await trackingService.getOne(id)
    const { name, buff } = await trackingService.exPort(info)

    ctx.type = 'application/vnd.openxmlformats'
    ctx.attachment(name + '.xlsx'.toString('utf8'))
    ctx.body = buff
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

exports.trackingInfo = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-获取接力追踪详情'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    let _data = await trackingService.getOne(id)
    _data = JSON.parse(JSON.stringify(_data))
    _.remove(_data.mapList, e => !e.resource)
    _.remove(_data.resourceList, e => !e.resource)
    ctx.body = _data
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

exports.trackingList = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-获取接力追踪列表'))
    ctx.body = await trackingService.getList(ctx)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

exports.trackingAll = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-获取接力追踪列表'))
    ctx.body = [
      {
        eventName: '追踪事件列表',
        root: true,
        id: 1,
        resource: [
          {
            eventName: '追踪事件',
            root: false,
            id: 3,
            resource: await trackingService.getTrackTree(ctx, false)
          },
          {
            eventName: '历史追踪',
            root: false,
            id: 4,
            resource: await trackingService.getTrackTree(ctx, true)
          }
        ]
      },
      {
        eventName: '常规案件列表',
        root: true,
        id: 2,
        resource: [
          {
            eventName: '实时案件',
            root: false,
            id: 5,
            resource: await trackingService.getAlarmTree(ctx, false)
          },
          {
            eventName: '历史案件',
            root: false,
            id: 6,
            resource: await trackingService.getAlarmTree(ctx, true)
          }
        ]
      }
    ]
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

exports.trackingUpdateOne = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-更新单个接力追踪'))
    const id = ctx.params.id
    if (_.isEmpty(id)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    const body = ctx.request.body
    ctx.body = await trackingService.updateOne(id, body)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

exports.trackingDelete = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('业务管理-删除设备巡查日志'))
    const ids = ctx.request.header['x-bsc-ids'].split(',')
    if (_.isEmpty(ids)) {
      ctx.throw(500, { code: 2001, message: '参数不能为空' })
    }
    await trackingService.delete(ids)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}

const DownloadTaskController = require('../alarm/child/taskController') // 下载Controller
const RECORDPATH = '/opt/bstar/video/case' // 录像存储路径
// 下载远程视频到本地目录，生成excel文件，并压缩
exports.remoteDownload = async ctx => {
  try {
    const alarmInfo = await trackingService.findOneAndUpdate({ _id: ctx.params.id }, { isSave: 1 })
    const info = await trackingService.getOne(ctx.params.id)
    // const { name, buff } = await trackingService.exPort(info)
    const downloadTask = DownloadTaskController.getSingleton()
    alarmInfo.backupType = 2
    await downloadTask.start(alarmInfo, 'tracking', info)
    // ctx.type = 'application/vnd.openxmlformats'
    // ctx.attachment(name + '.xlsx'.toString('utf8'))
    // if (!fs.existsSync(`${config.fileDirs.alarmBackUpDir}/${alarmInfo._id}`)) { // 检查该文件目录是否存在
    //   fs.mkdirSync(`${config.fileDirs.alarmBackUpDir}/${alarmInfo._id}`)
    // }
    // fs.writeFileSync(`${config.fileDirs.alarmBackUpDir}/${alarmInfo._id}/${name}.xlsx`, buff)
    ctx.status = 201
  } catch (err) {
    handleSysException(err)
  }
}

// 删除下载
exports.removeFile = async ctx => {
  try {
    const downloadTask = DownloadTaskController.getSingleton()
    const alarmInfo = await trackingService.findOneAndUpdate({ _id: ctx.params.id }, { isSave: 0 })
    const videoPath = path.join(RECORDPATH, alarmInfo._id + '')
    downloadTask.deleteDir(videoPath)
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 导出zip文件
exports.exportZip = async (ctx, next) => {
  try {
    const name = `${ctx.params.name}.zip`
    const path = `${config.fileDirs.alarmBackUpDir}/${name}`
    if (fs.existsSync(path)) {
      if (ctx.query.type === 'find') { // 如果是查询该文件是否存在
        ctx.body = {
          code: 200,
          message: '文件存在'
        }
      } else {
        await sendKoa(ctx, path, { root: '/' })
      }
    } else {
      ctx.body = {
        code: 500,
        path: path,
        message: '文件不存在'
      }
    }
  } catch (err) {
    handleSysException(err)
  }
}

exports.exportExeclAndPdfZip = async ctx => {
  try {
    let { trackingIds = '' } = ctx.query
    trackingIds = trackingIds === '' ? [] : trackingIds.split(',')
    const trackings = await trackingService.getExportData(trackingIds)
    if (!trackings.length) {
      ctx.throw(500, { code: 500, message: '没有数据' })
    }
    const fileName = moment(new Date()).format('YYYY-MM-DD HH-mm-ss')
    // 创建需要压缩的文件夹
    const dirPath = `${config.fileDirs.trackingExeclAndPdfDir}/${fileName}`
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
    const params = {
      type: 'export',
      rows: trackings,
      columns: trackingColumns,
      sheetName: '接力追踪信息',
      filePath: `${dirPath}/${fileName}.xlsx`,
      style: {
        row: { height: 20 }
      }
    }
    await childProcessExecl(params)
    const pdfParams = {
      type: 'tracking',
      data: trackings,
      dirPath: dirPath, // 生成压缩包
      filePath: `${dirPath}/${fileName}.pdf`
    }
    const result = await childProcessZip(pdfParams)
    if (result.code === 200) {
      ctx.attachment(result.zipPath)
      await sendKoa(ctx, result.zipPath, { root: '/' })
    } else {
      ctx.status = 500
      ctx.body = '导出失败'
    }
  } catch (error) {
    handleSysException(error)
  }
}

const trackingColumns = [
  {
    name: '追踪名称',
    type: 'String',
    key: 'name',
    size: 30
  },
  {
    name: '开始时间',
    type: 'Date',
    key: 'startTime',
    size: 20
  },
  {
    name: '结束时间',
    type: 'Date',
    key: 'endTime',
    size: 20
  },
  {
    name: '关联案件',
    type: 'String',
    key: 'eventId.eventName',
    size: 30
  },
  {
    name: '追踪状态',
    type: 'String',
    key: 'close',
    size: 15
  },
  {
    name: '备注',
    type: 'String',
    key: 'mark',
    size: 15
  }
]
