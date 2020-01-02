/*
 * @Description: 识别数据
 * @Author: wanglei
 * @Date: 2019-07-03 16:05:56
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-12 15:37:40
 */
'use strict'
const socket = require('../structure.socket')
const { influxdb } = require('./influxdb/influxdb')
const { handleSysException } = require('../../../common/tools')
const { getVideoStructData } = require('./influxdb/influx.service')
const { InfluxSqlFactory, statisticCountIdentifyData } = require('./identify.service')
const structureServer = mongoose.model('structureserver')
const identifyExcelHistory = mongoose.model('identifyExcelHistory')
const config = require('../../../../config').backend
const send = require('koa-send')
const path = require('path')
const childProcess = require('child_process')
const request = require('request-promise')
const axios = require('axios')
const FormData = require('form-data')
const influxSql = new InfluxSqlFactory()
const carStyleDict = require('./carStyleDict.json')
const { TypeCodeEnum } = require('../structure.enum')
const fs = require('fs')
const moment = require('moment')
const { tranformPromiseAll, CONSTANT } = require('../../../common/tools')
const _ = require('lodash')

// 接收视频结构化服务器识别的数据
exports.receiveStructData = async ctx => {
  try {
    const dataArr = await getVideoStructData(ctx)
    dataArr.forEach(item => socket.pushIdentifyData(item))
    ctx.body = {
      errorCode: '0',
      message: 'success'
    }
  } catch (error) {
    ctx.body = {
      errorCode: '1',
      message: error.message
    }
  }
}

// 获取初始化的识别数据
exports.getInitData = async ctx => {
  try {
    const todayZeroTime = moment()
      .startOf('day')
      .format()
    const currentTime = moment().format()
    const pedSql = `SELECT * FROM "pedestrains" WHERE time > '${todayZeroTime}' AND time < '${currentTime}' ORDER BY time DESC limit 16`
    const vehSql = `SELECT * FROM "vehicles" WHERE time > '${todayZeroTime}' AND time < '${currentTime}' AND type != '${TypeCodeEnum.TRICYCLE}' ORDER BY time DESC limit 16`
    const nonVehSql = `SELECT * FROM "nonVehicles" WHERE time > '${todayZeroTime}' AND time < '${currentTime}' ORDER BY time DESC limit 16`
    const tricycleSql = `SELECT * FROM "vehicles" WHERE time > '${todayZeroTime}' AND time < '${currentTime}' AND type = '${TypeCodeEnum.TRICYCLE}' ORDER BY time DESC limit 16`
    const [peds, vehs, nonVehs, tricycles] = await Promise.all([
      influxdb.query(pedSql),
      influxdb.query(vehSql),
      influxdb.query(nonVehSql),
      influxdb.query(tricycleSql)
    ])
    // 行人、摩托车、自行车、三轮车分为一组，其他车辆分为一组
    const nonVehArr = [...peds, ...nonVehs, ...tricycles].sort((a, b) => b.time - a.time).slice(0, 16)
    ctx.body = {
      vehArr: vehs,
      nonVehArr
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 获取当日零点到当前时间每种结构化分类的数量
exports.todayStructCount = async ctx => {
  try {
    const result = await statisticCountIdentifyData()
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

// 获取车辆品牌型号字典
exports.getCarDict = ctx => {
  try {
    let LogoArr = []
    let LogoObj = {}
    let carLogoLists = JSON.parse(JSON.stringify(carStyleDict))
    // 相同品牌过滤
    for (let item of carLogoLists) {
      if (!LogoObj.hasOwnProperty(String(item.CarFamily))) {
        LogoArr.push({ ...item, isChecked: false, queryText: '' })
        LogoObj[String(item.CarFamily)] = true
      }
    }
    // 相同型号过滤
    for (let item of LogoArr) {
      let arrFilter = carLogoLists.filter(
        val => val.CarFamily === item.CarFamily
      )
      // 对过滤后的数据再次进行相同型号的过滤，不能出现相同型号的车辆
      let brandObj = {}
      let brandArr = []
      for (let item1 of arrFilter) {
        if (!brandObj.hasOwnProperty(String(item1.CarBrand))) {
          brandArr.push({ ...item1, isChecked: false, queryText: '' })
          brandObj[String(item1.CarBrand)] = true
        }
      }
      item.CarBrandList = brandArr
    }
    // 相同年款过滤
    for (let item of LogoArr) {
      for (let item1 of item.CarBrandList) {
        let arrFilter = carLogoLists.filter(
          val =>
            val.CarFamily + ',' + val.CarBrand ===
            item1.CarFamily + ',' + item1.CarBrand
        )
        // 对过滤后的数据再次进行相同年款的过滤，不能出现重复年款的数据
        let patternObj = {}
        let patternArr = []
        for (let item2 of arrFilter) {
          if (!patternObj.hasOwnProperty(String(item2.CarPattern))) {
            patternArr.push({ ...item2, isChecked: false, queryText: '' })
            patternObj[String(item2.CarPattern)] = true
          }
        }
        item1.CarPatternList = patternArr
      }
    }
    ctx.body = LogoArr
  } catch (error) {
    handleSysException(error)
  }
}

// 综合查询接口
// ?page=1&limit=100
// 其他参数与post方式传递过来
exports.integratedQuery = async ctx => {
  try {
    let { pageDataSQL, itemCountSQL } = integratedQuerySQL(ctx, '*')
    console.log('查询语句：', pageDataSQL)
    let [pageData, itemCountData] = await Promise.all([
      influxdb.query(pageDataSQL),
      influxdb.query(itemCountSQL)
    ])
    console.log('数据：', itemCountSQL)
    ctx.body = {
      data: pageData,
      pageNum: ctx.query.page,
      totalNum: itemCountData.length > 0 ? itemCountData[0].count : 0
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 综合查询接口查询语句处理
function integratedQuerySQL (ctx, selectStr) {
  let page = ctx.query.page
  let offset = page.limit * (page.page - 1)
  let reqData = ctx.request.body
  let SQL = ''
  if (reqData.searchType === 'pedestrain') {
    // 行人查询
    SQL += ' "pedestrains"'
  } else if (reqData.searchType === 'nonMotorVehicle') {
    // 非机动车
    SQL += ' "nonVehicles"'
  } else if (reqData.searchType === 'vehicle') {
    // 机动车
    SQL += ' "vehicles"'
  } else {
    ctx.throw(500, '未识别查询类型')
  }
  let startTime = reqData.startTime
  let endTime = reqData.endTime
  delete reqData.searchType
  delete reqData.startTime
  delete reqData.endTime
  SQL += influxSql.sqlWhere(reqData)
  let pageDataSQL =
    'select ' +
    selectStr +
    ' from ' +
    SQL +
    ` time >= ${startTime}ms and time <= ${endTime}ms  order by time desc  limit ${
      page.limit
    } offset ${offset}`
  let itemCountSQL =
    'select count("snapshotTime") from ' +
    SQL +
    ` time >= ${startTime}ms and time <= ${endTime}ms`
  return { pageDataSQL, itemCountSQL }
}

// 报警检索
/**
 * param：
 *    limit 每页显示数量
 *    page 页码
 *
 * body：
 *    startTime 开始检索的时间
 *    endTime  结束检索的时间
 *    defenseTaskId ：布控任务id 多个以，隔开
 *    videoChannel：视频通道 多个以，隔开
 */
exports.alarmQuery = async ctx => {
  try {
    let { pageDataSQL, itemCountSQL } = alarmQuerySQL(ctx, '*')
    let [pageData, itemCountData] = await Promise.all([
      influxdb.query(pageDataSQL),
      influxdb.query(itemCountSQL)
    ])
    ctx.body = {
      data: pageData,
      pageNum: ctx.query.page,
      totalNum: itemCountData.length > 0 ? itemCountData[0].count : 0
    }
  } catch (error) {
    handleSysException(error)
  }
}

// 报警接口查询语句处理
function alarmQuerySQL (ctx, selectStr) {
  let page = ctx.query.page
  let offset = page.limit * (page.page - 1)
  let reqData = ctx.request.body
  console.log(reqData.startTime)
  let startTime = reqData.startTime
  let endTime = reqData.endTime
  console.log(startTime, reqData.startTime, endTime, reqData.endTime)
  let SQL = influxSql.sqlWhere({
    videoChannel: reqData.videoChannel,
    taskName: reqData.taskName
  }) // defenseTaskId
  let pageDataSQL =
    'select ' +
    selectStr +
    ' from "defenseAlarms"' +
    SQL +
    `  time >= ${startTime}ms and time < ${endTime}ms  order by time desc  limit ${
      page.limit
    } offset ${offset}`
  let itemCountSQL =
    'select count("smallImageUrl") from "defenseAlarms"' +
    SQL +
    `  time >= ${startTime}ms and time <= ${endTime}ms`
  return { pageDataSQL, itemCountSQL }
}

// 已图搜图 功能模块
const picsearchLogic = async (ctx, selectStr) => {
  try {
    let body = ctx.request.body
    let urls = []
    let serverList = await structureServer.find({}).exec()
    serverList.map(serverItem => {
      urls.push('http://' + serverItem.ip + ':' + serverItem.port)
    })
    let identifyImgArray = []
    urls.map(url => {
      let form = new FormData()
      form.append(
        'imageData',
        request({
          url: body.imageUrl,
          method: 'GET',
          encoding: null,
          headers: {
            'Accept-Encoding': 'gzip, deflate'
          }
        })
      )
      form.append('type', 'uploadimage')
      form.append('imageType', 0)
      identifyImgArray.push(
        influxSql.uploadImgAllRun(
          form,
          url,
          body.startTime,
          body.endTime,
          body.score || 90
        )
      )
    })
    // 图像识别
    let results = await Promise.all(tranformPromiseAll(identifyImgArray))
    let identifyImgs = []
    results.forEach(item => {
      if (item.status === CONSTANT.RESOLVE) {
        identifyImgs.push(item.data)
      }
    })
    let itemDataArray = []
    identifyImgs.map(item => {
      itemDataArray = itemDataArray.concat(item.data)
    })
    const { videoChannel = '' } = body
    let picsearchLogicResult = []
    if (videoChannel) {
      picsearchLogicResult = await influxSql.filterVideoChannelNotExists(itemDataArray, videoChannel)
      return picsearchLogicResult
    } else {
      let promiseList = itemDataArray.map(item => influxSql.setVideoChannelId(item, videoChannel))
      picsearchLogicResult = await Promise.all(promiseList)
      // 视频结构化返回的数据可能包含已解绑通道识别的数据，所以要做一层过滤
      picsearchLogicResult = picsearchLogicResult.filter(item => item.resourceId)
      return picsearchLogicResult
    }
  } catch (error) {
    handleSysException(error)
  }
}
// 以图搜图接口
// param: {type:如果为空则返回数据 如果为strucImage 则执行导出操作}
exports.picsearchLogic = async ctx => {
  try {
    // type为空则查询
    let data = await picsearchLogic(ctx, '*')
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

// 识图
exports.picsearchDiscern = async ctx => {
  try {
    let body = ctx.request.body
    let serverList = await structureServer.find({}).exec()
    let res = {}
    for (let i = 0; i < serverList.length; i++) {
      let url = 'http://' + serverList[i].ip + ':' + serverList[i].port
      let form = new FormData()
      form.append('imageData', fs.createReadStream(body.files.file.path))
      form.append('type', 'recognize')
      form.append('imageType', 0)

      try {
        res = await axios({
          method: 'POST',
          url: url + '/business/picsearchLogic.php',
          data: form,
          headers: form.getHeaders(),
          timeout: 1000 * 5
        })
      } catch (error) {
        continue
      }
      if (res.data.errorCode === '0') {
        console.log('结构化服务以图搜图 识别成功')
        break
      } else {
        // errorCode === '1'
        console.log('结构化服务以图搜图 识别失败')
      }
    }
    ctx.body = res.data
  } catch (error) {
    handleSysException(error)
  }
}

/**
 * param:{filename:xxxxx,type:{type:strucAlarm | strucIntegrate| strucImage,id:导出列表id}}
 */
exports.download = async ctx => {
  const fileName = ctx.query.filename
  const type = ctx.query.type

  const fullPath = getFullPath(fileName, type)
  if (!fs.existsSync(fullPath)) {
    ctx.status = 404
    return // eslint-disable-line
  }
  await send(ctx, fullPath, { root: '/' })
}

/**
 * 删除导出文件
 * param:{type:strucAlarm | strucIntegrate| strucImage,id:导出列表id}
 */
exports.remove = async ctx => {
  try {
    const type = ctx.query.type
    const id = ctx.query.id

    const fileInfo = await identifyExcelHistory.findByIdAndRemove(id)
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

/**
 * 获取导出文件任务列表
 * params:{type:strucAlarm | strucIntegrate| strucImage}
 */
exports.list = async ctx => {
  try {
    const type = ctx.query.type
    console.log(type)
    const datas = await identifyExcelHistory
      .find({ category: type }, '_id filename status createdAt')
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

/**
 * 创建文件导出任务
 * param { type:'strucAlarm|strucIntegrate|strucImage'}
 */

const createExclefile = async ctx => {
  try {
    if (_.isEmpty(ctx.query.type)) {
      ctx.throw(500, 'type 不能为空')
    }
    const type = ctx.query.type
    const sheetName =
      (type === 'strucAlarm' && '报警检索记录') ||
      (type === 'strucIntegrate' && '综合查询记录') ||
      (type === 'strucImage' && '以图搜图检索记录')

    const workerModule = path.resolve(__dirname, './identifyExportExcel.js')
    const fileName = moment(new Date()).format('YYYY-MM-DD HH-mm-ss')
    const fileInfo = await identifyExcelHistory.create({
      filename: fileName,
      category: type
    })
    const fullPath = getFullPath(fileName, type)
    let pageDataSQL = ''
    if (type === 'strucIntegrate') {
      // 综合查询导出
      ctx.query.page = { limit: 10000, page: 1 }
      pageDataSQL = integratedQuerySQL(ctx, '*').pageDataSQL
      influxdb.query(pageDataSQL).then(results => {
        childProcessExcel(workerModule, fullPath, sheetName, fileInfo, results)
      })
    } else if (type === 'strucAlarm') {
      // 报警检索
      ctx.query.page = { limit: 10000, page: 1 }
      pageDataSQL = alarmQuerySQL(ctx, '*').pageDataSQL
      influxdb.query(pageDataSQL).then(results => {
        childProcessExcel(workerModule, fullPath, sheetName, fileInfo, results)
      })
    } else if (type === 'strucImage') {
      // 已图搜图
      picsearchLogic(ctx, '*').then(results => {
        childProcessExcel(workerModule, fullPath, sheetName, fileInfo, results)
      })
    }
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

exports.create = createExclefile

const childProcessExcel = (
  workerModule,
  fullPath,
  sheetName,
  fileInfo,
  excalData
) => {
  if (excalData.length === 0) {
    fileInfo.status = 2
    update(fileInfo).then(() => {
      console.log('结构化服务 导出数据为空 导出任务执行识别！')
    })
    return
  }

  const worker = childProcess.spawn('node', [workerModule], {
    stdio: [null, null, null, 'ipc']
  })
  worker.on('message', async result => {
    fileInfo.status = 1
    if (!result.success) {
      fileInfo.status = 2
    }
    await update(fileInfo)
  })
  worker.send({ fullPath, excalData, sheetName })
  worker.stdout.on('data', data => {
    console.log(worker.pid + ' 打印:', '>', data.toString(), '<')
  })
}

const getFullPath = (fileName, fileType) => {
  const dir =
    (fileType === 'strucAlarm' &&
      config.fileDirs.exportStrucAlarmExcelFileDir) ||
    (fileType === 'strucIntegrate' &&
      config.fileDirs.exportStrucIntegrateExcelFileDir) ||
    (fileType === 'strucImage' && config.fileDirs.exportstrucImageExcelFileDir)
  const fullPath = path.resolve(dir, `${fileName}.xlsx`)
  return fullPath
}

const update = async excelHistory => {
  try {
    await identifyExcelHistory
      .updateOne({ _id: excelHistory.id }, excelHistory)
      .exec()
  } catch (error) {
    handleSysException(error)
  }
}
