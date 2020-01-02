/**
 * 设备管理门数据模型
 * @time:2019-7-15
 * @author:MeiChen
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const doorSchema = new Schema({
  name: { // 门名称
    type: String,
    require: true
  },
  id: { // 门ID
    type: String,
    require: true
  },
  deviceId: { // 设备ID
    type: String,
    require: true
  },
  area: { // 所属区域
    type: String
  },
  guardData: { // 关联所属的门禁设备信息
    type: Schema.Types.ObjectId,
    ref: 'guard'
  },
  org: { // 关联所属机构ID
    type: Schema.Types.ObjectId,
    ref: 'Org'
  },
  cameraData: [ // 关联resources表里的资源信息
    {
      type: Schema.Types.ObjectId,
      ref: 'Resource'
    }
  ]
})
module.exports = mongoose.model('equipmentDoor', doorSchema, 'equipmentDoor')
