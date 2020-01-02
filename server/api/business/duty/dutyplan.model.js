/*
 * @Author: linhang
 * @Date: 2018-09-10 09:22:53
 * @Last Modified by: wenhaoFu
 * @Last Modified time: 2019-07-16 14:01:22
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DutyPlanSchema = new Schema(
  {
    // 排班计划名称
    name: {
      type: String,
      required: '名称必填'
    },
    // 值班开始时间
    startTime: {
      type: Number,
      required: [
        function () { return this.planTimeType === 'time' },
        '时间类型为time 开始时间必填'
      ]
    },
    // 值班结束时间
    endTime: {
      type: Number,
      required: [
        function () { return this.planTimeType === 'time' },
        '时间类型为time 结束时间必填'
      ]
    },
    // 排班模板
    template: {
      type: Schema.Types.ObjectId,
      ref: 'DutyTemplate'
    },
    // 班组列表
    group: [
      {
        org: {
          type: Schema.Types.ObjectId,
          ref: 'Org'
        },
        sort: Number
      }
    ],
    // 排班详情
    detail: [
      {
        date: Number,
        staffs: [
          [
            {
              type: Schema.Types.ObjectId,
              ref: 'DutyStaff'
            }
          ]
        ]
      }
    ],
    // 计划推荐类型    时间：time   周：week  月：month
    planTimeType: {
      type: String,
      menu: ['time', 'week', 'month']
    },
    // 创建计划类型  手动：manual  自动：auth
    planType: {
      type: String,
      menu: ['manual', 'auth']
    }
  },
  { timestamps: true }
)

mongoose.model('DutyPlan', DutyPlanSchema)
