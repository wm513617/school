/*
 * @Author: zhangliubo
 * @Date: 2019-08-01 10:10:27
 * @Last Modified by:
 * @Last Modified time:
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SentryLog = new Schema(
  {
    // 单兵人员登陆名称
    name: {
      type: String
    },
    // 单兵人员真实名称
    realname: {
      type: String
    },
    // 时间（时间戳）
    time: {
      type: Number
    },
    // 用户手持设备的编号
    sn: {
      type: String
    },
    // 操作名称
    actionName: {
      type: String
    },
    // 操作内容
    actionContent: {
      type: String
    },
    // 状态
    status: {
      type: String
    },
    // 报班照片
    photo: {
      type: String
    },
    // 所属机构
    affiliation: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true
    }
  },
  { timestamps: true }
)

mongoose.model('SentryLog', SentryLog)
