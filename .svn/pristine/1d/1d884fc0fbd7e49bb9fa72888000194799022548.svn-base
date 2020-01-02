/**
 * 报警预案模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlarmPlanSchem = new Schema({
  name: String, // 名称内容
  content: String, // 内容
  type: {
    type: String,
    enum: ['1', '2'] // 1. 报警预案, 2. 消防预案
  }
})
mongoose.model('alarmPlan', AlarmPlanSchem)
