/*
 * @Author: linhang
 * @Date: 2019-07-25 15:43:06
 * @Last Modified by: linhang
 * @Last Modified time: 2019-08-22 17:42:55
 */

'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
/**
 * 机动车管理模型
 */
var PeopleVehicleSchema = new Schema(
  {
    plateNo: {
      // 车牌号码
      type: String,
      default: '',
      index: true
    },
    gateName: {
      // 出入口名称
      type: String,
      default: '',
      index: true
    },
    vehiclePic: {
      // 过车图片路径
      type: String,
      default: ''
    },
    driverPic: {
      // 过车图片中剪切出的驾驶员照片
      type: String,
      default: ''
    },
    similar: {
      // 人脸比对相似度,备案过才有该字段
      type: Number
    },
    checkResult: {
      // 人车同检结果,备案过才有该字段,0:图片提取失败，1：人车核验成功，2：人车核验失败
      type: Number,
      index: true
    },
    check: {
      // 是否备案过进行了人车同检，即是否在机动车管理页面添加过
      type: Boolean,
      default: false
    },
    date: {
      // 过车日期YYYY-MM-DD
      type: String,
      default: '',
      index: true
    },
    time: {
      // 数据写入数据库时间
      type: Number,
      default: -1,
      index: true
    },
    recordName: {
      // 备案驾驶员姓名
      type: String,
      default: '',
      index: true
    },
    recordPlateNo: {
      // 备案车牌号码
      type: String,
      default: ''
    },
    recordDriverPic: {
      // 备案驾驶员照片
      type: String,
      default: ''
    },
    recordContact: {
      // 备案驾驶员联系方式
      type: String,
      default: ''
    },
    extractSuccess: {
      // 图片是否提取特征值成功
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)
mongoose.model('peoplevehicle', PeopleVehicleSchema)
