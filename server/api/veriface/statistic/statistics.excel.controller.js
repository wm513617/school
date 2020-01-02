/*
 * @Author: litao
 * @Date: 2019-05-27 11:55:13
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-07-08 09:11:18
 * 该模块主要提供excel导出、下载以及导出记录的查看功能
 * -----------------------------README-----------------------------
 * create     导出Excel时调用接口
 * remove     根据ID删除导出记录以及已导出的Excel文件
 * list       返回导出Excel历史记录
 * download   下载指定的excel文件.前端使用的方法为:window.open('http://127.0.0.1:20000/api/veriface/statistic/alarm/export/download/2019-02-03')
 *-----------------------------特殊说明----------------------------
 *1、generateExcel会成为一个通用函数，如果其他地方使用的话可以进一步的提取或抽象
 *2、当前未考虑当在生成Excel或者删除Excel文件的过程中服务器突然宕机的情况。如果后期需要进行处理可在服务重启之后用ExcelHistory表中的数据与文件夹中的ecxel文件名进行对比
 */

'use strict'

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const send = require('koa-send')
const moment = require('moment')
const cp = require('child_process')

const ExcelHistory = mongoose.model('excelHistory')
const { handleSysException } = require('../../../common/tools')
const config = require('../../../../config').backend
const { AlarmData, PassByData, ImageData } = require('./statistics.controller')

const columnDatas = {
  alarm: [
    {
      name: '抓拍图片',
      type: 'Image',
      key: 'faceImage',
      size: 14.5,
      baseUri: config.fileDirs.facePasserPictureDir
    },
    {
      name: '底库图片',
      type: 'Image',
      key: 'userImage',
      size: 14.5,
      baseUri: config.fileDirs.faceUserPictureDir
    },
    { name: '姓名', type: 'String', key: 'userName', size: 20 },
    { name: '性别', type: 'Enum', key: 'gender', default: { 1: '女', 2: '男' }, size: 20 },
    { name: '相似度', type: 'Number', key: 'similar', size: 20 },
    { name: '报警时间', type: 'Date', key: 'time', size: 32 },
    { name: '抓拍位置', type: 'String', key: 'resName', size: 32 },
    { name: '底库名称', type: 'String', key: 'groupName', size: 32 }
  ],
  passby: [
    {
      name: '抓拍图片',
      type: 'Image',
      key: 'faceImage',
      size: 14.5,
      baseUri: config.fileDirs.facePasserPictureDir
    },
    { name: '抓拍时间', type: 'Date', key: 'time', size: 32 },
    { name: '抓拍位置', type: 'String', key: 'resName', size: 32 },
    { name: '年龄', type: 'Number', key: 'age', size: 20 },
    { name: '姓名', type: 'String', key: 'userName', size: 20 },
    { name: '性别', type: 'Enum', key: 'gender', default: { 1: '女', 2: '男' }, size: 20 },
    { name: '相似度', type: 'Number', key: 'similar', size: 20 }
  ],
  image: [
    {
      name: '抓拍图片',
      type: 'Image',
      key: 'faceImage',
      size: 14.5,
      baseUri: config.fileDirs.facePasserPictureDir
    },
    { name: '抓拍时间', type: 'Date', key: 'time', size: 32 },
    { name: '抓拍位置', type: 'String', key: 'resName', size: 32 },
    { name: '年龄', type: 'Number', key: 'age', size: 20 },
    { name: '姓名', type: 'String', key: 'userName', size: 20 },
    { name: '性别', type: 'Enum', key: 'gender', default: { 1: '女', 2: '男' }, size: 20 },
    { name: '相似度', type: 'Number', key: 'similar', size: 20 }
  ]
}

const create = async ctx => {
  try {
    const type = ctx.query.type
    const columns = columnDatas[type]

    if (!columns) {
      ctx.status = 400
      return
    }
    let rows =
      (type === 'alarm' && (await AlarmData(ctx))) ||
      (type === 'passby' && (await PassByData(ctx))) ||
      (type === 'image' && (await ImageData(ctx)))
    // 最大导出条目数
    if (rows.length > 10000) {
      rows = rows.slice(0, 10000)
    }
    const sheetName =
      (type === 'alarm' && '报警检索记录') ||
      (type === 'passby' && '路人检索记录') ||
      (type === 'image' && '以图搜图检索记录')

    const fileName = moment(new Date()).format('YYYY-MM-DD HH-mm-ss')
    const fileInfo = await ExcelHistory.create({ filename: fileName, category: type })
    const params = {
      type: 'export',
      rows,
      columns,
      sheetName,
      filePath: getFullPath(fileName, type),
      style: {
        row: { height: 100 }
      }
    }
    const workerModule = path.join(__dirname, '../../../common/excel.tool.js')
    const worker = cp.spawn('node', [workerModule], {
      stdio: [null, null, null, 'ipc']
    })
    worker.send(params)
    worker.on('message', async result => {
      fileInfo.status = 0
      if (result.code === 200) {
        fileInfo.status = 1
      } else {
        fileInfo.status = 2
      }
      await update(fileInfo)
    })
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

const list = async ctx => {
  try {
    const type = ctx.params.type

    const datas = await ExcelHistory.find({ category: type }, '_id filename status createdAt')
      .sort({ _id: -1 })
      .lean()
      .exec()
    datas.map(data => {
      data.createdAt = moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss')
    })

    ctx.body = datas
  } catch (error) {
    handleSysException(error)
  }
}

const remove = async ctx => {
  const id = ctx.params.id
  const type = ctx.params.type

  try {
    const fileInfo = await ExcelHistory.findByIdAndRemove(id)
    const fullPath = getFullPath(fileInfo.filename, type)
    if (fs.existsSync(fullPath)) {
      setImmediate(() => {
        fs.unlinkSync(fullPath)
      })
    }

    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

const download = async ctx => {
  const fileName = ctx.params.filename
  const type = ctx.params.type

  const fullPath = getFullPath(fileName, type)
  if (!fs.existsSync(fullPath)) {
    ctx.status = 404
    return // eslint-disable-line
  }

  await send(ctx, fullPath, { root: '/' })
}

module.exports = {
  create,
  list,
  remove,
  download
}

const getFullPath = (fileName, fileType) => {
  const dir =
    (fileType === 'alarm' && config.fileDirs.exportAlarmExcelFileDir) ||
    (fileType === 'passby' && config.fileDirs.exportPassbyExcelFileDir) ||
    (fileType === 'image' && config.fileDirs.exportImageExcelFileDir)

  const temp = fileName.split('.')[1] === 'xlsx' ? fileName : `${fileName}.xlsx`
  const fullPath = path.resolve(dir, temp)
  return fullPath
}

const update = async excelHistory => {
  try {
    await ExcelHistory.updateOne({ _id: excelHistory.id }, excelHistory).exec()
  } catch (error) {
    handleSysException(error)
  }
}