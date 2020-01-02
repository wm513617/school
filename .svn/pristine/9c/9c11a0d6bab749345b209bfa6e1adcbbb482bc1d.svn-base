/**
 * 人脸识别信息模型
 * @time: 2017-6-24
 * @author: hansen
 *
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const faceSchema = new Schema({
  // 识别人员名称
  username: {
    type: String
  },
  // 年龄
  age: {
    type: Number,
    max: 200,
    min: 0
  },
  // 性别 (0|女性，1|男性)
  gender: {
    type: Number,
    enum: [0, 1]
  },
  // 身份证号码
  idNumber: {
    type: String
  },
  // 相似度
  similarity: {
    type: Number,
    max: 100,
    min: 0
  },
  // 人员底库图片
  picture: {
    type: String
  },
  // 抓拍设备
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  },
  // 抓拍位置
  resourcePoint: {
    type: String
  },
  // 抓拍图片
  snapshot: {
    type: String
  },
  // 抓拍时间(系统)
  snapshotTime: {
    type: Number,
    index: true
  },
  // 抓拍时间(旷视)
  snapshotKSTime: {
    type: Number,
    index: true
  },
  // 比对类型(员工、访客、VIP、黑名单、白名单、布控、陌生人)
  type: {
    type: Number,
    index: true,
    enum: [0, 1, 2, 3, 4, 5, 6]
  },
  // 旷视系统人员id
  visionId: {
    type: Number
  },
  sys: {
    type: Number,
    enum: [0, 1]
  }
}, { timestamps: true })

/**
 * validate
 */
// faceSchema.path('username').validate(regex.name, 'Invalid format')
// faceSchema.path('idNumber').validate(regex.idCode, 'Invalid format')
mongoose.model('Face', faceSchema)
