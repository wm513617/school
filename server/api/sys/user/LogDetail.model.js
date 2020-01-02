/*
 * @Author: linhang
 * @Date: 2018-10-17 10:07:52
 * @Last Modified by: linhang
 * @Last Modified time: 2018-11-26 11:04:31
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LogDetailSchema = new Schema(
  {
    // 用户名
    userName: {
      type: String,
      index: true
    },
    // 操作时间
    time: {
      type: Number,
      index: true
    },
    clientIp: String,
    // 日志类别,1|操作日志，2|管理日志
    logType: {
      type: String,
      index: true
    },
    // 操作模块
    module: String,
    // 操作名称
    operateName: String,
    // 操作内容
    operateContent: {
      type: String,
      index: true
    },
    // 操作对象
    target: {
      type: String,
      index: true
    },
    // 操作通道所属设备IP
    deviceIp: String,
    // 操作状态1|成功，2|失败
    state: {
      type: String,
      index: true
    }
  },
  { timestamps: true }
)
mongoose.model('LogDetail', LogDetailSchema)
