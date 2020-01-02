/*
 * @Author: hansen.liuhao
 * @Date: 2018-10-19 09:31:21
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified by: litao
 * @Last Modified time: 2019-05-14 13:42:55
 * @decription:巡更记录数据模型
 * @changeLog:
 *  巡更记录点位签到节点增加了关联巡更消息
 *  添加巡更超时记录表
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Pointe = new Schema(
  {
    // 巡更点位id
    pointId: {
      type: Schema.Types.ObjectId,
      ref: 'PatrolPoint',
      required: true
    },
    // 巡更点位名称
    pointName: {
      type: String,
      required: true
    },
    // 巡更点位设备固定的编码
    devId: {
      type: String
    },
    // 巡更点坐标位置
    geo: {
      type: String,
      default: ''
    },
    // 巡更点位任务设置的巡更时间
    patrolTime: {
      type: String
    },
    // 巡更点位人员签到时间
    arrivalTime: {
      type: String,
      default: ''
    },
    // 巡更点签到消息
    message: {
      type: Schema.Types.ObjectId,
      ref: 'PatrolMessage'
    },
    // 点位处理类型 [1|报警, 2|保修, 3|已巡更, 4|超时, 5|待巡更,6|报警超时,7|报修超时,8|报警巡更,9|报修巡更,10|网络异常]
    status: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      default: 5
    }
  },
  { _id: false }
)

const PatrolRecord = new Schema(
  {
    // 任务名称
    taskTitle: {
      type: String,
      required: true
    },
    // 所属任务id
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'PatrolTask'
    },
    // 任务类型 [1|固定模式，2|浮动模式]
    taskType: {
      type: Number,
      required: true,
      enum: [1, 2]
    },
    // 浮动时间
    rangTime: {
      type: Number,
      default: 0
    },
    // 开始时间
    startTime: {
      type: String
    },
    // 结束时间
    endTime: {
      type: String
    },
    // 用户名
    realName: {
      type: String,
      required: true
    },
    // 用户id
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'Security'
    },
    // 日期
    date: {
      type: Number
    },
    // 任务完成状态
    precentage: {
      type: Number,
      default: 0
    },
    // 巡更点报警汇总
    alarm: {
      type: Number,
      default: 0
    },
    // 单兵一键报警汇总
    alarmSentry: {
      type: Number,
      default: 0
    },
    // 巡更点报修点汇总
    warranty: {
      type: Number,
      default: 0
    },
    // 巡更点超时汇总
    timout: {
      type: Number,
      default: 0
    },
    // 巡更点位
    points: [Pointe]
  },
  { timestamps: true }
)

mongoose.model('PatrolRecord', PatrolRecord)

const PatorlTimeoutRecord = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    timeoutcount: {
      type: Number,
      default: 0
    },
    alarmCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

mongoose.model('PatorlTimeoutRecord', PatorlTimeoutRecord)
