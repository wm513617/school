/*
* 楼宇模型
* @Author: chenkaibo
* @Date: 2018-06-05 15:26:37
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-07-12 09:56:20
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
  charge: {
    type: String // 负责单位
  },
  height: Number,
  desc: { // 简介
    type: String
  },
  center: { // 楼宇中心点
    type: String
  },
  pid: [{ // 负责人
    name: { // 负责人名称
      type: String
    },
    mobile: { // 负责人电话
      type: String
    }

  }],
  mapId: {
    type: Schema.Types.ObjectId, // 承载底图
    ref: 'MapConf3D'
  }
}, { timestamps: true })

mongoose.model('Building3D', BuildingSchema)
