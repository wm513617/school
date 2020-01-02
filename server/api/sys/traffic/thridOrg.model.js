/*
 * 机构模型
 * @Author: chenkaibo
 * @Date: 2018-06-06 14:50:44
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-08-27 18:17:00
 */

'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var OrgSchema = new Schema(
  {
    // 节点或组织名称
    name: {
      type: String
    },
    // 父组织id
    pid: {
      type: String
    },
    // 组织id
    id: {
      type: String
    },
    // 是否根节点
    isroot: {
      type: Boolean,
      default: false
    },
    // 组织分类
    type: {
      type: String
    },
    // 所属
    origin: String
  },
  { timestamps: true }
)

mongoose.model('ThirdPartyOrg', OrgSchema)
