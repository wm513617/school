/*
 * 设备报警模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:52:17
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-26 17:00:13
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DeviceAlarmSchema = new Schema(
  {
    eid: {
      // 所属设备
      type: Schema.Types.ObjectId,
      ref: 'Device'
    },
    orgId: {
      // 2.0新增
      type: Schema.Types.ObjectId,
      ref: 'Org'
    },
    name: {
      // 名称
      type: String
    },
    deviceType: Number, // 0:视频设备，5：解码器，1：报警主机
    chan: {
      // 通道号
      type: Number
    },
    alarmtemplate: {
      // 布撤防时间
      type: Schema.Types.ObjectId,
      ref: 'PlanTemplate'
    },
    level: {
      // 级别
      type: Number
    },
    alarmtype: {
      type: Schema.Types.ObjectId,
      ref: 'alarmType'
    },
    maxdelaytime: {
      // 最大延迟时间
      type: Number,
      default: 300
    },
    minintervaltime: {
      // 最小间隔时间
      type: Number,
      default: 300
    },
    alarmaffirm: {
      // 报警确认
      affirmflag: {
        type: Boolean
      },
      autoaffirm: {
        status: {
          type: Boolean
        },
        intervaltime: {
          type: Number // 时间间隔
        }
      },
      handaffirm: {
        status: {
          type: Boolean // 报警一级确认
        }
      },
      handaffirm2: {
        status: {
          type: Boolean // 报警二级确认2.0新增
        }
      }
    },
    subtype: String, // 报警子类型
    actionConfig: {
      // 是否进行了配置2.0新增
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

mongoose.model('DeviceAlarm', DeviceAlarmSchema)
