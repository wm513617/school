/**
 * 消防防区模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FireareaSchem = new Schema({
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  },
  org: {
    type: Schema.Types.ObjectId,
    ref: 'Org'
  },
  actionType: Number, // 1 视频联动、2门禁联动
  videoAction: [ // 视频联动
    {
      resource: {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      },
      org: {
        type: Schema.Types.ObjectId,
        ref: 'Org'
      },
      main: {
        type: Boolean, // 主摄像机
        default: false
      },
      client: {
        type: Boolean, // 客户端弹出视频
        default: false
      },
      tvwall: {
        type: Boolean, // 弹出电视墙
        default: false
      },
      map: {
        type: Boolean, // 电视墙弹出视频
        default: false
      },
      videotape: {
        type: Boolean, // 启动中心录像
        default: false
      }
    }
  ],
  doorServer: String, // 服务器id
  doorActions: [ // 门禁联动
    {
      type: Schema.Types.ObjectId,
      ref: 'AccessControl'
    }
  ]
})
mongoose.model('FireArea', FireareaSchem)
