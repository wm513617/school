/**
 * 车辆识别返回信息(新接口)
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VehicleIdentifySchema = new Schema({
  image: String, // 识别图片
  channelid: Number,
  brand: String, // 品牌
  model: String, // 型号
  color: Number, // 车身颜色
  licence: String, // 车牌
  // licenceColor: String, // 车牌底色
  vehicleType: Number, // 4:小汽车，5:三轮车,6:巴士,7:面包车,8:卡车
  vehicleList: Number, // 0其他,1布控车辆,2白名单,3黑名单,4正常车辆
  timeStamp: Number,
  defenseType: Number, // 布防类型(1:精准布控，2:黑名单)
  createTime: Number,
  createDateTime: Number
})

mongoose.model('VehicleIdentify', VehicleIdentifySchema)
