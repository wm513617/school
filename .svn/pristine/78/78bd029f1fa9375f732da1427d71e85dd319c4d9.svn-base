/*
 * @Author: zhangminbo
 * @Date: 2018-06-05 14:23:28
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-06-10 09:36:15
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    res: {
      type: Schema.Types.ObjectId, // 资源id
      ref: 'Resource',
      index: true
    },
    resName: {
      type: String // 资源名称
    },
    groupImgId: {
      type: String
    },
    age: {
      type: Number
    },
    gender: {
      type: String
    },
    dateTime: {
      // 日期时间戳
      type: String,
      index: true
    },
    hour: {
      // 当日小时
      type: Number
    },
    time: {
      // 当前时间
      type: Number
    },
    image: {
      type: String
    },
    similar: {
      // 相似度
      type: Number
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'VeriGroup' // 群组id
    },
    groupName: {
      type: String // 群组名称
    },
    timestamp: {
      // 抓拍时间
      type: Number
    },
    isdefense: {
      type: Boolean
    },
    alarmAudio: {
      type: String
    },
    color: {
      type: String
    },
    // 用户信息方便后期检索
    userId: {
      type: String
    },
    userGender: {
      type: String
    },
    userAge: {
      type: Number
    },
    userName: {
      type: String
    },
    userCode: {
      type: String
    },
    userImage: {
      // 用户磁盘图片
      type: String
    },
    faceImage: {
      // 人脸图
      type: String
    },
    fullImage: {
      // 全景图
      type: String
    },
    resIp: {
      type: String
    },
    resPort: {
      type: String
    },
    resChannel: {
      type: Number
    },
    defenseTime: {
      type: String
    },
    // 识别图片信息是否同步添加到sdk路人库
    isCreateSync: Boolean,
    // 识别图片信息是否同步添加到sdk路人库
    isUpdateSync: Boolean,
    alarmPlan: {
      type: Schema.Types.ObjectId,
      ref: 'alarmPlan'
    },
    trackid: String,
    idAndTag: String,
    // 识别人员备注信息
    remark: String
  },
  { timestamps: true }
)

mongoose.model('VerifaceIdentify', schema)

mongoose.model('VerifaceIdentify').collection.createIndex('time_-1_isdefense_-1_similar_-1', { background: true }, function (err) {
  if (err) {
    throw err
  }
  console.log('time_-1_isdefense_-1_similar_-1 had created')
})
mongoose.model('VerifaceIdentify').collection.createIndex('time_-1_age_-1_gender_-1', { background: true }, function (err) {
  if (err) {
    throw err
  }
  console.log('time_-1_age_-1_gender_-1 had created')
})
mongoose.model('VerifaceIdentify').collection.createIndex('time_-1_idAndTag_-1', { background: true }, function (err) {
  if (err) {
    throw err
  }
  console.log('time_-1_idAndTag_-1 had created')
})
