/*
 * 地图模型库
 * @Author: chenkaibo
 * @Date: 2018-10-28 17:01:00
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-04-22 10:35:20
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Model = new Schema({
  name: String, // 模型名称
  // type: { // 类型
  //   type: String,
  //   enum: ['video', 'alarm', 'alarmHelp', 'petrol', 'sentry', 'auxiliary']
  // },
  // category: { // 类别
  //   type: String,
  //   enum: ['bolt', 'hemisphere', 'fastball', 'InfraredBolt', 'panorama', 'generalAlarm', 'fireAlarm', 'alarmBox', 'alarmPillar', 'general', 'gather'] // bolt:枪机, InfraredBolt:红外枪机, hemisphere:半球, fastball:快球, panorama: 全景 alarmBox：报警箱 alarmPillar：报警柱 generalAlarm:普通报警, fireAlarm:消防报警, general:常规, gather:集合
  // },
  files: [
    {
      status: {
        type: String,
        enum: ['online', 'offline', 'alarm', 'stopped']
      },
      name: String, // 模型名称
      path: String // 模型文件
    }
  ],
  picture: {
    // 模型图片
    name: String, // 图片名称
    path: String // 图片id
  },
  default: {
    // 默认模型
    type: Boolean,
    default: false
  },
  isDelete: {
    // 能否被删除
    type: Boolean,
    default: true
  },
  oid: {
    type: String
  },
  brightness: { // 模型的亮度
    type: Number,
    default: 0
  },
  height: { // 模型离地高度
    type: Number,
    default: 0
  },
  scale: { // 模型大小
    type: Number,
    default: 1.0
  }
})
mongoose.model('Model', Model)
