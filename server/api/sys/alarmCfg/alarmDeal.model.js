/*
 * @Author: linhang
 * @Date: 2018-12-10 15:21:24
 * @Last Modified by: linhang
 * @Last Modified time: 2018-12-11 11:30:05
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    name: {
      type: String,
      unique: '名称不能重复'
    },
    page: {
      type: String,
      enum: ['fire', 'alarm']
    }
  },
  { timestamps: true }
)
mongoose.model('AlarmDeal', schema)
