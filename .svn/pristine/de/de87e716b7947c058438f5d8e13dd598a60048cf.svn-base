/*
 * @Author: hansen
 * @Date: 2019-03-19 09:31:21
 * @Last Modified by: hansen
 * @Last Modified time: 2019-03-19
 * @decription:单兵报警数据模型
 * @changeLog:
 *  统计单兵报警
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PatrolAlarming = new Schema(
  {
    // 日期
    date: {
      type: Number
    },
    // 报警类型
    eventType: {
      type: String
    },
    dealState: {
      type: String
    },
    // 照片
    photo: {
      type: String
    },
    // 电话
    phone: {
      type: String
    },
    // 发起人
    realname: {
      type: String
    },
    // 巡更点坐标位置
    geo: {
      type: Object
    },
    uniqueId: {
      type: String
    },
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'Security'
    },
    // 任务百分比
    precentage: {
      type: Number
    },
    // 点位
    position: {
      loc: {
        type: Number
      },
      atu: {
        type: Number
      }
    },
    // 时间
    time: {
      type: String
    },
    // 地图id
    // mapId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'Map'
    // },
    // 状态[0|未处理，1|已确认\已清除]
    status: {
      type: Number,
      default: 0,
      enumL: [0, 1]
    },
    // 预案内容
    ackContent: {
      type: Object,
      default: ''
    }
  },
  { timestamps: true }
)

mongoose.model('PatrolAlarming', PatrolAlarming)
