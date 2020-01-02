/*
 * 布局模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:58:10
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-09-25 17:02:07
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LayoutScheme = new Schema({
  name: { // 电视墙布局名称
    type: String,
    required: true
  },
  sceneid: Number, // 拼控的场景id
  // screenwidth: Number, // 单个屏宽度
  // screenheight: Number, // 单个屏高度
  screeninfo: { // 物理屏信息
    width: Number, // 单个屏宽度
    height: Number, // 单个屏高度
    hinterval: Number, // 纵向间隙
    vinterval: Number // 横向间隙
  },
  wininfo: [
    {
      winnumber: Number, // 屏编号
      // monitor: {
      //   type: Schema.Types.ObjectId,
      //   ref: 'Monitor'
      // }, // 监视器
      jointorigin: {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      }, // 拼接控制源
      left: Number,
      right: Number,
      top: Number,
      bottom: Number
    }
  ], // 电视墙布局详情
  row: { // 布局行数
    type: Number,
    required: true
  },
  column: { // 布局列数
    type: Number,
    required: true
  },
  wall: {
    type: Schema.Types.ObjectId,
    ref: 'Wall'
  }
}, { timestamps: true })

mongoose.model('Layout', LayoutScheme)
