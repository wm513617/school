/*
 * @Author: zhangminbo
 * @Date: 2018-07-20 10:50:53
 * @Last Modified by: zhangminbo
 * @Last Modified time: 2018-08-01 13:52:20
 */
/**
 * 接警中心模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const confSchem = new Schema({
  name: String, // 接警中心名称
  alarmHostId: {
    type: Schema.Types.ObjectId,
    ref: 'Device'
  },
  talkIp: { // 对讲台麦IP地址
    type: String,
    default: '0.0.0.0'
  },
  talkId: { // 对讲台麦ID号
    type: Number,
    default: 0
  }
})
mongoose.model('alarmReceive', confSchem)
