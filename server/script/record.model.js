/*
 * @Author: lushengying
 * @Date: 2019-06-06 14:11:29
 * @Last Modified by:   lushengying
 * @Last Modified time: 2019-06-06 14:11:29
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema(
  {
    // 是否启用计划
    enable: {
      type: String
    },
    // 录像计划类型（定时录像|事件录像）
    takeType: {
      type: String,
      enum: ['timeVideo', 'eventVideo'],
      index: true
    },
    // 录像码流
    streamType: {
      type: String,
      enum: ['main', 'sub1', 'sub2']
    },
    // 对应的通道资源Id
    resource: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      index: true
    },
    RateStatus: {
      type: Number, // 在线率是否异常 1: 正常 2：非正常 3：无记录
      default: 3
    }
  },
  { timestamps: true }
)

mongoose.model('Record', recordSchema)
