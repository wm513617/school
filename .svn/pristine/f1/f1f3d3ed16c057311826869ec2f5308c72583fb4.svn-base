/*
 * @Description: 视频结构化服务器参数信息 schema
 * @Author: wanglei
 * @Date: 2019-06-28 13:42:19
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-02 10:25:59
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { VideoClassCodeEnum, StartCodeEnum, DrawRectangleCodeEnum } = require('../structure.enum')

const StructureParamSchema = new Schema(
  {
    // 开启视频编码
    startCode: {
      type: Number,
      // 0 关闭 | 1 开启
      default: 1,
      validate: val => Object.values(StartCodeEnum).includes(val)
    },
    // 视频编码等级
    codeClass: {
      type: Number,
      default: VideoClassCodeEnum.SUPERPOSE_ONECLASS_ZH_CODE,
      validate: val => Object.values(VideoClassCodeEnum).includes(val)
    },
    // 原图中绘制矩形框
    drawRectangle: {
      type: Number,
      // 0 不绘制 | 1 绘制
      default: 1,
      validate: val => Object.values(DrawRectangleCodeEnum).includes(val)
    },
    // 结构化数据保存天数
    saveTime: {
      type: Number,
      min: [1, '最少 1 天'],
      max: [365, '最多 365 天'],
      default: 30
    }
  },
  { timestamps: true }
)

mongoose.model('structureparam', StructureParamSchema)
