/*
 * @Author: linhang
 * @Date: 2019-07-25 15:43:06
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-08-02 14:26:04
 */

'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
/**
 * 机动车管理模型
 */
var MotorVehicleSchema = new Schema(
  {
    /* 组织机构编号 */
    orgId: {
      type: Schema.Types.ObjectId
    },
    name: {
      // 姓名
      type: String,
      default: ''
    },
    code: {
      // 人员编号
      type: String,
      default: ''
    },
    gender: {
      // 性别,1：男，0：女
      type: Number,
      default: 1,
      set: (v) => {
        if (typeof v !== 'number') {
          return (v === '男' && 0) || (v === '女' && 1)
        }
        return v
      }
    },
    tel: {
      // 联系电话
      type: String,
      default: ''
    },
    plateNo: {
      // 车牌号
      type: String,
      default: ''
    },
    state: {
      // 状态,0：正常，1：过期
      type: Number,
      default: 0,
      set: (v) => {
        if (typeof v !== 'number') {
          return (v === '正常' && 0) || (v === '过期' && 1)
        }
        return v
      }
    },
    remark: {
      // 备注
      type: String,
      default: ''
    },
    startTime: {
      // 有效期开始时间
      type: Number,
      default: -1
    },
    endTime: {
      // 有效期结束时间
      type: Number,
      default: -1
    },
    driverPic1: {
      // 驾驶员照片路径1，驾驶员照片最多可以上传三张
      type: String,
      default: ''
    },
    driverPic2: {
      // 驾驶员照片路径2
      type: String,
      default: ''
    },
    driverPic3: {
      // 驾驶员照片路径3
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)
mongoose.model('motorvehicle', MotorVehicleSchema)
