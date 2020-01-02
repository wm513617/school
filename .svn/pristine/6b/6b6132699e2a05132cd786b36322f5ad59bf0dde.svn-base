/*
 * @Author: linhang
 * @Date: 2019-07-25 15:43:06
 * @Last Modified by: linhang
 * @Last Modified time: 2019-09-16 16:11:45
 */

'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
/**
 * 机动车管理模型
 */
var PassVehicleSchema = new Schema(
  {
    cameraIndexCode: {
      // 抓拍机编号
      type: String,
      default: '',
      index: true
    },
    cameraName: {
      // 抓拍机名称
      type: String,
      default: ''
    },
    deviceIp: {
      // 抓拍机IP
      type: String,
      default: ''
    },
    devicePort: {
      // 抓拍机端口
      type: String,
      default: ''
    },
    orgId: {
      // 机构id
      type: String,
      default: ''
    },
    orgIndex: {
      // 机构编号
      type: String,
      default: ''
    },
    orgName: {
      // 机构名称
      type: String,
      default: ''
    },
    passTime: {
      // 过车时间
      type: String,
      default: ''
    },
    laneId: {
      // 车道号
      type: Number,
      default: 1
    },
    plateInfo: {
      // 车牌号码
      type: String,
      default: '',
      index: true
    },
    plateColor: {
      // 车牌颜色，1 其它颜色，2 白色，3 黄色，4 蓝色，5 黑色，6 绿色
      type: Number,
      default: 1
    },
    plateType: {
      // 车牌类型，1 无类型，2 92式民用车，3 警用车，4 上下军车，5 92 式武警车，6 左右军车，7 02式个性化车，8 黄色双行尾牌，9 04式新军车，10 使馆车
      // 11 一行结构的新WJ车,12 双行结构的新 WJ 车,13 黄色1225农用车,14 绿色1325农用车,15 黄色1325农用车,16 摩托车,17 教练车,18 临时行驶车
      // 19 挂车,20 领馆汽车,21 港澳出入车,22 临时入境车
      type: Number,
      default: 1,
      index: true
    },
    vehicleSpeed: {
      // 过车速度
      type: Number,
      default: -1,
      index: true
    },
    vehicleType: {
      // 车辆类型：1 其它车型，2 小型汽车，3 大型汽车，4 二轮车，5 三轮车，6 行人，7 电动车
      type: Number,
      default: 1,
      index: true
    },
    vehColorDepth: {
      // 车辆颜色深浅:1 深，2 浅
      type: Number,
      default: 1
    },
    vehicleColor: {
      // 车身颜色：1 其它颜色，2 白色，3 银色，4 灰色，5 黑色，6 红色，7 蓝色，8 黄色，9 绿色，10 棕色，11 粉色，12 紫色
      type: Number,
      default: 1,
      index: true
    },
    vehicleState: {
      // 行车状态：1 正常，2 非机动车，3 异常，4 残缺
      type: Number,
      default: 1
    },
    alarmAction: {
      // 违法代码：0 正常，1 闯红灯，2 违章变道，3 超越停止线停车，4 逆行，5 不按导向标志行驶，6 压停止线，7 违反禁令标志，8 违反禁止标线指示
      // 9 不按规定车道行驶，10 超速20%未达50%，11 超速50%及以上，12 机动车在非机动车道行驶，13 机动车违反规定使用专用车道，14 压线
      // 15 黄牌车禁限，16 超速未达20%
      type: Number,
      default: 0
    },
    limitSpeed: {
      // 限制速度
      type: String,
      default: ''
    },
    vehiclePic: {
      // 过车图片
      type: String,
      default: ''
    },
    date: {
      // 日期YYYY-MM-DD
      type: String,
      default: '',
      index: true
    },
    time: {
      // 过车时间，秒数时间戳
      type: Number,
      default: -1,
      index: true
    },
    eventType: {
      // 告警类型,1114642:违法停车,1114625:超速行驶
      type: String,
      default: '',
      index: true
    }
  },
  {
    timestamps: true
  }
)
mongoose.model('passvehicle', PassVehicleSchema)
