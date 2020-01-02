/*
 * @Author: wenhaoFu
 * @Date: 2019-07-01 15:11:28
 * @Last Modified by: wenhaoFu
 * @Last Modified time: 2019-08-07 10:34:38
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DutyTemplateSchema = new Schema(
  {
    // 公告内容
    notice: {
      type: String,
      required: '模板名称必填',
    }
  },
  { timestamps: true, collection: 'dutyNotice' }
)

mongoose.model('DutyNotice', DutyTemplateSchema)
