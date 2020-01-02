/*
 * 路线表
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:20:54
 * @Last Modified by:   chenkaibo
 * @Last Modified time: 2018-06-06 14:20:54
 */
'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var LineSchema = new Schema({
  name: String, // 线路名称
  res: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Resource'
    }
  ]
}, { timestamps: true })

mongoose.model('Line', LineSchema)
