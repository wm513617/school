/*
 * @Author: wenhaoFu
 * @Date: 2019-07-24 11:05:48
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-09-27 14:42:32
 */
/**
 * sdk统计信息表
 * **/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const identifyExcelHistorySchema = new Schema(
  {
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
  { timestamps: true }
)

let identifyModel = mongoose.model('identifyExcelHistory', identifyExcelHistorySchema)
// 重启服务器时将导出表状态为0的任务 更新为导出失败
// identifyModel.updateMany({ status: 0 }, { status: 2 }).exec()
