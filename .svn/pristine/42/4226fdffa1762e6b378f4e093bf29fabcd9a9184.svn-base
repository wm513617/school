/*
 * @Author: wanglei
 * @Date: 2019-04-26 09:18:12
 * @Last Modified by: wanglei
 * @Last Modified time: 2019-10-25 08:55:29
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { AddressBookEnum } = require('../../../common/enum')

const AddressBookSchema = new Schema(
  {
    // 承载地图
    mapId: {
      type: Schema.Types.ObjectId,
      ref: 'MapList'
    },
    // 名称 只有新添加的组用这个字段，其他组都是从别的表获取
    name: {
      type: String
    },
    // 类型 楼层属于楼宇
    type: {
      type: String,
      enum: [
        AddressBookEnum.GRID,
        AddressBookEnum.BUILDING,
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
    // 收藏
    collect: {
      type: Boolean,
      default: false
    },
    // 排序
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

mongoose.model('AddressBook', AddressBookSchema)
