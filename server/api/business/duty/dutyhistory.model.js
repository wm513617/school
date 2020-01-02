/** 每日录像记录
  * @Author: lushengying
  * @Date: 2019-08-09 11:50:15
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-08-09 17:06:10
*/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const tlate = new Schema({
  // 班次名称
  shiftName: {
    type: String
  },
  // 开始时间
  startTime: {
    type: String
  },
  // 结束时间
  endTime: {
    type: String
  },
  timeSum: {
    type: Number
  }
})
const DutyHistorySchema = new Schema(
  {
    // 整体模板时间
    timeSum: {
      type: Number
    },
    // 值班人
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'DutyStaff'
    },
    // 当日所使用模板
    template: [
      tlate
    ],
    // 记录时间
    date: {
      type: Number
    }
  },
  { timestamps: true }
)

mongoose.model('dutyhistorys', DutyHistorySchema)
