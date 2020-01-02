/*
 * 地图图标库
 * @Author: lushengying
 * @Date: 2019-02-11 10:09:21
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-04-25 11:41:18
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Icon = new Schema({
  name: String, // 图标名称
  // type: {
  //   // 类型
  //   type: String,
  //   enum: ['video', 'alarm', 'alarmHelp', 'petrol', 'sentry', 'auxiliary']
  // },
  // category: {
  //   // 类别
  //   type: String,
  //   enum: [
  //     'bolt',
  //     'hemisphere',
  //     'fastball',
  //     'InfraredBolt',
  //     'panorama',
  //     'generalAlarm',
  //     'fireAlarm',
  //     'alarmBox',
  //     'alarmPillar',
  //     'general',
  //     'gather'
  //   ] // bolt:枪机, InfraredBolt:红外枪机, hemisphere:半球, fastball:快球, panorama: 全景 alarmBox：报警箱 alarmPillar：报警柱 generalAlarm:普通报警, fireAlarm:消防报警, general:常规, gather:集合
  // },
  files: [
    {
      status: {
        type: String,
        // 门禁 只有 open|开启  close|关闭  abnormal|异常
        // 除了门禁，其他有剩下的 4 种状态
        enum: ['online', 'offline', 'stopped', 'alarm', 'open', 'close', 'abnormal']
      },
      path: String // 图标文件
    }
  ],
  default: {
    // 默认图标
    type: Boolean,
    default: false
  },
  isDelete: {
    // 能否被删除
    type: Boolean,
    default: true
  },
  isRotate: {
    // 是否旋转
    type: Boolean,
    default: true
  },
  oid: {
    type: String
  }
})
mongoose.model('Icon', Icon)
