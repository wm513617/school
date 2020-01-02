/*
 * 巡更消息数据模型
 * @Author: hansne
 * @Date: 2018-3-13
 * @Last Modified by: SongXiaoshan
 * @Last Modified time: 2019-10-17 17:11:33
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 对讲
const SpeechHistory = new Schema(
  {
    // 发送人
    webName: {
      type: String,
      required: true
    },
    // 手机名称
    appName: {
      type: String,
      required: true
    },
    // 日期
    startTime: {
      type: Number
    },
    endTime: {
      type: Number
    },
    // dsId
    dsId: {
      type: String,
      required: true

    },
    // sn
    sn: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
)

mongoose.model('SpeechHistory', SpeechHistory)

// 广播
const userInfo = new Schema({
  // sn
  sn: {
    type: String
  },
  // name
  name: {
    type: String
  }
})

const RadioHistory = new Schema(
  {
    // 开始时间
    startTime: {
      type: Number
    },
    // 结束时间
    endTime: {
      type: Number
    },
    // 发起人
    webName: {
      type: String,
      required: true,
      index: true
    },
    // 广播的ip地址
    dsIp: {
      type: String,
      required: true
    },
    // 类型
    taskType: {
      type: Number,
      required: true
    },
    // 单兵用户参与人
    phoneAudioInfo: [userInfo]
  },
  { timestamps: true }
)

mongoose.model('RadioHistory', RadioHistory)
