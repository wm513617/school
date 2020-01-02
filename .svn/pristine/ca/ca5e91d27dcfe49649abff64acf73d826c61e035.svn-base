/*
 * @Author: zhangminbo
 * @Date: 2018-08-14 10:00:37
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-12-21 13:57:07
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  type: {
    // 服务器分类
    type: String,
    enum: [
      'loc',
      'up',
      'down' // loc本地, up上级,down下级
    ]
  },
  isGB28181: {
    // 启用GB28181
    type: Boolean,
    default: false
  },
  name: {
    // 服务器名称
    type: String,
    required: true
  },
  serverId: {
    // 服务器ID
    type: String,
    default: '34020000001240000002'
  },
  SIP: {
    // SIP域
    type: String,
    default: '3402000000'
  },
  isSIP: {
    // SIP认证
    type: Boolean,
    default: false
  },
  userName: {
    // 用户名
    type: String
  },
  pwd: {
    // 密码
    type: String
  },

  ip: {
    // 服务器地址
    type: String
  },
  port: {
    // 端口
    type: Number,
    default: 7100
  },
  proto: {
    // 级联协议
    type: String,
    default: 'GB28181-2016',
    enum: ['GB28181-2016', 'GB28181-2009', 'GB28181-2011']
  },
  manufacturer: {
    // 厂商/型号
    type: String,
    default: 'hikvision',
    enum: ['hikvision', 'bstar', 'yushi']
  },
  expire: {
    // 注册有效期
    type: Number
  },
  headBeat: {
    // 心跳周期
    type: Number,
    default: 86400
  },
  beatTimes: {
    // 心跳超时次数
    type: Number,
    default: 3
  },
  shareData: {
    // 上联分享数据 (暂时用于回显)
    alarmOrg: [
      {
        // 分享报警机构
        type: Schema.Types.ObjectId,
        ref: 'Org'
      }
    ],
    alarmRes: [
      {
        // 分享报警资源
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      }
    ],
    videoOrg: [
      {
        // 分享视频机构
        type: Schema.Types.ObjectId,
        ref: 'Org'
      }
    ],
    videoRes: [
      {
        // 分享视频资源
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      }
    ]
  }
})
mongoose.model('PlatformServer', schema)
