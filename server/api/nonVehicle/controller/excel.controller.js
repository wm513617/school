/*
 * @Author: litao
 * @Date: 2019-06-27 11:55:13
 * @Last Modified time: 2019-07-05 13:15:42
 * 该模块主要提供对非机动车信息的导出以及导入功能
 * -----------------------------README-----------------------------
 * download()   下载选中的非机动车信息
 * transform()  读取上传的非机动车信息(excel)并将数据保存
 * template()   下载上传机动车信息导入时所需要excel的模板
 * toBuffer()   私有反方,对读取的excel的字节流进行转换
 */

'use strict'
const moment = require('moment')
const fs = require('fs')
const path = require('path')

const UserNonVehicles = mongoose.model('userNonVehicles')
const Org = mongoose.model('Org')
const OrgRes = mongoose.model('OrgRes')

const { handleSysException, getChildren } = require('../../../common/tools')
const config = require('../../../../config').backend
const CONSTANT = require('../constant')
const { generateCode } = require('../qrCode')
const cp = require('child_process')

const download = async ctx => {
  try {
    const ids = ctx.query.ids.split(',')
    // const orgId = ctx.query.orgid
    // const orgs = await Org.find({ type: 9 }, 'name pid isroot')
    //   .sort('order')
    //   .lean()
    // let org = []
    // org = getChildren(org, orgs, orgId)
    // org.push(orgId)

    // const rows = await UserNonVehicles.find({ orgId: { $in: org } }).lean()

    const rows = await UserNonVehicles.find({ _id: { $in: ids } }).lean()
    const sheetName = '非机动车信息'
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
      const workerModule = path.join(__dirname, '../../../common/excel.tool.js')
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
    const filePath = path.join(`${config.fileDirs.nonVehicleTempDir}`, `/${name}`)
    const params = {
      type: 'import',
      filePath,
      columns: CONSTANT.dataMap,
      hasHeader: true
    }
    const result = await new Promise((resolve, reject) => {
      const workerModule = path.join(__dirname, '../../../common/excel.tool.js')
      const worker = cp.spawn('node', [workerModule], {
        // const worker = cp.spawn('node', ['--inspect-brk=9223', workerModule], {
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
      let userNonVehicleInfos = result.data

      const plates = await UserNonVehicles.distinct('nonVehiclesInfos.numberPlate', {})
      userNonVehicleInfos = userNonVehicleInfos.filter(doc => {
        return !plates.includes(doc.nonVehiclesInfos.numberPlate)
      })
      for (const vechicleInfo of userNonVehicleInfos) {
        vechicleInfo.orgId = orgId
        const numberPlate = vechicleInfo.nonVehiclesInfos.numberPlate
        const savePath = path.join(config.fileDirs.nonVehicleDir, `/code-${numberPlate}.jpg`)
        await generateCode(numberPlate, savePath)
        vechicleInfo['nonVehiclesInfos']['codeImage'] = `/image/nonVehicle/code-${numberPlate}.jpg`
      }
      const res = await UserNonVehicles.insertMany(userNonVehicleInfos)
      errorCount = userNonVehicleInfos.length - res.length
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
