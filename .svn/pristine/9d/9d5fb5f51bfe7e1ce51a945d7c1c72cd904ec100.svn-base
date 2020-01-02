/*
 * @Author: hansen.liuhao
 * @Date: 2018-11-13 13:42:27
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2018-11-13 19:21:09
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Geo = new Schema(
  {
    moment: String, // 时刻
    lon: Number, // 经度
    lat: Number // 维度
  },
  { _id: false }
)

const PatrolTrajectory = new Schema(
  {
    // 单兵姓名
    realname: String,
    usrId: {
      type: Schema.Types.ObjectId,
      ref: 'Security'
    },
    // 单兵轨迹日期
    date: Number,
    // 单兵轨迹坐标
    trajectory: [Geo]
  },
  { timestamps: true }
)
mongoose.model('PatrolTrajectory', PatrolTrajectory)
