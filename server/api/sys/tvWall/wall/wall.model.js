/*
 * 电视墙模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:06:25
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-08-31 17:13:40
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WallSchema = new Schema({
  name: { // 电视墙名称
    type: String,
    required: true,
    unique: true
  },
  layout: { // 电视墙布局id
    type: Schema.Types.ObjectId,
    ref: 'Layout'
  },
  position: { // 电视墙位置
    type: String
  },
  jointcontroller: {
    checked: Boolean,
    info: {
      manufacturer: String, // 厂商
      ip: String, // ip
      port: Number
    }
  }, // 拼接控制器
  defaultscene: { // 默认的场景id
    type: Schema.Types.ObjectId
  },
  selectedscene: { // 选中的场景id
    type: Schema.Types.ObjectId
  },
  rtscene: { // 实时场景id
    type: Schema.Types.ObjectId,
    ref: 'Scene'
  },
  selectedplan: { // 选中的预案id
    type: Schema.Types.ObjectId,
    ref: 'Plan'
  }
}, { timestamps: true })

mongoose.model('Wall', WallSchema)
