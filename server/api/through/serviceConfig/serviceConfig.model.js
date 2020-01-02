/**
 * 人员通行服务配置数据模型
 * @time:2019-7-23
 * @author:MeiChen
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const configSchema = new Schema({
  name: { // 名称
    type: String,
    max: 16
  },
  ip: { // id地址
    type: String
  },
  port: { // 端口
    type: Number
  },
  vendor: { // 厂家
    type: String
  },
  type: { // 类型 1 对应门禁服务器 2 对应人脸服务器 3 高级参数配置 4 一卡通服务地址
    type: Number
  },
  token: { // 密钥
    type: String
  },
  status: { // 状态 1 在线 0 离线
    type: Number
  },
  userName: { // 用户名
    type: String,
    max: 64
  },
  passWord: { // 密码
    type: String
  },
  source: { // 高级参数配置的数据源 1 门禁 + 人脸 2 门禁 3 人脸
    type: Number
  },
  timeLang: { // 通行记录保存多少天
    type: Number
  },
  dataBase: { // 数据库名称
    type: String
  }
})
module.exports = mongoose.model('serviceConfig', configSchema, 'serviceConfig')
