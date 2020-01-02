/**
 * 服务器配置模型
 * @time:2017-8-16
 * @author: hansen
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KoalaConfig = new Schema({
  // 服务器地址
  host: {
    type: String,
    required: true
  },
  // 服务器类型  0|人脸服务
  type: {
    type: Number,
    enum: [0],
    default: 0
  }
}, { timestamps: true })

mongoose.model('KoalaConfig', KoalaConfig)
