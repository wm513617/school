/*
 * @Author: linhang
 * @Date: 2018-10-15 13:56:00
 * @Last Modified by: linhang
 * @Last Modified time: 2018-12-19 11:47:09
 */
'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var StrategySchema = new Schema(
  {
    // 密码类型判断
    passwordType: {
      type: String,
      enum: ['low', 'weak', 'middle', 'strong'],
      required: '密码安全等级必填'
    },
    // 登录类型,1|账户登录，2|ukey登录，3|账户或者ukey，4|账户和ukey
    loginType: {
      type: Number,
      enum: [1, 2, 3, 4],
      default: 1
    },
    // 登录次数
    loginCount: {
      type: Number,
      required: '登录次数必填'
    },
    lockTime: {
      type: Number,
      required: '登录锁定时间必填'
    },
    initPassword: {
      type: String,
      required: '初始密码必填'
    },
    length: Number // 密码长度
  },
  { timestamps: true }
)

mongoose.model('Strategy', StrategySchema)
