/*
 * @Author:
 * @Date: 2019-05-18
 * @Last Modified by:
 * @Last Modified time: 2019-05-18
 * @decription:单兵超时数据模型
 * @changeLog:
 *  统计单兵报警
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PatrolGeo = new Schema(
  {
    // 巡更点坐标位置
    geo: {
      type: Object,
      default: ''
    },
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'Security'
    },
    // 时间
    time: {
      type: Number
    },
    // 是否三分钟内报警
    alarm: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

mongoose.model('PatrolGeo', PatrolGeo)
