/*
 * @Author: linhang
 * @Date: 2018-10-17 10:07:52
 * @Last Modified by: linhang
 * @Last Modified time: 2019-07-18 14:06:29
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const changeDutyLogSchema = new Schema(
  {
    // 交班人
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    // 交班人
    takeUser: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    // 交接时间
    time: Number,
    // 上个用户的接班时间
    loginTime: Number,
    // 总接警任务
    allTask: Number,
    // 未处理接警任务
    undealTask: Number,
    // 值班日志
    logCount: Number,
    // 报警总数
    allAlarm: Number,
    // 未处理报警数
    undealAlarm: Number,
    // 备注
    remark: String,
    normalCount: Number, // 普通报警数量
    videoCount: Number, // 视频报警数量
    intelligentCount: Number, // 智能报警数量
    alarmHelpCount: Number, // 报警求助数量
    fireAlarmCount: Number, // 消防报警数量
    singleCount: Number, // 单兵报警数量
    systemExceptionCount: Number, // 系统异常数量
    manualAlarmCount: Number // 手工报警数量
  },
  { timestamps: true }
)
mongoose.model('changeDutyLog', changeDutyLogSchema)
