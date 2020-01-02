'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const alarmRemark = new Schema(
  {
    alarmId: String,
    remarks: [
      {
        time: Number,
        remark: String
      }
    ]
  }
)
mongoose.model('AlarmRemark', alarmRemark)
