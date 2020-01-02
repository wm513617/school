/**
 * 报警配置模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FireAlarmCfgSchem = new Schema({
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  },
  actionVideo: [ // 视频联动
    {
      resource: {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      },
      channelName: String, // 监控点名称(通道名称)
      orgId: {
        type: Schema.Types.ObjectId,
        ref: 'Org'
      },
      mainCamera: {
        type: Boolean, // 主摄像机
        default: false
      },
      client: {
        type: Boolean, // 客户端弹出视频
        default: false
      },
      videoWall: {
        type: Boolean, // 弹出电视墙
        default: false
      },
      electronicMap: {
        type: Boolean, // 电视墙弹出视频
        default: false
      },
      record: {
        type: Boolean, // 启动中心录像
        default: false
      }
    }
  ],
  doorServer: String, // 服务器id
  actionDoor: [ // 门禁联动
    {
      type: Schema.Types.ObjectId,
      ref: 'AccessControl'
    }
  ]
})
mongoose.model('fireAlarmCfg', FireAlarmCfgSchem)
