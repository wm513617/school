/**
 * 设备管理人脸识别机数据模型
 * @time:2019-7-31
 * @author:MeiChen
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const faceSchema = new Schema({
  deviceName: { // 设备名称
    type: String,
    require: true
  },
  deviceState: { // 进出状态 0 - 进 1-出 2-未知
    type: Number
  },
  groupName: { // 设备分组名称
    type: String
  },
  groupId: { // 设备分组ID
    type: String
  },
  ip: { // 设备IP
    type: String,
    require: true
  },
  deviceType: { // 设备类型，1-Camera,2-SenseKeeper,3-SenseNebula-M,4-SenseDLC,5-SenseID,6-SensePass
    type: String,
    require: true
  },
  accessState: { // 连接状态，0-离线，1-在线
    type: Number,
    require: true
  },
  state: { // 启用状态，0-未启动，1-已启动
    type: Number,
    require: true
  },
  userLength: { // 用户数量
    type: Number
  },
  rtspAddress: { // RTSP视频地址
    type: String
  },
  videoPath: { // VIS取流后的rtsp视频地址
    type: String
  },
  cameraData: [ // 关联resources表里的资源信息
    {
      type: Schema.Types.ObjectId,
      ref: 'Resource'
    }
  ],
  org: { // 关联所属机构ID
    type: Schema.Types.ObjectId,
    ref: 'Org'
  },
  deviceId: { // 设备id
    type: String
  },
  ID: {
    type: String
  }
})
module.exports = mongoose.model('senseTimeFace', faceSchema, 'senseTimeFace')
