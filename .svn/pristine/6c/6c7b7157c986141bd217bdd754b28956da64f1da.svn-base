/*
 * @Author: litao
 * @Date: 2019-06-27 11:55:13
 * @Last Modified time: 2019-07-05 13:13:40
 * 该模块主要提供对非机动车的添加、删除、修改、查询功能
 * -----------------------------README-----------------------------
 * create()   添加非动车信息
 * update()   修改非机动车信息
 * destroy()  删除非机动车信息(可根据ID单个或者批量删除) 在删除数据的同时会删除数据所对应的文件
 * list()     查询所有符合条件的非机动车信息
 * show()     非机动车信息详情
 * index()    查询非机动车信息(单兵调用接口)
 */

'use strict'
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')

const UserNonVehicles = mongoose.model('userNonVehicles')
const UserNonVehicleLog = mongoose.model('userNonVehicleLog')
const NonVehicleViolation = mongoose.model('NonVehicleViolation')
const Org = mongoose.model('Org')

const { handleSysException } = require('../../../common/tools')
const config = require('../../../../config').backend
const { generateCode } = require('../qrCode')
const paging = require('../../paging')
const CONSTANT = require('../constant')

const create = async ctx => {
  try {
    const data = ctx.request.body
    const { numberPlate } = data.nonVehiclesInfos

    const userNonVehicleInfo = await UserNonVehicles.findOne({ 'nonVehiclesInfos.numberPlate': numberPlate })

    if (userNonVehicleInfo) {
      ctx.status = 400
      ctx.body = {
        success: false,
        messgae: '车牌号码不能重复'
      }
      return
    }

    const savePath = path.join(config.fileDirs.nonVehicleDir, `/code-${numberPlate}.jpg`)
    await generateCode(numberPlate, savePath)

    data['nonVehiclesInfos']['codeImage'] = `/image/nonVehicle/code-${numberPlate}.jpg`
    await UserNonVehicles.create(data)
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

const update = async ctx => {
  try {
    const id = ctx.params.id
    const data = ctx.request.body

    await UserNonVehicles.update({ _id: id }, data).exec()
    ctx.status = 200
  } catch (error) {
    handleSysException(error)
  }
}

const destroy = async ctx => {
  try {
    const ids = ctx.params.ids.split(',')

    const infos = await UserNonVehicles.find(
      { _id: { $in: ids } },
      'nonVehiclesInfos.image nonVehiclesInfos.codeImage'
    ).lean()
    let unlinks = []
    if (infos) {
      infos.forEach(item => {
        const fileName = item.nonVehiclesInfos.image ? path.basename(item.nonVehiclesInfos.image) : ''
        const codeFileName = item.nonVehiclesInfos.codeImage ? path.basename(item.nonVehiclesInfos.codeImage) : ''

        fileName && unlinks.push(path.join(config.fileDirs.nonVehicleDir, `/${fileName}`))
        codeFileName && unlinks.push(path.join(config.fileDirs.nonVehicleDir, `/${codeFileName}`))
      })
    }

    const result = await UserNonVehicles.deleteMany({ _id: { $in: ids } })

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
    const { orgId, identityType, state, condition } = ctx.query
    const pagination = ctx.query.page

    const option = {}

    orgId && (option['orgId'] = orgId)
    identityType && (option['identityType'] = parseInt(identityType))
    state && (option['nonVehiclesInfos.state'] = parseInt(state))
    // if (condition) {
    //   option.$and = [{ name: { $regex: condition } }, { 'nonVehiclesInfos.numberPlate': { $regex: condition } }]
    // }
    condition && (option['name'] = { $regex: condition })

    const data = await paging.listQuery(UserNonVehicles, option, '', { _id: -1 }, pagination, '', ctx)
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
    await UserNonVehicles.deleteMany(query)
    ctx.body = ''
  } catch (error) {
    handleSysException(error)
  }
}

const show = async ctx => {
  try {
    const { id } = ctx.params

    const result = await UserNonVehicles.findById(id).lean()
    ctx.body = result
  } catch (error) {
    handleSysException(error)
  }
}

// 增加非机动车违规记录
const addViolationRecord = async ctx => {
  try {
    const body = ctx.request.body
    if (!body.numberPlate) {
      ctx.throw(500, { message: '没有车牌号' })
    }
    const doc = await NonVehicleViolation.create(body)
    await UserNonVehicles.findOneAndUpdate(
      { 'nonVehiclesInfos.numberPlate': body.numberPlate },
      { 'nonVehiclesInfos.state': 1 }
    )
    ctx.body = doc._id
  } catch (error) {
    handleSysException(error)
  }
}
const getViolationRecord = async ctx => {
  try {
    const id = ctx.query.plate
    const data = await queryViolationRecord(id)
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

const queryViolationRecord = async numberPlate => {
  try {
    if (!numberPlate) {
      return []
    }
    numberPlate = Array.isArray(numberPlate) ? numberPlate : [numberPlate]
    const docs = await NonVehicleViolation.aggregate([
      { $match: { numberPlate: { $in: numberPlate } } },
      { $group: { _id: '$numberPlate', doc: { $push: '$$ROOT' } } },
      { $project: { plate: '$_id', _id: 0, doc: 1 } }
    ])
    return docs
  } catch (error) {
    handleSysException(error)
  }
}

const index = async ctx => {
  try {
    let { deviceId, numberPlate } = ctx.params
    numberPlate = decodeURI(numberPlate)
    const nonVehicle = await UserNonVehicles.findOne({ 'nonVehiclesInfos.numberPlate': numberPlate }).lean()
    if (!nonVehicle) {
      ctx.status = 404
      ctx.body = `未找到车牌号码${numberPlate}`
      return
    }

    // 保存查询历史记录
    const { orgId, identityType } = nonVehicle
    await UserNonVehicleLog.create({ orgId, deviceId, identityType })

    const org = await Org.findById(nonVehicle.orgId, 'name')

    const { name, sex, tel, nonVehiclesInfos } = nonVehicle
    const {
      image,
      buyTime,
      isOneSelf,
      isInvoice,
      brand,
      color,
      numberPlateType,
      periodOfValidity,
      state
    } = nonVehiclesInfos

    const data = {
      orgName: org.name || '',
      identityType: CONSTANT.columns[0].default[identityType],
      name: name || '',
      sex: CONSTANT.columns[4].default[sex],
      tel: tel || '',
      image: image || '',
      buyTime: buyTime || '',
      isOneSelf: isOneSelf ? '是' : '否',
      isInvoice: isInvoice ? '有' : '无',
      brand: brand || '',
      color: color || '',
      numberPlateType: numberPlateType ? '正式' : '临时',
      numberPlate: numberPlate || '',
      periodOfValidity: periodOfValidity || '',
      state: CONSTANT.columns[12].default[state]
    }
    ctx.body = data
  } catch (error) {
    handleSysException(error)
  }
}

module.exports = {
  create,
  update,
  destroy,
  list,
  show,
  index,
  addViolationRecord,
  getViolationRecord,
  renmoveOrgVehichles
}
