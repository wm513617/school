/*
 * @Author: linhang
 * @Date: 2018-12-16 11:15:37
 * @Last Modified by: linhang
 * @Last Modified time: 2019-04-04 10:37:08
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const schema = new Schema(
  {
    algorithm: String, // 算法
    name: String, // 服务器名称
    code: String, // 编号
    limit: Number,
    AnalysisType: {
      type: String,
      default: 'video'
    },
    ip: String,
    port: String,
    res: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      }
    ],
    rtspIp: {
      // rtspIp 临时存储的数据,后期要改
      type: String
    }
  },
  { timestamps: true }
)
mongoose.model('FaceServer', schema)
