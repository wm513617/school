/*
 * @Author: litao
 * @Date: 2019-06-27 11:55:13
 * @Last Modified time: 2019-07-05 13:13:40
 * 该模块主要提供对机动车的添加、删除、修改、查询功能
 * -----------------------------README-----------------------------
 * create()   添加机动车信息
 * update()   修改机动车信息
 * destroy()  删除机动车信息(可根据ID单个或者批量删除) 在删除数据的同时会删除数据所对应的文件
 * list()     查询所有符合条件的机动车信息
 * show()     机动车信息详情
 * schedule() 自动任务，每天凌晨将会被调用，判断车辆信息是否在有效期之内
 * clearSchedule() 自动任务，每天自动清理超过配置日期之前的过车记录以及磁盘文件
 */

'use strict'
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')
const moment = require('moment')

const Motorvehicle = mongoose.model('motorvehicle')
const PeopleVehicle = mongoose.model('peoplevehicle')
const PassVehicle = mongoose.model('passvehicle')
const Verificationscore = mongoose.model('verificationscore')

const { handleSysException } = require('../../../../../common/tools')
const config = require('../../../../../../config').backend
const paging = require('../../../../paging')

const create = async ctx => {
  try {
    const data = ctx.request.body
    const { plateNo } = data

    const motorvehicleInfo = await Motorvehicle.findOne({ plateNo })

    if (motorvehicleInfo) {
      ctx.status = 400
      ctx.body = {
        success: false,
        messgae: '车牌号码不能重复'
      }
      return
    }
    stateExpiredCheck(data)
    await Motorvehicle.create(data)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

const stateExpiredCheck = data => {
  const timer = Number(moment(moment().format('YYYY-MM-DD')).format('X'))
  if (data.startTime <= timer && timer <= data.endTime) {
    data.state = 0
  } else {
    data.state = 1
  }
}

const update = async ctx => {
  try {
    const id = ctx.params.id
    const data = ctx.request.body
    stateExpiredCheck(data)
    await Motorvehicle.update({ _id: id }, data).exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

const destroy = async ctx => {
  try {
    const ids = ctx.params.ids.split(',')

    const infos = await Motorvehicle.find({ _id: { $in: ids } }, 'driverPic1 driverPic2  driverPic3').lean()
    let unlinks = []
    if (infos) {
      infos.forEach(item => {
        const { driverPic1, driverPic2, driverPic3 } = item

        const baseNamePic1 = (driverPic1 && path.basename(driverPic1)) || null
        const baseNamePic2 = (driverPic2 && path.basename(driverPic2)) || null
        const baseNamePic3 = (driverPic3 && path.basename(driverPic3)) || null

        baseNamePic1 && unlinks.push(path.join(config.fileDirs.motorDriverPicDir, `/${baseNamePic1}`))
        baseNamePic2 && unlinks.push(path.join(config.fileDirs.motorDriverPicDir, `/${baseNamePic2}`))
        baseNamePic3 && unlinks.push(path.join(config.fileDirs.motorDriverPicDir, `/${baseNamePic3}`))
      })
    }

    const result = await Motorvehicle.deleteMany({ _id: { $in: ids } })

    setImmediate(() => {
      unlinks.forEach(path => {
        fs.existsSync(path) && fs.unlinkSync(path)
      })
    })

    ctx.body = result.deletedCount
  } catch (error) {
    handleSysException(error)
  }
}

const list = async ctx => {
  try {
    const { orgId, state, condition } = ctx.query
    const pagination = ctx.query.page
    const option = {}
    orgId && (option['orgId'] = orgId)
    state && (option['state'] = parseInt(state))
    condition && (option['$or'] = [{ name: { $regex: condition } }, { plateNo: { $regex: condition } }])

    const data = await paging.listQuery(Motorvehicle, option, '', { _id: -1 }, pagination, '', ctx)
    ctx.body = data.results
  } catch (error) {
    handleSysException(error)
  }
}

const renmoveOrgVehichles = async ctx => {
  try {
    const id = ctx.params.id || ''
    const query = {}
    if (!id) {
      ctx.throw(500, { messgae: '未指定删除机构' })
    }
    query.orgId = id
    await Motorvehicle.deleteMany(query)
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}

const show = async ctx => {
  try {
    const { id } = ctx.params

    const result = await Motorvehicle.findById(id).lean()
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

const schedule = async () => {
  try {
    const timer = Math.round(new Date() / 1000)
    await Motorvehicle.updateMany(
      { $or: [{ startTime: { $gte: timer } }, { endTime: { $lte: timer } }] },
      { $set: { state: 1 } }
    )
  } catch (error) {
    handleSysException(error)
  }
}

const clearSchedule = async () => {
  try {
    // 获取当天凌晨时间
    const today = Number(moment(moment().format('YYYY-MM-DD')).format('X'))
    // 获取30天之前的时间
    const configure = await Verificationscore.findOne({})
    const continuance = configure ? configure.days : 30
    const expired = today - Number(continuance) * 24 * 60 * 60
    const [passDates, peopleDates] = await Promise.all([
      PassVehicle.distinct('date', { time: { $lte: expired } }).lean(),
      PeopleVehicle.distinct('date', { time: { $lte: expired } }).lean(),
      PassVehicle.deleteMany({ time: { $lt: expired } }),
      PeopleVehicle.deleteMany({ time: { $lt: expired } })
    ])

    const peopleDirPath = config.fileDirs.passVehiclePicDir
    const PassDirPath = config.fileDirs.roadVehiclePicDir

    passDates.forEach(item => {
      const floaderPath = path.join(peopleDirPath, `/${item}`)
      const stat = fs.statSync(floaderPath)
      if (stat.isDirectory()) {
        exec(`rm -rf ${floaderPath}`)
      }
    })

    peopleDates.forEach(item => {
      const floaderPath = path.join(PassDirPath, `/${item}`)
      const stat = fs.statSync(floaderPath)
      if (stat.isDirectory()) {
        exec(`rm -rf ${floaderPath}`)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  create,
  update,
  destroy,
  list,
  show,
  schedule,
  clearSchedule,
  renmoveOrgVehichles
}
