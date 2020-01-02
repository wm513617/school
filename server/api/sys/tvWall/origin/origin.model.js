/*
 * 源模型
 * @Author: chenkaibo
 * @Date: 2018-08-14 13:52:07
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-08-22 11:44:52
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Origin = new Schema({
  wall: { // 所属电视墙id
    type: ObjectId,
    ref: 'Wall'
  },
  decodechan: { // 解码通道
    type: ObjectId,
    ref: 'Resource'
  },
  jointorigin: { // 拼接控制器输入通道
    type: ObjectId,
    ref: 'Resource'
  }
})
mongoose.model('Origin', Origin)
