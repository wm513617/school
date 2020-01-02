/**
 * 报警配置模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FireAlarmCfgSchem = new Schema(
  {
    resource: {
      type: Schema.Types.ObjectId,
      ref: 'Resource',
      index: true
    },
    // 1.报警输入 2.智能报警 3.监控点报警 4.报警主机 5.消防报警 6.设备报警 7.报警求助 8.智能交通 9.人像布控（4~9属于2.0新增）
    type: Number,
    spare: String, // 备用字段，用作特殊业务
    actionVideo: [
      // 视频联动
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
          type: Boolean, // 电子地图
          default: false
        },
        record: {
          type: Boolean, // 启动中心录像
          default: false
        },
        cloud: {
          status: {
            type: Boolean,
            default: false
          },
          // 联动方式以及内容 "{"ctrlCmdEnum":"gotoPreset","presetIndex":1}" or "{"ctrlCmdEnum":"runSeq","route":1}" or "{"ctrlCmdEnum":"cruise","route":1}"
          actionDetail: String
        }
      }
    ],
    actionOutCtl: [
      // 联动输出控制
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: 'Resource'
        },
        outPutName: String, // 输出端名字
        outPutOrg: {
          type: Schema.Types.ObjectId,
          ref: 'Org'
        },
        runMode: Number, // 执行方式 0手动/1自动
        runAction: Number, // 执行动作 0打开/1关闭
        overlayIcon: Boolean // 叠加图标
      }
    ],
    // 联动邮件2.0
    actionEmail: {
      receiver: String,
      content: String
    },
    // 联动电视墙2.0
    actionWall: {
      wall: {
        type: Schema.Types.ObjectId,
        ref: 'Wall'
      },
      scene: {
        type: Schema.Types.ObjectId,
        ref: 'Scene'
      }
    },
    actionRule: [
      {
        // 报警规则
        status: Boolean, // 状态
        beginTime: Number, // 开始时间
        endTime: Number, // 结束时间点
        actionVideo: Boolean, // 联动视频
        actionOutPut: Boolean, // 报警输出
        actionEmail: Boolean, // 联动邮件2.0新增
        actionWall: Boolean // 联动电视墙
      }
    ]
  },
  {
    timestamps: true
  }
)
mongoose.model('alarmCfg', FireAlarmCfgSchem)
