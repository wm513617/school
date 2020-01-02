/**
 * 设备管理门禁设备数据模型
 * @time:2019-7-15
 * @author:MeiChen
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const guardSchema = new Schema({
  name: { // 设备名称
    type: String,
    require: true
  },
  id: { // 设备ID
    type: String,
    require: true
  },
  sn: { // 设备序列号
    type: String,
    require: true
  },
  status: { // 设备状态 1 启用，0 禁用
    type: String,
    require: true
  },
  type: { // 设备类型
    type: String,
    require: true
  },
  guardModule: { // 所属模块，acc 门禁，att 考勤，ele 梯控;
    type: String,
    require: true
  },
  orgId: { // 关联所属机构ID
    type: Schema.Types.ObjectId,
    ref: 'Org'
  }
})
module.exports = mongoose.model('guard', guardSchema, 'guard')
