/*
 *  将resProperties表中properties字段中含有playbackDownload的值拆分为playback（回放）和download（下载）
 * @Author: linhang
 * @Date: 2019-12-02 10:20:41
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-03 11:19:01
 */

'use strict'
const mongoose = require('mongoose')
const ResProperty = mongoose.model('ResProperty')

exports.upgrade = async () => {
  try {
    const data = await ResProperty.find(
      { properties: { $elemMatch: { $eq: 'playbackDownload' } } },
      'properties'
    ).lean()
    for (let item of data) {
      const property = item.properties.filter(item => item !== 'playbackDownload')
      const obj = {
        properties: property.concat(['playback', 'download'])
      }
      await ResProperty.findOneAndUpdate({ _id: item._id }, obj)
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
