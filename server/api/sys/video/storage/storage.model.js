/**
 * 资源录像存储模型
 * @time:207-6-17
 * @author:hansen
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const stroageSchema = new Schema({
  // 存储服务器
  server: {
    type: String
  },
  // 存储路径
  path: {
    type: String
  },
  // 存储资源
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource',
    unique: true
  }
}, { timestamps: true })
mongoose.model('Storage', stroageSchema)
