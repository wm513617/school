/*
 * 设备扩展信息数据模型
 * @Author: lushengying
 * @Date: 2018-08-29 10:54:45
 * @Last Modified by: lushengying
 * @Last Modified time: 2018-10-15 18:24:55
 */
'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DeviceExtendSchema = new Schema(
  {
    eid: {
      // 所属设备
      type: Schema.Types.ObjectId,
      ref: 'Device'
    },
    rid: {
      // 所属资源
      type: Schema.Types.ObjectId,
      ref: 'Resource'
    },
    aid: {
      // 所属报警箱/报警柱
      type: Schema.Types.ObjectId,
      ref: 'alarmClient'
    },
    serverName: {
      // 所属服务器
      type: String
    },
    type: {
      // 扩展信息类型 0 :摄像机  1 :录像机  2 :报警主机  3 :消防主机  4 :报警探头  5 :消防探头  6 :报警柱   7 : 报警箱 8 : 闸机 9 : 解码器   10 : 网络键盘   11 :拼接控制器  12 :  服务器
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    // 一: 基础信息
    // 建设时间
    constructTime: {
      type: Number
    },
    //  经度
    longitude: {
      type: String,
      default: ''
    },
    //  纬度
    latitude: {
      type: String,
      default: ''
    },
    //  安装位置
    InstallPosition: {
      type: String,
      default: ''
    },
    // 二: 扩展信息
    //  警区
    district: {
      type: String,
      default: ''
    },
    //  位置类型扩展
    locationExtension: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      //  0:空,1:省际检查站,2:党政机关,3:车站码头,4:中心广场,5:体育场馆,
      //  6:商业中心,7:宗教场所,8:校园周边,9:治安复杂区域,10:交通干线,
    },
    //  安装位置
    site: {
      type: Number,
      enum: [0, 1, 2],
      //  0:空 1:室内 2:室外
      default: 0
    },
    //  摄像机用途
    usage: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3]
      //  0:空,1:治安,2:通 ,3:重点
    },
    //  摄像机补光
    fill: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3]
      //  0:空,1:无补光，2:红外补光，3:白光补光
      //
    },
    //  监控方位
    monitoPosition: {
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      //  0:空， 1 :东，2 :南，3 :西，4 :北，5 :东南，6 :东北，7 :西南，8 :西北
    },
    // 支持国标
    supportGB: {
      type: Number,
      enum: [0, 1, 2],
      //  0:空，1:是，2:否
      default: 0
    },
    // 是否可控
    controllable: {
      type: Number,
      enum: [0, 1, 2],
      //  0:空，1:是，2:否
      default: 0
    },
    // 三:维保信息
    //  维保厂商
    maintenanceVendor: {
      type: String
    },
    //  联系人
    contacts: {
      type: String
    },
    //  联系电话
    phone: {
      type: String
    },
    //  邮箱地址
    email: {
      type: String
    },
    //  维保开始时间(秒)
    startTime: {
      type: Number
    },
    //  维保结束时间
    endTime: {
      type: Number
    }
  },
  {
    timestamps: true
  }
)

mongoose.model('DeviceExtend', DeviceExtendSchema)
