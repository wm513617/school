/*
 * @Author: linhang
 * @Date: 2018-12-06 14:19:04
 * @Last Modified by: linhang
 * @Last Modified time: 2019-03-30 15:04:26
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    // 抓拍图片,人脸图+全景图|face-full，人脸图|face
    pattern: {
      type: String,
      default: 'face'
    },
    // 抓拍模式 1|质量模式，2|全量模式
    output: {
      type: Number,
      enum: [1, 2],
      default: 1
    },
    // 是否开启路人库
    passby: {
      type: Boolean,
      default: true
    },
    // 抓拍图片保存天数
    saveTime: Number,
    // 路人库容量：万
    capacity: Number
  },
  { timestamps: true }
)
mongoose.model('FaceParameter', schema)
