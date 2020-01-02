/**
 * 巡更点位数据模型
 * @since: 2018-3-8
 * @author:hansne
 */
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Point = new Schema(
  {
    // 设备名称
    devName: {
      type: String,
      required: true,
      unique: true
    },
    // 设备ID
    devId: {
      type: String,
      required: true,
      unique: true
    },
    // 设备编码
    devCode: {
      type: String,
      required: true,
      unique: true
    },
    // 设备类型
    devType: {
      type: String
    },
    // 设备图片
    devPhoto: String,
    // 所属机构
    affiliation: {
      type: Schema.Types.ObjectId,
      ref: 'Org',
      required: true
    },

    // 负责人
    // TODO 修改这个字段为 Principal
    charger: {
      type: String
    },
    // 负责人
    principal: {
      type: Schema.Types.ObjectId,
      ref: 'Principal'
    },
    // 地图中设备标识
    device: {
      type: String,
      default: 'patrol'
    },
    // 点位信息
    point: {
      // 2d点位坐标
      geo: String,
      // 2D楼层
      sid: {
        type: Schema.Types.ObjectId,
        ref: 'Storey'
      },
      // 2D楼宇
      bid: {
        type: Schema.Types.ObjectId,
        ref: 'Building'
      },
      // 模型标识
      mid: {
        type: Schema.Types.ObjectId,
        ref: 'Icon'
      },
      // 所属地图
      mapid: {
        type: Schema.Types.ObjectId,
        ref: 'Map'
      },
      projection: { // 点位坐标——投影坐标系
        type: String,
        default: 'EPSG:4326'
      }
    },
    // 3D 坐标
    point3D: {
      // 3d点位坐标
      geo: String,
      // 3D楼层
      sid: {
        type: Schema.Types.ObjectId,
        ref: 'Storey3D'
      },
      // 模型标识
      mid: {
        type: Schema.Types.ObjectId,
        ref: 'Model'
      },
      // 图标标识 因为3D地图楼层内是2D地图，所以楼内的点位图标需添加图标库的
      iid: {
        type: Schema.Types.ObjectId,
        ref: 'Icon'
      },
      // 模型大小
      scale: {
        type: Number
      },
      // 模型高度
      height: {
        type: Number
      },
      // 模型朝向角
      heading: {
        type: Number
      },
      // 模型俯仰角
      pitch: {
        type: Number
      },
      // 模型滚动角
      roll: {
        type: Number
      },
      // 3D楼宇
      bid: {
        type: Schema.Types.ObjectId,
        ref: 'Building3D'
      }
    },
    // 巡更点位图片
    photo: {
      type: String
    },
    // 联系电话
    phone: {
      type: String
    },
    // 备注
    remark: {
      type: String
    }
  },
  { timestamps: true }
)

Point.path('devName').validate(function (value) {
  return new Promise((resolve, reject) => {
    this.model('PatrolPoint').count({ devName: value }, function (error, count) {
      if (error) {
        resolve(false)
      } else {
        resolve(!count)
      }
    })
  })
}, '设备名称已存在，请重新输入')

Point.path('devId').validate(function (value) {
  return new Promise((resolve, reject) => {
    this.model('PatrolPoint').count({ devId: value }, function (error, count) {
      if (error) {
        resolve(false)
      } else {
        resolve(!count)
      }
    })
  })
}, '设备ID已存在，请重新输入')

Point.path('devCode').validate(function (value) {
  return new Promise((resolve, reject) => {
    this.model('PatrolPoint').count({ devCode: value }, function (error, count) {
      if (error) {
        resolve(false)
      } else {
        resolve(!count)
      }
    })
  })
}, '设备编码已存在，请重新输入')

mongoose.model('PatrolPoint', Point)
