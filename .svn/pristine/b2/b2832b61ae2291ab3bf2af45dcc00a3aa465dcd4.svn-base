/**
 *  模型
 * @time:207-6-17
 * @author:hansen
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const snapshotSchema = new Schema({
  // 是否启用计划
  enable: {
    type: String
  },
  // (定时抓图)计划模板Id
  timePlanTemplateId: {
    type: Schema.Types.ObjectId,
    ref: 'PlanTemplate',
    require: true
  },
  // (事件抓图)计划模板Id
  eventPlanTemplateId: {
    type: Schema.Types.ObjectId,
    ref: 'PlanTemplate',
    require: true
  },
  // 存储的资源Id
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource',
    required: true,
    unique: true
  }
})

mongoose.model('Snapshot', snapshotSchema)
