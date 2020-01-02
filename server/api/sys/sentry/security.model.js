/**
 * 单兵用户数据模型
 * @since: 2018-3-8
 * @author:hansne
 */
'use strict'
const crypto = require('crypto')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Security = new Schema(
  {
    // 用户名
    username: {
      type: String,
      required: [true, '用户名必须输入'],
      unique: true
    },
    hashedPassword: String,
    salt: String,
    // 真实姓名
    realname: {
      type: String,
      required: [true, '真实姓名必须输入']
    },
    // 工号
    id: {
      type: String
    },
    // 轨迹颜色
    selectedColor: {
      type: String,
      default: '#D0021B'
    },
    // 职务
    position: {
      type: String
    },
    // 所属机构
    affiliation: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true
    },
    // 状态 [1|启动，2|冻结]
    status: {
      type: Number,
      enum: [1, 2],
      default: 1,
      required: true
    },
    // 人员照片
    photo: {
      type: String
    },
    // 手机号码
    phone: {
      type: String
    },
    // 有效期
    period: {
      unlimited: Boolean,
      expried: Number
    },
    // 用户上次坐标
    geo: {
      lon: Number,
      lat: Number
    },
    // 手持设备状态  在线online|掉线offline
    devStaus: {
      type: String
    },
    // 用户NFC编码
    nfc: {
      type: String
    },
    // 用户刷卡登陆
    carLogin: {
      type: Boolean
    },
    // 用户账户密码登陆
    passWordLogin: {
      type: Boolean
    },
    // 用户拍照报班
    pictureLogin: {
      type: Boolean
    },
    // 用户手持设备的编号[每次登陆的时候更新]
    sn: {
      type: String
    }
  },
  { timestamps: true }
)

Security.path('username').validate(function (value) {
  return new Promise((resolve, reject) => {
    this.model('Security').countDocuments({ username: value }, function (error, count) {
      if (error) {
        resolve(false)
      } else {
        resolve(!count)
      }
    })
  })
}, '用户名已存在')

Security.pre('findOneAndUpdate', function (next) {
  const password = this.getUpdate().password
  if (password) {
    const salt = Security.methods.makeSalt()
    this.findOneAndUpdate({}, { salt: salt, hashedPassword: Security.methods.encryptPassword(password, salt) })
  }
  next()
})

/**
 * Virtuals
 */
Security.virtual('password')
  .set(function (password) {
    this._pwd = password
    this.salt = this.makeSalt()
    this.hashedPassword = this.encryptPassword(password, this.salt)
  })
  .get(function () {
    return this._pwd
  })

Security.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText).toLowerCase() === this.hashedPassword.toLowerCase()
  },
  makeSalt: function () {
    return crypto.randomBytes(16).toString('base64')
  },
  encryptPassword: function (pwd, salt) {
    if (!pwd || !salt) {
      return ''
    }
    salt = Buffer.from(salt, 'base64')
    return crypto.pbkdf2Sync(pwd, salt, 100, 64, 'sha512').toString('base64')
  }
}

mongoose.model('Security', Security)

/**
 * 此版本由于需求问题，更改了用户工号唯一性验证要求，需要删除该字段的唯一索引。
 * 避免历史数据中的索引导致mongoose增加数据失败
 * 单兵工号唯一索引删除
 */
mongoose.model('Security').collection.dropIndex('id_1', function (err) {
  if (err) {
    console.log('Security had remove id_1 index!')
  }
})
