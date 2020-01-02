/*
 * 场景模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:05:24
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-06-11 15:39:53
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SceneSchema = new Schema({
  name: { // 场景名称
    type: String,
    required: true
  },
  wall: { // 所属电视墙id
    type: Schema.Types.ObjectId,
    ref: 'Wall',
    required: true
  },
  layout: { // 当前布局
    type: Schema.Types.ObjectId,
    ref: 'Layout'
  },
  polling: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Polling'
    }
  ],
  info: [{
    monitor: { // 监视器位置
      type: Schema.Types.ObjectId,
      ref: 'Monitor'
    },
    type: { // 屏幕类型
      type: Number,
      required: true,
      enum: [0, 1, 2] // 0:普通屏，1：轮询屏，2：报警屏
    },
    panecount: { // 几分割
      type: Number,
      required: true
    },
    resources: [
      {
        code: { // 窗格号
          type: Number,
          required: true
        },
        resource: {
          type: Schema.Types.ObjectId,
          ref: 'Resource'
        }
      }
    ]
  }],
  pinyin: String // 拼音
}, { timestamps: true })

mongoose.model('Scene', SceneSchema)
