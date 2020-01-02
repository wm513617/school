/*
 * @Description: 人证核验机通行记录数据模型
 * @Author: MeiChen
 * @Date: 2019-12-7
 * @Last Modified time: 2019-08-22 15:46:24
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const peopleCardSchema = new Schema(
  {
    devName: { // 人证机名称
      type: String
    },
    id: { // 设备ID
      type: String
    },
    ip: { // 设备IP
      type: String
    },
    dev: { // 设备序列号
      type: String
    },
    name: { // 名称
      type: String
    },
    code: { // 身份证号码
      type: String
    },
    sex: { // 性别
      type: String
    },
    ethnic: { // 民族
      type: String
    },
    birthday: { // 出生日期
      type: String
    },
    address: { // 地址
      type: String
    },
    organ: { // 签发机关
      type: String
    },
    have: { // 有效期
      type: String
    },
    photoUrl: { // 身份证照片地址
      type: String
    },
    livePhotoUrl: { // 现场照片地址
      type: String
    },
    cameraData: [ // 认真核验机绑定的相机信息
      {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      }
    ],
    readerState: { // 进出状态 0 入，1 出
      type: Number
    },
    createdTimeMs: { // 触发时间戳
      type: Number,
      require: true
    }
  }
)
module.exports = mongoose.model('cardPassage', peopleCardSchema, 'cardPassage')
