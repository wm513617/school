/**
 * 非机动车违规记录
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NonVehicleViolationSchema = new Schema(
  {
    /* 车牌号 */
    numberPlate: {
      type: String
    },
    /* 处置单兵人员 */
    name: {
      type: String
    },
    /* 时间 */
    time: {
      type: String
    },
    /* 地点 */
    location: {
      type: String
    },
    /* 时间类型: 伪造车证|0、涂改车证|1、转借车证|2、辱骂车辆管理人员|3、与车辆管理人员发生纠纷|4、其他|5 */
    type: {
      type: Number
    },
    /* 事件描述 */
    description: {
      type: String
    }
  },
  { timestamps: true }
)

mongoose.model('NonVehicleViolation', NonVehicleViolationSchema)
