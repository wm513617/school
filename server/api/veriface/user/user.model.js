/*
 * @Author: zhangminbo
 * @Date: 2018-06-05 14:23:59
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-01-07 13:47:32
 */
/**
 * SDK人员模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SdkInfo = new Schema(
  {
    // sdk照片id
    id: Number,
    // sdk服务器信息
    host: {
      ip: String,
      port: Number
    }
  },
  { _id: false }
)

const schem = new Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['0', '1', '2'], // 1:女, 2:男
    default: '0'
  },
  age: {
    type: Number
  },
  code: {
    type: String
  },
  remark: {
    type: String
  },
  sdkImgInfos: [SdkInfo],
  group: {
    type: Schema.Types.ObjectId,
    ref: 'VeriGroup'
  },
  image: {
    type: String // 图片path
  }
})
mongoose.model('VeriUser', schem)
