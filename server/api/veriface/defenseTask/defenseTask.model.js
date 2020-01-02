/*
 * 布控任务
 * @Author: chenkaibo
 * @Date: 2018-12-07 09:56:33
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-12-20 14:56:59
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DefenseTask = new Schema({
  name: {
    type: String
  },
  groups: [
    {
      type: Schema.Types.ObjectId,
      ref: 'VeriGroup'
    }
  ],
  startTime: {
    type: Number
  },
  endTime: {
    type: Number
  },
  reason: { // 布控原因
    type: String
  },
  remark: { // 备注
    type: String
  },
  always: { // 长期布控
    type: Boolean
  },
  vaild: { // 是否有效
    type: Boolean,
    default: true
  },
  points: [
    { // 布控点位
      type: Schema.Types.ObjectId,
      ref: 'Resource'
    }
  ],
  cameraCfg: {
    pixel: Number, // 最小人脸像素
    interval: Number,
    ambiguity: Number, // 模糊度
    pitch: Number, // 俯仰角
    yaw: Number, // 偏航角
    roll: Number // 翻滚角
  }
})
mongoose.model('DefenseTask', DefenseTask)
