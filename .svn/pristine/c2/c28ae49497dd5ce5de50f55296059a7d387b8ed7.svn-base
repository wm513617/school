/*
 * @Description: 修改半球角度与实际不一致的情况，此脚本只执行一次
 * @Author: wanglei
 * @Date: 2019-11-08 13:49:33
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-11-11 09:25:44
 */

'use strict'
require('../api/sys/orgRes/orgRes.model')
require('../api/sys/alarmCfg/alarmType.model')
require('../api/sys/alarmCfg/timeTemplate.model')
require('../api/sys/resource/resource.model.js')
const mongoose = require('mongoose')
const Resource = mongoose.model('Resource')
mongoose.connect('mongodb://127.0.0.1:27017/bs-security')

const updateResourcePointAngle = async () => {
  try {
    const resources = await Resource.find({ point: { $exists: true }, monitortype: 2 }, '_id point')
      .lean()
      .exec()
    const promiseList = resources.map(item =>
      Resource.findByIdAndUpdate(item._id, { 'point.angle': subAngle(item.point.angle) })
    )
    await Promise.all(promiseList)
    console.log(`${resources.length}  done`)
  } catch (error) {
    throw Error(error)
  }
}

// 角度减 90 ，如果小于 0 则加 360
const subAngle = angle => {
  return angle - 90 < 0 ? angle - 90 + 360 : angle - 90
}

updateResourcePointAngle()
  .then(() => {
    process.exit()
  })
  .catch(err => {
    console.log(err)
    process.exit()
  })
