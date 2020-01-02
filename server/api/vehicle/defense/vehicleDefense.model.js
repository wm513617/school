/**
 * 车辆布防、黑白名单
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VehicleDefenseSchema = new Schema({
  name: { // 任务名称
    type: String,
    required: true
  },
  licence: { // 布防车辆号码
    type: String,
    unique: true,
    required: true
  },
  level: { // 布控等级
    type: Number,
    required: true
  },
  startTime: Number, // 布控的开始时间
  endTime: Number, // 结束时间
  color: Number, // 布防车辆颜色
  brand: String, // 布防车辆品牌
  model: String,
  vehicleType: Number, // 布防车辆类型
  type: Number, // 布防类型(1:精准布控，2:黑名单)
  image: String, // 布防车辆图片保存地址
  direction: String, // 行车方向
  isDefenseAll: Boolean, // 是否全部布控
  videoChannels: [Number], // 视频通道集合
  state: { // 状态
    type: Number, // 1:正常，2：撤销
    default: 1
  }
})
mongoose.model('VehicleDefense', VehicleDefenseSchema)
