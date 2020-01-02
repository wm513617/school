
/**
 * 系统参数设置
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlatformSchema = new Schema({
  name: String, // 服务器名称
  ip: String, // 服务器ip
  port: Number, // 服务器端口
  status: { // 服务器状态
    type: String,
    enum: ['online', 'offline']
  }
})
mongoose.model('Platform', PlatformSchema)
