/*
* 楼宇模型
* @Author: chenkaibo
* @Date: 2018-06-05 15:26:37
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-10-25 10:36:28
*/

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BuildingSchema = new Schema({
  name: { // 楼宇名称
    type: String,
    unique: true,
    required: true
  },
  code: { // 楼宇编号
    type: String,
    required: true
  },
  mapId: {
    type: Schema.Types.ObjectId, // 承载底图
    ref: 'MapList'
  },
  projection: { // 位置坐标——投影坐标系
    type: String,
    default: 'EPSG:4326'
  },
  charge: {
    type: String // 负责单位
  },
  desc: { // 简介
    type: String
    // required: true
  },
  picture: { // 楼宇封面介绍图
    name: { // 图片名称
      type: String
    },
    path: { // 图片路径
      type: String
    }
  },
  center: { // 楼宇中心点
    type: String
  },
  scope: { // 坐标范围
    type: String
  },
  gid: { // 所属网格
    type: Schema.Types.ObjectId,
    ref: 'Grid'
  },
  // 通讯分组
  addressBookId: {
    type: Schema.Types.ObjectId,
    ref: 'AddressBook'
  },
  // 负责人
  pid: [{
    type: Schema.Types.ObjectId,
    ref: 'Principal'
  }],
  loc: { // 二位地理坐标数组
    type: String
  },
  sids: [{ // 该楼宇下的所有楼层
    type: Schema.Types.ObjectId,
    ref: 'Storey'
  }],
  rgbcolor: { // 颜色
    type: String
  },
  style: {
    borderstyle: { // 边框样式
      type: String
    },
    borderwidth: { // 边框宽度
      type: String
    },
    bordercolor: { // 边框颜色
      type: String
    },
    bodertransparency: { // 边框透明度
      type: Number
    },
    fillcolor: { // 填充颜色
      type: String
    },
    fillcolortransparency: { // 填充透明度
      type: Number
    },
    font: { // 字体
      type: String
    },
    fontcolor: { // 字体颜色
      type: String
    },
    fontregular: { // 字体粗细
      type: String
    },
    fontsize: { // 字体大小
      type: String
    }
  }
}, { timestamps: true })

mongoose.model('Building', BuildingSchema)
