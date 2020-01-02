/**
 * 布控|黑白名单人员信息模型
 * @time: 2017-6-24
 * @author: hansen
 *
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const peopleSchema = new Schema({
  // 人员类型(3|黑名单、4|白名单、5|布控)
  type: {
    type: Number,
    required: true,
    enum: [3, 4, 5]
  },
  // 人员名称
  username: {
    type: String,
    required: true
  },
  // 年龄
  age: {
    type: Number,
    required: true,
    max: 200,
    min: 0
  },
  // 性别 (0|女性，1|男性)
  gender: {
    type: Number,
    required: true,
    enum: [0, 1]
  },
  // 身份证号码
  idNumber: {
    type: String
  },
  // 相似度
  similarity: {
    type: Number,
    required: true,
    max: 100,
    min: 0
  },
  // 布控原因
  reason: {
    type: String
  },
  // 布控人员照片
  picture: {
    type: String,
    required: true
  },
  // 布控状态(0|未布控,1|布控中,2|已停止,3|布控异常)
  status: {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 0
  },
  // 布控开始时间
  startTime: {
    type: Number
  },
  // 布控结束时间
  endTime: {
    type: Number
  },
  // 布控资源
  resources: {
    type: [Schema.Types.ObjectId],
    ref: 'Resource'
  },
  // 备注
  remark: {
    type: String,
    default: ''
  },
  // 旷视系统人员id
  visionId: {
    type: Number
  }
}, { timestamps: true })

mongoose.model('People', peopleSchema)
