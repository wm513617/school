/*
 * @Author: hansen.liuhao
 * @Date: 2019-07-25 17:17:45
 * @Last Modified by: hansen.liuhao
 * @Last Modified time: 2019-07-29 14:02:51
 * @description: 对讲终端模型
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const terminalSchema = new Schema(
  {
    // 名称
    name: {
      type: String,
      required: [true, '名称必输'],
      maxlength: [64, '名称最大64个字符']
    },
    // 对讲ID号
    serise: {
      type: String,
      required: [true, '对讲ID号必输'],
      maxlength: [8, '最大8个字符'],
      default: 0
    },
    // 对讲IP地址
    ip: {
      type: String,
      required: [true, 'ip必输'],
      default: '0.0.0.0'
    },
    // 设备类型terminal/microphone
    type: String,
    // 主镜头是否录像
    record: {
      type: Boolean,
      default: true
    },
    // 关联镜头
    camera: [
      {
        index: Number,
        resource: {
          type: Schema.Types.ObjectId,
          ref: 'Resource'
        }
      }
    ],
    // 使用的镜头数目
    length: {
      type: Number
    }
  },
  { timestamps: true }
)

mongoose.model('IntercomTerminal', terminalSchema)
