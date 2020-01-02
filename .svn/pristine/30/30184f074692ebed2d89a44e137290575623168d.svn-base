/*
 * @Author: zhangminbo
 * @Date: 2018-06-12 11:11:13
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-06-26 15:33:15
 */
'use strict'
const mongoose = require('mongoose')
const VerifaceStatistics = mongoose.model('VerifaceStatistics')
const VerifaceIdentify = mongoose.model('VerifaceIdentify')
const VeriGroup = mongoose.model('VeriGroup')
const VeriUser = mongoose.model('VeriUser')
const FaceServer = mongoose.model('FaceServer')
const sdkInterface = require('../sdk.interface')
const paging = require('../../paging')
const _ = require('lodash')
const moment = require('moment')
const xlsx = require('node-xlsx')
const { handleSysException } = require('../../../common/tools')
const xl = require('excel4node')
const fs = require('fs')
const resizeImg = require('resize-img')
const Resource = mongoose.model('Resource')
const { devOnlineList } = require('../../bstar/dev.interface')
const config = require('../../../../config').backend
const socket = require('../sdkV3.socket')
/**
 * 路人检索
 * @param {*} ctx
 */
exports.getPassbyList = async ctx => {
  try {
    const query = passbyQueryParamHandle(ctx)
    ctx.body = await passbyList(ctx, query)
  } catch (error) {
    handleSysException(error)
  }
}

const passbyQueryParamHandle = ctx => {
  const search = ctx.query.search
  const query = {}
  if (search.startTime && search.endTime) {
    query.time = { $gte: Number(search.startTime), $lte: Number(search.endTime) }
  }
  if (Number(search.startAge) !== 0 || Number(search.endAge) !== 100) {
    query.age = { $lte: Number(search.endAge) || 100, $gte: Number(search.startAge) || 0 }
  }
  if (search.gender && search.gender !== 'all') {
    query.gender = search.gender
  }
  if (search.points && search.points.split(',').length) {
    query.res = { $in: search.points.split(',') }
  }
  if (search.writeSdk === '1') {
    query.isCreateSync = true
  } else if (search.writeSdk === '0') {
    query.isCreateSync = false
  }
  return query
}

/**
 * 路人检索
 * @param {*} ctx
 * @param {*} limit
 */
const passbyList = async (ctx, query) => {
  try {
    const search = ctx.query.search
    const next = search.arrow ? Number(search.arrow) : 1
    const operationId = search.opId
    let data = await paging.largeListQuery(VerifaceIdentify, query, { time: -1 }, next, operationId)
    return data.results
  } catch (err) {
    throw err
  }
}

exports.passbyStatictisCount = async ctx => {
  const query = passbyQueryParamHandle(ctx)
  const count = await VerifaceIdentify.countDocuments(query)
  ctx.body = count
}
/**
 * 路人以图搜图
 * @param {*} ctx
 */
exports.getImageByImage = async ctx => {
  try {
    const param = await imageQueryParamHandle(ctx)
    const data = await getImgByImg(ctx, param)
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}
/**
 * 路人以图搜图
 * @param {*} ctx
 */
const imageQueryParamHandle = async (ctx, limit = 0, redirect = '') => {
  try {
    const search = ctx.query.search
    const similar = Number(search.similar)
    const image = search.image
    const passbyGroup = await VeriGroup.findOne({ name: '路人库' }).lean()
    const groupIdStrs = passbyGroup._id + ''
    let data
    if (ctx.query.target || redirect) {
      data = await sdkInterface.searchMultiSvrImage(groupIdStrs, image, 'data', similar)
    } else {
      data = await sdkInterface.searchMultiSvrImage(groupIdStrs, image, '', similar)
    }
    const scores = []
    const idIp = []
    data &&
      data.length &&
      data.forEach(obj => {
        obj.groups &&
          obj.groups.forEach(g => {
            g.photos.forEach(m => {
              if (m.score >= similar) {
                idIp.push(m.id + '/' + obj.host.ip + '/' + m.tag.split('/').pop())
                scores.push(m.score.toFixed(0))
              }
            })
          })
      })
    const query = {
      idAndTag: { $in: idIp },
      time: { $gte: Number(search.startTime), $lte: Number(search.endTime) }
    }
    if (search.points && search.points.split(',').length) {
      query.res = { $in: search.points.split(',') }
    }
    return { query, scores, idIp }
  } catch (err) {
    handleSysException(err)
  }
}

const getImgByImg = async (ctx, param) => {
  try {
    const search = ctx.query.search
    const next = search.arrow ? Number(search.arrow) : 1
    const operationId = search.opId
    let data = await paging.largeListQuery(VerifaceIdentify, param.query, { time: -1 }, next, operationId)
    for (let n of data.results) {
      const i = param.idIp.indexOf(n.idAndTag)
      n.similar = param.scores[i]
    }
    return data.results
  } catch (err) {
    handleSysException(err)
  }
}

exports.imageStatictisCount = async ctx => {
  const param = await imageQueryParamHandle(ctx)
  const count = await VerifaceIdentify.countDocuments(param.query)
  ctx.body = count
}

/**
 * 报警检索
 * @param {*} ctx
 */
exports.getAlarmList = async ctx => {
  try {
    const query = alarmQueryParamHandle(ctx)
    const data = await AlarmList(ctx, query)
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

exports.AlarmData = async ctx => {
  try {
    const query = alarmQueryParamHandle(ctx)
    const results = await VerifaceIdentify.find(
      query,
      'faceImage userImage userName gender similar time resName groupName'
    )
      .sort({ time: -1 })
      .lean()
      .exec()
    return results
  } catch (error) {
    handleSysException(error)
  }
}

exports.PassByData = async ctx => {
  try {
    const query = passbyQueryParamHandle(ctx)
    const results = await VerifaceIdentify.find(query, 'faceImage time resName age userName gender similar')
      .sort({ time: -1 })
      .lean()
      .exec()
    return results
  } catch (error) {
    handleSysException(error)
  }
}

exports.ImageData = async ctx => {
  try {
    const param = await imageQueryParamHandle(ctx)
    const results = await VerifaceIdentify.find(param.query, 'faceImage time resName age userName gender similar')
      .sort({ time: -1 })
      .lean()
      .exec()
    for (let n of results) {
      const i = param.idIp.indexOf(n.idAndTag)
      n.similar = param.scores[i]
    }
    return results
  } catch (error) {
    handleSysException(error)
  }
}

const alarmQueryParamHandle = ctx => {
  const search = ctx.query.search
  const query = {}
  if (search.group !== 'all') {
    query.group = search.group
  }
  if (search.name) {
    query.userName = { $regex: search.name }
  }
  if (search.gender !== 'all') {
    query.gender = search.gender
  }
  if (search.similar) {
    query.similar = { $gte: Number(search.similar) }
  }
  if (search.startTime && search.endTime) {
    query.time = { $gte: Number(search.startTime), $lte: Number(search.endTime) }
  }
  if (search.points) {
    const res = search.points.split(',')
    query.res = { $in: res }
  }
  query.isdefense = true
  return query
}
/**
 * 报警检索
 * @param {*} ctx
 * @param {*} limit
 */
const AlarmList = async (ctx, query) => {
  try {
    const search = ctx.query.search
    const next = search.arrow ? Number(search.arrow) : 1
    const operationId = search.opId
    let data = await paging.largeListQuery(
      VerifaceIdentify,
      query,
      { time: -1 },
      next,
      operationId,
      'createdAt_-1_similar_-1_isdefense_-1'
    )
    return data.results
  } catch (err) {
    handleSysException(err)
  }
}

exports.alarmStatictisCount = async ctx => {
  const query = alarmQueryParamHandle(ctx)
  const count = await VerifaceIdentify.countDocuments(query)
  ctx.body = count
}
/**
 * 路人检索导出(包含图片)
 * @param {*} ctx
 */
exports.strangerExportData = async ctx => {
  try {
    const limit = ctx.query.page.limit
    // 如果有tag标签，表示界面是以图搜图结果导出
    const tag = ctx.query.tag
    const redirect = ctx.query.redirect
    let result = await passbyList(ctx, limit)
    if (tag && redirect) {
      result = await getImgByImg(ctx, limit, 'redirect')
    } else if (tag) {
      result = await getImgByImg(ctx, limit)
    }
    const wb = new xl.Workbook()
    const ws = wb.addWorksheet('路人检索记录')
    const myStyle = wb.createStyle({
      font: {
        bold: true
      },
      alignment: {
        wrapText: true,
        horizontal: 'center'
      }
    })
    let count = 5
    if (tag) {
      count = 6
    }
    for (let i = 1; i <= count; i++) {
      ws.column(i).setWidth(25)
    }
    ws.cell(1, 1)
      .string('抓拍图片')
      .style(myStyle)
    ws.cell(1, 2)
      .string('抓拍时间')
      .style(myStyle)
    ws.cell(1, 3)
      .string('抓拍位置')
      .style(myStyle)
    ws.cell(1, 4)
      .string('年龄')
      .style(myStyle)
    ws.cell(1, 5)
      .string('性别')
      .style(myStyle)
    if (tag) {
      ws.cell(1, 6)
        .string('相似度')
        .style(myStyle)
    }
    for (let i = 0; i < result.length; i++) {
      let j = i + 2
      ws.row(j).setHeight(120)
      ws.cell(j, 2)
        .string(moment(result[i].time * 1000).format('YYYY-MM-DD HH:mm:ss'))
        .style(myStyle)
      ws.cell(j, 3)
        .string(result[i].resName)
        .style(myStyle)
      ws.cell(j, 4)
        .string(result[i].age + '')
        .style(myStyle)
      let gender = '未知'
      if (result[i].gender === '2') {
        gender = '男'
      } else if (result[i].gender === '1') {
        gender = '女'
      }
      ws.cell(j, 5)
        .string(gender)
        .style(myStyle)
      if (tag) {
        ws.cell(j, 6)
          .string(result[i].similar + '')
          .style(myStyle)
      }
      const imgArr = result[i].faceImage.split('/')
      const imgName = imgArr.pop()
      const imgDate = imgArr.pop()
      const imgPath = `${config.fileDirs.facePasserPictureDir}/${imgDate}/${imgName}`
      // 剪切图片为固定大小
      const imgBuff = await resizeImg(fs.readFileSync(imgPath), { width: 150, height: 150 })
      ws.addImage({
        image: imgBuff,
        type: 'picture',
        position: {
          type: 'oneCellAnchor',
          from: {
            col: 1,
            colOff: '.1mm',
            row: j,
            rowOff: '.1mm'
          }
        }
      })
    }
    const buffer = await wb.writeToBuffer()
    const timeStr = moment().format('YYYYMMDD HHmmss')
    let fileName = `路人条件检索记录导出${timeStr}.xlsx`
    if (tag) {
      fileName = `路人以图搜图检索记录导出${timeStr}.xlsx`
    }
    ctx.type = 'application/vnd-openxmlformats'
    ctx.attachment(fileName)
    ctx.body = buffer
  } catch (err) {
    handleSysException(err)
  }
}

exports.alarmExportData = async ctx => {
  try {
    const limit = ctx.query.page.limit
    const result = await AlarmList(ctx, limit)
    const wb = new xl.Workbook()
    const ws = wb.addWorksheet('报警检索记录')
    const myStyle = wb.createStyle({
      font: {
        bold: true
      },
      alignment: {
        wrapText: true,
        horizontal: 'center'
      }
    })
    for (let i = 1; i <= 8; i++) {
      ws.column(i).setWidth(25)
    }
    ws.cell(1, 1)
      .string('抓拍图片')
      .style(myStyle)
    ws.cell(1, 2)
      .string('底库图片')
      .style(myStyle)
    ws.cell(1, 3)
      .string('报警时间')
      .style(myStyle)
    ws.cell(1, 4)
      .string('抓拍位置')
      .style(myStyle)
    ws.cell(1, 5)
      .string('相似度')
      .style(myStyle)
    ws.cell(1, 6)
      .string('底库名称')
      .style(myStyle)
    ws.cell(1, 7)
      .string('姓名')
      .style(myStyle)
    ws.cell(1, 8)
      .string('性别')
      .style(myStyle)

    for (let i = 0; i < result.length; i++) {
      let j = i + 2
      ws.row(j).setHeight(120)
      ws.cell(j, 3)
        .string(moment(result[i].time * 1000).format('YYYY-MM-DD HH:mm:ss'))
        .style(myStyle)
      ws.cell(j, 4)
        .string(result[i].resName)
        .style(myStyle)
      ws.cell(j, 5)
        .string(result[i].similar + '')
        .style(myStyle)
      ws.cell(j, 6)
        .string(result[i].groupName)
        .style(myStyle)
      ws.cell(j, 7)
        .string(result[i].userName)
        .style(myStyle)
      let gender = '未知'
      if (result[i].gender === '2') {
        gender = '男'
      } else if (result[i].gender === '1') {
        gender = '女'
      }
      ws.cell(j, 8)
        .string(gender)
        .style(myStyle)
      const imgArr = result[i].faceImage.split('/')
      const imgName = imgArr.pop()
      const imgDate = imgArr.pop()
      const passbyImgPath = `${config.fileDirs.facePasserPictureDir}/${imgDate}/${imgName}`
      // 剪切图片为固定大小
      const passbyImgBuff = await resizeImg(fs.readFileSync(passbyImgPath), { width: 150, height: 150 })
      ws.addImage({
        image: passbyImgBuff,
        type: 'picture',
        position: {
          type: 'oneCellAnchor',
          from: {
            col: 1,
            colOff: '.1mm',
            row: j,
            rowOff: '.1mm'
          }
        }
      })
      const userImgPath = `${config.fileDirs.faceUserPictureDir}/${result[i].userImage.split('/').pop()}`
      // 剪切图片为固定大小
      const userImgBuff = await resizeImg(fs.readFileSync(userImgPath), { width: 150, height: 150 })
      ws.addImage({
        image: userImgBuff,
        type: 'picture',
        position: {
          type: 'oneCellAnchor',
          from: {
            col: 2,
            colOff: '.1mm',
            row: j,
            rowOff: '.1mm'
          }
        }
      })
    }
    const buffer = await wb.writeToBuffer()
    const time = moment().format('YYYY-MM-DD')
    ctx.type = 'application/vnd-openxmlformats'
    ctx.attachment('报警记录导出' + time + '.xlsx'.toString('utf-8'))
    ctx.body = buffer
  } catch (err) {
    handleSysException(err)
  }
}

/**
 * 定时任务每小时59分30秒写一次数据
 */
exports.add = async () => {
  try {
    const date = moment()
    const lastHourTime = Number(moment(moment(date).subtract(1, 'h')).format('X')) // 上一小时时间戳
    const staticsData = {
      time: Number(date.format('X')),
      hour: date.hours() + 1,
      date: Number(moment(date.format('YYYYMMDD')).format('X'))
    }
    const [passbyCount, defenseCount, groups, passbyRes, defenseRes] = await Promise.all([
      VerifaceIdentify.countDocuments({ time: { $gte: lastHourTime } }),
      VerifaceIdentify.countDocuments({ time: { $gte: lastHourTime }, isdefense: true }),
      VerifaceIdentify.aggregate([
        {
          $match: {
            time: { $gte: lastHourTime }
          }
        },
        { $group: { _id: { group: '$group', name: '$groupName' }, total: { $sum: 1 } } },
        { $project: { id: '$_id.group', name: '$_id.name', count: '$total', _id: 0 } }
      ]),
      VerifaceIdentify.aggregate([
        {
          $match: {
            time: { $gte: lastHourTime }
          }
        },
        { $group: { _id: { res: '$res', name: '$resName' }, total: { $sum: 1 } } },
        { $project: { id: '$_id.res', name: '$_id.name', passbyCount: '$total', _id: 0 } }
      ]),
      VerifaceIdentify.aggregate([
        {
          $match: {
            time: { $gte: lastHourTime },
            isdefense: true
          }
        },
        { $group: { _id: { res: '$res', name: '$resName' }, total: { $sum: 1 } } },
        { $project: { id: '$_id.res', name: '$_id.name', defenseCount: '$total', _id: 0 } }
      ])
    ])
    for (let i in passbyRes) {
      for (let j in defenseRes) {
        if (passbyRes[i].name === defenseRes[j].name) {
          passbyRes[i].defenseCount = defenseRes[j].defenseCount
        }
      }
    }
    staticsData.passbyCount = passbyCount
    staticsData.defenseCount = defenseCount
    staticsData.groups = groups
    staticsData.res = passbyRes
    await VerifaceStatistics.create(staticsData)
  } catch (err) {
    throw err
  }
}
/**
 * 获取今日统计数据
 */
exports.today = async ctx => {
  try {
    const todayDate = new Date().setHours(0, 0, 0, 0) / 1000
    const todayStatistics = await VerifaceStatistics.find({ date: todayDate })
      .lean()
      .exec() // 获取当天所有的统计数据(每小时统计一条数据)
    const nowHour = new Date().getHours() // 当前小时
    const todayResult = dealStatistic(todayStatistics, nowHour)
    ctx.body = todayResult
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 处理今日统计数据
 * @param {*} statistics
 * @param {*} hour
 */
const dealStatistic = (statistics, nowHour) => {
  try {
    const initArr = new Array(nowHour).fill(0)
    for (let i in initArr) {
      initArr[i] = { hour: Number(i) + 1, count: 0 }
    }

    statistics = _.uniqBy(statistics, 'hour')
    statistics.sort((a, b) => {
      return a.hour - b.hour // 按照hour字段升序排序
    })
    let passbyData = [] // 路人识别数量
    // 报警数量
    let alarmData = []

    statistics.forEach(item => {
      const passbyObj = { hour: item.hour, count: item.passbyCount }
      const alarmObj = { hour: item.hour, count: item.defenseCount }
      passbyData.push(passbyObj)
      alarmData.push(alarmObj)
    })
    passbyData = _.concat(passbyData, initArr)
    passbyData = _.uniqBy(passbyData, 'hour')
    alarmData = _.concat(alarmData, initArr)
    alarmData = _.uniqBy(alarmData, 'hour')
    passbyData.sort((a, b) => {
      return a.hour - b.hour
    })
    alarmData.sort((a, b) => {
      return a.hour - b.hour
    })
    return { passbyData, alarmData }
  } catch (err) {
    throw err
  }
}
/**
 *  实时数据每隔10s向前端推送一次
 */
// setInterval(() => {
//   todaySocket()
// }, 10000)
/**
 * 获取今日数据推送【路人识别总量，布控报警数量，查询已经布控人员数量，已分配的人脸相机，在线人脸相机】
 */
exports.todaySocket = async () => {
  try {
    const earlyTime = moment().format('YYYY-MM-DD') // 当日日期
    const passbyCount = await VerifaceIdentify.countDocuments({ dateTime: earlyTime }) // 路人识别总量
    const alarmCount = await VerifaceIdentify.countDocuments({ isdefense: true, dateTime: earlyTime }) // 布控报警数量
    const userCount = await VeriUser.countDocuments({}) // 已经布控人员数量
    const faceServer = await FaceServer.find().lean()
    let resIds = []
    if (!_.isEmpty(faceServer)) {
      faceServer.forEach(item => {
        if (!_.isEmpty(item.res)) {
          const resourceIds = item.res.map(item => item + '')
          resIds = resIds.concat(resourceIds)
        }
      })
    }
    const faceRes = await Resource.find({ _id: { $in: resIds } }, 'ip').lean()
    const faceResCount = faceRes.length // 绑定sdk服务器的人脸相机数量
    const onlineRes = await devOnlineList() // 查询在线视频通道
    const resIps = faceRes.map(item => item.ip)
    let onlineResIps = []
    if (!_.isEmpty(onlineRes.devOnlineList)) {
      onlineResIps = onlineRes.devOnlineList.map(item => item.devIp)
    }
    const onlineFaceResources = resIps.filter(item => onlineResIps && onlineResIps.includes(item))
    const onlineFaceRes = onlineFaceResources.length //  在线人脸相机

    const data = { passbyCount, alarmCount, userCount, faceResCount, onlineFaceRes }
    // require('../veriface.socket').sendMsg('p', data)
    // require('../veriface.socket').sendMsg('verifaceToday', data)
    socket.verifaceToday(data)
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 统计分析
 * @param {} ctx
 */
exports.analysis = async ctx => {
  try {
    const data = await analysisData(ctx)
    ctx.body = data
  } catch (err) {
    handleSysException(err)
  }
}
/**
 * 构建统计数据
 * @param {*} ctx
 */
const analysisData = async ctx => {
  try {
    const startTime = Number(ctx.query.startTime)
    const endTime = Number(ctx.query.endTime)
    const query = { date: { $gte: startTime, $lte: endTime } }
    let points = ctx.query.points
    if (points) {
      points = points.split(',')
    }
    const data = await VerifaceStatistics.find(query)
      .sort({ time: 1 })
      .lean()
    const days = (endTime - startTime) / (24 * 60 * 60) + 1 // 根据时间计算天数
    const passbyData = []
    const alarmData = []
    for (let i = 0; i < days; i++) {
      const dayData = data.filter(item => item.date === startTime + i * 24 * 60 * 60)
      let date = startTime + i * 24 * 60 * 60
      let passbyCount = 0
      let alarmCount = 0
      if (_.isEmpty(points) && !_.isEmpty(dayData)) {
        dayData.forEach(item => {
          passbyCount = passbyCount + (item.passbyCount || 0)
          alarmCount = alarmCount + (item.defenseCount || 0)
        })
      } else if (!_.isEmpty(points) && !_.isEmpty(dayData)) {
        dayData.forEach(item => {
          if (!_.isEmpty(item.res)) {
            // 用点位过滤每一条数据
            const resData = item.res.filter(element => points.includes(element.id))
            if (!_.isEmpty(resData)) {
              resData.forEach(element => {
                passbyCount = passbyCount + (element.passbyCount || 0)
                alarmCount = alarmCount + (element.defenseCount || 0)
              })
            }
          }
        })
      }
      const passbyObj = {
        date: date,
        count: passbyCount
      }
      const alarmObj = {
        date: date,
        count: alarmCount
      }
      passbyData.push(passbyObj)
      alarmData.push(alarmObj)
    }
    return { passbyData, alarmData }
  } catch (err) {
    throw err
  }
}
/**
 * 统计分析导出
 * @param {*} ctx
 */
exports.analysisExport = async ctx => {
  try {
    const result = await analysisData(ctx)
    const data = [['日期', '路人识别量', '布控报警量']]
    result.passbyData.forEach((item, i) => {
      const row = []
      row.push(moment(item.date * 1000).format('YYYY-MM-DD'))
      row.push(item.count)
      row.push(result.alarmData[i].count)
      data.push(row)
    })
    const colInfos = [{ width: 15 }, { width: 15 }, { width: 15 }]
    const option = { '!cols': colInfos }
    const buffer = xlsx.build([{ name: '统计分析', data }], option)
    ctx.type = 'application/vnd.openxmlformats'
    const time = moment().format('YYYY-MM-DD')
    ctx.attachment('统计分析' + time + '.xlsx'.toString('utf-8'))
    ctx.body = buffer
  } catch (err) {
    handleSysException(err)
  }
}
