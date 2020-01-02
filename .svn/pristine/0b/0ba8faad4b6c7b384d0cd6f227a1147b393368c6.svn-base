/*
 * @Description: 根据资源的监控点类型修改绑定默认图标
 * @Author: wanglei
 * @Date: 2019-11-05 14:44:06
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-05 17:21:31
 */
'use strict'
const mongoose = require('mongoose')
const Resource = mongoose.model('Resource')
const Icon = mongoose.model('Icon')

exports.upgrade = async () => {
  try {
    await updateResourcePointIcon()
  } catch (error) {
    throw Error(error)
  }
}

const updateResourcePointIcon = async () => {
  try {
    await updateResourcesPointExistsIcon()
    await updateResourcesPoint3DExistsIcon()
  } catch (error) {
    throw Error(error)
  }
}

// 更新 2D 地图点位图标
const updateResourcesPointExistsIcon = async () => {
  try {
    const results = await Resource.find({ point: { $exists: true } }, '_id point monitoryPointGenera monitortype')
      .lean()
      .exec()
    let promiseList = results.map(item => updateResourceIconId('point', item))
    await Promise.all(promiseList)
  } catch (error) {
    throw Error(error)
  }
}

// 更新 3D 地图楼内点位图标
const updateResourcesPoint3DExistsIcon = async () => {
  try {
    const results = await Resource.find({ point3D: { $exists: true }, 'point3D.isouter': false }, '_id point3D monitoryPointGenera monitortype')
      .lean()
      .exec()
    let promiseList = results.map(item => updateResourceIconId('point3D', item))
    await Promise.all(promiseList)
  } catch (error) {
    throw Error(error)
  }
}

// 修改绑定图标 Id
const updateResourceIconId = async (type, resourceItem) => {
  try {
    let iconId = null
    switch (resourceItem.monitortype) {
      case 0: // 枪机
        if (resourceItem.monitoryPointGenera === 1) {
          const { _id: faceIconId } = await Icon.findOne({ oid: '05', default: true }, '_id').lean().exec()
          iconId = faceIconId
          break
        } else if (resourceItem.monitoryPointGenera === 2) {
          const { _id: vehicleIconId } = await Icon.findOne({ oid: '06', default: true }, '_id').lean().exec()
          iconId = vehicleIconId
          break
        } else {
          const { _id: gunIconId } = await Icon.findOne({ oid: '00', default: true }, '_id').lean().exec()
          iconId = gunIconId
          break
        }
      case 1: // 红外枪机
        const { _id: redGunIconId } = await Icon.findOne({ oid: '01', default: true }, '_id').lean().exec()
        iconId = redGunIconId
        break
      case 2: // 半球
        const { _id: halfBallIconId } = await Icon.findOne({ oid: '02', default: true }, '_id').lean().exec()
        iconId = halfBallIconId
        break
      case 3: // 快球
        const { _id: fastBallIconId } = await Icon.findOne({ oid: '03', default: true }, '_id').lean().exec()
        iconId = fastBallIconId
        break
      case 4: // 全景
        const { _id: panoramicIconId } = await Icon.findOne({ oid: '04', default: true }, '_id').lean().exec()
        iconId = panoramicIconId
        break
      default:
        break
    }
    if (type === 'point') {
      await Resource.findByIdAndUpdate(resourceItem._id, { 'point.mid': iconId }).lean().exec()
    }
    if (type === 'point3D') {
      await Resource.findByIdAndUpdate(resourceItem._id, { 'point3D.iid': iconId }).lean().exec()
    }
  } catch (error) {
    throw Error
  }
}
