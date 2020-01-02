/*
 * @Author: hansen.liuhao
 * @Date: 2018-05-28 09:37:39
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-05-28 10:00:19
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Transication = new Schema({
  // 模块
  module: {
    type: String
  },
  // 操作类型
  method: {
    type: String
  },
  // 操作数据
  data: {
    type: String
  },
  // 集合名称
  table: {
    type: String
  },
  // 集合方法
  function: {
    type: String
  },
  // 集合操作opthins
  options: {
    type: String,
    default: ''
  },
  // 备注
  remark: {
    type: String
  }
}, { timestamps: true })
mongoose.model('Transication', Transication)
