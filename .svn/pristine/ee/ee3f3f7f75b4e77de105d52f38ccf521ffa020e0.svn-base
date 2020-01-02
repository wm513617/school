/**
 * 设备管理认证核验机器数据模型
 * @time:2019-11-11
 * @author:MeiChen
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const peopleSchema = new Schema({
  name: { // 设备名称
    type: String
  },
  id: { // 设备id
    type: String
  },
  ip: { // 设备IP
    type: String
  },
  status: { // 设备状态
    type: String
  },
  dev: { // 设备序列号
    type: String
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
  ],
  readerState: { // 进出状态 0 入，1 出
    type: Number
  }
})
module.exports = mongoose.model('peopleCard', peopleSchema, 'peopleCard')
