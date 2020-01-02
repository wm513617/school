/** 业务管理，案件处理 alarmevents 表增加 结构化追踪 structuredTrack 字段
 * @Author: SongXiaoshan
 * @Date: 2019-11-06 15:56:02
 * @Last Modified by: SongXiaoshan
 * @Last Modified time: 2019-11-06 16:27:31
 */

'use strict'
const mongoose = require('mongoose')
const AlarmEvent = mongoose.model('AlarmEvent')

exports.upgrade = async () => {
  await update()
}

const update = async () => {
  try {
    await AlarmEvent.update({'structuredTrack': { $exists: false }}, {$set: {'structuredTrack': []}}, {multi: true}).lean()
  } catch (error) {
    console.log(error)
    throw error
  }
}
