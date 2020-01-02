'use strict'
/**
 * 车辆布防
 */
var VehicleDefense = require('mongoose').model('VehicleDefense')
var Vehicle = require('mongoose').model('Vehicle')
var paging = require('../../paging')
var _ = require('lodash')

/**
 * 获取车辆布防信息
 */
exports.index = async (ctx, next) => {
  const searchTmp = ctx.query.search
  const searchObj = {}
  _.forIn(searchTmp, (value, key) => { // 去除非法值
    if (value) {
      searchObj[key] = value
    }
  })
  if (searchTmp.brand) { // 品牌
    const brand = decodeURI(searchTmp.brand).split(',')
    if (brand) { searchObj.brand = { $in: brand } }
  }
  if (searchTmp.endTime && searchTmp.startTime) {
    if (searchTmp.startTime > searchTmp.endTime) { // 若开始时间大于结束时间，设置时间为0查询为空
      searchObj['startTime'] = 0
      searchObj['endTime'] = 0
    } else {
      searchObj['startTime'] = { $lte: searchTmp.endTime }
      searchObj['endTime'] = { $gte: searchTmp.startTime }
    }
  } else if (searchTmp.endTime) {
    searchObj['startTime'] = { $lte: searchTmp.endTime }
    delete searchObj.endTime
  } else if (searchTmp.startTime) {
    searchObj['endTime'] = { $gte: searchTmp.startTime }
    delete searchObj.startTime
  }
  try {
    const results = await paging.listQuery(VehicleDefense, searchObj, '', { _id: -1 }, ctx.query.page, '', ctx)
    ctx.body = results.results
  } catch (err) {
    return ctx.throw(500, { code: 2101, message: err.message })
  }
}

/**
 * 车辆布防新增
 */

exports.create = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-新增布控'))
  const newDatas = ctx.request.body
  try {
    if (!newDatas.isDefenseAll && newDatas.videoChannels.length === 0) {
      return ctx.throw(500, { code: 2201, message: '请选择布控范围' })
    }
    let result = {}
    if (_.isArray(newDatas.licence)) { // 若是黑名单布控 根据车辆id数据进行检车保存
      const vehicleDatas = await Vehicle.find({ licence: { $in: newDatas.licence } }, 'licence').exec()
      const licences = []
      _(vehicleDatas).forEach(n => {
        licences.push(n.licence)
      })
      const checkDatas = await VehicleDefense.find({ licence: { $in: licences } }).exec()
      if (checkDatas.length > 0) {
        return ctx.throw(500, { code: 2201, message: checkDatas[0].licences + ' 已经布控的车辆' })
      }
      const saveArr = []
      _(vehicleDatas).forEach(n => {
        const tempObj = _.assign({}, newDatas)
        tempObj['licence'] = n.licence
        tempObj['brand'] = n.brand
        tempObj['model'] = n.model
        tempObj['color'] = n.color
        tempObj['name'] = newDatas.name + '-' + n.licence
        saveArr.push(tempObj)
      })
      result = await VehicleDefense.create(saveArr)
    } else {
      result = await VehicleDefense.create(newDatas)
    }

    ctx.status = 201
    ctx.body = result
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 车辆布防修改
 */
exports.update = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-修改布控'))
  const newDatas = ctx.request.body
  const id = ctx.params.id
  try {
    if (!newDatas.isDefenseAll && newDatas.videoChannels.length === 0) {
      return ctx.throw(500, { code: 2201, message: '请选择布控范围' })
    }
    await VehicleDefense.findByIdAndUpdate(id, ctx.request.body).exec()
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 批量修改布防车辆
 */
exports.batchUpdate = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-批量修改布控'))
  const ids = ctx.request.header['x-bsc-ids'].split(',') || []
  try {
    const result = await VehicleDefense.updateMany({ _id: { $in: ids } }, ctx.request.body)
    ctx.body = result
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 车辆布防删除
 */
exports.destroy = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-删除布控'))
  const id = ctx.params.id
  try {
    await VehicleDefense.findByIdAndRemove(id).exec()
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}
/**
 * 布控车辆批量删除
 */
exports.batchDestroy = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-批量删除布控'))
  const ids = ctx.request.header['x-bsc-ids'].split(',') || []
  try {
    if (!_.isEmpty(ids)) {
      const result = await VehicleDefense.deleteMany({ _id: { $in: ids } })
      ctx.body = result
    }
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 重新布控
 */
exports.reset = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-重新布控'))
  const type = ctx.params.type
  try {
    await VehicleDefense.deleteMany({ type: type }).exec()
    // await VehicleDefense.findByIdAndUpdate(id, ctx.request.body).exec()
    ctx.status = 200
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

exports.changState = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('车辆识别-修改布控状态'))
  try {
    const date = new Date()
    const daytime = date.setHour(0, 0, 0, 0) / 1000
    await VehicleDefense.updateMany({ endTime: { $lte: daytime, state: 1 } }, { state: 2 })
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}

/**
 * 校验车牌是不是被占用
 */
exports.check = async (ctx, next) => {
  try {
    const id = ctx.query.id
    const licence = ctx.query.licence
    const searchObj = { licence: licence }
    if (id) { searchObj._id = { $ne: id } }
    ctx.body = !!await VehicleDefense.count(searchObj).exec()
  } catch (error) {
    return ctx.throw(500, { code: 2101, message: error.message })
  }
}
