/*
 * @Author: chenkaibo
 * @Date: 2018-06-05 14:24:28
 * @Last Modified by: linhang
 * @Last Modified time: 2019-01-05 17:19:42
 */
/**
 * 底库模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const VeriGroupSchem = new Schema({
  name: {
    type: String
  },
  desc: {
    type: String
  },
  type: {
    type: String,
    enum: ['defense', 'static'],
    default: 'defense'
  },
  color: {
    type: String,
    default: 'red'
  },
  alarmAudio: { // 布控音频
    type: String
  },
  similar: { // 相似度
    type: Number,
    default: 75
  }
  // isAuto: { // 一键布控
  //   type: Boolean,
  //   default: false
  // }
})
mongoose.model('VeriGroup', VeriGroupSchem)
