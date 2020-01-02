'use strict'
/**
 * 车辆管理
 */
var Vehicle = require('mongoose').model('Vehicle')
var VehicleDefense = require('mongoose').model('VehicleDefense')
var ServerSetting = require('mongoose').model('ServerSetting')
var VehicleBrand = require('mongoose').model('VehicleBrand')
var paging = require('../../paging')
var gfs = require('../../../common/gridfs.util')
var fs = require('fs')
var request = require('request')
var _ = require('lodash')

/**
 * 获取车辆信息
 */
exports.index = async (ctx, next) => {
  const search = ctx.query.search
  if (search.brand) { // 品牌
    const brand = decodeURI(search.brand).split(',')
    if (brand) { search.brand = { $in: brand } }
  }
  try {
    const results = await paging.listQuery(Vehicle, search, '', { _id: -1 }, ctx.query.page, '', ctx)
    ctx.body = results.results
  } catch (err) {
    return ctx.throw(500, { code: 2101, message: err.message })
  }
}

/**
 * 车里新增
 */

exports.create = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-车辆新增'))
  const newVehicle = ctx.request.body
  try {
    const vehicle = await Vehicle.create(newVehicle)
    ctx.status = 201
    ctx.body = vehicle
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 车辆修改
 */
exports.update = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-车辆修改'))
  const id = ctx.params.id
  try {
    await Vehicle.findByIdAndUpdate(id, ctx.request.body).exec()
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 批量修改车辆信息
 */
exports.batchUpdate = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-批量车辆修改'))
  const ids = ctx.request.header['x-bsc-ids'].split(',') || []
  try {
    const reuslt = await Vehicle.updateMany({ _id: { $in: ids } }, ctx.request.body)
    ctx.body = reuslt
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 车辆删除
 */
exports.destroy = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-车辆删除'))
  const id = ctx.params.id
  try {
    const result = await Vehicle.findByIdAndRemove(id)
    if (result.list === 3) {
      await VehicleDefense.deleteMany({ licence: result.licence })
    }
    ctx.status = 200
    ctx.body = result
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 批量删除
 */
exports.batchDestroy = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-批量车辆删除'))
  const ids = ctx.request.header['x-bsc-ids'].split(',') || []
  try {
    if (!_.isEmpty(ids)) {
      const findDatas = await Vehicle.find({ _id: { $in: ids } }, 'list licence').exec() // 查询删除车辆，若是黑名单车辆 则删除黑名单布控相应车辆
      if (findDatas[0].list === 3) {
        const listLicences = []
        _(findDatas).forEach(n => listLicences.push(n.licence))
        await VehicleDefense.deleteMany({ licence: { $in: listLicences } })
      }
      const result = await Vehicle.deleteMany({ _id: { $in: ids } })
      ctx.body = result
    } else {
      ctx.throw(500, { code: 2201, message: '参数错误' })
    }
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 车辆识别
 */
exports.recognize = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-车辆图片识别'))
  const file = ctx.request.body.files.file
  try {
    const readStream = fs.createReadStream(file.path)
    const uploadObj = await gfs.uploadFileToGFS(file.path, file.name, ctx)
    const base64 = await new Promise((resolve, reject) => {
      const buffers = []
      readStream.on('data', chunk => {
        buffers.push(chunk)
      })
      readStream.on('end', () => {
        resolve(Buffer.concat(buffers).toString('base64').toString())
      })
    })
    const serverData = await ServerSetting.findOne({ type: 1 }, 'ip port').exec() // 读取服务器配置获取ip和端口
    const recResult = await new Promise((resolve, reject) => {
      request.post({
        url: 'http://' + serverData.ip + ':' + serverData.port + '?cmd=recogPic',
        json: {
          ImageId: uploadObj.id,
          ImageData: base64,
          ImageType: 0
        },
        timeout: 10 * 1000
      }, (errors, response, body) => {
        if (!errors) {
          resolve(body.data.ImageResults[0].Vehicles)
        } else {
          reject(errors.message)
        }
      })
    })
    const recObj = {}
    if (!_.isEmpty(recResult)) {
      if (recResult[0].Recognize.Brand) {
        const brandArr = recResult[0].Recognize.Brand.TopList[0].Name.split('-')
        recObj['brand'] = brandArr[0]
        recObj['model'] = brandArr[1]
      }
      if (recResult[0].Recognize.Color) {
        recObj['color'] = recResult[0].Recognize.Color.TopList[0].Code * 1
      }
      if (recResult[0].Recognize.Plate) {
        recObj['licence'] = recResult[0].Recognize.Plate.Licence
      }
      if (recResult[0]) {
        recObj['type'] = recResult[0].Type
      }
    }
    ctx.body = {
      imgObj: uploadObj,
      recObj: recObj
    }
  } catch (error) {
    const errorObj = { code: 2101, message: error.message || error }
    if (!error.message) { errorObj.type = 'sys' }
    return ctx.throw(500, errorObj)
  }
}

/**
 *  车辆下拉框列表（去除已经布控的）
 */
exports.list = async (ctx, next) => {
  try {
    const blackLists = await Vehicle.find({ list: 3 }).exec() // 黑名单车辆
    const defensdBlack = await VehicleDefense.find({ type: 2 }).exec() // 已经布控黑名单车辆
    const defensdBlackLicences = [] // 布防车牌集合
    _(defensdBlack).forEach(n => defensdBlackLicences.push(n.licence))
    ctx.body = _(blackLists).filter(n => defensdBlackLicences.indexOf(n.licence) === -1) // 去除差集
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 根据车牌获取车辆信息
 */
exports.getOne = async (ctx, next) => {
  const licence = ctx.query.licence
  if (!licence) {
    return ctx.throw(500, { code: 2201, message: '请传入正确的参数' })
  }
  try {
    const data = await Vehicle.findOne({ licence: licence }).exec()
    ctx.body = data
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 获取车辆品牌列表
 */
exports.getBrand = async (ctx, next) => {
  try {
    const data = await VehicleBrand.find({}, 'brand').exec()
    const result = new Set()
    _(data).forEach(n => {
      result.add(n.brand)
    })
    ctx.body = Array.from(result)
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 根据车辆品牌获取车辆型号列表
 */
exports.getModel = async (ctx, next) => {
  const brand = ctx.query.brand
  if (!brand) { return ctx.throw(400, { code: 2101, message: '参数错误' }) }
  try {
    const data = await VehicleBrand.find({ brand: brand }, 'model').exec()
    const result = []
    _(data).forEach(n => {
      result.push(n.model)
    })
    ctx.body = result
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 校验车牌是不是被占用
 */
exports.check = async (ctx, next) => {
  const id = ctx.query.id
  const licence = ctx.query.licence
  const searchObj = { licence: licence }
  try {
    if (id) { searchObj._id = { $ne: id } }
    ctx.body = !!await Vehicle.count(searchObj).exec()
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}
