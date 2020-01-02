/*
 * @Author: lushengying
 * @Date: 2019-05-10 10:46:01
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-05-10 14:01:16
 */
// 设备巡查日志
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const devInfoSchema = new Schema({
  // 设备Id
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device'
  },
  // 设备问题
  info: {
    type: String
  }
})
const DevpatrolSchema = new Schema(
  {
    // 检查人
    checkName: {
      type: String
    },
    // 巡人时间
    time: {
      type: Number
    },
    // 设备列表
    devList: [devInfoSchema],
    // 是否联系工程师
    contact: {
      type: Boolean
    },
    // 联系时间
    contactTime: {
      type: Number
    },
    // 工程师姓名
    engineerName: {
      type: String
    },
    // 联系电话
    phone: {
      type: String
    }
  },
  { timestamps: true }
)

mongoose.model('Devpatrol', DevpatrolSchema)
