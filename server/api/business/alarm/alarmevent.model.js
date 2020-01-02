/*
 * @Author: linhang
 * @Date: 2018-09-10 09:23:16
 * @Last Modified by: lushengying
 * @Last Modified time: 2019-07-31 16:21:54
 * @Last Modified by: SongXiaoshan
 * @Last Modified time: 2019-10-29 10:21:44
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const tagTime = new Schema({
  // 标记名称
  tagName: String,
  // 标记开始时间
  startTime: Number,
  // 标记结束时间
  endTime: Number
})
const resourceSchema = new Schema({
  // 资源通道
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  },
  isSave: {
    type: Number,
    validate: val => [0, 1, 2, 3].includes(val), // 0 未进行保存, 1 保存中, 2 保存成功, 3 保存失败
    default: 0
  },
  // 开始时间
  startTime: {
    type: Number
  },
  // 结束时间
  endTime: {
    type: Number
  },
  // 录像处理时间段
  tagTime: [
    tagTime
  ],
  // 是否标记
  isMark: {
    type: Boolean,
    default: false
  }
})
const structuredTrackSchema = new Schema({
  // 资源通道
  resource: {
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  },
  // 开始时间
  startTime: {
    type: Number
  },
  // 结束时间
  endTime: {
    type: Number
  }
})
const AlarmEventSchema = new Schema(
  {
    // 事件编号
    eventCode: {
      type: String,
      required: '事件编号必填'
    },
    // 事件名称
    eventName: {
      type: String,
      required: '事件名称必填'
    },
    // 报警人
    person: {
      type: String,
      required: '报警人必填'
    },
    // 性别 1 男 2 女
    gender: {
      type: Number
    },
    // 学号
    studentNum: {
      type: String
    },
    // 年龄
    age: {
      type: Number
    },
    // 民族
    nationality: {
      type: String
    },
    // 单位/院系
    department: {
      type: String
    },
    // 住址
    address: {
      type: String
    },
    // 事发地址
    incidentAddress: {
      type: String
    },
    // 身份证号
    identityNum: {
      type: String
    },
    // 是否调取录像
    isRecode: {
      type: Boolean
    },
    // 案件开始时间
    startTime: {
      type: Number
    },
    // 案件结束时间
    endTime: {
      type: Number
    },
    // 备注
    mark: {
      type: String
    },
    // 报警人联系方式
    phone: {
      type: String,
      required: '报警人联系方式必填'
    },
    // 报警时间
    alarmTime: {
      type: Number,
      required: '报警时间必填'
    },
    // 相关摄像头列表
    resourceList: [resourceSchema],
    // 结构化追踪
    structuredTrack: {
      type: [structuredTrackSchema],
      default: []
    },
    // 图片
    images: [
      {
        name: {
          type: String
        },
        path: {
          type: String
        }
      }
    ],
    // 当前状态，2|未解决，1|已解决
    state: {
      type: Number,
      required: '当前状态必填',
      default: 2,
      enum: [1, 2]
    },
    // 事件描述
    description: {
      type: String
    },
    // 是否关闭
    close: {
      type: Boolean
    },
    // 创建时间
    createTime: {
      type: Number,
      required: '创建时间必填'
    },
    // 关闭时间
    closeTime: {
      type: Number
    },
    // 记录人联系方式
    recordPhone: {
      type: String
    },
    isSave: {
      type: Number,
      validate: val => [0, 1, 2, 3].includes(val), // 0 未进行保存, 1 保存中, 2 保存成功, 3 保存失败
      default: 0
    },
    // 事件处理详情
    detail: [
      {
        // 处理时间
        handleTime: {
          type: Number,
          required: '处理时间必填'
        },
        // 处理人
        person: {
          type: String,
          required: '处理人必填'
        },
        // 联系方式
        phone: {
          type: String,
          required: '联系方式必填'
        },
        // 处理详情
        detail: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
)

mongoose.model('AlarmEvent', AlarmEventSchema)
