/*
 * @Author: linhang
 * @Date: 2018-10-17 10:07:52
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-11-12 20:04:09
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserLogSchema = new Schema(
  {
    // 用户名
    userName: {
      type: String
    },
    // 所属用户
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    // 登录时间
    loginTime: {
      type: Number,
      required: true
    },
    // 下线时间
    logoutTime: Number,
    // 在线时长
    onlineTime: Number,
    // 客户端类型
    clientType: {
      type: String,
      default: 'B/S',
      enum: ['B/S', 'C/S', 'mobile']
    },
    ip: String,
    mac: String,
    // 日志类型 扩展用途
    type: {
      type: String
    }
  },
  { timestamps: true }
)
mongoose.model('UserLog', UserLogSchema)
