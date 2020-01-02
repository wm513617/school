/*
 * 地图列表接口
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:30:34
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-12-27 10:40:23
 */

'use strict'
const mongoose = require('mongoose')
const MapList = mongoose.model('MapList')
const Grid = mongoose.model('Grid')
const Building = mongoose.model('Building')
const Storey = mongoose.model('Storey')
const Resource = mongoose.model('Resource')
const AddressBook = mongoose.model('AddressBook')
const Principal = mongoose.model('Principal')
const postal = require('postal')
const imageSize = require('image-size')
const { handleSysException } = require('../../../common/tools')
const { AddressBookEnum } = require('../../../common/enum')

// 地图列表配置
exports.add = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('地图管理-添加地图列表配置'))
  try {
    const reqdata = ctx.request.body
    const maplists = await MapList.find({})
      .lean()
      .exec()
    const scopeStrMapping = {}
    maplists.forEach(item => {
      scopeStrMapping[item.extent.join('')] = item
    })
    for (var item of reqdata) {
      const extentStr = item.extent.join('')
      if (scopeStrMapping[extentStr]) {
        await MapList.findByIdAndUpdate(scopeStrMapping[extentStr]._id, item)
        delete scopeStrMapping[extentStr]
      } else {
        MapList.create(item)
      }
    }
    if (Object.keys(scopeStrMapping).length) {
      for (const item in scopeStrMapping) {
        MapList.deleteMany({ _id: scopeStrMapping[item]._id }).exec()
        Resource.updateMany(
          { 'point.mapId': scopeStrMapping[item]._id },
          { $unset: { point: 1 } },
          { multi: true }
        ).exec()
        Grid.deleteMany({ mapId: scopeStrMapping[item]._id }).exec()
        Storey.deleteMany({ mapId: scopeStrMapping[item]._id })
          .exec()
          .then(() => {
            postal.publish({ channel: 'sentry', topic: 'array.delete', data: {} })
          })
        Building.deleteMany({ mapId: scopeStrMapping[item]._id }).exec()
        MapList.deleteMany({ mapId: scopeStrMapping[item]._id }).exec()
      }
    }
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 地图列表配置
exports.index = async (ctx, next) => {
  ctx.set('loginfo', encodeURI('地图管理-地图列表配置'))
  try {
    const mapList = await MapList.find().lean()
    const _result = []
    for (const map of mapList) {
      let { mapConfig } = map
      if (map.mapType === 'static') {
        // 静态图片地图，需要返回图片宽高
        const filePath = _.replace(map.mapUrl, '/image', '/opt/bstar/pic')
        const size = imageSize(fs.readFileSync(filePath))
        mapConfig = Object.assign({ mapId: map._id.toString(), size }, map)
      } else {
        // 不是静态地图
        mapConfig = Object.assign({ mapId: map._id.toString() }, map)
      }
      _result.push(mapConfig)
    }
    ctx.body = _result
  } catch (err) {
    handleSysException(err)
  }
}
// 修改地图配置
exports.update = async (ctx, next) => {
  try {
    const config = ctx.request.body
    await MapList.findByIdAndUpdate(ctx.params.id, config).exec()
    ctx.status = 200
  } catch (err) {
    handleSysException(err)
  }
}
// 根据地图id删除所有资源
exports.deleteAllResourceByMapId = async ctx => {
  try {
    ctx.set('loginfo', encodeURI('地图管理-根据mapid删除mapid相关的地图资源'))
    // 删除视频点位
    // for (var item of resoures) {
    //   await item.save()
    // }
    await Promise.all([
      Resource.updateMany(
        { point: { $exists: true }, 'point.mapId': ctx.params.mapid },
        { $unset: { point: 1 } },
        { multi: true }
      ).exec(),
      Grid.deleteMany({ mapId: ctx.params.mapid }).exec(),
      Storey.deleteMany({ mapId: ctx.params.mapid }).exec(),
      Building.deleteMany({ mapId: ctx.params.mapid }).exec(),
      Principal.deleteMany({ mapId: ctx.params.mapid }).exec(),
      AddressBook.deleteMany({
        mapId: ctx.params.mapid,
        type: { $in: [AddressBookEnum.BUILDING, AddressBookEnum.GRID, AddressBookEnum.OTHER] }
      }).exec()
    ])
    // 发布删除所有巡更点位
    postal.publish({ channel: 'sentry', topic: 'array.delete', data: {} })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    return ctx.throw(500, err.code ? { code: err.code, message: err.message } : { code: 4001, message: '系统内部错误' })
  }
}
