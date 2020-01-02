/*
 * @Author: hansen.liuhao
 * @Date: 2018-10-25 11:29:01
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-12-06 10:42:06
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PatrolWarnning = new Schema(
  {
    // 发起人
    sender: {
      type: String
    },
    // 接收人
    recipient: {
      type: String
    },
    // webName
    webName: {
      type: String
    },
    // 接收人id
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'Security'
    },
    // 接收人账号
    userName: {
      type: String
    },
    // 时间
    time: {
      type: Number
    },
    // 设备SN码
    sn: {
      type: String
    },
    // 存储服务器
    storage: {
      type: String
    },
    // 存储路径
    path: {
      type: String
    },
    // 单兵视频缓存
    uniqueId: {
      type: String
    },
    // 预案内容
    ackContent: {
      type: Object,
      default: ''
    },
    // 巡更点坐标位置
    geo: {
      type: Object
    }
  },
  { timestamps: true }
)

mongoose.model('PatrolWarnning', PatrolWarnning)
