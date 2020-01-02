/*
 * @Author: hansen
 * @Date: 2019-04-25 09:31:21
 * @Last Modified by: hansen
 * @Last Modified time: 2019-03-19
 * @decription:单兵报警配置数据模型
 * @changeLog:
 *  统计单兵报警
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PatrolSetting = new Schema(
  {
    // 米数
    meter: {
      type: Number,
      default: 10
    },
    // 时长
    duration: {
      type: Number,
      default: 10
    },
    // 启用
    start: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

mongoose.model('PatrolSetting', PatrolSetting)
