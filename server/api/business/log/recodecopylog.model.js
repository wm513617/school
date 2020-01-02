/*
 * @Author: lushengying
 * @Date: 2019-05-10 10:46:01
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-05-13 10:35:55
 */
// 录像拷贝日志
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const resourceInfoSchema = new Schema({
  // 录像镜头
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  },
  // 开始拷贝时间
  startTime: {
    type: Number
  },
  // 结束拷贝时间
  endTime: {
    type: Number
  }
})
const RecodeCopyLogSchema = new Schema(
  {
    user: { // 值班人
      type: String
    },
    // 拷贝人
    name: {
      type: String
    },
    // 拷贝时间
    time: {
      type: Number
    },
    // 拷贝原因
    info: {
      type: String
    },
    // 拷贝镜头
    resourceList: [resourceInfoSchema],
    // 下班前是否交接
    associate: {
      type: Boolean
    },
    // 录像是否正常
    recodeStatus: {
      type: Boolean
    },
    // 备注
    mark: {
      type: String
    }
  },
  { timestamps: true }
)

mongoose.model('RecodeCopyLog', RecodeCopyLogSchema)
