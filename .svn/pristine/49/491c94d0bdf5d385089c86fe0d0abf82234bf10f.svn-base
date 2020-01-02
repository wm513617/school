/** 
 * 非机动车管理日志Schema(保存单兵扫描日志)
*/
'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserNonVehicleLog = new Schema({
  /* 组织机构编号 */
  orgId: {
    type: String
  },
  /* 单兵编号 */
  deviceId: {
    type: String
  },
  /* 身份类型 0:职工 1:学生 2:外教 3:家属 4:其他 */
  identityType: {
    type: Number,
    default: 0
  },
  /* 查询时间 */
  searchTime: {
    type: Number,
    default: () => Math.round(new Date() / 1000)
  }
}, { timestamps: true }
)

mongoose.model('userNonVehicleLog', UserNonVehicleLog)