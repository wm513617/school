/*
 * @Author: linhang
 * @Date: 2018-09-10 09:23:16
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-08-08 11:42:51
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const resourceSchema = new Schema({
  // 资源通道
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  },
  // 开始时间
  startTime: {
    type: Number
  },
  // 结束时间
  endTime: {
    type: Number
  }
})

const trackingSchema = new Schema(
  {
    // 名称
    name: {
      type: String
    },
    // 备注
    mark: {
      type: String
    },
    // 相关摄像头列表
    resourceList: {
      type: [resourceSchema],
      default: []
    },
    // 地图相关摄像头列表
    mapList: {
      type: [resourceSchema],
      default: []
    },
    // 是否关闭
    close: {
      type: Boolean,
      default: false
    },
    // 事件关联
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'AlarmEvent'
    },
    isSave: {
      type: Number,
      validate: val => [0, 1, 2, 3].includes(val), // 0 未进行保存, 1 保存中, 2 保存成功, 3 保存失败
      default: 0
    }
  },
  { timestamps: true }
)

mongoose.model('tracking', trackingSchema)
