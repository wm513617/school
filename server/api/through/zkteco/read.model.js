/**
 * 设备管理读头数据模型
 * @time:2019-7-30
 * @author:MeiChen
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const readSchema = new Schema({
  name: { // 读头名称
    type: String,
    require: true
  },
  id: { // 读头ID
    type: String,
    require: true
  },
  readerNo: { // 读头编号
    type: Number,
    require: true
  },
  readerState: { // 读头进出状态 0 入，1 出
    type: Number,
    require: true
  },
  doorId: { // 门 id
    type: String,
    require: true
  },
  door_Id: { // 门在mongodb中_id
    type: Schema.Types.ObjectId,
    ref: 'equipmentDoor'
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
  }
})
module.exports = mongoose.model('equipmentRead', readSchema, 'equipmentRead')
