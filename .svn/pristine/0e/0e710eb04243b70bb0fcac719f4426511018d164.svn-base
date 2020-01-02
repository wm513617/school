/**
 * 布防记录表
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DefenserecordSchema = new Schema({
  vehicleDefense: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleDefense'
  },
  vehicleIdentify: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleIdentify'
  },
  defenseType: Number, // 布控类型
  createTime: Number,
  date: Number,
  channelid: Number // 视频资源通道号
})

DefenserecordSchema.pre('save', function (next) {
  this.createTime = Math.ceil(new Date().getTime() / 1000)
  this.date = new Date().setHours(0, 0, 0, 0) / 1000
  next()
})
mongoose.model('Defenserecord', DefenserecordSchema)
