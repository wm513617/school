/**
 * 车道模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LaneSchem = new Schema({
  name: String,
  code: String,
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  },
  pid: {
    type: Schema.Types.ObjectId, // 所属路口id
    ref: 'Crossing'
  },
  direction: String,
  passway: { // 出入口定义（0：普通 1  ：入口 2：出口）
    type: Number,
    default: 0,
    enum: [0, 1, 2]
  }
})
mongoose.model('Lane', LaneSchem)
