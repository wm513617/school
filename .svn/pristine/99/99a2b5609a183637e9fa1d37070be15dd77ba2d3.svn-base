/**
 * 车辆统计信息表
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatisticsSchema = new Schema({
  time: Number, // 统计时间戳
  date: Number, // 统计时间戳(日期)
  hour: Number, // 统计时间（小时）
  count: Number, // 当前时间段通过车辆数量(默认最近一小时)
  // defendse: [{ // 各个布防类型 和 数量
  //   name: String,
  //   count: Number, // 同上
  // }],
  // color: Schema.Types.Mixed,
  // type: [{ // 各种车辆 和 数量
  //   name: String,
  //   // count: Number,  // 同上
  //   countAll: Number,
  //   channel: Schema.Types.Mixed,
  //   channelAll: Schema.Types.Mixed
  // }],
  // vcehicleListType: [{ // 车辆管理分类：0其他,1布控车辆,2白名单，3黑名单,4正常车辆
  //   name: Number,
  //   count: Number
  // }],
  vcehicleListEntry: [{ // 车辆管理分类：0其他,1布控车辆,2白名单，3黑名单,4正常车辆   -----(指定入口统计)
    name: String,
    code: Number,
    count: Number
  }],
  vehicleType: [{ // 车辆类型 4:小汽车，5:三轮车,6:巴士,7:面包车,8:卡车
    name: String,
    code: Number,
    count: Number
  }],
  channelType: [{
    channelid: Number, // 视频通道Id
    count: Number, // 过车数量
    resourceName: String,
    name: String, // 路口名称
    crossid: String, // 路口id
    lastImg: String, // 首页显示图片
    vehicleType: [{ // 每个通道对应的车辆类型统计
      name: String,
      code: Number,
      count: Number
    }]
  }],
  brandType: [{
    name: String, // 车辆品牌
    count: Number // 品牌数量
  }],
  defense: [{
    name: String, // 布控类型（目前是精准布控）
    code: Number,
    count: Number // 从凌晨开始到现在该布控类型数量
  }]
})

mongoose.model('Statistics', StatisticsSchema)
