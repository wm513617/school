/**
  * 人员通行User数据模型
  * @time:2019-7-16
  * @author:MeiChen
  */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const exportSchema = new Schema({
  timeMS: { // 时间
    type: Number,
    required: true
  },
  url: { // ZIP包存的路径
    type: String
  },
  status: { // zip包状态，是否已经压缩完成 true 是 false 否
    type: Boolean
  }
})
module.exports = mongoose.model('studentsExport', exportSchema, 'studentsExport')
