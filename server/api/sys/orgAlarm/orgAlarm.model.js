'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 机构资源中间表(仅用于智能报警)
var OrgAlarmSchema = new Schema({
  org: { // 关联的机构
    type: Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  resource: { // 关联的智能报警通道资源
    type: Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  alarmType: String // 报警类型
}, { timestamps: true })

mongoose.model('OrgAlarm', OrgAlarmSchema)
