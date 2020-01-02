/**
 * 人脸抓拍统计(按照资源)模型
 * @time: 2017-6-24
 * @author: hansen
 *
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const faceStatisticSchema = new Schema({
  // 统计类型(0|黑名单、1|白名单、2|对比、3|布控)
  type: {
    type: Number
  },
  // 统计颗粒度(0|分钟,1|小时,2|天)
  granularity: {
    type: Number,
    enum: [0, 1, 2],
    default: 0
  },
  // 统计来源(全部资源|0,单个资源|1),统计查询需要区分
  summary: {
    type: Number,
    enum: [0, 1]
  },
  // 所属组织
  org: {
    type: Schema.Types.ObjectId
  },
  // 资源id
  resource: {
    type: Schema.Types.ObjectId
  },
  // 资源名称
  resourceName: {
    type: String
  },
  // 统计时间
  label: {
    type: String,
    required: true
  },
  // 分钟
  minute: {
    type: Number
  },
  // 小时
  hour: {
    type: Number
  },
  // 统计日期
  date: {
    type: Number,
    index: true
  },
  // 统计总数
  statistic: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

mongoose.model('FaceStatistic', faceStatisticSchema)
