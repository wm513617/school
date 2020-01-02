/*
 * @Author: linhang
 * @Date: 2019-07-15 16:18:55
 * @Last Modified by: linhang
 * @Last Modified time: 2019-09-21 17:16:08
 */

'use strict'
/**
 * 地图配置110呼叫中心坐席配置
 */
const mongoose = require('mongoose')
const TelephoneSchema = new mongoose.Schema(
  {
    name: {
      // 坐席名称
      type: String,
      default: ''
    },
    extension: {
      // 分机号
      type: String,
      default: ''
    },
    groupName: {
      // 坐席组名
      type: String,
      default: ''
    }
  },
  { timestamps: true }
)
mongoose.model('telephone', TelephoneSchema)
