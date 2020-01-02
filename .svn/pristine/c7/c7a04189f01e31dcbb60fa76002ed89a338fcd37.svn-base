/*
 * @Author: linhang
 * @Date: 2018-09-10 09:23:03
 * @Last Modified by: linhang
 * @Last Modified time: 2018-09-18 17:09:03
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DutyTemplateSchema = new Schema(
  {
    // 模板名称
    name: {
      type: String,
      required: '模板名称必填',
      unique: true
    },
    // 模板编号
    code: {
      type: String,
      required: '模板编号必填',
      unique: true
    },
    // 创建时间
    time: {
      type: Number,
      required: '创建时间必填'
    },
    // 模板详情
    detail: [
      {
        // 班次名称
        shiftName: {
          type: String,
          required: '班次名称必填'
        },
        // 开始时间
        startTime: {
          type: String,
          required: '开始时间必填'
        },
        // 结束时间
        endTime: {
          type: String,
          required: '结束时间必填'
        }
      }
    ]
  },
  { timestamps: true }
)

mongoose.model('DutyTemplate', DutyTemplateSchema)
