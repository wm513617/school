/*
 * 轮询模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:03:37
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-08-24 09:26:53
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PollingSchema = new Schema({
  name: { // 轮询名称
    type: String,
    required: true
  },
  code: Number, // 轮询组编号
  wall: { // 所属电视墙id
    type: Schema.Types.ObjectId,
    ref: 'Wall',
    required: true
  },
  interval: { // 轮询间隔
    type: Number,
    required: true
  },
  monitorsinfo: [
    { // 监视器id
      type: Schema.Types.ObjectId,
      ref: 'Monitor',
      required: true
    }
  ],
  channels: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Resource'
    }
  ], // 通道id数组
  pinyin: String // 拼音
}, { timestamps: true })

mongoose.model('Polling', PollingSchema)
