/*
 * 飞行路线模型
 * @Author: wanglei
 * @Date: 2019-04-11 14:45:49
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-04-19 16:07:25
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FlightSchema = new Schema({
  name: { // 飞行路线名称
    type: String,
    unique: true,
    required: true,
    maxlength: [64, '飞行路线名称不能超过64个字符']
  },
  // 视角类型  0|第一视角 1|跟随视角 2|上帝视角
  viewMode: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
  // 视角高度
  viewHeight: {
    type: Number,
    default: 2000,
    min: [500, '低于指定高度'],
    max: [7500, '超出指定高度']
  },
  speed: {
    type: Number,
    min: 0,
    max: 10,
    default: 5
  },
  isShowMarker: { // 是否显示标记 0|不显示 1|显示
    type: Number,
    enum: [0, 1],
    default: 0
  },
  isShowRoute: { // 是否显示路线 0|不显示 1|显示
    type: Number,
    enum: [0, 1],
    default: 1
  },
  isCircle: { // 是否显示循环漫游 0|不显示 1|显示
    type: Number,
    enum: [0, 1],
    default: 0
  },
  description: { // 描述
    type: String,
    maxlength: [100, '描述信息不能超过100个字符']
  },
  coordinates: [
    [
      Number, // 经度
      Number, // 纬度
      Number // 高度
    ]
  ]
}, { timestamps: true })

mongoose.model('Flight', FlightSchema)
