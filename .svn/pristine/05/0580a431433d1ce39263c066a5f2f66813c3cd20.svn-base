/*
 * @Author: linhang
 * @Date: 2019-07-15 16:18:55
 * @Last Modified by: linhang
 * @Last Modified time: 2019-07-24 15:34:21
 */

'use strict'
/**
 * 地图配置110呼叫中心服务器配置
 */
const mongoose = require('mongoose')
const ServerConfigSchema = new mongoose.Schema(
  {
    ip: {
      // 服务器ip
      type: String,
      default: ''
    },
    wsPort: {
      // 服务器websocket端口
      type: Number,
      default: -1
    },
    httpPort: {
      // 服务器http端口
      type: Number,
      default: -1
    },
    type: {
      // 服务器类型，默认为地图配置110呼叫中心服务器
      type: String,
      default: 'callCenter'
    },
    status: {
      // 服务器连接状态
      type: Boolean,
      default: false
    },
    userName: {
      // 服务器用户名
      type: String,
      default: ''
    },
    password: {
      // 服务器密码
      type: String,
      default: ''
    },
    skill: {
      // 坐席技能值
      type: Number,
      default: 1
    },
    heartbeat: {
      // 心跳
      type: Number,
      default: 0
    },
    prefix: {
      // 对外拨号前缀
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)
mongoose.model('serverconfig', ServerConfigSchema)
