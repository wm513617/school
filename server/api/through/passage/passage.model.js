/*
 * @Description:
 * @Author: MeiChen
 * @Date: 2019-7-16
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-08-22 15:46:24
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passageSchema = new Schema(
  {
    name: { // 人员姓名
      type: String,
      max: 16
    },
    sex: { // 性别 1-男 2-女
      type: Number
    },
    url: { // 人员图片url
      type: String
    },
    currentUrl: { // 人脸识别机抓拍的图片url
      type: String
    },
    type: { // 人员类型 0-黑名单 1-灰名单 2-白名单 3-访客
      type: Number
    },
    uid: { // 人员编号
      type: String,
      max: 32
    },
    card: { // 人员卡号
      type: String
    },
    org: { // 组织，关联人员的组织机构_id
      type: Schema.Types.ObjectId,
      ref: 'Org'
    },
    address: { // 位置,关联门/通道_id
      type: Schema.Types.ObjectId,
      ref: 'equipmentDoor'
    },
    faceAddress: { // 人脸识别机的信息
      type: Schema.Types.ObjectId,
      ref: 'senseTimeFace'
    },
    read: [ // 对应门的读头ID
      {
        type: String
      }
    ],
    camera: [ // 对应读头上绑定的相机ID
      {
        type: String
      }
      // {
      //   type: Schema.Types.ObjectId,
      //   ref: 'Resource'
      // }
    ],
    description: { // 事件描述
      type: String,
      max: 32
    },
    validator: { // 验证方式
      type: String,
      require: true
    },
    eventTime: { // 第三方门禁事件触发记录的时间
      type: Date
    },
    date: { // 触发时间的日期字符串
      type: String,
      index: true
    },
    createdTimeMs: { // 触发时间的时间戳
      type: Number,
      require: true
    },
    readerState: { // 进出状态 0 入，1 出 2 未知
      type: Number,
      require: true
    }
  })
  // {
  //   timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
  // })
module.exports = mongoose.model('peoplePassage', passageSchema, 'peoplePassage')
