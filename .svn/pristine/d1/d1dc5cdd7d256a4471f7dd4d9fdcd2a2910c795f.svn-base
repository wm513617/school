/*
 * @Author: hansen.liuhao
 * @Date: 2018-08-01 16:08:01
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-08-27 18:18:27
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TrafficLane = new Schema(
  {
    deptParent: String, // 父级部门id
    devChnFactory: String, // 厂商
    devChnType: String, // 设备类型
    devChnName: String, // 设备名称
    devChnId: String, // 设备编号
    deptName: String, // 部门名称
    deptId: String, // 部门id
    channel: String, // 通道号
    devChnDirect: String, // 车道方向
    devChnLane: String, // 车道号
    devIp: String, // 设备ip
    devPort: String, // 设备端口
    // 服务器id
    sid: {
      type: Schema.Types.ObjectId,
      ref: 'Device'
    },
    alarmtemplate: {
      // 布撤防时间2.0新增
      type: Schema.Types.ObjectId,
      ref: 'alarmTimeTemplate'
    },
    // 报警级别2.0新增
    level: Number,
    actionConfig: {
      // 是否进行了配置2.0新增
      type: Boolean,
      default: false
    },
    alarmaffirm: {
      // 报警确认
      affirmflag: {
        type: Boolean
      },
      autoaffirm: {
        status: {
          type: Boolean
        },
        intervaltime: {
          type: Number // 时间间隔
        }
      },
      handaffirm: {
        status: {
          type: Boolean // 报警一级确认
        }
      },
      handaffirm2: {
        status: {
          type: Boolean // 报警二级确认2.0新增
        }
      }
    }
  },
  { timestamps: true }
)

mongoose.model('TrafficLane', TrafficLane)
