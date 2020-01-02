'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ActionSchema = new Schema({
  name: {
    // 名称
    type: String,
    required: true
  },
  // 模块类型，是功能模块(1),还是系统模块(2)
  moduleType: {
    type: String,
    enum: ['0', '1', '2']
  },
  url: {
    type: String
  },
  method: {
    // 方法
    type: String
  },
  tag: {
    // 标识
    type: String
  },
  pid: String, // 父ID
  icon: String, // icon
  isapi: {
    // 是否后台
    type: Boolean,
    default: false
  },
  order: {
    // 排序
    type: Number,
    default: 0
  }
})

mongoose.model('Action', ActionSchema)
