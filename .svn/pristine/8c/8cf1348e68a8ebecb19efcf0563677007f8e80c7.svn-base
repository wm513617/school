/**
 * 通道资源-机构中间表
 * @time 2017-06-21
 */
'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 机构资源中间表
var OrgResSchema = new Schema({
  org: { // 关联的机构
    type: Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  resource: { // 关联的资源
    type: Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  rootorg: { // 根机构id（方便查询而已）
    type: Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  islane: { // 该资源是否挂载在车道
    type: Boolean,
    default: false // 默认为false，直接挂载在机构上
  },
  shareServer: {
    type: String // 分享平台
  }
}, { timestamps: true })

mongoose.model('OrgRes', OrgResSchema)
