/**
 * 消防配置模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AlarmLevelSchem = new Schema({
  intelligentMsgGlitterTime: Number,
  level: Number,
  msgColour: String,
  msgVoice: String,
  mapIcoGlitterTime: Number,
  policeWhistleNameID: String, // 警笛文件id
  playTime: Number
})
mongoose.model('alarmLevel', AlarmLevelSchem)
