/*
 * @Author: wanglei
 * @Date: 2019-04-26 15:12:16
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-10-25 09:00:34
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { AddressBookEnum } = require('../../../common/enum')

// 每条数据只存其中其中的一个id信息，分别对应该负责人是哪个组的
// 下面 gridId、buildId、storeyId、patrolId、resourceId、securityId、otherId 字段不是全部都必须的，而是根据 type 来确定
// 是属于那个分组的
const Principal = new Schema({
  // 承载地图
  mapId: {
    type: Schema.Types.ObjectId,
    ref: 'MapList'
  },
  // 类型
  type: {
    type: String,
    enum: [
      AddressBookEnum.GRID,
      AddressBookEnum.BUILDING,
      AddressBookEnum.STOREY,
      AddressBookEnum.VIDEO_POINT,
      AddressBookEnum.ALARM_POINT,
      AddressBookEnum.FIRE_POINT,
      AddressBookEnum.HELP_POINT,
      AddressBookEnum.PATROL_POINT,
      AddressBookEnum.DOOR_POINT,
      AddressBookEnum.SECURITY_PERSON,
      AddressBookEnum.OTHER
    ]
  },
  // 网格 id
  gridId: {
    type: Schema.Types.ObjectId,
    ref: 'Grid'
  },
  // 楼宇 id
  buildId: {
    type: Schema.Types.ObjectId,
    ref: 'Building'
  },
  // 楼层 id
  storeyId: {
    type: Schema.Types.ObjectId,
    ref: 'Storey'
  },
  // 资源 id
  resourceId: {
    type: Schema.Types.ObjectId,
    ref: 'Resource'
  },
  // 巡更点位 id
  patrolId: {
    type: Schema.Types.ObjectId,
    ref: 'PatrolPoint'
  },
  // 单兵人员
  securityId: {
    type: Schema.Types.ObjectId,
    ref: 'Security'
  },
  addressBookId: {
    type: Schema.Types.ObjectId,
    ref: 'AddressBook'
  },
  // 姓名
  name: {
    type: String
  },
  // 电话1
  mobile: {
    type: String
  },
  // 收藏
  collect: {
    type: Boolean,
    default: false
  },
  // 电话2
  mobile2: {
    type: String
  },
  // 座机
  telephone: {
    type: String
  },
  // 分机
  extension: {
    type: String
  }
})

mongoose.model('Principal', Principal)
