/*
 * @Author: dfk
 * @Date: 2019-06-19 09:00:15
 * @Last Modified by: dfk
 * @Last Modified time: 2019-06-19 09:51:43
 */
'use strict'
let mongoose = require('mongoose')
let Schema = mongoose.Schema

let opsConfigSchema = new Schema(
  {
    // 新运维部署ip地址 目前手动修改
    opsIp: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)
mongoose.model('opsConfig', opsConfigSchema)
