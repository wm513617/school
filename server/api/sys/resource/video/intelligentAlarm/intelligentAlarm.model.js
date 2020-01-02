/*
 * 智能报警模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:53:30
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-26 16:59:59
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const IntelligentAlarmSchema = new Schema(
  {
    rid: {
      // 所属视频通道
      type: Schema.Types.ObjectId,
      ref: 'Resource'
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
    mapsign: {
      // 地图标识
      signflag: {
        type: Boolean
      },
      signtype: {
        type: Number,
        enum: [0, 1, 2] // 0:图标,1:线,2:区域
      },
      signvalue: {
        type: String
      }
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
      type: Boolean
    }
  },
  { timestamps: true }
)

mongoose.model('IntelligentAlarm', IntelligentAlarmSchema)
