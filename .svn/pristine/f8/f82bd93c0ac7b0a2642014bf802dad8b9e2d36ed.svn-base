/**
 * 路口统计车辆分类记录表
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StatisticsCrossSchema = new Schema({
  'crossName': String, // 路口名称
  'countAll': Number, // 统计总数
  'crossId': String, // 统计总数
  'date': Number, // 统计日期
  'car': Number, // 小汽车
  'trike': Number, // 三轮车
  'bus': Number, // 巴士车
  'minibus': Number, // 面包车
  'truck': Number // 卡车
})

mongoose.model('StatisticsCross', StatisticsCrossSchema)
