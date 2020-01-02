/*
 * @Author: linhang
 * @Date: 2018-10-15 19:10:27
 * @Last Modified by: linhang
 * @Last Modified time: 2018-12-19 17:31:00
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: '用户名必填',
      unique: true
    },
    pwd: {
      type: String,
      required: '密码必填'
    },
    realName: String,
    // 过期时间（时间戳）, -1 无限期
    exptime: {
      type: Number,
      default: -1
    },
    // 用户级别
    level: {
      type: Number,
      default: 1
    },
    // 角色
    role: {
      type: Schema.Types.ObjectId,
      ref: 'Role'
    },
    // 是否值班用户
    duty: {
      type: String,
      default: 'no'
    },
    ukey: String,
    order: Number
  },
  { timestamps: true }
)

mongoose.model('User', UserSchema)
