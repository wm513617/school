/**
 * 人员通行User数据模型
 * @time:2019-7-16
 * @author:MeiChen
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const usersSchema = new Schema({
  name: { // 姓名
    type: String,
    require: true,
    max: 32
  },
  sex: { // 性别 1-男 2-女
    type: Number,
    require: true
  },
  code: { // 对应中控系统中人员编号，手动创建用户为时间戳，从一卡通自动创建为一卡通中证件号,中控系统中人员编号支持数字加字母最多十五位
    type: String,
    require: true,
    max: 15
  },
  uid: { // 真实的人员编号，可能为身份证号&学号&职工号
    type: String,
    require: true
  },
  faceId: { // 对应在商汤系统中创建人像成功后记录人像ID
    type: String
  },
  card: { // 卡号 如果有则需要唯一
    type: String,
    max: 32
  },
  national: { // 民族
    type: String
  },
  phone: { // 联系方式
    type: String
  },
  type: { // 类型 0-黑名单 1-灰名单 2-白名单
    type: Number,
    default: 2
  },
  image: { // 图片url
    type: String
  },
  org: { // 机构ID
    type: Schema.Types.ObjectId,
    ref: 'Org'
  },
  guard: { // 1 暂不能刷卡或刷脸 2 仅可刷卡 3 仅可刷脸 4 都可以
    type: Number,
    default: 1
  },
  permission: [ // 关联的门禁权限组ID
    {
      type: Schema.Types.ObjectId,
      ref: 'doorPermission'
    }
  ],
  facePermission: [],
  veriface: { // 对应人像识别-底库的人员ID
    type: String
  },
  codeAddress: { // 身份证地址
    type: String
  },
  liveAddress: { // 居住地址
    type: String
  },
  failure: { // 失效时间
    type: String
  },
  isActivation: { // 是否激活（如果过了有效时间则认为未激活） true 激活 false 未激活
    type: Boolean
  },
  isOneCard: { // 用于区分用户是否是从一卡通获取的数据 true 是 false 否
    type: Boolean
  }
})
module.exports = mongoose.model('students', usersSchema, 'students')
