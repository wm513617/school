/**
 * 报警延时模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlarmDelay = new Schema({
  delay: Number
})
mongoose.model('alarmDelay', AlarmDelay)
