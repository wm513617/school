/*
 * @Author: zhangminbo
 * @Date: 2018-07-20 10:50:53
 * @Last Modified by: zhangminbo
 * @Last Modified time: 2018-08-01 14:32:51
 */
/**
 * 报警求助配置模型
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const confSchem = new Schema({
  device: {
    type: Schema.Types.ObjectId,
    ref: 'Device'
  }
})
mongoose.model('alarmHelpConf', confSchem)
