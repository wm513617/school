/**
 * 服务器配置
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ServerSettingSchema = new Schema({
  name: String, // 服务器名称
  code: String, // 服务器编号
  vender: String, // 算法厂家
  model: String, // 算法型号
  ip: String, // 服务器ip
  port: Number, // 服务器端口
  webport: Number, // web服务器端口
  username: String, // 用户名
  password: String, // 密码
  type: {
    type: Number,
    enum: [0, 1] // 0人脸 1车辆
  }
})
mongoose.model('ServerSetting', ServerSettingSchema)
