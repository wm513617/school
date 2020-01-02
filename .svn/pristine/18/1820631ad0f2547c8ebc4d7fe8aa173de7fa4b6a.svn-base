/**
 * 人员通行底库数据模型
 * @time:2019-7-25
 * @author:MeiChen
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const portraitGroup = new Schema({
  name: {
    type: String
  },
  desc: {
    type: String
  },
  type: {
    type: String,
    enum: ['defense', 'static'],
    default: 'defense'
  },
  color: {
    type: String,
    default: 'red'
  },
  alarmAudio: { // 布控音频
    type: String
  },
  similar: { // 相似度
    type: Number,
    default: 75
  }
})
module.exports = mongoose.model('portraitGroup', portraitGroup, 'portraitGroup')
