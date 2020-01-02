/*
 * @Author: linhang
 * @Date: 2018-09-10 09:22:58
 * @Last Modified by: wenhaoFu
 * @Last Modified time: 2019-07-10 17:58:16
 */
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DutyStaffSchema = new Schema(
  {
    // 员工号 *
    code: {
      type: String
      // unique: true
    },
    // 姓名 *
    name: {
      type: String,
      required: '姓名必填'
    },
    // 真实姓名 *
    realname: {
      type: String
    },
    // 联系方式 *
    phone: {
      type: String
      // required: '联系方式必填'
    },
    // 职务 *
    title: String,
    // 过期时间（时间戳）, -1 无限期 *
    exptime: {
      type: Number
    },
    // 人员照片 *
    photo: {
      type: String
    },
    // 所属班组 *
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Org'
    },
    // 性别,0|女性，1|男性
    gender: {
      type: Number,
      // required: '性别必填',
      enum: [0, 1]
    },
    // 部门
    department: String,

    // 通讯地址
    address: String,
    // 用户信息
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'Security'
      // required: '用户信息必填'
    },
    // 用户类型  security:单兵    user:人员
    staffType: {
      type: String,
      enum: ['user', 'security']
    }
  },
  { timestamps: true }
)

mongoose.model('DutyStaff', DutyStaffSchema)

/**
 * 此版本由于需求问题，更改了用户工号唯一性验证要求，需要删除该字段的唯一索引。
 * 避免历史数据中的索引导致mongoose增加数据失败
 * 单兵工号唯一索引删除
 */
mongoose.model('DutyStaff').collection.dropIndex('code_1', function (err) {
  if (err) {
    console.log('DutyStaff had remove code_1 index!')
  }
})
