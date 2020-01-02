/**
 * 车辆管理
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VehicleSchema = new Schema({
  licence: {
    type: String,
    unique: true,
    required: true
  }, // 车辆号码
  color: Number, // 车辆颜色
  brand: String, // 车辆品牌
  model: String, // 型号
  type: Number, // 车辆分类 4:小汽车，5:三轮车,6:巴士,7:面包车,8:卡车
  list: Number, // （黑白名单：0其他,1布控车辆,2白名单，3黑名单,4正常车辆）
  image: String, // 车辆图片保存地址
  owner: String, // 驾驶员姓名
  tel: String, // 驾驶员电话
  cardID: String // 证件号
})
mongoose.model('Vehicle', VehicleSchema)
