/*
 * @Author: zhangminbo
 * @Date: 2018-07-20 10:50:53
 * @Last Modified by: linhang
 * @Last Modified time: 2019-04-19 15:30:57
 */
/**
 * 报警终端模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const confSchem = new Schema(
  {
    name: String, // 报警终端名称
    camerDevId: {
      type: Schema.Types.ObjectId,
      ref: 'Device'
    },
    serverDevId: {
      type: Schema.Types.ObjectId,
      ref: 'Device'
    },
    talkId: {
      // 对讲ID号
      type: Number,
      default: 0
    },
    talkIp: {
      // 对讲IP地址
      type: String,
      default: '0.0.0.0'
    },
    deviceType: String, // 设备类型alarmBox/alarmPillar
    // actionloc: {
    //   record: {
    //     type: Boolean,
    //     default: true
    //   },
    //   client: {
    //     type: Boolean,
    //     default: true
    //   }
    // },
    actionOutCtl: [
      // 基本配置
      {
        name: {
          type: String,
          default: '警笛'
        },
        status: {
          // 启用
          type: Boolean,
          default: false
        },
        beginTime: {
          // 开始时间
          type: Number,
          default: 0
        },
        endTime: {
          // 结束时间
          type: Number,
          default: 86399
        }
      },
      {
        name: {
          type: String,
          default: '警灯'
        },
        status: {
          // 启用
          type: Boolean,
          default: false
        },
        beginTime: {
          // 开始时间
          type: Number,
          default: 0
        },
        endTime: {
          // 结束时间
          type: Number,
          default: 86399
        }
      }
    ],
    // actionVideo: [
    //   {
    //     resource: {
    //       // 关联资源
    //       type: Schema.Types.ObjectId,
    //       ref: 'Resource'
    //     },
    //     client: {
    //       // 联动镜头
    //       type: Boolean,
    //       default: false
    //     },
    //     record: {
    //       // 开启录像
    //       type: Boolean,
    //       default: false
    //     }
    //   }
    // ],
    orgId: {
      type: Schema.Types.ObjectId,
      ref: 'Org'
    }, // 机构id
    actionConfig: {
      // 是否进行了配置2.0新增
      type: Boolean
    },
    // 手动一级确认
    handaffirm: {
      status: {
        type: Boolean,
        default: true
      }
    },
    // 手动二级确认2.0新增字段
    handaffirm2: {
      status: {
        type: Boolean,
        default: false
      }
    },
    level: {
      type: Number,
      default: 1
    } // 报警级别2.0
  },
  { timestamps: true }
)
mongoose.model('alarmClient', confSchem)
