/**
 * sdk统计信息表
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema(
  {
    time: {
      // 统计时间戳
      type: Number,
      index: true
    },
    date: {
      // 统计时间戳(日期)
      type: Number,
      index: true
    },
    hour: Number, // 统计时间（小时）
    passbyCount: Number,
    defenseCount: Number,
    groups: [
      {
        name: String,
        id: String,
        count: {
          type: Number,
          default: 0
        }
      }
    ],
    res: [
      {
        id: String,
        name: String,
        passbyCount: Number,
        defenseCount: Number
      }
    ]
  },
  { timestamps: true }
)
mongoose.model('VerifaceStatistics', schema)

const excelHistorySchema = new Schema({
  filename: {
    type: String
  },
  category: {
    type: String
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
    get: v => {
      switch (v) {
        case 0:
          return '正在导出'
        case 1:
          return '导出成功'
        case 2:
          return '导出失败'
      }
    }
  }
},
  { timestamps: true })

module.exports = excelHistorySchema

mongoose.model('excelHistory', excelHistorySchema)
