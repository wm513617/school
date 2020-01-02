/*
 * 楼层模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:42:15
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-07-05 11:28:31
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const StoreySchema = new Schema({
  name: { // 名称
    type: String,
    required: true
  },
  picture: { // 楼层图片
    name: { // 图片名称
      type: String,
      required: true
    },
    size: { // 图片大小
      width: Number,
      height: Number
    },
    path: { // 图片路径
      type: String
    }
  },
  desc: { // 楼层描述
    type: String
  },
  bid: { // 所属楼宇
    type: Schema.Types.ObjectId,
    ref: 'Building3D'
  },
  pid: { // 当前楼层负责人
    name: { // 负责人名称
      type: String
    },
    mobile: { // 负责人电话
      type: String
    }
  },
  mapId: {
    type: Schema.Types.ObjectId, // 承载底图
    ref: 'MapConf3D'
  }
}, { timestamps: true })

mongoose.model('Storey3D', StoreySchema)
