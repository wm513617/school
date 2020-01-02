/*
 * 地图列表配置模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:30:53
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-07-11 10:20:08
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MapListSchema = new Schema({
  extent: { // 地图范围
    type: Array
  },
  center: { // 中心点
    type: Array
  },
  zoom: { // 默认缩放级别
    type: Number,
    default: 0
  },
  mapName: { // 地图名称
    type: String
  },
  layerName: { // 发布服务名称
    type: String
  },
  matrixSet: { // 切片方案
    type: String
  },
  origin: { // 切片原点
    type: Array
  },
  mapUrl: { // 地图url
    type: String
  },
  mapType: { // 地图类型
    type: String
  },
  tileType: { // 切片类型
    type: String
  },
  projection: { // 投影坐标系
    type: String,
    default: 'EPSG:4326'
  },
  resolutions: [ // 分辨率
    {
      type: Number
    }
  ],
  gridSets: [ // 网格设置
    {
      type: String
    }
  ]
}, { timestamps: true })

mongoose.model('MapList', MapListSchema)
