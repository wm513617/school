/*
 * 服务器日志模型 以天为单位存储
 * @Author: lushengying
 * @Date: 2018-08-29 10:54:45
 * @Last Modified by: lushengying
 * @Last Modified time: 2018-11-12 16:43:49
 */
'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var operationLogSchema = new Schema(
  {
    //  Ip
    ip: {
      type: String
    },
    //  设备Ip
    port: {
      type: String
    },
    //  日志类型 1 设备日志  2  录像日志  3平台服务日志
    LogType: {
      type: Number,
      enum: [1, 2, 3]
    },
    //  1-存储服务
    //  2-流媒体转发服务
    //  3-设备接入服务
    //  4-计划任务服务
    //  5-事件服务
    //  6-通知服务
    //  7-中心管理服务
    //  8-对讲服务器
    //  9- 登陆服务器
    //  10-web服务器
    //  11-中间件服务
    type: {
      type: String
    },
    //  通道
    channel: {
      type: Number
    },
    //  服务器名称
    serverName: {
      type: String
    },
    //  在线率
    onlineRate: {
      type: Number
    },
    //  日志
    Log: [
      {
        //  记录时间
        time: {
          type: Number
        },
        //  记录状态 1 上线 2 下线 3 断流
        type: {
          type: Number,
          enum: [1, 2, 3]
        }
      }
    ],
    //  离线时长
    offLine: {
      type: Number,
      default: 0
    },
    // 完整率
    RateStatus: {
      // 1:录像完整 2:录像缺失 3:记录缺失
      type: Number,
      default: 3
    },
    // 最后统计时间点
    lastTime: {
      type: Number
    },
    //  创建时间秒数
    createTime: {
      type: Number
    }
  },
  {
    timestamps: true
  }
)
mongoose.model('OperationLog', operationLogSchema)
