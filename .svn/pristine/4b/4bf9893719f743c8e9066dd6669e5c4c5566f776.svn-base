/*
 * @Author: linhang
 * @Date: 2018-09-10 09:22:44
 * @Last Modified by: linhang
 * @Last Modified time: 2018-09-13 19:51:39
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DutyLogSchema = new Schema(
  {
    // 事件名称
    name: {
      type: String,
      required: '事件名称必填'
    },
    // 时间
    time: {
      type: Number,
      required: '时间必填'
    },
    // 值班人
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'DutyStaff'
    },
    // 事件描述
    detail: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)

mongoose.model('DutyLog', DutyLogSchema)
