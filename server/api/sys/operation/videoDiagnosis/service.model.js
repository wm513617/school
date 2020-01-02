/*
 * 服务器模型
 * @Author: lushengying
 * @Date: 2018-08-29 10:54:45
 * @Last Modified by: lushengying
 * @Last Modified time: 2018-10-24 14:16:22
 */
'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var serverSchema = new Schema(
  {
    name: {
      //  服务器名称
      type: String
    },
    ip: {
      // ip地址
      type: String
    },
    port: {
      // 设备端口
      type: Number
    },
    type: {
      // 服务器类型 0 诊断服务器
      type: Number
    },
    remark: {
      // 备注
      type: String
    }
  },
  {
    timestamps: true
  }
)
mongoose.model('Server', serverSchema)
