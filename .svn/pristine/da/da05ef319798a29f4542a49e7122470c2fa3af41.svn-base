
'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var workmanagmentSchema = new Schema(
  {
    status: {
      // 维修状态 0：待维修  1：维修完成
      type: Number,
      required: true,
      default: 0,
      enum: [0, 1]
    },
    serial: {
      //  工单编号
      type: String
    },
    repairsName: {
      // 报修人
      type: String
    },
    repairsTime: {
      // 报修时间 （时间戳 秒）
      type: Number
    },
    deviceType: {
      // 设备类型 0:摄像机、1:录像机、2:报警主机、3:消防主机、4:报警探头、5:消防探头、6:报警柱、7:报警箱、8:闸机、9:解码器、10:网络键盘、11:拼接控制器、12:其他
      type: Number,
      default: 0,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    repairsReason: {
      // 报修原因 0: 设备离线,  1: 设备异常, 2: 录像异常, 3: 视频质量异常, 4: 其他
      type: Number,
      enum: [0, 1, 2, 3, 4]
    },
    maintenanceTime: {
      type: Number
      // 维修时间 （时间戳 秒）
    },
    deviceList: {
      // 设备 数组
      // [{id:资源_id,name:资源名称}]   暂将名字存起来  为了做列表  若名称实时跟新的话 需要分设备类型查列表
      type: Array
    },
    maintenanceVendor: {
      // 维保厂商
      type: String
    },
    linkman: {
      // 联系人
      type: String
    },
    maintenancePhone: {
      // 联系电话
      type: Number
    },
    isSmsAlert: {
      // 是否发送短信提醒，true发送  false 不发送
      type: Boolean
    },
    notarizeName: {
      // 确认人
      type: String
    },
    notarizeTime: {
      // 确认时间 时间戳 秒
      type: Number
    },
    accendant: {
      // 维修人
      type: String
    },
    accendantPhone: {
      // 维修人 联系电话
      type: Number
    },
    remark: {
      // 备注信息
      type: String
    },
    devNameList: {
      // 前端拼接的名称
      type: String
    }
  },
  { timestamps: true }
)
mongoose.model('WorkManagment', workmanagmentSchema)
