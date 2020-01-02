/**
 * 路口模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CrossingSchem = new Schema({
  pid: Schema.Types.ObjectId, // 机构ID
  name: String, // 路口名称
  ico: String, // 路口图标
  code: String, // 路口编号
  laneNumber: Number, // 车道数量（只在方案一中使用）
  isshow: Boolean, // 是否显示示意图
  showType: Number, // 1电子地图,2 图片
  image: String
})
mongoose.model('Crossing', CrossingSchem)
