/*
 * @Description: 视频结构化识别数据存储在 influxdb 数据库
 * @Author: wanglei
 * @Date: 2019-07-15 14:44:59
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-12-24 09:09:56
 */
'use strict'
const mongoose = require('mongoose')
const StructreServer = mongoose.model('structureserver')
const Resource = mongoose.model('Resource')
const _ = require('lodash')
const { URL } = require('url')
const { influxdb } = require('./influxdb')
const { TypeCodeEnum } = require('../../structure.enum')

const getWritePoint = (tagsObject, fieldsObject) => {
  const vehicleTypes = [TypeCodeEnum.CAR, TypeCodeEnum.TRICYCLE, TypeCodeEnum.BUS, TypeCodeEnum.VAN, TypeCodeEnum.TRUCK]
  const nonVehicleTypes = [TypeCodeEnum.BIKE, TypeCodeEnum.MOTORCYCLE]
  if (tagsObject.type === TypeCodeEnum.PEDESTRIAN) {
    return {
      measurement: 'pedestrains',
      fields: fieldsObject,
      tags: tagsObject,
      timestamp: `${fieldsObject.captureTime}${String(process.hrtime.bigint()).slice(-6)}` // 纳秒时间精度
    }
  } else if (vehicleTypes.includes(tagsObject.type)) {
    return {
      measurement: 'vehicles',
      fields: fieldsObject,
      tags: tagsObject,
      timestamp: `${fieldsObject.captureTime}${String(process.hrtime.bigint()).slice(-6)}` // 纳秒时间精度
    }
  } else if (nonVehicleTypes.includes(tagsObject.type)) {
    return {
      measurement: 'nonVehicles',
      fields: fieldsObject,
      tags: tagsObject,
      timestamp: `${fieldsObject.captureTime}${String(process.hrtime.bigint()).slice(-6)}` // 纳秒时间精度
    }
  }
}

const getVideoStructData = async ctx => {
  let dataArr = []
  const data = ctx.request.body
  const { snapshotTime = 0, detail, imageUrls } = data
  const {
    Bikes: bikes = [],
    ChannelName: channelName,
    Code: code,
    Pedestrains: pedestrains = [],
    Vehicles: vehicles = [],
    VideoChannel: videoChannel,
    TaskId: taskId = -1
  } = detail
  // code 等于 0,说明识别成功，不等于 0 直接返回
  if (code !== 0) {
    return []
  }
  const res = await Resource.findOne({ 'videoStructure.channelId': videoChannel }, '_id')
    .lean()
    .exec()
  // 找不到资源直接返回，该条数据不存储
  if (_.isNull(res) || _.isUndefined(res)) {
    return []
  }
  const structServerIp = _.replace(ctx.ip, '::ffff:', '')
  const { structServerId } = await StructreServer.findOne({ ip: structServerIp })
    .lean()
    .exec()
  let fieldsObject = {
    structServerIp: structServerIp,
    structServerId: structServerId,
    taskId: taskId,
    snapshotTime: snapshotTime,
    channelName: channelName,
    resourceId: res._id + ''
  }
  let pointsArr = []
  if (bikes.length) {
    for (let bike of bikes) {
      const { tagsObject, otherObject } = getIdentifyDataByType('bikes', bike)
      Object.assign(fieldsObject, getImageUrl(imageUrls[otherObject.imageId], imageUrls[otherObject.guid]))
      delete otherObject.imageId
      Object.assign(tagsObject, {
        videoChannel: res._id + ''
      })
      pointsArr.push(getWritePoint(tagsObject, Object.assign({}, fieldsObject, otherObject)))
      dataArr.push(Object.assign({}, tagsObject, fieldsObject, otherObject))
    }
  }
  if (pedestrains.length) {
    for (let pedestrain of pedestrains) {
      const { tagsObject, otherObject } = getIdentifyDataByType('pedestrains', pedestrain)
      Object.assign(fieldsObject, getImageUrl(imageUrls[otherObject.imageId], imageUrls[otherObject.guid]))
      delete otherObject.imageId
      Object.assign(tagsObject, {
        videoChannel: res._id + ''
      })
      pointsArr.push(getWritePoint(tagsObject, Object.assign({}, fieldsObject, otherObject)))
      dataArr.push(Object.assign({}, tagsObject, fieldsObject, otherObject))
    }
  }
  if (vehicles.length) {
    for (let vehicle of vehicles) {
      const { tagsObject, otherObject } = getIdentifyDataByType('vehicles', vehicle)
      Object.assign(fieldsObject, getImageUrl(imageUrls[otherObject.imageId], imageUrls[otherObject.guid]))
      delete otherObject.imageId
      Object.assign(tagsObject, {
        videoChannel: res._id + ''
      })
      pointsArr.push(getWritePoint(tagsObject, Object.assign({}, fieldsObject, otherObject)))
      dataArr.push(Object.assign({}, tagsObject, fieldsObject, otherObject))
    }
  }
  if (pointsArr.length) {
    await influxdb.writePoints(pointsArr)
  }
  return dataArr
}

const getImageUrl = (bigImageUrlStr, smallImageUrlStr) => {
  const { bigImageUrl, bigImageUrlSpare } = getBigImageUrl(bigImageUrlStr)
  const { smallImageUrl, smallImageUrlSpare } = getSmallImageUrl(smallImageUrlStr)
  return {
    bigImageUrl,
    bigImageUrlSpare,
    smallImageUrl,
    smallImageUrlSpare
  }
}

const getBigImageUrl = bigImageUrl => {
  let bigImageUrlSpare = ''
  if (validateUrl(bigImageUrl)) {
    bigImageUrlSpare = new URL(bigImageUrl)
    bigImageUrlSpare = bigImageUrlSpare.href.replace(bigImageUrlSpare.origin, '')
  } else {
    bigImageUrl = ''
  }
  return {
    bigImageUrl,
    bigImageUrlSpare
  }
}

const getSmallImageUrl = smallImageUrl => {
  let smallImageUrlSpare = ''
  if (validateUrl(smallImageUrl)) {
    smallImageUrlSpare = new URL(smallImageUrl)
    smallImageUrlSpare = smallImageUrlSpare.href.replace(smallImageUrlSpare.origin, '')
  } else {
    smallImageUrl = ''
  }
  return {
    smallImageUrl,
    smallImageUrlSpare
  }
}

const validateUrl = str => {
  const regex = new RegExp('(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]')
  return regex.test(str)
}

const getIdentifyDataByType = (type, data) => {
  let result = {}
  switch (type) {
    case 'bikes':
      result = getBikeData(data)
      break
    case 'pedestrains':
      result = getPedestrainData(data)
      break
    case 'vehicles':
      result = getVehicleData(data)
      break
    default:
      break
  }
  return result
}

// 拼装接收到的识别的行人信息
const getPedestrainData = pedestrain => {
  let tagsObject = {}
  let otherObject = {}
  const {
    Detect: detect,
    Recognize: recognize,
    RelationInfo: relationInfo,
    Timestamp: timestamp = 0,
    Type: type,
    GUID: guid = '',
    ImageId: imageId = ''
  } = pedestrain
  otherObject.bodyRect = _.get(detect, 'Body.Rect', [0, 0, 0, 0]).join(',')
  otherObject.bigImageHeight = _.get(relationInfo, 'PictureHeight', 0)
  otherObject.bigImageWidth = _.get(relationInfo, 'PictureWidth', 0)
  otherObject.captureTime = timestamp
  otherObject.guid = guid
  otherObject.imageId = imageId
  otherObject.score = _.get(detect, 'Body.Score', '0')
  otherObject.babyCode = _.get(recognize, 'Baby.TopList[0].Code', '9')
  otherObject.bagCode = _.get(recognize, 'Bag.TopList[0].Code', '9')
  otherObject.barrowCode = _.get(recognize, 'Barrow.TopList[0].Code', '9')
  otherObject.bottomColorCode = _.get(recognize, 'BottomColor.TopList[0].Code', '9')
  otherObject.bottomTypeCode = _.get(recognize, 'BottomType.TopList[0].Code', '9')
  otherObject.glassesCode = _.get(recognize, 'Glasses.TopList[0].Code', '9')
  otherObject.hairCode = _.get(recognize, 'Hair.TopList[0].Code', '9')
  otherObject.hatCode = _.get(recognize, 'Hat.TopList[0].Code', '9')
  otherObject.knapsackCode = _.get(recognize, 'Hat.TopList[0].Code', '9')
  otherObject.maskCode = _.get(recognize, 'Mask.TopList[0].Code', '9')
  otherObject.orientationCode = _.get(recognize, 'Orientation.TopList[0].Code', '9')
  otherObject.trolleyCaseCode = _.get(recognize, 'TrolleyCase.TopList[0].Code', '9')
  otherObject.umbrellaCode = _.get(recognize, 'Umbrella.TopList[0].Code', '9')
  otherObject.upperTextureCode = _.get(recognize, 'UpperTexture.TopList[0].Code', '9')
  otherObject.upperTypeCode = _.get(recognize, 'UpperType.TopList[0].Code', '9')
  tagsObject.type = type
  tagsObject.ageCode = _.get(recognize, 'Age.TopList[0].Code', '9')
  tagsObject.sexCode = _.get(recognize, 'Sex.TopList[0].Code', '9')
  tagsObject.upperColorCode = _.get(recognize, 'UpperColor.TopList[0].Code', '9')
  return {
    tagsObject: tagsObject,
    otherObject: otherObject
  }
}

// 拼装接收到的识别的车辆信息
const getVehicleData = vehicle => {
  let tagsObject = {}
  let otherObject = {}
  const {
    Detect: detect,
    Recognize: recognize,
    RelationInfo: relationInfo,
    Timestamp: timestamp,
    Type: type,
    GUID: guid,
    ImageId: imageId = ''
  } = vehicle
  otherObject.bodyRect = _.get(detect, 'Body.Rect', [0, 0, 0, 0]).join(',')
  otherObject.bigImageHeight = _.get(relationInfo, 'PictureHeight', 0)
  otherObject.bigImageWidth = _.get(relationInfo, 'PictureWidth', '0')
  otherObject.captureTime = timestamp
  otherObject.guid = guid
  otherObject.imageId = imageId
  otherObject.score = _.get(detect, 'Body.Score', '0')
  tagsObject.type = type
  // 三轮车只显示带棚和载人
  if (Number(type) === TypeCodeEnum.TRICYCLE) {
    otherObject.mannedCode =
      _.get(recognize, 'Manned.Code', 9) === 9 ? '9' : _.get(recognize, 'Manned.HasManned', false) === false ? '1' : '2'
    otherObject.convertibleCode =
      _.get(recognize, 'Convertible.Code', 9) === 9
        ? '9'
        : _.get(recognize, 'Convertible.HasConvertible', false) === false
          ? '1'
          : '2'
    return {
      tagsObject: tagsObject,
      otherObject: otherObject
    }
  }
  otherObject.plateTypeCode = _.get(recognize, 'Plate.Type', '99')
  let plateColorCode = _.get(recognize, 'Plate.Color.Code', '9')
  otherObject.plateColorCode = plateColorCode === '' ? '9' : plateColorCode
  let brandName = _.get(recognize, 'Brand.TopList[0].Name', '未识别')
  let brandNameArr = brandName.split('-')
  otherObject.carFamilyName = brandNameArr[0] || '未识别'
  otherObject.carBrandName = brandNameArr[1] || '未识别'
  otherObject.carStyleName = brandName
  otherObject.mistakeCode = _.get(recognize, 'Mistake.TopList[0].Code', '9')
  otherObject.crashCode =
    _.get(recognize, 'Crash.Code', 9) === 9 ? '9' : _.get(recognize, 'Crash.HasCrash', false) === false ? '1' : '2'
  otherObject.callCode =
    _.get(recognize, 'Call.Code', 9) === 9 ? '9' : _.get(recognize, 'Call.HasCall', false) === false ? '1' : '2'
  otherObject.rackCode = _.get(recognize, 'Rack.TopList[0].Code', '9')
  otherObject.spareTireCode = _.get(recognize, 'SpareTire.TopList[0].Code', '9')
  otherObject.sunroofCode = _.get(recognize, 'Sunroof.TopList[0].Code', '9')
  otherObject.dangerCode =
    _.get(recognize, 'Danger.Code', 9) === 9 ? '9' : _.get(recognize, 'Danger.HasDanger', false) === false ? '1' : '2'
  otherObject.mainDriverBeltCode =
    _.get(recognize, 'Belt.Code', 9) === 9
      ? '9'
      : _.get(recognize, 'Belt.MainDriver.NoBelt', false) === true
        ? '1'
        : '2'
  otherObject.coDriverBeltCode =
    _.get(recognize, 'Belt.Code', 9) === 9 ? '9' : _.get(recognize, 'Belt.CoDriver.NoBelt', false) === true ? '1' : '2'
  otherObject.slagCode =
    _.get(recognize, 'Slag.Code', 9) === 9 ? '9' : _.get(recognize, 'Slag.HasSlag', false) === false ? '1' : '2'
  const {
    Code: markerCode = 9,
    Tag: tag = undefined,
    Paper: paper = undefined,
    Sun: sun = undefined,
    Drop: drop = undefined
  } = _.get(recognize, 'Marker', {})
  otherObject.tagNum = markerCode === 9 ? '9' : tag === undefined ? '9' : tag.length
  otherObject.paperCode = markerCode === 9 ? '9' : paper === undefined ? '9' : paper.length === 0 ? '1' : '2'
  otherObject.sunCode = markerCode === 9 ? '9' : sun === undefined ? '9' : sun.length === 0 ? '1' : '2'
  otherObject.dropCode = markerCode === 9 ? '9' : drop === undefined ? '9' : drop.length === 0 ? '1' : '2'
  otherObject.plateLicence = _.get(recognize, 'Plate.Licence', '未识别')
  tagsObject.carKindCode = _.get(recognize, 'Type.TopList[0].Code', '0')
  tagsObject.colorCode = _.get(recognize, 'Color.TopList[0].Code', '9')
  return {
    tagsObject: tagsObject,
    otherObject: otherObject
  }
}

// 拼装接收到的识别的骑车人信息
const getBikeData = bike => {
  let tagsObject = {}
  let otherObject = {}
  const {
    Detect: detect,
    RelationInfo: relationInfo,
    Persons: persons = [],
    Timestamp: timestamp,
    Type: type,
    GUID: guid = '',
    ImageId: imageId = ''
  } = bike
  otherObject.bodyRect = _.get(detect, 'Body.Rect', [0, 0, 0, 0]).join(',')
  otherObject.bigImageHeight = _.get(relationInfo, 'PictureHeight', 0)
  otherObject.bigImageWidth = _.get(relationInfo, 'PictureWidth', 0)
  otherObject.captureTime = timestamp
  otherObject.guid = guid
  otherObject.imageId = imageId
  otherObject.score = _.get(detect, 'Body.Score', '0')
  tagsObject.type = type
  if (!persons.length) {
    tagsObject.isPedestrain = '0' // 未识别到人
    return {
      tagsObject: tagsObject,
      otherObject: otherObject
    }
  }
  tagsObject.isPedestrain = '1' // 识别到人
  const person = getPedestrainData(persons[0])
  delete person.tagsObject.type
  delete person.otherObject.captureTime
  delete person.otherObject.bigImageHeight
  delete person.otherObject.bigImageWidth
  delete person.otherObject.guid
  delete person.otherObject.imageId
  delete person.otherObject.score
  Object.assign(tagsObject, person.tagsObject)
  Object.assign(otherObject, person.otherObject)
  return {
    tagsObject: tagsObject,
    otherObject: otherObject
  }
}

module.exports = {
  getVideoStructData
}
