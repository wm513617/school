/*
 * 监控点报警模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:56:06
 * @Last Modified by: linhang
 * @Last Modified time: 2019-12-26 14:55:55
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MonitoryPointAlarmSchema = new Schema(
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
          type: Boolean,
          default: false
        },
        intervaltime: {
          type: Number // 时间间隔
        }
      },
      // 手动一级确认
      handaffirm: {
        status: {
          type: Boolean,
          default: false
        }
      },
      // 手动二级确认2.0新增字段
      handaffirm2: {
        status: {
          type: Boolean,
          default: false
        }
      }
    },
    subtype: String, // 报警子类型2.0新增字段
    // 是否进行了配置2.0新增
    actionConfig: Boolean
  },
  {
    timestamps: true
  }
)

mongoose.model('MonitoryPointAlarm', MonitoryPointAlarmSchema)
