/**
 * 人脸算法配置模型
 * @time: 2017-9-7
 * @author: hansen
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FaceApiSchema = new Schema({
  url: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  headers: {
    type: Schema.Types.Mixed
  }
})
const FaceAlgorithmSchema = new Schema({
  // 登录api
  loginApi: {
    type: FaceApiSchema,
    required: true
  },
  // 创建用户api
  createUserApi: {
    type: FaceApiSchema,
    required: true
  },
  // 更新用户api
  updateUserApi: {
    type: FaceApiSchema,
    required: true
  },
  // 删除用户api
  deleteUserApi: {
    type: FaceApiSchema,
    required: true
  },
  // 获取历史记录api
  historyApi: {
    type: FaceApiSchema,
    required: true
  },
  // 上传图片api
  uploadApi: {
    type: FaceApiSchema,
    required: true
  },
  // 超时
  timeout: Number,
  // 算法类型
  type: {
    type: 'String',
    required: true
  }
})
mongoose.model('FaceAlgorithm', FaceAlgorithmSchema)
