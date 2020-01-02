/*
 * @Author: linhang
 * @Date: 2018-08-17 15:29:54
 * @Last Modified by: linhang
 * @Last Modified time: 2018-09-17 15:30:20
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 机构系统校时表
var ProofSchema = new Schema({
  // 校时设备分类
  type: {
    type: String
  },
  // 是否勾选前端设备
  deviceSelected: {
    type: Boolean,
    default: false
  },
  // 是否勾选启用自动校时
  autoProof: {
    type: Boolean,
    default: false
  },
  // 执行周期,比如7，每隔七天执行一次
  cycle: Number,
  // 执行时间，单位s
  execTime: Number
})

mongoose.model('Proof', ProofSchema)
