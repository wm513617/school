/*
 * @Author: dfk 
 * @Date: 2019-05-07 13:31:00 
 * @Last Modified by: dfk
 * @Last Modified time: 2019-05-07 15:56:00
 * 工单管理 存储工单序号  
 */

'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var workorderSchema = new Schema(
  {
    name: {
      // 查询固定字符 workorder
      type: String
    },
    serialNumber: {
      // 数据库中 最后的工单序号
      type: Number
    }
  },
  { timestamps: true }
)
mongoose.model('WorkOrder', workorderSchema)
