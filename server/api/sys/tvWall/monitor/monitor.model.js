/*
 * 监视器模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:00:33
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-09-25 17:10:40
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MonitorSchema = new Schema({
  name: { // 监视器名称
    type: String,
    required: true
  },
  code: { // 用户输入的监视器编号
    type: String,
    required: true
  },
  equipment: { // 解码器设备
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  channel: { // 解码器通道
    type: Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  // jointorigin: { // 拼接控制器源
  //   type: Schema.Types.ObjectId,
  //   ref: 'Resource'
  // },
  position: { // 监视器位置
    type: Number
  },
  startcode: { // 窗格起始编号
    type: Number,
    required: true
  },
  wall: { // 所属电视墙
    type: Schema.Types.ObjectId,
    ref: 'Wall',
    required: true
  }
}, { timestamps: true })

mongoose.model('Monitor', MonitorSchema)
