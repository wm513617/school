/**
 * 门禁权限组数据模型
 * @time:2019-8-2
 * @author:MeiChen
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const permissionSchema = new Schema({
  id: { // 中控记录的权限组ID
    type: String,
    require: true
  },
  name: { // 权限组名称
    type: String,
    require: true
  }
})
module.exports = mongoose.model('doorPermission', permissionSchema, 'doorPermission')
