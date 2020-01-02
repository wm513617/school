/*
 * @Author: chenkaibo
 * @Date: 2018-10-31 16:50:52
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-11-06 16:24:03
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Pole = new Schema({
  name: { // 点位名称
    type: String
  },
  code: Number, // 编号
  loc: { // 3d坐标
    type: String
  },
  principal: [{ // 负责人
    name: {
      type: String
    },
    mobile: {
      type: String
    }
  }],
  class: {
    type: String // 可见层级
  },
  mid: { // 模型id
    type: Schema.Types.ObjectId,
    ref: 'Model'
  },
  // 模型大小
  scale: {
    type: Number
  },
  // 模型高度
  height: {
    type: Number
  },
  // 模型朝向角
  heading: {
    type: Number
  },
  // 模型俯仰角
  pitch: {
    type: Number
  },
  // 模型滚动角
  roll: {
    type: Number
  }
})
mongoose.model('Pole', Pole)
