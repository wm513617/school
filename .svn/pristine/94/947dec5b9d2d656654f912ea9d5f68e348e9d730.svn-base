/**
 * 报警预案模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlarmTypeSchem = new Schema({
  status: {
    type: Boolean,
    default: true
  }, // 状态
  normalPicId: String, // 正常图片
  actionRule: [{ // 报警规则
    status: {
      type: Boolean,
      default: true
    }, // 状态
    beginTime: Number, // 开始时间
    endTime: Number, // 结束时间点
    actionVideo: {
      type: Boolean,
      default: true
    }, // 联动视频
    actionOutPut: {
      type: Boolean,
      default: true
    } // 输出视频
  }],
  alarmPicId: String, // 报警图片
  alarmLevel: Number, // 报警级别
  maxDelay: {
    type: Number,
    default: 300
  }, // 最大延时
  minInterval: {
    type: Number,
    default: 300
  }, // 最小间隔
  name: String, // 分类名称
  alarmAffirm: { // 报警确认
    status: {
      type: Boolean,
      default: true
    }, // 状态
    autoAffirm: { // 自动确认
      status: {
        type: Boolean,
        default: false
      },
      maxDelay: {
        type: Number,
        default: 120
      }
    },
    manualAffirm: { // 手工开启
      status: {
        type: Boolean,
        default: true
      },
      continueRecord: {
        type: Boolean,
        default: false
      }
    }
  },
  timeTemplate: { // 时间模板
    type: Schema.Types.ObjectId,
    ref: 'alarmTimeTemplate'
  }
})
mongoose.model('alarmType', AlarmTypeSchem)
