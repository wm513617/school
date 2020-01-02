/**
 * 巡更任务数据模型
 * @since: 2018-3-12
 * @author:hansne
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Pointe = new Schema({
  // 巡更点位id
  pointId: {
    type: Schema.Types.ObjectId,
    ref: 'PatrolPoint',
    required: true
  },
  // pointName: {
  //   type: String,
  //   required: true
  // },
  // 巡更时间
  patrolTime: {
    type: String
  }
}, { _id: false })

const PatrolTask = new Schema({
  // 任务名称
  taskTitle: {
    type: String,
    trim: true,
    required: [true, '任务名称不能为空'],
    maxlength: [64, '任务名称不能超过64个字符']
  },
  // 任务类型 [1|固定模式,2|浮动模式]
  taskType: {
    type: Number,
    required: [true, '请选择任务类型'],
    enum: [1, 2]
  },
  // 所属机构名称
  // orgName: {
  //   type: String,
  //   required: [true, '机构不能为空']
  // },
  // 所属机构
  org: {
    type: Schema.Types.ObjectId,
    ref: 'Org',
    required: [true, '机构不能为空']
  },
  // 巡更人员名称
  realName: {
    type: String,
    required: [true, '请选择用户']
  },
  // 巡更人员id
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'Security',
    required: true
  },
  // 开始时间
  startTime: {
    type: String
  },
  // 结束时间
  endTime: {
    type: String
  },
  // 浮动范围
  rangTime: {
    type: Number,
    min: 1,
    max: 60,
    default: 1
  },
  // 备注
  remark: {
    type: String,
    trim: true,
    maxlength: [512, '备注不能超过512个字符']
  },
  // 巡更点位
  points: [Pointe]
}, { timestamps: true })

mongoose.model('PatrolTask', PatrolTask)
