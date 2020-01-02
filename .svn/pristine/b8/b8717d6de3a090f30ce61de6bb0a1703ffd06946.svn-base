// let { devLog, recordLog, serverLog } = require('./model.base')
/*
 * bstar数据库操作
 * @Author: lushengying
 * @Date: 2018-08-29 10:54:45
 * @Last Modified by: linhang
 * @Last Modified time: 2019-07-15 14:33:32
 */

let { getDevLogModel, getRecordLogModel, getServerLogModel, getRecordPlanLogModel } = require('./model.base')
const _ = require('lodash')
const Device = require('mongoose').model('Device')
const Record = require('mongoose').model('Record')
const paging = require('../../paging')
const OperationLog = require('mongoose').model('OperationLog')
const moment = require('moment')
const { getServer } = require('../../bstar/server.interface')
const util = require('../../../common/protobuf.util')
const command = require('../../../common/command')

/**
 * 计算设备在线率及离线时长
 */
exports.devState = async devList => {
  const devLog = await getDevLogModel()
  const thisDate = moment().format('X') * 1
  const startDate =
    moment()
      .startOf('day')
      .format('X') * 1
  let devIps = _.map(devList, item => {
    return item.ip
  })
  // 获取当前ip今日日志信息
  let devGroup = await devLog.aggregate([
    {
      $match: {
        ip: { $in: devIps },
        createTime: { $gte: startDate },
        status: { $in: [1, 2] }
      }
    },
    {
      $group: {
        _id: '$ip',
        log: { $push: { createTime: '$createTime', status: '$status' } }
      }
    }
  ])
  const thisTimeStr = thisDate - startDate
  // 根据当日信息计算在线情况，如无当日信息则按设备当前状态
  const redevDatas = devList.map(dev => {
    let devObj = dev.toObject()
    let filterLog = devGroup.filter(item => item._id === devObj.ip)[0]
    if (_.isEmpty(filterLog)) {
      if (devObj.status) {
        devObj.OnLine = thisTimeStr
        devObj.OffLine = 0
        devObj.onlineRate = '100%'
      } else {
        devObj.OnLine = 0
        devObj.OffLine = thisTimeStr
        devObj.onlineRate = '0%'
      }
      return devObj
    } else {
      // 创建起点数据
      let DevStatus = {
        createTime: filterLog.log[0].createTime,
        ip: filterLog.log[0].ip,
        logStatus: filterLog.log[0].status,
        onlineRate: 0
      }
      // 如无当天记录,对起点数据重新赋值并返回
      if (filterLog.log[0].createTime <= startDate) {
        if (DevStatus.logStatus === 1) {
          DevStatus.OnLine = thisDate - startDate
          DevStatus.OffLine = 0
          DevStatus.onlineRate = '100%'
        } else {
          DevStatus.OffLine = thisDate - startDate
          DevStatus.OnLine = 0
          DevStatus.onlineRate = '0%'
        }
        return DevStatus
      }
      // 计算当前时间到起点时间数据
      if (filterLog.log[0].status === 1) {
        DevStatus.OnLine = thisDate - filterLog.log[0].createTime
        DevStatus.OffLine = 0
      } else {
        DevStatus.OnLine = 0
        DevStatus.OffLine = thisDate - filterLog.log[0].createTime
      }
      // 仅一条记录 不参与多条统计
      if (filterLog.log.length === 1) {
        DevStatus.OffLine += DevStatus.createTime - startDate
      }
      //  多条 统计当天记录
      for (let i = 1; i < filterLog.log.length; i++) {
        if (filterLog.log[i].status === 1) {
          // 已计算完成
          if (filterLog.log[i].createTime <= startDate) {
            DevStatus.OnLine += DevStatus.createTime - startDate
            DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
            return DevStatus
          }
          // 遍历到最后一条时，计算未记录时间
          if (i === filterLog.log.length - 1) {
            DevStatus.OffLine += DevStatus.createTime - startDate
          }
          DevStatus.OnLine += DevStatus.createTime - filterLog.log[i].createTime
          DevStatus.logStatus = filterLog.log[i].status
          DevStatus.createTime = filterLog.log[i].createTime
        } else {
          if (filterLog.log[i].createTime <= startDate) {
            DevStatus.OffLine += DevStatus.createTime - startDate
            DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
            return DevStatus
          }
          // 遍历到最后一条时，计算未记录时间
          if (i === filterLog.log.length - 1) {
            DevStatus.OffLine += DevStatus.createTime - startDate
          }
          DevStatus.OffLine += DevStatus.createTime - filterLog.log[i].createTime
          DevStatus.logStatus = filterLog.log[i].status
          DevStatus.createTime = filterLog.log[i].createTime
        }
      }
      devObj.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
      devObj.OnLine = DevStatus.OnLine
      devObj.OffLine = DevStatus.OffLine
      return devObj
    }
  })
  return redevDatas
}

exports.devStateReal = async devList => {
  const devLog = await getDevLogModel()
  const thisDate = moment().format('X') * 1
  const startDate =
    moment()
      .startOf('day')
      .format('X') * 1
  let devIps = _.map(devList, item => {
    return item.ip
  })

  let lastTimeIPs = await devLog.aggregate([
    {
      $match: {
        ip: { $in: devIps },
        createTime: { $lte: startDate },
        status: { $ne: 3 }
      }
    },
    {
      $group: {
        _id: '$ip',
        createTime: { $max: '$createTime' }
      }
    }
  ])

  // 获取当前页设备所有日志按IP分组
  let devGroup = await Promise.all(
    lastTimeIPs.map(item => {
      return devLog
        .find({ ip: item._id, createTime: { $gte: item.createTime }, status: { $ne: 3 } }, 'ip status createTime')
        .lean()
        .sort({ createTime: -1 })
        .exec()
    })
  )
  let OnLines = devGroup.map(arr => {
    if (_.isArray(arr) && !_.isEmpty(arr)) {
      // 创建起点数据
      let DevStatus = {
        createTime: arr[0].createTime,
        ip: arr[0].ip,
        logStatus: arr[0].status,
        onlineRate: 0
      }
      // 如无当天记录,对起点数据重新赋值并返回
      if (arr[0].createTime <= startDate) {
        if (DevStatus.logStatus === 1) {
          DevStatus.OnLine = thisDate - startDate
          DevStatus.OffLine = 0
          DevStatus.onlineRate = '100%'
        } else {
          DevStatus.OffLine = thisDate - startDate
          DevStatus.OnLine = 0
          DevStatus.onlineRate = '0%'
        }
        return DevStatus
      }
      // 计算当前时间到起点时间数据
      if (arr[0].status === 1) {
        DevStatus.OnLine = thisDate - arr[0].createTime
        DevStatus.OffLine = 0
      } else {
        DevStatus.OnLine = 0
        DevStatus.OffLine = thisDate - arr[0].createTime
      }
      // 仅一条记录 不参与多条统计
      if (arr.length === 1) {
        DevStatus.OffLine += DevStatus.createTime - startDate
      }
      //  多条 统计当天记录
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].status === 1) {
          // 已计算完成
          if (arr[i].createTime <= startDate) {
            DevStatus.OnLine += DevStatus.createTime - startDate
            DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
            return DevStatus
          }
          // 遍历到最后一条时，计算未记录时间
          if (i === arr.length - 1) {
            DevStatus.OffLine += DevStatus.createTime - startDate
          }
          DevStatus.OnLine += DevStatus.createTime - arr[i].createTime
          DevStatus.logStatus = arr[i].status
          DevStatus.createTime = arr[i].createTime
        } else {
          if (arr[i].createTime <= startDate) {
            DevStatus.OffLine += DevStatus.createTime - startDate
            DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
            return DevStatus
          }
          // 遍历到最后一条时，计算未记录时间
          if (i === arr.length - 1) {
            DevStatus.OffLine += DevStatus.createTime - startDate
          }
          DevStatus.OffLine += DevStatus.createTime - arr[i].createTime
          DevStatus.logStatus = arr[i].status
          DevStatus.createTime = arr[i].createTime
        }
      }

      DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
      return DevStatus
    } else {
      return {
        OnLine: '-',
        OffLine: '-',
        onlineRate: '-',
        ip: arr[0].ip
      }
    }
  })
  let redevList = devList.map(item => {
    return item.toObject()
  })
  // 合并设备及在线信息
  redevList.map(dev => {
    OnLines.map(line => {
      if (line.ip === dev.ip) {
        return _.merge(dev, line)
      }
    })
  })
  return redevList
}
/**
 * 获取在线服务器列表
 */
exports.serverState = async ctx => {
  // 获取服务端的在线服务程序。如返回所有在线的DA信息。DS信息.TS 信息。
  // serverName值为 da:获取所有DA信息。ds:获取所有ds信息。ts:获取所有ts信息
  const serverName = ['da', 'ds', 'ts']
  const ser = await Promise.all(
    serverName.map(item => {
      return getServer(ctx, item)
    })
  )
  return ser
}

/**
 * 获取平台服务器总数
 */
exports.serverSum = async ctx => {
  const serverLog = await getServerLogModel()
  const sum = await serverLog.aggregate([
    {
      $group: {
        _id: { ip: '$ip', serverType: '$serverType' }
      }
    }
  ])
  return sum.length
}
/**
 * 获取平台服务列表
 */
exports.serviceState = async ctx => {
  const limit = ctx.query.page.limit || 10
  const page = ((+ctx.query.page.page || 1) - 1) * limit
  const status = parseInt(ctx.query.status)
  // 查询是否在线
  // serverName值为 da:获取所有DA信息。ds:获取所有ds信息。ts:获取所有ts信息
  const serverName = ['da', 'ds', 'ts']
  let data = []
  await Promise.all(
    serverName.map(async item => {
      data.push(await getServer(ctx, item))
    })
  )
  const onliService = _.flattenDeep(data)
  if (status) {
    // 获取在线服务列表
    if (status === 1) {
      _.merge(ctx.query.search, {
        name: { $in: onliService }
      })
    } else {
      _.merge(ctx.query.search, {
        name: { $nin: onliService }
      })
    }
  }
  const thisDate = moment().format('X') * 1
  const startDate =
    moment()
      .startOf('day')
      .format('X') * 1
  // 定于查询条件
  const find = {
    createTime: { $lte: startDate },
    $and: [ctx.query.search],
    $or: [
      {
        ip: { $regex: ctx.query.seek + '' || '' }
      },
      {
        name: { $regex: ctx.query.seek + '' || '' }
      }
    ]
  }
  delete ctx.query.search.status
  delete ctx.query.search.seek
  delete ctx.query.search.bigtype
  delete ctx.query.search.oid

  // 数据整合 通过ip和服务器类型进行分组
  const serverLog = await getServerLogModel()
  const [serviceData, count] = await Promise.all([
    serverLog.aggregate([
      { $match: find },
      {
        $group: {
          _id: { ip: '$ip', serverType: '$serverType' },
          name: { $last: '$name' },
          createTime: { $max: '$createTime' }
          // status: { $push: { status: '$status', createTime: '$createTime' } }
        }
      },
      { $skip: page },
      { $limit: +limit }
    ]),
    serverLog.aggregate([
      { $match: find },
      {
        $group: {
          _id: { ip: '$ip', serverType: '$serverType' },
          name: { $last: '$name' },
          status: { $push: { status: '$status', createTime: '$createTime' } }
        }
      }
    ])
  ])
  let OnLines = await Promise.all(
    serviceData.map(async item => {
      const logList = await serverLog.find(
        { ip: item._id.ip, serverType: item._id.serverType, createTime: { $gte: item.createTime } },
        'ip status createTime'
      )
      let DevStatus = {
        ip: item._id.ip,
        name: item.name,
        serverType: item._id.serverType,
        lastTime: logList[0].createTime,
        logStatus: logList[0].status,
        onlineRate: 0,
        OnLine: 0,
        OffLine: 0,
        status: 0
      }
      let check = onliService.filter(name => {
        return name === item.name
      })
      if (check.length > 0) {
        DevStatus.status = 1
      }
      // 当最后记录时间为昨天数据。
      if (logList[0].createTime <= startDate) {
        if (DevStatus.logStatus === 1) {
          DevStatus.OnLine = thisDate - startDate
          DevStatus.OffLine = 0
          DevStatus.onlineRate = '100%'
        } else {
          DevStatus.OffLine = thisDate - startDate
          DevStatus.OnLine = 0
          DevStatus.onlineRate = '0%'
        }
        return DevStatus
      }
      if (logList[0].status === 1) {
        DevStatus.OnLine = thisDate - logList[0].createTime * 1
        DevStatus.OffLine = 0
      } else {
        DevStatus.OnLine = 0
        DevStatus.OffLine = thisDate - logList[0].createTime
      }
      // 仅一条记录 不参与多条统计
      if (logList.length === 1) {
        DevStatus.OffLine += DevStatus.lastTime - startDate
      }
      // 多条记录 统计当天记录
      for (let i = 1, logLength = logList.length; i < logLength; i++) {
        if (logList[i].createTime === 1) {
          if (logList[i].createTime <= startDate) {
            DevStatus.OnLine += DevStatus.lastTime - startDate
            DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
            return DevStatus
          }
          // 遍历到最后一条时，计算未记录时间
          if (i === logList.length - 1) {
            DevStatus.OffLine += DevStatus.lastTime - startDate
          }
          DevStatus.OnLine += DevStatus.lastTime - logList[i].createTime
          DevStatus.logStatus = logList[i].status
          DevStatus.lastTime = logList[i].createTime
        } else {
          if (logList[i].createTime <= startDate) {
            DevStatus.OffLine += DevStatus.lastTime - startDate
            DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
            return DevStatus
          }
          // 遍历到最后一条时，计算未记录时间
          if (i === logList.length - 1) {
            DevStatus.OffLine += DevStatus.lastTime - startDate
          }
          DevStatus.OffLine += DevStatus.lastTime - logList[i].createTime
          DevStatus.logStatus = logList[i].status
          DevStatus.lastTime = logList[i].createTime
        }
      }
      DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
      return DevStatus
    })
  )
  ctx.set({
    'X-BSC-COUNT': count.length,
    'X-BSC-PAGES': Math.ceil(count.length / limit),
    'X-BSC-CUR': parseInt(page),
    'X-BSC-LIMIT': parseInt(limit)
  })
  return OnLines
}

exports.serviceStateReal = async ctx => {
  const limit = ctx.query.page.limit || 10
  const page = ((+ctx.query.page.page || 1) - 1) * limit
  const status = parseInt(ctx.query.status)
  // 查询是否在线
  // serverName值为 da:获取所有DA信息。ds:获取所有ds信息。ts:获取所有ts信息
  const serverName = ['da', 'ds', 'ts']
  let data = []
  await Promise.all(
    serverName.map(async item => {
      data.push(await getServer(ctx, item))
    })
  )
  const onliService = _.flattenDeep(data)
  if (status) {
    // 获取在线服务列表
    if (status === 1) {
      _.merge(ctx.query.search, {
        name: { $in: onliService }
      })
    } else {
      _.merge(ctx.query.search, {
        name: { $nin: onliService }
      })
    }
  }
  // 定于查询条件
  const find = {
    $and: [ctx.query.search],
    $or: [
      {
        ip: { $regex: ctx.query.seek + '' || '' }
      },
      {
        name: { $regex: ctx.query.seek + '' || '' }
      }
    ]
  }
  delete ctx.query.search.status
  delete ctx.query.search.seek
  delete ctx.query.search.bigtype
  delete ctx.query.search.oid

  // 数据整合 通过ip和服务器类型进行分组
  const serverLog = await getServerLogModel()
  const [serviceData, count] = await Promise.all([
    serverLog.aggregate([
      { $match: find },
      { $sort: { createTime: -1 } },
      {
        $group: {
          _id: { ip: '$ip', serverType: '$serverType' },
          name: { $last: '$name' },
          status: { $push: { status: '$status', createTime: '$createTime' } }
        }
      },
      { $skip: page },
      { $limit: +limit }
    ]),
    serverLog.aggregate([
      { $match: find },
      {
        $group: {
          _id: { ip: '$ip', serverType: '$serverType' },
          name: { $last: '$name' },
          status: { $push: { status: '$status', createTime: '$createTime' } }
        }
      }
    ])
  ])
  const thisDate = moment().format('X') * 1
  const startDate =
    moment()
      .startOf('day')
      .format('X') * 1
  let OnLines = serviceData.map(item => {
    let DevStatus = {
      ip: item._id.ip,
      name: item.name,
      serverType: item._id.serverType,
      lastTime: item.status[0].createTime,
      logStatus: item.status[0].status,
      onlineRate: 0,
      OnLine: 0,
      OffLine: 0,
      status: 0
    }
    let check = onliService.filter(name => {
      return name === item.name
    })
    if (check.length > 0) {
      DevStatus.status = 1
    }
    // 当最后记录时间为昨天数据。

    if (item.status[0].createTime <= startDate) {
      if (DevStatus.logStatus === 1) {
        DevStatus.OnLine = thisDate - startDate
        DevStatus.OffLine = 0
        DevStatus.onlineRate = '100%'
      } else {
        DevStatus.OffLine = thisDate - startDate
        DevStatus.OnLine = 0
        DevStatus.onlineRate = '0%'
      }
      return DevStatus
    }
    if (item.status[0].status === 1) {
      DevStatus.OnLine = thisDate - item.status[0].createTime * 1
      DevStatus.OffLine = 0
    } else {
      DevStatus.OnLine = 0
      DevStatus.OffLine = thisDate - item.status[0].createTime
    }
    // 仅一条记录 不参与多条统计
    if (item.status.length === 1) {
      DevStatus.OffLine += DevStatus.lastTime - startDate
    }
    // 多条记录 统计当天记录
    for (let i = 1; i < item.status.length; i++) {
      if (item.status[i].createTime === 1) {
        if (item.status[i].createTime <= startDate) {
          DevStatus.OnLine += DevStatus.lastTime - startDate
          DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
          return DevStatus
        }
        // 遍历到最后一条时，计算未记录时间
        if (i === item.status.length - 1) {
          DevStatus.OffLine += DevStatus.lastTime - startDate
        }
        DevStatus.OnLine += DevStatus.lastTime - item.status[i].createTime
        DevStatus.logStatus = item.status[i].status
        DevStatus.lastTime = item.status[i].createTime
      } else {
        if (item.status[i].createTime <= startDate) {
          DevStatus.OffLine += DevStatus.lastTime - startDate
          DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
          return DevStatus
        }
        // 遍历到最后一条时，计算未记录时间
        if (i === item.status.length - 1) {
          DevStatus.OffLine += DevStatus.lastTime - startDate
        }
        DevStatus.OffLine += DevStatus.lastTime - item.status[i].createTime
        DevStatus.logStatus = item.status[i].status
        DevStatus.lastTime = item.status[i].createTime
      }
    }
    DevStatus.onlineRate = GetPercent(DevStatus.OnLine, thisDate - startDate)
    return DevStatus
  })
  ctx.set({
    'X-BSC-COUNT': count.length,
    'X-BSC-PAGES': Math.ceil(count.length / limit),
    'X-BSC-CUR': parseInt(page),
    'X-BSC-LIMIT': parseInt(limit)
  })
  return OnLines
}
/**
 * 获取平台服务器表格导出数据
 */
exports.serviceExport = async ctx => {
  const status = parseInt(ctx.query.status)
  // 查询是否在线
  // serverName值为 da:获取所有DA信息。ds:获取所有ds信息。ts:获取所有ts信息
  const serverName = ['da', 'ds', 'ts']
  let data = []
  await Promise.all(
    serverName.map(async item => {
      data.push(await getServer(ctx, item))
    })
  )
  const onliService = _.flattenDeep(data)
  if (status) {
    // 获取在线服务列表
    if (status === 1) {
      _.merge(ctx.query.search, {
        name: { $in: onliService }
      })
    } else {
      _.merge(ctx.query.search, {
        name: { $nin: onliService }
      })
    }
  }
  // 定于查询条件
  const find = {
    $and: [ctx.query.search],
    $or: [
      {
        ip: { $regex: ctx.query.seek + '' || '' }
      },
      {
        name: { $regex: ctx.query.seek + '' || '' }
      }
    ]
  }
  delete ctx.query.search.status
  delete ctx.query.search.seek
  delete ctx.query.search.bigtype
  delete ctx.query.search.oid

  // 数据整合 通过ip和服务器类型进行分组
  const serverLog = await getServerLogModel()
  const serviceData = await serverLog.aggregate([
    { $match: find },
    { $sort: { createTime: -1 } },
    {
      $group: {
        _id: { ip: '$ip', serverType: '$serverType' },
        name: { $last: '$name' }
        // status: { $push: { status: '$status', createTime: '$createTime' } }
      }
    }
  ])
  let OnLines = serviceData.map(item => {
    let DevStatus = {
      ip: item._id.ip,
      name: item.name,
      serverType: item._id.serverType,
      lastTime: item.status[0].createTime,
      logStatus: item.status[0].status,
      onlineRate: 0,
      OnLine: 0,
      OffLine: 0,
      status: 0
    }
    return DevStatus
  })
  return OnLines
}

/**
 * 更新设备在线率异常状态
 */
exports.syncOnlineRateList = async () => {
  const devLog = await getDevLogModel()
  const startDate = moment()
    .startOf('day')
    .format('X')
  // 获取所有设备IP
  let DevData = await Device.find({ bigtype: { $in: [0, 1, 5, 7] } }, '_id ip')
    .lean()
    .exec()
  if (!_.isEmpty(DevData) && _.isArray(DevData)) {
    const onLine = []
    const OffLine = []
    const Stateless = []
    await Promise.all(
      DevData.map(async item => {
        // 查看设备日志
        let log = await devLog
          .find({ ip: item.ip, status: { $ne: 3 } })
          .lean()
          .sort({ createTime: -1 })
          .exec()
        if (_.isArray(log) && !_.isEmpty(log)) {
          if (log[0].createTime < startDate) {
            if (log[0].status === 1) {
              onLine.push(log[0].ip)
            } else {
              OffLine.push(log[0].ip)
            }
          } else {
            // 新创建设备
            if (log[log.length - 1].createTime > startDate) {
              OffLine.push(log[0].ip + '')
              return
            }
            for (let index = 0; index < log.length; index++) {
              if (log[index].createTime < startDate) {
                break
              }
              if (log[index].status === 2) {
                OffLine.push(log[0].ip + '')
                return
              }
            }
            onLine.push(log[0].ip + '')
          }
        } else {
          Stateless.push(item.ip + '')
        }
      })
    )

    if (_.isArray(onLine) && !_.isEmpty(onLine)) {
      await Device.updateMany({ ip: { $in: onLine } }, { OnlineRateStatus: 1 }, { multi: true })
    }
    if (_.isArray(OffLine) && !_.isEmpty(OffLine)) {
      await Device.updateMany({ ip: { $in: OffLine } }, { OnlineRateStatus: 2 }, { multi: true })
    }
    if (_.isArray(Stateless) && !_.isEmpty(Stateless)) {
      await Device.updateMany({ ip: { $in: Stateless } }, { OnlineRateStatus: 3 }, { multi: true })
    }
  }
}

/**
 * 视频设备录像完整率及录像时长
 */
exports.syncVideoStatus = async data => {
  const recordLog = await getRecordLogModel()
  const startDate =
    moment()
      .startOf('day')
      .format('X') * 1
  const thisDate = moment().format('X') * 1

  let reData = await Promise.all(
    data.map(async item => {
      // 判断当日使用模板
      const int = parseInt(moment().weekday())
      let recordData = []
      // 是否配置模板
      if (_.at(item, [`planTemplateId.elements[${int}].timeList[0]`])) {
        const beginTime = item.planTemplateId.elements[int].timeList[0].beginTime * 1
        const endTime = item.planTemplateId.elements[int].timeList[0].endTime * 1
        const startTempTime = beginTime + startDate // 模板开始时间
        const endTempTime = endTime + startDate // 模板结束时间
        recordData = await recordLog
          .find({
            ip: item.resource.ip,
            channel: item.resource.chan,
            createTime: {
              $gte: startTempTime * 1
            }
          })
          .sort({ createTime: 1 })
        if (_.isArray(recordData) && !_.isEmpty(recordData)) {
          // 创建起点数据
          let recordStauts = {
            status: recordData[0].status,
            createTime: recordData[0].createTime,
            videoTime: 0,
            noVideoTime: 0
          }
          //  计算起始未录时间
          if (recordData[0].createTime > startTempTime) {
            recordStauts.noVideoTime = recordData[0].createTime - startTempTime
          }
          for (let i = 1; i < recordData.length; i++) {
            if (recordStauts.status === 1) {
              recordStauts.status = recordData[i].status
              recordStauts.videoTime += recordData[i].createTime - recordStauts.createTime
              recordStauts.createTime = recordData[i].createTime
            } else {
              recordStauts.status = recordData[i].status
              recordStauts.noVideoTime += recordData[i].createTime - recordStauts.createTime
              recordStauts.createTime = recordData[i].createTime
            }
          }
          // 录像结束
          if (recordStauts.createTime >= endTempTime) {
            // 录像末尾结束成功 计算模板结束时间
            if (recordStauts.status === 2 || recordStauts.status === 1) {
              recordStauts.videoTime += endTempTime - recordStauts.createTime
            } else {
              recordStauts.noVideoTime += endTempTime - recordStauts.createTime
            }
            // 录像未结束
          } else {
            if (recordStauts.status === 1) {
              recordStauts.videoTime += thisDate - recordStauts.createTime
            } else {
              recordStauts.noVideoTime += thisDate - recordStauts.createTime
            }
          }
          return {
            resourceid: item.resource._id,
            name: item.resource.name,
            ip: item.resource.ip,
            channel: item.resource.chan,
            status: item.resource.status,
            lastTime: recordStauts.createTime,
            videoTime: recordStauts.videoTime,
            noVideoTime: recordStauts.noVideoTime,
            videoRate: GetPercent(recordStauts.videoTime, endTime - beginTime),
            thisDate: thisDate,
            temp: 1,
            startTempTime: startTempTime,
            endTempTime: endTempTime
          }
        } else {
          return {
            resourceid: item.resource._id,
            name: item.resource.name,
            ip: item.resource.ip,
            channel: item.resource.chan,
            status: item.resource.status,
            lastTime: '--',
            videoTime: '--',
            noVideoTime: '--',
            videoRate: '--',
            thisDate: thisDate,
            temp: 1,
            startTempTime: startTempTime,
            endTempTime: endTempTime
          }
        }
      } else {
        return {
          resourceid: item.resource._id,
          name: item.resource.name,
          ip: item.resource.ip,
          channel: item.resource.chan,
          status: item.resource.status,
          lastTime: '--',
          videoTime: '--',
          noVideoTime: '--',
          videoRate: '--',
          thisDate: thisDate,
          temp: 0
        }
      }
    })
  )
  // 获取正在录像列表，添加正在录像状态
  const isVideoList = await getIsVideo()
  reData.map(item => {
    const check = isVideoList.filter(o => {
      return o.devIp === item.ip && o.channel === item.channel
    })
    if (check.length > 0) {
      item.isVideo = 1
    } else {
      item.isVideo = 0
    }
  })
  return reData
}

exports.syncVideoStatusFeke = async data => {
  const devLog = await getDevLogModel()
  const thisDate = moment().format('X') * 1
  const startDate =
    moment()
      .startOf('day')
      .format('X') * 1
  const ONEDAYTIME = 86400
  let devIps = _.map(data, item => {
    return item.resource.ip
  })
  let lastTimeIPs = await devLog.aggregate([
    {
      $match: {
        ip: { $in: devIps },
        createTime: { $lte: startDate },
        status: { $in: [1, 2] }
      }
    },
    {
      $group: {
        _id: '$ip',
        createTime: { $max: '$createTime' }
      }
    }
  ])
  // 获取当前页设备所有日志按IP分组
  let devGroup = await Promise.all(
    lastTimeIPs.map(async item => {
      let devDate = await devLog
        .find({ ip: item._id, createTime: { $gte: item.createTime }, status: { $in: [1, 2] } })
        .lean()
        .sort({ createTime: -1 })
        .exec()
      let videoTime = await OperationLog.aggregate([
        { $match: { ip: item._id, LogType: 1 } },
        {
          $group: { _id: { ip: '$ip', port: '$port' }, videoTime: { $sum: '$offLine' }, number: { $sum: 1 } }
        }
      ])
      let time = 0
      if (_.isArray(videoTime)) {
        videoTime.map(video => {
          if (video._id.ip === item) {
            time = videoTime[0].number * ONEDAYTIME - videoTime[0].videoTime
          }
        })
      }
      return {
        ip: item,
        logs: devDate,
        videoTime: time
      }
    })
  )
  const isOnLine = 1
  let onLines = devGroup.map(arr => {
    if (_.isArray(arr.logs) && !_.isEmpty(arr.logs)) {
      // 创建起点数据
      let devStatus = {
        createTime: arr.logs[0].createTime,
        ip: arr.logs[0].ip,
        logStatus: arr.logs[0].status,
        onlineRate: 0,
        videoTime: arr.videoTime,
        port: arr.logs[0].port,
        onLine: 0
      }
      // 如无当天记录,对起点数据重新赋值并返回
      if (arr.logs[0].createTime <= startDate) {
        if (devStatus.logStatus === isOnLine) {
          devStatus.onLine = thisDate - startDate
          devStatus.offLine = 0
          devStatus.onLineRate = '100%'
        } else {
          devStatus.offLine = thisDate - startDate
          devStatus.onLine = 0
          devStatus.onLineRate = '0%'
        }
        return devStatus
      }
      // 计算当前时间到起点时间数据
      if (arr.logs[0].status === isOnLine) {
        devStatus.onLine = thisDate - arr.logs[0].createTime
        devStatus.offLine = 0
      } else {
        devStatus.onLine = 0
        devStatus.offLine = thisDate - arr.logs[0].createTime
      }
      // 仅一条记录 不参与多条统计
      if (arr.logs.length === 1) {
        devStatus.offLine += devStatus.createTime - startDate
      }
      //  多条 统计当天记录
      for (let i = 1; i < arr.logs.length; i++) {
        if (arr.logs[i].status === isOnLine) {
          // 已计算完成
          if (arr.logs[i].createTime <= startDate) {
            devStatus.onLine += devStatus.createTime - startDate
            devStatus.onLineRate = GetPercent(devStatus.onLine, thisDate - startDate)
            return devStatus
          }
          // 遍历到最后一条时，计算未记录时间
          if (i === arr.logs.length - 1) {
            devStatus.offLine += devStatus.createTime - startDate
          }
          devStatus.onLine += devStatus.createTime - arr.logs[i].createTime
          devStatus.logStatus = arr.logs[i].status
          devStatus.createTime = arr.logs[i].createTime
        } else {
          if (arr.logs[i].createTime <= startDate) {
            devStatus.offLine += devStatus.createTime - startDate
            devStatus.onLineRate = GetPercent(devStatus.onLine, thisDate - startDate)
            return devStatus
          }
          // 遍历到最后一条时，计算未记录时间
          if (i === arr.logs.length - 1) {
            devStatus.offLine += devStatus.createTime - startDate
          }
          devStatus.offLine += devStatus.createTime - arr.logs[i].createTime
          devStatus.logStatus = arr.logs[i].status
          devStatus.createTime = arr.logs[i].createTime
        }
      }

      devStatus.onLineRate = GetPercent(devStatus.onLine, thisDate - startDate)
      return devStatus
    } else {
      return {
        OnLine: '-',
        offLine: '-',
        onlineRate: '-',
        ip: arr.ip
      }
    }
  })
  const reData = []
  for (let i = 0, dataLength = data.length; i < dataLength; i++) {
    let obj = {
      resourceid: data[i]._id,
      name: data[i].resource.name,
      ip: data[i].resource.ip,
      channel: data[i].resource.chan,
      status: data[i].resource.status,
      noVideoTime: 0,
      port: data[i].resource.port || 0, // 记录无端口
      temp: 0,
      startTempTime: 0,
      endTempTime: 0,
      state: data[i].resource.status,
      lastTime: '-',
      videoTime: 0,
      videoRate: '-',
      thisDate: '--'
    }
    for (let k = 0, onLinesLength = onLines.length; k < onLinesLength; k++) {
      if (onLines[k].ip === data[i].resource.ip && onLines[k].port === data[i].resource.port) {
        obj.lastTime = onLines[k].createTime
        obj.videoTime = onLines[k].videoTime + onLines[k].onLine
        obj.videoRate = onLines[k].onLineRate
      }
    }
    reData.push(obj)
  }
  return reData
}

exports.syncVideoStatusReal = async data => {
  const thisDate = moment().format('X') * 1
  const startDate =
    moment()
      .startOf('day')
      .format('X') * 1
  const ONEDAYTIME = 86400
  let devIps = _.map(data, item => {
    return item.resource.ip
  })

  // 获取当前页设备所有日志按IP分组
  const devLog = await getDevLogModel()
  let devGroup = await Promise.all(
    devIps.map(async item => {
      let devDate = await devLog
        .find({ ip: item, status: { $ne: 3 } })
        .lean()
        .sort({ createTime: -1 })
        .exec()
      let videoTime = await OperationLog.aggregate([
        { $match: { ip: item, LogType: 1 } },
        {
          $group: { _id: { ip: '$ip', port: '$port' }, videoTime: { $sum: '$offLine' }, number: { $sum: 1 } }
        }
      ])
      let time = 0
      if (_.isArray(videoTime)) {
        videoTime.map(video => {
          if (video._id.ip === item) {
            time = videoTime[0].number * ONEDAYTIME - videoTime[0].videoTime
          }
        })
      }
      return {
        ip: item,
        logs: devDate,
        videoTime: time
      }
    })
  )
  const isOnLine = 1
  let onLines = devGroup.map(arr => {
    if (_.isArray(arr.logs) && !_.isEmpty(arr.logs)) {
      // 创建起点数据
      let devStatus = {
        createTime: arr.logs[0].createTime,
        ip: arr.logs[0].ip,
        logStatus: arr.logs[0].status,
        onlineRate: 0,
        videoTime: arr.videoTime,
        port: arr.logs[0].port,
        onLine: 0
      }
      // 如无当天记录,对起点数据重新赋值并返回
      if (arr.logs[0].createTime <= startDate) {
        if (devStatus.logStatus === isOnLine) {
          devStatus.onLine = thisDate - startDate
          devStatus.offLine = 0
          devStatus.onLineRate = '100%'
        } else {
          devStatus.offLine = thisDate - startDate
          devStatus.onLine = 0
          devStatus.onLineRate = '0%'
        }
        return devStatus
      }
      // 计算当前时间到起点时间数据
      if (arr.logs[0].status === isOnLine) {
        devStatus.onLine = thisDate - arr.logs[0].createTime
        devStatus.offLine = 0
      } else {
        devStatus.onLine = 0
        devStatus.offLine = thisDate - arr.logs[0].createTime
      }
      // 仅一条记录 不参与多条统计
      if (arr.logs.length === 1) {
        devStatus.offLine += devStatus.createTime - startDate
      }
      //  多条 统计当天记录
      for (let i = 1; i < arr.logs.length; i++) {
        if (arr.logs[i].status === isOnLine) {
          // 已计算完成
          if (arr.logs[i].createTime <= startDate) {
            devStatus.onLine += devStatus.createTime - startDate
            devStatus.onLineRate = GetPercent(devStatus.onLine, thisDate - startDate)
            return devStatus
          }
          // 遍历到最后一条时，计算未记录时间
          if (i === arr.logs.length - 1) {
            devStatus.offLine += devStatus.createTime - startDate
          }
          devStatus.onLine += devStatus.createTime - arr.logs[i].createTime
          devStatus.logStatus = arr.logs[i].status
          devStatus.createTime = arr.logs[i].createTime
        } else {
          if (arr.logs[i].createTime <= startDate) {
            devStatus.offLine += devStatus.createTime - startDate
            devStatus.onLineRate = GetPercent(devStatus.onLine, thisDate - startDate)
            return devStatus
          }
          // 遍历到最后一条时，计算未记录时间
          if (i === arr.logs.length - 1) {
            devStatus.offLine += devStatus.createTime - startDate
          }
          devStatus.offLine += devStatus.createTime - arr.logs[i].createTime
          devStatus.logStatus = arr.logs[i].status
          devStatus.createTime = arr.logs[i].createTime
        }
      }

      devStatus.onLineRate = GetPercent(devStatus.onLine, thisDate - startDate)
      return devStatus
    } else {
      return {
        OnLine: '-',
        offLine: '-',
        onlineRate: '-',
        ip: arr.ip
      }
    }
  })
  const reData = []
  for (let i = 0, dataLength = data.length; i < dataLength; i++) {
    let obj = {
      resourceid: data[i]._id,
      name: data[i].resource.name,
      ip: data[i].resource.ip,
      channel: data[i].resource.chan,
      status: data[i].resource.status,
      noVideoTime: 0,
      port: data[i].resource.port || 0, // 记录无端口
      temp: 0,
      startTempTime: 0,
      endTempTime: 0,
      state: data[i].resource.status,
      lastTime: '-',
      videoTime: 0,
      videoRate: '-',
      thisDate: '--'
    }
    for (let k = 0, onLinesLength = onLines.length; k < onLinesLength; k++) {
      if (onLines[k].ip === data[i].resource.ip && onLines[k].port === data[i].resource.port) {
        obj.lastTime = onLines[k].createTime
        obj.videoTime = onLines[k].videoTime + onLines[k].onLine
        obj.videoRate = onLines[k].onLineRate
      }
    }
    reData.push(obj)
  }
  return reData
}
/**
 * 更新录像在线异常状态
 */
exports.syncVideoRateList = async () => {
  const recordLog = await getRecordLogModel()
  const startDate = moment()
    .startOf('day')
    .format('X')
  // 获取所有设备IP
  let recordData = await Record.find(
    {
      takeType: 'timeVideo',
      enable: 'enable'
    },
    '_id takeType enable streamType planTemplateId resource'
  )
    .populate([
      {
        path: 'resource',
        select: '_id name chan ip port status'
      },
      {
        path: 'planTemplateId',
        select: '_id name elements'
      }
    ])
    .lean()
    .exec()

  if (!_.isEmpty(recordData) && _.isArray(recordData)) {
    const onLine = []
    const OffLine = []
    const Stateless = []
    await Promise.all(
      recordData.map(async item => {
        // 查看设备日志
        const int = parseInt(moment().weekday()) - 1
        if (item.planTemplateId && item.planTemplateId.elements[int] && item.planTemplateId.elements[int].timeList[0]) {
          let beginTime = item.planTemplateId.elements[int].timeList[0].beginTime * 1
          let endTime = item.planTemplateId.elements[int].timeList[0].endTime * 1
          let startTempTime = beginTime + startDate // 模板开始时间
          let EndTempTime = endTime + startDate // 模板结束时间
          let log = await recordLog
            .find({
              ip: item.ip,
              channel: item.chan,
              createTime: {
                $gte: startTempTime,
                $lte: EndTempTime
              }
            })
            .lean()
            .sort({ createTime: -1 })
            .exec()
          //  对所查询到的数据进行完整率异常检测 异常情况为 1：status等于2时不为结束点 2:status不等于1或2
          if (_.isArray(log) && !_.isEmpty(log)) {
            let status = log.filter((item, index, logf) => {
              return (item.status === 2 && index !== logf.length - 1) || (item.status !== 2 && item.status !== 1)
            })
            if (status) {
              OffLine.push(item._id + '')
            } else {
              onLine.push(item._id + '')
            }
          } else {
            Stateless.push(item._id + '')
          }
        } else {
          Stateless.push(item._id + '')
        }
      })
    )

    if (_.isArray(onLine) && !_.isEmpty(onLine)) {
      await Record.updateMany({ _id: { $in: onLine } }, { RateStatus: 1 }, { multi: true })
    }
    if (_.isArray(OffLine) && !_.isEmpty(OffLine)) {
      await Record.updateMany({ _id: { $in: OffLine } }, { RateStatus: 2 }, { multi: true })
    }
    if (_.isArray(Stateless) && !_.isEmpty(Stateless)) {
      await Record.updateMany({ _id: { $in: Stateless } }, { RateStatus: 3 }, { multi: true })
    }
  }
}
/**
 * 创建每日Log
 */
exports.createLog = async () => {
  try {
    createDevLog() // 设备日志
    // createRecordLog() // 录像日志
    createServerLog() // 服务器日志
  } catch (error) {}
}

// createDevLog() // 设备日志
// // createRecordLog() // 录像日志
// createServerLog() // 服务器日志

// 创建前一天设备日志
async function createDevLog () {
  const ONEDAYTIME = 86400 // 一天时间(秒)
  const yeDayEnd =
    Number(
      moment()
        .startOf('day')
        .format('X')
    ) - 1 // 昨日结束时间
  const yeDayStart = Number(
    moment(moment().startOf('day'))
      .subtract(1, 'days')
      .format('X')
  ) // 昨天开始时间
  const beDayStart = Number(
    moment(moment().startOf('day'))
      .subtract(2, 'days')
      .format('X')
  ) // 前天开始时间
  // 按IP+通道进行分组
  const devLog = await getDevLogModel()
  const devLogData = await devLog.aggregate([
    {
      $group: {
        _id: { ip: '$ip', port: '$port' }
      }
    }
  ])
  // 将需统计当天记录合并,并添加当天开始时间及结束时间。
  devLogData.map(async item => {
    // 获取当天是否生成记录及最后统计时间
    const [check, lastTime] = await Promise.all([
      OperationLog.findOne({
        LogType: 1,
        ip: item._id.ip,
        port: item._id.port,
        createTime: yeDayStart
      })
        .lean()
        .exec(),
      OperationLog.findOne(
        {
          LogType: 1,
          ip: item._id.ip,
          port: item._id.port,
          createTime: beDayStart
        },
        'lastTime'
      )
        .lean()
        .exec()
    ])
    if (_.isEmpty(check)) {
      const lTime = _.get(lastTime, 'lastTime', 0)
      const devResult = await devLog
        .find(
          {
            ip: item._id.ip,
            port: item._id.port,
            createTime: { $gte: lTime, $lte: yeDayEnd },
            status: { $in: [1, 2] }
          },
          'status createTime'
        )
        .sort({ createTime: -1 })
        .exec()
      if (!_.isEmpty(devResult)) {
        // 数据对象
        let obj = {
          // ID: item.ID,
          ip: item._id.ip,
          port: item._id.port,
          LogType: 1,
          Log: [],
          offLine: 0,
          createTime: yeDayStart,
          lastTime: devResult[0].createTime || 0
        }
        // 全部记录仅一条,判断是否为昨天范围内,如是一条记录则数据为固定数据
        if (devResult.length === 1 || devResult[0].createTime <= yeDayStart) {
          if (devResult[0].createTime <= yeDayEnd && devResult[0].createTime >= yeDayStart) {
            if (devResult[0].status === 2) {
              obj.Log = [
                {
                  time: yeDayEnd,
                  type: 2
                },
                {
                  time: yeDayStart,
                  type: 2
                }
              ]
            } else {
              obj.Log = [
                {
                  time: yeDayEnd,
                  type: devResult[0].status
                },
                {
                  time: devResult[0].createTime,
                  type: devResult[0].status
                },
                {
                  time: yeDayStart,
                  type: devResult[0].createTime === yeDayStart ? devResult[0].status : 2
                }
              ]
            }
            obj.offLine = devResult[0].status === 1 ? 0 : yeDayEnd - devResult[0].createTime
          } else {
            obj.Log = [
              {
                time: yeDayEnd,
                type: devResult[0].status
              },
              {
                time: yeDayStart,
                type: devResult[0].status
              }
            ]
            obj.offLine = devResult[0].status === 1 ? 0 : ONEDAYTIME
          }
        } else {
          if (devResult[0].createTime !== yeDayEnd) {
            obj.Log.push({
              time: yeDayEnd,
              type: devResult[0].status
            })
          }
          for (let i = 0; i < devResult.length; i++) {
            // 昨天时间范围内
            if (devResult[i].createTime > yeDayStart) {
              obj.Log.push({
                time: devResult[i].createTime,
                type: devResult[i].status
              })
              // 未超出范围循环已结束 添加元素
              if (i === devResult.length - 1 && devResult[i].createTime !== yeDayStart) {
                if (devResult[i].status !== 2) {
                  obj.Log.push({
                    time: yeDayStart,
                    type: 2
                  })
                } else {
                  obj.Log[obj.Log.length - 1].time = yeDayStart
                }
              }
            } else {
              // 超出时间范围
              // 添加yeDayStart
              if (devResult[i].status !== obj.Log[obj.Log.length - 1].type) {
                obj.Log.push({
                  time: yeDayStart,
                  type: devResult[i].status
                })
              } else {
                obj.Log[obj.Log.length - 1].time = yeDayStart
              }
              break
            }
          }
          // 统计离线时长
          for (let i = 0; i < obj.Log.length; i++) {
            if ((i < obj.Log.length - 1 || (obj.Log.length === 2 && i !== 1)) && obj.Log[i + 1].type === 2) {
              obj.offLine += obj.Log[i].time - obj.Log[i + 1].time
            }
          }
        }
        const operLog = new OperationLog(obj)
        operLog.save()
      }
    }
  })
}
//  创建前一天录像日志
// async function createRecordLog() {
//   const yeDateEn =
//     moment()
//       .startOf('day')
//       .format('X') * 1
//   const yeDateStart =
//     moment(moment().startOf('day'))
//       .subtract(1, 'days')
//       .format('X') * 1
//   const YeDateString = moment(moment().startOf('day'))
//     .subtract(1, 'days')
//     .format('YYYY/MM/DD')
//   let recordData = await recordLog
//     .find({ createTime: { $lte: yeDateEn, $gte: yeDateStart } })
//     .lean()
//     .sort({ createTime: 1 })
//     .exec()
//   //  对全部日志进行ip:channel分组
//   recordData = _(recordData)
//     .groupBy(item => {
//       return item.ip + ':' + item.channel
//     })
//     .map((items, id) => {
//       return { ID: id, logs: items }
//     })
//     .value()
//   recordData.map(async item => {
//     //  查询日志信息
//     let check = await OperationLog.findOne({
//       ip: item.logs[0].ip,
//       createTime: yeDateStart,
//       channel: item.logs[0].channel,
//       LogType: 2
//     })
//       .lean()
//       .exec()

//     if (_.isEmpty(check)) {
//       // 查询当天使用模板
//       let Plan = await recordPlanLog
//         .findOne({
//           ip: item.logs[0].ip,
//           channel: item.logs[0].channel,
//           createDate: YeDateString
//         })
//         .lean()
//         .exec()
//       if (!_.isEmpty(Plan)) {
//         let obj = {
//           // ID: item.ID,
//           ip: item.logs[0].ip,
//           port: item.logs[0].port,
//           channel: item.logs[0].channel,
//           LogType: 2,
//           Log: [],
//           RateStatus: 3, // 1:录像完整 2:录像缺失 3:记录缺失
//           createTime: yeDateStart
//         }
//         let week = parseInt(moment(yeDateStart).weekday())
//         // 模板开始时间及结束时间
//         let planBegin = Plan.elements[week].timeList[0].beginTime + yeDateStart
//         let planEnd = Plan.elements[week].timeList[0].endTime + yeDateStart
//         for (let i = 0; i < item.logs.length; i++) {
//           // 判断是否为模板时间内，超出时结束
//           if (item.logs[i].createTime >= planBegin && item.logs[i].createTime <= planEnd) {
//             // 第一个添加的Log将作为起点
//             if (obj.Log.length === 0) {
//               obj.Log.push({
//                 time: item.logs[i].createTime,
//                 type: item.logs[i].status
//               })
//             } else {
//               // 是否于上一记录状态相同
//               if (obj.Log[obj.Log.length - 1].type === item.logs[i].status && i !== 1) {
//                 obj.Log[obj.Log.length - 1].time = item.logs[i].createTime
//               } else {
//                 obj.Log.push({
//                   time: item.logs[i].createTime,
//                   type: item.logs[i].status
//                 })
//               }
//             }
//             const statusType = [1, 2, 3, 4, 5] // 1:正在录像 2:录像停止 3:录像缺失 4:视频流中断 5:存储写入失败
//             const RateStatus = [1, 2, 3] // 1:录像完整 2:录像缺失 3:记录缺失
//             // 添加完整率
//             if (obj.RateStatus === RateStatus[0] || obj.RateStatus === RateStatus[2]) {
//               // 当Status等于2时
//               if (item.logs[i].status === statusType[1]) {
//                 if (item.logs[i].createTime === planEnd) {
//                   obj.RateStatus = RateStatus[0]
//                 } else {
//                   obj.RateStatus = RateStatus[1]
//                 }
//               } else if (item.logs[i].status !== statusType[0] && item.logs[i].status !== statusType[1]) {
//                 obj.RateStatus = RateStatus[1]
//               }
//             }
//           }
//           // 超出模板时间
//           if (item.logs[i].createTime < planBegin) {
//             break
//           }
//         }
//         // 对开始及结束进行检测是否有未被检测
//         if (obj.Log[0] && obj.Log[0].time !== planBegin) {
//           if (obj.Log[0].type !== 1) {
//             obj.Log[0].time = planBegin
//           } else {
//             let arr = [
//               {
//                 time: planBegin,
//                 type: 2
//               }
//             ]
//             arr.concat(arr, obj.Log)
//             obj.Log = arr
//           }
//         }
//         if (obj.Log[obj.Log.length - 1] && obj.Log[obj.Log.length - 1].time !== planEnd) {
//           obj.Log.push({
//             time: planEnd,
//             type: 2
//           })
//         }
//         const operLog = new OperationLog(obj)
//         operLog.save()
//       }
//     }
//   })
// }

//  创建前一天平台服务日志
async function createServerLog () {
  const ONEDAYTIME = 86400 // 一天时间(秒)
  const yeDayEnd =
    Number(
      moment()
        .startOf('day')
        .format('X')
    ) - 1 // 昨日结束时间
  const yeDayStart = Number(
    moment(moment().startOf('day'))
      .subtract(1, 'days')
      .format('X')
  ) // 昨天开始时间
  const beDayStart = Number(
    moment(moment().startOf('day'))
      .subtract(2, 'days')
      .format('X')
  ) // 前天开始时间
  // 对平台服务进行分组
  const serverLog = await getServerLogModel()
  const serLogData = await serverLog
    .aggregate([
      { $match: { createTime: { $lte: yeDayEnd } } },
      {
        $group: {
          _id: { ip: '$ip', serverType: '$serverType' }
        }
      }
    ])
    .exec()
  // 对分组后的数组进行 整合统计
  serLogData.map(async item => {
    // 判断是否已有创建记录
    const [check, lastTime] = await Promise.all([
      OperationLog.find({
        LogType: 3,
        ip: item._id.ip,
        createTime: yeDayStart,
        type: item._id.serverType
      })
        .lean()
        .exec(),
      OperationLog.findOne(
        {
          LogType: 3,
          ip: item._id.ip,
          createTime: beDayStart,
          type: item._id.serverType
        },
        'lastTime'
      )
        .lean()
        .exec()
    ])

    if (_.isEmpty(check)) {
      // 起点数据
      const lTime = _.get(lastTime, 'lastTime', 0)
      const serverResult = await serverLog
        .find(
          {
            ip: item._id.ip,
            serverType: item._id.serverType,
            createTime: { $gte: lTime, $lte: yeDayEnd },
            status: { $in: [1, 2] }
          },
          'status createTime'
        )
        .sort({ createTime: -1 })
        .exec()
      if (!_.isEmpty(serverResult)) {
        let obj = {
          // ID: item.ID,
          ip: item._id.ip,
          type: item._id.serverType,
          LogType: 3,
          Log: [],
          createTime: yeDayStart,
          lastTime: serverResult[0].lastTime || 0,
          offLine: 0
        }
        // 全部记录仅一条,判断是否为昨天范围内,如是一条记录则数据为固定数据
        if (serverResult.length === 1 || serverResult[0].createTime <= yeDayStart) {
          if (serverResult[0].createTime <= yeDayEnd && serverResult[0].createTime >= yeDayStart) {
            if (serverResult[0].status === 2) {
              obj.Log = [
                {
                  time: yeDayEnd,
                  type: 2
                },
                {
                  time: yeDayStart,
                  type: 2
                }
              ]
            } else {
              obj.Log = [
                {
                  time: yeDayEnd,
                  type: serverResult[0].status
                },
                {
                  time: serverResult[0].createTime,
                  type: serverResult[0].status
                },
                {
                  time: yeDayStart,
                  type: serverResult[0].createTime === yeDayStart ? serverResult[0].status : 2
                }
              ]
            }
            obj.offLine = serverResult[0].status === 1 ? 0 : yeDayEnd - serverResult[0].createTime
          } else {
            obj.Log = [
              {
                time: yeDayEnd,
                type: serverResult[0].status
              },
              {
                time: yeDayStart,
                type: serverResult[0].status
              }
            ]
            obj.offLine = serverResult[0].status === 1 ? 0 : ONEDAYTIME
          }
        } else {
          if (serverResult[0].createTime !== yeDayEnd) {
            obj.Log.push({
              time: yeDayEnd,
              type: serverResult[0].status
            })
          }
          for (let i = 0; i < serverResult.length; i++) {
            // 昨天时间范围内
            if (serverResult[i].createTime > yeDayStart) {
              obj.Log.push({
                time: serverResult[i].createTime,
                type: serverResult[i].status
              })
              // 未超出范围循环已结束 添加元素
              if (i === serverResult.length - 1 && serverResult[i].createTime !== yeDayStart) {
                if (serverResult[i].status !== 2) {
                  obj.Log.push({
                    time: yeDayStart,
                    type: 2
                  })
                } else {
                  obj.Log[obj.Log.length - 1].time = yeDayStart
                }
              }
            } else {
              // 超出时间范围
              // 添加yeDayStart
              if (serverResult[i].status !== obj.Log[obj.Log.length - 1].type) {
                obj.Log.push({
                  time: yeDayStart,
                  type: serverResult[i].status
                })
              } else {
                obj.Log[obj.Log.length - 1].time = yeDayStart
              }
              break
            }
          }
          // 统计离线时长
          for (let i = 0; i < obj.Log.length; i++) {
            if ((i < obj.Log.length - 1 || (obj.Log.length === 2 && i !== 1)) && obj.Log[i + 1].type === 2) {
              obj.offLine += obj.Log[i].time - obj.Log[i + 1].time
            }
          }
        }
        const operLog = new OperationLog(obj)
        operLog.save()
      }
    }
  })
}

// 获取日志信息
exports.ALLLog = async ctx => {
  const devLog = await getDevLogModel()
  const recordLog = await getRecordLogModel()
  const serverLog = await getServerLogModel()
  const LogType = [1, 2, 3, 4, 5, 1, 2] // 日志类型type 对应不同log表中的type字段
  const schemaType = [devLog, recordLog, serverLog] // 设备日志,录像日志,平台服务日志
  const typeNum = parseInt(ctx.query.search.type)
  let schemaNum
  // 选定所使用schema
  switch (typeNum) {
    case 0:
    case 1:
      schemaNum = 0
      break
    case 2:
    case 3:
    case 4:
      schemaNum = 1
      break
    case 5:
    case 6:
      schemaNum = 2
      break
    default:
      ctx.throw(500, { code: 2001, message: '参数非法' })
  }
  // 日志类型
  const LogTypeString = [
    '设备上线',
    '设备离线',
    // '开始录像',
    // '停止录像',
    '录像缺失',
    '视频流中断',
    '存储写入失败',
    '服务上线',
    '服务离线'
  ]
  let select = {
    status: '',
    createTime: ''
  }

  if (typeNum) {
    select.status = LogType[typeNum]
  } else {
    delete select.status
  }
  // 添加查询条件
  if (!_.isEmpty(ctx.query.seek)) {
    ctx.query.seek = ctx.query.seek.replace(/\./g, '\\.')
    select.$or = [{ name: { $regex: ctx.query.seek } }, { ip: { $regex: ctx.query.seek } }]
  }
  // 添加查询条件
  if (ctx.query.search.start && ctx.query.search.end) {
    select.createTime = {
      $gte: ctx.query.search.start * 1,
      $lte: ctx.query.search.end * 1
    }
  } else {
    delete select.createTime
  }

  const resultObj = await paging.listQuery(
    schemaType[schemaNum],
    select,
    '_id name port ip manufactuer type  orgs createTime channel status serverType',
    { createTime: -1 },
    ctx.query.page,
    '',
    ctx
  )
  const serverTypeString = [
    '存储服务器',
    '转发服务器',
    '接入服务器',
    '计划任务服务',
    '事件服务',
    '通知服务',
    '中心管理服务',
    '对讲服务器',
    '登陆服务器',
    'web服务器',
    '中间件服务器'
  ]
  resultObj.results = JSON.parse(JSON.stringify(resultObj.results))
  return resultObj.results.map(item => {
    return {
      _id: item._id,
      name: item.name,
      port: item.port,
      ip: item.ip,
      orgs: item.orgs,
      manufactuer: item.manufactuer,
      type: item.type || serverTypeString[item.serverType - 1],
      createTime: item.createTime,
      channel: item.channel,
      status: LogTypeString[typeNum]
    }
  })
}

// 日志信息导出
exports.ALLLogExport = async ctx => {
  const devLog = await getDevLogModel()
  const recordLog = await getRecordLogModel()
  const serverLog = await getServerLogModel()
  const LogType = [1, 2, 3, 4, 5, 1, 2] // 日志类型type 对应不同log表中的type字段
  const schemaType = [devLog, recordLog, serverLog] // 设备日志,录像日志,平台服务日志
  const typeNum = parseInt(ctx.query.search.type)
  let schemaNum = 0
  // 选定所使用schema
  switch (typeNum) {
    case 0:
    case 1:
      schemaNum = 0
      break
    case 2:
    case 3:
    case 4:
      schemaNum = 1
      break
    case 5:
    case 6:
      schemaNum = 2
      break
    default:
      ctx.throw(500, { code: 2001, message: '参数非法' })
  }
  // 日志类型
  const LogTypeString = [
    '设备上线',
    '设备离线',
    // '开始录像',
    // '停止录像',
    '录像缺失',
    '视频流中断',
    '存储写入失败',
    '服务上线',
    '服务离线'
  ]
  let select = {
    status: '',
    createTime: ''
  }
  if (typeNum) {
    select.status = LogType[typeNum]
  } else {
    delete select.status
  }
  // 添加查询条件
  if (!_.isEmpty(ctx.query.seek)) {
    ctx.query.seek = ctx.query.seek.replace(/\./g, '\\.')
    select.$or = [{ name: { $regex: ctx.query.seek } }, { ip: { $regex: ctx.query.seek } }]
  }
  if (ctx.query.search.start && ctx.query.search.end) {
    select.createTime = {
      $gte: ctx.query.search.start * 1,
      $lte: ctx.query.search.end * 1
    }
  } else {
    delete select.createTime
  }
  // 查询结果
  const results = await schemaType[schemaNum]
    .find(select, '_id name port ip manufactuer type  orgs createTime channel status serverType')
    .sort({ createTime: -1 })
    .exec()
  const serverTypeString = [
    '存储服务器',
    '转发服务器',
    '接入服务器',
    '计划任务服务',
    '事件服务',
    '通知服务',
    '中心管理服务',
    '对讲服务器',
    '登陆服务器',
    'web服务器',
    '中间件服务器'
  ]
  // 数据处理
  return results.map(item => {
    return {
      _id: item._id,
      name: item.name,
      port: item.port,
      ip: item.ip,
      orgs: item.orgs,
      manufactuer: item.manufactuer,
      type: item.type || serverTypeString[item.serverType - 1],
      createTime: moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss'),
      channel: item.channel,
      status: LogTypeString[typeNum]
    }
  })
}

// 获取正在录像视频信息
async function getIsVideo () {
  const basePro = util.baseProto('QueryRecordInfoClient2MA')
  const structPro = util.getProtoMsg(basePro, 'AllRecordInfoReq')
  const payload = {}
  const bufReq = util.encode(structPro, payload)
  const result = await util.tcp(bufReq, command.VMR_COMMAND_RECORD_GET_ALL)
  if (result.code === 0) {
    const res = util.getProtoMsg(basePro, 'AllRecordInfoRes')
    const raw = util.decode(res, result.message)
    const list = []
    // 解析数据
    if (raw && raw.serverInfo) {
      raw.serverInfo.forEach(element => {
        if (element.streamInfo) {
          list.push(element.streamInfo)
        }
      })
    }
    return _.flattenDeep(list)
  } else {
    return []
  }
}

//  率计算
function GetPercent (num, total) {
  num = parseFloat(num)
  total = parseFloat(total)
  if (isNaN(num) || isNaN(total)) {
    return '--'
  }
  return total <= 0 ? '0%' : `${((num / total) * 100).toFixed(2)}%`
}
