/*
 * @Author: litao
 * @Date: 2019-06-27 11:55:13
 * @Last Modified time: 2019-07-05 13:15:42
 * 该模块主要提供对非机动车的添加、删除、修改、查询功能
 * -----------------------------README-----------------------------
 * download()   下载选中的机动车信息
 * transform()  读取上传的机动车信息(excel)并将数据保存
 */

'use strict'
const moment = require('moment')
const fs = require('fs')
const path = require('path')
const cp = require('child_process')

const mongoose = require('mongoose')
const Motorvehicle = mongoose.model('motorvehicle')

const { handleSysException } = require('../../../../../common/tools')
const config = require('../../../../../../config').backend
const CONSTANT = require('../constant')

const download = async ctx => {
  try {
    const ids = ctx.query.ids.split(',')
    const rows = await Motorvehicle.find({ _id: { $in: ids } }).lean()
    const sheetName = '机动车信息'
    const fileName = `${moment(new Date()).format('YYYY-MM-DD HH-mm-ss')}.xlsx`

    const params = {
      type: 'export',
      rows,
      columns: CONSTANT.columns,
      sheetName,
      filePath: path.join(config.fileDirs.tempDir, fileName),
      style: {
        row: { height: 100 }
      }
    }
    const result = await new Promise((resolve, reject) => {
      const workerModule = path.join(__dirname, '../../../../../common/excel.tool.js')
      const worker = cp.spawn('node', [workerModule], {
        stdio: [null, null, null, 'ipc']
      })
      worker.send(params)
      worker.on('message', async result => {
        resolve(result)
      })
    })
    if (result.code === 200) {
      ctx.type = 'application/vnd-openxmlformats'
      ctx.attachment(fileName)
      ctx.body = fs.readFileSync(params.filePath)
    } else {
      ctx.status = 500
      ctx.body = '导出失败'
    }
  } catch (error) {
    handleSysException(error)
  }
}

const transform = async ctx => {
  try {
    const { name, orgId } = ctx.params
    const filePath = path.join(`${config.fileDirs.motorDriverTempDir}`, `/${name}`)

    const params = {
      type: 'import',
      filePath,
      columns: CONSTANT.dataMap,
      hasHeader: true
    }
    const result = await new Promise((resolve, reject) => {
      const workerModule = path.join(__dirname, '../../../../../common/excel.tool.js')
      const worker = cp.spawn('node', [workerModule], {
        stdio: [null, null, null, 'ipc']
      })
      worker.send(params)
      worker.on('message', async result => {
        resolve(result)
      })
    })
    let errorCount = 0
    let successCount = 0
    if (result.code === 200) {
      const current = moment().format('X')
      result.data.forEach(item => {
        item.state = item.startTime < current || item.endTime > current ? 1 : 0
        Object.assign(item, { orgId })
      })
      let motorvehicleInfos = result.data
      const plates = await Motorvehicle.distinct('plateNo', {})
      motorvehicleInfos = motorvehicleInfos.filter(doc => {
        return !plates.includes(doc.plateNo)
      })
      const res = await Motorvehicle.insertMany(motorvehicleInfos)
      errorCount = motorvehicleInfos.length - res.length
      successCount = res.length
      setImmediate(() => {
        fs.unlinkSync(filePath)
      })
    }
    ctx.body = {
      errorCount: errorCount,
      successCount: successCount
    }
  } catch (error) {
    handleSysException(error)
  }
}

const template = async ctx => {
  const templatePath = path.join(__dirname, '../template/template.xlsx')
  const buffer = fs.readFileSync(templatePath)

  ctx.type = 'application/vnd-openxmlformats'
  ctx.attachment('template.xlsx')
  ctx.body = buffer
}

module.exports = {
  download,
  transform,
  template
}
