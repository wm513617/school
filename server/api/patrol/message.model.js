/**
 * 巡更消息数据模型
 * @since: 2018-3-13
 * @author:hansne
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
  {
    // 用户名
    realName: {
      type: String
    },
    // 用户id
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Security'
    }
  },
  { _id: false }
)

const PatrolMessage = new Schema(
  {
    // 发送人
    sender: {
      type: String,
      required: true
    },
    // 发送人id
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'Security'
    },
    // 发送消息位置
    position: {
      type: String
    },
    // 巡更签到设备id
    devId: {
      type: Schema.Types.ObjectId,
      ref: 'PatrolPoint'
    },
    // 点位
    geo: {
      lon: Number,
      lat: Number
    },
    // 上传图片
    photo: {
      type: String
    },
    // 上传视频
    video: {
      type: String
    },
    // 消息标题
    title: {
      type: String,
      trim: true,
      maxlength: [64, '消息标题不能超过64个字符']
    },
    // 消息内容
    content: {
      type: String,
      trim: true,
      maxlength: [512, '消息内容不能超过512个字符']
    },
    // 消息收件人
    receiver: [User],
    // 时刻
    moment: {
      type: String
    },
    // 日期
    date: {
      type: Number
    },
    // 消息来源 pc|app
    platform: {
      type: String
    },
    // 消息类型  [0普通消息,1报警消息,2保修消息]
    type: {
      type: Number,
      default: 0
    },
    // 所属巡更任务
    task: {
      type: Schema.Types.ObjectId,
      ref: 'PatrolTask'
    },
    // 消息上层消息(消息关系使用)
    pid: {
      type: Schema.Types.ObjectId,
      ref: 'PatrolMessage'
    },
    // 报警预案名称
    planName: {
      type: String
    },
    // 报警预案id
    planId: {
      type: Schema.Types.ObjectId,
      ref: 'alarmPlan'
    },
    // 预案备注
    remark: {
      type: String
    },
    // 警情处理
    planDeal: {
      type: String
    },
    // 状态[0|未读，1|已读]
    status: {
      type: Number,
      default: 0,
      enumL: [0, 1]
    }
  },
  { timestamps: true }
)

mongoose.model('PatrolMessage', PatrolMessage)
