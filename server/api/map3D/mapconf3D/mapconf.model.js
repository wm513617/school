/*
 * @Author: chenkaibo
 * @Date: 2018-07-11 10:20:26
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-12-18 09:31:23
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MapConf = new Schema({
  mapUrl: {
    // 地图url
    type: String
  },
  dataUrl: {
    // 数据服务
    type: String
  },
  dataSource: {
    // 数据源
    type: String
  },
  dataSet: {
    // 数据集
    type: String
  },
  // 图层名称
  layer: {
    type: String
  },
  // 视角
  perspective: {
    // 经度
    longitude: Number,
    // 纬度
    latitude: Number,
    // 模型高度
    height: Number,
    // 模型朝向角
    heading: Number,
    // 模型俯仰角
    pitch: Number,
    // 模型滚动角
    roll: Number
  }
})
mongoose.model('MapConf3D', MapConf)
