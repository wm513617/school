/*
 * 预案模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 15:02:32
 * @Last Modified by: chenkaibo
 * @Last Modified time: 2018-08-24 09:27:25
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PlanSchema = new Schema({
  name: { // 预案名称
    type: String,
    required: true
  },
  wall: { // 所属电视墙id
    type: Schema.Types.ObjectId,
    ref: 'Wall',
    required: true
  },
  info: [
    {
      start: { // 开始时间
        type: Number,
        min: [0, `can't less than 0`],
        max: [86400, `can't more than one day`],
        required: true
      },
      end: { // 结束时间
        type: Number,
        min: [0, `can't less than 0`],
        max: [86400, `can't more than one day`],
        required: true
      },
      scene: { // 场景id
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Scene'
      }
    }
  ],
  pinyin: String // 拼音
}, { timestamps: true })

PlanSchema.pre('save', function (next) {
  const index = this.info.findIndex(item => item.start > item.end)
  if (index === -1) { return next() }
  next(new Error(`info[${index}].start can't greate than end`))
})

mongoose.model('Plan', PlanSchema)
