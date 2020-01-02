/**
 * 应急预案数据模型
 * @since: 2018-3-9
 * @author:hansne
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subDoc = new Schema(
  {
    name: {
      type: String
    },
    position: {
      type: String
    },
    phone: {
      type: String
    },
    index: {
      type: Boolean,
      default: true
    }
  },
  { _id: false }
)
const Plan = new Schema(
  {
    // 预案图片id
    planPhoto: {
      type: String,
      required: [true, '缺少预案图片']
    },
    // 预案图片名称
    photoName: {
      type: String,
      required: [true, '缺少预案图片名称']
    },
    // 备注
    remark: {
      type: String
    },
    // 预案类型名称
    plan: {
      type: String
    },
    // 预案名称
    name: {
      type: String
    },
    // 预案类型id
    planId: {
      type: String
    },
    // 预案人员
    group: {
      type: [subDoc]
    }
  },
  { timestamps: true }
)

// Plan.path('group').validate(function (value) {
//   return new Promise((resolve, reject) => {
//     this.model('EmergencyPlan').count({ group: value }, function (error, count) {
//       if (error) {
//         resolve(false)
//       } else {
//         resolve(!count)
//       }
//     })
//   })
// }, '管理人员已存在，请重新输入')

mongoose.model('EmergencyPlan', Plan)
