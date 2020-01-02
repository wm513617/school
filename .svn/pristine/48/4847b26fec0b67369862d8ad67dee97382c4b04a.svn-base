/**
 * 节假日模型
 * @time:207-6-17
 * @author:hansen
 */

'use strcit'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const holidaySchema = new Schema({
  // 节假日名称
  holidayName: {
    type: String,
    required: true
  },
  // 节假日类型
  type: {
    type: String,
    enum: ['month', 'date'],
    required: true
  },
  // 是否启用
  enable: {
    type: String,
    default: 'disable'
  },
  // 开始日期
  startTime: {
    type: Number,
    required: true
  },
  // 结束日期
  endTime: {
    type: Number,
    required: true
  }
}, { timestamps: true })

mongoose.model('Holiday', holidaySchema)
